import { COLS, ROWS } from './constants'
import type { ActivePiece, Matrix, PieceId } from './types'
import { TETROMINOES } from './tetromino'

export function createEmptyBoard(): Matrix {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(-1))
}

export function getShape(id: PieceId, rotation: number): number[][] {
  return TETROMINOES[id][rotation]
}

export function collides(board: Matrix, piece: ActivePiece): boolean {
  const shape = getShape(piece.id, piece.rotation)
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const bx = piece.x + x
        const by = piece.y + y
        if (bx < 0 || bx >= COLS || by >= ROWS) return true
        if (by >= 0 && board[by][bx] !== -1) return true
      }
    }
  }
  return false
}

export function merge(board: Matrix, piece: ActivePiece): void {
  const shape = getShape(piece.id, piece.rotation)
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const bx = piece.x + x
        const by = piece.y + y
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          board[by][bx] = piece.id
        }
      }
    }
  }
}

export function clearLines(board: Matrix): { lines: number, newBoard: Matrix } {
  const remain = board.filter(row => row.some(cell => cell === -1))
  const cleared = ROWS - remain.length
  const newRows = Array.from({ length: cleared }, () => Array(COLS).fill(-1))
  const newBoard = [...newRows, ...remain]
  return { lines: cleared, newBoard }
}

export function spawnPosition(id: PieceId): { x: number, y: number, rotation: 0 } {
  // Spawn at top center depending on shape width
  const width = TETROMINOES[id][0][0].length
  const x = Math.floor((COLS - width) / 2)
  const y = -2 // start above visible area to allow entry
  return { x, y, rotation: 0 }
}

export function ghostY(board: Matrix, piece: ActivePiece): number {
  let y = piece.y
  const test: ActivePiece = { ...piece }
  while (true) {
    test.y = y + 1
    if (collides(board, test)) break
    y++
  }
  return y
}

