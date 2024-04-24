# Sección 09. Hooks - Generales
## Temas
1. Profundizar en el tema de los Hooks
2. Crear otros customHooks
3. useState
4. useCounter - Personalizado
5. useEffect y sus precauciones
6. useRef
7. useFetch - Personalizado + optimizaciones
8. useLayoutEffect
9. Memo
10. useMemo
11. useCallback

## 1. useState 
- Si el estado es un objeto entonces se puede destructurar directamente al definir el state.
    - Se preferiría hacer la destructuración en otra línea de código para poder usar el spread al momento de actualizar el estado.

```js 
    const [state, setCounter] = useState({
        counter1: 10,
        counter2: 20,
        counter3: 30,
    })

    const { counter1, counter2, counter3 } = state;

```

## 2. useCounter - CustomHook
- Usualmente un custom hook está amarrado a otro hook de react, tal como useState.
1. src -> hooks -> useCounter.js

``` js
import { useState } from "react"


export const useCounter = ( initialValue = 10 ) => {

    const [ counter, setCounter ] = useState( initialValue )

    const increment = ( value = 1 ) => {
        setCounter( counter + value );
    }

    const decrement = ( value = 1 ) => {
        // if ( counter === 0 ) return;

        setCounter( counter - value );
    }

    const reset = () => {
        setCounter( initialValue );
    }

    return {
        counter,
        increment,
        decrement,
        reset,
    }

}
```

2. Usar useCounter.
    - Ya que los metodos esperan un argumento no se puede pasar solo la función como referencia a los elementos jsx, ya que le estarían pasando como argumento el event. Entonces, no importa que en el método se define un valor por defecto si no se recibe un argumento, se tiene que pasar el método con una función anónima.
``` js
import { useCounter } from '../hooks/useCounter';

export const CounterWithCustomHook = () => {
    
    const { counter, increment, decrement, reset } = useCounter();


    return (
        <>
            <h1>Counter with Hook: { counter }</h1>
            <hr />

            <button onClick={ () => increment(2) } className="btn btn-primary">+1</button>
            <button onClick={ reset } className="btn btn-primary">Reset</button>
            <button onClick={ () => decrement(2) } className="btn btn-primary">-1</button>
        
        </>
    )
}
```

## 3. useEffect - SimpleForm
- Por otro lado, si se desea ocupar el valor de una variable, en donde este valor es el nombre de la propiedad deseada de un objeto para modificar, entonces se usa [] para envolver a la variable que contiene dicho valor. Esto es lo que se hace en la función onInputChange al actualizar el estado.
    - Es posible tener varios useEffect para que cada uno se encargue de una sola tarea.

``` js
import { useEffect, useState } from 'react';
import { Message } from './Message';


export const SimpleForm = () => {

    const [formState, setFormState] = useState({
        username: 'strider',
        email: 'fernando@google.com'
    });

    const { username, email } = formState;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }


    useEffect( () => {
        // console.log('useEffect called!');
    }, []);
    
    useEffect( () => {
        // console.log('formState changed!');
    }, [formState]);

    useEffect( () => {
        // console.log('email changed!');
    }, [ email ]);

    

    return (
        <>
            <h1>Formulario Simple</h1> 
            <hr />

            <input 
                type="text" 
                className="form-control"
                placeholder="Username"
                name="username"
                value={ username }
                onChange={ onInputChange }
            />

            <input 
                type="email" 
                className="form-control mt-2"
                placeholder="fernando@google.com"
                name="email"
                value={ email }
                onChange={ onInputChange }
            />


            {
                (username === 'strider2' ) && <Message />
            }

        </>
    )
}
```

### Cleanup de useEffect
1. Message.jsx
    - Se aprecia que los listeners se colocan dentro del useEffect, así como su limpieza.
``` js
import { useEffect, useState } from "react"

export const Message = () => {
    
    const [coords, setCoords] = useState({ x: 0, y: 0});

    useEffect(() => {
        
        const onMouseMove = ({ x, y }) => {
            // const coords = { x, y };
            setCoords({ x, y })
        }

        window.addEventListener( 'mousemove', onMouseMove );
        
      return () => {
        window.removeEventListener( 'mousemove', onMouseMove );
      }
    }, []);
    


  return (
    <>
        <h3>Usuario ya existe</h3>
        { JSON.stringify( coords ) }
    </>
  )
}
```

### CustomHook

- Custom Hook. useForm.js
    - La lógica de hooks de react que antes se tenían en el archivo del form ahora se envuelven en un custom hook.

- Al momento de retornar se destructura el formState para poder hacer la destructuración inmediatamente al momento de llamar el custom hook en otros lugares.

``` js
import { useState } from 'react';

export const useForm = ( initialForm = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
    }
}
```

- Componente
    - ya que se destructuró formState en el useForm se puede obtener los cambpos del form directamente al colocar useForm.
``` js
import { useEffect } from 'react';
import { useForm } from '../hooks/useForm';


export const FormWithCustomHook = () => {

    const { formState, onInputChange, onResetForm, username, email, password } = useForm({
        username: '',
        email: '',
        password: ''
    });

    // const { username, email, password } = formState;
  

    return (
        <>
            <h1>Formulario con custom Hook</h1> 
            <hr />

            <input 
                type="text" 
                className="form-control"
                placeholder="Username"
                name="username"
                value={ username }
                onChange={ onInputChange }
            />

            <input 
                type="email" 
                className="form-control mt-2"
                placeholder="fernando@google.com"
                name="email"
                value={ email }
                onChange={ onInputChange }
            />

            <input 
                type="password" 
                className="form-control mt-2"
                placeholder="Contraseña"
                name="password"
                value={ password }
                onChange={ onInputChange }
            />


            <button onClick={ onResetForm } className="btn btn-primary mt-2">Borrar</button>

        </>
    )
}
```

## 4. useFetch - CustomHook
- https://tanstack.com/query/latest
    - Esta librería ya gestiona todo lo que caché.
    - https://fernando-herrera.com/course/react-query/
