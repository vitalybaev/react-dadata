import React, { useState } from 'react';
import './App.css';
import 'react-dadata/src/react-dadata.css';
import {
  AddressSuggestions,
  PartyBelarusSuggestions,
  PartyKazakhstanSuggestions,
  PartySuggestions,
} from '../../react-dadata/src';

const DADATA_TOKEN = '3c2e964517d7358776e07d7d699cc2b0626dac54';

function App() {
  if (!DADATA_TOKEN) {
    return <div className="App">Пожалуйста, установите ваш API токен для DaData в `example/src/App.tsx:5`</div>;
  }

  const [suggestionsType, setSuggestionsType] = useState<
    'address' | 'party_russia' | 'party_belarus' | 'party_kazakhstan'
  >('address');

  return (
    <div className="App">
      <div style={{ display: 'inline-flex', flexDirection: 'row', gap: '16px' }}>
        <div>
          <input
            id="suggestionsType-address"
            type="radio"
            name="suggestionsType"
            value="address"
            checked={suggestionsType === 'address'}
            onChange={() => setSuggestionsType('address')}
          />
          <label htmlFor="suggestionsType-address">Адреса</label>
        </div>
        <div>
          <input
            id="suggestionsType-party_russia"
            type="radio"
            name="suggestionsType"
            value="party_russia"
            checked={suggestionsType === 'party_russia'}
            onChange={() => setSuggestionsType('party_russia')}
          />
          <label htmlFor="suggestionsType-party_russia">Компании в России 🇷🇺</label>
        </div>
        <div>
          <input
            id="suggestionsType-party_belarus"
            type="radio"
            name="suggestionsType"
            value="party_belarus"
            checked={suggestionsType === 'party_belarus'}
            onChange={() => setSuggestionsType('party_belarus')}
          />
          <label htmlFor="suggestionsType-party_belarus">Компании в Беларуси 🇧🇾</label>
        </div>
        <div>
          <input
            id="suggestionsType-party_kazakhstan"
            type="radio"
            name="suggestionsType"
            value="party_kazakhstan"
            checked={suggestionsType === 'party_kazakhstan'}
            onChange={() => setSuggestionsType('party_kazakhstan')}
          />
          <label htmlFor="suggestionsType-party_kazakhstan">Компании в Казахстане 🇰🇿</label>
        </div>
      </div>
      {suggestionsType === 'address' && (
        <AddressSuggestions token={DADATA_TOKEN} inputProps={{ placeholder: 'Введите адрес...' }} selectOnBlur />
      )}
      {suggestionsType === 'party_russia' && (
        <PartySuggestions
          token={DADATA_TOKEN}
          inputProps={{ placeholder: '🇷🇺 Введите название компании, ИНН' }}
          selectOnBlur
        />
      )}
      {suggestionsType === 'party_belarus' && (
        <PartyBelarusSuggestions
          token={DADATA_TOKEN}
          inputProps={{ placeholder: '🇧🇾 Введите название компании, УНП' }}
          selectOnBlur
        />
      )}
      {suggestionsType === 'party_kazakhstan' && (
        <PartyKazakhstanSuggestions
          token={DADATA_TOKEN}
          inputProps={{ placeholder: '🇰🇿 Введите название компании, БИН' }}
          selectOnBlur
        />
      )}
    </div>
  );
}

export default App;
