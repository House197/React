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