- En este custom hook se define una variable para almacenar los datos que el url va entregando con los parámetros dados, lo cual permite tenerlo en caché y no tener que llamar a la API de nuevo para data que ya se tiene.
``` js
import { useEffect, useState } from 'react';


const localCache = {};


export const useFetch = ( url ) => {
  
  const [state, setState] = useState({
    data: null ,
    isLoading: true,
    hasError: false,
    error: null,
  });

  useEffect(() => {
    getFetch();

  }, [url]);

  const setLoadingState = () => {
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null,
    });
  }


  const getFetch = async() => {

    if ( localCache[url] ) {
      console.log('Usando caché');
      setState({
        data: localCache[url],
        isLoading: false,
        hasError: false,
        error: null,
      });
      return;
    }



    setLoadingState();

    const resp = await fetch(url);

    // sleep
    await new Promise( resolve => setTimeout(resolve, 1500) );

    if ( !resp.ok ) {
      setState({
        data:null,
        isLoading: false,
        hasError: true,
        error: {
          code: resp.status,
          message: resp.statusText,
        }
      });
      return;
    }
  
    const data = await resp.json();
    setState({
      data: data,
      isLoading: false,
      hasError: false,
      error: null,
    })

    // Manejo del caché
    localCache[url] = data;

  }
  
  


  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
  }

}
```

- Uso de custom hook
    - Este archivo va a trabajar con dos Hooks. useFetch y useCounter
``` js
import React from 'react';
import { useCounter, useFetch } from '../hooks';
import { LoadingMessage } from './LoadingMessage';
import { PokemonCard } from './PokemonCard';


export const MultipleCustomHooks = () => {

  const { counter, decrement, increment } = useCounter(1);
  const { data, hasError, isLoading } = useFetch(`https://pokeapi.co/api/v2/pokemon/${ counter }`);


  return (
    <>
      <h1>Información de Pokémon</h1>
      <hr />

      { 
        isLoading 
        ? <LoadingMessage /> 
        : (
          <PokemonCard 
            id={ counter } 
            name={ data.name } 
            sprites={ [
              data.sprites.front_default,
              data.sprites.front_shiny,
              data.sprites.back_default,
              data.sprites.back_shiny,
            ] }
          />
        )
    }

      


      <button
        className="btn btn-primary mt-2"
        onClick={ () => counter > 1 ? decrement() : null }
      >
        Anterior
      </button>
      <button
        className="btn btn-primary mt-2"
        onClick={ () => increment() }
      >
        Siguiente
      </button>

    </>
  )
}
```

## 5. useRef - Primer uso
- Se caracteríza porque no dispara renderizaciones cuando hay un cambio.
    - En este ejemplo se le coloca focus al input al presionar un botón.
    - Permite no tener que usar document.querySelector
    - Permite guardar una referencia,y cuando cambia la referencia no se dispara una renderización.
        - No se limita solo referencias a elementos html.

``` js
import { useRef } from 'react';

export const FocusScreen = () => {

    const inputRef = useRef();

    const onClick = () => {
        // document.querySelector('input').select();
        // console.log(inputRef);
        inputRef.current.select();
    }


  return (
    <>
        <h1>Focus Screen</h1>
        <hr />

        <input 
            ref={ inputRef }
            type="text" 
            placeholder="Ingrese su nombre"
            className="form-control"
        />

        <button 
            className="btn btn-primary mt-2"
            onClick={ onClick }
        >
            Set focus
        </button>

    </>
  )
}
```

## 6. useLayoutEffect
https://es.react.dev/reference/react/useLayoutEffect

- useLayoutEffect es una versión de useEffect que se acciona antes que el navegador vuelva a pintar la pantalla.
    - Un posible uso es obtener el tamaño de un contenedor.

``` js
useLayoutEffect(setup, dependencies?)
```

- Ejemplo
    - La API retorna frases, las cuales a veces son más grandes. El Componente quote siempre tiene el tamaño fijo.

- Componente Quote:

``` js
import { useLayoutEffect, useRef, useState } from 'react';


export const Quote = ({ author, quote }) => {

  const pRef = useRef();
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    
    const { height, width } =  pRef.current.getBoundingClientRect();
    setBoxSize({ height, width });
    
  }, [quote])
  


  return (
    <>
      <blockquote 
        className="blockquote text-end"
        style={{ display: 'flex' }}
      >
          <p ref={ pRef } className="mb-1">{ quote }</p>
          <footer className="blockquote-footer"> { author } </footer>
      </blockquote>

      <code>{ JSON.stringify(boxSize) }</code>
    </>
  )
}
```

- Componente Layout.jsx

``` js
import { useCounter, useFetch } from '../hooks';
import { LoadingQuote, Quote } from '../03-examples';


export const Layout = () => {

    const { counter, increment } = useCounter(1);
    const { data, isLoading, hasError } = useFetch(`https://www.breakingbadapi.com/api/quotes/${ counter }`);
    const { author, quote } = !!data && data[0];
    
    return (
        <>
            <h1>BreakingBad Quotes</h1>
            <hr />

            {
                isLoading
                 ? <LoadingQuote />
                 : <Quote author={ author } quote={ quote } />
            }
                      
            <button 
                className="btn btn-primary"
                disabled={ isLoading }
                onClick={ () => increment() }>
                Next quote
            </button>

        </>
    )
}
```

## 7. Método de react - Memo

- El propósito es no tener que redibujar si no hace falta. Cuando el padre se redibuja entonces todos los hijos también.
    - Small debe redibujarse cada que cambia el contador, pero no debería hacerlo con otro cambio de estado que no tiene nada que ver con el componente de small.
    - Se usa memo cuando se considera que un redibujo puede ser un trabajo considerable, pero fuera de eso en este ejercicio no habría problema.
- Memo recibe el compomente como argumento, como es el caso con small.
    - Solo cuando las properties del componente cambia se redibuja.

__small.jsx__

``` js
import React from 'react';
// import { memo } from 'react';

export const Small = React.memo(({ value }) => {

    console.log(' Me volví a dibujar :( ');

    return (
        <small>{ value }</small>
    )
})
```

__memorize.jsx__

``` js
import { useState } from 'react';
import { useCounter } from '../hooks'
import { Small } from './Small';

export const Memorize = () => {

    const { counter, increment } = useCounter( 10 );
    const [ show, setShow ] = useState(true)

    return (
        <>
            <h1>Counter: <Small value={ counter } />  </h1>
            <hr />

            <button
                className="btn btn-primary"
                onClick={ () => increment() }
            >
                +1
            </button>

            <button
                className="btn btn-outline-primary"
                onClick={ () => setShow( !show )  }
            >
                Show/Hide { JSON.stringify(show) } 
            </button>
        
        </>
    )
}
```

## 8. useMemo
- Se usa para no tener que recalcular procesos si es que no se colocan nuevas variables.
    - Entonces, un proceso pesado no tendría que volverse a correr si el componente se redibuja si las variables empleadas para ese proceso no fueron las que cambiaron.
- Argumentos:
    - Callback que ejecuta la función deseada a memoize.
    - Arreglo de dependencias.

__MemoHook.jsx__

``` js
import { useMemo, useState } from 'react';
import { useCounter } from '../hooks';


