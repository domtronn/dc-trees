import { useContext, createContext } from 'react'

const palettes = [
  {
    flower: '#f998ba',
    flower2: '#ebadce',
    wood: '#432818',
    branch: '#ebddd7',
    grass: '#5d6e1e',
    white: '#fffffc',
    black: '#2b2b2b',
  },
  {
    flower: '#0e4627',
    flower2: '#7aaa7d',
    wood: '#6e4922',
    branch: '#856a45',
    grass: '#568e13',
    white: '#fffffc',
    black: '#2b2b2b',
  },
  {
    flower: '#da2c38',
    flower2: '#ffff3f',
    wood: '#43291f',
    branch: '#6c584c',
    grass: '#132a13',
    white: '#f0ead2',
    black: '#2b2b2b',
  },
  {
    flower: '#e0fbfc',
    flower2: '#daffef',
    wood: '#46494c',
    branch: '#dcdcdd',
    grass: '#64b6ac',
    white: '#fcfffd',
    black: '#2b2b2b',
  }
]

export const PaletteContext = createContext(palettes[0])
export const PaletteProvider = PaletteContext.Provider

export const usePalette = (s) => {
  const palette = useContext(PaletteContext)
  return s ? palette[s] : palette
}

export default palettes
