Backward
------

Tracks object change history.

## Usage

```
npm install backward
```

```js
const Backward = require('backward')

const thing = {foo: 'bar'}
const ward = new Backward(thing)

ward.object.hello = 'world'

// list object history
assert.equal(ward.getHistory(), [
  {foo: 'bar'},
  {foo: 'bar', hello: 'world'}
])

// time travel
ward.setObjectState(ward.getHistory()[0])
```
