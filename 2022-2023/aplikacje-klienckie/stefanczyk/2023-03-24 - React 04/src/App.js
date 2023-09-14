import { useState } from 'react';
import './App.css';
import Dialog from './components/Dialog';
import Item from './components/Item.js';

function App() {
  const [list, setList] = useState([]);
  const htmlList = [];

  const [currentIndex, setIndex] = useState(-1);

  const deleteItem = (i) => {
    list.splice(i, 1);
    setList([...list]);

    setIndex(-1);
  };

  const showDialog = (i) => {
    setIndex(i);
  }

  list.forEach((el, i) => {
    htmlList.push(<Item key={i} index={i} title={el.title} value={el.value}  delFn={showDialog}/>);
  });

  return (
    <main>
      <h1>Komponenty funkcyjne - tablica</h1>

      <div className="row buttons">
        <button onClick={() => setList([{ title: "Item", value: parseInt(Math.random() * 100) }, ...list])}>Add at the start</button>
        <button onClick={() => setList([...list, { title: "Item", value: parseInt(Math.random() * 100) }])}>Add at the end</button>
        <button onClick={() => setList([])}>clear list</button>
      </div>

      <div className="row list">
        {htmlList}
      </div>

      <div className="centerpoint">
        <Dialog index={currentIndex} delFn={deleteItem} />
      </div>

    </main>
  );
}

export default App;
