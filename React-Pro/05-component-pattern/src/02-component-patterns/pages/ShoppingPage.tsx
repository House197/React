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

