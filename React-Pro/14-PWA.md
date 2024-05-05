# Sección 14. Aplicación de React y Backend para PWA
## Temas
1. Tener una aplicación real de React
2. Tener un backend y base de datos
3. Tener una introducción a las PWAs

## 1. Introducción a las PWAs y Service Workers
- Aplicación web progresiva.
    - Progressive Web Application
- Un Service Workers es lo que transforma una app en PWA.
- PWA está destinada a mejorar la experiencia de usuario.
- PWA puede ofrecer lo siguiente:
    1. Acceso a la aplicación sin conexión.
    2. Creación de base de datos local.
        - Su función es guardar los posteos para cuando haya conexión a internet mandarlos a la db de producción.
    3. Push Notifications.
    4. Uso de recursos nativos como la cámara y GPS.
    5. Sincronización en segundo plano.

- Después de realizar la primera petición al servidor para traer la aplicación al navegador el Service Worker cambia la forma en la que la app interactúa con el servidor.
    - Service Worker funciona como un proxy en el background.
    - Puede realizar lo siguiente:
        1. Intercepta peticiones.
        2. Está pendiente de notificaciones push.
        3. Corre en segundo plano.
        4. Maneja el caché.
- Se tienen las siguientes consideraciones:
    1. Servido en protocolo HTTPS.
    2. Funciona localmente "localhost:xxxx"
    3. No funciona en desarrollo "npm start"

# Sección 15. React + PWA
## Temas
1. Service Worker
2. Caché
3. Instalación
4. Fetch
5. Estrategias del caché
6. Network first
7. Cache Only
8. Network first with cache fallback

## 1. Levantar procesos frontend
- Cada que se hace el buil de la app en el frontend se debe generar de nuevo el service worker.
    - Esto es porque los archivos de la carpeta estática en public pueden cambiar. Por ejemplo, los chunks creados tienen un hash que js crea para evitar que los navegadores web mantenga en caché a la aplicación. Esto es porque cuando se genera un nuevo dist entoncecs se tienen cambios en la app, por lo que se desea cargar una nueva versión en lugar de usar los mismos archivos que el navegador pueda tener en caché.

1. Crear build de producción.
    - El Service Worker va a trabajar con el build, no con npm start. Entonces, se debe desplegar el build para ver cómo funciona. 
    - Al crear el build se tienen sugerencias usar serve para tener un server estático, el cual en windows se debe instalar en powershell como admin

```bash
  yarn global add serve
```

2. Se despliege el build ejecutando el comando en el root de la app.

```bash
  serve -s build
```

## 2. Manual - Descarga e instalación de SW
- Al entar por primera vez a una app con PWA no se tiene nada en caché sobre esa app ni tampoco tiene el Service Worker, entonces primero se instala cuando se recibe el request.
    - Luego pasa al proceso de activación.
    - Entonces, se tienen dos ciclos de vida:
        1. Instalación.
            - Descarga de Service Worker.
                - Hay un punto de service worker que tiene su ciclo de vida, en el cual se pueden hacer descargas e instalaciones dentro del caché (disco duro de la computadora cliente).
        2. Activación.
            - El Service Worker se vuelve el proxy.
                - Es decir, la app pasa primero por el service worker antes que al servidor.

- Actualización de service worker
    - Cuando se hace un request nuevo teniendo ya un SW existente (se recarga el browser o algo que haga una nueva solicitud de un SW), el nuevo SW no se activa de forma inmediata.
        - Se hace la instalación, se hacen las actualizaciones respectivas así como las descargas.
        - Luego pasa a la fase de espera, en donde espera a que se cierre el navegador web (que se deje de ocupar la app) para que el nuevo SW pueda entrar en acción cuando alguien intente entrar al sitio web de nuevo.
    - No se recomienda saltarse la parte de espera (skip waiting), ya que el SW existente puede estar realizando procesos importantes, por lo que se recomienda esperar a que el servidor termine para que el nuevo SW pueda entrar.

### Alcance y control
- Si el service worker se instalará en un path como el siguiente, el SW va a tener control después del último slash.
    - //example.com/foo
- Usualmente se desea instalar en el mismo nivel en donde está la aplicación de React.
    - build -> static -> service-worker.ts

