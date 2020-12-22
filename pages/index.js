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

import palette from '../utils/palette'
import { boundingRect } from '../utils/bounding-box'

import Controls from '../components/controls'

import { Card } from '../components/card'
import { Button } from '../components/button'
import { Range } from '../components/range'
import { Checkbox } from '../components/checkbox'

import { MeasureRender } from '../components/measure'
import Tree from '../components/tree'
import Flowers from '../components/flowers'
import Bank from '../components/bank'

const growthFunctions = {
  linear: (layers) => (len, layer) => len - (layer * (len / (2 * layers))),
  exponential: (layers) => (len, layer) => len * (1 / (layer + 1)),
  static: (layers) => (len) => len,
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
  start = 'a'
}) => {
  const [rotation, setRotation] = useState(_grammar[start].rotation)
  const [grammar, setGrammar] = useState(_grammar)
  const [layers, setLayers] = useState(_layers)
  const [flowerId, setFlowerId] = useState(_flowerId)
  const [flowerSize, setFlowerSize] = useState(_flowerSize)
  const [trunkWidth, setTrunkWidth] = useState(_trunkWidth)
  const [growth, setGrowth] = useState('static')

  const [anim, setAnim] = useState(false)
  const [debug, setDebug] = useState(false)
  const [visible, setCardVisible] = useState(false)
  const [flowerVis, setFlowerVis] = useState(true)

  const data = generate(
    grammar,
    layers,
    start,
    [1000, 1000],
    growthFunctions[growth](layers)
  )

  const boundingBox = boundingRect(data, grammar[start].rotation, [1000, 1000])
  const animationHandlers = {
    onStart: _ => setAnim(true), onEnd: _ => setAnim(false)
  }

  const settings = {
    grammar,
    layers,
    flowerId,
    flowerSize,
    trunkWidth
  }

  useEffect(() => animate(data, animationHandlers), [])

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            sup { margin-bottom: 8px; }
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
            .debug .flower { display: none; }`
        }}
      />

      {true && (
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

          <Button
            block
            onClick={_ => setFlowerVis(!flowerVis)}
          >
            Toggle flowers
          </Button>

          <Range
            label='Depth'
            type='range'
            min={1}
            max={20}
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
            min={0}
            max={40}
            step={1}
            value={flowerSize}
            onChange={e => setFlowerSize(+e.target.value)}
          />

          <div css={css`text-align: center;`}>
            <h3>Leaf</h3>
            {
              [1,2,3,4].map(id => (
                <Checkbox
                  key={id}
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
                  key={id}
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

          <div css={css`text-align: center;`}>
            <h3>Growth rate</h3>
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

          <Button
            block
            onClick={_ => {
              navigator
                .clipboard
                .writeText(`http://localhost:3000/?settings=${btoa(JSON.stringify(settings))}`)
            }}
          >
            Copy url
          </Button>

        </Card>
      )}

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
              size={[boundingBox.x, boundingBox.y]}
              width={trunkWidth}
            >
              <Flowers
                data={data}
                id={flowerId}
                size={[Math.max(0, flowerSize - flowerSize / 3), flowerSize]}
                animate={anim}
                rotation={grammar[start].rotation}
              />
            </Tree>
            <Bank />
          </MeasureRender>
        </div>

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
