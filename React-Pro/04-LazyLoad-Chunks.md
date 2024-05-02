# Sección 4. LazyLoad - Chunks
## Temas
1. Aplicar Lazy Load en cada Componente
2. Aplicar Lazy Load por módulo

La idea del módulo es que nos permita cargarlo y todas sus dependencias en conjunto.
- Se crea una aplicación que navega a 3 rutas, en donde se considera a cada ruta como un módulo de la aplicación al cual se le aplicará lazyload.
    - Se prefiere aplicar lazyload por módulos en lugar de hacerlo granular.

## 1. Configurar Navigation
1. src -> routes -> Navigation.tsx
``` js
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';

import { LazyPage1 } from '../lazyload/pages/LazyPage1';
import { LazyPage2 } from '../lazyload/pages/LazyPage2';
import { LazyPage3 } from '../lazyload/pages/LazyPage3';

export const Navigation = () => {
    return (
        <BrowserRouter>
            <div className="main-layout">
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/lazy1" className={ ({ isActive }) => isActive ? 'nav-active' : '' }>Lazy 1</NavLink>
                        </li>
                        <li>
                            <NavLink to="/lazy2" className={ ({ isActive }) => isActive ? 'nav-active' : '' }>Lazy 2</NavLink>
                        </li>
                        <li>
                            <NavLink to="/lazy3" className={ ({ isActive }) => isActive ? 'nav-active' : '' }>Lazy 3</NavLink>
                        </li>
                    </ul>
                </nav>


                <Routes>
                    <Route path="lazy1" element={ <LazyPage1 /> } />
                    <Route path="lazy2" element={ <LazyPage2 /> } />
                    <Route path="lazy3" element={ <LazyPage3 /> } />
                    
                    <Route path="/*" element={ <Navigate to="/lazy1" replace /> } />
                </Routes>

            </div>
        </BrowserRouter>
    )
}
```

## 2. Crear componentes que se usarán para lazyload
1. src -> lazyload -> pages

## 3. Crear archivo de rutas independiente
1. src -> routes -> routes.ts

``` ts
import { LazyPage1 } from "../lazyload/pages/LazyPage1";
import { LazyPage2 } from "../lazyload/pages/LazyPage2";
import { LazyPage3 } from "../lazyload/pages/LazyPage3";

interface Route {
    to: string, 
    path: string,
    Component: () => JSX.Element,
    name: string,
}

export const routes: Route[] = [
    {
        to: '/lazy1',
        path: 'lazy1',
        Component: LazyPage1,
        name: 'Lazy-1'
    },
    {
        to: '/lazy1',
        path: 'lazy1',
        Component: LazyPage2,
        name: 'Lazy-2'
    },
    {
        to: '/lazy1',
        path: 'lazy1',
        Component: LazyPage3,
        name: 'Lazy-3'
    }
];
```

## 4. Refactorizar Navigation para usar Routes usando map

``` tsx
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { routes } from './routes';

export const Navigation = () => {
    return (
        <BrowserRouter>
            <div className="main-layout">
                <nav>
                    <ul>
                        {
                            routes.map(({to, name}) =>  (
                                <li key={name}>
                                    <NavLink to={to} className={ ({ isActive }) => isActive ? 'nav-active' : ''}>{name}</NavLink>
                                </li>
                            ))
                                
                        }
                    </ul>
                </nav>


                <Routes>
                    {
                        routes.map(({path, Component}) => <Route key={path} path={path} element={<Component />} />)
                    }
                    
                    <Route path="/*" element={ <Navigate to={routes[0].to} replace /> } />
                </Routes>

            </div>
        </BrowserRouter>
    )
}

```

## 5. Lazyload y Suspense
1. Crear componente que se carga bajo demanda
    1. src -> routes -> routes.ts
    - Se usa el método de react lazy para cargar el componente deseado.
    - Los componentes que van a ser cargados por LazyLoad deben ser exportados como default.

__LazyPage1.tsx__

``` tsx
const LazyPage1 = () => {
  return (
    <div>
      LazyPage 1
    </div>
  )
}

export default LazyPage1;
```

__routes.ts__

``` ts
import { lazy, LazyExoticComponent } from "react";

type JSXComponent = () => JSX.Element;

interface Route {
    to: string, 
    path: string,
    Component: LazyExoticComponent<JSXComponent> | JSXComponent,
    name: string,
}

const Lazy1 = lazy(() => import('../lazyload/pages/LazyPage1'));
const Lazy2 = lazy(() => import('../lazyload/pages/LazyPage2'));
const Lazy3 = lazy(() => import('../lazyload/pages/LazyPage3'));



export const routes: Route[] = [
    {
        to: '/lazy1',
        path: 'lazy1',
        Component: Lazy1,
        name: 'Lazy-1'
    },
    {
        to: '/lazy2',
        path: 'lazy2',
        Component: Lazy2,
        name: 'Lazy-2'
    },
    {
        to: '/lazy3',
        path: 'lazy3',
        Component: Lazy3,
        name: 'Lazy-3'
    }
];
```

