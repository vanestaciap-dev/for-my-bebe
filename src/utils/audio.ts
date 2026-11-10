// 16-bit Calm Lullaby, Combat, and Nether Audio Synthesizer

class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  public currentTheme: 'calm' | 'hell' = 'calm';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft, cushioned footstep on cobblestones
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  // Dialogue chirp
  public playDialogueBeep(pitch: number = 520) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  // 16-Bit Sword Slash
  public playSwordSlash() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  // Demon Hit impact
  public playDemonHit() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  // Demon Defeated
  public playDemonDefeated() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [220, 164.81, 130.81, 98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.08, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.22);
      });
    } catch {}
  }

  // Hell Chest Unlocked
  public playHellChestUnlock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [329.63, 392.00, 493.88, 587.33, 659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.55);
      });
    } catch {}
  }

  // Player Hurt (Retro crunchy impact sound)
  public playPlayerHurt() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {}
  }

  // Demon Attack (Menacing swoosh / energy fireball)
  public playDemonAttack() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(260, this.ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.27);
    } catch {}
  }

  // Player Respawn / Love Revival Chime
  public playPlayerRespawn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.45);
      });
    } catch {}
  }

  // Heal Heart Picked Up
  public playHealHeart() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [587.33, 880.00];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.28);
      });
    } catch {}
  }

  // Warm chime / collectible pickup
  public playCollectSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.09, this.ctx!.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.09);
        osc.stop(this.ctx!.currentTime + idx * 0.09 + 0.38);
      });
    } catch {}
  }

  // Bell note for puzzle
  public playNote(freq: number, duration: number = 0.5) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  // Gentle puzzle success
  public playPuzzleSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const melody = [
        { f: 523.25, t: 0.0, d: 0.2 },
        { f: 659.25, t: 0.15, d: 0.2 },
        { f: 783.99, t: 0.3, d: 0.2 },
        { f: 1046.5, t: 0.45, d: 0.5 },
      ];

      melody.forEach(m => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(m.f, this.ctx!.currentTime + m.t);
        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + m.t);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + m.t + m.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + m.t);
        osc.stop(this.ctx!.currentTime + m.t + m.d);
      });
    } catch {}
  }

  // Grand Unlock Gate Fanfare
  public playUnlockGate() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const chords = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      chords.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + i * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.12);
        osc.stop(this.ctx!.currentTime + i * 0.12 + 0.85);
      });
    } catch {}
  }

  // Heart beat
  public playHeartSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  // Rain sound
  public startRainAmbient() {
    if (this.isMuted || this.rainNode) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.rainNode = whiteNoise;
    } catch {}
  }

  public stopRainAmbient() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
        this.rainNode.disconnect();
      } catch {}
      this.rainNode = null;
      this.rainGain = null;
    }
  }

  // Switch Theme & Restart BGM
  public setTheme(theme: 'calm' | 'hell') {
    if (this.currentTheme === theme) return;
    this.currentTheme = theme;
    if (this.isBgmPlaying) {
      this.stopBgm();
      this.startBgm();
    }
  }

  public startBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    if (this.currentTheme === 'hell') {
      this.scheduleHellTheme();
    } else {
      this.scheduleCalmLullaby();
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  // Dark 16-bit Nether Theme (Dramatic, rhythmic, dark yet romantic pulse)
  private scheduleHellTheme() {
    if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;

    const b = 0.38;
    const now = this.ctx.currentTime;

    // Dark dramatic minor progression: Dm -> Bb -> Gm -> A7
    const notes: { f: number; t: number; d: number; vol: number; type: OscillatorType }[] = [
      // Bar 1 (Dm)
      { f: 146.83, t: 0, d: b * 1.5, vol: 0.04, type: 'sawtooth' }, // D3
      { f: 293.66, t: 0, d: b * 0.8, vol: 0.03, type: 'triangle' }, // D4
      { f: 349.23, t: b * 0.5, d: b * 0.8, vol: 0.03, type: 'triangle' }, // F4
      { f: 440.00, t: b * 1.0, d: b * 0.8, vol: 0.035, type: 'triangle' }, // A4
      { f: 587.33, t: b * 1.5, d: b * 1.2, vol: 0.04, type: 'sine' }, // D5

      // Bar 2 (Bb)
      { f: 116.54, t: b * 2, d: b * 1.5, vol: 0.04, type: 'sawtooth' }, // Bb2
      { f: 466.16, t: b * 2, d: b * 0.8, vol: 0.03, type: 'triangle' }, // Bb4
      { f: 440.00, t: b * 2.5, d: b * 0.8, vol: 0.03, type: 'triangle' }, // A4
      { f: 349.23, t: b * 3.0, d: b * 0.8, vol: 0.03, type: 'triangle' }, // F4
      { f: 293.66, t: b * 3.5, d: b * 1.2, vol: 0.035, type: 'sine' }, // D4

      // Bar 3 (Gm)
      { f: 98.00, t: b * 4, d: b * 1.5, vol: 0.04, type: 'sawtooth' }, // G2
      { f: 392.00, t: b * 4, d: b * 0.8, vol: 0.03, type: 'triangle' }, // G4
      { f: 466.16, t: b * 4.5, d: b * 0.8, vol: 0.03, type: 'triangle' }, // Bb4
      { f: 587.33, t: b * 5.0, d: b * 0.8, vol: 0.035, type: 'triangle' }, // D5
      { f: 783.99, t: b * 5.5, d: b * 1.2, vol: 0.04, type: 'sine' }, // G5

      // Bar 4 (A7)
      { f: 110.00, t: b * 6, d: b * 1.8, vol: 0.04, type: 'sawtooth' }, // A2
      { f: 554.37, t: b * 6, d: b * 0.8, vol: 0.035, type: 'triangle' }, // C#5
      { f: 659.25, t: b * 6.5, d: b * 0.8, vol: 0.035, type: 'triangle' }, // E5
      { f: 587.33, t: b * 7.0, d: b * 1.2, vol: 0.035, type: 'sine' }, // D5
    ];

    const totalDuration = b * 8;

    notes.forEach(n => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = n.type;
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(n.vol, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });

    this.bgmTimeoutId = window.setTimeout(() => {
      this.scheduleHellTheme();
    }, totalDuration * 1000);
  }

  // Calm, Peaceful 16-bit Lo-Fi Music Box Lullaby
  private scheduleCalmLullaby() {
    if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;

    const b = 0.52;
    const now = this.ctx.currentTime;

    const notes: { f: number; t: number; d: number; vol: number; type: OscillatorType }[] = [
      { f: 174.61, t: 0, d: b * 2, vol: 0.025, type: 'triangle' },
      { f: 523.25, t: 0, d: b * 1.5, vol: 0.03, type: 'sine' },
      { f: 659.25, t: b * 0.7, d: b * 1.2, vol: 0.025, type: 'sine' },
      { f: 880.00, t: b * 1.4, d: b * 1.8, vol: 0.035, type: 'sine' },

      { f: 196.00, t: b * 2.2, d: b * 2, vol: 0.025, type: 'triangle' },
      { f: 783.99, t: b * 2.2, d: b * 1.2, vol: 0.03, type: 'sine' },
      { f: 659.25, t: b * 2.9, d: b * 1.2, vol: 0.025, type: 'sine' },
      { f: 587.33, t: b * 3.6, d: b * 1.8, vol: 0.035, type: 'sine' },

      { f: 164.81, t: b * 4.4, d: b * 2, vol: 0.025, type: 'triangle' },
      { f: 659.25, t: b * 4.4, d: b * 1.2, vol: 0.03, type: 'sine' },
      { f: 783.99, t: b * 5.1, d: b * 1.2, vol: 0.025, type: 'sine' },
      { f: 987.77, t: b * 5.8, d: b * 1.8, vol: 0.035, type: 'sine' },

      { f: 220.00, t: b * 6.6, d: b * 2, vol: 0.025, type: 'triangle' },
      { f: 880.00, t: b * 6.6, d: b * 1.2, vol: 0.03, type: 'sine' },
      { f: 783.99, t: b * 7.3, d: b * 1.2, vol: 0.025, type: 'sine' },
      { f: 659.25, t: b * 8.0, d: b * 1.8, vol: 0.035, type: 'sine' },

      { f: 146.83, t: b * 8.8, d: b * 2, vol: 0.025, type: 'triangle' },
      { f: 587.33, t: b * 8.8, d: b * 1.2, vol: 0.03, type: 'sine' },
      { f: 698.46, t: b * 9.5, d: b * 1.2, vol: 0.025, type: 'sine' },
      { f: 880.00, t: b * 10.2, d: b * 1.8, vol: 0.035, type: 'sine' },

      { f: 196.00, t: b * 11.0, d: b * 2, vol: 0.025, type: 'triangle' },
      { f: 783.99, t: b * 11.0, d: b * 1.0, vol: 0.03, type: 'sine' },
      { f: 659.25, t: b * 11.8, d: b * 1.0, vol: 0.025, type: 'sine' },
      { f: 587.33, t: b * 12.5, d: b * 1.5, vol: 0.03, type: 'sine' },

      { f: 130.81, t: b * 13.2, d: b * 3, vol: 0.03, type: 'triangle' },
      { f: 523.25, t: b * 13.2, d: b * 1.8, vol: 0.03, type: 'sine' },
      { f: 659.25, t: b * 14.2, d: b * 1.8, vol: 0.025, type: 'sine' },
      { f: 783.99, t: b * 15.0, d: b * 2.5, vol: 0.035, type: 'sine' },
    ];

    const totalDuration = b * 16.5;

    notes.forEach(n => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = n.type;
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(n.vol, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });

    this.bgmTimeoutId = window.setTimeout(() => {
      this.scheduleCalmLullaby();
    }, totalDuration * 1000);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
      this.stopRainAmbient();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }
}

export const sound = new SoundController();
