import { rotate } from './rotate'

const { min, max } = Math
const toRect = ([[x0, x1], [y0, y1]]) => ({
  x0, x1, x: x1 - x0,
  y0, y1, y: y1 - y0,
  cx: x0 + ((x1 - x0) / 2),
  cy: y0 + ((y1 - y0) / 2)
})


export const boundingRect = (data, theta, [x0, y0]) => {
  return [
    toRect(
      data
        .reduce((acc, it) => acc.concat(it), [])
        .reduce(([x, y], { start, end }) => [
          [
            min(min(start[0], end[0]), x[0]),
            max(max(start[0], end[0]), x[1])
          ],
          [
            min(min(start[1], end[1]), y[0]),
            max(max(start[1], end[1]), y[1])
          ]
        ], [[Infinity, -Infinity], [Infinity, -Infinity]])
    ),
    toRect(
      data
        .reduce((acc, it) => acc.concat(it), [])
        .reduce(([x, y], { start, end }) => {
          const [sx, sy] = start
          const [ex, ey] = end

          const [_sx, _sy] = rotate(
            [sx, sy],
            [x0, y0],
            theta
          )

          const [_ex, _ey] = rotate(
            [ex, ey],
            [x0, y0],
            theta
          )

          return [
            [
              min(min(_sx, _ex), x[0]),
              max(max(_sx, _ex), x[1])
            ],
            [
              min(min(_sy, _ey), y[0]),
              max(max(_sy, _ey), y[1])
            ]
          ]
        }, [[Infinity, -Infinity], [Infinity, -Infinity]])
    )
  ]
}
