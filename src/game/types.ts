export type Matrix = number[][] // -1 empty, 0..6 piece ids

export type PieceId = 0 | 1 | 2 | 3 | 4 | 5 | 6 // I, J, L, O, S, T, Z

export interface ActivePiece {
  id: PieceId
  rotation: 0 | 1 | 2 | 3
  x: number // column index on board (left)
  y: number // row index on board (top)
}

export interface GameState {
  board: Matrix
  current: ActivePiece | null
  nextQueue: PieceId[]
  score: number
  level: number
  lines: number
  gameOver: boolean
  paused: boolean
}

