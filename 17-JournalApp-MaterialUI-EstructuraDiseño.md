# Sección 17. JournalApp - MaterialUI - Estructura y Diseño
## Temas
1. Material UI
2. Diferentes componentes de material
3. Uso de funciones propias de MaterialUI
4. Configuración de temas personalizados

- La aplicación se dividirá en los diferentes módulos que se van a ocupar:
    1. src -> auth
        - En auth se tienen las secciones de layout y pages.
            - Pages se les puede ver como las views.
            - Loyput es el cascarón, el cual va a envolver a las views para darle un estilo general a la sección.
    2. src -> journal
    3. src -> router
    
    4. src -> theme

## 1. Configuración de Rutas principales y secundarias
1. src -> router -> AppRouter.jsx
    - Acá se colocan las rutas principales, las cuales serán para login y journal. Login (auth) y Jornal manejarán sus propias rutas, las cuales se les considera secundarias.
2. Envolver a JournalApp.jsx (Componente que se coloca en main.jsx) con AppRouter.jsx.
3. Envolver main.jsx con BrowserRouter.



## 2. Instalación de MaterialUI
- Nota:
    - Instalaremos los íconos de material, pero al hacerlo, esto incrementa el bundle size y el tiempo de transpilación, tengan presente esto porque hemos recibido bastantes preguntas relacionadas con el tema.

1. Visitar página de mui y obtener comando de instalación. https://mui.com/material-ui/, https://mui.com/material-ui/getting-started/installation/

``` bash
npm install @mui/material @emotion/react @emotion/styled
```

2. Colocar fuente de Roboto en index.html.

``` html
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
```

3. Instalar iconos.

``` bash
npm install @mui/icons-material
```

## 3. Configuración de MUI con Vite
1. Se debe envolver a la aplicación con ThemeProvider y CssBaseLine, lo cual se puede hacer directo en main.jsx.
    - Se separan responsabilidades y se realiza esto en la sección de theme, en donde se crea un componente de orden superior. AppTheme.

``` jsx
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';

import { purpleTheme } from './';


export const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={ purpleTheme }>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      
      { children }
    </ThemeProvider>
  )
}
```

2. Crear el theme para proveerlo a ThemeProvider.

``` jsx
import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const purpleTheme = createTheme({
    palette: {
        primary: {
            main: '#262254'
        },
        secondary: {
            main: '#543884'
        },
        error: {
            main: red.A400
        }
    }
})
```


## MUI
### Typography
- Se puede configurar con lo siguiente:
    - component: en el DOM renderiza un h1 pero no aplica ese estilo.
    - variant: hace lo mismo qe¿ue component, pero sí aplica el estilo del elemento html requerido.

``` jsx
<Typography variant='h1'>Texto</Typography>
```