const heavyStuff = ( iterationNumber = 100 ) => {
    for( let i = 0; i < iterationNumber; i++ ) {
        console.log('Ahí vamos...');
    }

    return `${ iterationNumber } iteraciones realizadas`;
}



export const MemoHook = () => {

    const { counter, increment } = useCounter( 4000 );
    const [ show, setShow ] = useState(true);

    const memorizedValue = useMemo( () => heavyStuff(counter), [counter])

    return (
        <>
            <h1>Counter: <small>{ counter }</small>  </h1>
            <hr />

            <h4>{ memorizedValue }</h4>


            <button
                className="btn btn-primary"
                onClick={ () => increment() }
            >
                +1
            </button>

            <button
                className="btn btn-outline-primary"
                onClick={ () => setShow( !show )  }
            >
                Show/Hide { JSON.stringify(show) } 
            </button>
        
        </>
    )
}
```

## 9. useCallback
- El componente ShowIncrement se vuelve a renderizar cada que el padre se vuelve a dibujar.
    - No sirve envolverlo con React.memo, ya que está recibiendo una función como prop. Entonces, ya que el componente padre se vuleve a dibujar cada vez la función definida en el padre ocupa un nuevo espacio en memoria, por lo que la prop siempre va siendo diferente.
- En el padre CallbackHook se define el useCallback para envolver a la función que se va a pasar como prop al hijo.
    - Es similar a useMemo, solo que para funciones.
    - La función memorized solo se renderiza de nuevo cuando algo cambia en el arreglo de dependencias.
    - Al usar una función set dentro del callback se le debe pasar una callback para que se pueda actualziar el estado, ya que si se deja value + 1 entonces no servirá ya que value yambién queda memorized.

__ShowIncrement.jsx__

``` tsx
import React from 'react';


export const ShowIncrement = React.memo( ({ increment }) => {

    console.log(' Me volví a generar :( ');

    return (
        <button
            className="btn btn-primary"
            onClick={() => {
                increment( 5 );
            }}
        >
            Incrementar
        </button>
    )
})
```

__CallbackHook.jsx__
``` tsx
import { useCallback, useEffect, useState } from 'react';
import { ShowIncrement } from './ShowIncrement';


export const CallbackHook = () => {

    const [counter, setCounter] = useState( 10 );

    const incrementFather = useCallback(
      (value) => {
        setCounter( (c) => c + value );
      },
      [],
    );

    useEffect(() => {
      // incrementFather();
    }, [incrementFather])
    
    
    // const incrementFather = () => {
    //     setCounter( counter + 1);
    // }


    return (
        <>
            <h1>useCallback Hook: { counter } </h1>
            <hr />

            <ShowIncrement increment={ incrementFather } />
        </>
    )
}
```

# Sección 10 - Profundizando Hooks - useReducer
- Se prefiere sobre useEffect cuando hay muchas acciones que pueden modificar el state.
- La idea es tener concentrado en un solo lugar todas las acciones que modifican el estado.
- Esto permite a que la información fluya en una sola vía y controlada.

## Temas
1. useReducer
2. Reducers
3. Teoría de un reducer
4. Aplicación de TODOs
5. CRUD local

## Reducer
- Función común y corriente.
    - No puede ser asíncrona.
- Debe ser una función pura.
    1. No debe tener efectos secundarios.
        - Debe poder resolver todo internamente sin tener que llamar a otras funciones.
    2. Se debe ejecutar de forma síncrona.
    3. Debe retornar siempre un nuevo estado.
    4. No debe llamar a localStorage o sessionStorage, ya que su llamada se considera efecto secundario. Estas funciones pueden fallar, lo cual no dejaría poder regresar un nuevo state.
    5. No debe de requerir más que una acción que puede tener un argumento.
- Debe retornar un nuevo estado.
- Usualmente recibe dos argumentos:
    - Valor inicial (initialState)
    - Acción a ejecutar.

### Ciclo de vida.
1. Inicia con los que se pase como initialState.
2. Se renderiza en la página o vista.
3. Se ejecuta una acción para poder actualizar el estado.

## 1. Estructura general

``` js
const initialState = [{
    id: 1,
    todo: 'Cui',
    done: false,
}]

const todoReducer = ( state= initialState, action = {} ) => {
    if(action.type === 'add todo') {
        return [...state, action.payload]
    }
    return state,
}

let todos = todoReducer();

const newTodo = {
    id:2,
    todo: 'Cui 2',
    done: false
}

const addTodoAction = {
    type: 'add todo',
    payload: newTodo
}

todos = todoReducer(todos, addTodoAction)
```

## 2. useReducer
- dispatch es la función que se manda a llamar para ejecutar acciones.

``` js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

- Se crea un custom hook para centralizar las acciones del reducer.

1. Archivo todoReducer.js
``` ts
// { type: [todo remove], payload: id }

export const todoReducer = ( initialState = [], action ) => {


    switch ( action.type ) {
        case '[TODO] Add Todo':
            return [ ...initialState, action.payload ];

        case '[TODO] Remove Todo':
            return initialState.filter( todo => todo.id !== action.payload );

        case '[TODO] Toggle Todo':
            return initialState.map( todo => {

                if ( todo.id === action.payload ) {// id
                    return {
                        ...todo,
                        done: !todo.done
                    }
                } 

                return todo;
            });
    
        default:
            return initialState;
    }


}
```

2. Archivo TodoAdd.jsx

``` js
import { useForm } from '../hooks/useForm';


export const TodoAdd = ({ onNewTodo }) => {

    const { description, onInputChange, onResetForm } = useForm({
        description: ''
    });

    const onFormSubmit = ( event ) => {
        event.preventDefault();
        if ( description.length <= 1 ) return;

        const newTodo = {
            id: new Date().getTime(),
            done: false,
            description: description,
        }

        onNewTodo(newTodo);
        onResetForm();
    }


    return (
        <form onSubmit={ onFormSubmit }>
            <input 
                type="text" 
                placeholder="¿Qué hay que hacer?"
                className="form-control"
                name="description"
                value={ description }
                onChange={ onInputChange }
            />

            <button 
                type="submit"
                className="btn btn-outline-primary mt-1"
            >
                Agregar
            </button>
        </form>
    )
}
``` 

