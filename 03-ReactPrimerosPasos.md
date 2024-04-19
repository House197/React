# Sección 4. Primeros Pasos React
## Temas
1. Nuestra primera aplicación - Hola Mundo
2. Exposiciones sobre los componentes
3. Creación de componentes (Functional Components)
4. Propiedades - Props
5. Impresiones en el HTML
6. PropTypes
7. DefaultProps
8. Introducción general a los Hooks
9. useState

## 1. Componentes
- Pequeña pieza de código encapsulada y re-utilizable que puede tener estado o no.
- Es buena práctica usar CamelCase para nombrado de componentes.
- El estado es cómo se encuentra la información del componente en algún punto en el tiempo.

## 2. Creación de proyecto
- Se trabaja con Vite ya que CRA ya fue deprecated.

``` bash
npm create vite
```

- El archivo package-lock.json indica que se trabaja con npm.
    - El archivo yarn-lock indica que se trabaja con yarn.

## 3. Estructura CRA
https://cursos.devtalles.com/courses/take/react-cero-experto/lessons/36057262-estructura-de-directorios-cra
- Contiene vinculos para saber de Robots.txt y de PWA.

## 4. Estructura Vite
- Vite no trae tantas configuraciones como CRA, lo cual requiere hacerlas de forma manual si se llegan a ocupar.
- Vite no coloca el manifest en index.html.
- Vite cuenta con su archivo config, en donde por defecto tiene coom pluin a react() para no tener que importarlo en cada nuevo archivo que se crea.

### 1. Ejecutar proyecto
1. npm i
2. npm run dev

``` bash
npm run dev
yarn dev
```

### 2. Primer app
- Esto solo es para ilustrar.
1. Borrar contenido de src.
2. Crear src -> main.tsx

``` ts
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    // document.createEelement ....
    return (<h1>Hola Mundo</h1>)
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
```

## 5. Fragments
- Permiten no tener que crear un elemento HTML como parent para lo que se desea retornar en un componente.

``` ts
export const FirstApp = () => {
    return (
        <>
            <h1>Titulo</h1>
            <p>Spy un subtitulo</p>
        </>
    )
}
```

- Anteriormente se colocaba la palabra reservada Fragment.

``` ts
import {Fragment} from 'react';

export const FirstApp = () => {
    return (
        <Fragment>
            <h1>Titulo</h1>
            <p>Spy un subtitulo</p>
        </Fragment>
    )
}
```

## 6. Variables en HTML
- Se colocan valores por medio de {}.
- No se pueden colocar objetos como child. Pero se puede usar JSON.stringify para convertirlo en un string.
    - Entonces, una Promesa tampoco aparece, ya que es un objeto.
- Se mejora la visualización del objeto en string si se usa <code></code>
- Se puede comentar entre {} con /**/
- Los valores booleanos no aparecen.

``` ts
const newMessage = {
    message: 'Hola Mundo',
    title: 'H'
}

export const FirstApp = () => {
    return (
        <>
            <code>{JSON.stringify(newMessage)}</code>
            <p>Spy un subtitulo</p>
        </>
    )
}
```

## 7. Comunicación entre componentes
- Se hace por medio de las props, las cuales se reciben como argumento del componente.
- Normalmente se destructuran en el argumento.
- Se pueden hacer pruebas de las props en la consola del navegador al seleccionar la opción de Components al tener las herramientas de React instaladas.

``` ts
<FirstApp title='Value' subTitle={123} />

export const FirstApp = ({title, subtitle}) => {
    return (
        <>
            <code>{JSON.stringify(newMessage)}</code>
            <p>Spy un subtitulo</p>
        </>
    )
}
```

## 8. PropTypes
- Viene por defecto en CRA, no en Vite.
    - No es necesario si ya se trabaja con TS.
    - PropTypes permite definir el tipo a las properties.
    - Se definen después de haber definido el componente.
1. Instalar.

``` bash
npm i prop-types
```

``` ts
import PropTypes from 'prop-types';

export const FirstApp = ({ title, subtitle }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </>
    )
}

FirstApp.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.number.isRequired
}
``` 

