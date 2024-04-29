# Sección 18. Redux
## Temas
1. Redux
2. Store
3. Middlewares
4. Dispatch
5. Actions
6. State
7. Acciones asíncronas
8. RTK Query
9. Redux Toolkit
10. Slices

## 1. Redux
- Es un patrón que se basa en crar nuevos estados basado en reducers.
- Contenedor predecible del estado de nuestra aplicación.
    - Permite controlar en dónde se encuentra la info de la app en todo momento, y ayuda a que la modificación de la app sea en una sola vía de forma predecible.

### Store
- Fuente única de la verdad.
- Acá se encuenta la info que los componentes van a consumir.

### Reducer
- Función pura.
- Recibe acciones para determinar cómo actualizar el estado.
- En Redux, las acciones caen en el dispatcher, el cual al analizar la acción la envía a un reducer especial.
    - Este reducer es una combinación de todos los reducer que tiene la app.
- El proceso debe ser síncrono.
    - Se deben implementar middlewares para procesos asíncronos.

<img src='Images\18-Redux.png'></img>

### React Redux
- Era la forma tradicional de trabajar con Redux en React.
- Requiere de mucho boilerplate para poder trabajar con Redux.

### Redux Toolkit
- Permite aplicar Redux a React de forma más sencilla.

## 2. ConfigureStore y Slices
1. src -> store -> store.js

``` js
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {},
});
```

2. Envolver a main con el Provider de react-redux.

``` js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import './index.css'
import { store } from './store/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

```

### Slices
- Permiten crer reducers, colocarlses nombre y su valor inicial.

1. src -> store -> slices -> counter -> counterSlice.js

``` js
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
      counter: 10,
      times: 0
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.counter += 1;
    },
    incrementBy: ( state, action ) => {
      console.log(action);
      state.counter += action.payload;
    },
    decrement: ( state ) => {
      state.counter -= 1;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementBy } = counterSlice.actions;
```

- counterSlice tiene en su cuerpo la propiedad de actions, las cuales corresponden con el nombre dado a los reducuer. Es lo mismo que cuando se trabajó con types en la sección anterior, solo que Redux ya lo trae.

2. Usar reducer en la store.

``` js
import { configureStore } from '@reduxjs/toolkit';
import { counterSlice } from './slices/counter';

export const store = configureStore({
  reducer: {
      counter: counterSlice.reducer,
  }
})
```

## 3. Usar valores del store y despachar acciones
- En JS se usan los siguientes hooks de react-redux:
  - useSelector
  - useDispatch
- Se usa n este momento en App.
  - Se aprecia que también se importan las acciones definidas en el slice para usarlas en el componente.
  - Las acciones se pasan como callback a dispatch. No se pasa la referencia, sino que sí se invoca la función (accion) en el argumento de dispatch.

``` js
import { useDispatch, useSelector } from 'react-redux';

import logo from './logo.svg'
import './App.css'
import { increment, decrement, incrementBy } from './store/slices/counter';

function App() {

  const { counter } = useSelector( state => state.counter )
  const dispatch = useDispatch(); 
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>count is: { counter }</p>
        <p>
          <button type="button" onClick={ () => dispatch( increment() ) }>
            Increment
          </button>
          <button type="button" onClick={ () => dispatch( decrement() ) }>
            Decrement
          </button>
          <button type="button" onClick={ () => dispatch( incrementBy(2) ) }>
            Increment by 2
          </button>
        </p>
        
      </header>
    </div>
  )
}

export default App
```

## 4. Código Asíncrono

### pokemonSlice

``` js
import { createSlice } from '@reduxjs/toolkit';

export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        page: 0,
        pokemons: [],
        isLoading: false,
    },
    reducers: {
        startLoadingPokemons: (state, /* action */ ) => {
            state.isLoading = true;
        },
        setPokemons: ( state, action ) => {
            state.isLoading = false;
            state.page = action.payload.page;
            state.pokemons = action.payload.pokemons;
        }
    }
});


// Action creators are generated for each case reducer function
export const { startLoadingPokemons, setPokemons } = pokemonSlice.actions;
```

2. Colocar slice en store.

``` js
import { configureStore } from '@reduxjs/toolkit';
import { counterSlice } from './slices/counter';
import { pokemonSlice } from './slices/pokemon';

export const store = configureStore({
  reducer: {
      counter: counterSlice.reducer,
      pokemons: pokemonSlice.reducer,
  }
})
```

### Thunks
- Se le puede ver como una acción asíncrona que dispara otra acción cuando resuelve la tarea asíncrona.
- Se utiliza en este caso para una petición http.
- Retorna una función asíncrona, la cual tiene acceso a dispatch y getSate
  - Esta función va a ser llamada por dispatch de redux.

