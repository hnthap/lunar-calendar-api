# Lunar Calendar API



The Lunar Calendar API is built using the astronomical formulae from *Astronomical Algorithms* by Jean Meeus, 1998 and Ho Ngoc Duc's [Lunar calendar calculator](https://www.informatik.uni-leipzig.de/~duc/amlich/JavaScript/).

## Usage

To install dependencies and build:

```bash
npm install
npm run build
```

To start the API server at <http://localhost:3000>:

```bash
npm run start
```

To run tests:

```bash
npm run test
```

PORT value can be specified in the file `.env` (replace `3000` with another available port value):

```
PORT=3000
```

## API

### Convert Gregorian date to Lunar calendar

Endpoint: `GET /v0/2/g2l`

Parameters:

* `y`: Gregorian year. For example, AD 1 is 1, AD 2024 is 2024, 1 BC is 0, 10 BC is -9.
* `m`: Gregorian month, from 1 to 12.
* `d`: Gregorian day of month, from 1 to 31.
* `z`: Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.
* `lang` or `language` *(optional)*: Language of textual representation of the Lunar date, must be one of "en" (English, i.e. modern representation), "vi" (Vietnamese), "zh" (Traditional Chinese), and "zh-cn" (Simplified Chinese). If not specified, a "modern representation" would be provided. `lang` and `language` are equivalent.

Return: JSON object of the equivalent date in Lunar calendar.

**Example 1:** To convert the Gregorian date July 19th, 2024 in time zone +07:00 to Lunar calendar:

```
GET /v0/2/g2l?y=2024&m=7&d=19&z=7
```

This should send:

```json
{
  "date": {
    "year": 2024,
    "month": 6,
    "monthSize": 29,
    "leap": false,
    "day": 14
  },
  "text": "2024.06s.14"
}
```

which means July 19th, 2024 is the day 14, month 6 (not leap) in Lunar calendar (approximately in AD 2024).

**Example 2:** To convert the Gregorian date August 11th, 2025 in time zone +07:00 to Lunar calendar and also get the textual representation in Traditional Chinese:

```
GET /v0/2/g2l?y=2025&m=8&d=11&z=7&lang=zh
```

This should send:

```json
{
  "date": {
    "year": 2025,
    "month": 6,
    "monthSize": 29,
    "leap": true,
    "day": 18
  },
  "text": "乙巳年閏六月（小）十八日"
}
```

which means August 11th, 2025 is the day 18, month 6 (leap) in Lunar calendar (approximately in AD 2025).

**Example 3:** To convert the Gregorian date December 31st, 2025 in time zone +07:00 to Lunar calendar and also get the textual representation in Vietnamese:

```
GET /v0/2/g2l?y=2010&m=12&d=31&z=7&lang=vi
```

This should send:

```json
{
  "date": {
    "year": 2010,
    "month": 11,
    "monthSize": 29,
    "leap": false,
    "day": 26
  },
  "text": "ngày 26 tháng 11 (nhỏ) năm Canh Dần"
}
```

which means December 31st, 2010 is the day 26, month 11 (not leap) in Lunar calendar (approximately in AD 2010).

**Example 4:** To convert the Gregorian date August 31st, 2025 in time zone +06:00 to Lunar calendar and also get the textual representation in Simplified Chinese:

```
GET /v0/2/g2l?y=2025&m=8&d=31&z=8&lang=zh-cn
```

This should send:

```json
{
  "date": {
    "year": 2025,
    "month": 7,
    "monthSize": 30,
    "leap": false,
    "day": 9
  },
  "text": "乙巳年七月（大）初九日"
}
```

which means August 31st, 2025 is the day 9, month 7 (not leap) in Lunar calendar (approximately in AD 2025).

### Convert Lunar date to Gregorian calendar

Endpoint: `GET /v0/2/l2g`

Parameters:

* `y`: The approximate Gregorian year of the Lunar year (which means most of the Lunar year falls in this Gregorian year).
* `m`: Lunar month, from 1 to 12.
* `leap`: Whether the Lunar month is leap. Must be one of: `true` (`1`) or `false` (`0`).
* `d`: Lunar day of month, from 1 to 30.
* `z`: Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.

Return: JSON object of the equivalent date in Gregorian calendar.

**Example:** To convert the Lunar date: day 15, month 8 (not leap), approximately in AD 2024, in time zone +07:00, to Gregorian calendar,

```
GET /v0/2/l2g?y=2024&m=8&leap=false&d=15&z=7
```

This should send:

```json
{
  "date": {
    "year": 2024,
    "month": 9,
    "day": 17
  }
}
```

which means the Lunar date falls in September 17th, 2024 (Gregorian calendar).

## License

### Lunar Calendar API

> Copyright (c) 2024 Huynh Nhan Thap. All Rights Reserved.
> 
> Permission to use, copy, modify, and redistribute this software and its documentation for personal, non-commercial use is hereby granted provided that this copyright notice and appropriate documentation appears in all copies.

### Ho Ngoc Duc's Lunar calendar program in Javascript

> https://www.informatik.uni-leipzig.de/~duc/amlich/amlich-aa98.js
> 
> Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
> 
> Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
> 
> Permission to use, copy, modify, and redistribute this software and its documentation for personal, non-commercial use is hereby granted provided that this copyright notice and appropriate documentation appears in all copies.
