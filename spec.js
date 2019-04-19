const {expect} = require('chai')
const Backward = require('.')

describe('Backward', function() {
  it('saves object state change history', function() {
    const thing = {
      hello: 'world'
    }
    const ward = new Backward(thing)
    ward.proxy.stuff = 2

    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {hello: 'world', stuff: 2},
    ])

    ward.proxy.stuff = 3
    ward.proxy.foo = {
      bar: true
    }

    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {hello: 'world', stuff: 2},
      {hello: 'world', stuff: 3},
      {hello: 'world', stuff: 3, foo: {bar: true}},
    ])
  })

  it('tracks delete property', function() {
    const thing = {
      hello: 'world',
      foo: 'bar'
    }
    const ward = new Backward(thing)
    delete ward.proxy.foo

    expect(ward.getHistory()).to.eql([
      {hello: 'world', foo: 'bar'},
      {hello: 'world'},
    ])
  })

  it('tracks non-enumerable properties', function() {
    const thing = {
      hello: 'world'
    }
    const ward = new Backward(thing)
    Object.defineProperty(ward.proxy, 'stuff', {value: 2, enumerable: false})

    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {hello: 'world'},
    ])
    expect(ward.getHistory()[1].stuff).to.eql(2)
  })

  it('tracks Symbol properties', function() {
    const stuff = Symbol('stuff')
    const thing = {
      hello: 'world'
    }
    const ward = new Backward(thing)

    ward.proxy[stuff] = 2

    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {hello: 'world'},
    ])
    expect(ward.getHistory()[1][stuff]).to.eql(2)
  })
})
