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
