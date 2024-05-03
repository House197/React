# Sección 05. Patrones de componentes - Compound Component Pattern
## Temas
En esta sección aprenderemos el patrón de construcción de componentes llamado "Compound Component Pattern" el cual es muy usado por Material UI, ionic y muchos otros que trabajan con componentes previamente creados que se pueden anidar entre si mediante HOCs (Higher Order Components)

Puntualmente aprenderemos el patrón y crearemos nuestro propio ejemplo aplicado.

## 1. Inicio proyecyo
- En archivos CSS se debe tener la palabra module: styles.modules.css si se desean cargar módulos mediante una importación y luego hacer referencia a las clases se debe tener esa palabra.
    - Esto era algo preconfigurado para CRA.

## 2. Preparación de componentes.
1. React-Pro\05-component-pattern\src\02-component-patterns\pages\ShoppingPage.tsx
    - Llama al componente ProductCard
2. React-Pro\05-component-pattern\src\02-component-patterns\components\ProductCard.tsx
    - Actualmente los usuarios solo pueden pasar el product, pero no tienen mayor control sobre el componente como poder cambiar el estilo.

``` tsx
import styles from '../styles/styles.module.css';
import noImage from '../assets/no-image.jpg'
import { useProduct } from '../hooks/useProduct';

interface Props {
    product: Product,
}

interface Product {
    id: number, 
    title: string,
    img?: string;
}

export const ProductCard = ({product}: Props) => {

    const { counter, increaseBy } = useProduct();

  return (
    <div className={styles.productCard}>
      <img className={styles.productImg} src={product.img ? product.img : noImage} alt="Coffee Mug" />

      <span className={ styles.productDescription}>{product.title}</span>
      <div className={styles.buttonsContainer}>

        <button className={styles.buttonMinus} onClick={() => increaseBy(-1)}>-</button>

        <div className={styles.countLabel}>{counter}</div>

        <button className={styles.buttonAdd} onClick={() => increaseBy(1)}>+</button>
      </div>
    </div>
  )
}
```

## 3. Primeros pasos Compound Component Pattern
- Se tiene a la disposición de añadir componentes hijos a un componente.
    - Los hijos mantienen una relación directa entre sí.
- Un ejemplo básico es:
    - Acá se tiene control sobre qué opciones deben aparecer.
    - En resumen, busca que teniendo el componente padre se tenga el poder de definir a sus componentes hijos.

``` js
<label for="cars"> Choose a car: </label>

<select name='cars' id='cars'>
    <option value='volvo'>Volvo</option>
    <option value='saab'>Saab</option>
</select>
```

- En el componente de Product Card se tendría el control sobre qué elementos deben aparecer, tal como la imagen título o título. De igual forma, tendrían el control de cambiar la posición.

1. Convertir componente ProductCard en HOC.
    1. Definir la prop children
    2. Refactorizar ProductCard para convertir todo su contenido en Componentes.

``` tsx
import styles from '../styles/styles.module.css';
import noImage from '../assets/no-image.jpg'
import { useProduct } from '../hooks/useProduct';
import { ReactElement } from 'react';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
interface Props {
    product: Product,
    children?: ReactElement | ReactElement[]
}

interface Product {
    id: number, 
    title: string,
    img?: string;
}

export const ProductImage = ({img = ""}) => {
    return(
        <img className={styles.productImg} src={img ? img : noImage} alt="Product" />
    )
}

export const ProductTitle = ({title}: {title: string}) => {
    return(
        <span className={ styles.productDescription}>{title}</span>
    )
}

interface ProductButtonsProps {
    counter: number,
    increaseBy: (value: number) => void
}

export const ProductButtons = ({counter, increaseBy}: ProductButtonsProps ) => {
    return(
        <div className={styles.buttonsContainer}>

        <button className={styles.buttonMinus} onClick={() => increaseBy(-1)}>-</button>

        <div className={styles.countLabel}>{counter}</div>

        <button className={styles.buttonAdd} onClick={() => increaseBy(1)}>+</button>
      </div>
    )
}

export const ProductCard = ({children , product}: Props) => {

    const { counter, increaseBy } = useProduct();

  return (
    <div className={styles.productCard}>
        {children}
      
{/*       <ProductImage img={product.img} />

      <ProductTitle title={product.title} />
    
      <ProductButtons 
        counter={counter} 
        increaseBy={increaseBy} 
      />
     */}

    </div>
  )
}
```

2. Usar ProductCard en ShoppingPage.

``` tsx
import { ProductButtons, ProductCard, ProductImage, ProductTitle } from "../components/ProductCard"

const product = {
    id: 1,
    title: 'Coffee Mug - Card',
    img: './coffee-mug.png'
}

export const ShoppingPage = () => {
  return (
    <div>
      <h1>Shopping Store</h1>
      <hr />

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        <ProductCard product={product} >
            <ProductImage />
            <ProductTitle title="" />
            <ProductButtons increaseBy={function (value: number): void {
                throw new Error('Function not implemented.');
            }}
            counter={0} />
        </ProductCard>

      </div>
    </div>
  )
}
```
- Con esto se tienen algunos problemas:
    - ProductButtons requiere que se le pase increaseBy y counter, lo cual está definido directamente en ProductCard.

