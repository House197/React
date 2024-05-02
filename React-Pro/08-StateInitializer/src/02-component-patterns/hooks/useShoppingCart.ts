import { useState } from "react";
import { Product } from "../interfaces/interfaces";

interface ProductInCart extends Product {
    count?: number
  }

export const useShoppingCart = () => {
    const [shoppingCart, setShoppingCart] = useState<{[key:string]: ProductInCart}>({});

    const onProductCountChange = ({count, product}: {count: number, product: Product}) => {
      setShoppingCart(oldShoppingCart => {
        // // Este código a diferencia del que está comentado permite ahora controlar el estado desde el padre.
        // const productInCart: ProductInCart = oldShoppingCart[product.id] || {...product, count: 0};
  
        // if(Math.max(productInCart.count! + count, 0) > 0){
        //   productInCart.count! += count;
        //   return {
        //     ...oldShoppingCart,
        //     [product.id]: productInCart
        //   }
        // }
  
        // // Borrar el producto
        //   const  {[product.id]: toDelete, ...rest } = oldShoppingCart;
        //   return rest;
  
        if(count == 0){
          // Se elimina la key-value por medio de destructuración
          const  {[product.id]: toDelete, ...rest } = oldShoppingCart;
          return rest;
        }
        return {
          ...oldShoppingCart,
          [product.id]: {...product, count}
        }
      });
    }
    
    return {
        shoppingCart,
        onProductCountChange
    }
}
