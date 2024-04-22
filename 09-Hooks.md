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