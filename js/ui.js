// ══════════════════════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════════════════════
function setColor(color, glow) {
    document.documentElement.style.setProperty('--pet-color', color);
    document.documentElement.style.setProperty('--pet-glow', glow);
    const screenGlow = document.getElementById('screenGlow');
    if (screenGlow) {
        screenGlow.style.background = `radial-gradient(ellipse at 50% 10%, ${glow} 0%, transparent 70%)`;
    }
}

function updateSprite() {
    const el = document.getElementById('petSprite');
    if (!pet || !el) { if (el) el.innerHTML = ''; return; }
    const state = pet.emotionalState;
    let spriteKey = state;
    if (state === 'happy' || state === 'happy2') {
        spriteKey = (pet.stage === 'egg' || pet.stage === 'baby' || pet.stage === 'old') ? pet.stage : state;
    }
    el.innerHTML = getSprite(pet.kind, spriteKey) || getSprite(pet.kind, pet.stage) || '';

    el.className = 'pet-sprite';
    const animMap = {
        happy: 'anim-bounce', happy2: 'anim-bounce', eating: 'anim-bounce',
        playing: 'anim-wiggle', sleeping: 'anim-sway', sick: 'anim-pulse',
        hungry: 'anim-shake', angry: 'anim-wiggle', dead: ''
    };
    const anim = animMap[state];
    if (anim) el.classList.add(anim);

    manageEggAnim();
}

function updateBars() {
    if (!pet) return;
    const set = (id, val, color) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.width = val + '%';
            el.style.background = color;
        }
    };
    const hc = pet.hunger > 70 ? '#ef4444' : pet.hunger > 40 ? '#f97316' : '#6bcb77';
    set('barHunger', 100 - pet.hunger, hc);
    const valHunger = document.getElementById('valHunger');
    if (valHunger) valHunger.textContent = Math.round(100 - pet.hunger);

    const hpC = pet.happiness < 30 ? '#ef4444' : pet.happiness < 60 ? '#f97316' : '#f48fb1';
    set('barHappy', pet.happiness, hpC);
    const valHappy = document.getElementById('valHappy');
    if (valHappy) valHappy.textContent = Math.round(pet.happiness);

    const enC = pet.energy < 20 ? '#555577' : pet.energy < 50 ? '#b0c8e8' : '#5bc4f5';
    set('barEnergy', pet.energy, enC);
    const valEnergy = document.getElementById('valEnergy');
    if (valEnergy) valEnergy.textContent = Math.round(pet.energy);

    const hyC = pet.hygiene < 30 ? '#ef4444' : pet.hygiene < 60 ? '#f97316' : '#b0c8e8';
    set('barHygiene', pet.hygiene, hyC);
    const valHygiene = document.getElementById('valHygiene');
    if (valHygiene) valHygiene.textContent = Math.round(pet.hygiene);

    const heC = pet.health < 30 ? '#ef4444' : pet.health < 60 ? '#f97316' : '#6bcb77';
    set('barHealth', pet.health, heC);
    const valHealth = document.getElementById('valHealth');
    if (valHealth) valHealth.textContent = Math.round(pet.health);
}

function updateMeta() {
    if (!pet) return;
    const m = Math.round(pet.ageMinutes);
    const txt = m < 60 ? m + 'min' : Math.floor(m / 60) + 'h' + ('0' + Math.round(m % 60)).slice(-2) + 'm';
    const ageVal = document.getElementById('ageVal');
    if (ageVal) ageVal.textContent = txt;
    const petName = document.getElementById('petName');
    if (petName) {
        petName.textContent = pet.name.toUpperCase();
        petName.style.color = pet.kindInfo?.color || '#6bcb77';
    }
    const petStageBadge = document.getElementById('petStageBadge');
    if (petStageBadge) petStageBadge.textContent = pet.stageLabel + ' · ' + (pet.kindInfo?.type || '');
}

function updateSleepBtn() {
    const icon = document.getElementById('sleepIcon');
    const label = document.getElementById('sleepLabel');
    if (!icon || !label) return;
    if (pet?.isSleeping) { icon.textContent = '☀️'; label.textContent = 'ACORDAR'; }
    else { icon.textContent = '💤'; label.textContent = 'DORMIR'; }
}

function updateCooldowns() {
    if (!pet) return;
    ['feed', 'play', 'clean', 'heal'].forEach(k => {
        const el = document.getElementById('cd' + k.charAt(0).toUpperCase() + k.slice(1));
        if (!el) return;
        const left = pet.cdLeft(k);
        el.style.width = left > 0 ? ((left / pet._cdTime) * 100) + '%' : '0%';
    });
}

let lastNotifTime = 0;
function showNotif(msg, cls = '', dontSpam = false) {
    if (dontSpam) {
        const now = Date.now();
        if (now - lastNotifTime < 3000) return;
        lastNotifTime = now;
    }
    const area = document.getElementById('notifArea');
    if (!area) return;
    const el = document.createElement('div');
    el.className = 'notif ' + (cls || '');
    el.textContent = msg;
    area.appendChild(el);
    setTimeout(() => el.remove(), 2800);
    if (cls === 'danger' || cls === 'warn') sfxAlert();
}

