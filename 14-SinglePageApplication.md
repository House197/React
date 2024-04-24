# Sección 14. HeroesApp - Single Page Application (SPA)
## Temas
1. SPA ( Single Page Application ) a profundidad
2. Diferentes temas en la misma aplicación aplicados a diferentes rutas
3. Multiples Routers
4. Push y Replace en el History
5. Leer argumentos por URL
6. QueryParams
7. Aplicar filtros utilizando QueryStrings

## 1. Creación de primer Router
- Se van a tener varios routers.
- Uno se va a dedicar a rutas públicas y otro para privadas.
- Se ocupa la versión V6.

### 1. Instalar dependencia de React Router V6
https://github.com/Klerith/react-heroes.git
- Solo se necesita react-router-dom para la app.

``` bash
npm install react-router-dom #localforage match-sorter sort-by
```

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

3. Configurar rutas.
    - Se prefiere crear un archivo dedicado a eso, ya que otro archivo no tiene la repsonsabilidad de también implementar el router.
    1. src -> router -> AppRouter.tsx

``` js
import { Route, Routes } from 'react-router-dom';

import { HeroesRoutes } from '../heroes';
import { LoginPage } from '../auth';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';



export const AppRouter = () => {
  return (
    <>

        <Routes>
            
            <Route path="login/*" element={
                <PublicRoute>
                  {/* <LoginPage /> */}
                  <Routes>
                    <Route path="/*" element={<LoginPage />} />
                  </Routes>
                </PublicRoute>
              }
            />
            
            
            <Route path="/*" element={
              <PrivateRoute>
                <HeroesRoutes />
              </PrivateRoute>
            } />

            {/* <Route path="login" element={<LoginPage />} /> */}
            {/* <Route path="/*" element={ <HeroesRoutes />} /> */}
            
            

        </Routes>
    
    </>
  )
}

```

4. Crear Pages.
    1. src -> heroes -> pages

5. Colocar AppRouter en HeroesApp.jsx

``` ts
import { AuthProvider } from './auth';
import { AppRouter } from './router/AppRouter';


export const HeroesApp = () => {
  return (
    <AuthProvider>
        
        <AppRouter />
        
    </AuthProvider>
  )
}

```

## 2. NavLink
- ui es otro componente de la aplicación, entonces así como con heroes se le dedica una carpeta.
1. src -> ui -> componentes -> Navbar.jsx

``` js
import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';


export const Navbar = () => {

    const { user, logout } = useContext( AuthContext );
    

    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login', {
            replace: true
        });
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-2">
            
            <Link 
                className="navbar-brand" 
                to="/"
            >
                Asociaciones
            </Link>

            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavLink 
                        className={ ({isActive}) => `nav-item nav-link  ${ isActive ? 'active':'' }` }
                        to="/marvel"
                    >
                        Marvel
                    </NavLink>

                    <NavLink 
                        className={ ({isActive}) => `nav-item nav-link  ${ isActive ? 'active':'' }` }
                        to="/dc"
                    >
                        DC
                    </NavLink>
                    
                    <NavLink 
                        className={ ({isActive}) => `nav-item nav-link  ${ isActive ? 'active':'' }` }
                        to="/search"
                    >
                        Search
                    </NavLink>
                </div>
            </div>

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                <ul className="navbar-nav ml-auto">
                   
                    <span className="nav-item nav-link text-primary">
                        { user?.name }
                    </span>

                    <button
                        className="nav-item nav-link btn"
                        onClick={ onLogout }
                    >
                        Logout
                    </button>

                </ul>
            </div>
        </nav>
    )
}
```

## 3. Creando segundo Router
- Se desea que el Navbar solo aparezca en ventanas que no sean el Login.
- En este caso, se definen rutas para la parte de heroes.

1. src -> heroes -> routes -> HeroesRoutes.jsx
    - Se colocan los componentes que aparecen en las rutas de heroes (solo es el navbar)-
    - Se definen las rutas.

