// ══════════════════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════════════════
let pet = null;
let gameLoop = null;
let selectedKind = 'florinho';
const TICK_MS = 1000;

// ══════════════════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════════════════
function doAction(action) {
    if (!pet || !pet.isAlive) return;
    let result;
    if (action === 'feed') { result = pet.feed(); if (result.ok) { sfxFeed(); triggerSparkles(); addLog(`${pet.name} comeu! 🍖`); } }
    if (action === 'play') { result = pet.play(); if (result.ok) { sfxPlay(); triggerSparkles(); addLog(`${pet.name} brincou! 🎾`); } }
    if (action === 'sleep') { result = pet.sleep(); if (result.ok) { updateSleepBtn(); if (pet.isSleeping) { sfxSleep(); addLog(`${pet.name} dormiu... 💤`); } else { addLog(`${pet.name} acordou! ☀️`); } } }
    if (action === 'clean') { result = pet.clean(); if (result.ok) { sfxFeed(); addLog(`${pet.name} está limpo! 🛁`); } }
    if (action === 'heal') { result = pet.heal(); if (result.ok) { sfxHeal(); triggerSparkles(); addLog(`${pet.name} foi curado! 💊`); } }
    if (result && !result.ok) { showNotif(result.msg, ''); }
    updateZzz();
    savePet(pet);
}

// ══════════════════════════════════════════════════════════
// GAME LOOP
// ══════════════════════════════════════════════════════════
let lastTickTime = Date.now();
function startLoop() {
    if (gameLoop) clearInterval(gameLoop);
    lastTickTime = Date.now();
    gameLoop = setInterval(() => {
        if (!pet || !pet.isAlive) return;
        const now = Date.now();
        const delta = now - lastTickTime;
        lastTickTime = now;
        const events = pet.tick(delta);
        handleEvents(events);
        updateSprite();
        updateBars();
        updateMeta();
        updateSleepBtn();
        updateCooldowns();
        if (Math.round(pet.ageMinutes * 10) % 50 === 0) savePet(pet);
    }, TICK_MS);
}

// ══════════════════════════════════════════════════════════
// SELECT SCREEN
// ══════════════════════════════════════════════════════════
function buildSelectScreen() {
    const container = document.getElementById('petOptions');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(PET_TYPES).forEach(([k, info]) => {
        const div = document.createElement('div');
        div.className = 'pet-option' + (k === selectedKind ? ' selected' : '');
        div.style.setProperty('--oc', info.color);
        div.innerHTML = `${getSprite(k, 'happy') || getSprite(k, 'baby') || ''}
<div class="pet-option-name">${info.name.toUpperCase()}</div>`;
        div.addEventListener('click', () => {
            selectedKind = k;
            document.querySelectorAll('.pet-option').forEach(o => o.classList.remove('selected'));
            div.classList.add('selected');
            document.getElementById('nameInput').placeholder = info.name;
        });
        container.appendChild(div);
    });
    document.getElementById('nameInput').value = '';
    document.getElementById('nameInput').placeholder = PET_TYPES[selectedKind].name;
}

function showSelectScreen(force = false) {
    if (!force && loadPet()) { continueGame(); return; }
    buildSelectScreen();
    document.getElementById('selectOverlay').classList.remove('hidden');
}

function startGame() {
    const rawName = document.getElementById('nameInput').value.trim();
    const name = rawName || PET_TYPES[selectedKind]?.name || 'Bichinho';
    pet = new Pet({ kind: selectedKind, name });
    document.getElementById('selectOverlay').classList.add('hidden');
    document.getElementById('deathOverlay').classList.add('hidden');
    setColor(pet.kindInfo.color, pet.kindInfo.glow);
    updateSprite(); updateBars(); updateMeta(); updateSleepBtn(); updateZzz();
    if (typeof updateShopUI === 'function') updateShopUI();
    savePet(pet);
    startLoop();
    showNotif(`${name} nasceu! 🥚`, 'good');
    addLog(`${name} nasceu! 🥚`);
    sfxEvolve();
}

function continueGame() {
    pet = loadPet();
    if (!pet) { showSelectScreen(true); return; }
    document.getElementById('selectOverlay').classList.add('hidden');
    document.getElementById('deathOverlay').classList.add('hidden');
    setColor(pet.kindInfo.color, pet.kindInfo.glow);
    updateSprite(); updateBars(); updateMeta(); updateSleepBtn(); updateZzz();
    if (typeof updateShopUI === 'function') updateShopUI();
    startLoop();
    if (!pet.isAlive) onDeath();
    else {
        showNotif(`Bem-vindo de volta, ${pet.name}!`, 'good');
        addLog(`Olá de novo, ${pet.name}! 👋`);
    }
}

// ══════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════
window.addEventListener('load', () => {
    updateDayNight();
    const saved = loadPet();
    if (saved) { continueGame(); }
    else { showSelectScreen(true); }
});

window.addEventListener('beforeunload', () => { if (pet) savePet(pet); });

// ══════════════════════════════════════════════════════════
// PWA SERVICE WORKER REGISTRATION
// ══════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registrado!', reg))
            .catch(err => console.log('Erro no SW:', err));
    });
}

document.addEventListener('click', () => requestNotifPermission(), { once: true });
setInterval(updateDayNight, 60000);
