// ══════════════════════════════════════════════════════════
// PET CLASS & LOGIC
// ══════════════════════════════════════════════════════════
const STAGE_THRESHOLDS = { egg: 0, baby: 0.08, adult: 0.5, old: 2.0 };
const STAGE_LABELS = { egg: 'Ovo', baby: 'Filhote', adult: 'Adulto', old: 'Velhinho' };
const DECAY = { hunger: 1.2, happiness: 0.8, energy: 0.6, hygiene: 0.4 };

class Pet {
    constructor(cfg = {}) {
        this.id = cfg.id || Date.now().toString();
        this.kind = cfg.kind || 'florinho';
        this.name = cfg.name || PET_TYPES[this.kind]?.name || 'Bichinho';
        this.stage = cfg.stage || 'egg';
        this.isAlive = cfg.isAlive !== undefined ? cfg.isAlive : true;
        this.isSleeping = cfg.isSleeping || false;
        this.isEating = false;
        this.isPlaying = false;
        this.hunger = cfg.hunger ?? 20;
        this.happiness = cfg.happiness ?? 80;
        this.energy = cfg.energy ?? 80;
        this.hygiene = cfg.hygiene ?? 80;
        this.health = cfg.health ?? 100;
        this.ageMinutes = cfg.ageMinutes || 0;
        this.bornAt = cfg.bornAt || Date.now();
        this.lastTick = cfg.lastTick || Date.now();
        this.stats = cfg.stats || { feeds: 0, plays: 0, sleeps: 0, heals: 0 };
        this.money = cfg.money ?? 50;
        this.inventory = cfg.inventory || {};
        this._cds = {};
        this._cdTime = 4000;
    }

    get ageHours() { return this.ageMinutes / 60; }
    get kindInfo() { return PET_TYPES[this.kind] || PET_TYPES.florinho; }
    get stageLabel() { return STAGE_LABELS[this.stage] || this.stage; }

    get emotionalState() {
        if (!this.isAlive) return 'dead';
        if (this.isSleeping) return 'sleeping';
        if (this.isEating) return 'eating';
        if (this.isPlaying) return 'playing';
        if (this.health < 30) return 'sick';
        if (this.hunger > 70) return 'hungry';
        if (this.happiness > 75 && this.health > 75) return 'happy2';
        if (this.happiness < 30) return 'angry';
        return 'happy';
    }

    tick(deltaMs) {
        if (!this.isAlive) return [];
        const dm = deltaMs / 60000;
        this.ageMinutes += dm;
        const events = [];

        if (this.isSleeping) {
            this.energy = Math.min(100, this.energy + dm * 8);
            this.happiness = Math.min(100, this.happiness + dm * 1);
            if (this.energy >= 100) { this.isSleeping = false; events.push({ type: 'wakeup', msg: `${this.name} acordou! 🌅`, cls: 'good' }); }
            this._checkStage(events);
            return events;
        }

        this.hunger = Math.min(100, this.hunger + DECAY.hunger * dm);
        this.happiness = Math.max(0, this.happiness - DECAY.happiness * dm);
        this.energy = Math.max(0, this.energy - DECAY.energy * dm);
        this.hygiene = Math.max(0, this.hygiene - DECAY.hygiene * dm);

        if (this.hunger > 80 || this.hygiene < 20) this.health = Math.max(0, this.health - dm * 1.5);
        else if (this.hunger < 40 && this.hygiene > 50 && this.health < 100) this.health = Math.min(100, this.health + dm * .4);
        if (this.hunger > 60) this.happiness = Math.max(0, this.happiness - dm * .5);
        if (this.health < 50) this.happiness = Math.max(0, this.happiness - dm * .3);

        if (this.energy <= 0) { this.isSleeping = true; events.push({ type: 'sleep', msg: `${this.name} caiu no sono! 😴`, cls: 'warn' }); }
        if (this.health <= 0) { this.isAlive = false; events.push({ type: 'death', msg: '' }); return events; }

        if (this.hunger > 75) events.push({ type: 'alert', msg: `${this.name} está com MUITA fome! 🍖`, cls: 'danger' });
        else if (this.hunger > 55) events.push({ type: 'alert', msg: `${this.name} está com fome...`, cls: 'warn' });
        if (this.happiness < 20) events.push({ type: 'alert', msg: `${this.name} está muito triste! 😢`, cls: 'warn' });
        if (this.energy < 20 && !this.isSleeping) events.push({ type: 'alert', msg: `${this.name} está exausto! ⚡`, cls: 'warn' });
        if (this.health < 40) events.push({ type: 'alert', msg: `${this.name} precisa de remédio! 💊`, cls: 'danger' });

        this._checkStage(events);
        return events;
    }

    _checkStage(events) {
        const h = this.ageHours;
        const ns = h >= STAGE_THRESHOLDS.old ? 'old' : h >= STAGE_THRESHOLDS.adult ? 'adult' : h >= STAGE_THRESHOLDS.baby ? 'baby' : 'egg';
        if (ns !== this.stage) {
            this.stage = ns;
            events.push({ type: 'evolve', msg: `${this.name} evoluiu para ${STAGE_LABELS[ns]}! ✨`, cls: 'evolve' });
        }
    }

