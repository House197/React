# Inicio de proyecto
## 1. Crear proyecto con Vite
``` bash
npm create vite
```
## 2. Limpiar directorio src (Opcional)
1. Limpiar directorio y dejar solo main.tsx.
    - Crear estilos globales en style.css y vincularlo en main.tsx

## 3. Instalar módulos de node

``` bash
npm i
```

## 3. Opcional. Instalar prop-types
``` bash
npm i prop-types
```

# Configurar ambiente de pruebas
https://gist.github.com/Klerith/ca7e57fae3c9ab92ad08baadc6c26177
https://gist.github.com/Klerith/b2eafa2a5fb9f09d6d043781be976e06 - Contiene temas de CSS
- Trazar ruta crítica antes de hace testing.
    - Empezar testing con componentes que menos dependencias tienen. (Pruebas atómicas.)
- No evaluar el body de la respuesta de una API.
    - La API puede cambiar en cualquier momento, por lo que no se debe evaluar el body.

## 0. Variables de entorno
- Se tienen algunas variables de entorno, las cuales se pueden ver con:

``` js
import.meta.env
```

1. Se crea el archivo .env, la cual habrá para producción y otra para testing.
2. Para que el cliente pueda ver las variables de entorno se debe anteponer la palabra VITE.
  - Esto no sucede en el backend, en donde las env son visibles sin importar el nombre.

``` 
VITE_HOLA=Mundo en Testing!!
VITE_JWT_SEED=ABSDKJASHDKJASDHJKAS12312

VITE_APIKEY=AIzaSyDyLJugXH7YFgmHb-rMLYlxT1YwtkgYR7E
VITE_AUTHDOMAIN=tracker-8f49f.firebaseapp.com
VITE_DATABASEURL=https://tracker-8f49f.firebaseio.com
VITE_PROJECTID=tracker-8f49f
VITE_STORAGEBUCKET=tracker-8f49f.appspot.com
VITE_MESSAGINGSENDERID=145943821416
VITE_APPID=1:145943821416:web:12e973eaa8b630a444cfdd

```

- En la parte de testing las variables de entorno ya nos las controla VITE, sino que ahora JEST.
  - En estos momentos import.meta.env no es válido en JEST.

3. Centralizar variables de entorno.
  1. src -> helpers -> getEnvironments.js

``` js


export const getEnvironments = () => {

    import.meta.env;

    return {
        ...import.meta.env
    }


}
```

- De esta forma, ya se pueden usar en cualquier lado del frontend, tal como en el archivo config de firebase.


``` js
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getEnvironments } from '../helpers/getEnvironments';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const {
  VITE_APIKEY,
  VITE_AUTHDOMAIN,
  VITE_DATABASEURL,
  VITE_PROJECTID,
  VITE_STORAGEBUCKET,
  VITE_MESSAGINGSENDERID,
  VITE_APPID,
} = getEnvironments();


// console.log(process.env);
// console.log( import.meta.env );


// Your web app's Firebase configuration
// Dev/Prod
// const firebaseConfig = {
  // apiKey: "AIzaSyC9qM8LKYti4TZus0g00ISzMjudet-H2vg",
  // authDomain: "react-cursos-4368a.firebaseapp.com",
  // projectId: "react-cursos-4368a",
  // storageBucket: "react-cursos-4368a.appspot.com",
  // messagingSenderId: "35683178704",
  // appId: "1:35683178704:web:2cab2003319bbac2eba6d5"
// };

// Testing
// const firebaseConfig = {
//   apiKey: "AIzaSyDyLJugXH7YFgmHb-rMLYlxT1YwtkgYR7E",
//   authDomain: "tracker-8f49f.firebaseapp.com",
//   databaseURL: "https://tracker-8f49f.firebaseio.com",
//   projectId: "tracker-8f49f",
//   storageBucket: "tracker-8f49f.appspot.com",
//   messagingSenderId: "145943821416",
//   appId: "1:145943821416:web:12e973eaa8b630a444cfdd"
// };

const firebaseConfig = {
  apiKey: VITE_APIKEY,
  authDomain: VITE_AUTHDOMAIN,
  databaseURL: VITE_DATABASEURL,
  projectId: VITE_PROJECTID,
  storageBucket: VITE_STORAGEBUCKET,
  messagingSenderId: VITE_MESSAGINGSENDERID,
  appId: VITE_APPID,
};

// Initialize Firebase
export const FirebaseApp  = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth( FirebaseApp );
export const FirebaseDB   = getFirestore( FirebaseApp );
```

4. Cargar mock con la configuración de las variables de entorno del archivo .env.test.
  1. Instalar paquete de dotenv solo para desarrollo.

``` bash
npm i -D dotenv
```

