const { cos, sin } = Math
export const rotate = ([x, y], [cx, cy], theta) => [
  cos(theta) * (x - cx) - sin(theta) * (y - cy) + cx,
  sin(theta) * (x - cx) + cos(theta) * (y - cy) + cy
]
