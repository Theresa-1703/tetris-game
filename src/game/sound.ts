// Minimal WebAudio helper with on/off toggle
export class Sound {
  private ctx: AudioContext | null = null
  private _enabled = true
  private master: GainNode | null = null

  enable(flag: boolean) {
    this._enabled = flag
    if (!flag && this.ctx) this.master!.gain.value = 0
    if (flag && this.ctx) this.master!.gain.value = 0.25
  }

  get enabled() { return this._enabled }

  private ensure() {
    if (this.ctx) return
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const master = ctx.createGain()
    master.gain.value = this._enabled ? 0.25 : 0
    master.connect(ctx.destination)
    this.ctx = ctx
    this.master = master
  }

  private blip(type: 'move'|'rotate'|'drop'|'line', duration = 0.06) {
    if (!this._enabled) return
    this.ensure()
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    let freq = 440
    switch (type) {
      case 'move': freq = 520; break
      case 'rotate': freq = 620; break
      case 'drop': freq = 200; break
      case 'line': freq = 880; break
    }
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.value = 0.0001
    gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(this.master!)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }

  move() { this.blip('move', 0.04) }
  rotate() { this.blip('rotate', 0.06) }
  drop() { this.blip('drop', 0.07) }
  line() { this.blip('line', 0.09) }
}

