# tailwindcss-fluid

> Fluid utilities for Tailwind CSS

## Install

```
npm install --save-dev tailwindcss-fluid
```

## Usage

Add the plugin to your Tailwind configuration:

```js
// tailwind.js
module.exports = {
  // ...
  plugins: [
    require('tailwindcss-fluid')({
      // settings
    })
  ]
}
```

## Settings

You define which class names will be generated much like you do in the core Tailwind configuration. The difference is that each variant (e.g. `sm`, `md`, `lg` etc.) has four properties: `min`, `max`, `minvw`, and `maxvw`:

```js
{
  textSizes: {
    sm: {
      min: '14px',
      max: '20px',
      minvw: '320px',
      maxvw: '1400px'
    }
  }
}
```

The above settings will generate one new utility class, `.text-sm-fluid`:

```css
.text-sm-fluid {
  font-size: 14px;
}

@media (min-width: 320px) {
  .text-sm-fluid {
    font-size: calc(14px + 6 * (100vw - 320px) / 1080);
  }
}

@media (min-width: 1400px) {
  .text-sm-fluid {
    font-size: 20px;
  }
}
```

### Supported properties

`textSizes`, `fontWeights`, `leading`, `tracking`, `borderWidths`, `borderRadius`, `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `padding`, `margin`, `negativeMargin`, `zIndex`, `opacity`

### Setting your values in the core Tailwind config

If you set a property to `true` it will take the settings from your core config (e.g. `module.exports.textSizes`):

```js
{
  textSizes: true
}
```

**Note: In this case you will probably want to disable the core `textSizes` module**

### Non-fluid values

You can generate non-fluid utilities by defining a single value, like you would normally. This is useful if you want fluid and non-fluid values defined in the same place:

```js
{
  textSizes: {
    sm: '14px',
    md: {
      min: '16px',
      max: '22px',
      minvw: '320px',
      maxvw: '1280px'
    }
  }
}
```

### Suffix

By default all generated class names will end with `-fluid`. You can override this behaviour with the `suffix` setting:

```js
{
  suffix: '', // default: '-fluid'
}
```

## Example

Here is an example of using `tailwindcss-fluid` for all of your (fluid and non-fluid) `font-size` utilities:

```js
// tailwind.js
module.exports = {
  // ...

  textSizes: {
    sm: '14px',
    md: {
      min: '16px',
      max: '20px',
      minvw: '320px',
      maxvw: '1280px'
    },
    lg: {
      min: '26px',
      max: '40px',
      minvw: '320px',
      maxvw: '1280px'
    }
  },

  // ...

  modules: {
    // ...

    textSizes: false // disable the core module

    // ...
  },

  plugins: [
    require('tailwindcss-fluid')({
      suffix: '',
      textSizes: true // use the settings defined the core config (above)
    })
  ]
}
```

This configuration will produce **three** `font-size` utility classes: `text-sm`, `text-md`, and `text-lg`.

## Links

* [Responsive And Fluid Typography With vh And vw Units](https://www.smashingmagazine.com/2016/05/fluid-typography/)
* [Flexible typography with CSS locks](https://blog.typekit.com/2016/08/17/flexible-typography-with-css-locks/)
