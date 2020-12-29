/** @jsx jsx */
import { jsx } from '@emotion/core'
import tc, { mix } from 'tinycolor2'

import { usePalette } from '../utils/palette'
import { rotate } from '../utils/rotate'

export default function Flowers ({
  data = [],
  id = 1,
  animate = false,
  rotation = 0,
  size: [min, max] = [10, 11]
}) {
  const palette = usePalette()

  return (
    <g id='flowers'>
      {
        data
          .slice(-1)
          .map((layer, l) => layer.map(({ end }, i) => {
            const size = ((l + 1) * (i + 1) % (max - min)) + min
            const [x, y] = rotate(
              [end[0], end[1]],
              [1000, 1000],
              rotation
            )

            return (
              <use
                key={`${data.length}--${l}-${i}`}
                href={`flower-${id}.svg#flower`}
                className='flower'
                fill={
                  tc(mix(palette.flower, palette.flower2, 1 / (5 - (i % 5)) * 20))
                    .lighten(3 * (i % 4))
                }
                height={size}
                width={size}
                x={x - (size / 2)}
                y={y - (size / 2)}

                data-delay={(data.length * 0.3) + (0.1 * (i % 20))}
                data-rotation={i / Math.PI}
                style={{
                  opacity: animate ? 0 : 1,
                  transform: `rotate(${((i / Math.PI) % (Math.PI / 4)) - (Math.PI / 8)}rad)`,
                  transformOrigin: `${x}px ${y}px`,
                  transition: `opacity 0.2s ease-in-out ${(data.length * 0.3) + (0.1 * (i % 20))}s, fill 0.2s ease-in-out 0s`
                }}
              />
            )
          }))
      }
    </g>
  )
}