``` js
import { pokemonApi } from '../../../api/pokemonApi';
import { setPokemons, startLoadingPokemons } from './pokemonSlice';



export const getPokemons = ( page = 0 ) => {
    return async( dispatch, getState ) => {
        dispatch( startLoadingPokemons() );

        const { data } = await pokemonApi.get(`/pokemon?limit=10&offset=${ page * 10 }`);

        dispatch( setPokemons({ pokemons: data.results, page: page + 1 }) );
    }
}
```

2. Llamar función en lugar deseado, siendo en este caso en PokemonApp.jsx

``` js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemons } from './store/slices/pokemon';


export const PokemonApp = () => {

  const dispatch = useDispatch();
  const { isLoading, pokemons = [], page } = useSelector( state => state.pokemons );


  useEffect(() => {
    dispatch( getPokemons() );    
  }, [])
  

  return (
    <>
        <h1>PokemonApp</h1>
        <hr />
        <span>Loading: { isLoading ? 'True': 'False' }</span>

        <ul>
          {
            pokemons.map( ({ name }) => (
              <li key={ name }>{ name }</li>
            ))
          }
        </ul>

        <button
          disabled={ isLoading }
          onClick={ () => dispatch( getPokemons(page) ) }
        >
          Next
        </button>
    </>
  )
}

```

### Petición con Axios
- Se usa en este caso en lugar de fetch.
1. src -> api -> pokemonApi.js
  - Se crea una instancia para tener una configuración estandar.

``` js
import axios from 'axios';


export const pokemonApi = axios.create({
    baseURL: 'https://pokeapi.co/api/v2'
});
```

## 5. RTK Query
- Se puede integrar con Redux.
  - Ya viene con redux toolkit.
- No es reemplazo de axios o fetch, se diferencia en que evitar hacer posteos o peticiones si ya se encuentra almacenada en el caché la petición.

- Se crea una app de todo.

1. store -> apis -> todosApi.js
  - En un callback se coloca el baseUrl.
  - En un callback se colocan los endpoints.
  - createApi crea customHooks, los cuales son los que se exportan.
    - Le concatena use al principio a cada endpoint creado.
    - Se le coloca query al final para indicar que es un get, para otros métodos http se usan otras palabras.

``` js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const todosApi = createApi({

    reducerPath: 'todos',

    baseQuery: fetchBaseQuery({
        baseUrl: 'https://jsonplaceholder.typicode.com'
    }),

    endpoints: (builder) => ({

        getTodos: builder.query({
            query: () => '/todos'
        }),

        getTodo: builder.query({
            query: (todoId) => `/todos/${ todoId }`
        }),

    })

})

export const { useGetTodosQuery, useGetTodoQuery, } = todosApi;


```

### Consumit API mediante custom hook
- Especificar en store el RKT creado, el cual es un middleware.
  - Se especifica el middleware, el cual se dispara con getDefaultMiddleware. Se le concatena todosApi.middleware
  - Un middleware es una función que se ejecuta antes que otra.

``` js
import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from './apis';
import { counterSlice } from './slices/counter';
import { pokemonSlice } from './slices/pokemon';

export const store = configureStore({
  reducer: {
      counter: counterSlice.reducer,
      pokemons: pokemonSlice.reducer,

      [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat( todosApi.middleware )
})
```

- Lo siguiente es el espacio en donde se colocan los resultados producto de los queries que se van a estar haciendo.
  - Se usan las llaves [] para indicar que es una llave computada.
``` js
[todosApi.reducerPath]: todosApi.reducer,
```

- Usar en TodoApp

<img src='Images\18-RTK.png'></img>

``` js
import { useState } from 'react';
import { useGetTodosQuery, useGetTodoQuery } from './store/apis/todosApi';


export const TodoApp = () => {

    const [ todoId, setTodoId] = useState(1);
    // const { data: todos = [], isLoading } = useGetTodosQuery();
    const { data: todo, isLoading } = useGetTodoQuery( todoId );

    const nextTodo = () => {
        setTodoId( todoId + 1 );
    }

    const prevTodo = () => {
        if ( todoId === 1 ) return;
        setTodoId( todoId - 1 );
    }


    return (
        <>
            <h1>Todos - RTK Query</h1>
            <hr />
            <h4>isLoading: { isLoading ? 'True': 'False' } </h4>

            <pre>{ JSON.stringify( todo ) }</pre>



            <button onClick={ prevTodo }>
                Prev Todo
            </button>
            <button onClick={ nextTodo }>
                Next Todo
            </button>
{/* 
            <ul>
                { todos.map( todo => (
                    <li key={ todo.id }>
                        <strong> { todo.completed ? 'DONE' : 'Pending' } </strong> 
                        { todo.title }
                    </li>
                ) ) }
            </ul> */}



        </>
    )
}

```

- Al empezar a hacer peticiones en donde se le pasa un ID, se aprecia que en la devtools de reduz se tiene en caché la petición.
  - Por defecto dura un minuto la información en el caché.

<img src='Images\18-RTK-cache.png'></img>