- Por otro lado, ahora los usuarios tienen el poder de personalizar cada elemento, tal como ProductTitle que recibe su información en ProductCard, pero ahora ya se puede sobrescribir directamente desde ShoppingPage.
    - En otras palabras, los desarrolladores ya no tienen que ir directamente al componente ProductCard para hacer modificaciones en el mismo.

## 4. Unificar exportación de componentes (Opcional)
- Se muestra otra forma de colocar los elementos dentro de ProductCard cuando se mandan desde ShoppingPage.
1. Se definen propiedades en ProductCard que apuntes a los componentes deseados.

``` tsx
import styles from '../styles/styles.module.css';
import noImage from '../assets/no-image.jpg'
import { useProduct } from '../hooks/useProduct';
import { ReactElement } from 'react';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
interface Props {
    product: Product,
    children?: ReactElement | ReactElement[]
}

interface Product {
    id: number, 
    title: string,
    img?: string;
}

export const ProductImage = ({img = ""}) => {
    return(
        <img className={styles.productImg} src={img ? img : noImage} alt="Product" />
    )
}

export const ProductTitle = ({title}: {title: string}) => {
    return(
        <span className={ styles.productDescription}>{title}</span>
    )
}

interface ProductButtonsProps {
    counter: number,
    increaseBy: (value: number) => void
}

export const ProductButtons = ({counter, increaseBy}: ProductButtonsProps ) => {
    return(
        <div className={styles.buttonsContainer}>

        <button className={styles.buttonMinus} onClick={() => increaseBy(-1)}>-</button>

        <div className={styles.countLabel}>{counter}</div>

        <button className={styles.buttonAdd} onClick={() => increaseBy(1)}>+</button>
      </div>
    )
}

export const ProductCard = ({children , product}: Props) => {

    const { counter, increaseBy } = useProduct();

  return (
    <div className={styles.productCard}>
        {children}
    </div>
  )
}

ProductCard.Title = ProductTitle;
ProductCard.Image = ProductImage;
ProductCard.Buttons = ProductButtons;
```

2. Usar estas propiedades en ShoppingPage

``` tsx
        <ProductCard product={product} >
            <ProductCard.Image />
            <ProductCard.Title title="" />
            <ProductCard.Buttons increaseBy={function (value: number): void {
                throw new Error('Function not implemented.');
            }}
            counter={0} />
        </ProductCard>
```

## Compound Component Patter - Resolución - último paso
- Se desea resolver que se comparta información entre un componente padre y su hijo (ProductCard con ProductButtons) que no sea mediantes las props.
- Se usa contextAPI en ProductCard.

1. Crear context.
2. Destructurar Provider del context.
3. Envolver elementos con el Provider.
4. Usar useContext y extraer piezas de información requeridas según el componente.

``` tsx
import styles from '../styles/styles.module.css';
import noImage from '../assets/no-image.jpg'
import { useProduct } from '../hooks/useProduct';
import { ReactElement, createContext, useContext } from 'react';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
interface Props {
    product: Product,
    children?: ReactElement | ReactElement[]
}

interface Product {
    id: number, 
    title: string,
    img?: string;
}

interface ProductContextProps {
    counter: number;
    increaseBy: (value: number) => void;
    product: Product;
}

const ProductContext= createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductImage = ({img = ""}) => {

    const { product } = useContext(ProductContext);
    let imgToShow: string = noImage;

    if(img) {
        imgToShow = img;
    } else if(product.img){
        imgToShow = product.img;
    } 

    return(
        <img className={styles.productImg} src={imgToShow} alt="Product" />
    )
}

export const ProductTitle = ({title}: {title?: string}) => {

    const { product } = useContext(ProductContext);

    return(
        <span className={ styles.productDescription}>{title ? title : product.title}</span>
    )
}


export const ProductButtons = ( ) => {

    const {increaseBy, counter} = useContext(ProductContext); // Permite borrar las props de este componente

    return(
        <div className={styles.buttonsContainer}>

        <button className={styles.buttonMinus} onClick={() => increaseBy(-1)}>-</button>

        <div className={styles.countLabel}>{counter}</div>

        <button className={styles.buttonAdd} onClick={() => increaseBy(1)}>+</button>
      </div>
    )
}

export const ProductCard = ({children , product}: Props) => {

    const { counter, increaseBy } = useProduct(); 

  return (
    <Provider value={{
        counter,
        increaseBy,
        product
    }}>
        <div className={styles.productCard}>
            {children}
        </div>
    </Provider>
  )
}

ProductCard.Title = ProductTitle;
ProductCard.Image = ProductImage;
ProductCard.Buttons = ProductButtons;
```

- Definir los hijos deseados al crear el componente ProductCard en Shopp

``` tsx
        <ProductCard product={product} >
            <ProductCard.Image />
            <ProductCard.Title title="Hola mundo" />
            <ProductCard.Buttons />
        </ProductCard>

        <ProductCard product={product} >
            <ProductCard.Image />
            <ProductCard.Title />
            <ProductCard.Buttons />
        </ProductCard>
```