function triggerSparkles() {
    const el = document.getElementById('sparkles');
    if (!el) return;
    el.innerHTML = '';
    el.classList.add('active');
    const emojis = ['✨', '⭐', '🌟', '💫', '🎉'];
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        s.style.left = (15 + Math.random() * 70) + '%';
        s.style.top = (10 + Math.random() * 70) + '%';
        s.style.animationDelay = (Math.random() * 0.4) + 's';
        el.appendChild(s);
    }
    setTimeout(() => { el.classList.remove('active'); el.innerHTML = ''; }, 1200);
    spawnHeartParticles();
}

function handleEvents(events) {
    events.forEach(ev => {
        if (ev.type === 'death') { onDeath(); return; }
        if (ev.type === 'evolve') { showNotif(ev.msg, 'evolve'); sfxEvolve(); triggerSparkles(); addLog(ev.msg); return; }
        if (ev.type === 'wakeup') { showNotif(ev.msg, 'good'); addLog(ev.msg); return; }
        if (ev.type === 'sleep') { showNotif(ev.msg, 'warn'); sfxSleep(); addLog(ev.msg); return; }
        if (ev.type === 'alert') showNotif(ev.msg, ev.cls || 'warn', true);
    });
}

function onDeath() {
    if (typeof gameLoop !== 'undefined' && gameLoop) { clearInterval(gameLoop); window.gameLoop = null; }
    saveRecord(pet);
    deleteSave();
    sfxDead();
    const min = Math.round(pet.ageMinutes);
    const ageStr = min < 60 ? `${min} minutos` : `${Math.floor(min / 60)}h ${Math.round(min % 60)}min`;
    const deathTitle = document.getElementById('deathTitle');
    if (deathTitle) deathTitle.textContent = pet.name.toUpperCase() + ' NOS DEIXOU...';
    const deathAge = document.getElementById('deathAge');
    if (deathAge) deathAge.textContent = `Viveu por ${ageStr} · ${pet.stageLabel}`;
    const deathSprite = document.getElementById('deathSprite');
    if (deathSprite) deathSprite.innerHTML = getSprite(pet.kind, 'dead') || '';
    const deathOverlay = document.getElementById('deathOverlay');
    if (deathOverlay) deathOverlay.classList.remove('hidden');
    updateSprite();
}

function updateZzz() {
    const z = document.getElementById('zzzEl');
    if (z) z.style.display = pet?.isSleeping ? 'block' : 'none';
}

// ══════════════════════════════════════════════════════════
// EVENT LOG
// ══════════════════════════════════════════════════════════
function addLog(msg) {
    let area = document.getElementById('eventLog');
    if (!area) {
        area = document.createElement('div');
        area.id = 'eventLog';
        area.className = 'event-log';
        document.getElementById('screen').appendChild(area);
    }
    const el = document.createElement('div');
    el.className = 'log-entry';
    el.textContent = `> ${msg}`;
    area.prepend(el);
    if (area.children.length > 4) area.lastElementChild.remove();
}

// ══════════════════════════════════════════════════════════
// SHOP UI
// ══════════════════════════════════════════════════════════
function openShop() {
    if (!pet || !pet.isAlive) return;
    const ov = document.getElementById('shopOverlay');
    if (!ov) return;
    updateShopUI();
    ov.classList.remove('hidden');
}

function closeShop() {
    const ov = document.getElementById('shopOverlay');
    if (ov) ov.classList.add('hidden');
}

