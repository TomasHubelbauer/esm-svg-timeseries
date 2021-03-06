# ESM SVG Timeseries

An ESM library for rendering an SVG timeseries plot.

## Installation

```js
import render from 'https://tomashubelbauer.github.io/esm-svg-timeseries/index.js';
```

## Usage

Set proper `width` and `height` values on your SVG element with no content.
To use in an existing SVG, use `foreignObject`.

```js
const timeseriesSvg = document.getElementById('timeseriesSvg');
const data = [];
window.setInterval(() => {
  data.push({ stamp: new Date(), value: Math.random() });
  render(timeseriesSvg, data);
}, 100);
```

The arguments are:

- `svg`: the SVG element instace to render the plot to
- `data`: an array of `{ stamp: Date, value: Numbe }` points to plot
- `forceMinValue`: forced min value (default: zero to prevent jumping)
- `forceMaxValue`: forced max value
  - Set this to the series' max value if rendering windows to prevent jumping

Check out [`demo.html`](demo.html).

## To-Do

### Do a better reconciliation than clearing `innerHTML` and appending a fragment

Reuse existing elements and update their attribute values where possible.

### Handle empty data either by rendering nothing or empty axes with no offsets

### Implement rendering axis markets with intelligent increment on both axes

### Use correct stamp representation automatically

Skip the stamp components which are equal across the board instead of defaulting
to time-only.
