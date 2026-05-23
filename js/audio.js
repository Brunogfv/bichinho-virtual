// ══════════════════════════════════════════════════════════
// AUDIO (Web Audio API — sons 8-bit)
// ══════════════════════════════════════════════════════════
let audioCtx = null;
function getAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function beep(freq = 440, dur = 0.15, type = 'square', vol = 0.12) {
    try {
        const ctx = getAudio(), o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(vol, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        o.start(); o.stop(ctx.currentTime + dur);
    } catch (e) { }
}
function sfxFeed() { beep(523, .08, 'square'); setTimeout(() => beep(659, .12, 'square'), 90); }
function sfxPlay() { beep(784, .07, 'square'); setTimeout(() => beep(880, .07, 'square'), 80); setTimeout(() => beep(1047, .15, 'square'), 160); }
function sfxSleep() { beep(330, .2, 'sine', .08); }
function sfxHeal() { beep(440, .08, 'sine'); setTimeout(() => beep(550, .08, 'sine'), 100); setTimeout(() => beep(660, .2, 'sine'), 200); }
function sfxEvolve() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18, 'square', .15), i * 120)); }
function sfxDead() { beep(220, .4, 'sawtooth', .15); setTimeout(() => beep(196, .5, 'sawtooth', .1), 350); }
function sfxAlert() { beep(440, .06, 'square', .08); setTimeout(() => beep(440, .06, 'square', .08), 150); }
function sfxNo() { beep(220, .15, 'square', .1); }
