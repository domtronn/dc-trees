/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'

const nextGrammar = (grammar) => String.fromCharCode(
  1 + Object
    .keys(grammar)
    .reduce((acc, it) => Math.max(acc, it.charCodeAt(0)), 0)
)

const Checkbox = ({ name, children, ...props }) => (
  <div
    css={css`
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 32px;
      width: 32px;
      margin: 0 8px;
    `}
  >
    <input
      css={css`
        cursor: pointer;
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        height: 32px;
        width: 32px;
        opacity: 0;

        &:checked ~ label {
          border-color: #f998ba;
          background-color: #f998ba;
          color: white;
        }
      `}
      name={name}
      type='checkbox'
      {...props}
    />
    <label
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        height: 32px;
        width: 32px;
        background-color: #efefef;
        border: 2px solid #2b2b2b;
        color: #2b2b2b;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        
      `}
      htmlFor={name}
    >
      {children}
    </label>
  </div>
)

const Controls = ({ grammar: g, onChange = _ => _ }) => {
  const [grammar, setGrammar] = useState(g)

  const handleGrammar = newGrammar => {
    setGrammar(newGrammar)
    onChange(newGrammar)
  }

  return (
    <div>
      <style>
      </style>
      {
        Object
          .entries(grammar)
          .map(([name, { length, rotation }]) => (
            <div
              css={css`display: flex; flex-direction: row; align-items: center;`}
            >
              <h2 css={css`margin: 0 16px;`}>{name}</h2>
              <div>
                {
                Object
                  .keys(grammar)
                  .map(option => (
                    <Checkbox
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
              <div>
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
                  step='0.5'
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
              </div>
            </div>
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
