import { useEffect, useState } from 'react'
import { calcOffsetBounds, Offset, prevIfEqual } from './util'

const INITIAL_OFFSET = Object.freeze({ x: 0, y: 0 })

function initialOffsets(length: number) {
  return Array<Offset>(length).fill(INITIAL_OFFSET)
}

/**
 * @param dragEl The element that is being dragged.
 * @param offsets The offsets of all the elements
 * @returns The offsets after elements have been swapped dude to dragging the `dragEl`.
 */
function calcNewOffsets(
  dragEl: HTMLElement,
  dragOffset: Offset,
  offsets: Offset[],
  swapThreshold: number,
): Offset[] {
  const elements = Array.from(dragEl.parentNode?.children ?? []) as HTMLElement[]
  const dragBounds = calcOffsetBounds(dragEl, dragOffset)
  let passedDragEl = false
  return elements.map<Offset>((el, i) => {
    if (el === dragEl) {
      passedDragEl = true
      return offsets[i]
    }

    const elOffset = offsets[i]
    const elBounds = calcOffsetBounds(el, elOffset)
    const isAboveDragEl = elOffset.y === 0 ? !passedDragEl : passedDragEl
    const availableHeight = isAboveDragEl
      ? elBounds.bottom - dragBounds.top
      : dragBounds.bottom - elBounds.top
    if (availableHeight >= el.offsetHeight * swapThreshold) {
      if (elOffset.y !== 0) {
        return { x: 0, y: 0 }
      }
      return passedDragEl ? { x: 0, y: -dragEl.offsetHeight } : { x: 0, y: dragEl.offsetHeight }
    }
    return elOffset
  })
}

export function useSortableOffsets(length: number, swapThreshold: number) {
  const [offsets, setOffsets] = useState<Offset[]>(() => initialOffsets(length))
  const resetOffsets = () => {
    setOffsets((prev) => prevIfEqual(prev, initialOffsets(length)))
  }
  useEffect(resetOffsets, [length])
  return {
    offsets,
    resetOffsets,
    updateOffsets(dragEl: HTMLElement, dragOffset: Offset) {
      setOffsets((prevOffsets) =>
        prevIfEqual(prevOffsets, calcNewOffsets(dragEl, dragOffset, prevOffsets, swapThreshold)),
      )
    },
  }
}
