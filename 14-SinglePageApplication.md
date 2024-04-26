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
    - La lógica de persistir el usuario se coloca en AuthProvider, no en el reducer ya que en el reducer no se pueden llamar funciones externas como localstorage o console logs.

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

## 3. Rutas privadas
- Si no se está autenticado entonces no se debe poder entrar a rutas como /marvel.
- Se tiene el componente Outlet, el cual se entendió puede envolver varias rutas en un solo componente para simplemente llamarlo en donde se desee.

1. src -> router -> PrivateRoute.jsx
    - Si el usuario está logueado entonces permite visitar a los Children, de lo contrario va login.
``` jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../auth';


export const PrivateRoute = ({ children }) => {

    const { logged } = useContext( AuthContext );
    const { pathname, search } = useLocation(); // Se usa para recordar última página visitada
    
    const lastPath = pathname + search;
    localStorage.setItem('lastPath', lastPath );
    

    return (logged)
        ? children
        : <Navigate to="/login" />
}

```

2. Envolver a rutas que se desean proteger.
    - Las rutas se encuentra en AppRouter, las cuales son las que permiten visitar a HeroesRoutes.

``` jsx
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

## 4. Rutas públicas
- Si se está con un usuario autenticado no debería permitir ir al login.

1. src -> router -> PublicRoute.jsx

``` jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../auth';


export const PublicRoute = ({ children }) => {

    const { logged } = useContext( AuthContext );
    
    return (!logged)
        ? children
        : <Navigate to="/marvel" />
}

```

## 5. Recordar la última página visitada
- Se usa useLocation en PrivateRoute.
    - Se puede mejorar, ya que con los query parameters hace que se vuelva a renderizar a pesar de mandar siempre los mismos queryparameters.
        - Se puede usar un useMemo o un useEffect.
``` jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../auth';


export const PrivateRoute = ({ children }) => {

    const { logged } = useContext(AuthContext);
    const { pathname, search } = useLocation();

    const lastPath = pathname + search;
    localStorage.setItem('lastPath', lastPath);


    return (logged)
        ? children
        : <Navigate to="/login" />
}

```

- En LoginPage se reciba el path gurdado en localstorage.

``` jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {

  const { login } = useContext( AuthContext );
  const navigate = useNavigate();

  const onLogin = () => {
    
    const lastPath = localStorage.getItem('lastPath') || '/';

    login( 'Fernando Herrera' );
    
    navigate( lastPath, {
      replace: true
    });
  }

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <hr />

      <button 
        className="btn btn-primary"
        onClick={ onLogin }
      >
        Login
      </button>

    </div>
  )
}

```

# Sección 16. Pruebas de aplicación
## Temas 
1. Nuevos tipos de pruebas
2. Pruebas en rutas privadas y públicas
3. MemoryRouter
4. Pruebas en nuestro DashboardRouter
5. Pruebas en el AppRouter
6. Simular URLs y segmentos
7. Simular queryParams y queryStrings

## 1. Pruebas en authReducer

- Sujeto

``` jsx
import { types } from '../types/types';

