module.exports = function deepCloneAllProps(thing) {
  const clone = Object.create(Object.getPrototypeOf(thing))
  const props = Object.getOwnPropertyNames(thing)
  const symbols = Object.getOwnPropertySymbols(thing)

  props.concat(symbols).forEach(prop => {
    const propDefinition = Object.getOwnPropertyDescriptor(thing, prop)
    if (typeof propDefinition.value === 'object') {
      propDefinition.value = deepCloneAllProps(propDefinition.value)
    }
    Object.defineProperty(clone, prop, propDefinition)
  })

  return clone
}
