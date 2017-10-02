var subtractVec3 = require('gl-vec3/subtract')

module.exports = getWatertightIntersection

/**
 * Use Watertight Ray/Triangle intersection to get the intersection of a ray
 * and a triangle, or null if they do not intersect
 *
 * NOTE: I didn't come up with this algorith. I am just implementing the pseudo code
 * example that the paper contains.
 *
 * TODO: Parts of this algorithm can be applied to the ray upfront so that if
 * we're testing against multiple triangles we don't need to recompute our
 * ray multiple times
 *
 * TODO: Pull out all array initialization into the root scope of this file.
 * Just re-use the same arrays
 *
 * @see http://jcgt.org/published/0002/01/05/paper.pdf - original paper
 * @see https://developer.blender.org/D819 - Blender's implementation
 */
function getWatertightIntersection (intersection, rayOrigin, ray, triangle, opts) {
  opts = opts || {}

  var kz = getMaxAxis(ray)
  var kx = kz + 1
  if (kx === 3) { kx = 0 }
  var ky = kx + 1
  if (ky === 3) { ky = 0 }

  // Swap kx and ky dimension to preserve winding direction of triangle
  if (ray[kz] < 0) {
    var swap = ky
    ky = kx
    kx = swap
  }

  // TODO: Handle cases when we need to divide by zero because one of the ray
  // components is zero.
  // example rays that breaks -> [3, 4, 0] ... [10, 0, 10]... any ray with a 0 in it
  if (ray[kz] === 0) {
    // ray[kz] = 0.0000000001
  }

  // Calculate the shear constants
  var Sz = 1.0 / ray[kz]
  var Sx = ray[kx] * Sz
  var Sy = ray[ky] * Sz

  // Calculate the vertices relative to the ray origin
  var A = subtractVec3([], triangle[0], rayOrigin)
  var B = subtractVec3([], triangle[1], rayOrigin)
  var C = subtractVec3([], triangle[2], rayOrigin)

  // Perform shear and scale on vertices
  var Ax = A[kx] - Sx * A[kz]
  var Ay = A[ky] - Sy * A[kz]
  var Bx = B[kx] - Sx * B[kz]
  var By = B[ky] - Sy * B[kz]
  var Cx = C[kx] - Sx * C[kz]
  var Cy = C[ky] - Sy * C[kz]

  // Calculate scaled barycentric coordinates
  var U = Cx * By - Cy * Bx
  var V = Ax * Cy - Ay * Cx
  var W = Bx * Ay - By * Ax

  /**
    We aren't implementing the fallback that uses double precision at the
    triangle's edges because JavaScript numbers always use double precision
    if (U === 0 || V === 0 || W === 0) {
    }
    */

  // Abort early if we know that we have not intersected our triangle
  if (opts.backfaceCulling) {
    if (U < 0 || V < 0 || W < 0) { return }
  } else {
    if (
      (U < 0 || V < 0 || W < 0) &&
      (U > 0 || V > 0 || W > 0)
    ) {
      return
    }
  }

  // Calculate determinant
  var det = U + V + W
  if (det === 0) { return }

  // Calculate scaled z-coordinates of vertices and use them to calculate the
  // hit distance
  var Az = Sz * A[kz]
  var Bz = Sz * B[kz]
  var Cz = Sz * C[kz]
  var T = U * Az + V * Bz + W * Cz

  var inverseDet = 1.0 / det

  // var hitU = U * inverseDet
  // var hitV = V * inverseDet
  // var hitW = W * inverseDet

  // Parametric distance from ray origin to intersection
  var t = T * inverseDet

  intersection[0] = t * ray[0] + rayOrigin[0]
  intersection[1] = t * ray[1] + rayOrigin[1]
  intersection[2] = t * ray[2] + rayOrigin[2]

  return intersection
}

/**
 * As per the watertight ray/triangle intersection algorithm, calculate
 * the direction in which the ray is largest
 */
function getMaxAxis (ray) {
  if (ray[0] > ray[1]) {
    if (ray[0] > ray[2]) {
      // X component of ray is largest
      return 0
    } else {
      // Z component of ray is largest
      return 2
    }
  } else {
    if (ray[1] > ray[2]) {
      // Y component of ray is lragest
      return 1
    } else {
      // Z component of ray is largest
      return 2
    }
  }
}