export const authReducer = (state = {}, action) => {


    switch (action.type) {

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

- Tests

``` js
import { authReducer, types } from "../../../src/auth";


describe('Pruebas en authReducer', () => {
    
    test('debe de retornar el estado por defecto', () => {

        const state = authReducer({ logged: false }, {});
        expect( state ).toEqual({ logged: false });

    });

    test('debe de (login) llamar el login autenticar y establecer el user', () => {

        const action = {
            type: types.login,
            payload: {
                name: 'Juan',
                id: '123'
            }
        }

        const state = authReducer({ logged: false }, action );
        expect( state ).toEqual({
            logged: true,
            user: action.payload
        })

    });

    test('debe de (logout) borrar el name del usuario y logged en false ', () => {

        const state = {
            logged: true,
            user: { id: '123', name: 'Juan' }
        }

        const action = {
            type: types.logout
        }

        const newState = authReducer( state, action );
        expect( newState ).toEqual({ logged: false })

    });



});
```

## 2 Pruebas sobre Types

- Sujeto

``` js
export const types = {
    login:  '[Auth] Login',
    logout: '[Auth] Logout',
}
```

- Tests
    - Estas pruebas sirven para ponerle un candado a las types y que no cambien.
    - Se definen Routes en los tests para poder evaluar a las rutas.
    - Por ejemplo, se usa MemoryRouter para tener las funcionalidades de BrowserRouter en los tests.
        - Se deben definir al menos dos rutas, ya que con una sola entra en un ciclo infinito debido a que se empieza a redireccionar a la única ruta que hay.

``` js
import { types } from "../../../src/auth/types/types";


describe('Pruebas en "Types.js"', () => {
    
    test('debe de regresar estos types', () => {

        expect(types).toEqual({
            login:  '[Auth] Login',
            logout: '[Auth] Logout',
        })
        
    });

});
```

## 3. Pruebas en el PublicRoute

- Sujeto

``` js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../auth';


export const PublicRoute = ({ children }) => {

    const { logged } = useContext( AuthContext );
    
    return (!logged)
        ? children
        : <Navigate to="/marvel" />
}

```

- Tests

``` js
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthContext } from '../../src/auth';
import { PublicRoute } from '../../src/router/PublicRoute';


describe('Pruebas en <PublicRoute />', () => {
    
    test('debe de mostrar el children si no está autenticado', () => {
        
        const contextValue = {
            logged: false
        }

        render(
            <AuthContext.Provider value={ contextValue }>
                <PublicRoute>
                    <h1>Ruta pública</h1>
                </PublicRoute>
            </AuthContext.Provider>
        );

        expect( screen.getByText('Ruta pública') ).toBeTruthy();

    });


    test('debe de navegar si está autenticado', () => { 

        
        const contextValue = {
            logged: true,
            user: {
                name: 'Strider',
                id: 'ABC123'
            }
        }

        render(
            <AuthContext.Provider value={ contextValue }>
                <MemoryRouter initialEntries={['/login']}>

                    <Routes>
                        <Route path='login' element={
                            <PublicRoute>
                                <h1>Ruta pública</h1>
                            </PublicRoute>
                        } />
                        <Route path='marvel' element={ <h1>Página Marvel</h1> } />
                    </Routes>

                    
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect( screen.getByText('Página Marvel') ).toBeTruthy();


    })

});
```

## 4. Oruebas en PrivateRoute
- En estas pruebas se hacen mocks para evaluar el local storage, en donde se utiliza su prototype para poder tomar métodos como setItem.

- Sujeto

``` js
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../auth';


export const PrivateRoute = ({ children }) => {

    const { logged } = useContext(AuthContext);
    const { pathname, search } = useLocation();

    const lastPath = pathname + search;
    localStorage.setItem('lastPath', lastPath);


    return (logged)
        ? children
        : <Navigate to="/login" />
}
```

- Tests

``` js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../src/auth';
import { PrivateRoute } from '../../src/router/PrivateRoute';


describe('Pruebas en el <PrivateRoute />', () => {

    test('debe de mostrar el children si está autenticado', () => {

        Storage.prototype.setItem = jest.fn();

        
        const contextValue = {
            logged: true,
            user: {
                id: 'abc',
                name: 'Juan Carlos'
            }
        }

        render(
            <AuthContext.Provider value={ contextValue }>
                <MemoryRouter initialEntries={['/search?q=batman']}>
                    <PrivateRoute>
                        <h1>Ruta privada</h1>
                    </PrivateRoute>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect( screen.getByText('Ruta privada') ).toBeTruthy();
        expect( localStorage.setItem ).toHaveBeenCalledWith('lastPath', '/search?q=batman');

    });


    
});
```

## 5. Pruebas en el AppRouter

- Sujeto

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

- Tests

``` js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../src/auth';
import { AppRouter } from '../../src/router/AppRouter';

describe('Pruebas en <AppRouter />', () => {
    
    test('debe de mostrar el login si no está autenticado', () => {

        const contextValue = {
            logged: false,
        }

        render(
            <MemoryRouter initialEntries={['/marvel']}>
                <AuthContext.Provider value={ contextValue }>
                    <AppRouter />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect( screen.getAllByText('Login').length ).toBe(2)

        
    });

    test('debe de mostrar el componente de Marvel si está autenticado', () => {
    
        const contextValue = {
            logged: true,
            user: {
                id: 'ABC',
                name: 'Juan Carlos'
            }
        }

        render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthContext.Provider value={ contextValue }>
                    <AppRouter />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect( screen.getAllByText('Marvel').length ).toBeGreaterThanOrEqual(1);

        

    });


});
```

## 6. Pruebas en Navbar

- Sujeto

``` js
import { Link, NavLink } from 'react-router-dom';


export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-3">
        <div className="container-fluid">

            <Link className="navbar-brand" to="/">useContext</Link>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    
                    <NavLink 
                        className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                        to="/">
                        Home
                    </NavLink>


                    <NavLink 
                        className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                        to="/about">
                        About
                    </NavLink>

                    <NavLink 
                        className={ ({ isActive }) => `nav-link ${ isActive ? 'active' : '' }`}
                        to="/Login">
                        Login
                    </NavLink>
                </ul>
            </div>
        </div>
    </nav>
  )
}

```

- Tests
    - Se realiza un mock completo de useNavigate para validar que se llame con los argumentos desados cuando se presione el botón de logout.
        - En las pruebas pasadas se pasaba todo el path de donde estaba el customhook para crear el mock, sin embargo ahora se tiene que pribar un hook de React. Se Hace un mock de toda la librería de react-router-dom.
        - Se hace una destructuración de toda la librería en el callback para indicar que se tome todo por defecto a exepción del hook de useNavigate, el cual va a ser un mock.

``` js
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../src/auth/context/AuthContext';
import { Navbar } from '../../../src/ui/components/Navbar';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));


describe('Pruebas en <Navbar />', () => {

    const contextValue = {
        logged: true,
        user: {
            name: 'Juan Carlos'
        },
        logout: jest.fn()
    }

    beforeEach(() => jest.clearAllMocks());


    test('debe de mostrar el nombre del usuario', () => {

        render(
            <AuthContext.Provider value={contextValue}>
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('Juan Carlos')).toBeTruthy();


    });

    test('debe de llamar el logout y navigate cuando se hace click en el botón', () => {

        render(
            <AuthContext.Provider value={contextValue}>
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        const logoutBtn = screen.getByRole('button');
        fireEvent.click(logoutBtn);

        expect(contextValue.logout).toHaveBeenCalled()
        expect(mockedUseNavigate).toHaveBeenCalledWith('/login', { "replace": true })


    });


});



```

## 7. Pruebas en el SearchScreen

- Sujeto

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
    searchText: q
  });



  const onSearchSubmit = (event) =>{
    event.preventDefault();
    // if ( searchText.trim().length <= 1 ) return;
    navigate(`?q=${ searchText }`);
  }


  return (
    <>
      <h1>Search</h1> 
      <hr />

      <div className="row">

          <div className="col-5">
            <h4>Searching</h4>
            <hr />
            <form onSubmit={ onSearchSubmit } aria-label="form">
              <input 
                type="text"
                placeholder="Search a hero"
                className="form-control"
                name="searchText"
                autoComplete="off"
                value={ searchText }
                onChange={ onInputChange }
              />

              <button className="btn btn-outline-primary mt-1">
                Search
              </button>
            </form>
          </div>

          <div className="col-7">
            <h4>Results</h4>
            <hr />

            {/* {
              ( q === '' )
                ? <div className="alert alert-primary">Search a hero</div>
                : ( heroes.length === 0 ) 
                  && <div className="alert alert-danger">No hero with <b>{ q }</b></div>
            } */}
            
            <div className="alert alert-primary animate__animated animate__fadeIn" 
                style={{ display: showSearch ? '' : 'none' }}>
              Search a hero
            </div>

            <div aria-label="alert-danger" className="alert alert-danger animate__animated animate__fadeIn" 
                style={{ display: showError ? '' : 'none' }}>
              No hero with <b>{ q }</b>
            </div>


            {
              heroes.map( hero => (
                <HeroCard key={ hero.id } {...hero } />
              ))
            }

          </div>
      </div>
      

    </>
  )
}

