# Sección 6. GifExpertApp - App
## Temas
1. Custom Hooks
2. Fetch hacia un API
3. Comunicación entre componentes
4. Clases de CSS
5. Animaciones
6. Enviar métodos como argumentos
7. Crear listados
8. keys
9. Giphy

## 1. UseEffect
- Se utiliza para disparar efecto secundarios.
    - Un efecto secundario se puede considerar como un proceso que se desea ejecutar cuando un determinado evento sucede.

## 2. Despliegue de producción rápido.
- Se utiliza para ver cómo se vería la app si se desplegara.
1. Crear bundle de producción 
``` bash
npm run build
```

2. Instalar http-server de node de forma global
    - Permite desplegar aplicación de forma local.

``` bash
npm i -g http-server
```

3. Ejecutar comando en root de la app para desplegar app de forma local:

``` bash
http-server -o
```

## 3. Custom Hook
- En este punto se tiene la siguiente lógica en el componente, la cual se colocará en un customHook.
    - Por otro lado, también se aprovechará para colocar la lógica de isLoading.
- Un hook no es más que una función que retorna algo.
- Los argumentos se pasan como con una función normal, ya no como props.

``` ts
export const GifGrid = ({category}) => {
    const [images, setImages] = useState([])

    const getImages = async() => {
        const newImages = await getFifs(category);
        setImages(newImages);
    }

    useEffect(() => {
        getImages
    }, [])

    ...
}
```

1. src->hooks-> useFetchGifs.js
    - Se le coloca extensión js ya que no se va a retornar jsx.

``` js
export const useFetchGifs = (category) => {

    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getImages = async() => {
        const newImages = await getFifs(category);
        setImages(newImages);
        setIsLoading(false);
    }

    useEffect(() => {
        getImages
    }, [])

    return {
        images,
        isLoading
    }
}
```

2. Usar customHook.
    - Se puede renderizar condicionalmente una sección de JSX usando &&, lo cual ayuda a la legibilidad.

``` ts
export const GifGrid = ({category}) => {
    const [images, isLoading] = useFetchGifs(category)

    return (
        <>
            {
                isLoading && (<h2>Cargando</h2>)
            }
        </>
    )
}
```

# Sección 7. Generando el build de producción y despliegues
## Temas
1. Aprender cómo realizar backups a repositorios de Git
2. Subir nuestro repositorio a GitHub
3. Uso de Github Pages
4. Desplegar nuestra aplicación de React
5. Generar build de producción de nuestra aplicación

## 1. Desplegar en Netlify
https://cursos.devtalles.com/courses/take/react-cero-experto/lessons/36089197-desplegar-en-netlify
- Se usa para alojar apps sin backend, es meramente frontend.
1. Generar carpeta de distribución.

``` bash
npm run build
```

## 2. Desplegar en Github Pages
1. La carpeta de dist se debe llamar docs.
    - Al cambiar el nombre ahora git le dará seguimiento, ya que la carepta dist se ignora por medio de gitignore.
    - En otras palabras, se debe subir la carpeta creada por el build a github.
2. Ubicarse en repositorio en Github.
    1. Settings.
    2. Pages.
        1. Branch debe ser main.
        2. Seleccionar carpeta de /docs en lugar de /(root)

- Usualmente cuando se levanta la página se ve en la consola que hubo errores al no poder encontrar algunos assets.
    - Esto no sucede con Netlify.
    - La diferencia es que la app que se despliega en github pages no está alojada en el root; es decir, está en una subcarpeta lo cual se ve en el link el cual contiene contiene un / seguido del nombre de la app a diferencia de netlify, en donde el link no contiene ningún slash.
        - Github: https://user.github.io/app-name
        - Netlify: https://custom-domain.netlify.com

- Soluciones
    1. Docs -> index.html
        - Apuntar a nueva ubicación en las importaciones que contienen assets.
    
``` html
    <script type="module" crossorigin src="./assets/index.5c4a1265.js"></script>
    <link rel="stylesheet" href="./assets/index.df2abcea.css">
```

# Sección 8. Testing
## Temas
1. Seguir el camino de las pruebas
2. Pruebas en componentes específicos
3. Pruebas en componentes de forma individual
4. Pruebas con customHooks
5. Esperar cambios en un customHook
6. Simular eventos en inputs y formularios
7. Simular llamadas a funciones
8. Evaluar si existen elementos en el componente

## 1. Trazar ruta crítica
- Empezar testing con componentes que menos dependencias tienen. (Pruebas atómicas.)

## 2. Pruebas en GifItem
1. React\04-react-gif-expert\tests\components\GifItem.test.jsx
    - Al obtener un elemento por getByRole se tinen todas sus propiedades, por lo que se pueden destructura. P/e: una imagen se puede obtener el src y el alt.
- Se evalúa:
    - Snapshot.
    - Que atributos de imagen sean correctos.
    - Títul esté presente.

