import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react"


interface Props {
    initialValue: number;
}

const MAXIMUM_COUNT = 10;

const CounterEffect = ({ initialValue }: Props) => {
    const [counter, setCounter] = useState(initialValue);
    const counterElement = useRef<HTMLHeadingElement>(null);

    const handleClick = () => {
        setCounter(prev => Math.min(prev + 1, MAXIMUM_COUNT));
    }

    useEffect(() => {
        if (counter < MAXIMUM_COUNT) return;

        console.log('%c Valor con estilo', 'color: green; background-color: blue');

        const tl = gsap.timeline();

        tl.to(counterElement.current, { y: -10, duration: 0.2, ease: 'elastic.inOut' })
            .to(counterElement.current, { y: 0, duration: 1, ease: 'bounce.out' });

        //tl.to(counterElement.current, { y: 0, duration: 1, ease: 'bounce.out' });

        /*         gsap.to(counterElement.current, {
                    y: -10,
                    duration: 0.2,
                    ease: 'elastic.inOut'
                }).then(() => {
                    gsap.to(counterElement.current, {
                        y: 0,
                        duration: 1,
                        ease: 'bounce.out'
                    })
                }) */

    }, [counter])

    return (
        <>
            <h1>Counter</h1>
            <h2 ref={counterElement}>{counter}</h2>

            <button onClick={handleClick}>
                +1
            </button>
        </>
    )
}

export default CounterEffect