3. Archivo TodoItem.jsx

``` js

export const TodoItem = ({ todo, onDeleteTodo, onToggleTodo }) => {
  return (
    <li className="list-group-item d-flex justify-content-between">
        <span 
          className={`align-self-center ${ (todo.done) ? 'text-decoration-line-through' : '' }`}
          onClick={ () => onToggleTodo( todo.id ) }
        >
          { todo.description }
        </span>
        <button 
          className="btn btn-danger"
          onClick={ () => onDeleteTodo( todo.id ) }
        >Borrar</button>
    </li>
  )
}
``` 

4. Archivo TodoList.jsx

``` js
import { TodoItem } from "./TodoItem"


export const TodoList = ({ todos = [], onDeleteTodo, onToggleTodo }) => {
  
  return (
    <ul className="list-group">
        {
            todos.map( todo => (
                <TodoItem 
                  key={ todo.id } 
                  todo={ todo } 
                  onDeleteTodo={ onDeleteTodo } 
                  onToggleTodo={ onToggleTodo }
                />
            ))
        }
    </ul>
  )
}
``` 

5. Custom Hook useTodos.

``` js
import { useEffect, useReducer } from 'react';
import { todoReducer } from '../08-useReducer/todoReducer';

const init = () => {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

export const useTodos = () => {
  
    const [ todos, dispatch ] = useReducer( todoReducer, [], init );

    useEffect(() => {
      localStorage.setItem('todos', JSON.stringify( todos ) );
    }, [todos])
    

    const handleNewTodo = ( todo ) => {
        const action = {
            type: '[TODO] Add Todo',
            payload: todo
        }

        dispatch( action );
    }

    const handleDeleteTodo = ( id ) => {
        dispatch({
            type: '[TODO] Remove Todo',
            payload: id
        });
    }

    const handleToggleTodo = ( id ) => {
        dispatch({
            type: '[TODO] Toggle Todo',
            payload: id
        });
    }

    return {
        todos,

        todosCount: todos.length,
        pendingTodosCount: todos.filter(todo=> !todo.done).length,

        handleNewTodo,
        handleDeleteTodo,
        handleToggleTodo,
    }

}
```

6. Archivo TodoApp.jsx

``` js
import { useTodos } from '../hooks';
import { TodoAdd } from './TodoAdd';
import { TodoList } from './TodoList';


export const TodoApp = () => {

    const { todos, todosCount, pendingTodosCount, handleDeleteTodo, handleToggleTodo, handleNewTodo } = useTodos();
    
    return (
        <>
            <h1>TodoApp: { todosCount }, <small>pendientes: { pendingTodosCount }</small> </h1>
            <hr />

            <div className="row">
                <div className="col-7">
                    <TodoList
                        todos={ todos } 
                        onDeleteTodo={ handleDeleteTodo } 
                        onToggleTodo={ handleToggleTodo }
                    />
                </div>

                <div className="col-5">
                    <h4>Agregar TODO</h4>
                    <hr />
                    <TodoAdd 
                        onNewTodo={ handleNewTodo }  
                    />
                </div>

            </div>


        
        </>
    )
}
```

# Sección 11. Use Context
## Temas
1. Context
2. Provider
3. useContext
4. React Router
5. Links y NavLinks
6. CreateContext
7. SPA ( Single Page Application )

## 1. Router
https://reactrouter.com/en/main/start/tutorial

1. Instalar al menos react-router-dom
``` bash
npm install react-router-dom #localforage match-sorter sort-by
```

2. Envolver main con BrowserRouter.
    - BrowserRouter se conoce como un componente de nivel superior. Eso significa que recibe componentes dentro de él.

``` jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
      <MainApp />
    {/* </React.StrictMode> */}
  </BrowserRouter>
)
```

3. Configurar Router
    - Se definen en un componente en las capas superiores. En este caso se desea que MainApp siempre esté en la pantalla, por lo que las rutas se definen ahí.
    - En la ruta se puede definir un /* para atrapar todas las rutas que no estén definidas.

__09-useContext/MainApp.jsx__

``` jsx
import { Navigate, Route, Routes, Link } from 'react-router-dom';

import { UserProvider } from './context/UserProvider';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { LoginPage } from './LoginPage';
import { Navbar } from './Navbar';


export const MainApp = () => {
  return (
    <UserProvider>
        {/* <h1>MainApp</h1> */}
        {/* <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link> */}
        <Navbar />
        <hr />


        <Routes>
          <Route path="/" element={ <HomePage /> } />
          <Route path="about" element={ <AboutPage /> } />
          <Route path="login" element={ <LoginPage /> } />

          {/* <Route path="/*" element={ <LoginPage /> } /> */}
          <Route path="/*" element={ <Navigate to="/about" /> } />

        </Routes>
    </UserProvider>
  )
}

```

### 1. Link
- Permite usar elementos para navear a otros lados.
    - No se podría usar <a>, ya que provoca un full refresh de la app.

### 2. NavLink
- Funciona igual que Link, solo que se le pueden asignar clases de CSS especiales según de la ubicación de la navegación.
    - Tiene la prop de isActive, la cual será falso o verdadero si coincide con la ruta actual.
    - Se obtiene de una función de flecha dentro de className.
__09-useContext/Navbar.jsx__

``` jsx
import { Link, NavLink } from 'react-router-dom';


export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-3">
        <div className="container-fluid">

            <Link className="navbar-brand" to="/">useContext</Link>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    
                    <NavLink 
                        className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                        to="/">
                        Home
                    </NavLink>


                    <NavLink 
                        className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                        to="/about">
                        About
                    </NavLink>

                    <NavLink 
                        className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                        to="/Login">
                        Login
                    </NavLink>
                </ul>
            </div>
        </div>
    </nav>
  )
}

```

## 2. useContext y ContextProvider
- Un contexto puede verse como la estructura de componentes de la aplicación.
- En las devtools de react al ver el árbol de componentes se aprecia que algunos componentes tienen la palabra **.Provider**, tal como Navigation y Location.
    - Esto indica que estos componentes están proveyendo información.

1. Crear carpeta context en el root de la aplicación correspondiente.
2. Crear UserContext.jsx
    - Un context va a ser un componente de alto nivel.

__UserContext.jsx__
``` jsx
import { createContext } from 'react';