``` js
import { render, screen } from '@testing-library/react';
import { GifItem } from '../../src/components/GifItem';


describe('Pruebas en <GifItem />', () => {

    const title = 'Saitama';
    const url   = 'https://one-punch.com/saitama.jpg';

    test('debe de hacer match con el snapshot', () => {
        
        const { container } = render( <GifItem title={ title } url={ url } /> );
        expect( container ).toMatchSnapshot();

    });

    test('debe de mostrar la imagen con el URL y el ALT indicado', () => {
        
        render( <GifItem title={ title } url={ url } /> );
        // screen.debug();
        // expect( screen.getByRole('img').src ).toBe( url );
        const { src, alt } = screen.getByRole('img');
        expect( src ).toBe( url );
        expect( alt ).toBe( alt );
    });

    // Se evalúa la presencia de un elemento con seleccionarlo y usar toBeTruthy.
    test('debe de mostrar el titulo en el componente', () => {
        
        render( <GifItem title={ title } url={ url } /> );
        expect( screen.getByText( title ) ).toBeTruthy();

    });

    
});
```

## 3. Pruebas en helper getGifs
- Pruebas:
    - Que retorne un arreglo de gifs.
        - Más adelante se hacen pruebas para ver que el fetch y los elementos internos hagan su trabajo. Por el momento solo se evalúa que la función retorne lo que debe.
    - No evaluar el body de la respuesta de una API.
        - La API puede cambiar en cualquier momento, por lo que no se debe evaluar el body.
- Componente:

``` js
export const getGifs = async( category ) => {

    const url = `https://api.giphy.com/v1/gifs/search?api_key=&q=${ category }&limit=10`;
    const resp = await fetch( url );
    const { data } = await resp.json();

    const gifs = data.map( img => ({
        id: img.id,
        title: img.title,
        url: img.images.downsized_medium.url
    }));
    
    return gifs;
}
```

- Prueba:
``` js
import { getGifs } from '../../src/helpers/getGifs';

describe('Pruebas en getGifs()', () => {
    
    test('debe de retornar un arreglo de gifs', async() => {

        const gifs = await getGifs('One Punch');
        expect( gifs.length ).toBeGreaterThan( 0 );
        expect( gifs[0] ).toEqual({
            id: expect.any( String ),
            title: expect.any( String ),
            url: expect.any( String ),
        });
        
    });

});
```

## 4. Pruebas del componente AddCategory
- Componente:
    - El componente cuenta on useState y métodos.

``` jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

export const AddCategory = ({ onNewCategory }) => {

    const [ inputValue, setInputValue ] = useState('');

    const onInputChange = ({ target }) => {
        setInputValue( target.value );
    }

    const onSubmit = ( event ) => {
        event.preventDefault();
        if( inputValue.trim().length <= 1) return;

        // setCategories( categories => [ inputValue, ...categories ]);
        setInputValue('');
        onNewCategory( inputValue.trim() );
    }

    return (
        <form onSubmit={ onSubmit } aria-label="form">
            <input 
                type="text"
                placeholder="Buscar gifs"
                value={ inputValue }
                onChange={ onInputChange }
            />
        </form>
    )
}



AddCategory.propTypes = {
    onNewCategory: PropTypes.func.isRequired,
}
```

- Pruebas:
    - Debido a que se usan propTypes ya se tiene la evaluación de que las props no sean undefined.
    1. Evaluar que cambie el valor de la caja de texto.
        - Se usa fireEvent y tener la referencia del elemento (una input de tipo text su role es textbox).
            - Se recuerda que al cambiar el valor se tiene el objeto de event, el cual contiene la propiedad target que contiene la propiedad de value con el valor escrito.
    2. Que se invoque onNewCategory al cambiar texto de la caja. (simular submit de un formulario)
        - Se crea un mock para onNewCategory, el cual en el componente es la función set de useState.

``` js
import { fireEvent, render, screen } from '@testing-library/react';
import { AddCategory } from '../../src/components/AddCategory';


describe('Pruebas en <AddCategory />', () => {
    
    test('debe de cambiar el valor de la caja de texto', () => {
        
        // Con propTypes en el componente se especifica que la prop siempre debe darse y ser una función
        render( <AddCategory onNewCategory={ () => {} } /> );
        const input = screen.getByRole('textbox');

        // Cambiar valor de input con fireEvent
        fireEvent.input( input, { target: { value: 'Saitama' } });

        expect( input.value ).toBe('Saitama');

    });

    test('debe de llamar onNewCategory si el input tiene un valor', () => {
        
        const inputValue    = 'Saitama';
        const onNewCategory = jest.fn();

        render( <AddCategory onNewCategory={ onNewCategory } /> );

        const input = screen.getByRole('textbox');
        const form  = screen.getByRole('form'); // El form debe tener un aria-label o algún otro atributo con el valor que se usa para buscarlo.

        fireEvent.input( input, { target: { value: inputValue } });
        fireEvent.submit( form );
        // screen.debug();
        expect( input.value ).toBe('');

        expect( onNewCategory ).toHaveBeenCalled();
        expect( onNewCategory ).toHaveBeenCalledTimes(1);
        expect( onNewCategory ).toHaveBeenCalledWith( inputValue );

    });

    test('no debe de llamar el onNewCategory si el input está vació', () => {
        
        const onNewCategory = jest.fn();
        render( <AddCategory onNewCategory={ onNewCategory } /> );

        const form = screen.getByRole('form');
        fireEvent.submit( form );

        expect( onNewCategory ).toHaveBeenCalledTimes(0);
        expect( onNewCategory ).not.toHaveBeenCalled();

    });


});
```

## 5. Pruebas del componente GifGrid - mock customHook 

- Componente

``` js
import PropTypes from 'prop-types';

