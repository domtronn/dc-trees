/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useState } from 'react'

const nextGrammar = (grammar) => String.fromCharCode(
  1 + Object
    .keys(grammar)
    .reduce((acc, it) => Math.max(acc, it.charCodeAt(0)), 0)
)

const Controls = ({ grammar: g, onChange = _ => _ }) => {
  const [grammar, setGrammar] = useState(g)

  const handleGrammar = newGrammar => {
    setGrammar(newGrammar)
    onChange(newGrammar)
  }

  return (
    <div>
      {
        Object
          .entries(grammar)
          .map(([name, { length, rotation }]) => (
            <>
              <h2>{name}</h2>
              {
                Object
                  .keys(grammar)
                  .map(option => (
                    <>
                      <label htmlFor={`${name}-${option}`}>
                        {option}
                      </label>
                      <input
                        onChange={e => handleGrammar({
                          ...grammar,
                          [name]: {
                            ...grammar[name],
                            next: e.target.checked
                              ? grammar[name].next.concat(option)
                              : grammar[name].next.filter(i => i !== option)
                          }
                        })}
                        name={`${name}-${option}`}
                        type='checkbox'
                        checked={grammar[name].next.includes(option)}
                      />
                    </>
                  ))
              }
              <input
                onChange={e => handleGrammar({
                  ...grammar,
                  [name]: {
                    ...grammar[name],
                    length: +e.target.value
                  }
                })}
                value={length}
                name='length'
                type='range'
                min='10'
                max='100'
                step='5'
              />
              <input
                value={rotation}
                name='rotation'
                type='range'
                min={-Math.PI}
                max={Math.PI}
                step={Math.PI / 360}
                onChange={e => handleGrammar({
                  ...grammar,
                  [name]: {
                    ...grammar[name],
                    rotation: +e.target.value
                  }
                })}
              />
            </>
          ))
      }

      <button
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
      </button>
    </div>
  )
}

export default Controls