export const UserContext = createContext();
```

3. Crear proveedor.
    - El proveedor va a ser el componente de nivel superior para envolver a los componentes que se desean tengan acceso al contexto.
    - En este caso se está pasando la función set del estado deseado, lo cual no es recomendable debido a que le entrega poder de más a los componentes.

__UserProvider.jsx__
``` jsx
import { useState } from "react"
import { UserContext } from "./UserContext"

// const user = {
//     id: 123,
//     name: 'Fernando Herrera',
//     email: 'fernando@google.com'
// }



export const UserProvider = ({ children }) => {

    const [user, setUser] = useState();

    return (
        // <UserContext.Provider value={{ hola: 'Mundo', user: user }}>
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    )
}
```

4. Colocar el provider en el punto a partir del cual sus hijos puedan empezar a ocuparlo.
    - En este caso se coloca en MainApp.jsx.

``` jsx
import { Navigate, Route, Routes, Link } from 'react-router-dom';

import { UserProvider } from './context/UserProvider';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { LoginPage } from './LoginPage';
import { Navbar } from './Navbar';


export const MainApp = () => {
  return (
    <UserProvider>
        {/* <h1>MainApp</h1> */}
        {/* <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link> */}
        <Navbar />
        <hr />


        <Routes>
          <Route path="/" element={ <HomePage /> } />
          <Route path="about" element={ <AboutPage /> } />
          <Route path="login" element={ <LoginPage /> } />

          {/* <Route path="/*" element={ <LoginPage /> } /> */}
          <Route path="/*" element={ <Navigate to="/about" /> } />

        </Routes>
    </UserProvider>
  )
}
```

### useContext
- Permite consumir la iformación del provider.
1. Se usa el hook useContext.
2. Se le pasa como argumento el contexto definido.
3. Se destructura la información.

__LoginPage.jsx__

``` jsx
import { useContext } from 'react';
import { UserContext } from './context/UserContext';


export const LoginPage = () => {

    const { user, setUser } = useContext( UserContext );
    
    return (
      <>
          <h1>LoginPage</h1>
          <hr />

          <pre aria-label="pre">
            { JSON.stringify( user, null, 3 ) }
          </pre>


          <button 
            className="btn btn-primary"
            onClick={ () => setUser({ id: 123, name: 'Juan', email: 'juan@google.com' })  }
          >
            Establecer usuario
          </button>

      </>
    )
  }
  
```

__HomePage.jsx__
``` jsx
import { useContext } from "react"
import { UserContext } from "./context/UserContext";


export const HomePage = () => {

  const { user } = useContext( UserContext );


    return (
      <>
          <h1>HomePage <small>{ user?.name }</small> </h1>
          <hr />

          <pre aria-label="pre">
            { JSON.stringify( user, null, 3 ) }
          </pre>
      </>
    )
  }
  
```

# Sección 12. Pruebas unitarias y de integración - Hooks
- No se evalúa el funcionamiento interno del hook, sino que se evalúan sus efectos. Si son custom hooks entonces sí deben evaluarse.
    - Por ejemplo: si un efecto de useEffect modifica una variable cuando algo sucede, entonces se dispara todo ese efecto, se modifica la variable, y posteriormente se evalúa el resultado del efecto.

## Temas
1. Pruebas sobre Hooks y CustomHooks

## 1. Pruebas sobre useCounter CustomHook.
- Se recuerda que para probar custom hooks se usa renderHook de @testing-library/react.
- Las pruebas no se ecentran en línea por línea del código, sino en los resultados de funciones (valores esperados).

- Custom Hook

``` js
import { useState } from "react"


export const useCounter = ( initialValue = 10 ) => {

    const [ counter, setCounter ] = useState( initialValue )

    const increment = ( value = 1 ) => {
        setCounter( (current) => current + value );
    }

    const decrement = ( value = 1 ) => {
        // if ( counter === 0 ) return;

        setCounter( (current) => current - value );
    }

    const reset = () => {
        setCounter( initialValue );
    }

    return {
        counter,
        increment,
        decrement,
        reset,
    }

}


```

- Prueba
    - Se hacen pruebas de:
        - Revisar que muestre valor por defecto.
        - Que muestre valor que se le pasa.
        - Que incremente.
            - En este caso se usa act de @testing-library/react para disparar el efecto de las funciones dadas en el callback que se pasa.
            - En testeo el código que casua que el estado de React se actualice debe envolverse en act().
            - Por otro lado, se aprecia que se evalúa result.current.counter y no counter directamente cuando se destructuró antes del act, ya que este no contiene el valor actualizado después de que act hiciera los cambios en el estado.
            - Se aprecia que en act se manda increment dos veces, sin embargo, si en el componente el state estuviera como setCounter(counter + value) entonces el resultado de increment() en conjunto con incremente(2) sería 102 si el valor que se le pasa es 100.
                - Esto sucede porque el último increment aún maneja el valor incial, y no contempla el cambio hecho por el increment anterior.
                - Entonces, se recomienda tener el state como setState( value => value + 1);
                - En otras palbras scedía porque en el set function se usaba directamente el valor del estado, pero mejor se coloca función de flecha para siempre tener el current.
``` ts
import { act, renderHook } from '@testing-library/react';
import { useCounter } from '../../src/hooks/useCounter';


describe('Pruebas en el useCounter', () => {
    
    test('debe de retornar los valores por defecto', () => {
        
        const { result } = renderHook( () => useCounter() );
        const { counter, decrement, increment, reset } = result.current;

        expect( counter ).toBe(10);
        expect( decrement ).toEqual( expect.any( Function ) );
        expect( increment ).toEqual( expect.any( Function ) );
        expect( reset ).toEqual( expect.any( Function ) );

    });

    test('debe de generar el counter con el valor de 100', () => {
        
        const { result } = renderHook( () => useCounter(100) );
        const { counter } = result.current;
        expect( counter ).toBe(100);
    });

    test('debe de incrementar el contador', () => {
        
        const { result } = renderHook( () => useCounter(100) );
        const { counter, increment } = result.current;

        act( () => {
            increment();
            increment(2);
        });

        expect( result.current.counter ).toBe(103);

    });

    test('debe de decrementar el contador', () => {
        
        const { result } = renderHook( () => useCounter(100) );
        const { counter, decrement } = result.current;

        act( () => {
            decrement();
            decrement(2);
        });

        expect( result.current.counter ).toBe(97);

    });

    test('debe de realizar el reset', () => {
        
        const { result } = renderHook( () => useCounter(100) );
        const { counter, decrement, reset } = result.current;

        act( () => {
            decrement();
            reset();
        });

        expect( result.current.counter ).toBe(100);

    });


});

