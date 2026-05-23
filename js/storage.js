// ══════════════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════════════
const SAVE_KEY = 'bichinho_v1', REC_KEY = 'bichinho_recs';
function savePet(p) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(p.toJSON())); } catch (e) { } }
function loadPet() { try { const r = localStorage.getItem(SAVE_KEY); return r ? Pet.fromJSON(JSON.parse(r)) : null; } catch (e) { return null; } }
function deleteSave() { localStorage.removeItem(SAVE_KEY); }
function saveRecord(p) { try { const rs = loadRecords(); rs.push({ name: p.name, kind: p.kind, age: Math.round(p.ageMinutes), stage: p.stageLabel, ts: Date.now(), stats: p.stats }); rs.sort((a, b) => b.age - a.age); rs.splice(10); localStorage.setItem(REC_KEY, JSON.stringify(rs)); } catch (e) { } }
function loadRecords() { try { return JSON.parse(localStorage.getItem(REC_KEY) || '[]'); } catch (e) { return []; } }
