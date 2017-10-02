var test = require('tape')
var rayTriIntersect = require('../')

test('Watertight ray triangle intersection', function (t) {
  // TODO: This breaks if any of these coordinates are 0
  //  We need to handle this case
  var rayOrigin = [3, 4, 0.1]
  var ray = [-3, -4, -0.1]
  var triangle = [
    [-10, 0, 10],
    [10, 0, 10],
    [0, 0, -10]
  ]

  var intersection = []

  rayTriIntersect(intersection, rayOrigin, ray, triangle)

  t.deepEqual(intersection, [0, 0, 0], 'intersects triangle directly in the center')

  t.end()
})
