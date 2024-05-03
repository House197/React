import React, { useCallback, useContext } from "react";
import styles from '../styles/styles.module.css';
import { ProductContext } from "./ProductCard";

export interface Props {
  className?: string;
}

export const ProductButtons = ({ className }: Props) => {

  const { increaseBy, counter, maxCount } = useContext(ProductContext); // Permite borrar las props de este componente

  const isMaxReached = useCallback(() => !!maxCount && counter === maxCount, [counter, maxCount])

  return (
    <div className={`${styles.buttonsContainer} ${className}`}>

      <button className={styles.buttonMinus} onClick={() => increaseBy(-1)}>-</button>

      <div className={styles.countLabel}>{counter}</div>

      <button className={`${styles.buttonAdd} ${isMaxReached() && 'disabled'}`} onClick={() => increaseBy(1)}>+</button>
    </div>
  )
}
