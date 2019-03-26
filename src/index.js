import polyFluidSizing from './polyFluidSizing.js'

const modules = {
  fluidTextSizes: { prefix: 'text', prop: 'font-size' },
  fluidFontSize: { prefix: 'text', prop: 'font-size' }, // v1
  fluidFontWeights: { prefix: 'font', prop: 'font-weight' },
  fluidFontWeight: { prefix: 'font', prop: 'font-weight' }, // v1
  fluidLeading: { prefix: 'leading', prop: 'line-height' },
  fluidLineHeight: { prefix: 'leading', prop: 'line-height' }, // v1
  fluidTracking: { prefix: 'tracking', prop: 'letter-spacing' },
  fluidLetterSpacing: { prefix: 'tracking', prop: 'letter-spacing' }, // v1
  fluidBorderWidths: {
    prefix: 'border',
    prop: 'border-width',
    sides: true,
    hyphen: true
  },
  fluidBorderWidth: {
    // v1
    prefix: 'border',
    prop: 'border-width',
    sides: true,
    hyphen: true
  },
  fluidBorderRadius: {
    prefix: 'rounded',
    prop: 'border-radius',
    sides: true,
    corners: true,
    hyphen: true
  },
  fluidWidth: { prefix: 'w', prop: 'width' },
  fluidHeight: { prefix: 'h', prop: 'height' },
  fluidMinWidth: { prefix: 'min-w', prop: 'min-width' },
  fluidMinHeight: { prefix: 'min-h', prop: 'min-height' },
  fluidMaxWidth: { prefix: 'max-w', prop: 'max-width' },
  fluidMaxHeight: { prefix: 'max-h', prop: 'max-height' },
  fluidPadding: {
    prefix: 'p',
    prop: 'padding',
    sides: true,
    axes: true,
    hyphen: false
  },
  fluidMargin: {
    prefix: 'm',
    prop: 'margin',
    sides: true,
    axes: true,
    hyphen: false
  },
  fluidNegativeMargin: {
    prefix: '-m',
    prop: 'margin',
    sides: true,
    axes: true,
    hyphen: false
  },
  fluidZIndex: { prefix: 'z', prop: 'z-index' },
  fluidOpacity: { prefix: 'opacity', prop: 'opacity' }
}

const SIDES = ['top', 'right', 'bottom', 'left']
const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
const AXES = ['x', 'y']

export default function({
  transformClassName,
  rem = false,
  rootFontSize = 16
} = {}) {
  return function({ e, addUtilities, config }) {
    Object.keys(modules).forEach(mod => {
      const values = config(mod, config(`theme.${mod}`, {}))

      Object.keys(values).forEach(id => {
        const prop = modules[mod].prop

        const variants = ['']
        if (modules[mod].axes) {
          variants.push(...AXES)
        }
        if (modules[mod].sides) {
          variants.push(...SIDES)
        }
        if (modules[mod].corners) {
          variants.push(...CORNERS)
        }

        variants.forEach(v => {
          let className = `${modules[mod].prefix}${shorthand(
            v,
            modules[mod].hyphen
          )}-${id}`
          if (transformClassName) className = transformClassName(className)
          let selector = `.${e(className)}`
          const p = propNames(prop, v, modules[mod].corners)

          addUtilities(
            polyFluidSizing(selector, p, values[id], { rem, rootFontSize }),
            config(`modules.${mod}`, config(`variants.${mod}`, []))
          )
        })
      })
    })
  }
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
