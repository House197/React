import { useEffect, useRef, useState } from "react";
import { Product, onChangeArgs, InitialValues } from '../interfaces/interfaces';

interface useProductsArgs {
    product: Product;
    onChange?: (args: onChangeArgs) => void;
    value?: number;
    initialValues?: InitialValues
}

export const useProduct = ({ onChange, product, value = 0, initialValues }: useProductsArgs) => {
    const [counter, setCounter] = useState<number>(initialValues?.count || value);
    // Se usa referencia para saber si el controlador está comandado por una función.
    //const isControlled = useRef(!!onChange);
    const isMounted = useRef(false)

    const increaseBy = (value: number) => {
        // if(isControlled.current) {
        //     return onChange!({count: value, product});
        // }

        const newValue = Math.min(Math.max(counter + value, 0), initialValues?.maxCount || Infinity)
        setCounter(newValue);

        onChange && onChange({ count: newValue, product });
    }

    const reset = () => {
        setCounter(initialValues?.count || value);
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
        isMaxCountReached: !!initialValues?.count && initialValues.maxCount === counter,

        increaseBy,
        reset,
    }
}
