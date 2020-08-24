# React Dadata

[![Coverage Status](https://coveralls.io/repos/github/vitalybaev/react-dadata/badge.svg)](https://coveralls.io/github/vitalybaev/react-dadata)
[![dependencies](https://img.shields.io/david/vitalybaev/react-dadata)](https://www.npmjs.com/package/react-dadata)
[![npm package](https://img.shields.io/npm/v/react-dadata.svg)](https://www.npmjs.com/package/react-dadata)
[![npm downloads](https://img.shields.io/npm/dm/react-dadata.svg)](https://www.npmjs.com/package/react-dadata)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-dadata)](https://bundlephobia.com/result?p=react-dadata)
![licence](https://img.shields.io/npm/l/react-dadata)

Легковесный (**~3 kb min gzip**), типизированный и настраиваемый React компонент для подсказок **адресов, организаций и банков** с помощью сервиса DaData.ru

[Демонстрация](https://vitalybaev.github.io/react-dadata/)

**Предоставлена документация для 2.x, версия 1.x не поддерживается**

## Внешний вид

### Адреса

<img width="591" alt="СReact DaData адреса" src="https://user-images.githubusercontent.com/724423/89572756-3e18d280-d832-11ea-8e52-08d35ad8abc0.gif">

### Организации
<img width="587" alt="React DaData организации" src="https://user-images.githubusercontent.com/724423/84180388-199db580-aa90-11ea-8276-548dcaff641d.png">

### Банки
<img width="585" alt="React DaData банки" src="https://user-images.githubusercontent.com/724423/84180460-320dd000-aa90-11ea-9a16-62c9e230052d.png">

## Установка
```
npm install react-dadata
```
или
```
yarn add react-dadata
```

## Пример использования
```jsx
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />
```

## Параметры

### Общие параметры

| Свойство  | Обязательный | Тип | Описание |
| ------------- | ------------- | ------------- | ------------- |
| token  | Да  | string  | Авторизационный токен DaData.ru  |
| value  | Нет  | DaDataSuggestion<*>  | Текущее значение, если передается, то в поле ввода будет установлено значение `value` подсказки (если не указан `defaultQuery`) а также при изменении будет менять значение в поле ввода.  |
| defaultQuery  | Нет  | string  | Начальное значение поля ввода, имеет больший приоритет перед `value`. Используется только при монтировании компонента.  |
| delay  | Нет  | number  | Задержка для debounce при отправке запроса в миллисекундах. По-умолчанию отсутствует, запрос отправляется на каждое изменение в поле ввода  |
| count  | Нет  | number  | Количество подсказок, которое требуется получит от DaData. По-умолчанию: **10**  |
| autoload  | Нет  | boolean  | Если `true`, то запрос на получение подсказок будет инициирован в фоне сразу, после монтирования компонента  |
| onChange  | Нет  | function(suggestion: DaDataSuggestion<Type>)  | Функция, вызываемая при выборе подсказки  |
| minChars  | Нет  | number  | Минимальное количество символов для отправки запроса к DaData. По умолчанию не задан, то есть подсказки запрашиваются на каждый ввод |
| inputProps  | Нет  | Object of HTMLInputElement Props  | любые стандартные пропсы для input. Свойство `value` игнорируется. Используйте его для передачи инпуту определенных атрибутов или для отслеживания событий |
| hintText  | Нет  | ReactNode  | Если передано, отображается в виде подсказки над списком подсказок |
| renderOption  | Нет  | function(suggestion: DaDataSuggestion<Type>) => ReactNode  | Реализуйте этот callback, чтобы вернуть компонент для отображения подсказки |
| containerClassName  | Нет  | string  | CSS класс для контейнера компонента, если не передан, используется класс для стилей из коробки.  |
| suggestionClassName  | Нет  | string  | CSS класс для компонента подсказки в списке, если не передан, используется класс для стилей из коробки.  |
| currentSuggestionClassName  | Нет  | string  | CSS класс который добавляется к компоненту текущей выбранной подсказки в списке, если не передан, используется класс для стилей из коробки.  |
| hintClassName  | Нет  | string  | CSS класс блока текста-пояснения над подсказками, если не передан, используется класс для стилей из коробки.  |
| highlightClassName  | Нет  | string  | CSS класс элемента, подсвечивающего совпадения при наборе, если не передан, используется класс для стилей из коробки.  |

## Методы

Поскольку компонент классовый, он поддерживает вызов методов с помощью `ref`.

```tsx
import React, { useRef } from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

//...

const suggestionsRef = useRef<AddressSuggestions>(null);
const handleClick = () => {
  if (suggestionsRef.current) {
    suggestionsRef.current.setInputValue('Тут пример запроса');
  }
};

//...

<AddressSuggestions ref={suggestionsRef} token="API_KEY" />
<button onClick={handleClick}>Изменить поле ввода</button>
```

### focus()
Вызывает событие `focus` на поле ввода

### setInputValue(value: string | undefined)
Устанавливает указанный текст в поле ввода

## Типы подсказок и примеры

### Адреса

```jsx
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />
```

#### Дополнительные параметры для компонента адресов

| Свойство  | Обязательный | Тип | Описание |
| ------------- | ------------- | ------------- | ------------- |
| filterLanguage  | Нет  | `ru` | `en`  | Язык подсказок в ответе (по умолчанию `ru`)  |
| filterFromBound  | Нет  | string  | Сужение области поиска, параметр from_bound в запросе  |
| filterToBound  | Нет  | string  | Сужение области поиска, параметр to_bound в запросе  |
| filterLocations  | Нет  | array  | Сужение области поиска, параметр locations в запросе  |
| filterLocationsBoost  | Нет  | array  | Указание приоритета города, параметр locations_boost в запросе  |

### Организации

```jsx
import { PartySuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<PartySuggestions token="API_KEY" value={value} onChange={setValue} />
```

#### Дополнительные параметры для компонента организаций

| Свойство  | Обязательный | Тип | Описание |
| ------------- | ------------- | ------------- | ------------- |
| filterStatus  | Нет  | array  | Фильтр по статусу организации, параметр status в запросе  |
| filterType  | Нет  | string  | Фильтр по типу организации, параметр type в запросе  |
| filterLocations  | Нет  | array  | Сужение области поиска, параметр locations в запросе  |
| filterLocationsBoost  | Нет  | array  | Указание приоритета города, параметр locations_boost в запросе  |

### Банки

```jsx
import { BankSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<BankSuggestions token="API_KEY" value={value} onChange={setValue} />
```

#### Дополнительные параметры для компонента банков

| Свойство  | Обязательный | Тип | Описание |
| ------------- | ------------- | ------------- | ------------- |
| filterStatus  | Нет  | array  | Фильтр по статусу банка, параметр status в запросе  |
| filterType  | Нет  | string  | Фильтр по типу банка, параметр type в запросе  |
| filterLocations  | Нет  | array  | Сужение области поиска, параметр locations в запросе  |
| filterLocationsBoost  | Нет  | array  | Указание приоритета города, параметр locations_boost в запросе  |


## Стилизация

`react-dadata` поставляется с опциональным CSS файлом, который из коробки неплохо выглядит и выполняет свои функции.
Чтобы использовать его, укажите этот CSS файл в импорте или создайте CSS файл у себя с нужными стилями.

```jsx
import { AddressSuggestions } from 'react-dadata';

// Импортируем CSS файл
import 'react-dadata/dist/react-dadata.css';

// ...
<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />
```

**Обратите внимание**, что ваш сборщик должен быть настроен соответствующим образом для обработки CSS файлов.

Если у вас в проекте используется CSS-in-JS решение, то вы должны передавать CSS классы в компонент с помощью пропсов:
* `inputProps.className` - для поля ввода
* `containerClassName` - для контейнера компонента
* `suggestionsClassName` - для блока с подсказками
* `suggestionClassName` - для блока с подсказкой
* `currentSuggestionClassName` - для блока с текущей выделенной подсказкой
* `hintClassName` - для блока с пояснением
* `highlightClassName` - для тега `mark`, которым выделяются совпадения с введенным текстом

## TypeScript

`react-dadata` написан на TypeScript, поэтому типы встроены.

```tsx
import React, { useState } from 'react';
import { AddressSuggestions, DaDataSuggestion, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState<DaDataSuggestion<DaDataAddress> | undefined>();

// Также можно воспользоваться готовым типом DaDataAddressSuggestion для адреса или DaDataPartySuggestion для организаций
// import { DaDataAddressSuggestion } from 'react-dadata';
// const [value, setValue] = useState<DaDataAddressSuggestion | undefined>();

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />
```

## Лицензия

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
* В ближайшее время добавить подсказки для ФИО.
* Увеличить покрытие тестов
* Сайт с документацией
* Если вам чего-то не хватает в текущем функционале - создавайте issue, попробуем помочь!
