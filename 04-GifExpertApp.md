# Sección 6. GifExpertApp - App
## Temas
1. Custom Hooks
2. Fetch hacia un API
3. Comunicación entre componentes
4. Clases de CSS
5. Animaciones
6. Enviar métodos como argumentos
7. Crear listados
8. keys
9. Giphy

## 1. UseEffect
- Se utiliza para disparar efecto secundarios.
    - Un efecto secundario se puede considerar como un proceso que se desea ejecutar cuando un determinado evento sucede.

## 2. Despliegue de producción rápido.
- Se utiliza para ver cómo se vería la app si se desplegara.
1. Crear bundle de producción 
``` bash
npm run build
```

2. Instalar http-server de node de forma global
    - Permite desplegar aplicación de forma local.

``` bash
npm i -g http-server
```

3. Ejecutar comando en root de la app para desplegar app de forma local:

``` bash
http-server -o
```