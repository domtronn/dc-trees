/** @jsx jsx */
import { jsx } from '@emotion/core'
import { mix, lighten } from 'polished'

import palette from '../utils/palette'

export default function Flowers ({
  data = [],
  id = 1,
  animate = false,
  rotation = 0,
  size: [min, max] = [10, 11]
}) {
  return (
    <g id='flowers'>
      {
        data
          .slice(-1)
          .map((layer, l) => layer.map(({ end }, i) => {
            const size = ((l + 1) * (i + 1) % (max - min)) + min
            return (
              <use
                key={`${data.length}--${l}-${i}`}
                href={`flower-${id}.svg#flower`}
                className='flower'
                fill={
                  lighten(
                    0.01 * (i % 4),
                    mix(1 / (5 - (i % 5)), palette.flower, palette.flower2)
                  )
                }
                height={size}
                width={size}
                x={end[0] - (size / 2)}
                y={end[1] - (size / 2)}

                data-delay={(data.length * 0.3) + (0.01 * i)}
                data-rotation={i / Math.PI}
                style={{
                  opacity: animate ? 0 : 1,
                  transform: `rotate(${((i / Math.PI) % (Math.PI / 4)) - (Math.PI / 8) - rotation}rad)`,
                  transformOrigin: `${end[0]}px ${end[1]}px`,
                  transition: `opacity 0.2s linear ${(data.length * 0.3) + (0.01 * i)}s`
                }}
              />
            )
          }))
      }
    </g>
  )
}