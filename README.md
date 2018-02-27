# tailwindcss-fluid

```js
// tailwind.js
module.exports = {
  // ...
  plugins: [
    require('tailwindcss-fluid')({
      suffix: '-fluid',
      textSizes: {
        xs: {
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
