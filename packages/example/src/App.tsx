import React from 'react';
import './App.css';
import 'react-dadata/src/react-dadata.css';
import { AddressSuggestions } from '../../react-dadata/src/AddressSuggestions';

const DADATA_TOKEN = '3c2e964517d7358776e07d7d699cc2b0626dac54';

function App() {
  if (!DADATA_TOKEN) {
    return <div className="App">Пожалуйста, установите ваш API токен для DaData в `example/src/App.tsx:5`</div>;
  }
  return (
    <div className="App">
      <AddressSuggestions token={DADATA_TOKEN} selectOnBlur />
    </div>
  );
}

export default App;
