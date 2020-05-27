# React Dadata

[Демонстрация](https://vitalybaev.github.io/react-dadata/)

Легковесный (**<3 kb min gzip**), типизированный и настраиваемый React компонент для подсказок **адресов и организаций** с помощью сервиса DaData.ru

**Предоставлена документация для 2.x, версия 1.x не поддерживается**

## Внешний вид

### Адреса

<img width="489" alt="React DaData адреса" src="https://user-images.githubusercontent.com/724423/82560699-9c5edf00-9b7a-11ea-83fc-d286a17c2235.png">

### Организации
<img width="497" alt="React DaData организации" src="https://user-images.githubusercontent.com/724423/82560793-c87a6000-9b7a-11ea-9d18-6e1335e470dc.png">

## Установка
```
npm install react-dadata@2.0.0-beta.1
```
или
```
yarn react-dadata@2.0.0-beta.1
```

## Пример использования
```javascript
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
| defaultQuery  | Нет  | string  | Начальное значение поля ввода  |
| count  | Нет  | number  | Количество подсказок, которое требуется получит от DaData. По-умолчанию: **10**  |
| autoload  | Нет  | boolean  | Если `true`, то запрос на получение подсказок будет инициирован в фоне сразу, после монтирования компонента  |
| onChange  | Нет  | function(suggestion: DaDataSuggestion<Type>)  | Функция, вызываемая при выборе подсказки  |
| inputProps  | Нет  | Object of HTMLInputElement Props  | любые стандартные пропсы для input. Свойство `value` игнорируется. Используйте его для передачи инпуту определенных атрибутов или для отслеживания событий |
| hintText  | Нет  | ReactNode  | Если передано, отображается в виде подсказки над списком подсказок |
| renderOption  | Нет  | function(suggestion: DaDataSuggestion<Type>) => ReactNode  | Реализуйте этот callback, чтобы вернуть компонент для отображения подсказки |
| containerClassName  | Нет  | string  | CSS класс для контейнера компонента, если не передан, используется класс для стилей из коробки.  |
| suggestionClassName  | Нет  | string  | CSS класс для компонента подсказки в списке, если не передан, используется класс для стилей из коробки.  |
| currentSuggestionClassName  | Нет  | string  | CSS класс который добавляется к компоненту текущей выбранной подсказки в списке, если не передан, используется класс для стилей из коробки.  |
| hintClassName  | Нет  | string  | CSS класс блока текста-пояснения над подсказками, если не передан, используется класс для стилей из коробки.  |
| highlightClassName  | Нет  | string  | CSS класс элемента, подсвечивающего совпадения при наборе, если не передан, используется класс для стилей из коробки.  |

## Типы подсказок и примеры

### Адреса

```javascript
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState();

<AddressSuggestions token="API_KEY" value={value} onChange={setValue} />
```

#### Дополнительные параметры для компонента адресов

| Свойство  | Обязательный | Тип | Описание |
| ------------- | ------------- | ------------- | ------------- |
| filterFromBound  | Нет  | string  | Сужение области поиска, параметр from_bound в запросе  |
| filterToBound  | Нет  | string  | Сужение области поиска, параметр to_bound в запросе  |
| filterLocations  | Нет  | array  | Сужение области поиска, параметр locations в запросе  |
| filterLocationsBoost  | Нет  | array  | Указание приоритета города, параметр locations_boost в запросе  |

### Организации

```javascript
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

## Стилизация

`react-dadata` поставляется с опциональным CSS файлом, который из коробки неплохо выглядит и выполняет свои функции.
Чтобы использовать его, укажите этот CSS файл в импорте или создайте CSS файл у себя с нужными стилями.

```javascript
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

```typescript
import React, { useState } from 'react';
import { AddressSuggestions, DaDataSuggestion, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const [value, setValue] = useState<DaDataSuggestion<DaDataAddress> | undefined>();

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
* В ближайшее время добавить подсказки для имен и банков.
* Тесты
* Сайт с документацией
* Если вам чего-то не хватает в текущем функционале - создавайте issue, попробуем помочь!
