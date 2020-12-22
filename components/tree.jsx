/** @jsx jsx */
import { jsx } from '@emotion/core'
import { mix } from 'polished'
import palette from '../utils/palette'
import { rotate } from '../utils/rotate'

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
  children
}) {
  return (
    <svg
      id='tree'
      className={`tree ${debug ? 'debug' : ''} ${animate ? 'animate' : ''}`}
      viewBox='250 350 1500 750'
      style={{
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: 0
      }}
    >
      <g>
        {
          data
            .map((layer, l, arr) => (
              <g
                key={l}
                id={`branches-${l}`}
                data-layer={l}
              >
                {
                  layer.map(({ start, end, length, g }, i) => {
                    const [x0, y0] = rotate(start, [1000, 1000], rotation)
                    const [x1, y1] = rotate(end, [1000, 1000], rotation)

                    return (
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
                        d={`M${x0},${y0}L${x1},${y1}`}
                        style={{
                          transition: `stroke-dashoffset 0.3s linear ${l * 0.3}s`
                        }}
                      />
                    )
                  })
                }
              </g>
            ))
        }

        {children}
      </g>

    </svg>
  )
}
