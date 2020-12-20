export const boundingRect = (data, theta, [x0, y0]) => {
  const [ innerX, innerY ] = data
        .reduce((acc, it) => acc.concat(it), [])
        .reduce(([x, y], { start, end }) => [
          [
            Math.min(Math.min(start[0], end[0]), x[0]),
            Math.max(Math.max(start[0], end[0]), x[1])
          ],
          [
            Math.min(Math.min(start[1], end[1]), y[0]),
            Math.max(Math.max(start[1], end[1]), y[1])
          ]
        ], [[Infinity, -Infinity], [Infinity, -Infinity]])

  const innerPoints = [
    [innerX[0], innerY[0]],
    [innerX[1], innerY[1]],
    [innerX[0], innerY[1]],
    [innerX[1], innerY[0]],
  ]

  const outerRect = innerPoints
        .map(([x, y]) => [
          x0 + (x - x0) * Math.cos(theta) + (y - y0) * Math.sin(theta),
          y0 + (x - x0) * Math.sin(theta) + (y - y0) * Math.cos(theta)
        ])
        .reduce(([x, y], [x_, y_]) => [
          [
            Math.min(x_, x[0]),
            Math.max(x_, x[1])
          ],
          [
            Math.min(y_, y[0]),
            Math.max(y_, y[1])
          ]
        ], [[Infinity, -Infinity], [Infinity, -Infinity]])

  return [
    [innerX, innerY],
    outerRect
  ]

}
