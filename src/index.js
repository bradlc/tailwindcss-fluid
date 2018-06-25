const props = {
  textSizes: { prefix: 'text', prop: 'font-size' },
  fontWeights: { prefix: 'font', prop: 'font-weight' },
  leading: { prefix: 'leading', prop: 'line-height' },
  tracking: { prefix: 'tracking', prop: 'letter-spacing' },
  borderWidths: {
    prefix: 'border',
    prop: 'border-width',
    sides: true,
    hyphen: true
  },
  borderRadius: {
    prefix: 'rounded',
    prop: 'border-radius',
    sides: true,
    corners: true,
    hyphen: true
  },
  width: { prefix: 'w', prop: 'width' },
  height: { prefix: 'h', prop: 'height' },
  minWidth: { prefix: 'min-w', prop: 'min-width' },
  minHeight: { prefix: 'min-h', prop: 'min-height' },
  maxWidth: { prefix: 'max-w', prop: 'max-width' },
  maxHeight: { prefix: 'max-h', prop: 'max-height' },
  padding: {
    prefix: 'p',
    prop: 'padding',
    sides: true,
    axes: true,
    hyphen: false
  },
  margin: {
    prefix: 'm',
    prop: 'margin',
    sides: true,
    axes: true,
    hyphen: false
  },
  negativeMargin: {
    prefix: '-m',
    prop: 'margin',
    sides: true,
    axes: true,
    hyphen: false
  },
  zIndex: { prefix: 'z', prop: 'z-index' },
  opacity: { prefix: 'opacity', prop: 'opacity' }
}

const SIDES = ['top', 'right', 'bottom', 'left']
const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
const AXES = ['x', 'y']

export default function({ suffix = '-fluid', ...properties }) {
  return function({ e, addUtilities, config }) {
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
        if (props[property].axes) {
          variants.push(...AXES)
        }
        if (props[property].sides) {
          variants.push(...SIDES)
        }
        if (props[property].corners) {
          variants.push(...CORNERS)
        }

        variants.forEach(v => {
          const className = `${props[property].prefix}${shorthand(
            v,
            props[property].hyphen
          )}-${id}${suffix}`
          const selector = `.${e(className)}`
          const p = propNames(prop, v, props[property].corners)

          classes.push({
            [selector]: p.reduce((acc, curr) => {
              acc[curr] = property === 'negativeMargin' ? `-${min}` : min
              return acc
            }, {}),
            [`@media (min-width: ${minvw})`]: {
              [selector]: p.reduce((acc, curr) => {
                acc[curr] = makeFluid(values[id], property === 'negativeMargin')
                return acc
              }, {})
            },
            [`@media (min-width: ${maxvw})`]: {
              [selector]: p.reduce((acc, curr) => {
                acc[curr] = property === 'negativeMargin' ? `-${max}` : max
                return acc
              }, {})
            }
          })
        })
      })
    })

    addUtilities(classes)
  }
}

function makeFluid({ minvw, maxvw, min, max }, negate = false) {
  const mn = negate ? `-${min}` : min
  const mx = negate ? `-${max}` : max

  return `calc(${mn} + ${parseFloat(mx) -
    parseFloat(mn)} * (100vw - ${minvw}) / ${parseFloat(maxvw) -
    parseFloat(minvw)})`
}

function shorthand(longhand, hyphen = true) {
  if (longhand === '') return ''
  return (hyphen ? '-' : '') + longhand.match(/\b[a-z]/g).join('')
}

function propNames(prop, variant, corners) {
  if (!variant) return [prop]

  let variants = [variant]

  if (variant === 'x') {
    variants = ['left', 'right']
  } else if (variant === 'y') {
    variants = ['top', 'bottom']
  } else if (variant === 'top' && corners) {
    variants = ['top-left', 'top-right']
  } else if (variant === 'right' && corners) {
    variants = ['top-right', 'bottom-right']
  } else if (variant === 'bottom' && corners) {
    variants = ['bottom-left', 'bottom-right']
  } else if (variant === 'left' && corners) {
    variants = ['top-left', 'bottom-left']
  }

  const parts = prop.split('-')
  if (parts.length === 1) {
    return variants.map(v => `${parts[0]}-${v}`)
  }

  return variants.map(v => `${parts[0]}-${v}-${parts.slice(1).join('-')}`)
}