## 9. DefaultProps
- Así como cualquier función se puede especificar el valor por defecto que tienen los argumentos.
- Se definen después de haber definido el componente.

``` ts
import PropTypes from 'prop-types';

export const FirstApp = ({ 
    title, 
    subtitle = 'Este es un subtitle.'
    }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </>
    )
}

FirstApp.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.number.isRequired
}
``` 
- En caso de tener varios argumentos se puede usar defaultProps.
    - Los defaultProps entran antes que los propTypes.
    - No es necesario definir todas las props en defaultTypes.

``` ts
import PropTypes from 'prop-types';

export const FirstApp = ({ title, subtitle }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </>
    )
}

FirstApp.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.number.isRequired
}

FirstApp.defaultProps = {
    title: 'No hay titulo',
    subtitle: 'No hay subtitulo'
}
```

## 10. Eventos
https://es.react.dev/reference/react-dom/components/common

## 11. useState - Hook
- Colocar la importación de hooks en primer lugar.

``` ts
const Componente = ({value}) => {
    const [counter, setCounter] = useState(10);

    setCounter( counter + 1 );
    setCounter((c) => c + 1);

    // El resultado va a ser 11, no 12.
}
```

- React va a tomar todos los llamados de setCounter para determinar el nuevo valor, por lo que no se realiza una renderización cuando se llama a una única setCounter, sino que contempla ya todos los llamados que ocurren.
- Si se usa una prop para inicializar el estado, entonces esa prop nunca va a cambiar, pero el estado del componente irá trabajando sobre ese valor inicial.

# Sección 5. Pruebas unitaris y de integración.
## Temas
1. Introducción a las pruebas
2. AAA
    1. Arrange - Arreglar
    2. Act - Actuar
    3. Assert - Afirmar
3. Primeras pruebas
4. Jest
5. Expect
6. toBe
7. Enzyme
8. Comandos útiles en la terminal para pruebas
9. Revisar elementos renderizados en el componente
10. Simular eventos


## 1. Configurar Jest
1. Instalar
``` bash
npm i -D jest
npm i -D @types/jest # Si se usa TS se deben instalar los Types.
```

2. Configurar scripts en package.json

``` json
"test": "jest --watchAll"
```

3. Crear archivo jest.setup.js
    - Contiene código de JS que se ejecúta apenas se inicien las pruebas.
    - Jest sabe que debe ejecutar este archivo al especificarl en jest.config.js
    - En este caso, jest.setup.js va a estar pendiente de la función fetch, ya que versiones de Node antes de la 18 no está de forma nativa.
        - Es decir, va a importar el paquete de fetch para garantizar que siempre esté disponible a pesar de la versión de node.
        - Se debe tener el paquete de fetch instalado, el cual se hace como dev dependency.

``` ts
import 'whatwg-fetch';
```

``` bash
npm i -D whatwg-fetch
```


4. Crear archivo jest.config.js
    - Apenas se haga una prueba jest busca este archivo para ver las configuraciones deseadas.
    - Definir ambiente de test con jest-environment-jsdom.

``` js
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js']
}
```

5. Instalar jest-environment-jsdom

``` bash
npm i -D jest-environment-jsdom
```

6. Instalar @babel/preset-react

``` bash
npm i -D @babel/preset-react
```

7. Colocar siguiente configuración en babel.config.js

``` js
module.exports = {
    presets: [
        [ '@babel/preset-env', { targets: { esmodules: true } } ],
        [ '@babel/preset-react', { runtime: 'automatic' } ],
    ],
};
```

### Testing library
https://testing-library.com/
https://testing-library.com/docs/react-testing-library/intro
- Se usa para poder hacer tests en componentes de React, ya que Jest por sí solo no tiene lo necesario.
    - Se se enfoca más en hacer las aserciones y mocks de funciones
1. Instalar dependencias necesarias de JEST. https://jestjs.io/docs/tutorial-react

``` bash
npm i -D @testing-library/react

```

- Jest se va a usar para hacer las evaluaciones y lo que se conoce hasta ahora.
- React Testing Library es bueno para evaluar el DOM virtual.
    - Se enfoca más en lo que sucede después de las interacciones sobre la pantalla.
