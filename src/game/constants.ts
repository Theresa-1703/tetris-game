export const COLS = 10
export const ROWS = 20

export const INITIAL_DROP_MS = 1000 // level 1 gravity
export const LEVEL_UP_LINES = 10

export const PIECE_KEYS = ['I','J','L','O','S','T','Z'] as const
export type PieceKey = typeof PIECE_KEYS[number]

export const COLORS: Record<PieceKey, string> = {
  I: 'I',
  J: 'J',
  L: 'L',
  O: 'O',
  S: 'S',
  T: 'T',
  Z: 'Z',
}

// Tetris Guideline SRS wall kicks (JLSTZ) and I special
// Format: [fromRotation][toRotation] -> array of offset pairs [x,y]
export const KICKS_JLSTZ: Record<string, [number, number][]> = {
  '0>1': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '1>0': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
  '1>2': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
  '2>1': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '2>3': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '3>2': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  '3>0': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  '0>3': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
}

export const KICKS_I: Record<string, [number, number][]> = {
  '0>1': [[0,0], [-2,0], [1,0], [-2, -1], [1, 2]],
  '1>0': [[0,0], [2,0], [-1,0], [2, 1], [-1,-2]],
  '1>2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
  '2>1': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  '2>3': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  '3>2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  '3>0': [[0,0], [1,0], [-2,0], [1,2], [-2,-1]],
  '0>3': [[0,0], [-1,0], [2,0], [-1,-2], [2,1]],
}