## 3. Recomendaciones de qué poner en caché
### Caché only
- Una vez está en el caché jamás va a salir a internet la app.
    - Evita el consumo extremo de recursos de internet (es posible solo tener un plan limitado de datos).
1. CND, los cuales son links colocados en el index.html, tal como el del bootstrap.
    - Esto sucede ya que el CDN nunca va a cambiar, por lo que no hay necesidad de siempre estar descargando ese recurso cada que se ingresa a la app.

### Network First With Caché Fallback
- Verifica si hay conexión a internet, si la tiene entonces que se prosiga con la solicitud.
    - Si no logra llegar debido a que no hay conexión, si ya se había hecho una solicitud antes exitosa entonces se pudo haber almaceado esa respuesta en caché y retornarla como fallback.
1. Para peticiones al servidor, tal como el caso de entrar a una app y que se hace una petición para validar si el usuario está autenticado; es decir, validar el JWT (api/auth/renew).

```js
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});









// Any other custom service worker logic can go here.

self.addEventListener( 'install', async( event ) => {

  const cache = await caches.open('cache-1')

  await cache.addAll([
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css',
    '/favicon.ico'
  ])

});



const apiOfflineFallbacks = [
  'http://localhost:4000/api/auth/renew',
  'http://localhost:4000/api/events'
]

self.addEventListener( 'fetch', ( event ) => {

  // console.log( event.request.url );

  // if ( event.request.url !== 'http://localhost:4000/api/auth/renew' ) return;
  if ( !apiOfflineFallbacks.includes( event.request.url ) ) return;

  const resp = fetch( event.request )
      .then( response => {

        if ( !response ) {
          return caches.match( event.request )
        }
        
        // Guardar en caché la respuesta
        caches.open('cache-dynamic').then( cache => {
          cache.put( event.request, response )
        })

        
        return response.clone();
      })
      .catch( err => {
        console.log('offline response');
        return caches.match( event.request )
      })


    event.respondWith( resp );

});
```

## 4. Eventos de SW
- install
- fetch

# Sección 16. Workbox
Workbox es una herramienta que compro Google y ahora le da soporte, que permite configuraciones poderosas, rápidas y fáciles para el manejo de nuestras PWAs.

## Temas
1. Detectar Online y Offline desde React
2. Workbox
    1. Wizard
    2. Estrategias
    3. Background Sync
    4. IndexedDB
    5. Offline CRUD
3. Optimizaciones de nuestro service worker

## 1. Workbox CLI - Wizard
https://developer.chrome.com/docs/workbox/
https://developer.chrome.com/docs/workbox/modules/workbox-cli
1. Descargar CLI de forma global. En Windows hacerlo desde PowerShell como admin.

```bash
npm install workbox-cli --global
```

2. Crear build de aplicación.

```bash
npm run build
```

3. Ejecutar siguiente comando en root de app y seleccionar carpeta de build.
  - Idealmente se desea que todo esté en caché, por lo que se selecciona todo después de la opción de la carpeta deseada.

```bash
workbox wizard
```

```
? What is the root of your web app (i.e. which directory do you deploy)? build/
? Which file types would you like to precache? json, ico, html, png, txt, css, js
? Where would you like your service worker file to be saved? build/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?sourc
e=pwa')? No
```

4. Build SW.

```bash
workbox generateSW workbox-config.js
```

5. Especificar el uso del SW en index.html ubicado en public.

```html
    <script>
      const isProduction = ('%NODE_ENV%' === 'production');

      if(isProduction && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
      }
    </script>
```

6. Crear build de producción nuevamente.
7. Generar serviceWorker de nuevo.
```bash
workbox generateSW workbox-config.js
```
8. Servir app.
``` bash 
serve -s build
```

## Nota Vite
Aca como en package.json esta definido "type": "module" hay que renombrar el archivo "workbox-config.js" a "worbox-config.cjs" para indicarle que es un CommonJS module.

