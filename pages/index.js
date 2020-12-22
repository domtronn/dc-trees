/** @jsx jsx */
import Head from 'next/head'

/**
   TODO: highlight branches when modifyin grammars
   TODO: allow deletion of removal
   TODO: music & rythm.js
   TODO: cherry blossom blowing in the wind
 */

import { useState, useEffect } from 'react'
import { FiSettings } from 'react-icons/fi'
import { FaRegEye } from 'react-icons/fa'
import { GoBug } from 'react-icons/go'
import { IoIosSave } from 'react-icons/io'

import btoa from 'btoa'
import atob from 'atob'

import { generate } from '../utils/generate-grammar'
import { jsx, css } from '@emotion/core'

import palettes, { PaletteProvider } from '../utils/palette'
import { getContrast } from 'polished'

import { Controls, Definitions } from '../components/controls'

import { Card } from '../components/card'
import { Button } from '../components/button'
import { Range } from '../components/range'
import { Checkbox } from '../components/checkbox'
import { Tabs } from '../components/tabs'

import { MeasureRender } from '../components/measure'
import Tree from '../components/tree'
import Flowers from '../components/flowers'
import Bank from '../components/bank'

const pluck = (arr, o) => arr.reduce((acc, it) => ({ ...acc, [it]: o[it] }), {})

const growthFunctions = {
  linear: (layers, scale) => (len, layer) => (len - (layer * (len / (2 * layers)))) * scale,
  exponential: (layers, scale) => (len, layer) => (len * (1 / (layer + 1))) * scale,
  static: (layers, scale) => (len) => len * scale,
}

