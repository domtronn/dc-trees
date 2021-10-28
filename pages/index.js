/** @jsx jsx */
import Head from 'next/head'
import { jsx, css } from '@emotion/core'

/**
   TODO: highlight branches when modifyin grammars
   TODO: allow deletion of removal
   TODO: music & rythm.js
   TODO: cherry blossom blowing in the wind
 */

import { useState, useEffect } from 'react'
import Haikunator from 'haikunator'

import { FiSettings, FiDownload } from 'react-icons/fi'
import { FaRegEye } from 'react-icons/fa'
import { GoBug } from 'react-icons/go'
import { IoIosSave } from 'react-icons/io'

import palettes, { PaletteProvider } from '../utils/palette'
import { readability } from 'tinycolor2'

import { Controls, Definitions } from '../components/controls'
import toast, { Toaster } from 'react-hot-toast'

/** Control components */
import { Card } from '../components/card'
import { Button } from '../components/button'
import { Range } from '../components/range'
import { Checkbox } from '../components/checkbox'
import { Tabs } from '../components/tabs'

/** Render components */
import { MeasureRender } from '../components/measure'
import Tree from '../components/tree'
import Flowers from '../components/flowers'
import Bank from '../components/bank'
import Wind from '../components/wind'

/** Utils */
import btoa from 'btoa'
import atob from 'atob'
import { rotate } from '../utils/rotate'
import { cleanSVG } from '../utils/clean-svg'
import { generate } from '../utils/generate-grammar'
import { download } from '../utils/download'
import { animate, unanimate } from '../utils/animation'

const pluck = (arr, o) => arr.reduce((acc, it) => ({ ...acc, [it]: o[it] }), {})

const growthFunctions = {
  linear: (layers, scale) => (len, layer) => (len - (layer * (len / (2 * layers)))) * scale,
  exponential: (layers, scale) => (len, layer) => (len * (1 / (layer + 1))) * scale,
  static: (layers, scale) => (len) => len * scale
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
  const [wind, setWind] = useState(false)
  const [debug, setDebug] = useState(false)
  const [visible, setCardVisible] = useState(false)
  const [flowerVis, setFlowerVis] = useState(true)

  const [paletteId, setPaletteId] = useState(0)
  const [svg, setSvg] = useState('')

  const data = generate(
    grammar,
    layers,
    start,
    [1000, 1000],
    growthFunctions[growth](layers, scaleCoef)
  )

  const [availableLeafPoints] = data
    .slice(-1)
    .map((layer, l) => layer.map(({ end }, i) => {
      return rotate(
        [end[0], end[1]],
        [1000, 1000],
        rotation
      )
    }))

  const animationHandlers = {
    onStart: _ => setAnim(true),
    onEnd: _ => {
      setAnim(false)
      unanimate()
    }
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

  const settingsHash = btoa(JSON.stringify(settings))
  const h = new Haikunator({ seed: settingsHash, defaults: { tokenLength: 0 } })
  const haiku = h.haikunate()

  useEffect(() => animate(data, animationHandlers), [])
  useEffect(() => {
    setSvg(cleanSVG(document.getElementById('tree').outerHTML))
  })

  return (
    <>
      <PaletteProvider value={palette}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * { transition: all 0.2s ease-in-out; }
            #falling-leaves circle { transition: none; }
            sup { margin-bottom: 8px; }
            :root {
             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              --primary: ${readability(palette.flower, palette.white) > 2 ? palette.flower : palette.black};
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
                              fill={(id + 1) === flowerId ? palette.white : (readability(palette.flower, palette.white) > 2 ? palette.flower : palette.black)}
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
          <Checkbox
            checked={wind}
            onChange={_ => setWind(!wind)}
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
              toast.promise(
                navigator
                  .clipboard
                  .writeText(`${window.location.origin}?settings=${settingsHash}`),
                {
                  loading: 'Planting your unique tree...',
                  success: 'Your unique tree has been copied to the clipboard!'
                },
                {
                  style: {
                    success: {
                      duration: 5000,
                      icon: '🌴'
                    },
                    loading: {
                      icon: '🌱'
                    }
                  }
                }

              )
            }}
          >
            <IoIosSave />
          </Checkbox>

          <br />

          <Checkbox
            aria-label='download-svg'
            checked={false}
            onChange={_ => {
              download(`${haiku}.svg`, svg)
              toast(`Preserved your tree forever`)
            }}
          >
            <FiDownload />
          </Checkbox>

        </div>

        <div css={{ position: 'relative' }}>
          <div
            css={css`
              .debug path[data-g='a'] { stroke: #F94144 !important; }
              .debug path[data-g='b'] { stroke: #F3722C !important; }
              .debug path[data-g='c'] { stroke: #F8961E !important; }
              .debug path[data-g='d'] { stroke: #F9C74F !important; }
              .debug path[data-g='e'] { stroke: #90BE6D !important; }
              .debug path[data-g='f'] { stroke: #43AA8B !important; }
              .debug path[data-g='g'] { stroke: #4D908E !important; }
              .debug path[data-g='h'] { stroke: #577590 !important; }
              .debug path[data-g='i'] { stroke: #277DA1 !important; }
              .debug path[data-g='j'] { stroke: #6a4c93 !important; }
            `}
            style={{
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '100vw'
            }}
          >

            {!anim && (
              <Wind
                enabled={wind}
                width={1690}
                height={2000}
                points={availableLeafPoints}
                rotation={grammar[start].rotation}
              />
            )}

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
        <Toaster />
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