- En jest.setup.js se configura dotenv y se hace el mock del archivo de configuración de las variables de entorno.
  - En este caso se hace un callback para que cuando se haga una solicitud al archivo de getEnvironments en el lado de testing, se retoran una función que da un objeto de da todas las variables que están en process.env

``` js
// En caso de necesitar la implementación del FetchAPI
import 'whatwg-fetch'; // <-- yarn add whatwg-fetch
import 'setimmediate';


require('dotenv').config({
    path: '.env.test'
});

jest.mock('./src/helpers/getEnvironments', () => ({
    getEnvironments: () => ({ ...process.env })
}));

```


  
## En proyectos de React + Vite

1. Instalaciones:
``` bash
npm i -D jest babel-jest @babel/preset-env @babel/preset-react 
npm i -D @testing-library/react @types/jest jest-environment-jsdom
```

2. Opcional: Si usamos Fetch API en el proyecto:
``` bash
npm i -D whatwg-fetch
```

3. Actualizar los scripts del __package.json__

``` json
"scripts: {
  ...
  "test": "jest --watchAll"
```

4. Crear la configuración de babel __babel.config.js__

``` js
module.exports = {
    presets: [
        [ '@babel/preset-env', { targets: { esmodules: true } } ],
        [ '@babel/preset-react', { runtime: 'automatic' } ],
    ],
};
```

5. Opcional, pero eventualmente necesario, crear Jest config y setup:

__jest.config.js__
``` js
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js']
}
```

__jest.setup.js__
``` js
// En caso de necesitar la implementación del FetchAPI, ya que no está en versiones antes a la 18 de node
import 'whatwg-fetch'; // <-- yarn add whatwg-fetch
```

## Cambiar extensión de archivos a cs
- Puede que salga el error **You appear to be using a native ECMAScript module configuration file, which is only supported when running Babel asynchronously**, se debe cambiar la extensión de los archivos js a cs:
    - jest.config.js
    - babel.config.js

## Instalar React Router si es que se ocupa
https://github.com/Klerith/react-heroes.git
- Solo se necesita react-router-dom para la app.

``` bash
npm install react-router-dom #localforage match-sorter sort-by
```

2. Envolver main.jsx con BrowserReact.


__main.tsx__
``` ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { HeroesApp } from './HeroesApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HeroesApp />
    </BrowserRouter>
  </React.StrictMode>
);

```

- Mas información en proyecto 14.SinglePageApplication

## Clonar rama de github
git clone --branch fin-seccion-8 https://github.com/Klerith/react-gif-expert.git

# Redux
https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
https://redux-toolkit.js.org/

1. Instalar

``` bash
npm install @reduxjs/toolkit react-redux
```

- Puede que la versión de Redux dé problemas de compatibilidad dependiendo la versión de React. Al momento de escribir esto lo hubo, por lo que se ajustó la versión de las dependencias de redux:

``` json
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@reduxjs/toolkit": "^1.8.1",
    "react-redux": "^8.0.1"
  },
```

## Template slice
- Se puede crear un snippet en VS Code
1. CTRL + Shift + P
2. Buscar Configure User Snippets
3. Escribir javascript. (también se tiene una para react, pero este snippet de slice no va a ser un jsx).
  - Se debe tener cuidado ya que no permite tabulaciones
  - Se comenta cada línea y se coloca una coma al final de cada lína, menos la última del código.

``` js
{
	"Crear un slice de Redux": {
		"prefix": "redux-slice",
		"body": [
			"import { createSlice } from '@reduxjs/toolkit';",
			"",
			"export const ${1:template}Slice = createSlice({",
			"   name: 'name',",
			"   initialState: {",
			"      counter: 10",
			"   },",
			"   reducers: {",
			"      increment: (state, /* action */ ) => {",
			"         state.counter += 1;",
			"      },",
			"   }",
			"});",
			"",
			"",
			"// Action creators are generated for each case reducer function",
			"export const { increment } = ${1:template}Slice.actions;"
		],
		"description": "Crear un slice de Redux"
	}
}
```

``` js
import { createSlice } from '@reduxjs/toolkit';

export const templateSlice = createSlice({
    name: 'name',
    initialState: {
        counter: 10
    },
    reducers: {
        increment: (state, /* action */ ) => {
            //! https://react-redux.js.org/tutorials/quick-start
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.counter += 1;
        },
    }
});


// Action creators are generated for each case reducer function
export const { increment } = templateSlice.actions;
```

## 1. Implementar store
- src -> store -> store.js

## 2. Envolver app con proveedor de Redux
## 3. Crear slices
## 4. Colocar reducers crados por slices en store






https://www.restapitutorial.com/httpstatuscodes.html#google_vignette