1. Instalar

``` bash
npm install --save-dev @testing-library/react
```

### Babel
1. Instalar
``` bash
npm i -D babel-jest @babel/core @babel/preset-env
```

2. Configurar Babel.
    1. Crear archivo babel.config.js

## Cambiar extensión de archivos a cs
- Puede que salga el error **You appear to be using a native ECMAScript module configuration file, which is only supported when running Babel asynchronously**, se debe cambiar la extensión de los archivos js a cs:
    - jest.config.js
    - babel.config.js

## 3. Pruebas en archivo 02-template-string.js
- Solo se evalúa que la función retorne lo esperado.

## 4. Pruebas en 05-funciones.test.js
- Se introducte toEqual y toEqualStrict
    - Se usa para evaluar objetos.

## 5. Pruebas en 07-deses-arr.js
- Se evalúa la desestructuración de un arrego.
    - Se evanlúa que el valor de cada variable corresponda así como su tipo de dato.
- Al evaluar deepl equality se debe usar toScrictEqual

``` js
import { retornaArreglo } from '../../src/base-pruebas/07-deses-arr';


describe('Pruebas en 07-deses-arr', () => {
    
    test('debe de retornar un string y un número', () => {
        
        const [ letters, numbers ] = retornaArreglo();
        
        expect( letters ).toBe( 'ABC' );
        expect( numbers ).toBe( 123 );

        expect(typeof letters).toBe('string')
        expect(typeof numbers).toBe('number')

        expect( letters ).toEqual( expect.any(String) ); // El comentario es por esta línea de código

    });


});
```

## 6. Pruebas en 08-imp-exp.js - Arreglos
- Se evalúa que las funcionen retornen lo esperado a partir de un arreglo de objetos.

## 7. Pruebas con tareas asíncronas, 09-promesas.test.js
- Se usa done en cada it o test para indicar a jest que debe esperar a la promesa que se complete.
- Done se coloca en el mismo scope en donde se desea evaluar, en donde debe ir al final el done.

``` ts
import { getHeroeByIdAsync } from '../../src/base-pruebas/09-promesas';


describe('Pruebas en 09-promesas', () => {
    
    test('getHeroeByIdAsync debe de retornar un héroe', (done) => {
        
        const id = 1;
        getHeroeByIdAsync( id )
            .then( hero => {
            
                expect(hero).toEqual({
                    id: 1,
                    name: 'Batman',
                    owner: 'DC'
                });

                done();
            });
        
    });

    test('getHeroeByIdAsync debe de obtener un error si heroe no existe', (done) => {
        
        const id = 100;
        getHeroeByIdAsync( id )
           .then( hero => {
               expect( hero ).toBeFalsy();
               done();
           })
           .catch( error => {

                expect( error ).toBe(`No se pudo encontrar el héroe ${ id }`)

                done();
            });
        
    });


});
```

## 8. Pruebas con 11-async-await
- En este caso se define que el it o test tiene un callback asíncrono, por lo que ya no es necesario usar done.

``` ts
import { getImagen } from '../../src/base-pruebas/11-async-await';


describe('Pruebas en 11-async-await.js', () => {
    
    test('getImagen debe de retornar un error si no tenemos api key', async() => {
        
        const resp = await getImagen();
        // expect( typeof url ).toBe('string');
        expect( resp ).toBe('No se encontro la imagen');

    });



});
```

## 9. Pruebas sobre componentes de React

### 1. FirstApp.jsx
- En esta pruebas se repite mucho el código en varios lugares, ya que es una introducción a testing.
- Se considera evalular el jsx.
    - Que las props estén ubicadas en donde se desea, así como que se estén usando los tags html esperados.
        - Esto asegura que la secciones deseadas sí se rendericen.
    - Que los valores por defecto sean los que se esperan si no se envían las props.
    - Verificar que las props deseadas sean requeridas.

