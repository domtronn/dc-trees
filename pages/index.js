/** @jsx jsx */
import Head from 'next/head'

import { useState, useEffect } from 'react'

import { generate } from '../utils/generate-grammar'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { mix } from 'polished'

import Controls from '../components/controls'

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

const Button = styled.button`
  border: none;
  outline: none;
  padding: 16px 32px;
  border-radius: 8px;
`

const animate = (data, { onStart, onEnd }) => {
  onStart()

  ;[...document.querySelectorAll('.branch')]
    .forEach(p => {
      p.style.transitionDuration = '0s'
      p.style.transitionDelay = '0s'
      p.style.strokeDashoffset = p.getAttribute('data-length')
    })

  ;[...document.querySelectorAll('.flower')]
    .forEach(p => {
      p.style.transitionDuration = '0s'
      p.style.transitionDelay = '0s'
      p.style.opacity = 0
      p.style.transform = 'scale(0)'
    })

  setTimeout(_ => {
    [...document.querySelectorAll('.branch')]
      .forEach(p => {
        p.style.transitionDuration = '0.3s'
        p.style.transitionDelay = `${p.getAttribute('data-delay')}s`
        p.style.strokeDashoffset = 0
      })
    ;[...document.querySelectorAll('.flower')]
      .forEach(p => {
        p.style.transitionDuration = '0.2s'
        p.style.transitionDelay = `${p.getAttribute('data-delay')}s`
        p.style.opacity = 1
        p.style.transform = 'scale(1)'
      })
  }, 1)

  const branchAnimationDuration = data.length * 0.3
  const flowerAnimationDuration = (data[data.length - 1].length * 0.01) + 0.2
  setTimeout(_ => {
    console.log(`calling on end after ${(branchAnimationDuration + flowerAnimationDuration) * 1000}ms`)
    onEnd()
  }, (branchAnimationDuration + flowerAnimationDuration) * 1000)
}

const Home = ({
  grammar: _grammar,
  layers: _layers,
  start
}) => {
  const [debug, setDebug] = useState(false)
  const [rotation, setRotation] = useState(_grammar[start].rotation)
  const [grammar, setGrammar] = useState(_grammar)
  const [layers, setLayers] = useState(_layers)
  const [anim, setAnim] = useState(false)

  const data = generate(grammar, layers, start, [1000, 1000], (length, layer) => length - (layer * 5))
  const animationHandlers = {
    onStart: _ => setAnim(true), onEnd: _ => setAnim(false)
  }

  useEffect(() => animate(data, animationHandlers), [])

  return (
    <div css={{ position: 'relative' }}>
      <Controls
        grammar={grammar}
        onChange={newGrammar => {
          setRotation(newGrammar[start].rotation)
          setGrammar(newGrammar)
        }}
      />

      <Button onClick={_ => animate(data, animationHandlers)}>
        Animate
      </Button>
      <Button
        onClick={_ => setDebug(!debug)}
      >
        Toggle debug
      </Button>
      <input
        type='range'
        min={1}
        max={10}
        step={1}
        onChange={e => setLayers(+e.target.value)}
      />

      <style>
        {`
        input { display: block; }
        body { margin: 0; }
        .tree { z-index: 5; position: relative; }
        .tree path, .flower {
        }
        .flower { opacity: 0; transform: scale(0); }

        .debug .flower { display: none; }
      `}
      </style>
      <div
        css={css`
        .debug path[data-g='a'] { stroke: #ff595e !important; }
        .debug path[data-g='b'] { stroke: #ffca3a !important; }
        .debug path[data-g='c'] { stroke: #8ac926 !important; }
        .debug path[data-g='d'] { stroke: #1982c4 !important; }
        .debug path[data-g='e'] { stroke: #6a4c93 !important; }
        `}
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '100vw'
        }}
      >
        <svg
          style={{
            border: '2px solid black',
            transform: `rotate(${rotation}rad)`,
            marginLeft: `-50vw`,
            width: `200vw`,
            /* marginTop: -((2000 - (outerBox[1][1] - outerBox[1][0])) / 2) */
            marginTop: `-85vh`
          }}
          className={`tree ${debug ? 'debug' : ''} ${anim ? 'animate' : ''}`} viewBox='0 0 2000 2000'>
          {
            data
              .map((layer, l, arr) => (
                <g
                  key={l}
                  id={`branches-${l}`}
                  data-layer={l}
                >
                  {
                    layer.map(({ start, end, length, g }, i) => (
                      <path
                        className='branch'
                        key={`${l}--${i}`}
                        stroke={treecol(l, arr)}

                        data-g={g}
                        data-length={length}
                        data-delay={l * 0.3}

                        strokeWidth={arr.length + 1 - l}
                        strokeDasharray={`${length} ${length}`}
                        strokeDashoffset={anim ? length : 0}
                        d={`M${start[0]},${start[1]}L${end[0]},${end[1]}`}
                        style={{
                          transition: `stroke-dashoffset 0.3s linear ${l * 0.3}s`
                        }}
                      />
                    ))
                  }
                </g>
              ))
          }

          <g id='flowers'>
            {
              data
                .slice(-1)
                .map((layer, l) => layer.map(({ end }, i) => {
                  const size = ((l + 1) * (i + 1) % 12) + 8
                  return (
                    <image
                      key={`${data.length}--${l}-${i}`}
                      href='flower-1.svg'
                      height={size}
                      x={end[0] - (size / 2)}
                      y={end[1] - (size / 2)}
                      className='flower'

                      data-delay={(data.length * 0.3) + (0.01 * i)}
                      style={{
                        opacity: anim ? 0 : 1,
                        transform: anim ? 'scale(0)' : 'scale(1)',
                        transformOrigin: `${end[0] - (size / 2)}px ${end[1] - (size / 2)}px`,
                        transition: `opacity 0.2s linear ${(data.length * 0.3) + (0.01 * i)}s`
                      }}
                    />
                  )
                }))
            }
          </g>

        </svg>
      </div>

      <svg
        style={{
          position: 'fixed',
          bottom: -10
        }}
        xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
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
