import styled from '@emotion/styled'

import { usePalette } from '../utils/palette'
import { mix } from 'tinycolor2'

const Input = styled.input`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: ${p => p.palette.white}; /* Otherwise white in Chrome */
  margin: 12px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    transition: all 0.2s ease-in-out;
  }

  &:hover::-webkit-slider-thumb {
    transition: all 0.2s ease-in-out;
    background-color: ${p => mix(p.palette.flower, p.palette.white, 20)}
  }

  &:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  /* Special styling for WebKit/Blink */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid var(--primary);
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--white);
    cursor: pointer;
    margin-top: -6px;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: var(--primary);
    transition: all 0.2s ease-in-out;
    border-radius: 4px;
  }

  &:focus::-webkit-slider-runnable-track {
    background: var(--primary);
  }
`

const Container = styled.div`
  margin: 8px auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

export const Range = ({
  range: [min, max, step] = [],
  label,
  value,
  valueF = _ => _,
  ...props
}) => {
  const palette = usePalette()
  return (
    <Container>
      <span>{label} {valueF(value)}</span>
      <Input
        palette={palette}
        type='range'
        value={value}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    </Container>
  )
}
