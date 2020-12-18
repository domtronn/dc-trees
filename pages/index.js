/** @jsx jsx */
import Head from 'next/head'

import { useState, useEffect } from 'react'

import { generate } from '../utils/generate-grammar'
import { jsx } from '@emotion/core'
import { mix } from 'polished'

const col = (s, m, e) => (i, arr) => {
  const limit = 7
  return i < limit
    ? mix(i / (limit - 1), m, s)
    : mix((i - limit) / (arr.length - limit), e, m)
}

const cStart = '#432818'
const cMid = '#ebddd7'
const cEnd = '#ebddd7'

const treecol = col(cStart, cMid, cEnd)

const Home = ({ grammar, layers, start }) => {
  const [data, setData] = useState(
    generate(grammar, layers, start, [500, 500])
  )

  useEffect(() => {
    setTimeout(() => {
      ;[...document.querySelectorAll('.branch')]
        .forEach(p => (p.style.strokeDashoffset = 0))

      ;[...document.querySelectorAll('.flower')]
        .forEach(p => (p.style.opacity = 1))
    }, 10)
  }, [])

  return (
    <div
      css={{
        position: 'relative'
      }}
    >

      {/* <Controls */}
      {/*   grammar={grammar} */}
      {/*   onChange={newGrammar => { */}
      {/*     setData( */}
      {/*       generate(newGrammar, layers, start, [500, 500]) */}
      {/*     ) */}
      {/*   }} */}
      {/* /> */}

      <style>
        {`
        input { display: block; }
        body { margin: 0; }
        .tree { margin-bottom: -180px; z-index: 5; position: relative; }
        .tree path, .flower {
          transform-origin: 500px 500px;
          transform: rotate(${grammar.a.rotation}rad);
        }
        .flower { opacity: 0; }
      `}
      </style>
      <div
        style={{ position: 'relative' }}
      >
        <svg className='tree' viewBox='0 0 1000 500'>
          <defs>
            <filter id='gooey'>
              <feGaussianBlur in='SourceGraphic' result='blur' />
              <feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9' result='cm' />
            </filter>
          </defs>

          {
            data
              .map((layer, l, arr) => layer.map(({ start, end, length }, i) => (
                <path
                  class='branch'
                  key={`${l}--${i}`}
                  stroke={treecol(l, arr)}
                  strokeWidth={arr.length + 1 - l}
                  strokeDasharray={`${length} ${length}`}
                  strokeDashoffset={length}
                  d={`M${start[0]},${start[1]}L${end[0]},${end[1]}`}
                  style={{
                    transition: `stroke-dashoffset 0.3s linear ${l * 0.3}s`
                  }}
                />
              )))
          }

          {
            data
              .slice(-1)
              .map((layer, l) => layer.map(({ end }, i) => {
                const size = ((l + 1) * (i + 1) % 12) + 8
                return (
                  <image
                    key={`${l}-${i}`}
                    href='flower-1.svg'
                    height={size}
                    x={end[0] - (size / 2)}
                    y={end[1] - (size / 2)}
                    className='flower'
                    style={{
                      transition: `opacity 0.2s linear ${(data.length * 0.3) + (0.01 * i)}s`
                    }}
                  />
                )
              }))
          }

        </svg>
      </div>

      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
        <path
          fill='#5d6e1e'
          d='M0,64L40,74.7C80,85,160,107,240,112C320,117,400,107,480,122.7C560,139,640,181,720,181.3C800,181,880,139,960,133.3C1040,128,1120,160,1200,165.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'
        />
      </svg>

    </div>
  )
}

export async function getStaticProps () {
  const layers = 7
  const start = 'a'
  const grammar = {
    a: {
      next: ['b', 'c'],
      length: 50,
      rotation: 3 * Math.PI / 11
    },

    b: {
      next: ['b', 'd'],
      length: 32,
      rotation: Math.PI / 8
    },

    c: {
      next: ['a', 'b', 'c'],
      length: 80,
      rotation: -Math.PI / 12
    },

    d: {
      next: ['d','b'],
      length: 64,
      rotation: 0
    }
  }

  return { props: { grammar, layers, start } }
}

export default Home