1. Debe hacer match con el snapshot (no es una prueba preferida por hacer).
    - No es la preferida ya que solo ayuda a que el componente se quede de esa forma por un periodo de tiempo, pero si se tienen que hacer cambios en desarrollo entonces la prueba va a fallar.
    1. Se usa render de la librería '@testing-library/react'.
        - Permite renderizar el componente en memoria.
        - Contiene la propiedad de contianer, la cual se parece a un nodo de HTML.
            - Se puede usar para tomar la fotografía por medio de toMatchSnapShot el cual crea una carpeta __snpashots__
            - La primera vez que se corre este método coloca la fotografía en esa carpeta.

``` ts
    test('debe de hacer match con el snapshot', () => {
        
        const title = 'Hola, Soy Goku';
        const { container } = render( <FirstApp title={ title } /> );

        expect( container ).toMatchSnapshot();

    });
```

2. Revisar que la prop de title esté en un tag h1 de html.
    - render provee de otras propiedades como getByText y getByTestId para hacer pruebas en el DOM.
    - Estas propiedades permite obtener nodos por medio de alguna característica.
    - Para poder obtener el id en el componente de React se agrega el data-attribute de testid para poder seleccionarlo desde las pruebas por medio de **getByTestId**
    
    - Se usa toContain para garantizar que el title se encuentre más no interesa si hay traling o ending spaces, lo cual sería el caso si se usara toBe el cual espera que sean idénticos.

``` js
  return (
    <>
      <h1 data-testid="test-title"> { title } </h1>
      {/* <code>{ JSON.stringify( newMessage ) }</code> */}
      <p>{ subTitle }</p>
      <p>{ subTitle }</p>
      <p>{ name }</p>
    </>
  )
```

``` js
    test('debe de mostrar el título en un h1', () => {

        const title = 'Hola, Soy Goku';
        const { container, getByText, getByTestId } = render(<FirstApp title={title} />);
        expect(getByText(title)).toBeTruthy(); // Garantiza que esté, pero no el lugar que ocupa ni los tags en donde está.

        // const h1 = container.querySelector('h1');
        // expect(h1.innerHTML).toContain( title )
        expect(getByTestId('test-title').innerHTML).toContain(title)

    });
```

3. Prueba para ver si se muestra el subtitle.
    - Se usa getAllByText en lugar de getByText ya que se esperan haya varios lugares en donde se usa subtitle en el dom.
        - Retorna un arreglo de elementos de HTML.

``` js
  return (
    <>
      <h1 data-testid="test-title"> { title } </h1>
      {/* <code>{ JSON.stringify( newMessage ) }</code> */}
      <p>{ subTitle }</p>
      <p>{ subTitle }</p>
      <p>{ name }</p>
    </>
  )
```

``` ts
    test('debe de mostrar el subtitulo enviado por props', () => {

        const title = 'Hola, Soy Goku';
        const subTitle = 'Soy un subtitulo';
        const { getAllByText } = render(
            <FirstApp
                title={title}
                subTitle={subTitle}
            />
        );

        expect(getAllByText(subTitle).length).toBe(2);

    });

```

### 1-2 Versión limpia de FirstApp.jsx
- Se evita repetir el código.

1. Definir constantes en top level.

``` js
    const title    = 'Hola, Soy Goku';
    const subTitle = 'Soy un subtitulo';
```

2. Evaluar snapshot.

``` js
    test('debe de hacer match con el snapshot', () => {
        
        const { container } = render( <FirstApp title={ title } /> );
        expect( container ).toMatchSnapshot();

    });
```

3. Evaluar que esté el valor de la prop title en el dom.
    - En este caso solo se llama a render si destructurar alguna propiedad.
    - Se hace la evaluación con la propiedad screen de la librería '@testing-library/react'.
        - En pocas palabras es el objeto que se está revisando.
        - Se puede ver el screen con ayuda de su método debug.
            - Al inicio si no se llama al elemento render muestra un tag de cierre </body>
            - Si se llama después de un render entonces se puede ver una copia del DOM para lo que se está probando, en donde inicia con <body>, envuelve a lo que renderiza el componente y cierrra el body.
    - Con screen se usa getByText para buscar que el texto deseado esté presente en el DOM en memoria.
