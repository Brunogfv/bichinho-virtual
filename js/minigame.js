// ══════════════════════════════════════════════════════════
// FASE 4 AVANÇADA — MINIGAME "PEGA O ITEM"
// ══════════════════════════════════════════════════════════
let miniActive = false, miniItems = [], miniScore = 0;
let miniTimer = null, miniCountdown = 0, miniAnimFrame = null;

const MINI_ITEMS = [
    { emoji: '🍎', pts: 2, good: true }, { emoji: '🍕', pts: 3, good: true },
    { emoji: '⭐', pts: 5, good: true }, { emoji: '💎', pts: 8, good: true },
    { emoji: '💩', pts: -3, good: false }, { emoji: '🌩️', pts: -2, good: false },
];

function openMiniGame() {
    if (!pet || !pet.isAlive) { showNotif('Sem bichinho!', ''); return; }
    if (pet.isSleeping) { showNotif(pet.name + ' está dormindo!', ''); return; }
    if (pet.energy < 15) { showNotif(pet.name + ' está sem energia!', 'warn'); return; }
    miniActive = true; miniScore = 0; miniItems = []; miniCountdown = 15;

    let ov = document.getElementById('miniOverlay');
    if (!ov) { ov = document.createElement('div'); ov.id = 'miniOverlay'; document.body.appendChild(ov); }
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(10,8,20,.94);backdrop-filter:blur(6px);z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:20px;';

    ov.innerHTML = `
<div style="font-family:'Press Start 2P',monospace;font-size:9px;color:#aaa;letter-spacing:1px;margin-bottom:6px;">MINIGAME</div>
<div style="font-size:13px;color:#666;font-family:monospace;margin-bottom:12px;">Toque nos itens bons! Evite os ruins!</div>
<div style="display:flex;gap:24px;margin-bottom:10px;font-family:'Press Start 2P',monospace;font-size:8px;">
  <span style="color:#f9e04b;">⭐ <span id="mScore">0</span></span>
  <span style="color:#5bc4f5;">⏱ <span id="mTimer">15</span>s</span>
</div>
<div id="mArena" style="width:320px;height:320px;max-width:92vw;background:#13131f;border:2px solid #2a2a50;border-radius:16px;position:relative;overflow:hidden;touch-action:none;cursor:crosshair;box-shadow:inset 0 0 30px rgba(0,0,0,.5);"></div>
<div style="margin-top:10px;font-size:11px;color:#333;font-family:monospace;">🍎🍕⭐💎 = pontos &nbsp;·&nbsp; 💩🌩️ = menos pontos</div>
<button onclick="closeMiniGame(true)" style="margin-top:12px;padding:8px 20px;background:rgba(255,80,80,.15);border:1px solid rgba(255,80,80,.3);border-radius:8px;color:#ff9999;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:7px;">SAIR</button>
`;

    const arena = document.getElementById('mArena');
    arena.addEventListener('click', onMiniClick);
    arena.addEventListener('touchstart', onMiniTouch, { passive: true });

    miniTimer = setInterval(() => {
        miniCountdown--;
        const el = document.getElementById('mTimer');
        if (el) el.textContent = miniCountdown;
        if (miniCountdown <= 0) { clearInterval(miniTimer); endMiniGame(); }
    }, 1000);
    spawnMiniItems();
}

function spawnMiniItems() {
    if (!miniActive) return;
    const arena = document.getElementById('mArena');
    if (!arena) return;
    const W = arena.offsetWidth, H = arena.offsetHeight;
    const tmpl = MINI_ITEMS[Math.floor(Math.random() * MINI_ITEMS.length)];
    const item = {
        ...tmpl, id: 'mi' + Date.now() + Math.random(),
        x: 20 + Math.random() * (W - 60), y: 20 + Math.random() * (H - 60),
        vx: (Math.random() - .5) * 1.6, vy: (Math.random() - .5) * 1.6,
        life: 2800 + Math.random() * 2000
    };
    miniItems.push(item);
    const el = document.createElement('div');
    el.id = item.id; el.dataset.pts = item.pts;
    el.style.cssText = `position:absolute;font-size:26px;left:${item.x}px;top:${item.y}px;cursor:pointer;user-select:none;transition:transform .08s;filter:${item.good ? 'drop-shadow(0 0 5px rgba(255,220,100,.6))' : 'drop-shadow(0 0 5px rgba(255,60,60,.6))'};`;
    el.textContent = item.emoji;
    arena.appendChild(el);
    setTimeout(() => { el.remove(); miniItems = miniItems.filter(i => i.id !== item.id); }, item.life);
    if (!miniAnimFrame) animateMiniItems();
    if (miniActive) setTimeout(spawnMiniItems, 550 + Math.random() * 650);
}

