# Sección 01. Introducción
## Instalaciones recomendadas
https://gist.github.com/Klerith/abce497de0736ee67a94da447941cada
- CSS Modules y MDX son nuevos acá.

## Sección 02. Reforzamiento React
## Temas
1. TypeScript con los principales Hooks de React
2. Pequeñas animaciones con GreenSock
3. Timelines
4. Custom Hooks
5. Referencias a elementos del DOM
6. Objetos como estado
7. Interfaces
8. Types
9. Reducers
10. Actions Creators

## 1. Tipado de props
- No se puede hacer de la manera convencional:

``` js
const component = ({value: number}) => {

}
```

- Lo anterior no es posible ya que choca con la sintaxis de renombrar una variable en un objeto.
- Se realiza una interface.

``` js
interface Props {
    initialValue: number;
}

const Counter = ({ initialValue }: Props) => {
    const [counter, setCounter] = useState(initialValue);
```

## 2. Uso de objetos como estado

- Se define el tipo de un useState por medio de <>, el cual es como se definen los genéricos.
- Al definir el tipo de useState ya es posible usar la destructuración con recomendaciones del editor de código.
- Un estado se puede destructurar en su definición si el estado es un objeto.
    - Esto mismo aplica cuando se usa prev al momento de usar la función setter.

``` js
import { useState } from "react"

interface Props {
    initialValue: number;
}

interface CounterState {
    counter: number;
    clicks: number;
}

const CounterBy = ({ initialValue }: Props) => {
    const [{ counter, clicks }, setCounter] = useState<CounterState>({
        counter: initialValue,
        clicks: 0
    });

    const handleClick = (value: number) => {
        setCounter(({ clicks, counter }) => ({
            counter: counter + value,
            clicks: clicks + 1
        }));
    }
    return (
        <>
            <h1>CounterBy: {counter}</h1>
            <h1>Click: {clicks}</h1>

            <button onClick={() => handleClick(1)}>
                +1
            </button>
            <button onClick={() => handleClick(5)}>
                +5
            </button>
        </>
    )
}

export default CounterBy;
```

## 3. Extra - aplicar color a mensajes en consola

``` js
console.log('%c Valor con estilo', 'color: green; background-color: blue');
```

## 4. useEffect

``` js
import { useEffect, useState } from "react"

interface Props {
    initialValue: number;
}

const MAXIMUM_COUNT = 10;

const CounterEffect = ({ initialValue }: Props) => {
    const [counter, setCounter] = useState(initialValue);

    const handleClick = () => {
        setCounter(prev => Math.min(prev + 1, MAXIMUM_COUNT));
    }

    useEffect(() => {
        if (counter < MAXIMUM_COUNT) return;

        console.log('%c Valor con estilo', 'color: green; background-color: blue');

    }, [counter])

    return (
        <>
            <h1>Counter: {counter}</h1>

            <button onClick={handleClick}>
                +1
            </button>
        </>
    )
}

export default CounterEffect

```

## 5. useEffect y animaciones GSAP
https://gsap.com/
1. Instalar GSAP

``` bash
npm i gsap
```

- Todas las animaciones de gsap ahora están en el objeto gsap en lugar de tener que llamar cada una por separado.

### gsap.to
- Es una promesa.
- El primer argumento es un selector para seleccionar los elementos html deseados.
- El segundo argumento es un argumento para la configuración de las animaciones.
- Se debe usar en conjunto con useRef para hacer las selecciones de los elementos.

``` js
    useEffect(() => {
        if (counter < MAXIMUM_COUNT) return;

        console.log('%c Valor con estilo', 'color: green; background-color: blue');

        gsap.to('h2', {
            y: -10,
            duration: 0.2,
            ease: 'elastic.inOut'
        }).then(() => {
            gsap.to('h2', {
                y: 0,
                duration: 1,
                ease: 'bounce.out'
            })
        })

    }, [counter])
```

### Timelines
- Es la forma recomendada para realizar animaciones en gsap.
- Se crea el timeline y se usa el método to.
    - Se debe pasar el objeto que se desea animar así como las propiedades de animación.

- El método to de timeline permite definir en varias líneas las animaciones en lugar de usar then que se empleaba con gsap.to