``` js
import { render, screen } from '@testing-library/react';
...
    test('debe de mostrar el mensaje "Hola, Soy Goku"', () => {
        
        render( <FirstApp title={ title } /> );
        expect( screen.getByText(title) ).toBeTruthy();
        // screen.debug();
    });

```

4. Evaluar que el valor de la prop title eté en un h1.
    - Con Screen se busca al elemento html por medio de su role (getByRole('heading')), en donde además se puede revisar su nivel en el DOM y su contenido HTML.

``` js
    test('debe de mostrar el titulo en un h1', () => {
        render( <FirstApp title={ title } /> );
        expect( screen.getByRole('heading', { level: 1 }).innerHTML ).toContain( title );
    });
```

5. Mostrar subtítulo enviado por props.

``` js
    test('debe de mostrar el subtitulo enviado por props', () => {
        
        render( 
            <FirstApp 
                title={ title }
                subTitle={ subTitle }
            />  
        );

        expect( screen.getAllByText(subTitle).length ).toBe(2);

    });
```

### 2. Pruebas en componente CounterApp
1. Definir constantes en top level.
``` js
const initialValue = 10;
```
2. Hacer match con el snapshot.
``` js
    test('debe de hacer match con el snapshot', () => {
        const { container } = render(<CounterApp value={ initialValue } />);
        expect( container ).toMatchSnapshot();
    });
```
3. Debe mostrar valor inicia de 100 <CounterApp value={100}>
    - Acá se debe tener cuidado, ya que se evalúa que haya un 100, el cual puede estar presente pero no necesariamente porque es el valor que se pasó como prop, sino que puede haber un elemento que tenga el número 100 en algún lado del componente.
``` js
    test('debe de mostrar el valor inicial de 100 <CounterApp value={100}>', () => {
        
        render( <CounterApp value={ 100 } /> );
        expect( screen.getByText(100) ).toBeTruthy();
        // expect( screen.getByRole('heading',{ level: 2}).innerHTML ).toContain('100')

    });
```
- Simular eventos - Click
    - Se usa fireEvent de '@testing-library/react'.
    - Ente los eventos que se pueden usar están:
        - click
4. Incrementar con el botón +1. Simular eventos - Click
    - Se usa el evento click de fireEvent, el cual recibe como argumento el elemento al cual se le aplicará el evento.

``` js
    test('debe de incrementar con el botón +1', () => {
        
        render( <CounterApp value={ initialValue } /> );
        fireEvent.click( screen.getByText('+1') )
        expect( screen.getByText('11') ).toBeTruthy();

    });
```

5. Decrementar con el botón -1. Simular eventos - Click

``` js
    test('debe de decrementar con el botón -1', () => {
        
        render( <CounterApp value={ initialValue } /> );
        fireEvent.click( screen.getByText('-1') );
        expect( screen.getByText('9') ).toBeTruthy();

    });
```

6. Debe funcionar el botón de reset. Simular eventos - Click
    - En este caso al botón en el componente se le colocó un aria-label, el cual se usa para seleccionarlo en el DOM.
    - Se elecciona con el campo de name en el objeto en segunda posición de getByRole.
        - Este campo de name es general.

``` js
    return (
        <>
            <h1>CounterApp</h1>
            <h2> { counter } </h2>

            <button onClick={ handleAdd }> +1 </button>
            <button onClick={ handleSubstract }> -1 </button>
            <button aria-label="btn-reset" onClick={ handleReset }> Reset </button>
        </>
    );
```

``` js

    test('debe de funcionar el botón de reset', () => {
        
        render( <CounterApp value={ 355 } /> );
        fireEvent.click( screen.getByText('+1') );
        fireEvent.click( screen.getByText('+1') );
        fireEvent.click( screen.getByText('+1') );
        // fireEvent.click( screen.getByText('Reset') );
        fireEvent.click(screen.getByRole('button', { name: 'btn-reset' }));

        expect( screen.getByText( 355 ) ).toBeTruthy();

    });
```

# Notas
- Si al pasar una prop solo se coloca su nombre entonces es igual a enviar el valor booleano true.
- Se pueden filtrar las priebas por hacer en la terminal al presionar p y especificar el patrón.