/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export const Checkbox = ({ name, variant, children, ...props }) => (
  <div
    css={css`
      pointer-events: initial;
      font-weight: bold;
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 32px;
      width: 32px;
      margin: 8px;
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
          border-color: var(--primary);
          background-color: var(--primary);
          color: var(--white);
        }

        &:hover ~ label:before {
          background-color: var(--primary);
          color: var(--white);
        }

        &:checked:hover ~ label:before {
          background-color: var(--white);
          color: var(--white);
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
        background-color: var(--white);
        border: 2px solid ${variant === 'icon' ? 'transparent' : 'var(--primary)'};
        color: var(--primary);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;

        &:before {
          content: '';
          border-radius: inherit;
          transition: all 0.2s ease-in-out 0s;
          opacity: 0.2;
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
        }
      `}
      htmlFor={name}
    >
      {children}
    </label>
  </div>
)
