const clone = require('./clone')

module.exports = class Backward {
  constructor(object) {
    const history = [clone(object)]
    let alreadySaved = false

    this.handler = {
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
    this.object = new Proxy(object, this.handler)
  }

  getHistory() {
    return this.history
  }

  setObjectState(state) {
    this.object = new Proxy(state, this.handler)
    this.history.push(clone(state))
  }
}