## 2. Workbox SW Manual
- Permitirá tener control sobre el SW y aplciar técnicas de cache.
1. src -> sw.template.js
  - Plantilla de lo que se desea wl workbox tome y use para construir el SW.
  - importScript es similar a require en node.
  - Lo que se debe importar se encuentra acá: https://developer.chrome.com/docs/workbox/modules/workbox-sw/
  - Se le indica que revise el directorio en el que está y que instale todo lo que está en el pre cache, o todo lo que se le esté definiendo en workbox-config.js

```javascript
importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );
```

2. Indicar swSrc en workbox-config.js. Se comenta ignoreURL...
```js
module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{json,ico,html,png,txt,css,js}'
	],
	swDest: 'build/sw.js',
	swSrc: 'src/sw.template.js'
/* 	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	] */
};
```

3. El anterior comando de generación ya no funcionará debido a la propiedad swSrc. Se usa el siguiente.

```bash 
workbox injectManifest
```

4. Colocar este comando en scripts package.json y llamarlo en build para automatizar la creación del SW.

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build && npm run PWA",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "PWA": "workbox injectManifest"
  },
```

## 3. Workbox Cache Manual
1. Se usa registerRoute en sw.template.js para indicar que cuando se pase por la ruta deseada se use CacheFirst.
  - Se usa para guardar en caché los enlaces de bootstrape en index.html en public.

```js
importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;

registerRoute(
    new RegExp('https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'),
    new CacheFirst()
);

registerRoute(
    new RegExp('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'),
    new CacheFirst()
);

```

2. Volver a construir PWA, ya solo cambió sw.template.js y no la app.
```bash 
npm run PWA
```

## 4. Verificación de Token offline
1. Crear dos nuevas rutas en sw.template.js

``` js
importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst,  } = workbox.strategies;

registerRoute(
    new RegExp('http://localhost:4000/api/auth/renew'),
    new NetworkFirst()
);

registerRoute(
    new RegExp('http://localhost:4000/api/events'),
    new NetworkFirst()
);

registerRoute(
    new RegExp('https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'),
    new CacheFirst()
);

registerRoute(
    new RegExp('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'),
    new CacheFirst()
);
```

## 5. Background Sync - Posteos sin conexión
- No se debe pasar de 30 megas en la DB del navegador (caché).
1. Cargar módulo en sw.template.js
2. Destructurar BackgroundSyncPlugin.
3. Definir instancia BackgroundSyncPlugin para colocar el nombre del caché y la retención máxima.
4. Registrar rutas, especificar método HTTP y estrategia NetworkOnly.

```js
workbox.loadModule('workbox-background-sync');
const { BackgroundSyncPlugin } = workbox.backgroundSync;

const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;

// Posteos offline
const bgSyncPlugin = new BackgroundSyncPlugin('posteos-offline', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});
  

registerRoute(
    new RegExp('http://localhost:4000/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'DELETE'
);

registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'PUT'
);
```

## 6. Optimizar service worker
- Register Router acepta un callback como primer argumento, en donde si regesa true entonces aplica el código definido.
- En cache storage de la consola del navegador (ubicado en la pestaña de application) se aprecia que se tienem em caché ñas ruta sy los urls de bootstrap.
  - Para guardar los segmentos de bootstrap como cdn se utiliza url.href en lugar de url.pathname

```js
importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.loadModule('workbox-background-sync');

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

const cacheNetworkFirst = [
    '/api/auth/renew',
    '/api/events'
]

registerRoute(
    ({request, url}) => {
        return cacheNetworkFirst.includes(url.pathname);
    },
    new NetworkFirst()
);

// registerRoute(
//     new RegExp('http://localhost:4000/api/events'),
//     new NetworkFirst()
// );

const cacheFirst= [
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'
]

registerRoute(
    ({request, url}) => {
        return cacheFirst.includes(url.href);
    },
    new CacheFirst()
);

// registerRoute(
//     new RegExp('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'),
//     new CacheFirst()
// );

// Posteos offline
const bgSyncPlugin = new BackgroundSyncPlugin('posteos-offline', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});
  

registerRoute(
    new RegExp('http://localhost:4000/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'DELETE'
);

registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'PUT'
);
```

## 7. Reaccionar en React si se está online o no
1. Instalar paquete.

```bash
npm i react-detect-offline
```

2. Usarlo en el componente deseado, siendo en este caso en Navbar.
  - Se usa Offline y Online del paquete.