const animate = (data, { onStart, onEnd }) => {
  onStart()
  document
    .getElementById('tree')
    .style
    .opacity = 1

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
  flowerSize: _flowerSize = 20,
  trunkWidth: _trunkWidth = 12,
  growth: _growth = 'linear',
  scaleCoef: _scaleCoef = 1,
  start = 'a'
}) => {
  const [rotation, setRotation] = useState(_grammar[start].rotation)
  const [grammar, setGrammar] = useState(_grammar)
  const [layers, setLayers] = useState(_layers)
  const [flowerId, setFlowerId] = useState(_flowerId)
  const [flowerSize, setFlowerSize] = useState(_flowerSize)
  const [trunkWidth, setTrunkWidth] = useState(_trunkWidth)
  const [growth, setGrowth] = useState(_growth)

  const [scaleCoef, setScaleCoef] = useState(_scaleCoef)

  const [anim, setAnim] = useState(false)
  const [debug, setDebug] = useState(false)
  const [visible, setCardVisible] = useState(false)
  const [flowerVis, setFlowerVis] = useState(true)

  const [paletteId, setPaletteId] = useState(0)

  const data = generate(
    grammar,
    layers,
    start,
    [1000, 1000],
    growthFunctions[growth](layers, scaleCoef)
  )

  const animationHandlers = {
    onStart: _ => setAnim(true), onEnd: _ => setAnim(false)
  }

  const palette = palettes[paletteId]
  const settings = {
    grammar,
    growth,
    layers,
    flowerId,
    flowerSize,
    trunkWidth,
    scaleCoef
  }

  useEffect(() => animate(data, animationHandlers), [])

  return (
    <>
      <PaletteProvider value={palette}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * { transition: all 0.2s ease-in-out; }
            sup { margin-bottom: 8px; }
            :root {
             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              --primary: ${getContrast(palette.flower, palette.white) > 2 ? palette.flower : palette.black};
              --white: ${palette.white};
              --black: ${palette.black};
            }
            input { display: block; }
            body { margin: 0; }
            .tree { z-index: 5; position: relative; }
            .flower { opacity: 0; }
            .debug .flower { display: none; }`
          }}
        />

        {visible && (
          <Card>
            <Tabs
              size='lg'
            >
              <div label='Tree'>
                <Range
                  label='Recursion depth'
                  range={[0, 12, 1]}
                  value={layers}
                  onChange={e => setLayers(+e.target.value)}
                />

                <Range
                  label='Brach scale'
                  range={[1, 3, 0.1]}
                  value={scaleCoef}
                  onChange={e => setScaleCoef(+e.target.value)}
                />

                <Range
                  label='Branch width'
                  range={[5, 20, 1]}
                  value={trunkWidth}
                  onChange={e => setTrunkWidth(+e.target.value)}
                />

                <h3>Growth rate</h3>
                <div css={css`text-align: center; margin-top: -12px;`}>
                  <Checkbox
                    checked={growth === 'static'}
                    onChange={_ => setGrowth('static')}
                    name='growth-id'
                    type='radio'
                  >
                    𝟷
                  </Checkbox>
                  <Checkbox
                    checked={growth === 'linear'}
                    onChange={_ => setGrowth('linear')}
                    name='growth-id'
                    type='radio'
                  >
                    𝓍
                  </Checkbox>
                  <Checkbox
                    checked={growth === 'exponential'}
                    onChange={_ => setGrowth('exponential')}
                    name='growth-id'
                    type='radio'
                  >
                    𝓍<sup>𝟸</sup>
                  </Checkbox>
                </div>

                <hr />

                <h3>Flowers</h3>

                <Range
                  label='Minimum Flower size'
                  range={[0, 40, 1]}
                  value={flowerSize}
                  onChange={e => setFlowerSize(+e.target.value)}
                />

                <div css={css`text-align: center;`}>
                  {
                    [...Array(8)].map((_, id) => (
                      <>
                        {id === 4 && <br />}
                        <Checkbox
                          key={id}
                          checked={(id + 1) === flowerId}
                          onChange={_ => setFlowerId(id + 1)}
                          name='flower-id'
                          type='radio'
                        >
                          <svg height={26} css={css`padding: 3px`}>
                            <use
                              fill={(id + 1) === flowerId ? palette.white : (getContrast(palette.flower, palette.white) > 2 ? palette.flower : palette.black)}
                              href={`flower-${id + 1}.svg/#flower`}
                              width={26}
                              height={26}
                            />
                          </svg>
                        </Checkbox>
                      </>
                    ))
                  }
                </div>

                <Button block onClick={_ => setFlowerVis(!flowerVis)}>
                  {flowerVis ? 'Remove' : 'Add'} flowers
                </Button>

                <div css={css`text-align: center;`}>
                  {
                    palettes.map((p, id) => (
                      <>
                        <Checkbox
                          key={id}
                          checked={id === paletteId}
                          onChange={_ => setPaletteId(id)}
                          name='palette-id'
                          type='radio'
                        >
                          <div css={css`width: 20px; height: 20px; border-radius: 50%; background-color: ${p.flower}; border: 4px solid var(--white);`} />
                        </Checkbox>
                      </>
                    ))
                  }
                </div>
              </div>

              <div label='Grammar'>
                <Tabs>
                  <Definitions
                    label='Definition'
                    start={start}
                    grammar={grammar}
                    onChange={newGrammar => {
                      setRotation(newGrammar[start].rotation)
                      setGrammar(newGrammar)
                    }}
                  />
                  <Controls
                    label='Controls'
                    start={start}
                    grammar={grammar}
                    onChange={newGrammar => {
                      setRotation(newGrammar[start].rotation)
                      setGrammar(newGrammar)
                    }}
                  />

                </Tabs>

              </div>
            </Tabs>

          </Card>
        )}

        <div
          style={{ zIndex: 2000, position: 'relative', pointerEvents: 'none' }}
        >
          <Checkbox
            checked={visible}
            onChange={_ => setCardVisible(!visible)}
          >
            <FiSettings />
          </Checkbox>

          <Checkbox
            checked={debug}
            onChange={_ => setDebug(!debug)}
          >
            <GoBug />
          </Checkbox>

          <br />
          <Checkbox
            checked={false}
            onChange={_ => animate(data, animationHandlers)}
          >
            <FaRegEye />
          </Checkbox>

          <br />
          <Checkbox
            checked={false}
            onChange={_ => {
              navigator
                .clipboard
                .writeText(`${window.location.origin}?settings=${btoa(JSON.stringify(settings))}`)
            }}
          >
            <IoIosSave />
          </Checkbox>

        </div>

        <div css={{ position: 'relative' }}>
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
            <MeasureRender name='tree'>
              <Tree
                data={data}
                debug={debug}
                animate={anim}
                rotation={grammar[start].rotation}
                width={trunkWidth}
              >
                {flowerVis && (
                  <Flowers
                    data={data}
                    id={flowerId}
                    size={[Math.max(0, flowerSize - flowerSize / 3), flowerSize]}
                    animate={anim}
                    rotation={grammar[start].rotation}
                  />
                )}
              </Tree>
              <Bank />
            </MeasureRender>
          </div>

        </div>
      </PaletteProvider>
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
      return {
        props: pluck(
          [ 'grammar', 'growth', 'layers', 'flowerSize', 'scaleCoef', 'flowerId', 'trunkWidth' ],
          JSON.parse(atob(query.settings))
        )
      }
    } catch (e) {
      return handleDefault()
    }
  } else {
    return handleDefault()
  }
}

export default Home
