import { COLS, INITIAL_DROP_MS, KICKS_I, KICKS_JLSTZ, LEVEL_UP_LINES } from './constants'
import type { ActivePiece, GameState, Matrix, PieceId } from './types'
import { bagGenerator } from './rng'
import { createEmptyBoard, collides, merge, clearLines, spawnPosition, ghostY } from './board'
import { TETROMINOES } from './tetromino'

export type EngineEvent =
  | { type: 'lines'; count: number }
  | { type: 'lock' }
  | { type: 'spawn' }
  | { type: 'gameover' }

export class Engine {
  state: GameState
  private bag = bagGenerator()
  private gravMs = INITIAL_DROP_MS
  private acc = 0
  private onEvent?: (ev: EngineEvent) => void

  constructor(onEvent?: (ev: EngineEvent) => void) {
    this.onEvent = onEvent
    this.state = {
      board: createEmptyBoard(),
      current: null,
      nextQueue: [],
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      paused: false,
    }
    // prime next queue with 5 pieces
    while (this.state.nextQueue.length < 5) this.state.nextQueue.push(this.bag.next().value as PieceId)
    this.spawn()
  }

  setPaused(flag: boolean) { this.state.paused = flag }

  private emit(ev: EngineEvent) { this.onEvent?.(ev) }

  private spawn() {
    const id = (this.state.nextQueue.shift() ?? (this.bag.next().value as PieceId))
    this.state.nextQueue.push(this.bag.next().value as PieceId)
    const pos = spawnPosition(id)
    const piece: ActivePiece = { id, rotation: 0, x: pos.x, y: pos.y }
    if (collides(this.state.board, piece)) {
      this.state.gameOver = true
      this.emit({ type: 'gameover' })
      return
    }
    this.state.current = piece
    this.emit({ type: 'spawn' })
  }

  reset() {
    this.state.board = createEmptyBoard()
    this.state.score = 0
    this.state.level = 1
    this.state.lines = 0
    this.state.gameOver = false
    this.state.paused = false
    this.state.nextQueue = []
    this.acc = 0
    this.gravMs = INITIAL_DROP_MS
    while (this.state.nextQueue.length < 5) this.state.nextQueue.push(this.bag.next().value as PieceId)
    this.spawn()
  }

  step(dtMs: number) {
    if (this.state.paused || this.state.gameOver) return
    this.acc += dtMs
    while (this.acc >= this.gravMs) {
      this.acc -= this.gravMs
      this.softDrop(false) // gravity drop, no score
    }
  }

  private levelForLines(lines: number): number { return Math.floor(lines / LEVEL_UP_LINES) + 1 }
  private speedForLevel(level: number): number { return Math.max(80, INITIAL_DROP_MS - (level - 1) * 60) }

  private lockDown() {
    if (!this.state.current) return
    merge(this.state.board, this.state.current)
    const { lines, newBoard } = clearLines(this.state.board)
    this.state.board = newBoard
    if (lines > 0) {
      // Standard-ish scoring
      const base = [0, 100, 300, 500, 800][lines] || 0
      this.state.score += base * this.state.level
      this.state.lines += lines
      const newLevel = this.levelForLines(this.state.lines)
      if (newLevel !== this.state.level) {
        this.state.level = newLevel
        this.gravMs = this.speedForLevel(this.state.level)
      }
      this.emit({ type: 'lines', count: lines })
    }
    this.emit({ type: 'lock' })
    this.spawn()
  }

  move(dx: number): boolean {
    if (!this.state.current || this.state.paused || this.state.gameOver) return false
    const test: ActivePiece = { ...this.state.current, x: this.state.current.x + dx }
    if (!collides(this.state.board, test)) {
      this.state.current = test
      return true
    }
    return false
  }

  rotate(dir: 1 | -1): boolean {
    const cur = this.state.current
    if (!cur || this.state.paused || this.state.gameOver) return false
    const from = cur.rotation
    const to = ((cur.rotation + dir + 4) % 4) as 0 | 1 | 2 | 3
    const kicks = cur.id === 0 ? KICKS_I : KICKS_JLSTZ
    const key = `${from}>${to}`
    const shape = TETROMINOES[cur.id][to]
    for (const [ox, oy] of kicks[key] || [[0,0]]) {
      const test: ActivePiece = { id: cur.id, rotation: to, x: cur.x + ox, y: cur.y + oy }
      if (!collides(this.state.board, test)) {
        this.state.current = test
        return true
      }
    }
    return false
  }

  softDrop(withScore = true): boolean {
    if (!this.state.current || this.state.paused || this.state.gameOver) return false
    const test: ActivePiece = { ...this.state.current, y: this.state.current.y + 1 }
    if (!collides(this.state.board, test)) {
      this.state.current = test
      if (withScore) this.state.score += 1 // soft drop point
      return true
    }
    // cannot move further down -> lock
    this.lockDown()
    return false
  }

  hardDrop(): number {
    if (!this.state.current || this.state.paused || this.state.gameOver) return 0
    let dist = 0
    while (true) {
      const test: ActivePiece = { ...this.state.current, y: this.state.current.y + 1 }
      if (!collides(this.state.board, test)) {
        this.state.current = test
        dist++
      } else break
    }
    // lock after
    this.state.score += dist * 2
    this.lockDown()
    return dist
  }

  getGhostY(): number | null {
    if (!this.state.current) return null
    return ghostY(this.state.board, this.state.current)
  }

  // For rendering convenience
  combinedMatrix(): Matrix {
    const grid: Matrix = this.state.board.map(row => row.slice())
    const cur = this.state.current
    if (!cur) return grid
    const shape = TETROMINOES[cur.id][cur.rotation]
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const bx = cur.x + x
          const by = cur.y + y
          if (by >= 0 && by < grid.length && bx >= 0 && bx < COLS) grid[by][bx] = cur.id
        }
      }
    }
    return grid
  }
}

