import { useEffect, useMemo, useRef, useState } from 'react'
import { Engine } from './game/engine'
import { COLS, PIECE_KEYS, ROWS } from './game/constants'
import type { Matrix, PieceId } from './game/types'
import { TETROMINOES } from './game/tetromino'
import { Sound } from './game/sound'

function useRafLoop(callback: (dtMs: number) => void, running: boolean) {
  const last = useRef<number | null>(null)
  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      if (last.current == null) last.current = t
      const dt = t - last.current
      last.current = t
      if (running) callback(dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [callback, running])
}

function Cell({ value, ghost }: { value: number, ghost?: boolean }) {
  const filled = value !== -1
  const name = filled ? PIECE_KEYS[value as PieceId] : ''
  const classes = ['cell']
  if (filled) classes.push('filled', name)
  if (ghost && !filled) classes.push('ghost')
  return <div className={classes.join(' ')} />
}

function BoardView({ matrix, ghostMatrix }: { matrix: Matrix, ghostMatrix?: boolean[][] }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 28px)` }}>
      {matrix.map((row, y) => (
        <div className="row" key={y}>
          {row.map((v, x) => (
            <Cell key={x} value={v} ghost={ghostMatrix?.[y]?.[x]} />
          ))}
        </div>
      ))}
    </div>
  )
}

function NextPreview({ id }: { id: PieceId }) {
  const shape = TETROMINOES[id][0]
  const size = 4
  const offsetX = Math.floor((size - shape[0].length) / 2)
  const offsetY = Math.floor((size - shape.length) / 2)
  const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(-1))
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[0].length; x++)
      if (shape[y][x]) grid[offsetY + y][offsetX + x] = id
  return (
    <div className="preview" style={{ gridTemplateColumns: `repeat(${size}, 20px)` }}>
      {grid.flatMap((row, y) => row.map((v, x) => <div key={`${y}-${x}`} className={['cell', v!==-1?'filled':'', PIECE_KEYS[v as PieceId] ?? ''].join(' ')} style={{ width: 20, height: 20, borderRadius: 5 }} />))}
    </div>
  )
}

export default function App() {
  const engineRef = useRef<Engine | null>(null)
  const [matrix, setMatrix] = useState<Matrix>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(-1)))
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [paused, setPaused] = useState(false)
  const [over, setOver] = useState(false)
  const [next, setNext] = useState<PieceId[]>([])
  const [ghost, setGhost] = useState<boolean[][] | undefined>(undefined)
  const sound = useMemo(() => new Sound(), [])

  useEffect(() => {
    const engine = new Engine((ev) => {
      if (ev.type === 'lines') { sound.line() }
      if (ev.type === 'lock') {}
      if (ev.type === 'spawn') {}
      if (ev.type === 'gameover') {}
    })
    engineRef.current = engine
    const sync = () => {
      const st = engine.state
      setMatrix(engine.combinedMatrix())
      setScore(st.score)
      setLevel(st.level)
      setLines(st.lines)
      setPaused(st.paused)
      setOver(st.gameOver)
      setNext(st.nextQueue.slice(0, 3))
      const gy = engine.getGhostY()
      if (gy != null && st.current) {
        const shape = TETROMINOES[st.current.id][st.current.rotation]
        const g: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[0].length; x++) {
            if (shape[y][x]) {
              const bx = st.current.x + x
              const by = gy + y
              if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) g[by][bx] = true
            }
          }
        }
        setGhost(g)
      } else setGhost(undefined)
    }
    sync()

    const int = setInterval(sync, 30)
    return () => { clearInterval(int) }
  }, [sound])

  useRafLoop((dt) => {
    engineRef.current?.step(dt)
  }, !paused && !over)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const engine = engineRef.current
      if (!engine) return
      if (e.key === 'p') { engine.setPaused(!engine.state.paused); setPaused(engine.state.paused); return }
      if (engine.state.paused || engine.state.gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          if (engine.move(-1)) sound.move()
          break
        case 'ArrowRight':
        case 'd':
          if (engine.move(1)) sound.move()
          break
        case 'ArrowUp':
        case 'w':
        case 'x':
          if (engine.rotate(1)) sound.rotate()
          break
        case 'z':
        case 'Control':
          if (engine.rotate(-1)) sound.rotate()
          break
        case 'ArrowDown':
        case 's':
          if (engine.softDrop(true)) sound.move()
          break
        case ' ': // hard drop
          e.preventDefault();
          const dist = engine.hardDrop(); if (dist>0) sound.drop()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sound])

  const togglePause = () => {
    const engine = engineRef.current!
    engine.setPaused(!engine.state.paused)
    setPaused(engine.state.paused)
  }

  const reset = () => {
    const engine = engineRef.current!
    engine.reset()
  }

  return (
    <div className="app">
      <div className="game-wrap">
        <div className="board-wrap">
          <BoardView matrix={matrix} ghostMatrix={ghost} />
        </div>
      </div>
      <aside className="sidebar">
        <div>
          <h1>Tetris</h1>
          <div className="stats">
            <div className="stat"><label>Punkte</label><div>{score}</div></div>
            <div className="stat"><label>Level</label><div>{level}</div></div>
            <div className="stat"><label>Linien</label><div>{lines}</div></div>
            <div className="stat"><label>Status</label><div>{over ? 'Game Over' : (paused ? 'Pause' : 'Spiel läuft')}</div></div>
          </div>
        </div>
        <div>
          <label style={{ color: 'var(--muted)', fontSize: 12 }}>Nächste</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {next.map((id, i) => <NextPreview key={i} id={id} />)}
          </div>
        </div>
        <div className="controls">
          <button onClick={togglePause}>{paused ? 'Fortsetzen' : 'Pause'}</button>
          <button onClick={reset}>Neu starten</button>
          <button onClick={() => sound.enable(!sound.enabled)}>{sound.enabled ? 'Stumm' : 'Ton an'}</button>
        </div>
        <div className="footer">
          Steuerung: ←/→ bewegen, ↑/X drehen, Z/Strg gegen den Uhrzeigersinn, ↓ Soft Drop, Leertaste Hard Drop, P Pause.
        </div>
      </aside>
    </div>
  )
}
