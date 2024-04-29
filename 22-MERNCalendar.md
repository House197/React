# Sección 22. MERN Calendar - Estructura y Diseño
## Temas
1. Estructura y diseño de nuestra aplicación de Calendario
2. Uso de componentes de terceros
3. Modals
4. Configuración de Redux
5. CRUD local
6. Preparación de pantallas para futuras secciones
7. Uso de MomentJS
8. Manejo de fechas

- En este proyecto se crean custom hooks para interactuar con redux.
- En la store se coloca el middleware para colocar serializableCheck en false, lo que permite evitar que redux intente serializar el problema que se tiene con las fechas.

## Mantener estado de autenticación
- Se usan los interceptores de axios.
- Permiten interceptar las peticiones que van al backend o las que regresan. Al momento de hacer Request se requiere interceptarlo y añadir configuración especifica en los headers.
    - Antes de que se hagan los request se aplican los interceptores.
    - Esto ayuda a que siempre se tenga el header para cualquier request que se haga en la app, cosa que no es posible con fetch.

- En useAuthStore se define una función para verificar el estado de la autenticación.
    - Se llama a esta función en AppRouter.

# Sección 29. Testing
## Temas
1. Finalización con las últimas pruebas necesarias
2. Pruebas con Fetch
3. Mocks
4. Simulaciones
5. Mocks parciales
6. Store
7. MockStore
8. Eventos de componentes de terceros
9. Simular acciones

https://gist.github.com/Klerith/b2eafa2a5fb9f09d6d043781be976e06

## 1. Priebas en configuración de Axios

- Sujeto

 ``` js
 import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables()


const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

// Todo: configurar interceptores
calendarApi.interceptors.request.use( config => {

    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config;
})


export default calendarApi;




 ```

- Test

``` js
import calendarApi from '../../src/api/calendarApi';


describe('Pruebas en el CalendarApi', () => {
    
    test('debe de tener la configuración por defecto', () => {

        // console.log(calendarApi);
        // console.log(process.env)
        expect( calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL );
    
    });

    test('debe de tener el x-token en el header de todas las peticiones ', async() => {

        const token = 'ABC-123-XYZ';
        localStorage.setItem('token', token );
        const res = await calendarApi.get('/auth');

        expect(res.config.headers['x-token']).toBe( token );
        
    });

});
```

## 2. Pruebas en uiSlice

- Sujeto

``` js

import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isDateModalOpen: false
    },
    reducers: {
        onOpenDateModal: ( state ) => {
            state.isDateModalOpen = true;
        },
        onCloseDateModal: ( state ) => {
            state.isDateModalOpen = false;
        },
    }
});


// Action creators are generated for each case reducer function
export const { onOpenDateModal, onCloseDateModal } = uiSlice.actions;


```

- Test

``` js
import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice";


describe('Pruebas en uiSlice', () => {
    
    test('debe de regresar el estado por defecto', () => {
        
        expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false })

    });

    test('debe de cambiar el isDateModalOpen correctamente', () => {

        let state = uiSlice.getInitialState();
        state = uiSlice.reducer( state, onOpenDateModal() )
        expect(state.isDateModalOpen).toBeTruthy();
        
        state = uiSlice.reducer( state, onCloseDateModal() );
        expect(state.isDateModalOpen).toBeFalsy();
        
        
    });


});
```

## 3. Pruebas en authSlice

- Sujeto

 ``` js
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'authenticated','not-authenticated',
        user: {},
        errorMessage: undefined,
    },
    reducers: {
        onChecking: ( state ) => {
            state.status = 'checking';
            state.user   = {};
            state.errorMessage = undefined;
        },
        onLogin: ( state, { payload } ) => {
            state.status = 'authenticated';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: ( state, { payload } ) => {
            state.status = 'not-authenticated';
            state.user   = {};
            state.errorMessage = payload;
        },
        clearErrorMessage: ( state ) => {
            state.errorMessage = undefined;
        }
    }
});


// Action creators are generated for each case reducer function
export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;
 ```

- Test

``` js
import { authSlice, clearErrorMessage, onLogin, onLogout } from '../../../src/store/auth/authSlice';
import { authenticatedState, initialState } from '../../fixtures/authStates';
import { testUserCredentials } from '../../fixtures/testUser';


describe('Pruebas en authSlice', () => {
    
    test('debe de regresar el estado inicial', () => {
        expect( authSlice.getInitialState() ).toEqual( initialState );
    });

    test('debe de realizar un login', () => {
        
        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })
    });

    test('debe de realizar el logout', () => {
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });
    });

    test('debe de realizar el logout', () => {
        const errorMessage = 'Credenciales no válidas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage
        });
    });

    test('debe de limpiar el mensaje de error', () => {

        const errorMessage = 'Credenciales no válidas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        const newState = authSlice.reducer( state, clearErrorMessage() )

        expect( newState.errorMessage ).toBe( undefined );
        
    });

});
```