2. Implementar Suspense Fallback, el cual es un componente de React.
    - Se utiliza para indicarle al usuario que se cargan los componente. De lo contrario, marca un error si no se define el suspense ya que no existiría un fallback UI mientras se renderizan los componentes.
    - Se envuelve a BrowserRouter con Suspense.

__Navigation.tsx__
``` tsx
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { Suspense } from 'react';

export const Navigation = () => {
    return (
        <Suspense fallback={<span>Loading...</span>} >
            <BrowserRouter>
                <div className="main-layout">
                    <nav>
                        <ul>
                            {
                                routes.map(({to, name}) =>  (
                                    <li key={name}>
                                        <NavLink to={to} className={ ({ isActive }) => isActive ? 'nav-active' : ''}>{name}</NavLink>
                                    </li>
                                ))
                                    
                            }
                        </ul>
                    </nav>


                    <Routes>
                        {
                            routes.map(({path, Component}) => <Route key={path} path={path} element={<Component />} />)
                        }
                        
                        <Route path="/*" element={ <Navigate to={routes[0].to} replace /> } />
                    </Routes>

                </div>
            </BrowserRouter>
        </Suspense>
    )
}

```


3. Inspeccionar en la consola del navegador, en Network.
    - Se aprecian los assets que se van cargando a la app. 
    - Al cargar un componente lazu por primera vez hace que se vea un flash, pero al regresar a componentes que ya fueron cargados ya no aparece el flash. El flash se debe a que si en suspense se coloca un flashback null entonces renderiza un componente nulo en lo que hace la carga. Por esta razón se coloca un span con el mensaje de Loading.

## 6. Renombrar chunks
- Se útil renombrar los chunks para cuando se quieren aplicar estrategias de caché, para sacar estadísticas PWA para ver por qué un componente pesa más.
- Se coloca el nombre deseado en donde se define la carga del componente como lazy (routes/routes.ts)
    - Se coloca webpack ya que trabaja por medio de webpack.

``` ts
const Lazy1 = lazy(/* webpackChunkName: "LazyPage1" */() => import('../lazyload/pages/LazyPage1'));
const Lazy2 = lazy(/* webpackChunkName: "LazyPage2" */() => import('../lazyload/pages/LazyPage2'));
const Lazy3 = lazy(/* webpackChunkName: "LazyPage3" */() => import('../lazyload/pages/LazyPage3'));
```

## 7. Nested Lazy Routes
- Se definen las rutas que maneja cada módulo de la app.

1. src -> lazyload -> layout -> LazyLayout.tsx
    - Este es un módulo que va a cargar todo lo que contiene a la vez sin aplicar lazy.

``` tsx
import { NavLink, Navigate, Route, Routes } from "react-router-dom"
import LazyPage1 from "../pages/LazyPage1"
import LazyPage2 from "../pages/LazyPage2"
import LazyPage3 from "../pages/LazyPage3"

const LazyLayout = () => {
  return (
    <div>
      <h1>LazyLayout Page</h1>
      <ul>
        <li>
            <NavLink to='lazy1' >Lazy1</NavLink>
        </li>
        <li>
            <NavLink to='lazy2' >Lazy2</NavLink>
        </li>
        <li>
            <NavLink to='lazy3' >Lazy3</NavLink>
        </li>
      </ul>

      <Routes>
        <Route path='lazy1' element={ <LazyPage1 /> } />
        <Route path='lazy2' element={ <LazyPage2 /> } />
        <Route path='lazy3' element={ <LazyPage3 /> } />

        <Route path='*' element={ <Navigate replace to='lazy1' /> } />
      </Routes>
    </div>
  )
}

export default LazyLayout

```

2. En routes/routes.ts se define la carga lazy de LazyLayout y se hacen las configuraciones necesarias para indicar que todo lo que pase por el path de lazyload sea manejado por la ruta.

``` ts
import { lazy, LazyExoticComponent } from "react";

type JSXComponent = () => JSX.Element;

interface Route {
    to: string, 
    path: string,
    Component: LazyExoticComponent<JSXComponent> | JSXComponent,
    name: string,
}

const LazyLayout = lazy(/* webpackChunkName: "LazyLayout" */() => import('../lazyload/layout/LazyLayout'));
const Lazy2 = lazy(/* webpackChunkName: "LazyPage2" */() => import('../lazyload/pages/LazyPage2'));
const Lazy3 = lazy(/* webpackChunkName: "LazyPage3" */() => import('../lazyload/pages/LazyPage3'));



export const routes: Route[] = [
    {
        to: '/lazyload/',
        path: '/lazyload/*', // Se le indica a react que todas las rutas que pasen por lazyload van a ser procesadas acá. Para * se va a tener otro Router.
        Component: LazyLayout,
        name: 'Lazy Layout'
    },
    {
        to: '/lazy2',
        path: 'lazy2',
        Component: Lazy2,
        name: 'Lazy-2'
    },
    {
        to: '/lazy3',
        path: 'lazy3',
        Component: Lazy3,
        name: 'Lazy-3'
    }
];
```