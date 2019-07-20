function addOne (i) {
  if (typeof i !== 'number') throw new Error('Invalid type')
  return i + 1
}

module.exports = addOne
