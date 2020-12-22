const { min, max, cos, sin } = Math
const toRect = ([[x0, x1], [y0, y1]]) => ({
  x0, x1, x: x1 - x0,
  y0, y1, y: y1 - y0,
  cx: x0 + ((x1 - x0) / 2),
  cy: y0 + ((y1 - y0) / 2)
})


export const boundingRect = (data, theta, [x0, y0]) => {
  return toRect(
    data
      .reduce((acc, it) => acc.concat(it), [])
      .reduce(([x, y], { start, end }) => {
        const [sx, sy] = start
        const [ex, ey] = end

        const _sx = cos(theta) + (sx - x0) - sin(theta) * (sy - y0) + x0
        const _sy = sin(theta) + (sx - x0) + cos(theta) * (sy - y0) + y0
        const _ex = cos(theta) + (ex - x0) - sin(theta) * (ey - y0) + x0
        const _ey = sin(theta) + (ex - x0) + cos(theta) * (ey - y0) + y0

        return [[
          min(min(_sx, _ex), x[0]),
          max(max(_sx, _ex), x[1])
        ],
                [
                  min(min(_sy, _ey), y[0]),
                  max(min(_sy, _ey), y[1])
                ]]
      }, [[Infinity, -Infinity], [Infinity, -Infinity]])
  )
}
