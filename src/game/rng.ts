import type { PieceId } from './types'

// 7-bag randomizer for fair distribution
export function* bagGenerator(): Generator<PieceId, never, unknown> {
  while (true) {
    const bag: PieceId[] = [0,1,2,3,4,5,6]
    // Fisher–Yates shuffle
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[bag[i], bag[j]] = [bag[j], bag[i]]
    }
    for (const p of bag) yield p
  }
}

