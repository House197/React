# Inicio de proyecto
1. Crear aplicación vite.

``` bash
npm create vite
```

## React Router V6
- El @6 puede que no sea necesario, ya que para este momento por defecto esa es la que se instala.

``` bash
npm i react-router-dom@6
```

# Notas
- Los hooks de React son genéricos, por lo que así se maneja para definir su tipo en TS.
```tsx
  const [shoppingCart, setShoppingCart] = useState<{[key:string]: ProductInCart}>({

  });
```