    _canAct(k) { return (Date.now() - (this._cds[k] || 0)) >= this._cdTime; }
    _cd(k) { this._cds[k] = Date.now(); }
    cdLeft(k) { return Math.max(0, this._cdTime - (Date.now() - (this._cds[k] || 0))); }

    feed() { if (!this._canAct('feed')) return { ok: false, msg: 'Aguarde...' }; if (!this.isAlive || this.isSleeping) return { ok: false, msg: this.isSleeping ? `${this.name} está dormindo!` : '❌' }; if (this.hunger <= 5) return { ok: false, msg: `${this.name} já está satisfeito!` }; this.hunger = Math.max(0, this.hunger - 30); this.happiness = Math.min(100, this.happiness + 10); this.isEating = true; this.stats.feeds++; setTimeout(() => { this.isEating = false; }, 2000); this._cd('feed'); return { ok: true, msg: `${this.name} comeu! 🍖` }; }
    play() { if (!this._canAct('play')) return { ok: false, msg: 'Aguarde...' }; if (!this.isAlive || this.isSleeping) return { ok: false, msg: this.isSleeping ? `${this.name} está dormindo!` : '❌' }; if (this.energy < 15) return { ok: false, msg: `${this.name} está sem energia!` }; this.happiness = Math.min(100, this.happiness + 20); this.energy = Math.max(0, this.energy - 12); this.hunger = Math.min(100, this.hunger + 5); this.isPlaying = true; this.stats.plays++; setTimeout(() => { this.isPlaying = false; }, 2000); this._cd('play'); return { ok: true, msg: `${this.name} brincou! 🎾` }; }
    sleep() { if (!this.isAlive) return { ok: false }; if (this.isSleeping) { this.isSleeping = false; return { ok: true, msg: `${this.name} acordou! 🌅` }; } if (this.energy >= 90) return { ok: false, msg: `${this.name} não está com sono!` }; this.isSleeping = true; this.stats.sleeps++; return { ok: true, msg: `${this.name} foi dormir! 💤` }; }
    clean() { if (!this._canAct('clean')) return { ok: false, msg: 'Aguarde...' }; if (!this.isAlive) return { ok: false }; this.hygiene = Math.min(100, this.hygiene + 35); this.happiness = Math.min(100, this.happiness + 5); this._cd('clean'); return { ok: true, msg: `${this.name} está limpinho! 🛁` }; }
    heal() { if (!this._canAct('heal')) return { ok: false, msg: 'Aguarde...' }; if (!this.isAlive) return { ok: false }; if (this.health >= 90) return { ok: false, msg: `${this.name} está saudável!` }; this.health = Math.min(100, this.health + 30); this.happiness = Math.min(100, this.happiness + 5); this.stats.heals++; this._cd('heal'); return { ok: true, msg: `${this.name} tomou o remédio! 💊` }; }

    buyItem(itemKey) {
        const item = SHOP_ITEMS[itemKey];
        if (!item) return { ok: false, msg: 'Item inválido!' };
        if (this.money < item.price) return { ok: false, msg: 'Dinheiro insuficiente!' };
        this.money -= item.price;
        this.inventory[itemKey] = (this.inventory[itemKey] || 0) + 1;
        return { ok: true, msg: `Comprou ${item.name}! ${item.icon}` };
    }

    useItem(itemKey) {
        if (!this.inventory[itemKey]) return { ok: false, msg: 'Você não tem este item!' };
        const item = SHOP_ITEMS[itemKey];
        const effect = item.effect;
        if (effect.hunger !== undefined) this.hunger = Math.max(0, this.hunger + effect.hunger);
        if (effect.energy !== undefined) this.energy = Math.min(100, this.energy + effect.energy);
        if (effect.health !== undefined) this.health = Math.min(100, this.health + effect.health);
        if (effect.happiness !== undefined) this.happiness = Math.min(100, this.happiness + effect.happiness);
        this.inventory[itemKey]--;
        if (this.inventory[itemKey] <= 0) delete this.inventory[itemKey];
        return { ok: true, msg: `Usou ${item.name}! ✨` };
    }

    toJSON() { return { id: this.id, kind: this.kind, name: this.name, stage: this.stage, isAlive: this.isAlive, isSleeping: this.isSleeping, hunger: this.hunger, happiness: this.happiness, energy: this.energy, hygiene: this.hygiene, health: this.health, ageMinutes: this.ageMinutes, bornAt: this.bornAt, lastTick: Date.now(), stats: this.stats, money: this.money, inventory: this.inventory }; }

    static fromJSON(d) {
        const p = new Pet(d);
        const off = Math.min(Date.now() - (d.lastTick || Date.now()), 4 * 60 * 60 * 1000);
        if (off > 5000 && p.isAlive) p.tick(off);
        return p;
    }
}
