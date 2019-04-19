const clone = require('./clone')

module.exports = class Backward {
  constructor(object) {
    const history = [clone(object)]
    let alreadySaved = false

    const handler = {
      set(object) {
        const res = Reflect.set(...arguments)
        if (!alreadySaved) {
          history.push(clone(object))
        }
        alreadySaved = false
        return res
      },
      defineProperty(object, prop, definition) {
        const res = Reflect.defineProperty(object, prop, definition)
        history.push(clone(object))
        alreadySaved = true
        return res
      },
      deleteProperty(object, prop) {
        delete object[prop]
        history.push(clone(object))
      }
    }

    this.history = history
    this.proxy = new Proxy(object, handler)
  }

  getHistory() {
    return this.history
  }
}
