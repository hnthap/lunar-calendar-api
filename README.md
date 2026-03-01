# Lunar Calendar API

[![Pre-release](https://img.shields.io/badge/version-v0.3.0-blue?style=for-the-badge&logo=github)](https://github.com/hnthap/lunar-calendar-api)
[![GitHub Stars](https://img.shields.io/github/stars/hnthap/lunar-calendar-api?style=for-the-badge&logo=github)](https://github.com/hnthap/lunar-calendar-api/stargazers)

✨ **[Try Web App](https://hnthap.github.io/lunar-calendar-converter-interface/)** | 📖 **[API Documentation](#api)**

> *An API that converts between Gregorian and Lunar calendar systems, serving cultural and religious applications worldwide*

The Lunar Calendar API is built using the astronomical formulae from *Astronomical Algorithms* by Jean Meeus, 1998.

## ⚠️ Demo API Update

> **The public demo endpoint (`lunar-calendar-api.netlify.app`) has been sunset due to excessive traffic.**

Thank you to everyone who used this! The response was amazing (handling **over 6,000 requests daily**) but as a solo developer, I cannot maintain the paid infrastructure required for a free public demo.

**The Good News: You can own it!**

Deploy your own private, unlimited instance for free in less than 2 minutes:

1. Click the button below to deploy to your Netlify account.
2. Get your new URL (e.g., https://your-name-lunar-api.netlify.app) to use in your apps.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hnthap/lunar-calendar-api)

## Why This API?

Lunar calendars guide over one billion people's cultural and religious practices. From China's Spring Festival to Vietnam's *Tet*, accurate Lunar dates are essential for cultural applications, but most software libraries lack proper Lunar calendar support.

## Quick Start

Run the server locally (see below), then convert September 2nd, 2025 (Gregorian) to Lunar calendar in time zone +08:00:

```bash
curl "http://localhost:3000/v0/3/g2l?y=2025&m=9&d=2&z=8"
```

## Usage

There are two ways to run the API server: **locally** or **using Docker**.

### Local Server

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

**Optional:** Create `.env` file at the root to specify a different port:
```dotenv
PORT=3000
```

### Docker

```bash
# Run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t lunar-calendar-api .
docker run -p 3000:3000 lunar-calendar-api

# Run tests in Docker
docker build --target tester .
```

## Features

**📅 Bidirectional Conversion** - Gregorian ↔ Lunar calendar with full metadata

**🪐 Astronomical Accuracy** - Based on Jean Meeus's algorithms

**🌝 Leap Month Support** - Handles complex lunar leap month calculations

**🌐 Timezone Aware** - Precise conversions across all global timezones

**📜 Extended Date Range** - Supports calculations for historical dates (note: accuracy decreases for very ancient dates due to astronomical uncertainties)

**🛡️ Strict Data Validation** - Actively rejects impossible input dates to prevent silent errors

**🌏 Multilingual Output** - English, Vietnamese, Traditional/Simplified Chinese

| Language              | Value   | Example                                   |
| --------------------- | ------- | ----------------------------------------- |
| English               | `en`    | `2025.06s+.18`                            |
| Vietnamese            | `vi`    | `ngày 18 tháng 6 nhuận (thiếu) năm Ất Tỵ` |
| Chinese (Traditional) | `zh`    | `乙巳年閏六月（小）十八日`                   |
| Chinese (Simplified)  | `zh-cn` | `乙巳年闰六月（小）十八日`                   |

## API

### Convert Gregorian date to Lunar calendar

```http
GET /v0/3/g2l
```

Parameters:

* `y`: Gregorian year. For example, AD 1 is 1, AD 2024 is 2024, 1 BC is 0, 10 BC is -9.
* `m`: Gregorian month, from 1 to 12.
* `d`: Gregorian day of month, from 1 to 31.
* `z`: Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.
* `lang` or `language` *(optional)*: Language of textual representation of the Lunar date, must be one of "en" (English, i.e. modern representation), "vi" (Vietnamese), "zh" (Traditional Chinese), and "zh-cn" (Simplified Chinese). If not specified, a "modern representation" would be provided. `lang` and `language` are equivalent.

Return: JSON object of the equivalent date in Lunar calendar.

Error Responses:

* `400 Bad Request`: Returned if required parameters are missing or if the provided Gregorian date is mathematically invalid (e.g., February 30th).
  ```json
  { "message": "Invalid parameters: ... See http://.../help for more." }
  ```

**Example 1:** To convert the Gregorian date July 19th, 2024 in time zone +07:00 to Lunar calendar:

```http
GET /v0/3/g2l?y=2024&m=7&d=19&z=7
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

which means July 19th, 2024 is the day 14, month 6 in Lunar calendar (approximately in AD 2024).

**Example 2:** To convert the Gregorian date August 11th, 2025 in time zone +07:00 to Lunar calendar and also get the textual representation in Traditional Chinese:

```http
GET /v0/3/g2l?y=2025&m=8&d=11&z=7&lang=zh
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

**Example 3:** To convert the Gregorian date December 31st, 2010 in time zone +07:00 to Lunar calendar and also get the textual representation in Vietnamese:

```http
GET /v0/3/g2l?y=2010&m=12&d=31&z=7&lang=vi
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
  "text": "ngày 26 tháng 11 (thiếu) năm Canh Dần"
}
```

which means December 31st, 2010 is the day 29, month 11 in Lunar calendar (approximately in AD 2010).

**Example 4:** To convert the Gregorian date August 31st, 2025 in time zone +08:00 to Lunar calendar and also get the textual representation in Simplified Chinese:

```http
GET /v0/3/g2l?y=2025&m=8&d=31&z=8&lang=zh-cn
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

```http
GET /v0/3/l2g
```

Parameters:

* `y`: The approximate Gregorian year of the Lunar year (which means most of the Lunar year falls in this Gregorian year).
* `m`: Lunar month, from 1 to 12.
* `leap`: Whether the Lunar month is leap. Must be one of: `true` (`1`) or `false` (`0`).
* `d`: Lunar day of month, from 1 to 30.
* `z`: Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.

Return: JSON object of the equivalent date in Gregorian calendar.

Error Responses:

* `400 Bad Request`: Returned if required parameters are missing, or if the requested date is astronomically impossible (e.g., requesting `d=31`, or a `leap=true` month in a year that does not have one).
  ```json
  { "message": "Invalid parameters: ... See http://.../help for more." }
  ```

**Example:** To convert the Lunar date: day 15, month 8 (not leap), approximately in AD 2024, in time zone +07:00, to Gregorian calendar,

```http
GET /v0/3/l2g?y=2024&m=8&leap=false&d=15&z=7
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

### Show Help

```http
GET /v0/3/help
```

Return: API documentation in JSON format.

## Built With

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## Contributing

Contributions welcome! Fork the repo, create a feature branch, and submit a pull request.

## Connect

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hnthap)

**Support this project:** Give it a ⭐ if you find it useful!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/hnthap)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/hnthap)

## License

Copyright (c) 2026 Huynh Nhan Thap

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