## Separar lógica en archivos independientes
1. Pasar interfaces en React-Pro\05-component-pattern\src\02-component-patterns\interfaces\interfaces.ts
2. Pasar componentes creados en ProductCard en archivos independientes.React-Pro\05-component-pattern\src\02-component-patterns\components

## Asignar componentes a otro componente
- Ya que ahora los componentes están en otros archivos, la creación de propiedades en ProductCard puede fallar.

1. Eliminar asignación de propiedades de componentes en ProductCard.
``` tsx
import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { createContext } from 'react';
import { ProductCardProps, ProductContextProps,  } from '../interfaces/interfaces';


export const ProductContext= createContext({} as ProductContextProps);
const { Provider } = ProductContext;


export const ProductCard = ({children , product}: ProductCardProps) => {

    const { counter, increaseBy } = useProduct(); 

  return (
    <Provider value={{
        counter,
        increaseBy,
        product
    }}>
        <div className={styles.productCard}>
            {children}
        </div>
    </Provider>
  )
}

/* ProductCard.Title = ProductTitle;
ProductCard.Image = ProductImage;
ProductCard.Buttons = ProductButtons; */
```
2. En el archivo de barril se extienden las propiedades del componente ProductCard para asignar los componentes y se estabelce como export default.
    - Al usar ProductCard debe venir del archivo de barril.

``` ts
import { ProductCard as ProductCardHOC} from './ProductCard';
import { ProductCardHOCProps } from "../interfaces/interfaces";

import { ProductButtons } from "./ProductButtons";
import { ProductImage } from "./ProductImage";
import { ProductTitle } from "./ProductTitle";

export { ProductButtons } from "./ProductButtons";
export { ProductImage } from "./ProductImage";
export { ProductTitle } from "./ProductTitle";


export const ProductCard: ProductCardHOCProps = Object.assign(ProductCardHOC, {
    Title: ProductTitle,
    Image: ProductImage,
    Buttons: ProductButtons
})

export default ProductCard
```

- Opcional. Definir interfaz de ts.

``` ts
export interface ProductCardHOCProps {
    ({ children, product }: ProductCardProps): JSX.Element,
    Title: ({ title }: {title?: string;}) => JSX.Element,
    Image: ({ img }: {img?: string | undefined;}) => JSX.Element,
    Buttons: () => JSX.Element
}
```
# Sección 06. Patrones de componentes - Extensible Styles
En esta sección aprenderemos a extender la funcionalidad de nuestro componente añadiendo la posibilidad de interpretar clases de CSS y/o estilos en línea (inline styles)

Para lograrlo necesitaremos realizar ciertas modificaciones a nuestras interfaces y componentes, pero al final del día, tendremos una componente personalizable.

## 1. Custom className
- Lo siguiente funcionará cuando no se usa de la forma de atributos en Shopping Cart. P/e:

``` tsx
        <ProductCard product={product} >
            <ProductImage />
            <ProductTitle />
            <ProductButtons />
        </ProductCard>
```

1. Definir archivo css para habilitar los estilos. React-Pro\05-component-pattern\src\02-component-patterns\styles\custom-styles.css

``` css
.bg-dark {
    background-color: rgb(56, 56, 56);
}
```

2. Importar estilo en ShoppingPage y colocar className en ProductCard en donde se usan los componentes no como atributos.

``` tsx
        <ProductCard product={product} className="bg-dark">
            <ProductImage />
            <ProductTitle />
            <ProductButtons />
        </ProductCard>
```

3. Colocar interface de props en ProductCard y borra solo esa interface del archivo interfaces.
    - Se decide colocar aquí sus props en lugar de interface.
    - Se define el campo de className.
    - Se coloca la prop className en la sección de className del elemento jsx deseado en ProductCard.
    - En el archivo de interfaces se importa Props desde ProductCard y se le renombra para poder usarlo en el HOC.

__ProductCard.ts__
``` tsx

import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { ReactElement, createContext } from 'react';
import { Product, ProductContextProps,  } from '../interfaces/interfaces';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
export interface Props {
    product: Product;
    className: string;
    children?: ReactElement | ReactElement[];
}

export const ProductContext= createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductCard = ({children , product, className }: Props) => {

    const { counter, increaseBy } = useProduct(); 

  return (
    <Provider value={{
        counter,
        increaseBy,
        product
    }}>
        <div className={`${styles.productCard} ${className}`}>
            {children}
        </div>
    </Provider>
  )
}


```

__interfaces.ts__
``` ts
import { Props as ProductCardProps } from "../components/ProductCard";

export interface Product {
    id: number, 
    title: string,
    img?: string;
}

export interface ProductContextProps {
    counter: number;
    increaseBy: (value: number) => void;
    product: Product;
}

export interface ProductCardHOCProps {
    ({ children, product }: ProductCardProps): JSX.Element,
    Title: ({ title }: {title?: string;}) => JSX.Element,
    Image: ({ img }: {img?: string | undefined;}) => JSX.Element,
    Buttons: () => JSX.Element
}
```

- Esto se aplica para los demás componentes a los que se les desea aplicar este patrón (Extensible Styles).

