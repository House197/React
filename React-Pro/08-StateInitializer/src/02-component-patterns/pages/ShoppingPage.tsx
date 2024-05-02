import {ProductCard, ProductImage, ProductTitle, ProductButtons} from "../components/"
import '../styles/custom-styles.css'
import { products } from "../data/products";

const product = products[1];

export const ShoppingPage = () => {

  return (
    <div>
      <h1>Shopping Store</h1>
      <hr />

      <ProductCard 
        product={product} 
        className="bg-dark" 
        style={{backgroundColor: '#70D1F8'}}
        initialValues={{
          count: 4,
          maxCount: 10,
        }}
      >
          <ProductImage className="custom-image" />
          <ProductTitle className="text-white" />
          <ProductButtons className="custom-buttons" />
      </ProductCard> 

    </div>
  )
}