```

## 2. Pruebas sobre useForm - Custom Hook

- Componente

``` ts
import { useState } from 'react';

export const useForm = ( initialForm = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
    }
}

```

- Test: 


``` ts
import { act, renderHook } from '@testing-library/react';
import { useForm } from '../../src/hooks/useForm';


describe('Pruebas en useForm', () => {

    const initialForm = {
        name: 'Fernando',
        email: 'fernando@google.com'
    }


    test('debe de regresar los valores por defecto', () => {
        
        const { result } = renderHook( () => useForm(initialForm)  );
        expect(result.current).toEqual({
            name: initialForm.name,
            email: initialForm.email,
            formState: initialForm,
            onInputChange: expect.any( Function ),
            onResetForm: expect.any( Function ),
        });

    });


    test('debe de cambiar el nombre del formulario', () => {

        const newValue = 'Juan';
        const { result } = renderHook( () => useForm(initialForm)  );
        const { onInputChange } = result.current;
        
        act(()=>{
            onInputChange({ target: { name: 'name', value: newValue } })
        });
                
        expect( result.current.name ).toBe( newValue );
        expect( result.current.formState.name ).toBe( newValue );

        
    });

    test('debe de realizar el reset del formulario', () => {

        const newValue = 'Juan';
        const { result } = renderHook( () => useForm(initialForm)  );
        const { onInputChange, onResetForm } = result.current;
        
        act(()=>{
            onInputChange({ target: { name: 'name', value: newValue } });
            onResetForm();
        });
                
        expect( result.current.name ).toBe( initialForm.name );
        expect( result.current.formState.name ).toBe( initialForm.name );

        
    });


    
});
```

## 3. Pruebas con múltiples hooks simultáneos

- Componente

``` ts


import { useCounter, useFetch } from '../hooks';
import { LoadingQuote, Quote } from './';


export const MultipleCustomHooks = () => {

    const { counter, increment } = useCounter(1);
    const { data, isLoading, hasError } = useFetch(`https://www.breakingbadapi.com/api/quotes/${ counter }`);
    const { author, quote } = !!data && data[0];
    
    return (
        <>
            <h1>BreakingBad Quotes</h1>
            <hr />

            {
                isLoading
                 ? <LoadingQuote />
                 : <Quote author={ author } quote={ quote } />
            }
                      
            <button 
                className="btn btn-primary"
                disabled={ isLoading }
                onClick={ () => increment() }>
                Next quote
            </button>

        </>
    )
}

```

- Test
    - Se crea mock para useCounter.
    - Se crea mock para useFetch.
        - A comparaicón de la prueba de useFetch de la sección anterior esta vez se hace un mock completo para simular sus valores de retorno.
        - Al hacer el mock completo se debe definir su mockReturnValue para definir los valores que retorna, de lo contrario la prueba da errores.
            - mockReturnValue se hace en los test suits correspondientes, ya que va variando según la prueba. Por esta razón no se coloca en un lugar general.
        - El mock para use counter se hace completo.
            - Se coloca mockReturnValue en un lugar general ya que este es el mismo para todas las test suits.
            - Se crea mockIncrement para simular que sea la función setter.
                - En otras palabras, se vuelve a simular los valores que reotrna el custom hook.

``` js
import { fireEvent, render, screen } from '@testing-library/react';
import { MultipleCustomHooks } from '../../src/03-examples';
import { useCounter } from '../../src/hooks/useCounter';
import { useFetch } from '../../src/hooks/useFetch';

jest.mock('../../src/hooks/useFetch');
jest.mock('../../src/hooks/useCounter');

describe('Pruebas en <MultipleCustomHooks />', () => {

    const mockIncrement = jest.fn();

    useCounter.mockReturnValue({
        counter: 1,
        increment: mockIncrement
    });

    beforeEach( () => {
        jest.clearAllMocks();
    });

// Es otra prueba válida además de usar Snapshot.
    test('debe de mostrar el componente por defecto', () => {

        // Se puede colcoar en un lugar general, pero como los valores son diferentes para cada prueba se define específicamente en cada test suit.
        useFetch.mockReturnValue({
            data: null,
            isLoading: true,
            hasError: null
        });

    
        render( <MultipleCustomHooks /> );

        expect( screen.getByText('Loading...') );
        expect( screen.getByText('BreakingBad Quotes') );

        const nextButton = screen.getByRole('button',{ name: 'Next quote' });
        // Si se colocaun name que es invalido Jest sugiere algunas opciones disponibles de name según el componente.
        expect(nextButton.disabled).toBeTruthy();
        // screen.debug();

    });

    test('debe de mostrar un Quote', () => {

        useFetch.mockReturnValue({
            data: [{ author: 'Fernando', quote: 'Hola Mundo' }],
            isLoading: false,
            hasError: null
        });
        
        render( <MultipleCustomHooks /> );
        expect( screen.getByText('Hola Mundo') ).toBeTruthy();
        expect( screen.getByText('Fernando') ).toBeTruthy();
        
        const nextButton = screen.getByRole('button',{ name: 'Next quote' });
        expect(nextButton.disabled).toBeFalsy();
    });


    test('debe de llamar la función de incrementar', () => {

    
        useFetch.mockReturnValue({
            data: [{ author: 'Fernando', quote: 'Hola Mundo' }],
            isLoading: false,
            hasError: null
        });

        
        render( <MultipleCustomHooks /> );
        const nextButton = screen.getByRole('button',{ name: 'Next quote' });
        fireEvent.click( nextButton );

        expect( mockIncrement ).toHaveBeenCalled();

    });

    
});
```

## 4. Pruebas sobre reducer

- __todoReducer.js__

``` ts
// { type: [todo remove], payload: id }

export const todoReducer = ( initialState = [], action ) => {


    switch ( action.type ) {
        case '[TODO] Add Todo':
            return [ ...initialState, action.payload ];

        case '[TODO] Remove Todo':
            return initialState.filter( todo => todo.id !== action.payload );

        case '[TODO] Toggle Todo':
            return initialState.map( todo => {

                if ( todo.id === action.payload ) {// id
                    return {
                        ...todo,
                        done: !todo.done
                    }
                } 

                return todo;
            });
    
        default:
            return initialState;
    }


}
```


- Pruebas
    1. Se prueban todas las acciones definidas en el reducer.
        - En todas las pruebas se ha evaluado el mismo objeto que se coloca como argumento o inicialización, ya que los objetos se pasan por referencia.

``` ts
import { todoReducer } from '../../src/08-useReducer/todoReducer';



