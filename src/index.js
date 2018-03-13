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
  return function({ e, prefix, addComponents, config }) {
    const classes = []

    Object.keys(properties).forEach(property => {
      const values =
        properties[property] === true ? config(property) : properties[property]

      Object.keys(values).forEach(id => {
        const prop = props[property].prop

        if (typeof values[id] === 'string' || typeof values[id] === 'number') {
          const className = `${props[property].prefix}-${id}${suffix}`
          const selector = prefix(`.${e(className)}`)

          classes.push({
            [selector]: {
              [prop]: property === 'negativeMargin' ? `-${values[id]}` : values[id]
            }
          })
          return
        }

        const { min, max, minvw, maxvw } = values[id]

        const variants = ['']
        if (props[property].sides) {
          variants.push('-t', '-r', '-b', '-l')
        }
        if (props[property].corners) {
          variants.push('-tl', '-tr', '-br', '-bl')
        }

        variants.forEach(v => {
          const className = `${props[property].prefix}-${id}${v}${suffix}`
          const selector = prefix(`.${e(className)}`)

          classes.push({
            [selector]: {
              [prop]: property === 'negativeMargin' ? `-${min}` : min
            },
            [`@media (min-width: ${minvw})`]: {
              [selector]: {
                [prop]: makeFluid(values[id], property === 'negativeMargin')
              }
            },
            [`@media (min-width: ${maxvw})`]: {
              [selector]: {
                [prop]: property === 'negativeMargin' ? `-${max}` : max
              }
            }
          })
        })
      })
    })

    addComponents(classes)
  }
}

function makeFluid({ minvw, maxvw, min, max }, negate = false) {
  const mn = negate ? `-${min}` : min
  const mx = negate ? `-${max}` : max

  return `calc(${mn} + ${parseFloat(mx) -
    parseFloat(mn)} * (100vw - ${minvw}) / ${parseFloat(maxvw) -
    parseFloat(minvw)})`
}
