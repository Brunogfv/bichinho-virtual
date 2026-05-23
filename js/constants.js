// ══════════════════════════════════════════════════════════
// PET TYPES CONFIG
// ══════════════════════════════════════════════════════════
const PET_TYPES = {
    florinho: { name: 'Florinho', type: 'Planta', color: '#6bcb77', glow: 'rgba(107,203,119,.25)', icon: '🌿' },
    gotinho: { name: 'Gotinho', type: 'Água', color: '#5bc4f5', glow: 'rgba(91,196,245,.25)', icon: '💧' },
    foguinho: { name: 'Foguinho', type: 'Fogo', color: '#ff8c42', glow: 'rgba(255,140,66,.25)', icon: '🔥' },
    nuvinha: { name: 'Nuvinha', type: 'Ar', color: '#b0c8e8', glow: 'rgba(176,200,232,.25)', icon: '☁️' },
    coelhop: { name: 'Coelhop', type: 'Mágico', color: '#f48fb1', glow: 'rgba(244,143,177,.25)', icon: '💖' },
};

// ══════════════════════════════════════════════════════════
// SHOP ITEMS CONFIG
// ══════════════════════════════════════════════════════════
const SHOP_ITEMS = {
    apple_gold: { name: 'Maçã de Ouro', price: 50, icon: '🍎', desc: 'Recupera MUITA fome.', effect: { hunger: -50 } },
    potion_energy: { name: 'Super Poção', price: 80, icon: '🧪', desc: 'Enche a energia instantaneamente.', effect: { energy: 100 } },
    medicine_pro: { name: 'Remédio Pro', price: 120, icon: '💉', desc: 'Cura completamente o pet.', effect: { health: 100 } },
    toy_fancy: { name: 'Brinquedo Caro', price: 150, icon: '🧸', desc: 'Muita felicidade e diversão!', effect: { happiness: 60 } }
};

const PAL = {
    florinho: { G: '#6bcb77', g: '#4da85a', D: '#3a8040', d: '#2d6b33', L: '#a8e6b3', l: '#c8f0ce', B: '#1a1a2e', w: '#ffffff', Y: '#f9e04b', S: '#c8a882', s: '#a07850', R: '#e05050', r: '#f08080', X: '#778866', x: '#556644' },
    gotinho: { A: '#5bc4f5', a: '#3aaee0', D: '#1a88c0', d: '#1060a0', L: '#a8dff8', l: '#d0f0ff', B: '#1a1a2e', w: '#ffffff', S: '#c8d8f0', s: '#8ab0d8', X: '#5577aa', x: '#1a1a2e', G: '#888888' },
    foguinho: { F: '#ff8c42', f: '#e85c20', D: '#cc3300', d: '#aa2200', Y: '#f9e04b', y: '#f0c030', L: '#ffcc88', l: '#1a1a2e', B: '#1a1a2e', w: '#ffffff', X: '#555555', G: '#888877', g: '#555544' },
    nuvinha: { C: '#ddeeff', c: '#b0c8e8', D: '#8aaac8', d: '#607890', L: '#f0f8ff', l: '#e0f0ff', B: '#1a1a2e', w: '#ffffff', S: '#888899', X: '#555577', R: '#8899cc', r: '#6677aa', G: '#888888' },
    coelhop: { P: '#f8bbd0', p: '#f48fb1', K: '#e91e8c', k: '#c2185b', L: '#fce4ec', l: '#1a1a2e', B: '#1a1a2e', w: '#ffffff', Y: '#f9e04b', N: '#ffd6e0', M: '#ce93d8', m: '#ab47bc', X: '#c0a0b0', x: '#1a1a2e', R: '#cc2222' },
};

