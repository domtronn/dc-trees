import styled from '@emotion/styled'

import palette from '../utils/palette'
import { mix } from 'polished'

const Input = styled.input`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: ${palette.white}; /* Otherwise white in Chrome */
  margin: 12px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    transition: background-color 0.2s ease-in-out;
  }

  &:hover::-webkit-slider-thumb {
    background-color: ${mix(0.2, palette.flower, palette.white)}
  }

  &:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  /* Special styling for WebKit/Blink */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid var(--primary);
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: var(--white);
    cursor: pointer;
    margin-top: -11px;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: var(--primary);
    border-radius: 4px;
  }

  &:focus::-webkit-slider-runnable-track {
    background: var(--primary);
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

export const Range = ({ label, value, valueF = _ => _, ...props }) => (
  <Container>
    <span>{label} {valueF(value)}</span>
    <Input value={value} {...props} />
  </Container>
)
