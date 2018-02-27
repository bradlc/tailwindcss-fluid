const props = {
  textSizes: { prefix: 'text', prop: 'font-size' },
  fontWeights: { prefix: 'font', prop: 'font-weight' },
  leading: { prefix: 'leading', prop: 'line-height' },
  tracking: { prefix: 'tracking', prop: 'letter-spacing' },
  borderWidths: { prefix: 'border', prop: 'border-width', sides: true },
  borderRadius: {
    prefix: 'rounded',
    prop: 'border-radius',
    sides: true,
    corners: true
  },
  width: { prefix: 'w', prop: 'width' },
  height: { prefix: 'h', prop: 'height' },
  minWidth: { prefix: 'min-w', prop: 'min-width' },
  minHeight: { prefix: 'min-h', prop: 'min-height' },
  maxWidth: { prefix: 'max-w', prop: 'max-width' },
  maxHeight: { prefix: 'max-h', prop: 'max-height' },
  padding: { prefix: 'p', prop: 'padding', sides: true },
  margin: { prefix: 'm', prop: 'margin', sides: true },
  negativeMargin: { prefix: '-m', prop: 'margin', sides: true },
  zIndex: { prefix: 'z', prop: 'z-index' },
  opacity: { prefix: 'opacity', prop: 'opacity' }
}

export default function({ suffix = '-fluid', ...properties }) {
  return function({ rule, atRule, addComponents }) {
    const classes = []

    Object.keys(properties).forEach(property => {
      Object.keys(properties[property]).forEach(id => {
        const prop = props[property].prop
        const { min, max, minvw, maxvw } = properties[property][id]

        const variants = ['']
        if (props[property].sides) {
          variants.push('-t', '-r', '-b', '-l')
        }
        if (props[property].corners) {
          variants.push('-tl', '-tr', '-br', '-bl')
        }

        variants.forEach(v => {
          const selector = `.${props[property].prefix}-${id}${v}${suffix}`

          classes.push(
            rule(selector, {
              [prop]: min
            }),
            atRule(`@media (min-width: ${minvw})`, [
              rule(selector, {
                [prop]: makeFluid(
                  properties[property][id],
                  property === 'negativeMargin'
                )
              })
            ]),
            atRule(`@media (min-width: ${maxvw})`, [
              rule(selector, { [prop]: max })
            ])
          )
        })
      })
    })

    addComponents(classes)
  }
}

function makeFluid({ minvw, maxvw, min, max }, negate = false) {
  const mn = negate ? -max : min
  const mx = negate ? -min : max

  return `calc(${mn} + ${parseFloat(mx) -
    parseFloat(mn)} * (100vw - ${minvw} / ${parseFloat(maxvw) -
    parseFloat(minvw)}))`
}
