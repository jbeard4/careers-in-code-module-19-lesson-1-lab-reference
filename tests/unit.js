const addOne = require('../add-one')

module.exports = {
  success: function (t) {
    t.equals(addOne(1), 2)
    t.done()
  },
  failure: function (t) {
    t.throws(addOne(NaN), Error, 'Invalid type')
    t.done()
  }
}