#### useRef
- Se recuerda que a diferencia de useState no dispara renderizaciones cuando el elemento tiene algún cambio.
- Para asignar el tipo de dato a useRef usando TS se deja el cursor sobre el atributo ref del elemento html que se desea.
    - Esto desplegará la razón del error de asignar la referencia, en donde se aprecia que el tipo de dato aparece como:

``` 
RefObject<HTMLHeadingElement>
```

``` js
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react"


interface Props {
    initialValue: number;
}

const MAXIMUM_COUNT = 10;

const CounterEffect = ({ initialValue }: Props) => {
    const [counter, setCounter] = useState(initialValue);
    const counterElement = useRef<HTMLHeadingElement>(null);

    const handleClick = () => {
        setCounter(prev => Math.min(prev + 1, MAXIMUM_COUNT));
    }

    useEffect(() => {
        if (counter < MAXIMUM_COUNT) return;

        console.log('%c Valor con estilo', 'color: green; background-color: blue');

        const tl = gsap.timeline();

        tl.to(counterElement.current, { y: -10, duration: 0.2, ease: 'elastic.inOut' })
            .to(counterElement.current, { y: 0, duration: 1, ease: 'bounce.out' });

        //tl.to(counterElement.current, { y: 0, duration: 1, ease: 'bounce.out' });

        /*         gsap.to(counterElement.current, {
                    y: -10,
                    duration: 0.2,
                    ease: 'elastic.inOut'
                }).then(() => {
                    gsap.to(counterElement.current, {
                        y: 0,
                        duration: 1,
                        ease: 'bounce.out'
                    })
                }) */

    }, [counter])

    return (
        <>
            <h1>Counter</h1>
            <h2 ref={counterElement}>{counter}</h2>

            <button onClick={handleClick}>
                +1
            </button>
        </>
    )
}

export default CounterEffect

```

## 6. CustomHooks con referencias HTML
- Se aprecia que en el componente actual se tienen varias responsabilidades, por lo que se plantea crear un custom hook para separar el estado y la lógica de la animación.

1. src -> hooks -> useCounter
    - Copiar todo lo relacionado a hooks de CounterEffect y colocarlo en este custom hook.
    - Retornar del custom hook el counter, la referencia de ref (counter element) y la función handleClick.
2. Corregir problema de timeline.
    - Actualmente se está creando otra instancia del timeline en el useEffect ya que no se limpia.
    - Se utiliza un useRef para tener la isntancia de gsap.timeline para garantizar que solo se renderice una vez.
    - Por medio de useLayoutEffect (la diferencia con useEffect es que useLayoutEffect espera a que todos los elementos html ya estén construidos.)
    - Al momento de definir la animación se le coloca pause para evitar que se dispare apenas se cree.

__useCounter.ts__

``` ts
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap";


export const useCounter = ({maxCount = 10}) => {

    const [counter, setCounter] = useState(6);
    const elementToAnimate = useRef<any>(null);

    const tl = useRef(gsap.timeline());

    const handleClick = () => {
        setCounter(prev => Math.min(prev + 1, maxCount));
    }

    useLayoutEffect(() => {

        if( !elementToAnimate.current ) return;
        
        tl.current.to(elementToAnimate.current, { y: -10, duration: 0.2, ease: 'elastic.inOut' })
                  .to(elementToAnimate.current, { y: 0, duration: 1, ease: 'bounce.out' })
                  .pause(); // No inicia la animación de forma inmediata apenas se cree.
    }, [])

    useEffect(() => {
        tl.current.play(0);
    }, [counter])

  return {
    counter,
    elementToAnimate,
    handleClick
  }
}
```

__CounterHook.tsx__

``` tsx
import { useCounter } from "../hooks/useCounter";


const CounterHook = () => {

    const {counter, elementToAnimate, handleClick} = useCounter({ maxCount: 15 });

    return (
        <>
            <h1>Counter</h1>
            <h2 ref={elementToAnimate}>{counter}</h2>

            <button onClick={handleClick}>
                +1
            </button>
        </>
    )
}

export default CounterHook

```

## 7. useReducer
- El hook cuenta con tres argumentos:
    1. reducer
    2. initial state
    3. función init, la cual permite definir el estado inicial de forma lazy ya que se considera que puede traer muchos datos el estado del reducer.