describe('Pruebas en todoReducer', () => {
    
    const initialState = [{
        id: 1,
        description: 'Demo Todo',
        done: false,
    }];


    test('debe de regresar el estado inicial', () => {
        
        const newState = todoReducer( initialState, {});
        expect( newState ).toBe( initialState ); // El objeto se pasó por referencia, por lo que se puede usar toBe.

    });

    test('debe de agregar un todo', () => {

        const action = {
            type: '[TODO] Add Todo',
            payload: {
                id: 2,
                description: 'Nuevo todo #2',
                done: false
            }
        };

        const newState = todoReducer( initialState, action );
        expect( newState.length ).toBe( 2 );
        expect( newState ).toContain( action.payload ); // toContain ayuda a evaluar que un arrelo tenga un objeto determinado. Es parecido a toEqual ya que evalúa que el contenido del objeto sea el esperado y no se enfoca en el espacio en memoria.
        
    });

    test('debe de eliminar un TODO', () => {
        
        const action = {
            type: '[TODO] Remove Todo',
            payload: 1
        };

        const newState = todoReducer( initialState, action );
        expect( newState.length ).toBe( 0 );

    });

    test('debe de realizar el Toggle del todo ', () => {
        
        const action = {
            type: '[TODO] Toggle Todo',
            payload: 1
        };

        const newState = todoReducer( initialState, action );
        expect( newState[0].done ).toBe( true );
        
        const newState2 = todoReducer( newState, action );
        expect( newState2[0].done ).toBe( false );

    });


});
```

## 5. Pruebas en el componente TodoItem

- Componente

``` ts

export const TodoItem = ({ todo, onDeleteTodo, onToggleTodo }) => {
  return (
    <li className="list-group-item d-flex justify-content-between">
        <span 
          className={`align-self-center ${ (todo.done) ? 'text-decoration-line-through' : '' }`}
          onClick={ () => onToggleTodo( todo.id ) }
          aria-label="span"
        >
          { todo.description }
        </span>
        <button 
          className="btn btn-danger"
          onClick={ () => onDeleteTodo( todo.id ) }
        >Borrar</button>
    </li>
  )
}

```

- Tests
    - En este caso el componente recibe dos funciones como argumento, por lo que fácilmente se les puede crear mocks y evaluar que sean llamadas, asó como se les pase el valor deseado. Esto se debe a que son pruebas atómicas, y las funciones que se le pasan en una prueba atómica no se sabe cómo funcionan y se evaluarán en sus respectivos archivos.
    - eN TESTING SE TIENE EL FIXTURE para poder ir recreando data ficticia para no tener que ir recreandola en cada prueba.
        - Por ejemplo, en las pruebas anteriores también se definió el mismo todo, por lo que en cada archivo se está repitiendo esa variable de prueba.

``` js
import { fireEvent, render, screen } from '@testing-library/react';
import { TodoItem } from '../../src/08-useReducer/TodoItem';


describe('Pruebas en <TodoItem />', () => {
    
    const todo = {
        id: 1,
        description: 'Piedra del Alma',
        done: false
    };

    const onDeleteTodoMock = jest.fn();
    const onToggleTodoMock = jest.fn();

    beforeEach( () => jest.clearAllMocks() );


    test('debe de mostrar el Todo Pendiente de completar', () => {
        
        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const liElement = screen.getByRole('listitem');
        expect( liElement.className ).toBe('list-group-item d-flex justify-content-between')

        const spanElement = screen.getByLabelText('span'); // Se le colocó un aria-label al span deseado.
        expect( spanElement.className ).toContain('align-self-center'); // Al evaluar nombre de clases se recomienda usar toContian, ya que puede que con toBe evalúe también espacios que no interesan.
        expect( spanElement.className ).not.toContain('text-decoration-line-through');

    });


    test('debe de mostrar el Todo completado', () => {
        
        todo.done = true;

        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const spanElement = screen.getByLabelText('span');
        expect( spanElement.className ).toContain('text-decoration-line-through');

    });


    test('span debe de llamar el ToggleTodo cuando se hace click', () => {
        
        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const spanElement = screen.getByLabelText('span');
        fireEvent.click( spanElement );

        expect( onToggleTodoMock ).toHaveBeenCalledWith( todo.id );

    });

    test('button debe de llamar el deleteTodo', () => {
        
        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const deleteButton = screen.getByRole('button');
        fireEvent.click( deleteButton );

        expect( onDeleteTodoMock ).toHaveBeenCalledWith( todo.id );

    });



});


```

## 8. Pruebas en TodoApp

- Componente

``` js
import { fireEvent, render, screen } from '@testing-library/react';
import { TodoItem } from '../../src/08-useReducer/TodoItem';


describe('Pruebas en <TodoItem />', () => {
    
    const todo = {
        id: 1,
        description: 'Piedra del Alma',
        done: false
    };

    const onDeleteTodoMock = jest.fn();
    const onToggleTodoMock = jest.fn();

    beforeEach( () => jest.clearAllMocks() );


    test('debe de mostrar el Todo Pendiente de completar', () => {
        
        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const liElement = screen.getByRole('listitem');
        expect( liElement.className ).toBe('list-group-item d-flex justify-content-between')

        const spanElement = screen.getByLabelText('span');
        expect( spanElement.className ).toContain('align-self-center');
        expect( spanElement.className ).not.toContain('text-decoration-line-through');

    });


    test('debe de mostrar el Todo completado', () => {
        
        todo.done = true;

        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const spanElement = screen.getByLabelText('span');
        expect( spanElement.className ).toContain('text-decoration-line-through');

    });


    test('span debe de llamar el ToggleTodo cuando se hace click', () => {
        
        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const spanElement = screen.getByLabelText('span');
        fireEvent.click( spanElement );

        expect( onToggleTodoMock ).toHaveBeenCalledWith( todo.id );

    });

    test('button debe de llamar el deleteTodo', () => {
        
        render( 
            <TodoItem 
                todo={ todo } 
                onToggleTodo={ onToggleTodoMock } 
                onDeleteTodo={ onDeleteTodoMock } 
            /> 
        );

        const deleteButton = screen.getByRole('button');
        fireEvent.click( deleteButton );

        expect( onDeleteTodoMock ).toHaveBeenCalledWith( todo.id );

    });



});


```

- Pruebas
    - Se hace un mock completo de useTodos y se evalúa que el componente sea el esperado.

``` js
import { render, screen } from '@testing-library/react';
import { TodoApp } from '../../src/08-useReducer/TodoApp';
import { useTodos } from '../../src/hooks/useTodos';


