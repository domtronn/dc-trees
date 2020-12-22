/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'

import { Button } from './button'
import { Range } from './range'
import { Checkbox } from './checkbox'

import { BsTrash } from 'react-icons/bs'

const nextGrammar = (grammar) => String.fromCharCode(
  1 + Object
    .keys(grammar)
    .reduce((acc, it) => Math.max(acc, it.charCodeAt(0)), 0)
)

export const Controls = ({ grammar: g, start, onChange = _ => _ }) => {
  const [grammar, setGrammar] = useState(g)

  const handleGrammar = newGrammar => {
    setGrammar(newGrammar)
    onChange(newGrammar)
  }

  return Object
    .entries(grammar)
    .map(([name, { length, rotation }, i]) => (
      <>
        <div
          key={`${name}-${i}1`}
          css={css`display: grid;
                  grid-template-columns: 1fr 4fr 4fr;
                  grid-template-rows: 1fr;
                  gap: 0 8px;
                  grid-template-areas: "a b c"`}
        >
          <div css={css`display: flex; align-items: center; grid-area: a;`}>
            <h2 css={css`margin: 0 16px;`}>{name}</h2>
          </div>

          <Range
            style={{ gridArea: 'b' }}
            onChange={e => handleGrammar({
              ...grammar,
              [name]: {
                ...grammar[name],
                length: +e.target.value
              }
            })}
            label='Length'
            value={length}
            name='length'
            range={[10, 100, 0.5]}
          />

          <Range
            style={{ gridArea: 'c' }}
            value={rotation}
            label='Rotation'
            name='rotation'
            range={[-Math.PI / 2, Math.PI / 2, Math.PI / 360]}
            valueF={val => `${Math.round(val * 180 / Math.PI)}°`}
            onChange={e => handleGrammar({
              ...grammar,
              [name]: {
                ...grammar[name],
                rotation: +e.target.value
              }
            })}
          />
        </div>
      </>
    ))
}

export const Definitions = ({ grammar: g, start, onChange = _ => _ }) => {
  const [grammar, setGrammar] = useState(g)

  const handleGrammar = newGrammar => {
    setGrammar(newGrammar)
    onChange(newGrammar)
  }

  return (
    <div css={css`z-index: 20;`}>
      {
        Object
          .entries(grammar)
          .map(([name, { length, rotation }, i]) => (
            <>
              <div
                key={`${name}-${i}1`}
                css={css`
                  display: grid;
                  grid-template-columns: 1fr 6fr 1fr;
                  grid-template-rows: 1fr;
                  gap: 0px 0px;
                  grid-template-areas: "a b c"`}
              >
                <div css={css`display: flex; align-items: center; grid-area: a;`}>
                  <h2 css={css`margin: 0 16px;`}>{name}</h2>
                </div>
                <div
                  css={css`display: flex; justify-content: flex-start; flex-wrap: wrap; grid-area: b`}
                >
                  {
                    Object
                      .keys(grammar)
                      .map((option, j) => (
                        <div key={`${name}-${i}-${j}`} css={css`width: 20%;`}>
                          <Checkbox
                            id={`${i}--${j}`}
                            key={`${i}--${j}`}
                            name={`${name}-${option}`}
                            checked={grammar[name].next.includes(option)}
                            onChange={e => handleGrammar({
                              ...grammar,
                              [name]: {
                                ...grammar[name],
                                next: e.target.checked
                                  ? grammar[name].next.concat(option)
                                  : grammar[name].next.filter(i => i !== option)
                              }
                            })}
                          >
                            {option}
                          </Checkbox>
                        </div>
                      ))
                  }
                </div>

                <div css={css`grid-area: c;`}>
                  {
                    name !== start && (
                      <Checkbox
                        variant='icon'
                        onChange={_ => handleGrammar(
                          Object
                            .entries(grammar)
                            .reduce((acc, [key, value]) => {
                              return key === name ? acc
                                : {
                                  ...acc,
                                  [key]: {
                                    ...value,
                                    next: value.next.filter(i => i !== name)
                                  }
                                }
                            }, {})

                        )}
                        label={`delete-${name}`}
                      >
                        <BsTrash />
                      </Checkbox>
                    )
                  }
                </div>
              </div>
              <hr />
            </>
          ))
      }

      <Button
        block
        onClick={_ => handleGrammar({
          ...grammar,
          [nextGrammar(grammar)]: {
            next: [],
            length: 20,
            rotation: Math.PI / 2
          }
        })}
      >
        Add a grammar
      </Button>
    </div>
  )
}

export default Controls