``` js
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui';
import { DcPage, HeroPage, MarvelPage, SearchPage } from '../pages';

export const HeroesRoutes = () => {
  return (
    <>
        <Navbar />

        <div className="container">
            <Routes>
                <Route path="marvel" element={<MarvelPage />} />
                <Route path="dc" element={<DcPage />} />
                
                <Route path="search" element={<SearchPage />} />
                <Route path="hero/:id" element={<HeroPage />} />
                                

                <Route path="/" element={<Navigate to="/marvel" />} />

            </Routes>
        </div>


    </>
  )
}

```

## 4. Navigate push / replace useNavigate
- useNavigate permite usar diferentes métodos para navegar entre la app.
    - Los métodos son proporcionados por Navigation.Provider, pero son accesibles gracias al hook useNavigate.

- Ejemplo de uso en Navbar.jsx
    - React\06-react-heroes\src\ui\components\Navbar.jsx
    - Se usa el campo de replace, el cual evita que la persona pueda regresar al historial anterior ya que se le está reemplazando.
        - Es útil para cuando se hace logput y no se desea que el usuario pueda hacer back a la página anterior. 

``` js
import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';


export const Navbar = () => {

    const { user, logout } = useContext( AuthContext );
    

    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login', {
            replace: true
        });
    }
...
```

## 5. Leer argumentos por URL
- En el Route se define el nombre del parámetro con :url
    - En este caso, en las rutas especificas de héroes (HeroesRoutes.jsx) se establece:

```jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui';
import { DcPage, HeroPage, MarvelPage, SearchPage } from '../pages';

export const HeroesRoutes = () => {
  return (
    <>
        <Navbar />

        <div className="container">
            <Routes>
                <Route path="marvel" element={<MarvelPage />} />
                <Route path="dc" element={<DcPage />} />
                
                <Route path="search" element={<SearchPage />} />
                <Route path="hero/:id" element={<HeroPage />} />
                                

                <Route path="/" element={<Navigate to="/marvel" />} />

            </Routes>
        </div>


    </>
  )
}

```

- Al definir parámetros éstos van a estar disponibles en Route.Provider, lo cual es más fácil acceder a ellos por medio del hook useParams, el cual se va a usar en HeroPage.

``` js
import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getHeroById } from '../helpers';


export const HeroPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const hero = useMemo( () => getHeroById( id ), [ id ]); 

  const onNavigateBack = () => {
    navigate(-1);
  }


  if ( !hero ) {
    return <Navigate to="/marvel" />
  }
```

- Se crea un helper en heroes para poder recuperar el héroes por ID.
    - En este caso el helper a diferencia del de getHeroesByPublisher no se va a lanzar un error si no está, ya que si la persona accede al link directamente entonces si no existe el ID se redirecciona. La redirección se maneja en el componente de HeroPage. Se usa Navigate.
    - En este caso se decide usar useMemo para no llamar a la función si es que el ID no cambia.

``` js
import { heroes } from '../data/heroes';


export const getHeroById = ( id ) => {

    return heroes.find( hero => hero.id === id );
}
```

- Para regresar a la pantalla anterior se usa useNavigate, en donde a la variable en donde se guarda el hook se usa -1 en el argumento.

``` js
  const navigate = useNavigate();

  const hero = useMemo( () => getHeroById( id ), [ id ]); 

  const onNavigateBack = () => {
    navigate(-1);
  }

```

- De igual manera se decide useMemo en getHeoresByPublisher en HeroList.

``` js

import { useMemo } from 'react';
import { HeroCard } from './';
import { getHeroesByPublisher } from '../helpers';

export const HeroList = ({ publisher }) => {

    const heroes = useMemo( () => getHeroesByPublisher( publisher ), [ publisher ]);

    return (
        <div className="row rows-cols-1 row-cols-md-3 g-3">
            {
                heroes.map( hero => (
                    <HeroCard 
                        key={ hero.id } 
                        { ...hero }
                    />
                ))
            }
        </div>
    )
}

```

## 6. Animaciones 
- Animate.css

``` bash
npm i animate.css
```

- Se usan nombres de clases especial en o componentes para agregar la animación.
    - animate__animated animate__fadeIn.

