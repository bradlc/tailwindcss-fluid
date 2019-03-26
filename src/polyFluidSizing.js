function getCommonUnit(map) {
  let values = [...Object.keys(map), ...Object.values(map)]
  let unit = null
  for (let i = 0; i < values.length; i++) {
    let m = values[i].toString().match(/[0-9]([a-z]*)$/i)
    if (!m) throw new Error('')
    if (unit === null) {
      unit = m[1]
    } else if (m[1] !== unit) {
      throw new Error('')
    }
  }
  return unit
}

function round(x, precision) {
  return parseFloat(x)
    .toPrecision(precision)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
}

function lerp(map, pxToRem) {
  let keys = Object.keys(map)

  let k1 = parseFloat(keys[0])
  let k2 = parseFloat(keys[1])
  let v1 = parseFloat(map[keys[0]])
  let v2 = parseFloat(map[keys[1]])

  let unit = getCommonUnit(map)

  let m = (v2 - v1) / (k2 - k1)
  let b = v1 - m * k1
  let sign = '+'
  if (b < 0) {
    sign = '-'
    b = Math.abs(b)
  }

  return `calc(${round(m * 100, 7)}vw ${sign} ${pxToRem(round(b, 7) + unit)})`
}

function createProperties(properties, value) {
  return properties.reduce((acc, curr) => {
    return { ...acc, [curr]: value }
  }, {})
}

export default function polyFluidSizing(
  selector,
  properties,
  map,
  { rem = false, rootFontSize = 16 }
) {
  let pxToRem = x => x
  if (rem) {
    pxToRem = (
      px,
      base = rootFontSize <= 1 ? rootFontSize * 16 : rootFontSize
    ) => {
      return px.replace(/([0-9.]+)px$/gi, (_, p1) => {
        return `${parseFloat(p1) / base}rem`
      })
    }
  }

  if (!Array.isArray(properties)) properties = [properties]
  let rules = {}
  let keys = Object.keys(map).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  rules[selector] = createProperties(properties, pxToRem(map[keys[0]]))

  for (let i = 0; i < keys.length - 1; i++) {
    let key = keys[i]
    let media = `@media (min-width: ${pxToRem(key, 16)})`
    rules[media] = { [selector]: {} }
    let v1 = map[key]
    let v2 = map[keys[i + 1]]
    if (v1 !== v2) {
      rules[media][selector] = createProperties(
        properties,
        lerp({ [key]: v1, [keys[i + 1]]: v2 }, pxToRem)
      )
    } else {
      rules[media][selector] = createProperties(properties, pxToRem(v1))
    }
  }

  rules[`@media (min-width: ${pxToRem(keys[keys.length - 1], 16)})`] = {
    [selector]: createProperties(
      properties,
      pxToRem(map[keys[keys.length - 1]])
    )
  }

  return rules
}
