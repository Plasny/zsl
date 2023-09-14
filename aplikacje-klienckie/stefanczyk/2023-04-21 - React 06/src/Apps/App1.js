import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from '../Slices/Slice1';

function App() {
  const dispatch = useDispatch();
  const counter = useSelector(state => state.counter.value);

  return (
    <main>
      <h2>App instance</h2>
      <div className='box'>
        <div className='counter'>{counter}</div>
        <button type='button' onClick={() => dispatch(increment())}>+</button>
        <button type='button' onClick={() => dispatch(decrement())}>-</button>
      </div>
    </main>
  );
}

export default App;
