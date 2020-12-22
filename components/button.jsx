import styled from '@emotion/styled'

export const Button = styled.button`
  position: relative;
  margin: 8px 0;
  border: none;
  outline: none;
  padding: 16px 32px;
  border-radius: 8px;

  width: ${p => p.block ? '100%' : 'auto'};

  background-color: var(--white);
  border: 2px solid var(--primary);
  color: var(--primary);

  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    opacity: 0.2;
    transition: all 0.2s linear;
  }

  &:hover {
    cursor: pointer;
  }

  &:hover:before {
    background-color: var(--primary);
  }
`