## 2. className en ProductButtons
- Se colocará la clase en el padre que envuelve a los botones, de tal forma que sea posible aplicar selectores de clase para darle estilo a los botones.
- Este cambio implica tener que modificar las siguientes props, ya que antes este componentes no recibía ninguna prop.
    - Por otro lado, se aprecia que solo da error en los botones pero en los demás no aunque también se recibe la prop de className. Se explica más adelante al implemenar className usando atributos del componente ProductCard.
    - Sucede porque no se está usando esa forma de trabajo, pero en el siguiente apartado se debe hacer algo para poder usar el atributo de ProductCard para llamar a los componentes.

__interfaces.ts__
``` ts
export interface ProductCardHOCProps {
    ({ children, product }: ProductCardProps): JSX.Element,
    Title: ({ title }: {title?: string;}) => JSX.Element,
    Image: ({ img }: {img?: string | undefined;}) => JSX.Element,
    Buttons: ({className}: {className?: string}) => JSX.Element
}
```

## 3. Interfaces faltantes
- Se podría agregar className en ProductCardHOCProps en interfaces, sin embargo esto lleva a interfaces duplicadas.
    - Es decir, si se definen más propiedades internas en los componentes entonces se debe ajustar también la interfaz de HOC.
    - Entonces, se utiliza la interfaz creada en cada componente para definir bien a la del HOC.

``` ts
import { Props as ProductButtonsProps } from "../components/ProductButtons";
import { Props as ProductCardProps } from "../components/ProductCard";
import { Props as ProductImageProps} from "../components/ProductImage";
import { Props as ProductTitleProps } from "../components/ProductTitle";

export interface Product {
    id: number, 
    title: string,
    img?: string;
}

export interface ProductContextProps {
    counter: number;
    increaseBy: (value: number) => void;
    product: Product;
}

export interface ProductCardHOCProps {
    ({ children, product }: ProductCardProps): JSX.Element,
    Title: (Props: ProductTitleProps) => JSX.Element,
    Image: (Props: ProductImageProps) => JSX.Element,
    Buttons: (Props: ProductButtonsProps) => JSX.Element
}
```

## 4. React CSSProperties
- Se desea pasar la propiedad style.
    - Su desventaja con className es que no se puede hacer target a los elementos hijos como con los selectores de css.
- Se debe definir en las interfaces del componente deseado.
    - El tipo es React.CSSProperties

```tsx
import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { CSSProperties, ReactElement, createContext } from 'react';
import { Product, ProductContextProps,  } from '../interfaces/interfaces';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
export interface Props {
    product: Product;
    className?: string;
    children?: ReactElement | ReactElement[];
    style?: CSSProperties,
}

export const ProductContext= createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductCard = ({children , product, className, style }: Props) => {

    const { counter, increaseBy } = useProduct(); 

  return (
    <Provider value={{
        counter,
        increaseBy,
        product
    }}>
        <div 
            className={`${styles.productCard} ${className}`}
            style={style}
        >
            {children}
        </div>
    </Provider>
  )
}
```

- Se usa en ShoppingCart

```tsx

```

# Sección 07. Patrones de componentes - Control Props
- Permite controla el estado interno y la emisión de valores del componente.
En esta sección aprenderemos a darle el control a nuestro usuario o compañero de trabajo sobre las propiedades y estado de nuestro componente, usualmente este patrón es el que se utiliza de manera tradicional en formularios, es decir:

```tsx
<input
    value={  algún valor de solo lectura }
    onChange={ alguna función que cambia el valor }
/>
```
Este patrón es el que implementaremos a continuación

## Problema y necesidad del control de propiedades
- Se desea tener el componente en una sección y a la vez en otro lado, en donde si incrementa el counter de uno de ellos entonces el otro también debe verse afectado.

## 1. Estado del carrito de compras. Control Props
0. Definir interface de argumentos del onChange.

__interfaces.ts__
``` ts
export interface onChangeArgs {
    product: Product;
    count: number;
}
```

1. Definir onChange y value en useProduct. De igual forma, se debe evaluar si el hook está siendo controlado (si onChange no es undefined) para saber si manejar el estado con useEffect o con increaseBy.
    - Se verifica si es controlado por medio de una referencia.

```ts
import { useEffect, useRef, useState } from "react";
import { Product, onChangeArgs } from "../interfaces/interfaces";

interface useProductsArgs {
    product: Product;
    onChange?: (args: onChangeArgs) => void;
    value?: number
}

export const useProduct = ({onChange, product, value = 0}: useProductsArgs) => {
    const [counter, setCounter] = useState(value);

    // Se usa referencia para saber si el controlador está comandado por una función.
    const isControlled = useRef(!!onChange);

    const increaseBy = (value: number) => {
        if(isControlled.current) {
            return onChange!({count: value, product});
        }
        
        const newValue = Math.max(counter+value, 0)
        setCounter(newValue);

        onChange && onChange({count: newValue, product});
    }

    useEffect(() => {
        setCounter(value);
    }, [value]);

    return {
        counter,
        increaseBy
    }
}
```

1. Se define el campo onChange y value en ProductCard para poder pasarlas a useProduct

