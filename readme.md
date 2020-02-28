# React Dadata
React компонент для подсказок адресов с помощью сервиса DaData.ru

<img width="728" alt="React Dadata" src="https://user-images.githubusercontent.com/724423/29621151-9ea462b6-8828-11e7-88ba-07f9619c0182.png">

### Установка
```
npm install react-dadata
```
или
```
yarn react-dadata
```

### Пример
```javascript
import { ReactDadata } from 'react-dadata';

// ...

<ReactDadata token="API_KEY" query="Москва" placeholder="" />
```

### Свойства

| Свойство  | Обязательный | Тип | Описание |
| ------------- | ------------- | ------------- | ------------- |
| token  | Да  | string  | Авторизационный токен DaData.ru  |
| placeholder  | Нет  | string  | Текст placeholder  |
| query  | Нет  | string  | Начальное значение поля ввода  |
| autoload  | Нет  | boolean  | Если `true`, то запрос на получение подсказок будет инициирован в фоне сразу, после монтирования компонента  |
| onChange  | Нет  | function(suggestion: ReactDadata.DadataSuggestion)  | Функция, вызываемая при выборе подсказки  |
| onInputChange  | Нет  | function(e: React.ChangeEvent<HTMLInputElement>)  | Функция, вызываемая при каждом изменения поля  |
| autocomplete  | Нет  |string  | параметр описывающий автозаполнение поля, например street-address, если не задан, будет установлен как off  |

### Лицензия

```
The MIT License

Copyright (c) 2016 Vitaly Baev <hello@vitalybaev.ru>, vitalybaev.ru

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

### TODO
* Тесты
* Доработка функционала
