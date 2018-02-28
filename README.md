# tailwindcss-fluid

```js
// tailwind.js
module.exports = {
  // ...
  plugins: [
    require('tailwindcss-fluid')({
      suffix: '-fluid',
      textSizes: {
        md: {
          min: '20px',
          max: '50px',
          minvw: '320px',
          maxvw: '1400px'
        }
      }
    })
  ]
}
```

The above configuration generates one new utility class, `.text-md-fluid`:

```css
.text-md-fluid {
  font-size: 20px;
}

@media (min-width: 320px) {
  .text-md-fluid {
    font-size: calc(20px + 30 * (100vw - 320px) / 1080);
  }
}

@media (min-width: 1400px) {
  .text-md-fluid {
    font-size: 50px;
  }
}
```
