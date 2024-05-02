import Counter from './bases/Counter'
import CounterBy from './bases/CounterBy'
import CounterEffect from './bases/CounterEffect'
import CounterHook from './bases/CounterHook'
import { CounterReducerComponent } from './counter-reducer/CounterReducer'
import './styles.css'

function App() {

  return (
    <>
      <h1>Hola Cui</h1>
      <Counter initialValue={10} />
      <CounterBy initialValue={5} />
      <CounterEffect initialValue={2} />
      <CounterHook />
      <CounterReducerComponent />
    </>
  )
}

export default App
