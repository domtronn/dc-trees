/** @jsx jsx */
import { jsx } from '@emotion/core'
import { mix } from 'polished'
import palette from '../utils/palette'

const col = (s, m, e, limit = 7) => (i, arr) => {
  return i < limit
    ? mix(i / (limit - 1), m, s)
    : mix((i - limit) / (arr.length - limit), e, m)
}
const treecol = col(palette.wood, palette.branch, palette.white, 7)

export default function Tree ({
  data = [],
  debug = false,
  animate = false,
  rotation = 0,
  width = 20,
  children
}) {
  return (
    <svg
      id='tree'
      className={`tree ${debug ? 'debug' : ''} ${animate ? 'animate' : ''}`} viewBox='0 0 2000 2000'
      style={{
        opacity: 0,
        border: '2px solid black',
        transform: `rotate(${rotation}rad)`,
        marginLeft: '-50vw',
        width: '200vw',
        /* marginTop: -((2000 - (outerBox[1][1] - outerBox[1][0])) / 2) */
        marginTop: '-85vh'
      }}
    >
      {
        data
          .map((layer, l, arr) => (
            <g
              key={l}
              id={`branches-${l}`}
              data-layer={l}
            >
              {
                layer.map(({ start, end, length, g }, i) => (
                  <path
                    className='branch'
                    key={`${l}--${i}`}
                    stroke={treecol(l, arr)}

                    data-g={g}
                    data-length={length}
                    data-delay={l * 0.3}

                    strokeWidth={Math.max(width - l, 1)}
                    strokeDasharray={`${length} ${length}`}
                    strokeDashoffset={animate ? length : 0}
                    d={`M${start[0]},${start[1]}L${end[0]},${end[1]}`}
                    style={{
                      transition: `stroke-dashoffset 0.3s linear ${l * 0.3}s`
                    }}
                  />
                ))
              }
            </g>
          ))
      }

      {children}
    </svg>
  )
}
