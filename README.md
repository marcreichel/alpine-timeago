<h1 align="center">⏱ Alpine TimeAgo ⏱</h1>

<p align="center">
  An <a href="https://alpinejs.dev">Alpine.js</a> plugin to return the distance between a given date and now in words (like "3 months ago", "about 2 hours ago" or "in about 5 hours").
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@marcreichel/alpine-timeago">
    <img src="https://img.shields.io/github/v/tag/marcreichel/alpine-timeago?label=version" alt="version">
  </a>
  <a href="https://www.npmjs.com/package/@marcreichel/alpine-timeago">
    <img src="https://img.badgesize.io/marcreichel/alpine-timeago/main/dist/alpine-timeago.min.js.svg?compression=gzip&color=green" alt="Build size">
  </a>
  <a href="https://www.npmjs.com/package/@marcreichel/alpine-timeago">
    <img src="https://img.shields.io/npm/dt/@marcreichel/alpine-timeago" alt="downloads">
  </a>
  <a href="https://www.jsdelivr.com/package/npm/@marcreichel/alpine-timeago">
    <img src="https://data.jsdelivr.com/v1/package/npm/@marcreichel/alpine-timeago/badge?style=rounded" alt="JSDelivr">
  </a>
  <a href="https://www.npmjs.com/package/@marcreichel/alpine-timeago">
    <img alt="GitHub" src="https://img.shields.io/github/license/marcreichel/alpine-timeago">
  </a>
  <a href="https://gitmoji.dev/">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg" alt="Gitmoji">
  </a>
</p>

## 🚀 Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document, just before Alpine.

```html

<script src="https://cdn.jsdelivr.net/npm/@marcreichel/alpine-timeago@latest/dist/alpine-timeago.min.js" defer></script>
```

### NPM

```shell
npm install @marcreichel/alpine-timeago
```

Add the `x-timeago` directive to your project by importing the package **before** Alpine.js.

```js
import Alpine from 'alpinejs';
import TimeAgo from '@marcreichel/alpine-timeago';

Alpine.plugin(TimeAgo);

window.Alpine = Alpine;
window.Alpine.start();
```

## 🪄 Usage

### Directive

To convert a Date to the human-readable distance from now, add the `x-data` and `x-timeago` directives to an element and
pass the date (as a `Date` or a string in ISO format) to the `x-timeago` directive. The directive will update the output
every 30 seconds.

```html
<span x-data="{ date: new Date() }" x-timeago="date"></span>
```

Under the hood the directive is using [`formatDistanceToNow`](https://date-fns.org/v2.28.0/docs/formatDistanceToNow)
from `date-fns`.

#### No suffix

If you do not want the "[diff] ago" suffix or "in [diff]" prefix, you can use the `x-timeago.pure` modifier.

```html
<span x-data="{ date: new Date() }" x-timeago.pure="date"></span>
```

#### Include seconds

Distances less than a minute are more detailed.

```html
<span x-data="{ date: new Date() }" x-timeago.seconds="date"></span>
```

### Strict

If you do not want the "about [diff]" or "less than [diff]" prefixes, you can use the `x-timeago.strict` modifier.

```html
<span x-data="{ date: new Date() }" x-timeago.strict="date"></span>
```

#### Strict options

The strict mode comes with its own set of modifiers for controlling the output.

##### Force unit

Use the `x-timeago.strict.unit.[unit]` modifier with one of the following units to force the unit in the output.

- `second` (e.g. `x-timeago.strict.unit.second`)
- `minute` (e.g. `x-timeago.strict.unit.minute`)
- `hour` (e.g. `x-timeago.strict.unit.hour`)
- `day` (e.g. `x-timeago.strict.unit.day`)
- `month` (e.g. `x-timeago.strict.unit.month`)
- `year` (e.g. `x-timeago.strict.unit.year`)

##### Adjust rounding method

By default, the values are rounded using the `Math.round` algorithm. If you would like to adjust this, use
the `x-timeago.rounding.[method]` modifier with one of the following methods:

- `floor` (e.g. `x-timeago.strict.rounding.floor`)
- `ceil` (e.g. `x-timeago.strict.rounding.ceil`)
- `floor` (e.g. `x-timeago.strict.rounding.round`)

### Magic function

As of version 1.3.0 of this package a `$timeago` magic function is included which will return the human-readable
distance from now.

```html
<span x-data="{ date: new Date() }" x-text="$timeago(date)"></span>
```

> **Note**: Using the magic function the distance does not get updated automatically. You have to update it yourself if
> you want to.

#### No suffix

If you do not want the "[diff] ago" suffix or "in [diff]" prefix, you can provide `true` as the second parameter to the
function.

```html
<span x-data="{ date: new Date() }" x-text="$timeago(date, true)"></span>
```

#### Include seconds

If you want distances less than a minute to be more detailed, you can provide `true` as the third parameter to the
function.

```html
<span x-data="{ date: new Date() }" x-text="$timeago(date, null, true)"></span>
```

#### Strict

If you do not want the "about [diff]" or "less than [diff]" prefixes, you can use the fourth parameter to provide the "
strict" options.

##### Default

```html
<span x-data="{ date: new Date() }"
      x-text="$timeago(date, null, null, { strict: true })"></span>
```

##### Unit

```html
<span x-data="{ date: new Date() }"
      x-text="$timeago(date, null, null, { strict: true, unit: 'second' })"></span>
```

##### Rounding method

```html
<span x-data="{ date: new Date() }"
      x-text="$timeago(date, null, null, { strict: true, roundingMethod: 'floor' })"></span>
```

### Other locales

If you are using the `npm` installation method for this package or the ESM distribution, you can use the
`TimeAgo.configure()` method to provide a different locale from `date-fns`.

```javascript
import TimeAgo from '@marcreichel/alpine-timeago';
import {de} from 'date-fns/locale';

Alpine.plugin(TimeAgo.configure({
    locale: de,
}));
```

## 📄 License

Copyright (c) 2022 Marc Reichel and contributors.

Licensed under the MIT license, see [LICENSE](LICENSE) for details.
