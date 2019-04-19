const {expect} = require('chai')
const Backward = require('.')

describe('Backward', function() {
  it('saves object state change history', function() {
    const thing = {
      hello: 'world'
    }
    const ward = new Backward(thing)
    ward.object.stuff = 2

    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {hello: 'world', stuff: 2},
    ])

    ward.object.stuff = 3
    ward.object.foo = {
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
    delete ward.object.foo

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
    Object.defineProperty(ward.object, 'stuff', {value: 2, enumerable: false})

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

    ward.object[stuff] = 2

    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {hello: 'world'},
    ])
    expect(ward.getHistory()[1][stuff]).to.eql(2)
  })

  it('sets object state', function() {
    const thing = {
      hello: 'world'
    }
    const ward = new Backward(thing)
    ward.setObjectState({buzz: false})

    expect(ward.object).to.eql({buzz: false})
    expect(ward.getHistory()).to.eql([
      {hello: 'world'},
      {buzz: false},
    ])
  })
})