```

- Tests
    - Se aprovecha initialEntries de MeoryRouter para pasar valores de query parameters para poder hacer pruebas.

``` js
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchPage } from '../../../src/heroes/pages/SearchPage';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));



describe('Pruebas en <SearchPage />', () => {


    beforeEach(() => jest.clearAllMocks() );

    
    test('debe de mostrarse correactamente con valores por defecto', () => {
        
        const { container } =render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        );
        expect( container ).toMatchSnapshot();
        
    });

    test('debe de mostrar a Batman y el input con el valor del queryString', () => {
        
        render(
            <MemoryRouter initialEntries={['/search?q=batman']}>
                <SearchPage />
            </MemoryRouter>
        );
        
        const input = screen.getByRole('textbox');
        expect( input.value ).toBe('batman');
        
        const img = screen.getByRole('img');
        expect( img.src ).toContain('/assets/heroes/dc-batman.jpg');

        const alert = screen.getByLabelText('alert-danger');
        expect( alert.style.display ).toBe('none');
        
    });

    test('debe de mostrar un error si no se encuentra el hero (batman123)', () => {
        
        render(
            <MemoryRouter initialEntries={['/search?q=batman123']}>
                <SearchPage />
            </MemoryRouter>
        );

        const alert = screen.getByLabelText('alert-danger');
        expect( alert.style.display ).toBe('');
        

    });

    test('debe de llamar el navigate a la pantalla nueva', () => {
        
        const inputValue = 'superman';

        render(
            <MemoryRouter initialEntries={['/search']}>
                <SearchPage />
            </MemoryRouter>
        );

        const input = screen.getByRole('textbox');
        fireEvent.change( input, { target: { name: 'searchText', value: inputValue }})
        
        
        const form = screen.getByRole('form');
        fireEvent.submit( form );
        
        expect( mockedUseNavigate ).toHaveBeenCalledWith(`?q=${ inputValue }`)

    });


});
```
