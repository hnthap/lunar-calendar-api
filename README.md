# Lunar Calendar API

The Lunar Calendar API is built using the astromonical formulae from *Astronomical Algorithms* by Jean Meeus, 1998 and Ho Ngoc Duc's [Lunar calendar calculator](https://www.informatik.uni-leipzig.de/~duc/amlich/JavaScript/).

## Usage

To build:

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

PORT value can be specify in the file `.env` (replace `3000` with another available port value):

```
PORT=3000
```

## API

### Convert Gregorian date to Lunar calendar

Endpoint: `GET /convert`

Parameters:

* `source`: Original date's calendar. Must set to `Gregorian` or `g`.
* `target`: Target date's calendar. Must set to `Lunar` or `l`.
* `y`: Gregorian year. For example, AD 1 is 1, AD 2024 is 2024, 1 BC is 0, 10 BC is -9.
* `m`: Gregorian month, from 1 to 12.
* `d`: Gregorian day of month, from 1 to 31.
* `z`: Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.

Return: JSON object of the equivalent date in Lunar calendar.

Example: To convert the Gregorian date July 19th, 2024 in time zone +07:00 to Lunar calendar,

```
GET /convert?source=g&target=l&y=2024&m=7&d=19&z=7
```

This should send:

```json
{
    "year": 2024,
    "month": 6,
    "leap": false,
    "day": 14
}
```

which means July 19th, 2024 is the day 14, month 6 (not leap) in Lunar calendar (approximately in AD 2024).

### Convert Lunar date to Gregorian calendar

Endpoint: `GET /convert`

Parameters:

* `source`: Original date's calendar. Must set to `Lunar` or `l`.
* `target`: Target date's calendar. Must set to `Gregorian` or `g`.
* `y`: The approximate Gregorian year of the Lunar year (which means most of the Lunar year falls in this Gregorian year).
* `m`: Lunar month, from 1 to 12.
* `leap`: Whether the Lunar month is leap. Must be one of: `true` (`1`) or `false` (`0`).
* `d`: Lunar day of month, from 1 to 30.
* `z`: Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.

Return: JSON object of the equivalent date in Lunar calendar.

Example: To convert the Lunar date: day 15, month 8 (not leap), approximately in AD 2024, in time zone +07:00, to Lunar calendar,

```
GET /convert?source=l&target=g&y=2024&m=8&leap=false&d=15&z=7
```

This should send:

```json
{
    "year": 2024,
    "month": 9,
    "day": 17
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
