1. Componentes deben ser nombrados con CamelCase.
2. Pasar props con {}, ya que "" puede verse como los atributos de HTML.
3. Colocar funciones y variables que no tengan que ver con los elementos del componente fuera del componente para indicarle a React que no son reactivos y no se redefinan de nuevo cada que el componente se renderice de nuevo.
    - Por ejemplo, una petición HTTP se volvería a ejecutar si se define el Fetch dentro del componente.
4. Colocar la importación de hooks en primer lugar.
5. No colocar declaración de hooks dentro de condicionales.
    - Esto se debe a que React perdería la referencia de la posición que ocupa el State o el Hook con respecto a los demás.
``` js
if(true){
    ... = useState()
}
```

6. En la consola, en la sección de configuración, se tiene la casilla de preserver log, el cual ayuda a mantener los logs cuando hay un reinicio de la app.
7. Al pasar funciones set a un componente hijo se debe establecer la lógica de actualización en el componente padre, para que el componente hijo solo le pase el nuevo valor a la función que se pasa como referencia.
    - Esto se debe a que un desarrollador externo al código no sabría cómo usar del todo la función set para actualizar el estado, ya que el estado es externo.

``` js
const [characters, setCharacters] = useState(''):

const onAddCharacter = (newCharacter) => {
    setCharacters([newCharacter, ...characters])
}

return(
    <>
        <Child onNewCharacter={onAddCharacter} >
    </>
)
```

8. Usar el prefijo on al momento de pasar referencia de funciones set:
    - onNewCategory
    - onNewCharacter

9. Se recomienda usar renerizado condicional para garantizar en un componente se desmonte y no solo se esconda.

``` js
            {
                (username === 'strider2' ) && <Message />
            }
```

10. Usar ternarios en colocar clases de forma condicional.
    - Si se usa && entonces se agrega false en la clase de un elemento.

## useEffect
1. No puede ser asíncrona la callback se se define.
    - Esto es porque useEffect debe retornar una función, pero al usar async ya está retornando una promesa.
    - Se recomienda crear una función asíncrona externa y mandarla a llamar en el useEffect.

2. Al limpiar listeners se debe pasar la referencia de la función directamente y no una función anónima en donde llame a la función, ya que la función anónima es otro espacio en memoria del que se desea.

``` js
    useEffect(() => {
        
        const onMouseMove = ({ x, y }) => {
            // const coords = { x, y };
            setCoords({ x, y })
        }

        window.addEventListener( 'mousemove', onMouseMove );
        
      return () => {
        window.removeEventListener( 'mousemove', onMouseMove );
      }
    }, []);
```

## Importaciones
1. Top level deben estar las de react.
2. Después de top level las dependencias de terceros.
3. Por último importaciones del código propio

# Snippets
- rfca