function updateShopUI() {
    const list = document.getElementById('shopList');
    const moneyEl = document.getElementById('shopMoney');
    if (!list || !moneyEl) return;

    moneyEl.textContent = `💰 ${Math.floor(pet.money)}`;

    list.innerHTML = Object.entries(SHOP_ITEMS).map(([key, item]) => {
        const canBuy = pet.money >= item.price;
        const count = pet.inventory[key] || 0;
        return `
            <div class="shop-item">
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-desc">${item.desc}</span>
                    <div style="font-size:10px;margin-top:4px;color:var(--accent)">
                        Possui: ${count}
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">
                    <span style="font-family:'Press Start 2P',monospace;font-size:7px;color:#f9e04b">$${item.price}</span>
                    <button class="btn-buy" onclick="handleBuy('${key}')" ${!canBuy ? 'disabled' : ''}>COMPRAR</button>
                    ${count > 0 ? `<button class="btn-buy" style="background:#6bcb77;box-shadow:0 4px 0 #4da85a" onclick="handleUse('${key}')">USAR</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function handleBuy(key) {
    const res = pet.buyItem(key);
    if (res.ok) {
        sfxFeed();
        addLog(res.msg);
        updateShopUI();
        savePet(pet);
    } else {
        sfxNo();
        showNotif(res.msg);
    }
}

function handleUse(key) {
    const res = pet.useItem(key);
    if (res.ok) {
        sfxHeal();
        triggerSparkles();
        addLog(res.msg);
        updateShopUI();
        updateBars();
        savePet(pet);
    } else {
        sfxNo();
        showNotif(res.msg);
    }
}

function showRecords() {
    const records = loadRecords();
    const list = document.getElementById('recordsList');
    if (!list) return;
    if (!records.length) {
        list.innerHTML = '<div class="records-empty">Nenhum recorde ainda.<br>Cuide bem do seu bichinho! 🐾</div>';
    } else {
        list.innerHTML = records.map((r, i) => {
            const m = r.age, txt = m < 60 ? m + 'min' : Math.floor(m / 60) + 'h ' + Math.round(m % 60) + 'm';
            const info = PET_TYPES[r.kind] || PET_TYPES.florinho;
            const medal = ['🥇', '🥈', '🥉'][i] || ('#' + (i + 1));
            const st = r.stats || {};
            return `<div class="record-row" style="flex-direction:column;align-items:flex-start;gap:4px;">
<div style="display:flex;align-items:center;gap:8px;width:100%;">
  <span class="record-rank">${medal}</span>
  <span style="font-size:18px">${info.icon}</span>
  <div class="record-info" style="flex:1">
    <div class="record-name" style="color:${info.color}">${r.name}
      <span style="color:var(--muted);font-size:10px;font-weight:400">(${r.stage})</span></div>
    <div class="record-age">Viveu ${txt} · ${info.name}</div>
  </div>
</div>
${st.feeds || st.plays ? `<div style="font-size:10px;color:#777;padding-left:52px;">🍖${st.feeds || 0} &nbsp;🎾${st.plays || 0} &nbsp;💊${st.heals || 0} &nbsp;💤${st.sleeps || 0}</div>` : ''}
</div>`;
        }).join('');
    }
    const recordsOverlay = document.getElementById('recordsOverlay');
    if (recordsOverlay) recordsOverlay.classList.remove('hidden');
}

function closeRecords() {
    const recordsOverlay = document.getElementById('recordsOverlay');
    if (recordsOverlay) recordsOverlay.classList.add('hidden');
}

function spawnHeartParticles() {
    const rect = document.getElementById('petSprite')?.getBoundingClientRect() || { left: window.innerWidth / 2, top: 200, width: 60, height: 60 };
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const emojis = ['❤️', '🌟', '✨', '💖', '⭐', '🎉'];
    for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        const angle = (Math.PI * 2 / 7) * i + Math.random() * .5;
        const dist = 50 + Math.random() * 55;
        const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist - 35;
        p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${13 + Math.random() * 10}px;pointer-events:none;z-index:999;transition:transform ${.55 + Math.random() * .4}s ease,opacity .5s ease ${.35 + Math.random() * .3}s;`;
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        document.body.appendChild(p);
        requestAnimationFrame(() => { p.style.transform = `translate(${dx}px,${dy}px) scale(1.2)`; p.style.opacity = '0'; });
        setTimeout(() => p.remove(), 1100);
    }
}

function updateDayNight() {
    const h = new Date().getHours(), screen = document.getElementById('screen');
    if (!screen) return;
    if (h >= 21 || h < 6) screen.style.background = '#0d0d20';
    else if (h >= 18) screen.style.background = '#1a120a';
    else screen.style.background = '#1a1a2e';
}

let _eggInterval = null;
function manageEggAnim() {
    if (!pet || pet.stage !== 'egg') { clearInterval(_eggInterval); _eggInterval = null; return; }
    if (_eggInterval) return;
    _eggInterval = setInterval(() => {
        if (!pet || pet.stage !== 'egg') { clearInterval(_eggInterval); _eggInterval = null; return; }
        const sp = document.getElementById('petSprite');
        if (!sp) return;
        sp.classList.add('anim-shake');
        setTimeout(() => sp.classList.remove('anim-shake'), 500);
    }, 4000);
}

let notifPerm = 'default', lastBNotif = 0;
async function requestNotifPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') { notifPerm = 'granted'; return; }
    if (Notification.permission !== 'denied') notifPerm = await Notification.requestPermission();
}
function sendBrowserNotif(title, body) {
    if (notifPerm !== 'granted' || document.visibilityState === 'visible') return;
    if (Date.now() - lastBNotif < 5 * 60 * 1000) return;
    lastBNotif = Date.now();
    try { new Notification(title, { body }); } catch (e) { }
}

setInterval(() => {
    if (!pet || !pet.isAlive || document.visibilityState === 'visible') return;
    if (pet.hunger > 75) sendBrowserNotif(pet.name + ' está com fome! 🍖', 'Volte e alimente seu bichinho!');
    else if (pet.health < 30) sendBrowserNotif(pet.name + ' está doente! 💊', 'Ele precisa de remédio urgente!');
    else if (pet.happiness < 20) sendBrowserNotif(pet.name + ' está triste! 😢', 'Brinque com seu bichinho!');
}, 3 * 60 * 1000);

// Health pulse
setInterval(() => {
    const b = document.getElementById('barHealth');
    if (!b || !pet) return;
    pet.health < 30 ? b.classList.add('critical') : b.classList.remove('critical');
}, 2000);
