/** @jsx jsx */
import { jsx } from '@emotion/core'
import { mix } from 'polished'
import palette from '../utils/palette'

const DEBUG_SVG = false

const col = (s, m, e, limit = 7) => (i, arr) => {
  return i < limit
    ? mix(i / (limit - 1), m, s)
    : mix((i - limit) / (arr.length - limit), e, m)
}
const treecol = col(palette.wood, palette.branch, palette.white, 5)

export default function Tree ({
  data = [],
  debug = false,
  animate = false,
  rotation = 0,
  width = 20,
  size: [sx, sy] = [0, 0],
  children
}) {
  return (
    <svg
      id='tree'
      className={`tree ${debug ? 'debug' : ''} ${animate ? 'animate' : ''}`}
      viewBox={`${1000 - (sx / 2)} ${1000 - (sy / 2)} ${sx} ${sy}`}
      style={{
        height: 'calc(100vh - 80px)',
        padding: 40,
        display: 'flex',
        margin: '0 auto',
        opacity: 0
      }}
    >

      {DEBUG_SVG && (
        <>
          <path
            d='M0,1000L2000,1000'
            stroke='red'
            strokeWidth={2}
          />
          <path
            d='M1000,0L1000,2000'
            stroke='red'
            strokeWidth={2}
          />

          <rect
            x={1000 - (sx / 2)}
            y={1000 - (sy / 2)}
            width={sx}
            height={sy}
            stroke='green'
            fill='none'
            strokWidth={2}
          />
        </>
      )}

      <g
        style={{
          transformOrigin: `1000px 1000px`,
          transform: `translate(${0}px, ${(sy / 2)}px) rotate(${rotation}rad)`
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
      </g>
    </svg>
  )
}