```tsx
import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { CSSProperties, ReactElement, createContext } from 'react';
import { Product, ProductContextProps, onChangeArgs,  } from '../interfaces/interfaces';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
export interface Props {
    product: Product;
    className?: string;
    children?: ReactElement | ReactElement[];
    style?: CSSProperties;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
}

export const ProductContext= createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductCard = ({children , product, className, style, onChange, value }: Props) => {

    const { counter, increaseBy } = useProduct({onChange, product, value}); 

  return (
    <Provider value={{
        counter,
        increaseBy,
        product
    }}>
        <div 
            className={`${styles.productCard} ${className}`}
            style={style}
        >
            {children}
        </div>
    </Provider>
  )
}

/* ProductCard.Title = ProductTitle;
ProductCard.Image = ProductImage;
ProductCard.Buttons = ProductButtons; */
```

2. Crear useShoppingCart para separar lógica del componente.
    - El event que se le pasa a la función corresponde con la deseada.
    - Es decir, el evento le está pasando todo el product de la iteración dada por el map.
    - Por el momento se colocará en la carpeta de hook al igual que el de la tarjeta, pero lo recomendable es tener una sección específica para este componente de ShoppingPage.
    - Se tiene una sección de código comentado en onProductCountChange, el cual se puede trabajar así también, en donde el state está controlado no en el padre del todo, sino también en ProductCard (por el useProduct).
        - De ser la forma en la que se desea trabajar entonces en useProduct no se requiere la lógica para saber si es controlado, lo que lleva a que la función increaseBy haga su actualización del estado así como el useEffect definido.

```ts
import { useState } from "react";
import { Product } from "../interfaces/interfaces";

interface ProductInCart extends Product {
    count?: number
  }

export const useShoppingCart = () => {
    const [shoppingCart, setShoppingCart] = useState<{[key:string]: ProductInCart}>({});

    const onProductCountChange = ({count, product}: {count: number, product: Product}) => {
      setShoppingCart(oldShoppingCart => {
        // Este código a diferencia del que está comentado permite ahora controlar el estado desde el padre.
        const productInCart: ProductInCart = oldShoppingCart[product.id] || {...product, count: 0};
  
        if(Math.max(productInCart.count! + count, 0) > 0){
          productInCart.count! += count;
          return {
            ...oldShoppingCart,
            [product.id]: productInCart
          }
        }
  
        // Borrar el producto
          const  {[product.id]: toDelete, ...rest } = oldShoppingCart;
          return rest;
  
        // if(count == 0){
        //   // Se elimina la key-value por medio de destructuración
        //   const  {[product.id]: toDelete, ...rest } = oldShoppingCart;
        //   return rest;
        // }
        // return {
        //   ...oldShoppingCart,
        //   [product.id]: {...product, count}
        // }
      });
    }
    
    return {
        shoppingCart,
        onProductCountChange
    }
}
```

- Finalmente, ShoppingPage termina siendo lo siguiente:
    - Se aprecia que al pasar una función en onChange el evento tiene todo el objeto del product que viene en la iteración dada por map.

```tsx
import {ProductCard, ProductImage, ProductTitle, ProductButtons} from "../components/"
import '../styles/custom-styles.css'
import { useShoppingCart } from "../hooks/useShoppingCart"
import { products } from "../data/products";

export const ShoppingPage = () => {

  const { shoppingCart, onProductCountChange } = useShoppingCart();

  return (
    <div>
      <h1>Shopping Store</h1>
      <hr />

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>

        {
          products.map((product) => (
            <ProductCard 
              product={product} 
              className="bg-dark" 
              key={product.id}
              onChange={onProductCountChange}
              value={shoppingCart[product.id]?.count || 0}
            >
              <ProductImage className="custom-image" />
              <ProductTitle className="text-white" />
              <ProductButtons className="custom-buttons" />
            </ProductCard>
          ))
        }
{/*         <ProductCard product={product} >
            <ProductCard.Image />
            <ProductCard.Title title="Hola mundo" />
            <ProductCard.Buttons />
        </ProductCard>

        <ProductCard product={product} className="bg-dark">
            <ProductImage className="custom-image" />
            <ProductTitle className="text-white" />
            <ProductButtons className="custom-buttons" />
        </ProductCard>

        <ProductCard product={product} className="bg-dark" style={{backgroundColor: '#70D1F8'}}>
            <ProductImage className="custom-image" />
            <ProductTitle className="text-white" />
            <ProductButtons className="custom-buttons" />
        </ProductCard>
        
        <ProductCard product={product2} className="bg-dark" style={{backgroundColor: '#70D1F8'}}>
            <ProductImage className="custom-image" />
            <ProductTitle className="text-white" />
            <ProductButtons className="custom-buttons" />
        </ProductCard> */}


      </div>

      <div className="shopping-cart">
        {
          Object.entries(shoppingCart).map(([key, product]) => (
            <ProductCard 
              product={product} 
              className="bg-dark" 
              style={{width: '100px'}} 
              onChange={onProductCountChange}
              value={product.count}
              key={key}
            >
              <ProductImage className="custom-image" />
              <ProductButtons className="custom-buttons" />
            </ProductCard>
          ))
        }
      </div>
    </div>
  )
}


```

## Sección 08. State initializer + Function Child = Render Props - Formik implementation
Lo que están apunto de observar en esta sección es el patrón State Initializer junto al diseño de componentes que utiliza Formik.

