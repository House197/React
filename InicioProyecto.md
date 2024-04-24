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
- Trazar ruta crítica antes de hace testing.
    - Empezar testing con componentes que menos dependencias tienen. (Pruebas atómicas.)
- No evaluar el body de la respuesta de una API.
    - La API puede cambiar en cualquier momento, por lo que no se debe evaluar el body.
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