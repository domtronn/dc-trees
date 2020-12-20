/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'

import { Button } from './button'
import { Range } from './range'
import { Checkbox } from './checkbox'

const nextGrammar = (grammar) => String.fromCharCode(
  1 + Object
    .keys(grammar)
    .reduce((acc, it) => Math.max(acc, it.charCodeAt(0)), 0)
)

const Controls = ({ grammar: g, start, onChange = _ => _ }) => {
  const [grammar, setGrammar] = useState(g)

  const handleGrammar = newGrammar => {
    setGrammar(newGrammar)
    onChange(newGrammar)
  }

  return (
    <div
      css={css`
        z-index: 20;
      `}
    >
      {
        Object
          .entries(grammar)
          .map(([name, { length, rotation }, i]) => (
            <div
              key={i}
              css={css`display: flex; flex-direction: column; align-items: center;`}
            >
              <h2 css={css`margin: 0 16px;`}>{name}</h2>
              <div>
                {
                  Object
                    .keys(grammar)
                    .map((option, j) => (
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
                    ))
                }
              </div>

              <Range
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
                type='range'
                min='10'
                max='100'
                step='0.5'
              />

              <Range
                value={rotation}
                label='Rotation'
                name='rotation'
                type='range'
                min={-Math.PI / 2}
                max={Math.PI / 2}
                step={Math.PI / 360}
                valueF={val => `${Math.round(val * 180 / Math.PI)}°`}
                onChange={e => handleGrammar({
                  ...grammar,
                  [name]: {
                    ...grammar[name],
                    rotation: +e.target.value
                  }
                })}
              />
              {
                name !== start && (
                  <Button
                    onClick={_ => handleGrammar(
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
                  >
                    Remove {name}
                  </Button>
                )
              }
            </div>
          ))
      }

      <Button
        block
        onClick={_ => handleGrammar({
          ...grammar,
          [nextGrammar(grammar)]: {
            next: [],
            length: 10,
            rotation: 0
          }
        })}
      >
        New grammar
      </Button>
    </div>
  )
}

export default Controls
