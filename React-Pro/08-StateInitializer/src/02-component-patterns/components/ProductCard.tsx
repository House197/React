import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import { CSSProperties, ReactElement, createContext } from 'react';
import { InitialValues, Product, ProductContextProps, onChangeArgs,  } from '../interfaces/interfaces';

// No se define directamente Product como el tipo de las Props, ya que naturalmente se reciben más cosas por parte de react provenientes del dom o los children.
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