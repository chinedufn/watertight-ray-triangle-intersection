watertight-ray-triangle-intersection [![npm version](https://badge.fury.io/js/watertight-ray-triangle-intersection.svg)](http://badge.fury.io/js/watertight-ray-triangle-intersection) [![Build Status](https://travis-ci.org/chinedufn/watertight-ray-triangle-intersection.svg?branch=master)](https://travis-ci.org/chinedufn/watertight-ray-triangle-intersection)
===============

> An implementation of the Watertight Ray/Triangle Intersection algorithm

## Background / Initial Motivation

I've been using [substack/ray-triangle-intersection](https://github.com/substack/ray-triangle-intersection) for some of my mouse picking, but
Möller–Trumbore ray-triangle intersection algorithm that it uses does not satisfy my use case this time around.

I'm mousing over a grid based terrain and determining which tile in the terrain is moused over. Since the Möller–Trumbore algorithm isn't watertight,
when I mouse in between two tiles neither tile is selected and thus it's as if you aren't mousing over the terrain at all.

The goal of this `watertight-ray-triangle-intersection` module is to implement the algorithm found in the [Water Ray/Triangle Intersection](http://jcgt.org/published/0002/01/05/paper.pdf)
in order to solve this problem for myself, and hopefully you too.

## To Install

```
$ npm install --save watertight-ray-triangle-intersection
```

## Usage

```js
var rayTriIntersect = require('watertight-ray-triangle-intersection')

var rayOrigin = [3, 4, 0.1]
var ray = [-3, -4, -0.1]
var triangle = [
  [-10, 0, 10],
  [10, 0, 10],
  [0, 0, -10]
]

var intersection = []

rayTriIntersect(intersection, rayOrigin, ray, triangle)
console.log(intersection)
// [0, 0, 0]
```

## API

### `intersection(intersectionCoords, rayOrigin, ray, triangle, options)` -> `intersectionCoords`

#### intersectionCoords

*Required*

Type: `Array[3]`

#### rayOrigin

*Required*

Type: `Array[3]`

The start location of your ray

```
var rayOrigin = [500, 25, 17]
```

#### ray

*Required*

Type: `Array[3]`

```js
// Example ray
var ray = [1, 0, 0]
```

A vector that specifies your ray's direction in 3d space.

#### triangle

*Required*

Type: `Array[3]`

An array of 3 arrays.

Each of the sub arrays is an array of 3 points.

```js
// Example Triangle
var triangle = [
  [-1, 0, 1],
  [1, 0, 1],
  [0, 0, -1]
]
```

#### options

```js
var options = {
  backfaceCulling: false
}
```

##### backfaceCulling

Type: `Boolean`

Default: `false`

Whether or not to use back-face culling when testing for intersections.

## TODO:

- [ ] benchmark
- [ ] fix divide by zero issues when a ray had a 0 as `x, y, or z` (see code comments for further details)

## References

- [Watertight Ray/Triangle Intersection](http://jcgt.org/published/0002/01/05/paper.pdf)

## License

MIT