function animateMiniItems() {
    if (!miniActive) { miniAnimFrame = null; return; }
    const arena = document.getElementById('mArena');
    if (!arena) { miniAnimFrame = null; return; }
    const W = arena.offsetWidth, H = arena.offsetHeight;
    miniItems.forEach(item => {
        item.x += item.vx; item.y += item.vy;
        if (item.x < 5 || item.x > W - 38) item.vx *= -1;
        if (item.y < 5 || item.y > H - 38) item.vy *= -1;
        const el = document.getElementById(item.id);
        if (el) { el.style.left = item.x + 'px'; el.style.top = item.y + 'px'; }
    });
    miniAnimFrame = requestAnimationFrame(animateMiniItems);
}

function onMiniClick(e) {
    const el = e.target.closest('[data-pts]');
    if (el) hitMiniItem(el);
}
function onMiniTouch(e) {
    const t = e.touches[0];
    const els = document.elementsFromPoint(t.clientX, t.clientY);
    const el = els.find(x => x.dataset && x.dataset.pts !== undefined);
    if (el) hitMiniItem(el);
}
function hitMiniItem(el) {
    const pts = parseInt(el.dataset.pts) || 0;
    miniScore += pts;
    const s = document.getElementById('mScore');
    if (s) s.textContent = Math.max(0, miniScore);
    const burst = document.createElement('div');
    burst.style.cssText = `position:absolute;left:${el.style.left};top:${el.style.top};font-family:'Press Start 2P',monospace;font-size:10px;pointer-events:none;color:${pts > 0 ? '#f9e04b' : '#ef4444'};z-index:20;animation:burstUp .6s ease forwards;`;
    burst.textContent = (pts > 0 ? '+' : '') + pts;
    el.parentElement && el.parentElement.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
    if (pts > 0) { beep(660, .07, 'square', .12); if (pts >= 5) setTimeout(() => beep(880, .1, 'square', .12), 80); }
    else beep(200, .15, 'sawtooth', .1);
    el.remove();
    miniItems = miniItems.filter(i => i.id !== el.id);
}

function endMiniGame() {
    miniActive = false;
    if (miniAnimFrame) { cancelAnimationFrame(miniAnimFrame); miniAnimFrame = null; }
    const ov = document.getElementById('miniOverlay');
    if (!ov) return;
    const gainHappy = Math.min(30, Math.max(0, miniScore * 2));
    const costEnergy = Math.min(20, 8 + Math.max(0, miniScore));
    const gainMoney = Math.max(0, Math.floor(miniScore * 1.5));
    if (pet && pet.isAlive) {
        pet.happiness = Math.min(100, pet.happiness + gainHappy);
        pet.energy = Math.max(0, pet.energy - costEnergy);
        pet.hunger = Math.min(100, pet.hunger + 6);
        pet.money += gainMoney;
        pet.isPlaying = false; savePet(pet); sfxPlay(); triggerSparkles();
    }
    const s = Math.max(0, miniScore);
    const grade = s >= 20 ? 'S' : s >= 12 ? 'A' : s >= 6 ? 'B' : s >= 0 ? 'C' : 'D';
    const gc = { S: '#f9e04b', A: '#6bcb77', B: '#5bc4f5', C: '#b0c8e8', D: '#ef4444' }[grade];
    ov.innerHTML = `
<div style="font-family:'Press Start 2P',monospace;font-size:9px;color:#aaa;margin-bottom:16px;">RESULTADO</div>
<div style="font-family:'Press Start 2P',monospace;font-size:52px;color:${gc};text-shadow:0 0 24px ${gc};margin-bottom:10px;">${grade}</div>
<div style="font-family:'Press Start 2P',monospace;font-size:10px;color:#f9e04b;margin-bottom:6px;">⭐ ${s} pontos &nbsp;💰 +${gainMoney}</div>
<div style="font-size:13px;color:#666;margin-bottom:22px;font-family:monospace;">+${gainHappy} felicidade · -${costEnergy} energia</div>
<button onclick="closeMiniGame(false)" style="padding:10px 26px;background:linear-gradient(135deg,#ff8c42,#ff6b1a);border:none;border-radius:12px;color:#fff;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:8px;letter-spacing:1px;">CONTINUAR</button>
<button onclick="openMiniGame()" style="margin-top:8px;padding:8px 18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);border-radius:10px;color:#888;cursor:pointer;font-family:'Press Start 2P',monospace;font-size:7px;">JOGAR DE NOVO</button>
`;
}

function closeMiniGame(abrupt = false) {
    miniActive = false; clearInterval(miniTimer);
    if (miniAnimFrame) { cancelAnimationFrame(miniAnimFrame); miniAnimFrame = null; }
    const ov = document.getElementById('miniOverlay');
    if (ov) ov.style.display = 'none';
    if (abrupt && pet) pet.isPlaying = false;
}

// Inject minigame button
(function () {
    const grid = document.querySelector('.btn-grid');
    if (!grid) return;
    const last = grid.lastElementChild;
    const btn = document.createElement('button');
    btn.className = 'btn-action'; btn.onclick = openMiniGame;
    btn.innerHTML = '<span class="btn-icon">🎮</span><span class="btn-label">MINIGAME</span>';
    grid.insertBefore(btn, last);
})();
