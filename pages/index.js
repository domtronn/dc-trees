/** @jsx jsx */
import Head from 'next/head'

import { generate } from '../utils/generate-grammar'
import { jsx } from '@emotion/core'
import { mix } from 'polished'

import { IoFlower } from 'react-icons/io5'

const grammar = {
  a: {
    next: 'bc',
    length: 50,
    rotation: 3 * Math.PI / 11
  },

  b: {
    next: 'bd',
    length: 32,
    rotation: Math.PI / 8
  },

  c: {
    next: 'abc',
    length: 80,
    rotation: -Math.PI / 12
  },

  d: {
    next: 'dc',
    length: 64,
    rotation: 0
  }
}

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

const Home = ({ data }) => (
  <div
    css={{
      position: 'relative'
    }}
  >
    <style>
      {`
        body { margin: 0; }
        .tree { margin-bottom: -180px; z-index: 5; position: relative; }
        .tree path, .flower {
          transform-origin: 500px 500px;
          transform: rotate(${grammar.a.rotation}rad);
        }
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
            .map((layer, l, arr) => layer.map(({ start, end }, i) => (
              <path
                key={`${l}--${i}`}
                stroke={treecol(l, arr)}
                strokeWidth={arr.length + 1 - l}
                d={`M${start[0]},${start[1]}L${end[0]},${end[1]}`}
              />
            )))
        }
        
        {
          data
            .slice(-1)
            .map((layer, l) => layer.map(({ end }, i) => (
              <image
                href={`flower-1.svg`}
                height={(Math.random() * 4) + 13}
                x={end[0] - 8}
                y={end[1] - 8}
                className='flower'
              />
            )))
        }
        
      </svg>
    </div>
    
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
      <path
        fill="#5d6e1e"
        d='M0,64L40,74.7C80,85,160,107,240,112C320,117,400,107,480,122.7C560,139,640,181,720,181.3C800,181,880,139,960,133.3C1040,128,1120,160,1200,165.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'
      >
      </path>
    </svg>
    

  </div>
)

export async function getStaticProps () {
  const layers = 7
  const start = 'a'

  const data = generate(grammar, layers, start, [500, 500])
  return { props: { data } }
}

export default Home
