const grammars = (s = []) => [...new Set(s)]
const accumulate = (grammar, arr, offset = 0, start = [0, 0], layer, magF) => []
  .concat(arr)
  .map(g => {
    const [x, y] = start
    const { rotation, length } = grammar[g]
    return {
      g,
      length: magF(length, layer),
      rotation: offset + rotation,
      start: [x, y],
      end: [
        x - (magF(length, layer) * Math.sin(offset + rotation)),
        y - (magF(length, layer) * Math.cos(offset + rotation)) // Needs to be minus to go up
      ]
    }
  })

export const generate = (grammar = {}, levels = 1, start = 'a', startPos = [500, 500], magF = _ => _) => {
  return Array(levels)
    .fill()
    .reduce((acc, it, i, arr) => [
      ...acc,
      acc[i].reduce((inner, { g, rotation, end }) => inner.concat(
        accumulate(grammar, grammars(grammar[g].next), rotation, end, i, magF)
      ), [])
    ], [accumulate(grammar, start, 0, startPos, 0, magF)])
}
