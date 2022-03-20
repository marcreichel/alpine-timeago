<h1 align="center">⏱ Alpine TimeAgo ⏱</h1>

<p align="center">
  An <a href="https://alpinejs.dev">Alpine.js</a> plugin to return the distance between a given date and now in words.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@marcreichel/alpine-timeago">
    <img src="https://img.shields.io/github/v/tag/marcreichel/alpine-timeago?label=version" alt="version">
  </a>
  <a href="https://www.npmjs.com/package/@marcreichel/alpine-autosize">
    <img src="https://img.badgesize.io/marcreichel/alpine-timeago/main/dist/alpine-timeago.js.svg?compression=gzip&color=green" alt="Build size">
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

To convert a Date to the human-readable distance from now, add the `x-data` and `x-timeago` directives to an element and
pass the date (as a `Date` or a string in ISO format) to the `x-timeago` directive. The directive will update the output
every 30 seconds.

```html
<span x-data="{ date: new Date() }" x-timeago="date"></span>
```

Under the hood the directive is using [`formatDistanceToNow`](https://date-fns.org/v2.28.0/docs/formatDistanceToNow)
from `date-fns`.

### Hooks

If you are using the `npm` installation method for this package or the ESM distribution, you can use the
`TimeAgo.configure()` method to provide a different locale from `date-fns`.

```javascript
import TimeAgo from '@marcreichel/alpine-timeago';
import { de } from 'date-fns/locale';

Alpine.plugin(TimeAgo.configure({
    locale: de,
}));
```

## 📄 License

Copyright (c) 2022 Marc Reichel and contributors.

Licensed under the MIT license, see [LICENSE](LICENSE) for details.