El principal objetivo es poder exponer todo lo que el usuario (otro desarrollador) puede utilizar, el patrón principalmente pide que se pueda ofrecer un estado inicial y una forma de re-establecer el estado a su forma original, pero nosotros aquí lo llevaremos a otro nivel exponiendo funciones y nuevas propiedades.

También aprenderemos a enviar una función como children, similar a la implementación de Formik.

## 1. Punto de inicio.
__ShoppingPage.tsx__

```tsx
import {ProductCard, ProductImage, ProductTitle, ProductButtons} from "../components/"
import '../styles/custom-styles.css'
import { products } from "../data/products";

const product = products[1];

export const ShoppingPage = () => {

  return (
    <div>
      <h1>Shopping Store</h1>
      <hr />

      <ProductCard product={product} className="bg-dark" style={{backgroundColor: '#70D1F8'}}>
          <ProductImage className="custom-image" />
          <ProductTitle className="text-white" />
          <ProductButtons className="custom-buttons" />
      </ProductCard> 

    </div>
  )
}
```

## 2. Implementar la propiedad de intialValues
1. Se define el campo de initialValues en ProductCard, el cual se pasa como prop a useProduct.
    1. Crear interface de initialValues.

__interfaces.ts__
```ts
export interface InitialValues {
    count?: number;
    maxCount?: number;
}
```

__ProductCard.tsx__
```tsx
export interface Props {
    product: Product;
    className?: string;
    children?: ReactElement | ReactElement[];
    style?: CSSProperties;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
    initialValues?: InitialValues
}

export const ProductContext= createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductCard = ({children , product, className, style, onChange, value, initialValues }: Props) => {

    const { counter, increaseBy } = useProduct({onChange, product, value, initialValues}); 
```

__useProduct.ts__
```ts
import { useEffect, useState } from "react";
import { Product, onChangeArgs, InitialValues } from '../interfaces/interfaces';

interface useProductsArgs {
    product: Product;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
    initialValues?: InitialValues
}

export const useProduct = ({onChange, product, value = 0, initialValues}: useProductsArgs) => {
    const [counter, setCounter] = useState(initialValues?.count || value);

    // Se usa referencia para saber si el controlador está comandado por una función.
    //const isControlled = useRef(!!onChange);

    const increaseBy = (value: number) => {
        // if(isControlled.current) {
        //     return onChange!({count: value, product});
        // }
        
        const newValue = Math.max(counter+value, 0)
        setCounter(newValue);

        onChange && onChange({count: newValue, product});
    }

    useEffect(() => {
        setCounter(value);
    }, [value]);

    return {
        counter,
        increaseBy
    }
}
```

- Por el momento el valor de initial value no se refleja en la UI ya que el useEffect en use Product se está ejecutando dos veces.
    1. Cuando se cambia el valor de value.
    2. Cuando se renderiza por primera vez el Hook.
- Entonces, lo anterior se resuelve haciendo que no se ejecute hasta que el componente haya sido montado correctamente.


## 3. Mostrar el valor inicial en el componente
- Es un useRef se mantiene la referencia de si el componente ya fue montado, lo cual sirve para saber si ejecutar el useEffect que usa setCounter.

```ts
import { useEffect, useRef, useState } from "react";
import { Product, onChangeArgs, InitialValues } from '../interfaces/interfaces';

interface useProductsArgs {
    product: Product;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
    initialValues?: InitialValues
}

export const useProduct = ({ onChange, product, value = 0, initialValues }: useProductsArgs) => {
    const [counter, setCounter] = useState(initialValues?.count || value);

    // Se usa referencia para saber si el controlador está comandado por una función.
    //const isControlled = useRef(!!onChange);
    const isMounted = useRef(false)

    const increaseBy = (value: number) => {
        // if(isControlled.current) {
        //     return onChange!({count: value, product});
        // }

        const newValue = Math.max(counter + value, 0)
        setCounter(newValue);

        onChange && onChange({ count: newValue, product });
    }

    useEffect(() => {
        if (!isMounted.current) return;
        setCounter(value);
    }, [value]);

    useEffect(() => {
        isMounted.current = true;
    }, [])


    return {
        counter,
        increaseBy
    }
}
```

- Esto va a funcionar en producción, pero en desarrollo se ejecuta dos veces el useEffect por lo que el valor se mostrará en 0.

## 4. Utilizar el maxCount como limitante 
- En useProduct se usa Math.min

```ts
    const increaseBy = (value: number) => {
        // if(isControlled.current) {
        //     return onChange!({count: value, product});
        // }

        const newValue = Math.min(Math.max(counter + value, 0), initialValues?.maxCount || Infinity)
        setCounter(newValue);

        onChange && onChange({ count: newValue, product });
    }
```

## 5. Función como hijo de un HOC
- Este patrón exige otorgar una forma de hacer reset al valor.
- Se implementa una función que retorna JSX.
    - Esto brinda poder mandar argumentos en esa función.
    1. En ProductCard cambiar la definición de la interface para children a forma de que sea una función.
    2. Invocar children en el cuerpo de ProductCard.

