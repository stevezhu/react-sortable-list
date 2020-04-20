import { css } from 'emotion'
import React, { useState } from 'react'
import { SortableList } from '.'

export default {
  title: 'SortableList',
  components: SortableList,
}

const heights = Array<number>(10)
  .fill(0)
  .map(() => Math.random() * 400 + 30)

export const withDefault = () => {
  const [list, setList] = useState<{ id: number }[]>([
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ])
  return (
    <SortableList list={list} setList={setList} swapThreshold={0.5}>
      {({ item, index }) => {
        return (
          <div
            className={css`
              background-color: red;
              border: 5px solid blue;
              margin-bottom: 10px;
            `}
            style={{ height: heights[item.id] }}
          >
            {item.id}
          </div>
        )
      }}
    </SortableList>
  )
}