import { GifItem } from './GifItem';
import { useFetchGifs } from '../hooks/useFetchGifs';

export const GifGrid = ({ category }) => {

    const { images, isLoading } = useFetchGifs( category );
    
    return (
        <>
            <h3>{ category }</h3>
            {
                isLoading && ( <h2>Cargando...</h2> )
            }
            

            <div className="card-grid">
                {
                    images.map( ( image ) => (
                        <GifItem 
                            key={ image.id } 
                            { ...image }
                        />
                    ))
                }
                
            </div>

        </>
    )
}


GifGrid.propTypes = {
    category: PropTypes.string.isRequired,
}

```

- Pruebas:
    - useFetchGifs se va a evaluar sus pruebas de archivo, no es responsabilidad de GifGrid evaluarlo. Entonces, se usa un mock.
        - El Mock se crea pasando el path en donde está el customHook a jest.mock. Esto hace un mock completo del path que se pasa.
            - Al hacer esto entonces en cada test suit se debe especificar cómo va a funcionar ese hooks.
    1. Evaluar que loading debe estar inicialmente.

``` js
import { render, screen } from '@testing-library/react';
import { GifGrid } from '../../src/components/GifGrid';
import { useFetchGifs } from '../../src/hooks/useFetchGifs';

jest.mock('../../src/hooks/useFetchGifs');


describe('Pruebas en <GifGrid />', () => {
    
    const category = 'One Punch';

    test('debe de mostrar el loading inicialmente', () => {

        useFetchGifs.mockReturnValue({
            images: [],
            isLoading: true
        });


        render( <GifGrid category={ category } /> );
        expect( screen.getByText( 'Cargando...' ) );
        expect( screen.getByText( category ) );

    });

    test('debe de mostrar items cuando se cargan las imágenes useFetchGifs', () => {
        
        const gifs = [
            {
                id: 'ABC',
                title: 'Saitama',
                url: 'https://localhost/saitama.jpg'
            },
            {
                id: '123',
                title: 'Goku',
                url: 'https://localhost/goku.jpg'
            },
        ]

        useFetchGifs.mockReturnValue({
            images: gifs,
            isLoading: false
        });

        render( <GifGrid category={ category } /> );
        expect( screen.getAllByRole('img').length ).toBe(2);
        


    });


});
```

## 6. Prueba sobre customHooks
- Hook
``` js
import { useEffect, useState } from 'react';
import { getGifs } from '../helpers/getGifs';

export const useFetchGifs = ( category ) => {
 
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState( true );

    const getImages = async() => {
        const newImages = await getGifs( category );
        setImages(newImages);
        setIsLoading(false);
    }
    
    useEffect( () => {
        getImages();
    }, []);



    return {
        images,
        isLoading
    }

}

```

- Pruebas:
    - Los hooks necesitan de los ciclos de vida dados por react, por lo que no se pueden usar fuera de un componente.
        - Se hacen pruebas por medio de renderHook dado por @testing-library/react.
        - Este método antes estaba un paquete de terceros, pero después de una determianda versión de React se fusionaron y ahora viene por defecto en la librería.
            - Este método retorna 3 cosas:
                - rerender.
                - result.
                - unmount
    - Ya que se tiene useEffect se debe esperar a que el hook se actualice con los valores que se le están pasando, por lo que para la segunda prueba se usa el método waitFor.
        - En su segundo argumento se puede definir un timeout.
            - Esto sirve para que si por alguna razón no ocurre el cambio, entonces el timeout va a disparar el error si se acaba el tiempo. Por defecto está a 1 segundo.
        - En el primer argumento se usa una expresión de jest para que esté al pendiente cuándo sucede el cambio.

``` ts
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchGifs } from '../../src/hooks/useFetchGifs';


describe('Pruebas en el kook useFetchGifs', () => {
    
    test('debe de regresar el estado inicial', () => {

        const { result } = renderHook( () => useFetchGifs('One Punch') );
        const { images, isLoading } = result.current;
        
        expect( images.length ).toBe(0);
        expect( isLoading ).toBeTruthy();

    });

    test('debe de retornar un arreglo de imagenes y isLoading en false', async() => {

        const { result } = renderHook( () => useFetchGifs('One Punch') );
        
        await waitFor(
            () => expect( result.current.images.length ).toBeGreaterThan(0)
        );
                
        const { images, isLoading } = result.current;
        
        expect( images.length ).toBeGreaterThan(0);
        expect( isLoading ).toBeFalsy();

    });

});
```