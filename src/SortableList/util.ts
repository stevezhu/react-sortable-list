import deepEqual from 'fast-deep-equal/es6/react'

export type Offset = {
  x: number
  y: number
}

export type Bounds = {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * @param element The element to calculate the offset relative to.
 * @param offset The offset.
 * @return The bounds of an HTMLElement with an offset.
 */
export function calcOffsetBounds(
  {
    offsetTop: originalTop,
    offsetLeft: originalLeft,
    offsetWidth: width,
    offsetHeight: height,
  }: HTMLElement,
  offset: Offset,
): Bounds {
  const top = originalTop + offset.y
  const left = originalLeft + offset.x
  return {
    top,
    bottom: top + height,
    left,
    right: left + width,
  }
}

/**
 * @param prev
 * @param next
 * @returns `prev` if `prev` and `next` are deeply equal, `next` otherwise
 */
export function prevIfEqual<S>(prev: S, next: S) {
  return deepEqual(prev, next) ? prev : next
}