## 7. QueryParameters - SearchComponent
- Los query parameters siempre son opcionales.
- En el componente se usa navigate para actualizar el URL con la query search que escribe el usuario.
- Los query parameters se obtienen de la localización en el html.
    - Se usa el hook useLocation.
        - La variable de location a la cual se le asingna el useLocation contiene la propiedad de search, el cual contiene todo lo que viene después de ? en el url.
        - Se toman los query parameters son la siguiente dependencia:

``` bash
npm i query-string
```

- Se usa queryString, el método parse el cual recibe la propiedad de search de location.
- Se asegura que si se da el botón de atrás al haber hecho búsquedas entonces se inicializa el form con q, de esa forma el url al volver contiene el query search anterior, por lo que se lo pasa al form.

``` js
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string'

import { useForm } from '../../hooks/useForm';
import { HeroCard } from '../components';
import { getHeroesByName } from '../helpers';

export const SearchPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { q = '' } = queryString.parse( location.search );
  const heroes = getHeroesByName(q);

  const showSearch = (q.length === 0);
  const showError  = (q.length > 0) && heroes.length === 0;


  const { searchText, onInputChange } = useForm({
    searchText: q // Permite  'guardar' la búsqueda si se hace back a la pantalla después de haber hecho varias búsquedas.
  });



  const onSearchSubmit = (event) =>{
    event.preventDefault();
    // if ( searchText.trim().length <= 1 ) return;
    navigate(`?q=${ searchText }`);
  }
```

# Sección 15. Protección de rutas
## Temas
1. Rutas públicas
2. Rutas privadas
3. Login y logout - Sin backend aún
4. Recordar cuál fue la última ruta visitada para mejorar la experiencia de usuario.
5. Context
6. Reducer

## 1. Context y Reducer de la aplicación
- Se usará para la autenticación del usuario.
- Esta lógica se colocará en la carpeta de auth.
### 1. Reducer
1. Se crea la carpeta types dentro de auth.
    - El archivo types.js sirve para tener centralizado el nombre de las acciones para el reducer en un objeto, previniendo errores a la hora de escribir el nombre de las acciones.

``` js
export const types = {
    login:  '[Auth] Login',
    logout: '[Auth] Logout',
}
``` 

2. Definir reducer. auth -> context -> authReducer.js

``` js
import { types } from '../types/types';

export const authReducer = ( state = {}, action ) => {


    switch ( action.type ) {

        case types.login:
            return {
                ...state,
                logged: true,
                user: action.payload
            };

        case types.logout:
            return {
                logged: false,
            };
    
        default:
            return state;
    }

}
```


### 2. Context
1. Se crea context -> AuthContext.jsx, la cual solo sirve para crear e importar el contexto

``` jsx
import { createContext } from 'react';


export const AuthContext = createContext();
```

2. Crear context -> AuthProvider.jsx
    - El provider creará el componente de orden superior que pasará los valores del context. Por otro lado, se implementa también el reducer en el provider.

``` jsx
import { useReducer } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';

import { types } from '../types/types';

// const initialState = {
//     logged: false,
// }

const init = () => {
  const user = JSON.parse( localStorage.getItem('user') );

  return {
    logged: !!user,
    user: user,
  }
}


export const AuthProvider = ({ children }) => {
    
  const [ authState, dispatch ] = useReducer( authReducer, {}, init );

  const login = ( name = '' ) => {

    const user = { id: 'ABC', name }
    const action = { type: types.login, payload: user }

    localStorage.setItem('user', JSON.stringify( user ) );

    dispatch(action);
  }

  const logout = () => {
    localStorage.removeItem('user');
    const action = { type: types.logout };
    dispatch(action);
  }


  return (
    <AuthContext.Provider value={{
      ...authState,

      // Methods
      login,
      logout,
    }}>
        { children }
    </AuthContext.Provider>
  );
}

```

- Envolver a toda la aplicaicón con AuthProvider.
    - Se envuelve a toda la aplicación (a las ventanas de Heroes) en HeroesApp.jsx

``` jsx
import { AuthProvider } from './auth';
import { AppRouter } from './router/AppRouter';


export const HeroesApp = () => {
  return (
    <AuthProvider>
        
        <AppRouter />
        
    </AuthProvider>
  )
}

```