__ProductCard.tsx__
```tsx
import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { CSSProperties, ReactElement, createContext } from 'react';
import { InitialValues, Product, ProductContextProps, onChangeArgs, } from '../interfaces/interfaces';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
export interface Props {
    product: Product;
    className?: string;
    //children?: ReactElement | ReactElement[];
    children: () => JSX.Element,
    style?: CSSProperties;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
    initialValues?: InitialValues
}

export const ProductContext = createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductCard = ({ children, product, className, style, onChange, value, initialValues }: Props) => {

    const { counter, increaseBy } = useProduct({ onChange, product, value, initialValues });

    return (
        <Provider value={{
            counter,
            increaseBy,
            product
        }}>
            <div
                className={`${styles.productCard} ${className}`}
                style={style}
            >
                {children()}
            </div>
        </Provider>
    )
}

/* ProductCard.Title = ProductTitle;
ProductCard.Image = ProductImage;
ProductCard.Buttons = ProductButtons; */
```

- Renderizar con una función a hijos de ProductCard en ShoppingPage.

``` tsx
      <ProductCard
        product={product}
        className="bg-dark"
        style={{ backgroundColor: '#70D1F8' }}
        initialValues={{
          count: 4,

        }}
      >
        {
          () => (
            <>
              <ProductImage className="custom-image" />
              <ProductTitle className="text-white" />
              <ProductButtons className="custom-buttons" />
            </>
          )
        }
      </ProductCard>
```

## 6. Exponer funciones y propiedades de un componente
1. Definir interfaz de lo que va a recibir la función que retorna JSX definida en Children de ProductCard.

```ts

export interface ProductCardHandlers {
    count: number;
    isMaxCountReached: boolean;
    maxCount?: number;
    product: Product;
    increaseBy: (value: number) => void;
    reset: () => void;
}
```

2. Colocar interfaz en interfaces de Props de ProductCard.
    - La opción de isMaxCountReached y la función de reset se definen en useProduct.

``` ts
import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { CSSProperties, createContext } from 'react';
import { InitialValues, Product, ProductCardHandlers, ProductContextProps, onChangeArgs, } from '../interfaces/interfaces';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
export interface Props {
    product: Product;
    className?: string;
    //children?: ReactElement | ReactElement[];
    children: (args: ProductCardHandlers) => JSX.Element,
    style?: CSSProperties;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
    initialValues?: InitialValues
}

export const ProductContext = createContext({} as ProductContextProps);
const { Provider } = ProductContext;

export const ProductCard = ({ children, product, className, style, onChange, value, initialValues }: Props) => {

    const { counter, isMaxCountReached, increaseBy, reset } = useProduct({ onChange, product, value, initialValues });

    return (
        <Provider value={{
            counter,
            increaseBy,
            product,
            maxCount: initialValues?.maxCount
        }}>
            <div
                className={`${styles.productCard} ${className}`}
                style={style}
            >
                {children({
                    count: counter,
                    isMaxCountReached,
                    maxCount: initialValues?.maxCount,
                    product,
                    reset,
                    increaseBy,
                })}
            </div>
        </Provider>
    )
}

/* ProductCard.Title = ProductTitle;
ProductCard.Image = ProductImage;
ProductCard.Buttons = ProductButtons; */
```

- De esta forma ya se tienen acceso a todos los argumentos de esta función al momento de llamarla en ShoppingPage.

```tsx
     <ProductCard
        product={product}
        className="bg-dark"
        style={{ backgroundColor: '#70D1F8' }}
        initialValues={{
          count: 4,
          maxCount: 10,
        }}
      >
        {
          ({ reset }) => (
            <>
              <ProductImage className="custom-image" />
              <ProductTitle className="text-white" />
              <ProductButtons className="custom-buttons" />
              <button onClick={reset}>Reset</button>
            
            </>
          )
        }
      </ProductCard>
```

# Sección 9. NPM Deploy - Desplegar paquetes de componentes
## Temas
Aquí realizaremos el primer despliegue a NPM de nuestro paquete.

Eventualmente lo haremos utilizando Storybook, pero por ahora lo haremos de la forma como tenemos nuestro componente y una forma directa de hacerlo.

Es importante también realizarlo con TypeScript y exponer los archivos de definición para que otros desarrolladores que también usen TypeScript, también tengan el auto-completado y manejo de errores.

## 1. Preparación
1. Crear nueva rama en git.
2. Eliminar classNames que no se ocupen de ShoppingPage para la parte de producción.
    - Se elimina la referencia a custom-files
    - El objetivo es dejar el componente en su estado por defecto.

```tsx
import { ProductCard, ProductImage, ProductTitle, ProductButtons } from "../components/"
import { products } from "../data/products";

const product = products[1];

export const ShoppingPage = () => {

  return (
    <div>
      <h1>Shopping Store</h1>
      <hr />

      <ProductCard
        product={product}
        initialValues={{
          count: 4,
          maxCount: 10,
        }}
      >
        {
          ({ reset, increaseBy, isMaxCountReached }) => (
            <>
              <ProductImage />
              <ProductTitle />
              <ProductButtons />
            </>
          )
        }
      </ProductCard>

    </div>
  )
}


```
## Paso 1. Crear proyecto de tsdx
- Se crea un proyecto que contiene solo lo que se desea subir.

```bash
npx tsdx create <nombre del paquete>
```

1. Crear proyecto.

```bash
npx tsdx create ar-product-card
```