- Una función reducer es una función pura. Resuelve sus acciones únicamente con los argumentos que recibe sin interactuar con lo que hay más allá de su scope.
    - Se le asocia reducer a una función ya que recibe un estado inicial, una acción y produce otro estado.

``` js
import { useReducer } from "react"

interface CounterState {
    counter: number,
    previous: number,
    changes: number,
}

const INITIAL_STATE: CounterState = {
    counter: 0,
    previous: 0,
    changes: 0,
}

type CounterAction = 
    | { type: 'increaseBy', payload: { value: number; } }
    | { type: 'reset' }

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {

    const { counter, changes } = state;

    switch (action.type) {
        case 'reset':
            return {
                counter: 0,
                changes: 0,
                previous: 0
            }
        
        case 'increaseBy':
            return {
               counter: counter + action.payload.value,
               changes: changes + 1,
               previous: counter,
            }
    
        default:
            return state;
    }
}

export const CounterReducer = () => {
    
    const [counterState, dispatch] = useReducer(counterReducer, INITIAL_STATE);

    const handleReset = () => {
        dispatch({ type: 'reset' });
    }

    const increaseBy = (value: number) => {
        dispatch({ type: 'increaseBy', payload: { value } })
    }

    return (
        <>
            <h1>Counter Reducer</h1>

            <pre>
                {JSON.stringify(counterState, null, 2)}
            </pre>

            <button onClick={handleReset}>
                Reset
            </button>

            <button onClick={() => increaseBy(2)}>
                +2
            </button>
        </>
    )
}
```

### Separar acciones, interfaces y reducer
1. src -> counter-reducer -> CounterReducer.tsx

``` js
import { useReducer } from "react"
import { CounterState } from "./interfaces/interfaces";
import { counterReducer } from "./state/counterReducer";

const INITIAL_STATE: CounterState = {
    counter: 0,
    previous: 0,
    changes: 0,
}

export const CounterReducerComponent = () => {
    
    const [counterState, dispatch] = useReducer(counterReducer, INITIAL_STATE);

    const handleReset = () => {
        dispatch({ type: 'reset' });
    }

    const increaseBy = (value: number) => {
        dispatch({ type: 'increaseBy', payload: { value } })
    }

    return (
        <>
            <h1>Counter Reducer Segmentado</h1>

            <pre>
                {JSON.stringify(counterState, null, 2)}
            </pre>

            <button onClick={handleReset}>
                Reset
            </button>

            <button onClick={() => increaseBy(2)}>
                +2
            </button>
        </>
    )
}
```

2. src -> counter-reducer -> state
2. src -> counter-reducer -> actions
2. src -> counter-reducer -> interfaces

### Action Creators
- Es muy volatil manejar las acciones por medio de strings.
    - Actions Creators está inspirado en el patrón Redux.
    - Es generar una función que genere la acción que se va a ocupar.

1. src -> counter-reducer -> actions -> actions.ts
    - Se acostumbra colocarle do al nombre de la action creator.

``` ts
export type CounterAction = 
    | { type: 'increaseBy', payload: { value: number; } }
    | { type: 'reset' }

export const doReset = ():CounterAction => ({
    type: 'reset'
});

export const doIncreaseBy = (value: number):CounterAction => ({
    type: 'increaseBy',
    payload: { value }
})

```

2. Llamar funciones en dispatch correspondiente.

``` tsx
export const CounterReducerComponent = () => {
    
    const [counterState, dispatch] = useReducer(counterReducer, INITIAL_STATE);

    const handleReset = () => {
        dispatch(doReset());
    }

    const increaseBy = (value: number) => {
        dispatch( doIncreaseBy(value) )
    }

```

- A modo de no importar tanto se puede importar todo de una carpeta en un objeto.

``` js
import { useReducer } from "react"
import { CounterState } from "./interfaces/interfaces";
import { counterReducer } from "./state/counterReducer";
//import { doIncreaseBy, doReset } from "./actions/actions";
import * as actions from "./actions/actions";

const INITIAL_STATE: CounterState = {
    counter: 0,
    previous: 0,
    changes: 0,
}

export const CounterReducerComponent = () => {
    
    const [counterState, dispatch] = useReducer(counterReducer, INITIAL_STATE);

    const handleReset = () => {
        dispatch(actions.doReset());
    }

    const increaseBy = (value: number) => {
        dispatch( actions.doIncreaseBy(value) )
    }
```