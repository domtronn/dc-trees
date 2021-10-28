import { useEffect, useState } from 'react'

const random = arr => arr[~~(arr.length * Math.random())]

let tDelta = 0
let tN = 0

const wind = {
  direction: 1,
  magnitude: 1.2,
  maxSpeed: 12,
  t: 0,
  tMax: 300,
  speed: 0
}

export const Wind = ({
  points,
  rotation,
  numLeaves = 20
}) => {
  const [[width, height], setSize] = useState([])

  const [leaves, setLeaves] = useState([])
  const [enabled, setEnabled] = useState(true)

  const windSpeed = (t, y) => {
    const a = wind.magnitude / 2 * (height - 2 * y / 3) / width
    return a * Math.sin(2 * Math.PI / wind.tMax * t + (3 * Math.PI / 2)) + a
  }

  const resetLeaf = (l, points) => {
    const [x, y] = random(points)
    l.x = x
    l.y = y
    l.t = 0

    l.vx = (Math.random() * 0.8) - 0.4
    l.vy = (Math.random()) + 0.5

    return l
  }

  const updateLeaf = (l, points) => {
    const speed = windSpeed(l.t, l.y)

    l.x += (speed + l.vx) * wind.direction
    l.y += l.vy
    l.t += tDelta

    l.el.setAttribute('cx', l.x)
    l.el.setAttribute('cy', l.y)

    if (l.x < -10 || l.y > height + 10) resetLeaf(l, points)
  }

  const updateWind = _ => {
    wind.t += tDelta

    if (wind.t < wind.tMax) return

    wind.magnitude = Math.random() * wind.maxSpeed
    wind.tMax = wind.magnitude * 40 + (Math.random() * 20 - 10)
    wind.t = 0

    return wind
  }

  const destroy = leaves => {
    const container = document.getElementById('falling-leaves')
    leaves.forEach(l => container.removeChild(l.el))
    setLeaves([])
  }

  const initLeaves = (points) => {
    const leaves = [...Array(numLeaves)]
      .map(l => ({
        el: document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
        ...resetLeaf({}, points)
      }))

    leaves.forEach(l => {
      document
        .getElementById('falling-leaves')
        .appendChild(l.el)

      l.el.setAttribute('fill', 'red')
      l.el.setAttribute('r', '6')
    })

    return leaves
  }

  useEffect(() => {
    if (!enabled) return destroy(leaves)

    setLeaves(initLeaves(points))
    return _ => destroy(leaves)
  }, [enabled, numLeaves, points])

  useEffect(() => {
    if (!enabled) return destroy(leaves)

    setSize([
      window.screen.width,
      window.screen.height,
    ])

    if (!width || !height) return

    const animate = (t) => {
      tDelta = (t - tN) / 10
      tN = t
      updateWind()
      leaves.forEach(l => updateLeaf(l, points))
      window.requestAnimationFrame(animate)
    }

    const frameId = window.requestAnimationFrame(animate)
    return _ => window.cancelAnimationFrame(frameId)
  }, [enabled, leaves, width, height])

  return null // Make sure you inluded a <g id='falling leaves' /> somewhere on your page
}

export default Wind