jest.mock('../../src/hooks/useTodos')


describe('Pruebas en <TodoApp />', () => {

    useTodos.mockReturnValue({
        todos: [
            { id: 1, description: 'Todo #1', done: false },
            { id: 2, description: 'Todo #2', done: true },
        ], 
        todosCount: 2, 
        pendingTodosCount: 1, 
        handleDeleteTodo: jest.fn(), 
        handleToggleTodo: jest.fn(), 
        handleNewTodo: jest.fn()
    });


    test('debe de mostrar el componente correctamente', () => {
        
        render( <TodoApp /> );
        // screen.debug();
        expect( screen.getByText('Todo #1') ).toBeTruthy();
        expect( screen.getByText('Todo #2') ).toBeTruthy();
        expect( screen.getByRole('textbox') ).toBeTruthy();

    });

    
});
```
## 9.Pruebas con useContext

- Sujeto HomePage

``` js
import { useContext } from "react"
import { UserContext } from "./context/UserContext";


export const HomePage = () => {

  const { user } = useContext( UserContext );


    return (
      <>
          <h1>HomePage <small>{ user?.name }</small> </h1>
          <hr />

          <pre aria-label="pre">
            { JSON.stringify( user, null, 3 ) }
          </pre>
      </>
    )
  }
  
```

- Pruebas:
    - Fácilmente se usa el contexto creado y se le pasan los valores con los que se harán pruebas.
    - Se evalúa que no tenga el usuario, lo cual en la consola se aprecia que le pone null entre <pre>, lo cual ayuda a evaluar. 


``` js
import { render, screen } from '@testing-library/react';
import { UserContext } from '../../src/09-useContext/context/UserContext';
import { HomePage } from '../../src/09-useContext/HomePage';


describe('Pruebas en <HomePage />', () => {

    const user = {
        id: 1,
        name: 'Fernando'
    }

    test('debe de mostrar el componente sin el usuario', () => {
        
        render( 
            <UserContext.Provider value={{ user: null }}>
                <HomePage /> 
            </UserContext.Provider>
        );

        const preTag = screen.getByLabelText('pre'); // aria-label
        expect( preTag.innerHTML ).toBe( 'null' );
        // screen.debug()
    });


    test('debe de mostrar el componente CON el usuario', () => {
        
        render( 
            <UserContext.Provider value={{ user }}>
                <HomePage /> 
            </UserContext.Provider>
        );

        const preTag = screen.getByLabelText('pre'); // aria-label
        expect( preTag.innerHTML ).toContain( user.name );
        expect( preTag.innerHTML ).toContain( `${user.id}` );
        // screen.debug()
    });
    
});

```

## 10. Pruebas de funciones del context

- LoginPage.jsx

``` js
import { useContext } from 'react';
import { UserContext } from './context/UserContext';


export const LoginPage = () => {

    const { user, setUser } = useContext( UserContext );
    
    return (
      <>
          <h1>LoginPage</h1>
          <hr />

          <pre aria-label="pre">
            { JSON.stringify( user, null, 3 ) }
          </pre>


          <button 
            className="btn btn-primary"
            onClick={ () => setUser({ id: 123, name: 'Juan', email: 'juan@google.com' })  }
          >
            Establecer usuario
          </button>

      </>
    )
  }
  
```

- Test
    - Se recuerda que no es trabajo del componente verificar que el usuario haya cambiado. Esto es trabajo del useContext.
    - Este componente solo hace acciones dependiendo de si el usuario viene, de si se llaman las funciones con los argumentos requeridos cuando se ejecuta alguna acción.

``` js
import { fireEvent, render, screen } from "@testing-library/react";
import { UserContext } from "../../src/09-useContext/context/UserContext";
import { LoginPage } from "../../src/09-useContext/LoginPage";


describe('Pruebas en <LoginPage />', () => {
    
    test('debe de mostrar el componente sin el usuario', () => {

        render(
            <UserContext.Provider value={{ user: null }}>
                <LoginPage />
            </UserContext.Provider>
        );

        const preTag = screen.getByLabelText('pre');
        expect( preTag.innerHTML ).toBe('null');


    });


    test('debe de llamar el setUser cuando se hace click en el boton', () => {
        
        const setUserMock = jest.fn();

        render(
            <UserContext.Provider value={{ user: null, setUser: setUserMock }}>
                <LoginPage />
            </UserContext.Provider>
        );

        const button = screen.getByRole('button');
        fireEvent.click( button );

        expect( setUserMock ).toHaveBeenCalledWith({"email": "juan@google.com", "id": 123, "name": "Juan"})


    });


});
```

## 11. Pruebas generales en AppRouter

- Test.
    - Se evalúa que se renderice el componente correcto según el path.
    - Se usa MemoryRouter de react-router-dom para poder simular la navegación.
        - Se recuerda que en main se colocó el Browser Router, el cual provee de hooks especiales a la app. Entonces, con MemoryRouter se simula esto mismo.

``` js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MainApp } from '../../src/09-useContext/MainApp';


describe('Pruebas en <MainApp />', () => {
    
    test('debe de mostrar el HomePage', () => {
        
        render( 
            <MemoryRouter>
                <MainApp /> 
            </MemoryRouter>
        );

        expect( screen.getByText('HomePage') ).toBeTruthy();
        // screen.debug()

    });

    test('debe de mostrar el LoginPage', () => {
        
        render( 
            <MemoryRouter initialEntries={['/login']}>
                <MainApp /> 
            </MemoryRouter>
        );

        expect( screen.getByText('LoginPage') ).toBeTruthy();
        // screen.debug()

    });

});
```

- Sujeto.

``` js
import { Navigate, Route, Routes, Link } from 'react-router-dom';

import { UserProvider } from './context/UserProvider';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { LoginPage } from './LoginPage';
import { Navbar } from './Navbar';


export const MainApp = () => {
  return (
    <UserProvider>
        {/* <h1>MainApp</h1> */}
        {/* <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link> */}
        <Navbar />
        <hr />


        <Routes>
          <Route path="/" element={ <HomePage /> } />
          <Route path="about" element={ <AboutPage /> } />
          <Route path="login" element={ <LoginPage /> } />

          {/* <Route path="/*" element={ <LoginPage /> } /> */}
          <Route path="/*" element={ <Navigate to="/about" /> } />

        </Routes>
    </UserProvider>
  )
}

```
