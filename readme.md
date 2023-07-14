# React Dadata

[![Coverage Status](https://coveralls.io/repos/github/vitalybaev/react-dadata/badge.svg)](https://coveralls.io/github/vitalybaev/react-dadata)
![npm](https://img.shields.io/npm/dt/react-dadata)
[![dependencies](https://img.shields.io/librariesio/release/npm/react-dadata/2.16.0)](https://www.npmjs.com/package/react-dadata)
[![npm package](https://img.shields.io/npm/v/react-dadata.svg)](https://www.npmjs.com/package/react-dadata)
[![npm downloads](https://img.shields.io/npm/dm/react-dadata.svg)](https://www.npmjs.com/package/react-dadata)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-dadata)](https://bundlephobia.com/result?p=react-dadata)
![licence](https://img.shields.io/npm/l/react-dadata)

Лёгкий (**~5 kb min gzip**), типизированный и настраиваемый React компонент для подсказок **адресов, организаций,
банков, ФИО и email** с помощью сервиса DaData.ru

[Демонстрация](https://vitalybaev.github.io/react-dadata/)

**Предоставлена документация для 2.x, версия 1.x не поддерживается**

## Содержание

* [Внешний вид](#%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B8%D0%B9-%D0%B2%D0%B8%D0%B4)
  * [Адреса](#%D0%B0%D0%B4%D1%80%D0%B5%D1%81%D0%B0)
  * [Организации](#%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8)
  * [Банки](#%D0%B1%D0%B0%D0%BD%D0%BA%D0%B8)
* [Установка](#%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0)
* [Пример использования](#%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)
* [Параметры](#%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B)
  * [Общие параметры](#%D0%BE%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B)
* [Методы](#%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D1%8B)
* [Типы подсказок и примеры](#%D1%82%D0%B8%D0%BF%D1%8B-%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B7%D0%BE%D0%BA-%D0%B8-%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B)
  * [Адреса](#%D0%B0%D0%B4%D1%80%D0%B5%D1%81%D0%B0-1)
  * [Организации](#%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8-1)
  * [Банки](#%D0%B1%D0%B0%D0%BD%D0%BA%D0%B8-1)
  * [ФИО](#%D1%84%D0%B8%D0%BE)
  * [Email](#email)
* [Стилизация](#%D1%81%D1%82%D0%B8%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F)
* [TypeScript](#typescript)
* [Лицензия](#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F)

## Внешний вид

### Адреса

<img width="591" alt="СReact DaData адреса" src="https://user-images.githubusercontent.com/724423/89572756-3e18d280-d832-11ea-8e52-08d35ad8abc0.gif">

### Организации

<img width="587" alt="React DaData организации" src="https://user-images.githubusercontent.com/724423/84180388-199db580-aa90-11ea-8276-548dcaff641d.png">

### Банки

<img width="585" alt="React DaData банки" src="https://user-images.githubusercontent.com/724423/84180460-320dd000-aa90-11ea-9a16-62c9e230052d.png">

## Установка

### pnpm

```
pnpm add react-dadata
```

### yarn

```
yarn add react-dadata
```

### npm

```
npm install react-dadata
```

## Пример использования

```jsx
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

## Параметры

### Общие параметры

| Свойство                   | Обязательный | Тип                                                       | Описание                                                                                                                                                                                  |
|----------------------------|--------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| token                      | Да           | string                                                    | Авторизационный токен DaData.ru                                                                                                                                                           |
| value                      | Нет          | DaDataSuggestion<\*>                                      | Текущее значение, если передается, то в поле ввода будет установлено значение `value` подсказки (если не указан `defaultQuery`) а также при изменении будет менять значение в поле ввода. |
| defaultQuery               | Нет          | string                                                    | Начальное значение поля ввода, имеет больший приоритет перед `value`. Используется только при монтировании компонента.                                                                    |
| delay                      | Нет          | number                                                    | Задержка для debounce при отправке запроса в миллисекундах. По-умолчанию отсутствует, запрос отправляется на каждое изменение в поле ввода                                                |
| count                      | Нет          | number                                                    | Количество подсказок, которое требуется получит от DaData. По-умолчанию: **
10**                                                                                                           |
| autoload                   | Нет          | boolean                                                   | Если `true`, то запрос на получение подсказок будет инициирован в фоне сразу, после монтирования компонента                                                                               |
| onChange                   | Нет          | function(suggestion: DaDataSuggestion<Type>)              | Функция, вызываемая при выборе подсказки                                                                                                                                                  |
| minChars                   | Нет          | number                                                    | Минимальное количество символов для отправки запроса к DaData. По умолчанию не задан, то есть подсказки запрашиваются на каждый ввод                                                      |
| inputProps                 | Нет          | Object of HTMLInputElement Props                          | любые стандартные пропсы для input. Свойство `value` игнорируется. Используйте его для передачи инпуту определенных атрибутов или для отслеживания событий                                |
| hintText                   | Нет          | ReactNode                                                 | Если передано, отображается в виде подсказки над списком подсказок                                                                                                                        |
| renderOption               | Нет          | function(suggestion: DaDataSuggestion<Type>) => ReactNode | Реализуйте этот callback, чтобы вернуть компонент для отображения подсказки                                                                                                               |
| url                        | Нет          | string                                                    | Если передан, запросы будут выполняться на этот URL (полезно, если используется прокси или коробочная версия на своем сервере)                                                            |
| containerClassName         | Нет          | string                                                    | CSS класс для контейнера компонента, если не передан, используется класс для стилей из коробки.                                                                                           |
| suggestionClassName        | Нет          | string                                                    | CSS класс для компонента подсказки в списке, если не передан, используется класс для стилей из коробки.                                                                                   |
| currentSuggestionClassName | Нет          | string                                                    | CSS класс который добавляется к компоненту текущей выбранной подсказки в списке, если не передан, используется класс для стилей из коробки.                                               |
| hintClassName              | Нет          | string                                                    | CSS класс блока текста-пояснения над подсказками, если не передан, используется класс для стилей из коробки.                                                                              |
| highlightClassName         | Нет          | string                                                    | CSS класс элемента, подсвечивающего совпадения при наборе, если не передан, используется класс для стилей из коробки.                                                                     |
| customInput                | Нет          | Element or string                                         | Кастомный компонент поля ввода, например от Styled Components                                                                                                                             |
| selectOnBlur               | Нет          | boolean                                                   | Если `true`, то при потере фокуса будет выбрана первая подсказка из списка                                                                                                                |
| uid                        | Нет          | string                                                    | Уникальный ID который используется внутри компонента для связывания элементов при помощи aria атрибутов                                                                                   |
| httpCache                  | Нет          | boolean                                                   | Необходимо ли кешировать HTTP-запросы |
| httpCacheTtl               | Нет          | number                                                   | Время жизни кеша HTTP-запросов (в миллисекундах). Значение по умолчанию - 10 минут |

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

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

#### Дополнительные параметры для компонента адресов

| Свойство             | Обязательный | Тип          | Описание                                                         |
|----------------------| ------------ |--------------|------------------------------------------------------------------|
| filterLanguage       | Нет          | `ru | en`    | Язык подсказок в ответе (по умолчанию `ru`)                      |
| filterFromBound      | Нет          | string       | Сужение области поиска, параметр `from_bound` в запросе          |
| filterToBound        | Нет          | string       | Сужение области поиска, параметр `to_bound` в запросе            |
| filterLocations      | Нет          | array        | Сужение области поиска, параметр `locations` в запросе           |
| filterLocationsBoost | Нет          | array        | Указание приоритета города, параметр `locations_boost` в запросе |
| filterRestrictValue  | Нет          | bool         | Передача параметра `restrict_value` в запросе                    |

### Организации

```jsx
import { PartySuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<PartySuggestions token="API_KEY" value={value} onChange={setValue} />;
```

#### Дополнительные параметры для компонента организаций

| Свойство             | Обязательный | Тип       | Описание                                                       |
|----------------------|--------------|-----------|----------------------------------------------------------------|
| filterStatus         | Нет          | array     | Фильтр по статусу организации, параметр status в запросе       |
| filterType           | Нет          | string    | Фильтр по типу организации, параметр type в запросе            |
| filterOkved          | Нет          | string[]  | Фильтр по ОКВЭД                                                |
| filterLocations      | Нет          | array     | Сужение области поиска, параметр locations в запросе           |
| filterLocationsBoost | Нет          | array     | Указание приоритета города, параметр locations_boost в запросе |

### Банки

```jsx
import { BankSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<BankSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

#### Дополнительные параметры для компонента банков

| Свойство             | Обязательный | Тип    | Описание                                                       |
| -------------------- | ------------ | ------ | -------------------------------------------------------------- |
| filterStatus         | Нет          | array  | Фильтр по статусу банка, параметр status в запросе             |
| filterType           | Нет          | string | Фильтр по типу банка, параметр type в запросе                  |
| filterLocations      | Нет          | array  | Сужение области поиска, параметр locations в запросе           |
| filterLocationsBoost | Нет          | array  | Указание приоритета города, параметр locations_boost в запросе |

### ФИО

```jsx
import { FioSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<FioSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

#### Дополнительные параметры для компонента ФИО

| Свойство     | Обязательный | Тип                            | Описание               |
| ------------ | ------------ | ------------------------------ | ---------------------- |
| filterGender | Нет          | `UNKNOWN`, `MALE` или `FEMALE` | Фильтр по полу         |
| filterParts  | Нет          | string[]                       | Подсказки по части ФИО |

### Email

```jsx
import { EmailSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<EmailSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

## Стилизация

`react-dadata` поставляется с опциональным CSS файлом, который из коробки неплохо выглядит и выполняет свои функции.
Чтобы использовать его, укажите этот CSS файл в импорте или создайте CSS файл у себя с нужными стилями.

```jsx
import { AddressSuggestions } from 'react-dadata';

// Импортируем CSS файл
import 'react-dadata/dist/react-dadata.css';

// ...
<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

**Обратите внимание**, что ваш сборщик должен быть настроен соответствующим образом для обработки CSS файлов.

Если у вас в проекте используется CSS-in-JS решение, то вы должны передавать CSS классы в компонент с помощью пропсов:

- `inputProps.className` - для поля ввода
- `containerClassName` - для контейнера компонента
- `suggestionsClassName` - для блока с подсказками
- `suggestionClassName` - для блока с подсказкой
- `currentSuggestionClassName` - для блока с текущей выделенной подсказкой
- `hintClassName` - для блока с пояснением
- `highlightClassName` - для тега `mark`, которым выделяются совпадения с введенным текстом

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

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />;
```

## Ошибка в консоли `Prop aria-owns did not match...`

Данная ошибка возникает при использовании серверного рендеринга. Под капотом, `react-dadata`, следуя принципам
доступности, создает компонент с aria ролью "combobox", которому необходимо через обычные HTML идентификаторы связывать
различные элементы. При использовании SSR в виду текущей архитектуры компонента данные ID генерируются дважды
независимо: на сервере и на клиенте, из-за чего в момент регидратации React выявляет несовпадение этих идентификаторов.
Эта проблема решается довольно просто в функциональных компонентах, однако на данный момент у меня нет быстрого решения
этой проблемы.

Чтобы иметь возможность избавиться от данной ошибки при использовании SSR можно передавать пропс `uid`, в которой вы
можете передать _уникальный в рамках страницы_ строковый идентификатор.

Если заранее известно, сколько компонентов и в каких местах страницы будут располагаться, можно передавать в качестве
идентификаторов понятные строки:

```tsx
<AddressSuggestions
  token="API_KEY"
  value={value}
  onChange={setValue}
  uid="dadata-address-order-page"
/>;
```

Если вы уже обновились на React 18, то можно воспользоваться стандартным хуком `useId`:

```tsx
const id = useId();

return (
  <AddressSuggestions
    token="API_KEY"
    value={value}
    onChange={setValue}
    uid={id}
  />
);
```

## Лицензия

```
The MIT License

Copyright (c) 2016 Vitaly Baev <ping@baev.dev>, baev.dev

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

- В ближайшее время добавить подсказки для ФИО.
- Увеличить покрытие тестов
- Сайт с документацией
- Если вам чего-то не хватает в текущем функционале - создавайте issue, попробуем помочь!
