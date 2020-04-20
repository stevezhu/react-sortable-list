import arrayMove from 'array-move'
import React, { useState } from 'react'
import type { ComponentType, Dispatch, SetStateAction } from 'react'
import Draggable, { ControlPosition, DraggableBounds } from 'react-draggable'
import { useUIDSeed } from 'react-uid'
import { styles } from './styles'
import { useSortableOffsets } from './useSortableOffsets'

type SortableItemProps<T> = {
  item: T
  index: number
}

type SortableListProps<T> = {
  children: ComponentType<SortableItemProps<T>>
  list: T[]
  setList: Dispatch<SetStateAction<T[]>>
  /**
   * The duration in milliseconds the transition animation should take.
   */
  transitionDuration?: number
  /**
   * The empty space that is available as a percentage of element height before the element swaps.
   *
   * For example, if an element is 100px in height and swapThreshold is 0.5, then the element would
   * swap once 50px of space is availabe.
   *
   * Valid values are 0.5 ≤ `swapThreshold` ≤ 1
   *
   * `swapThreshold` cannot be less than 0.5 because otherwise the element would continuously flip
   * back and forth. This is because once the element swaps, there is exactly half of the space
   * left at the original position.
   */
  swapThreshold?: number
}

export function SortableList<T>({
  children: SortableComponent,
  list,
  setList,
  transitionDuration = 300,
  swapThreshold = 0.5,
}: SortableListProps<T>) {
  swapThreshold = Math.max(0.5, Math.min(swapThreshold, 1))

  const seed = useUIDSeed()
  const [bounds, setBounds] = useState<DraggableBounds | 'parent'>('parent')
  const { offsets, resetOffsets, updateOffsets } = useSortableOffsets(list.length, swapThreshold)
  return (
    <div className={styles.root}>
      {list.map((item, index) => {
        return (
          <Draggable
            key={seed(item)}
            axis="y"
            position={offsets[index]}
            bounds={bounds}
            onStart={(e, data) => {
              // 1. Set transition durations for other nodes
              setTransitionDurations(data.node, transitionDuration)
              // 2. Set dragging data
              setBounds(calcDragBounds(data.node))
            }}
            onDrag={(e, data) => updateOffsets(data.node, data)}
            onStop={(e, data) => {
              // 1. Reset transition durations
              setTransitionDurations(data.node)
              // 2. Reset state
              setBounds('parent')
              resetOffsets()
              // 3. Update list
              const newIndex = getNewIndex(index, offsets)
              if (index !== newIndex) {
                setList(arrayMove(list, index, newIndex))
              }
            }}
          >
            {/*
              This div is needed because react-draggable expects certain native props on its child.
              https://github.com/STRML/react-draggable#draggable-api
            */}
            <div>
              <SortableComponent item={item} index={index} />
            </div>
          </Draggable>
        )
      })}
    </div>
  )
}

/**
 * @param dragEl The element being dragged.
 * @param duration Not passing in duration will unset the style.
 */
function setTransitionDurations(dragEl: HTMLElement, duration?: number) {
  const elements: Iterable<Element> = dragEl.parentNode?.children ?? []
  const transitionDuration = duration !== undefined ? `${duration}ms` : ''
  for (const el of elements) {
    if (el !== dragEl) {
      const htmlEl = el as HTMLElement
      htmlEl.style.transitionDuration = transitionDuration
    }
  }
}

/**
 * Calculate new index by adding 1 for each item moved up and subtracting 1 for each item moved
 * down.
 * @param oldIndex
 * @param positions
 * @return The new index of the element being dragged.
 */
function getNewIndex(oldIndex: number, positions: ControlPosition[]) {
  return positions.reduce((index, position) => {
    if (position.y < 0) return index + 1
    if (position.y > 0) return index - 1
    return index
  }, oldIndex)
}

/**
 * @param el The element to calculate the bounds relative to.
 * @return The relative bounds that limit an element to being dragged within its offsetParent.
 */
function calcDragBounds(el: HTMLElement): DraggableBounds | 'parent' {
  const { offsetParent } = el
  if (offsetParent === null) {
    return 'parent'
  }

  const { offsetTop } = el
  const elBottom = offsetTop + el.offsetHeight
  const offsetBottom = offsetParent.scrollHeight - elBottom
  return {
    left: 0,
    right: 0,
    top: -offsetTop,
    bottom: offsetBottom,
  }
}
