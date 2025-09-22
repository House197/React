# React 2025
- [React 2025](#react-2025)
- [01. Instalaciones](#01-instalaciones)
- [02. Introducción](#02-introducción)
  - [2.1 ¿Qué es React?](#21-qué-es-react)
    - [2.1.1 Formas de usar React](#211-formas-de-usar-react)
      - [2.1.1.1 Como librería](#2111-como-librería)
      - [2.1.1.2 Como framework](#2112-como-framework)
    - [2.1.2 Recomendaciones de librerías](#212-recomendaciones-de-librerías)
      - [2.1.2.1 Rutas](#2121-rutas)
      - [2.1.2.2 Data Fetching](#2122-data-fetching)
  - [2.2 JSX/TSX](#22-jsxtsx)
  - [2.3 Virtual DOM](#23-virtual-dom)
- [05. Pruebas automáticas - Testing](#05-pruebas-automáticas---testing)
  - [5.1 Introducción](#51-introducción)
    - [5.1.1 Características de las pruebas automáticas](#511-características-de-las-pruebas-automáticas)
    - [5.1.2 Etapas](#512-etapas)
      - [5.1.2.1 Arrange](#5121-arrange)
      - [5.1.2.2 Act](#5122-act)
      - [5.1.2.3 Assert](#5123-assert)
    - [5.1.3 Cobertura (Coverage)](#513-cobertura-coverage)
  - [5.2 Librerías de Testing](#52-librerías-de-testing)
    - [5.2.1 Vitest](#521-vitest)
      - [5.2.1.1 Configuración](#5211-configuración)
      - [5.2.1.2 Creación de tests](#5212-creación-de-tests)
        - [5.2.1.2.1 Enfoque cuando la aplicación ya está terminada y no había testing](#52121-enfoque-cuando-la-aplicación-ya-está-terminada-y-no-había-testing)
        - [5.2.1.2.2 Enfoque cuando la aplicación es nueva](#52122-enfoque-cuando-la-aplicación-es-nueva)
        - [5.2.1.2.3 Ejemplos de testing sobre funciones.](#52123-ejemplos-de-testing-sobre-funciones)
        - [5.2.1.2.4 Ejemplos de testing sobre componentes.](#52124-ejemplos-de-testing-sobre-componentes)


# 01. Instalaciones
- [Video](https://cursos.devtalles.com/courses/take/react-de-cero/lessons/65160905-instalaciones-recomendadas)
- [Gist](https://gist.github.com/Klerith/babd55ca1526ac882882888f75de208f)

# 02. Introducción
## 2.1 ¿Qué es React?
- [Video](https://cursos.devtalles.com/courses/take/react-de-cero/lessons/65183839-que-es-react)
- Es una librería de UI para construir interfaces de usuario.
- Usa componentes reutilizables, parametrizables y predecibles.
- Ayuda a construir aplicaciones como si fueran bloques de LEGO:
  - Componentes, reutilazas y actualizas solo lo que cambia.

### 2.1.1 Formas de usar React
#### 2.1.1.1 Como librería
- Es una herramienta específica para resolver un problema concreto.
- No impone reglas sobre cóno estructurar la aplicación completa.
- Permite elegir herramientas tales como:
  - Sistema de rutas.
  - Peticiones HTTP.
- Se recomienda usar Vite, Parcel o RSbuild
  - Vite es un bundler que permite tener entorno de desarrollo moderno.

#### 2.1.1.2 Como framework
- Cuando se maneja como frameworj se tiene una estructura concreta.
  - Impone al forma "correcta" y obligatoria de hacer las cosas.
- Se recomemienda usar con Next.js, React Router o Expo (para React Native)

### 2.1.2 Recomendaciones de librerías
#### 2.1.2.1 Rutas
- React Router
- Tanstack Router

#### 2.1.2.2 Data Fetching
- React Query
- SWR
- RTW Query

## 2.2 JSX/TSX
## 2.3 Virtual DOM


# 05. Pruebas automáticas - Testing
## 5.1 Introducción
### 5.1.1 Características de las pruebas automáticas
1. Fáciles de escribir.
2. Fáciles de leer.
3. Rápidas.
4. Flexibles.

### 5.1.2 Etapas
#### 5.1.2.1 Arrange
1. Se realizan las importaciones necesarias.
2. Realizar inicializaciones.

#### 5.1.2.2 Act
1. Aplicar estímulos.
2. Llamar métodos.
3. Simular clicks.

#### 5.1.2.3 Assert
- Se validan los estímulos. Se confirma lo que debe pasar.

### 5.1.3 Cobertura (Coverage)
- Cobertura de líneas.
- Cobertura de ramas.
  - Porcentaje de ramas de decisión probadas.
- Cobertura de funciones.
  - Porcentaje de funciones/métodos invocados.
- Cobertura de condiciones.
  - Porcentaje de condiciones evaluadas en ambos sentidos.

## 5.2 Librerías de Testing
### 5.2.1 Vitest
- Si las pruebas no pasan por una excepción entonces siempre pasan.
- Vitest habilita un DOM virtual para hacer testing.
#### 5.2.1.1 Configuración
- https://vitest.dev/
- https://testing-library.com/

- Se manejan archivos con cualquiera de las siguientes extensiones:
  - test
  - spec

1. Instalar dependencias.

```bash
npm i -D vitest
npm install --save-dev @testing-library/react @testing-library/dom @types/react @types/react-dom # Permite hacer testing sobre componentes UI
```

2. Configuración de scripts.
__package.json__
```json
scripts: {
    ...,
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
}
```

3. Ajuste de archivo __vite.config.ts__.
   1. Se usa defineConfig de vitest/config en lugar de vite.
   2. Al hacer __npm run test__ en la consola se va a preguntar si se desea instalar el paquete de __jsdom__, a lo cual se confirma.

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom';
        globals: true //Permite extender la información global compartida en vite;
    } 
});
```

#### 5.2.1.2 Creación de tests
##### 5.2.1.2.1 Enfoque cuando la aplicación ya está terminada y no había testing
1. Crear en root del proyecto la carpeta __test__.
   1. Se va a ir reflejando en __test__ el mismo contenido que hay en __src__.

##### 5.2.1.2.2 Enfoque cuando la aplicación es nueva
- Se colocan los archivos __.test.ts__ al mismo nivel del archivo que se le hace testing.

##### 5.2.1.2.3 Ejemplos de testing sobre funciones.
__math.helper.ts__
```ts
import { describe, test } from 'vitest';
import { add, subtract } from './math.helper';

// describe es un agrupador de pruebas
describe('add', () => {
    test('should add two positives numbers', () => {
        // 1. Arrage
        const a = 1;
        const b = 2;

        // 2. Act
        const result = add(a,b);

        // 3. Assert
        expect(result).toBe(3);
    });
})

describe('subtract', () => {
    test('should subtract two numbers', () => {
        // 1. Arrage
        const a = 1;
        const b = 2;

        // 2. Act
        const result = subtract(a,b);

        // 3. Assert
        expect(result).toBe(a-b);
    });
})

```

##### 5.2.1.2.4 Ejemplos de testing sobre componentes.
- https://cursos.devtalles.com/courses/take/react-de-cero/lessons/65716095-pruebas-sobre-componentes-de-react

- Se hace testing a lo que está siendo exportado, no en las variables que estén en el archivo del componente. Sin embargo, si esas variables están presente en lo que se exporta entonces sí se puede validar.

__MyAwesomeApp.test.tsx__
```tsx
import { describe, test } from 'vitest';
import { render, screen } from '@testing-library/react';  

// screen es más amigable en teoría en algunas cosas para poder trabajar con la renderización o el resultado de la renderización. Contiene el método debug que permite ver en consola el componente renderizado de un buen formato.
describe('MyAwesomeApp', () => {
    test('should render firstName and lastName', () => {
        // 
        const
    })
});
```