// ══════════════════════════════════════════════════════════
// PIXEL ART BUILDER
// ══════════════════════════════════════════════════════════
function buildSVG(pixels, palette, cell = 5) {
    const rows = pixels.trim().split('\n').map(r => r.trim());
    const h = rows.length, w = Math.max(...rows.map(r => r.length));
    let rects = '';
    rows.forEach((row, y) => {
        [...row].forEach((c, x) => {
            if (c !== '.' && palette[c]) rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${palette[c]}"/>`;
        });
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w * cell} ${h * cell}" width="${w * cell}" height="${h * cell}" style="image-rendering:pixelated">${rects}</svg>`;
}

const SPRITES = {
    florinho: {
        egg: () => buildSVG('..SSS..\n.SSSsS.\nSSSssSS\nSSSssSS\nSSSssGS\nSSSsGGS\n.SSGGG.\n..SSS..', { ...PAL.florinho, S: '#d4b896', s: '#b89a72' }),
        baby: () => buildSVG('..GGG..\n.GGGGG.\nGGBGBGG\nGGBGBGG\nGGGGGGG\n.GGdGG.\n.GGGGG.\n..GGG..', { ...PAL.florinho, B: '#1a1a2e' }),
        adult: () => buildSVG('.dGd.dG\n..GGGGG\n.GGGGG.\nGGGGGGG\nGGBGBGG\nGGBGBGG\nGGGGGGG\n.GGdGG.\n.GGGGG.\n..GGG..', { ...PAL.florinho, B: '#1a1a2e' }),
        old: () => buildSVG('..GgG..\n.GgGgG.\nGGwwwGG\nGGBGBGG\nGGBGBGG\nGGGGGGG\n.GGwGG.\n.GSSsGG\n..GSS..', { ...PAL.florinho, B: '#1a1a2e' }),
        happy: () => buildSVG('..dGd..\n.GGGGl.\nGGGGGGG\nGGwGwGG\nGG.G.GG\nGGGGGGG\n.GRGRG.\n.GGGGG.\n..GGG..', PAL.florinho),
        hungry: () => buildSVG('..dGd..\n.GGGGG.\nGGGGGGl\nGGXGXGG\nGG.G.GG\nGGGGGGG\n.GG_GG.\n.GGGGG.\n..GGG..', { ...PAL.florinho, X: '#555577', _: '#1a1a2e' }),
        sleeping: () => buildSVG('..dGd..\n.GGGGl.\nGGGGGGG\nGGgGgGG\nGGGGGGG\nGGGGGGG\n.GG~GG.\n.GGGGG.\n..GGG..', { ...PAL.florinho, g: '#4da85a', '~': '#8080aa' }),
        sick: () => buildSVG('..dGd..\n.GGGGG.\nGGGGGGl\nGGXGXGG\nGG~G~GG\nGGrGrGG\n.GGrGG.\n.GGGGG.\n..GGG..', { ...PAL.florinho, X: '#555577', '~': '#aacc44' }),
        eating: () => buildSVG('.YdGdY.\n.GGGGl.\nGGGGGGG\nGGwGwGG\nGGGGGGG\nGGGGGGG\n.GGwGG.\n.GGGGG.\n..GGG..', PAL.florinho),
        playing: () => buildSVG('..dGd..\n.GGGGl.\nGGGGGGG\nGGwGwGG\nGG.G.GG\nGGGGGGG\n.GLGLG.\n.GGGGG.\n..GGG..', PAL.florinho),
        happy2: () => buildSVG('.YdGdY.\nGGGGGlG\nGGGGGGG\nGGwGwGG\nGGGGGGG\nGGGRGGG\n.GRGRG.\n.GGGGG.\n..GGG..', PAL.florinho),
        angry: () => buildSVG('.dGGGd.\n.GGGGl.\nGGGGGGG\nGGRGRGl\nGGlGlGG\nGGGGGGG\n.GRrRG.\n.GGGGG.\n..GGG..', PAL.florinho),
        dead: () => buildSVG('..xXx..\n.XXXXX.\nXXXXXXX\nXXBXBXX\nXXXXXXX\nXXXXXXX\n.XX.XX.\n..XXX..\n.XXXXX.', { ...PAL.florinho, B: '#1a1a2e' }),
    },
    gotinho: {
        egg: () => buildSVG('..lll..\n.lClCl.\nlCClCCl\nlCClCCl\nlCCCCCl\nlCCCCCl\n.CCCCC.\n..CCC..', PAL.gotinho),
        baby: () => buildSVG('..AAA..\n.AAAAA.\nAAxAxAA\nAAxAxAA\nAAAAAAA\n.AADAA.\n..AAA..', { ...PAL.gotinho, x: '#1a1a2e', D: '#1a88c0' }),
        adult: () => buildSVG('...AAA...\n..AAAAA..\n.AAxAxAAl\nAAxAxAAAA\nAAAAAAAAAAA\n.AAADAAA.\n..AAAAAAA\n...AAAAA.\n....AAA..', { ...PAL.gotinho, x: '#1a1a2e', D: '#1a88c0' }),
        old: () => buildSVG('...AAA...\n..AaAaA..\n.AAaAaAA.\nAAsAsAsAA\nAAssssAA\nAAAAAAAAAAA\n.AAsDsAA.\n..AAssAA\n...AsAs.', { ...PAL.gotinho, s: '#8ab0d8' }),
        happy: () => buildSVG('..AAA..\n.AAAAA.\nAAxAxAA\nAAxAxAA\nAAAAAAA\n.AADAA.\n..AAA..', { ...PAL.gotinho, x: '#1a1a2e', D: '#1a88c0' }),
        hungry: () => buildSVG('..AAA..\n.AAAAA.\nAASASAA\nAASASAA\nAAAAAAA\n.AA_AA.\n..AAA..', { ...PAL.gotinho, S: '#555577', _: '#1a1a2e' }),
        sleeping: () => buildSVG('..AAA..\n.AAAAA.\nAAaAaAA\nAAaAaAA\nAAAAAAA\n.AA~AA.\n..AAA..', { ...PAL.gotinho, '~': '#8080cc' }),
        sick: () => buildSVG('..AAA..\n.AAAAA.\nAAsAsAA\nAAsAsAA\nAAAAAAA\n.AArAA.\n..rAr..', { ...PAL.gotinho, r: '#80cc80' }),
        eating: () => buildSVG('..AAA..\n.AAAAA.\nAAxAxAA\nAAxAxAA\nAAAAAAA\n.AADAA.\n..xAx..', { ...PAL.gotinho, x: '#1a1a2e', D: '#1a88c0' }),
        playing: () => buildSVG('.xAAAAx.\n.AAAAAA.\nAAxAxAAA\nAAxAxAAA\nAAAAAAAA\n.AADAAA.\n..AAAAA.', { ...PAL.gotinho, x: '#1a1a2e', D: '#1a88c0' }),
        happy2: () => buildSVG('xAAAAAx\n.AAAAA.\nAAxAxAA\nAAxAxAA\nAAAAAAA\n.AADAA.\n..DAD..', { ...PAL.gotinho, x: '#1a1a2e', D: '#1a88c0' }),
        angry: () => buildSVG('DADADADD\n..AAAAA.\nAADaDaDD\nAARARADD\nAAAAAAD.\n.AARAAD.\n..AAA...', { ...PAL.gotinho, D: '#1a88c0', R: '#cc4444' }),
        dead: () => buildSVG('..XXX..\n.XXXXX.\nXXxXxXX\nXXxXxXX\nXXXXXXX\n.XX.XX.\n..XXX..', { ...PAL.gotinho, X: '#5577aa', x: '#1a1a2e' }),
    },
    foguinho: {
        egg: () => buildSVG('..YYY..\n.YFYFy.\nYFFFFfy\nYFFFFfy\nYFFFFfy\nYFYFYfy\n.fYYfy.\n..fff..', PAL.foguinho),
        baby: () => buildSVG('..FFF..\n.YFYFy.\nFFFFFFf\nFFlFlFf\nFFFFFFf\n.FFfFF.\n..FfF..', PAL.foguinho),
        adult: () => buildSVG('..YFFFY.\n.YYFFFYy\nYFFFFFFy\nYFFlFlFy\nYFFlFlFy\nYFFFFFfy\n.FFFFFf.\n..FFff..', PAL.foguinho),
        old: () => buildSVG('..FfFf..\n.FFfFFy.\nFFfFfFFy\nFGlGlGFF\nFGlGlGFF\nFFFfFFFF\n.FFGfFF.\n..FGFF..\n...GG...', { ...PAL.foguinho, G: '#ccccaa' }),
        happy: () => buildSVG('..YFY..\n.YFFFFy\nYFFFFFy\nYFlFlFy\nYFl.lFy\nYFFFFFy\n.FFwFf.\n..FfF..', PAL.foguinho),
        hungry: () => buildSVG('...FF...\n..FFFFy.\n.FFFFFfy\nFFlFlFFy\nFFl.lFFy\nFFFFFFFy\n.FFXFff.\n..FFf...', { ...PAL.foguinho, X: '#555555' }),
        sleeping: () => buildSVG('..fFf..\n.fFFFFf\nFFFFFff\nFFfFfFf\nFFFFFFf\nFFFFFFf\n.FFfFF.\n..FfF..', PAL.foguinho),
        sick: () => buildSVG('..FFF..\n.FFFFFy\nFFFFFfy\nFGlGlFy\nFGGGGFy\nFFFFFfy\n.FGfFF.\n..GFG..', { ...PAL.foguinho, G: '#88bb44' }),
        eating: () => buildSVG('.YFYFy.\n.YFFFFy\nYFFFFFy\nYFlFlFy\nYYYYYYY\nYYYYYYY\n.YFwFy.\n..YYY..', PAL.foguinho),
        playing: () => buildSVG('.YFFFFY\nYYFFFFFy\nYFFFFFfy\nYFlFlFFy\nYFl.lFFy\nYFFFFffy\n.FFwFff.\n..FfFF..', PAL.foguinho),
        happy2: () => buildSVG('YDYFYDY\n.YDDDDy\nYFFFFFFy\nYFlFlFy\nYFwwwFy\nYFFFFFfy\n.FFwFff\n..FfFF.', { ...PAL.foguinho, D: '#cc3300' }),
        angry: () => buildSVG('YDYFYDY\n.YDDDDy\nYFFFFFFy\nYFRFRFy\nYFRRRFy\nYFFFFfy\n.FFDFf.\n..FfF..', { ...PAL.foguinho, R: '#ff2222', D: '#cc3300' }),
        dead: () => buildSVG('..GGG..\n.GGGGG.\nGGGGGGg\nGGXGXGg\nGGGGGGg\n.GGGGg.\n..GGg..', { ...PAL.foguinho, G: '#888877', X: '#555555' }),
    },
    nuvinha: {
        egg: () => buildSVG('..lll..\n.lClCl.\nlCClCCl\nlCClCCl\nlCCCCCl\nlCCCCCl\n.CCCCC.\n..CCC..', PAL.nuvinha),
        baby: () => buildSVG('.CCCCC.\nCCCCCCC\nCCCcCCC\nCClClCC\nCCCcCCC\nCCCCCCC\n.CCCCC.', PAL.nuvinha),
        adult: () => buildSVG('..CCC...\n.CCCCCc.\nCCCCCCC.\nCCCcCCcc\nCClClCCC\nCCCCCCcc\nCCCCCCC.\n.CCCCC..', PAL.nuvinha),
        old: () => buildSVG('..DDD...\n.DDCCCd.\nDCCCCCDD\nDCDcDCDD\nDCDcDCDD\nDDDDDDDD\n.DddDDD.\n..DGGD..\n...GG...', { ...PAL.nuvinha, G: '#cccccc' }),
        happy: () => buildSVG('.CCCCC.\nCCCCCCC\nCCCcCCC\nCClClCC\nCCC.CCC\nCCCCCCC\n.CwCwC.', { ...PAL.nuvinha, w: '#aabbdd' }),
        hungry: () => buildSVG('.cCCCc.\nCCCCCCC\nCCCcCCC\nCCXCXCC\nCCXCXCC\nCCCCCCC\n.CC_CC.', { ...PAL.nuvinha, X: '#555577', _: '#1a1a2e' }),
        sleeping: () => buildSVG('.CCCCC.\nCCCCCCC\nCCCcCCC\nCCdCdCC\nCCCCCCC\nCCCCCCC\n.CR~RC.', { ...PAL.nuvinha, '~': '#8080cc' }),
        sick: () => buildSVG('.DDDDD.\nDDDDDDD\nDDDdDDD\nDDXDXDD\nDDDdDDD\nDDDDDDD\n.DrDrD.', { ...PAL.nuvinha, X: '#555577', r: '#88bb44' }),
        eating: () => buildSVG('lCCCCCl\nCCCCCCC\nCCCcCCC\nCClClCC\nCCC.CCC\nCCCCCCC\n.CWCWC.', { ...PAL.nuvinha, W: '#aabbdd' }),
        playing: () => buildSVG('lCCCCCl\nCCCCCCC\nCCCcCCC\nCClClCC\nCCC.CCC\nCCCCCCC\n.CrCrC.', { ...PAL.nuvinha, r: '#607890' }),
        happy2: () => buildSVG('LCCCCCCL\n.CCCCC..\nCCCcCCC.\nCClClCC.\nCCCwCCC.\nCCCCCCC.\n.CCCCC..', { ...PAL.nuvinha, w: '#aabbdd' }),
        angry: () => buildSVG('DCCCCCD\n.CCCCC.\nDCDdDCd\nCCXCXCC\nCCXXXCC\nCCCCCCC\n.CrRrC.', { ...PAL.nuvinha, X: '#1a1a2e', r: '#cc5544', R: '#ff3322' }),
        dead: () => buildSVG('.GGGGG.\nGGGGGGG\nGGGgGGG\nGGXGXGG\nGGGGGGG\nGGGGGGG\n.GG.GG.', { ...PAL.nuvinha, G: '#888899', g: '#606070', X: '#1a1a2e' }),
    },
    coelhop: {
        egg: () => buildSVG('..NNN..\n.NNPNN.\nNPPPPpN\nNPMpMpN\nNPPPPpN\nNPYpYpN\n.NNpNN.\n..NNN..', PAL.coelhop),
        baby: () => buildSVG('.p.P.p.\n.PPPPP.\nPPPPPPP\nPPlPlPP\nPPl.lPP\nPPPPPPP\n.PpPpP.\n..PPP..', PAL.coelhop),
        adult: () => buildSVG('p..P..p\np.PPP.p\n.PPPPP.\nPPPPPPP\nPPlPlPP\nPPl.lPP\nPPPpPPP\n.PpPpP.\n..PPP..\n..P.P..', PAL.coelhop),
        old: () => buildSVG('p..P..p\np.PwP.p\n.PPPPP.\nPPPPPPP\nPPlPlPP\nPPSSSPl\nPPPwPPP\n.PSPSP.\n..PPP..\n..PSP..', { ...PAL.coelhop, w: '#eeeeee', S: '#ddcccc' }),
        happy: () => buildSVG('p.PPP.p\n.PPPPP.\nPPPPPPP\nPPlPlPP\nPPl.lPP\nPPpPpPP\n.PwPwP.\n..PPP..', PAL.coelhop),
        hungry: () => buildSVG('p.PPP.p\n.PPPPP.\nPPPPPPP\nPPXPXPP\nPPXPXPP\nPPPPPPP\n.PP_PP.\n..PPP..', { ...PAL.coelhop, X: '#555577', _: '#1a1a2e' }),
        sleeping: () => buildSVG('p.PPP.p\n.PPPPP.\nPPPPPPP\nPPpPpPP\nPPPPPPP\nPPPPPPP\n.PP~PP.\n..PPP..', { ...PAL.coelhop, '~': '#8080cc' }),
        sick: () => buildSVG('p.PPP.p\n.PPPPP.\nPPPPPPP\nPPXPXPP\nPPmPmPP\nPPPPPPP\n.PPrPP.\n..rPr..', { ...PAL.coelhop, X: '#555577', m: '#cc88cc', r: '#88bb44' }),
        eating: () => buildSVG('YYYYYYY\np.PPP.p\nPPPPPPP\nPPlPlPP\nPPl.lPP\nPPpPpPP\n.PwPwP.\n..PPP..', PAL.coelhop),
        playing: () => buildSVG('p.PPP.p\nMPPPPMM\nPPPPPPP\nPPlPlPP\nPPl.lPP\nPPmPmPP\n.PwPwP.\n..PPP..', { ...PAL.coelhop, m: '#ab47bc', M: '#ce93d8' }),
        happy2: () => buildSVG('MpPPPpM\n.PPPPP.\nPPPPPPP\nPPlPlPP\nPPl.lPP\nPPKPKPP\n.PwPwP.\n..PPP..', { ...PAL.coelhop, M: '#ce93d8' }),
        angry: () => buildSVG('k.pKp.k\n.KKKKK.\nKKKKKKK\nKKRKRKl\nKKlKlKl\nKKRKRKK\n.KkKkK.\n..KKK..', PAL.coelhop),
        dead: () => buildSVG('X..X..X\nX.XXX.X\n.XXXXX.\nXXXXXXX\nXXxXxXX\nXXXXXXX\n.XXXXX.\n..XXX..', PAL.coelhop),
    },
};

function getSprite(kind, state) {
    const def = SPRITES[kind];
    if (!def) return '';
    const fn = def[state] || def.happy;
    return fn ? fn() : '';
}