2. Escoger plantilla de react.

### Estructura del proyecto - TSDX - NPM
- Readme.md
    - Es la documentación que aparecerá en la página del paquete en npm.
- Package.json
    - Se establece que la versión es 0.0.1 ya que es la primera vez que se va a subir.
    - Contiene otras configuraciones del proyecto.
- package-lock.json
    - También se coloca la misma versión que se puso en package.json

## Paso 2. Optimizar index.tsx
- En src se debe colocar todo lo creado de la aplicación que se desea subir.
    - Se omite el page de ShoppingPage, ya que se va a usar como el ejemplo.
    - No se sube carpeta de data.
    - No se va a subir el custom hook de useShoppingCart, ya que es un patrón que se implementó para el carrito de compras.

1. Copiar todo desde carpeta de assets hasta styles.
2. Eliminar lo que no se necesita.
    - Data
    - useShoppingCart.
    - Pages (se coloca un fragmento en el Readme como ejemplo).
3. En index.tsx colocar todas las exportaciones que serán vistas desde el mundo exterior.
    - Actualmente son los componentes son los que se exponen.

```ts
export * from './components';

```

## Paso 3. Módulos (opcional)
- Si el código tiene imágenes importadas y/o CSS modularizado de esta forma se debe hacer una configuración adicional.

```ts
import styles from '../styles/styles.module.css';
import noImage from '../assets/no-image.jpg';
```

- Se hace una configuración para permitir la importación de estilos como módulos, ya que si actualmente se corre npm start se tiene un error.

```
× Failed to compile
(typescript) Error: C:/Users/Usuario/Documents/Github Desktop/React/React-Pro/ar-product-card/src/components/ProductCard.tsx(1,20): semantic error TS2307: Cannot find module '../styles/styles.module.css' or its corresponding type declarations.
```

- Se debe crear un archivo de configuración TSDX **tsdx.config.js** en la raíz del proyecto para ayudar en el proceso de construcción del paquete.

```js

const postcss = require('rollup-plugin-postcss');
const images = require('@rollup/plugin-image');
module.exports = {
 rollup(config, options) {
 
 config.plugins = [
 postcss({ modules: true }),
 images({ incude: ['**/*.png', '**/*.jpg'] }),
 ...config.plugins,
 ];
 return config;
 },
};
```

- Realizar instalaciones respectivas para poder indicar a tsdx cómo cargar imágenes y módulos de css.
```bash
npm i -D rollup-plugin-postcss 
npm i -D @rollup/plugin-image
```

- Crear archivo de definición de los módulos.
    - Los typings ayudan a indicarle a TS cómo cargar los módulos de css.
1. src -> typings.d.ts

```ts
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}
```

- Si se corre el proyecto ahora se tiene el siguiente error:
    - Se debe a que se require escribir la importación en React en todos los archivos en donde se usa.

```bash
× Failed to compile
(typescript) Error: C:/Users/Usuario/Documents/Github Desktop/React/React-Pro/ar-product-card/src/components/ProductButtons.tsx(16,6): semantic error TS2686: 'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.
```

## Paso 4. Build
```bash 
npm run build
```

- El comando anterior crea el archivo dist.

## Paso 5. Example
- En la carpeta de example el archivo index.ts no sirve por el momento ya que thing ya no existe. Entonces, en su lugar se debe importa ProductCard y colocar el ejemplo.

```tsx
import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ProductCard, ProductImage, ProductTitle, ProductButtons } from "../."

const product = {
  id: 2,
  title: 'Coffee Mug - Meme',
  //img: './coffee-mug2.png'
}

const App = () => {
  return (
    <ProductCard
        product={product}
        initialValues={{
          count: 4,
          maxCount: 10,
        }}
      >
        {
          ({ reset, increaseBy, isMaxCountReached }) => (
            <>
              <ProductImage />
              <ProductTitle />
              <ProductButtons />
            </>
          )
        }
    </ProductCard>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

```

## Paso 6. Github Repo
Este paso aunque suene opcional, es importante para la longevidad del proyecto, puede que 
eventualmente decidas dejarlo y heredarlo a otra persona que lo continuará o invitar 
colaboradores que puedan realizar actualizaciones o bien aceptar mejoras que otras personas 
puedan hacer a tu paquete.
Adicionalmente tratar de mantener release tags acorde a la versión del paquete que puedes 
observar en el package.json
Colocar la referencia de tu repositorio en el package.json que se encuentra en el root del 
proyecto

``` json
"repository": {
    "url": "https://github-com/<repo>",
    "type": "git",
}
```

- Revisar documento pdf para ver otras partes opcionales de este paso.

## Paso 7. Pruebas automáticas
https://cursos.devtalles.com/courses/take/react-pro/lessons/35261776-paso-7-pruebas-automaticas
- Se instalan las dependencias de pruebas usadas en react 0 a experto.
- Se pueden tener problemas de nuevo por el css, por lo que en el pdg se tienen las configuraciones necesarias.

## Paso 8. Publicar
1- Crear una cuenta en NPM
2- Realizar el login en la consola o terminal (Colocar toda la información solicitada) 
npm login 
3- Ejecutar el siguiente comando para publicar la aplicación:
yarn publish