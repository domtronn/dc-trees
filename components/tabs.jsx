/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState, Children } from 'react'

import styled from '@emotion/styled'
import palette from '../utils/palette'
import { mix } from 'polished'

const Ol = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
`

const Li = styled.li`
  font-weight: bold;
  font-size: ${p => p.size === 'lg' ? '1.2em' : '0.8em'};

  display: inline-block;
  border-bottom: ${p => p.active ? '3px solid var(--primary)' : '3px solid transparent'};
  color: var(--${p => p.active ? 'primary' : 'black'});
  margin: 4px 8px;
  transition: border-bottom-color 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    border-bottom: 3px solid ${p => p.active ? 'inherit' : mix(0.2, palette.flower, palette.white)};
  }
`

export const Tabs = ({
  children,
  size
}) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <Ol size={size}>
        {Children.map(children, (child, i) => (
          <Li
            size={size}
            key={i}
            active={activeTab === i}
            onClick={_ => setActiveTab(i)}
          >
            {child.props.label}
          </Li>
        ))}
      </Ol>
      <div>
        {Children.map(children, (child, i) => {
          if (i !== activeTab) return null
          return child
        })}
      </div>
    </div>
  )
}