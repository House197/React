import styles from '../styles/styles.module.css';
import { useProduct } from '../hooks/useProduct';
import React, { CSSProperties, createContext } from 'react';
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