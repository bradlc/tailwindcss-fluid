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

const SIDES = ['top', 'right', 'bottom', 'left']
const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left']

export default function({ suffix = '-fluid', ...properties }) {
  return function({ e, addComponents, config }) {
    const classes = []

    Object.keys(properties).forEach(property => {
      const values =
        properties[property] === true ? config(property) : properties[property]

      Object.keys(values).forEach(id => {
        const prop = props[property].prop

        if (typeof values[id] === 'string' || typeof values[id] === 'number') {
          const className = `${props[property].prefix}-${id}${suffix}`
          const selector = `.${e(className)}`

          classes.push({
            [selector]: {
              [prop]:
                property === 'negativeMargin' ? `-${values[id]}` : values[id]
            }
          })
          return
        }

        const { min, max, minvw, maxvw } = values[id]

        const variants = ['']
        if (props[property].sides) {
          variants.push(...SIDES)
        }
        if (props[property].corners) {
          variants.push(...CORNERS)
        }

        variants.forEach(v => {
          const className = `${props[property].prefix}${shorthand(
            v
          )}-${id}${suffix}`
          const selector = `.${e(className)}`
          const p = propName(prop, v)

          classes.push({
            [selector]: {
              [p]: property === 'negativeMargin' ? `-${min}` : min
            },
            [`@media (min-width: ${minvw})`]: {
              [selector]: {
                [p]: makeFluid(values[id], property === 'negativeMargin')
              }
            },
            [`@media (min-width: ${maxvw})`]: {
              [selector]: {
                [p]: property === 'negativeMargin' ? `-${max}` : max
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

function shorthand(longhand) {
  if (longhand === '') return ''
  return '-' + longhand.match(/\b[a-z]/g).join('')
}

function propName(prop, variant) {
  if (!variant) return prop

  const parts = prop.split('-')
  if (parts.length === 1) {
    return `${parts[0]}-${variant}`
  }

  return `${parts[0]}-${variant}-${parts.slice(1).join('-')}`
}
