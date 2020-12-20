/** @jsx jsx */
import Head from 'next/head'

/**
   TODO: highlight branches when modifyin grammars
   TODO: allow deletion of removal
   TODO: music & rythm.js
   TODO: cherry blossom blowing in the wind
 */

import { useState, useEffect } from 'react'
import btoa from 'btoa'
import atob from 'atob'

import { generate } from '../utils/generate-grammar'
import { jsx, css } from '@emotion/core'
import { mix, lighten } from 'polished'

import palette from '../utils/palette'

import Controls from '../components/controls'

import { Card } from '../components/card'
import { Button } from '../components/button'
import { Range } from '../components/range'
import { Checkbox } from '../components/checkbox'

const col = (s, m, e, limit = 7) => (i, arr) => {
  return i < limit
    ? mix(i / (limit - 1), m, s)
    : mix((i - limit) / (arr.length - limit), e, m)
}

const treecol = col(
  palette.wood,
  palette.branch,
  palette.white,
  7
)

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
      })
  }, 1)

  const branchAnimationDuration = data.length * 0.3
  const flowerAnimationDuration = (data[data.length - 1].length * 0.01) + 0.2
  setTimeout(onEnd , (branchAnimationDuration + flowerAnimationDuration) * 1000)
}

const Home = ({
  grammar: _grammar,
  layers: _layers = 9,
  flowerId: _flowerId = 1,
  flowerMin: _flowerMin = 20,
  flowerMax: _flowerMax = 28,
  trunkWidth: _trunkWidth = 12,
  start = 'a'
}) => {
  const [rotation, setRotation] = useState(_grammar[start].rotation)
  const [grammar, setGrammar] = useState(_grammar)
  const [layers, setLayers] = useState(_layers)
  const [flowerId, setFlowerId] = useState(_flowerId)
  const [flowerMin, setFlowerMin] = useState(_flowerMin)
  const [flowerMax, setFlowerMax] = useState(_flowerMax)
  const [trunkWidth, setTrunkWidth] = useState(_trunkWidth)

  const [anim, setAnim] = useState(false)
  const [debug, setDebug] = useState(false)
  const [visible, setCardVisible] = useState(false)

  const data = generate(grammar, layers, start, [1000, 1000], (length, layer) => length - (layer * 5))
  const animationHandlers = {
    onStart: _ => setAnim(true), onEnd: _ => setAnim(false)
  }

  const settings = {
    grammar,
    layers,
    flowerId,
    flowerMin,
    flowerMax,
    trunkWidth
  }

  useEffect(() => animate(data, animationHandlers), [])

  return (
    <>
      <Card>
        <Controls
          start={start}
          grammar={grammar}
          onChange={newGrammar => {
            setRotation(newGrammar[start].rotation)
            setGrammar(newGrammar)
          }}
        />
        <Button
          block
          onClick={_ => animate(data, animationHandlers)}
        >
          Animate
        </Button>
        <Button
          block
          onClick={_ => setDebug(!debug)}
        >
          Toggle debug
        </Button>

        <Range
          label='Depth'
          type='range'
          min={1}
          max={10}
          step={1}
          value={layers}
          onChange={e => setLayers(+e.target.value)}
        />

        <Range
          label='TrunkWidth'
          type='range'
          min={5}
          max={20}
          step={1}
          value={trunkWidth}
          onChange={e => setTrunkWidth(+e.target.value)}
        />

        <Range
          type='range'
          label='Minimum flower size'
          min={5}
          max={flowerMax}
          step={1}
          value={flowerMin}
          onChange={e => setFlowerMin(+e.target.value)}
        />

        <Range
          label='Maximum flower size'
          type='range'
          min={flowerMin + 1}
          max={flowerMin + 20}
          step={1}
          value={flowerMax}
          onChange={e => setFlowerMax(+e.target.value)}
        />

        <div
          css={css`text-align: center;`}
        >
          {
            [1,2,3,4].map(id => (
              <Checkbox
                checked={id === flowerId}
                onChange={_ => setFlowerId(id)}
                name='flower-id'
                type='radio'
              >
                <svg height={26} css={css`padding: 3px`}>
                  <use
                    fill={id === flowerId ? palette.white : palette.flower}
                    href={`flower-${id}.svg/#flower`}
                    width={26}
                    height={26}
                  />
                </svg>
              </Checkbox>
            ))
          }
          <br />
          {
            [1,2,3,4].map(id => (
              <Checkbox
                checked={id + 4 === flowerId}
                onChange={_ => setFlowerId(id + 4)}
                name='flower-id'
                type='radio'
              >
                <svg height={26} css={css`padding: 3px`}>
                  <use
                    fill={id + 4 === flowerId ? palette.white : palette.flower}
                    href={`flower-${id + 4}.svg/#flower`}
                    width={26}
                    height={26}
                  />
                </svg>
              </Checkbox>
            ))
          }
        </div>

        <Button
          block
          onClick={_ => {
            navigator
              .clipboard
              .writeText(`http://localhost:3000/?settings=${btoa(JSON.stringify(settings))}`)
              .then(function() {
                /* clipboard successfully set */
              }, function() {
                /* clipboard write failed */
              });
          }}
        >
          Copy url
        </Button>

      </Card>
      <div css={{ position: 'relative' }}>
        <style>
          {`

        :root {
         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          --primary: ${palette.flower};
          --white: ${palette.white};
          --black: ${palette.black};
        }
        input { display: block; }
        body { margin: 0; }
        .tree { z-index: 5; position: relative; }
        .flower { opacity: 0; }
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
            className={`tree ${debug ? 'debug' : ''} ${anim ? 'animate' : ''}`} viewBox='0 0 2000 2000'
            style={{
              border: '2px solid black',
              transform: `rotate(${rotation}rad)`,
              marginLeft: `-50vw`,
              width: `200vw`,
              /* marginTop: -((2000 - (outerBox[1][1] - outerBox[1][0])) / 2) */
              marginTop: `-85vh`
            }}
          >
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

                          strokeWidth={Math.max(trunkWidth - l, 1)}
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
                    const size = ((l + 1) * (i + 1) % (flowerMax - flowerMin)) + flowerMin
                    return (
                      <use
                        key={`${data.length}--${l}-${i}`}
                        href={`flower-${flowerId}.svg#flower`}
                        className='flower'
                        fill={
                          lighten(
                            0.01 * (i % 4),
                            mix(1 / (5 - (i % 5)), palette.flower, palette.flower2)
                          )
                        }
                        height={size}
                        width={size}
                        x={end[0] - (size / 2)}
                        y={end[1] - (size / 2)}

                        data-delay={(data.length * 0.3) + (0.01 * i)}
                        data-rotation={i / Math.PI}
                        style={{
                          opacity: anim ? 0 : 1,
                          transform: `rotate(${((i / Math.PI) % (Math.PI / 4)) - (Math.PI / 8) - grammar[start].rotation}rad)`,
                          transformOrigin: `${end[0]}px ${end[1]}px`,
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
            fill={palette.grass}
            d='M0,64L40,74.7C80,85,160,107,240,112C320,117,400,107,480,122.7C560,139,640,181,720,181.3C800,181,880,139,960,133.3C1040,128,1120,160,1200,165.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'
          />
        </svg>

      </div>
    </>
  )
}

export async function getServerSideProps ({ query }) {
  const handleDefault = () => {
    const layers = 7
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
    return { props: { grammar, layers } }
  }

  if (query.settings) {
    try {
      const { grammar, layers, flowerMin, flowerMax, flowerId, trunkWidth } =
            JSON.parse(atob(query.settings))
      return { props: { grammar, layers, flowerMin, flowerMax, flowerId, trunkWidth } }
    } catch (e) {
      return handleDefault()
    }
  } else {
    return handleDefault()
  }
}

export default Home
