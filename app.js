/* ================== MIS FINANZAS — app.js ================== */
'use strict';

// ---------------- Categorías (mismas de tu presupuesto) ----------------
const CATS = [
  { c: 'Seguridad social', g: 'GASTOS', e: '🏥' },
  { c: 'Servicios', g: 'GASTOS', e: '💡' },
  { c: 'Internet', g: 'GASTOS', e: '🌐' },
  { c: 'Datos móviles', g: 'GASTOS', e: '📱' },
  { c: 'Mercado, aseo', g: 'GASTOS', e: '🛒' },
  { c: 'Comida Tobby', g: 'GASTOS', e: '🐶' },
  { c: 'GYM', g: 'GASTOS', e: '🏋️' },
  { c: 'Danza', g: 'GASTOS', e: '💃' },
  { c: 'Cuota de manejo', g: 'GASTOS', e: '💳' },
  { c: 'Mesada Patri', g: 'OBLIGACIONES', e: '👩‍🦳' },
  { c: 'Donaciones', g: 'OBLIGACIONES', e: '🙏' },
  { c: 'Abogada declaración renta', g: 'OBLIGACIONES', e: '📄' },
  { c: 'Impuestos', g: 'OBLIGACIONES', e: '🏛️' },
  { c: 'Restaurantes', g: 'GUSTOS', e: '🍔' },
  { c: 'Ropa', g: 'GUSTOS', e: '👗' },
  { c: 'Transporte', g: 'GUSTOS', e: '🚕' },
  { c: 'Entretenimiento', g: 'GUSTOS', e: '🎬' },
  { c: 'Hogar, muebles, decoración', g: 'GUSTOS', e: '🛋️' },
  { c: 'Educación', g: 'GUSTOS', e: '📚' },
  { c: 'Otros', g: 'GUSTOS', e: '📦' },
  { c: 'Provisión Tobby', g: 'PROVISIONES', e: '🦴' },
  { c: 'Provisión Tecnología', g: 'PROVISIONES', e: '💻' },
  { c: 'Provisión Belleza/salud', g: 'PROVISIONES', e: '💅' },
  { c: 'Provisión Viajes', g: 'PROVISIONES', e: '✈️' },
  { c: 'Provisión Regalos', g: 'PROVISIONES', e: '🎁' },
  { c: 'Provisión Independencia', g: 'PROVISIONES', e: '🏡' },
];
const CATS_ING = [
  { c: 'Salario fijo', g: 'INGRESOS', e: '💼' },
  { c: 'Freelances Forja', g: 'INGRESOS', e: '🔥' },
  { c: 'Freelances Extras', g: 'INGRESOS', e: '✨' },
  { c: 'Otros Ingresos', g: 'INGRESOS', e: '➕' },
  { c: 'Reembolso', g: 'REEMBOLSOS', e: '🔄' },
];

// ---------------- Clasificación automática (aprendida de tu historial) ----------------
const RULES = [
  [/servicio/i, 'Servicios'],
  [/internet/i, 'Internet'],
  [/\bdatos\b|plan datos/i, 'Datos móviles'],
  [/supermercado|mercado|\bd1\b|\bara\b|\boxxo\b|fruta|exito|éxito/i, 'Mercado, aseo'],
  [/comida tob+y/i, 'Comida Tobby'],
  [/\bgym\b/i, 'GYM'],
  [/danza|nataci/i, 'Danza'],
  [/cuota (de )?manejo/i, 'Cuota de manejo'],
  [/\bss\b|seguridad social|pensi[oó]n y salud/i, 'Seguridad social'],
  [/mesada patri/i, 'Mesada Patri'],
  [/donaci|diezmo/i, 'Donaciones'],
  [/abogada|declaraci/i, 'Abogada declaración renta'],
  [/impuesto|4x1000/i, 'Impuestos'],
  [/tob+y|guacal|veterinari|purgante|pulgas/i, 'Provisión Tobby'],
  [/claude|adobe|photoshop|lightroom|spotify|wix\b|\bpc\b|celular|monitor|teclado|mouse/i, 'Provisión Tecnología'],
  [/pastilla|anticonceptiv|l[aá]ser|dermaskin|dermat[oó]log|ortodoncia|ortorio|orto rio|caries|odontolog|cabello|maquillaje|skincare|crema|shampoo|pesta[ñn]|u[ñn]as|labial|esmalte|bloqueador|centrum|suplemento|medicament|drogueri|farmacia|cita m[eé]dica|psic[oó]log|terapia|perfume|loci[oó]n/i, 'Provisión Belleza/salud'],
  [/viaje|airbnb|hotel|paseo|tiquete|vuelo|playa/i, 'Provisión Viajes'],
  [/regalo|cumple|navidad|navide|ancheta/i, 'Provisión Regalos'],
  [/insights|inversi[oó]n|bitcoin|spacex|ahorro/i, 'Provisión Independencia'],
  [/transporte|indriver|picap|taxi|c[ií]vica|civica|\bmetro\b|parqueadero|uber|gasolina|peaje/i, 'Transporte'],
  [/almuerzo|cena|desayuno|restaurante|pizza|hamburg|sushi|alitas|qbano|helado|mecato|caf[eé]|starbucks|c[oó]ctel|donas|wok|subway|arepa|comida|postre|torta|papitas|sanduche|gatorade|cerveza|jugo|burger|antojo|salida|mcflurry|coca cola|papa john/i, 'Restaurantes'],
  [/ropa|shein|blusa|pantal[oó]n|camisa|vestido|zapato|tenis|chancla|medias|bolso|collar|arete|reloj|decathlon|dollarcity|chaqueta|gorra/i, 'Ropa'],
  [/disney|\bvix\b|cine|netflix|hbo|video ?juego|boleta|entrada|concierto|teatro|juego/i, 'Entretenimiento'],
  [/homecenter|ikea|l[aá]mpara|cajonera|maceta|planta|repisa|mueble|decoraci|comedor|cocina|hogar/i, 'Hogar, muebles, decoración'],
  [/curso|libro|educaci|bullet journal|agenda/i, 'Educación'],
];
const RULES_ING = [
  [/\bba\b|prima|\bdc\b|salario/i, 'Salario fijo'],
  [/forja/i, 'Freelances Forja'],
  [/violinist|shift|axtrom|freelance|\bbg\b|edici[oó]n|vend[ií]/i, 'Freelances Extras'],
  [/me debe|deuda|devuel|pag[oó]|envi[oó]|plata patri|parte de/i, 'Reembolso'],
];

function clasificar(desc, tipo) {
  const rules = tipo === 'Ingreso' ? RULES_ING : RULES;
  let cat = tipo === 'Ingreso' ? 'Otros Ingresos' : 'Otros';
  for (const [re, c] of rules) if (re.test(desc)) { cat = c; break; }
  // si renombraste la categoría, usar el nombre nuevo
  const alias = (state && state.aliases) || {};
  return alias[cat] || cat;
}

// categorías actuales: las de tu hoja (editables); si no hay conexión aún, las de fábrica
const GROUP_EMOJI = { GASTOS: '🧾', OBLIGACIONES: '📌', GUSTOS: '🛍️', PROVISIONES: '🏦', INGRESOS: '💰', REEMBOLSOS: '🔄' };
function getCats(tipo) {
  if (state && state.presupuesto && state.presupuesto.length) {
    const dyn = state.presupuesto.map(p => ({ c: p.categoria, g: p.grupo, e: emoji(p.categoria, p.grupo) }));
    if (tipo === 'Ingreso') return dyn.filter(x => x.g === 'INGRESOS').concat([{ c: 'Reembolso', g: 'REEMBOLSOS', e: '🔄' }]);
    return dyn.filter(x => x.g !== 'INGRESOS');
  }
  return tipo === 'Ingreso' ? CATS_ING : CATS;
}

// ---------------- estado global ----------------
const $ = id => document.getElementById(id);
const cfg = JSON.parse(localStorage.getItem('cfg') || '{}');
let prefs = JSON.parse(localStorage.getItem('prefs') || '{}'); // {tema, color, emojis:{cat:emoji}}

// ---------------- apariencia ----------------
const COLORES = [
  { nombre: 'Violeta', v: '#6d4fc4', d: '#57399f', p: '#e85d9b' },
  { nombre: 'Rosa',    v: '#e0489a', d: '#b32e78', p: '#f7a2c8' },
  { nombre: 'Azul',    v: '#3f7ce0', d: '#2c5ab3', p: '#6fc3e8' },
  { nombre: 'Verde',   v: '#189a70', d: '#0f7a57', p: '#7adcb8' },
  { nombre: 'Naranja', v: '#e8762e', d: '#c05515', p: '#f2b263' },
  { nombre: 'Café',    v: '#8a6248', d: '#6b4a34', p: '#c99b7a' },
];

function applyPrefs() {
  const tema = prefs.tema || 'auto';
  const oscuro = tema === 'oscuro' ||
    (tema === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.body.classList.toggle('dark', oscuro);
  const c = COLORES.find(x => x.nombre === prefs.color) || COLORES[0];
  const r = document.documentElement.style;
  r.setProperty('--violet', c.v);
  r.setProperty('--violet-dark', c.d);
  r.setProperty('--pink', c.p);
  document.querySelector('meta[name="theme-color"]').content = c.v;
}

function renderApariencia() {
  document.querySelectorAll('#tema-toggle button').forEach(b =>
    b.classList.toggle('active', b.dataset.tema === (prefs.tema || 'auto')));
  const box = $('color-swatches');
  box.innerHTML = '';
  COLORES.forEach(c => {
    const b = document.createElement('button');
    b.style.background = `linear-gradient(120deg, ${c.v}, ${c.p})`;
    b.title = c.nombre;
    b.className = (prefs.color || 'Violeta') === c.nombre ? 'sel' : '';
    b.onclick = () => { prefs.color = c.nombre; savePrefs(); renderApariencia(); };
    box.appendChild(b);
  });
}

function savePrefs() {
  localStorage.setItem('prefs', JSON.stringify(prefs));
  applyPrefs();
}
let state = JSON.parse(localStorage.getItem('state') || 'null'); // cache última respuesta
let queue = JSON.parse(localStorage.getItem('queue') || '[]');   // pendientes offline

// conversaciones del chat (varias, como historial)
let chats = JSON.parse(localStorage.getItem('chats') || '[]');
let chatActivoId = localStorage.getItem('chatActivo') || null;
// migrar el historial viejo (una sola conversación) al formato nuevo
const _legacy = JSON.parse(localStorage.getItem('chat') || '[]');
if (_legacy.length && !chats.length) {
  chats.push({ id: 'c' + Date.now(), titulo: (_legacy[0].text || 'Conversación').slice(0, 34), msgs: _legacy, ts: Date.now() });
  localStorage.removeItem('chat');
}
let tipoSel = 'Gasto';
let catSel = null;
let catManual = false;
let mesVista = hoyMes();

function hoyFecha() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function hoyMes() { return hoyFecha().slice(0, 7); }
function fmt(n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function emoji(cat, grupo) {
  // primero: el ícono que tú hayas elegido
  if (prefs.emojis && prefs.emojis[cat]) return prefs.emojis[cat];
  const x = CATS.concat(CATS_ING).find(c => c.c === cat);
  if (x) return x.e;
  // ¿la renombraste? busca el emoji del nombre original
  const alias = (state && state.aliases) || {};
  for (const orig in alias) {
    if (alias[orig] === cat) { const o = CATS.concat(CATS_ING).find(c => c.c === orig); if (o) return o.e; }
  }
  if (!grupo && state && state.presupuesto) {
    const p = state.presupuesto.find(p => p.categoria === cat);
    if (p) grupo = p.grupo;
  }
  return GROUP_EMOJI[grupo] || '📦';
}
function grupoDe(cat, tipo) {
  if (tipo === 'Por cobrar') return 'POR COBRAR';
  if (state && state.presupuesto) {
    const p = state.presupuesto.find(p => p.categoria === cat);
    if (p) return p.grupo;
  }
  const x = CATS.concat(CATS_ING).find(c => c.c === cat);
  return x ? x.g : (tipo === 'Ingreso' ? 'INGRESOS' : 'GUSTOS');
}

// ---------------- API ----------------
async function api(body) {
  if (!cfg.url) throw new Error('SIN_URL');
  const r = await fetch(cfg.url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!data.ok && data.error) throw new Error(data.error);
  return data;
}

async function refreshState(mes) {
  try {
    const st = await api({ action: 'state', mes: mes || mesVista });
    state = st;
    localStorage.setItem('state', JSON.stringify(st));
    return st;
  } catch (e) {
    return state; // offline: usa cache
  }
}

// ---------------- registro ----------------
function parseEntry(text) {
  // "15 mil" o "15,5 mil" (típico del dictado por voz) → 15000 / 15500
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*mil\b/gi,
    (_, n) => String(Math.round(parseFloat(n.replace(',', '.')) * 1000)));
  const m = text.match(/([\d]{1,3}(?:[.,'’]\d{3})+|\d+)\s*(k)?\s*(.*)/i);
  if (!m) return null;
  let monto = parseInt(m[1].replace(/[.,'’]/g, ''), 10);
  if (m[2]) monto *= 1000;
  return { monto, desc: (m[3] || '').trim() };
}

let personaSel = null;
let accionDeuda = 'deuda'; // 'deuda' = me deben | 'abono' = me pagaron

function renderChips() {
  const box = $('cat-chips');
  box.innerHTML = '';
  if (tipoSel === 'Por cobrar') {
    // acción: nueva deuda o abono
    const acciones = document.createElement('div');
    acciones.className = 'tipo-toggle';
    acciones.style.marginBottom = '10px';
    acciones.style.width = '100%';
    [['deuda', '🤝 Me deben (presté)'], ['abono', '💰 Me pagaron']].forEach(([val, lbl]) => {
      const b = document.createElement('button');
      b.textContent = lbl;
      b.className = accionDeuda === val ? 'active' : '';
      b.onclick = () => { accionDeuda = val; renderChips(); };
      acciones.appendChild(b);
    });
    box.appendChild(acciones);
    // persona
    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = '¿Quién?';
    label.style.width = '100%';
    box.appendChild(label);
    const chips = document.createElement('div');
    chips.className = 'chips';
    chips.style.width = '100%';
    const personas = new Set(['Patri', 'Iduar', 'Ángela']);
    Object.keys((state && state.deudas) || {}).forEach(p => personas.add(p));
    personas.forEach(p => {
      const b = document.createElement('button');
      const saldo = state && state.deudas && state.deudas[p] ? state.deudas[p].saldo : 0;
      b.textContent = `👤 ${p}${saldo > 0 ? ' · ' + fmt(saldo) : ''}`;
      b.className = p === personaSel ? 'sel' : '';
      b.onclick = () => { personaSel = p; renderChips(); };
      chips.appendChild(b);
    });
    const otra = document.createElement('button');
    otra.textContent = '➕ Otra persona';
    otra.onclick = () => {
      const p = prompt('¿Cómo se llama?');
      if (p && p.trim()) { personaSel = p.trim(); renderChips(); }
    };
    chips.appendChild(otra);
    box.appendChild(chips);
    return;
  }
  const list = getCats(tipoSel);
  list.forEach(({ c, e }) => {
    const b = document.createElement('button');
    b.textContent = `${e} ${c.replace('Provisión ', 'P. ')}`;
    b.className = c === catSel ? 'sel' : '';
    b.onclick = () => { catSel = c; catManual = true; $('cat-auto').classList.add('hidden'); renderChips(); };
    box.appendChild(b);
  });
}

function onEntryInput() {
  const p = parseEntry($('entry-input').value);
  $('monto-preview').textContent = p && p.monto ? fmt(p.monto) : '';
  if (p && p.desc && !catManual) {
    catSel = clasificar(p.desc, tipoSel);
    $('cat-auto').classList.remove('hidden');
    renderChips();
  }
}

async function guardar() {
  const p = parseEntry($('entry-input').value);
  if (!p || !p.monto) return toast('Escribe el monto, ej: 15.000 transporte');
  let tipo = tipoSel, categoria;
  if (tipoSel === 'Por cobrar') {
    if (!personaSel) return toast('Elige quién 👤');
    tipo = accionDeuda === 'abono' ? 'Abono' : 'Por cobrar';
    categoria = personaSel;
  } else {
    categoria = catSel || clasificar(p.desc, tipo);
  }
  const mov = {
    action: 'add', fecha: $('entry-fecha').value || hoyFecha(), tipo,
    categoria, grupo: tipoSel === 'Por cobrar' ? 'POR COBRAR' : grupoDe(categoria, tipo),
    monto: p.monto, descripcion: p.desc,
  };
  $('entry-input').value = ''; $('monto-preview').textContent = '';
  catSel = null; catManual = false; $('cat-auto').classList.add('hidden'); renderChips();
  try {
    const r = await api(mov);
    toast(`✓ Guardado: ${fmt(mov.monto)} en ${categoria}`);
    if (r.alerta) showBanner(r.alerta);
    refreshState().then(renderMini);
  } catch (e) {
    queue.push(mov);
    localStorage.setItem('queue', JSON.stringify(queue));
    renderQueue();
    toast('📴 Sin conexión: guardado en pendientes, se enviará solo');
  }
}

async function flushQueue() {
  if (!queue.length || !cfg.url) return;
  const pend = [...queue];
  queue = [];
  for (const mov of pend) {
    try { await api(mov); }
    catch (e) { queue.push(mov); }
  }
  localStorage.setItem('queue', JSON.stringify(queue));
  renderQueue();
  if (!queue.length && pend.length) toast('✓ Pendientes sincronizados');
}

function renderQueue() {
  const el = $('queue-info');
  if (queue.length) { el.textContent = `⏳ ${queue.length} movimiento(s) pendiente(s) por sincronizar`; el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}

// ---------------- resumen ----------------
function renderMini() {
  if (!state) return;
  const mes = hoyMes();
  let gasto = 0, ingreso = 0;
  (state.movimientos || []).forEach(m => {
    if (m.mes !== mes) return;
    if (m.tipo === 'Gasto') gasto += m.monto;
    if (m.tipo === 'Ingreso') ingreso += m.monto;
  });
  const presTotal = (state.presupuesto || []).filter(p => p.grupo !== 'INGRESOS').reduce((s, p) => s + p.mensual, 0);
  $('mini-resumen').innerHTML = `
    <div class="fila"><span>💸 Gastado este mes</span><b class="neg">${fmt(gasto)}</b></div>
    <div class="fila"><span>🎯 Presupuesto mensual</span><b>${fmt(presTotal)}</b></div>
    <div class="fila"><span>💰 Ingresos del mes</span><b class="pos">${fmt(ingreso)}</b></div>`;
}

async function renderResumen() {
  const st = await refreshState(mesVista);
  if (!st) { $('resumen-grupos').innerHTML = '<div class="card">Conéctate primero en ⚙️ Configuración</div>'; return; }
  const nombreMes = new Date(mesVista + '-15').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  $('resumen-mes').textContent = nombreMes;

  // usa los movimientos completos del mes consultado (el backend los envía todos);
  // si estamos sin conexión y el cache es de otro mes, filtra lo que haya
  const movsMes = (st.movsMes && st.mes === mesVista)
    ? st.movsMes
    : (st.movimientos || []).filter(m => m.mes === mesVista);
  let gasto = 0, ingreso = 0, porCobrar = 0;
  movsMes.forEach(m => {
    if (m.mes !== mesVista) return;
    if (m.tipo === 'Gasto') gasto += m.monto;
    if (m.tipo === 'Ingreso') ingreso += m.monto;
    if (m.tipo === 'Por cobrar') porCobrar += m.monto;
  });
  $('resumen-totales').innerHTML = `
    <div class="tot ing"><small>Ingresos</small><b>${fmt(ingreso)}</b></div>
    <div class="tot gas"><small>Gastos</small><b>${fmt(gasto)}</b></div>
    <div class="tot bal"><small>Balance</small><b>${fmt(ingreso - gasto)}</b></div>`;

  // totales por categoría del mes visto
  const tot = {};
  movsMes.forEach(m => {
    if (m.mes === mesVista && m.tipo === 'Gasto') tot[m.categoria] = (tot[m.categoria] || 0) + m.monto;
  });

  const grupos = ['GASTOS', 'OBLIGACIONES', 'GUSTOS', 'PROVISIONES'];
  let html = '';
  grupos.forEach(g => {
    const cats = (st.presupuesto || []).filter(p => p.grupo === g);
    if (!cats.length) return;
    const gTot = cats.reduce((s, p) => s + (tot[p.categoria] || 0), 0);
    const gPres = cats.reduce((s, p) => s + p.mensual, 0);
    let rows = '';
    cats.forEach(p => {
      const usado = tot[p.categoria] || 0;
      if (!usado && !p.mensual) return;
      const pct = p.mensual > 0 ? usado / p.mensual : (usado > 0 ? 1.01 : 0);
      const cls = pct >= 1 ? 'over' : pct >= 0.8 ? 'warn' : '';
      rows += `
        <div class="cat-row">
          <div class="info">
            <span class="nombre">${emoji(p.categoria)} ${p.categoria.replace('Provisión ', '')}</span>
            <span class="valores">${fmt(usado)} / ${fmt(p.mensual)}</span>
          </div>
          <div class="barra"><div class="${cls}" style="width:${Math.min(pct * 100, 100)}%"></div></div>
        </div>`;
    });
    html += `<div class="grupo-card"><h4><span>${g}</span><span>${fmt(gTot)} / ${fmt(gPres)}</span></h4>${rows}</div>`;
  });
  $('resumen-grupos').innerHTML = html;
  renderDeudas(st);

  // banner si hay categorías pasadas (solo mes actual)
  if (mesVista === hoyMes()) {
    const pasadas = (st.presupuesto || []).filter(p => p.mensual > 0 && (tot[p.categoria] || 0) >= p.mensual);
    if (pasadas.length) showBanner(`🚨 Presupuesto superado en: ${pasadas.map(p => p.categoria).join(', ')}`, true);
  }
}

function renderDeudas(st) {
  const box = $('resumen-deudas');
  const deudas = (st && st.deudas) || {};
  const personas = Object.keys(deudas).filter(p => deudas[p].debe > 0 || deudas[p].abonado > 0);
  if (!personas.length) { box.innerHTML = ''; return; }
  personas.sort((a, b) => deudas[b].saldo - deudas[a].saldo);
  const total = personas.reduce((s, p) => s + Math.max(deudas[p].saldo, 0), 0);
  let rows = '';
  personas.forEach(p => {
    const d = deudas[p];
    rows += `
      <div class="deuda-row">
        <div style="flex:1">
          <div class="quien">👤 ${p}</div>
          <div class="detalle">prestado ${fmt(d.debe)} · pagado ${fmt(d.abonado)}</div>
        </div>
        <span class="saldo ${d.saldo <= 0 ? 'cero' : ''}">${d.saldo <= 0 ? '✓ a paz' : fmt(d.saldo)}</span>
      </div>`;
  });
  box.innerHTML = `
    <div class="grupo-card">
      <h4><span>🤝 ME DEBEN</span><span>${fmt(total)}</span></h4>
      ${rows}
      <p class="hint" style="margin-top:8px">Registra abonos desde ✏️ Registrar → "Me deben" → "💰 Me pagaron"</p>
    </div>`;
}

// ---------------- pestañas del resumen ----------------
let rtabActivo = 'mes';
function renderResTab(tab) {
  rtabActivo = tab;
  document.querySelectorAll('#res-tabs button').forEach(b =>
    b.classList.toggle('active', b.dataset.rtab === tab));
  ['mes', 'tend', 'patri'].forEach(t =>
    $('rtab-' + t).classList.toggle('hidden', t !== tab));
  if (tab === 'mes') renderResumen();
  if (tab === 'tend') renderTendencias();
  if (tab === 'patri') { patriItems = null; renderPatrimonio(); }
}

function moverMes(delta) {
  let [y, m] = mesVista.split('-').map(Number);
  m += delta;
  if (m < 1) { m = 12; y--; }
  if (m > 12) { m = 1; y++; }
  mesVista = y + '-' + String(m).padStart(2, '0');
  renderResumen();
}

// ---------------- tendencias 📈 ----------------
const NOMBRES_MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function mesCorto(m) { return NOMBRES_MES[parseInt(m.slice(5), 10) - 1] || m; }
function fmtM(n) { return n >= 1e6 ? '$' + (n / 1e6).toFixed(1).replace('.0', '') + 'M' : n >= 1e3 ? '$' + Math.round(n / 1e3) + 'k' : '$' + n; }

async function renderTendencias() {
  const box = $('rtab-tend');
  box.innerHTML = '<div class="card">Cargando... 📈</div>';
  let t;
  try { t = await api({ action: 'tendencias' }); }
  catch (e) { box.innerHTML = `<div class="card">Sin conexión: ${e.message}</div>`; return; }

  let html = '';

  // --- metas de provisiones (acumulado del año) ---
  const provisiones = ((state && state.presupuesto) || []).filter(p => p.grupo === 'PROVISIONES' && p.mensual > 0);
  if (provisiones.length) {
    let metas = '';
    provisiones.forEach(p => {
      const metaAnual = p.mensual * 12;
      const acum = (t.ytd || {})[p.categoria] || 0;
      const pct = Math.min(Math.round(acum / metaAnual * 100), 100);
      metas += `
        <div class="meta-row">
          <div class="info">
            <span>${emoji(p.categoria)} ${p.categoria.replace('Provisión ', '')}</span>
            <span><span class="pct">${pct}%</span> · ${fmt(acum)} de ${fmtM(metaAnual)}</span>
          </div>
          <div class="barra"><div style="width:${pct}%; background:var(--chart-gasto)"></div></div>
        </div>`;
    });
    html += `<div class="card"><h3>🎯 Metas ${t.anio} (lo que has aportado)</h3>${metas}</div>`;
  }

  // --- barras ingresos vs gastos (últimos 6 meses) ---
  const meses = (t.meses || []).slice(-6);
  if (meses.length) {
    const max = Math.max(...meses.map(m => Math.max(m.ingresos, m.gastos)), 1);
    const W = 340, H = 175, base = 140, plotTop = 14;
    const groupW = (W - 20) / meses.length;
    const barW = Math.min(20, groupW / 2 - 6);
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ingresos y gastos por mes">`;
    // grid recesivo
    [0.5, 1].forEach(f => {
      const y = base - (base - plotTop) * f;
      svg += `<line x1="10" y1="${y}" x2="${W - 10}" y2="${y}" stroke="currentColor" opacity=".12" stroke-width="1"/>`;
      svg += `<text x="${W - 10}" y="${y - 3}" text-anchor="end" font-size="8.5" fill="currentColor" opacity=".55">${fmtM(max * f)}</text>`;
    });
    meses.forEach((m, i) => {
      const cx = 10 + groupW * i + groupW / 2;
      const hI = Math.max((base - plotTop) * m.ingresos / max, m.ingresos ? 2 : 0);
      const hG = Math.max((base - plotTop) * m.gastos / max, m.gastos ? 2 : 0);
      svg += `<g class="barmes" data-i="${i}" style="cursor:pointer">
        <rect x="${cx - barW - 2}" y="${base - hI}" width="${barW}" height="${hI}" rx="3.5" fill="var(--chart-ingreso)"/>
        <rect x="${cx + 2}" y="${base - hG}" width="${barW}" height="${hG}" rx="3.5" fill="var(--chart-gasto)"/>
        <rect x="${cx - groupW / 2}" y="${plotTop}" width="${groupW}" height="${base - plotTop}" fill="transparent"/>
        <text x="${cx}" y="${base + 14}" text-anchor="middle" font-size="10" fill="currentColor" opacity=".7">${mesCorto(m.mes)}</text>
      </g>`;
    });
    svg += '</svg>';
    let tabla = '<table class="mini-table"><tr><th>Mes</th><th>Ingresos</th><th>Gastos</th><th>Balance</th></tr>';
    meses.forEach(m => {
      tabla += `<tr><td>${mesCorto(m.mes)} ${m.mes.slice(0, 4)}</td><td>${fmt(m.ingresos)}</td><td>${fmt(m.gastos)}</td><td>${fmt(m.ingresos - m.gastos)}</td></tr>`;
    });
    tabla += '</table>';
    html += `
      <div class="card chart-card">
        <h3>📊 Ingresos vs Gastos</h3>
        <div class="legend">
          <span><span class="dot" style="background:var(--chart-ingreso)"></span>Ingresos</span>
          <span><span class="dot" style="background:var(--chart-gasto)"></span>Gastos</span>
        </div>
        ${svg}
        <div class="chart-caption" id="tend-caption">Toca un mes para ver el detalle</div>
        ${tabla}
      </div>`;
  } else {
    html += '<div class="card">Aún no hay suficientes datos — registra tus movimientos y aquí verás tu evolución 📈</div>';
  }

  // --- top categorías (promedio mensual) ---
  const top = (t.topCategorias || []).slice(0, 6);
  if (top.length) {
    const maxT = top[0].promedio || 1;
    let rows = '';
    top.forEach(c => {
      rows += `
        <div class="top-cat">
          <div class="info"><b>${emoji(c.categoria)} ${c.categoria.replace('Provisión ', '')}</b><span>${fmt(c.promedio)}/mes</span></div>
          <div class="barra"><div style="width:${Math.round(c.promedio / maxT * 100)}%; background:var(--chart-gasto)"></div></div>
        </div>`;
    });
    html += `<div class="card"><h3>🔝 En qué se te va más (promedio mensual)</h3>${rows}</div>`;
  }

  box.innerHTML = html;
  box.querySelectorAll('.barmes').forEach(g => g.onclick = () => {
    const m = meses[Number(g.dataset.i)];
    $('tend-caption').innerHTML = `<b>${mesCorto(m.mes)} ${m.mes.slice(0, 4)}</b>: ingresos ${fmt(m.ingresos)} · gastos ${fmt(m.gastos)} · balance ${fmt(m.ingresos - m.gastos)}`;
  });
}

// ---------------- patrimonio 💎 ----------------
let patriItems = null; // items del editor en memoria

async function renderPatrimonio() {
  const box = $('rtab-patri');
  box.innerHTML = '<div class="card">Cargando... 💎</div>';
  let p;
  try { p = await api({ action: 'patrimonio_get' }); }
  catch (e) { box.innerHTML = `<div class="card">Sin conexión: ${e.message}</div>`; return; }
  const meses = p.meses || [];
  const ultimo = meses[meses.length - 1];
  const previo = meses[meses.length - 2];

  let html = '';

  // --- total y crecimiento ---
  if (ultimo) {
    const delta = previo ? ultimo.total - previo.total : 0;
    const pct = previo && previo.total ? (delta / previo.total * 100).toFixed(1) : null;
    html += `
      <div class="card">
        <div class="patri-total">
          <small>Tu patrimonio (${mesCorto(ultimo.mes)} ${ultimo.mes.slice(0, 4)})</small>
          <div class="gran">${fmt(ultimo.total)}</div>
          ${previo ? `<span class="delta ${delta >= 0 ? 'pos' : 'neg'}">${delta >= 0 ? '▲' : '▼'} ${fmt(Math.abs(delta))}${pct !== null ? ' (' + (delta >= 0 ? '+' : '-') + Math.abs(pct) + '%)' : ''} vs mes anterior</span>` : ''}
        </div>
      </div>`;
  }

  // --- línea de evolución ---
  if (meses.length >= 2) {
    const W = 340, H = 150, x0 = 14, x1 = W - 14, yTop = 14, yBase = H - 26;
    const vals = meses.map(m => m.total);
    const vMin = Math.min(...vals), vMax = Math.max(...vals);
    const rango = (vMax - vMin) || 1;
    const px = i => x0 + (x1 - x0) * (meses.length === 1 ? 0.5 : i / (meses.length - 1));
    const py = v => yBase - (yBase - yTop) * ((v - vMin) / rango);
    const pts = meses.map((m, i) => `${px(i).toFixed(1)},${py(m.total).toFixed(1)}`);
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Evolución del patrimonio">`;
    svg += `<polygon points="${x0},${yBase} ${pts.join(' ')} ${x1},${yBase}" fill="var(--chart-gasto)" opacity=".12"/>`;
    svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="var(--chart-gasto)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    meses.forEach((m, i) => {
      svg += `<circle class="ppt" data-i="${i}" cx="${px(i).toFixed(1)}" cy="${py(m.total).toFixed(1)}" r="4.5" fill="var(--chart-gasto)" stroke="var(--card)" stroke-width="2" style="cursor:pointer"/>`;
      svg += `<text x="${px(i).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="10" fill="currentColor" opacity=".7">${mesCorto(m.mes)}</text>`;
    });
    svg += '</svg>';
    html += `<div class="card chart-card"><h3>📈 Evolución</h3>${svg}<div class="chart-caption" id="patri-caption">Toca un punto para ver el valor</div></div>`;
  }

  // --- editor del snapshot del mes actual ---
  const mesActual = hoyMes();
  const yaEste = meses.find(m => m.mes === mesActual);
  if (!patriItems) {
    const baseItems = (yaEste || ultimo || { items: [] }).items;
    patriItems = baseItems.length
      ? baseItems.map(x => ({ item: x.item, valor: x.valor }))
      : [{ item: 'Cuenta de ahorros', valor: 0 }, { item: 'Fiducuenta', valor: 0 }, { item: 'Cesantías', valor: 0 }];
  }
  let editor = '';
  patriItems.forEach((it, i) => {
    editor += `
      <div class="patri-row">
        <input type="text" data-i="${i}" data-f="item" value="${String(it.item).replace(/"/g, '&quot;')}" placeholder="Activo">
        <input type="text" inputmode="numeric" data-i="${i}" data-f="valor" value="${it.valor ? it.valor.toLocaleString('es-CO') : ''}" placeholder="Valor">
        <button class="del" data-i="${i}">✕</button>
      </div>`;
  });
  html += `
    <div class="card">
      <h3>📸 ${yaEste ? 'Actualizar' : 'Registrar'} patrimonio de ${mesCorto(mesActual)} ${mesActual.slice(0, 4)}</h3>
      <p class="hint">Escribe cuánto tienes hoy en cada activo (prellenado con tu último registro).</p>
      <div id="patri-editor">${editor}</div>
      <button id="patri-add" class="secondary" style="margin-bottom:8px">+ Agregar activo</button>
      <button id="patri-save" class="primary" style="width:100%">Guardar patrimonio ✓</button>
    </div>`;

  // --- historial ---
  if (meses.length) {
    let hist = '';
    [...meses].reverse().forEach((m, i, arr) => {
      const ant = arr[i + 1];
      const d = ant ? m.total - ant.total : null;
      hist += `<div class="patri-hist"><span>${mesCorto(m.mes)} ${m.mes.slice(0, 4)}</span><span><b>${fmt(m.total)}</b> ${d !== null ? `<span class="delta ${d >= 0 ? 'pos' : 'neg'}">${d >= 0 ? '+' : '−'}${fmtM(Math.abs(d))}</span>` : ''}</span></div>`;
    });
    html += `<div class="card"><h3>🗓️ Historial</h3>${hist}</div>`;
  }

  box.innerHTML = html;

  // eventos
  box.querySelectorAll('.ppt').forEach(c => c.onclick = () => {
    const m = meses[Number(c.dataset.i)];
    $('patri-caption').innerHTML = `<b>${mesCorto(m.mes)} ${m.mes.slice(0, 4)}</b>: ${fmt(m.total)}`;
  });
  box.querySelectorAll('#patri-editor input').forEach(inp => inp.onchange = () => {
    const it = patriItems[Number(inp.dataset.i)];
    if (inp.dataset.f === 'item') it.item = inp.value;
    else it.valor = parseInt(inp.value.replace(/\D/g, ''), 10) || 0;
  });
  box.querySelectorAll('#patri-editor .del').forEach(b => b.onclick = () => {
    patriItems.splice(Number(b.dataset.i), 1);
    renderPatrimonio();
  });
  const addBtn = $('patri-add');
  if (addBtn) addBtn.onclick = () => { patriItems.push({ item: '', valor: 0 }); renderPatrimonio(); };
  const saveBtn = $('patri-save');
  if (saveBtn) saveBtn.onclick = async () => {
    const items = patriItems.filter(x => x.item && x.item.trim());
    if (!items.length) return toast('Agrega al menos un activo');
    try {
      const r = await api({ action: 'patrimonio_save', mes: mesActual, items });
      toast(`✓ Patrimonio guardado: ${fmt(r.total)}`);
      patriItems = null;
      renderPatrimonio();
    } catch (e) { toast('Error: ' + e.message); }
  };
}

// ---------------- movimientos ----------------
async function renderMovs() {
  const st = await refreshState();
  const q = ($('movs-buscar').value || '').toLowerCase();
  const list = (st && st.movimientos || []).filter(m =>
    !q || (m.descripcion || '').toLowerCase().includes(q) || (m.categoria || '').toLowerCase().includes(q));
  $('movs-lista').innerHTML = list.slice(0, 100).map(m => `
    <div class="mov">
      <span class="emoji">${m.tipo === 'Ingreso' ? '💰' : m.tipo === 'Por cobrar' ? '🤝' : emoji(m.categoria)}</span>
      <div class="det">
        <div class="desc">${m.descripcion || m.categoria}</div>
        <div class="meta">${m.fecha} · ${m.categoria}</div>
      </div>
      <span class="monto ${m.tipo === 'Ingreso' ? 'ing' : ''}">${m.tipo === 'Ingreso' ? '+' : ''}${fmt(m.monto)}</span>
      <button class="del" data-id="${m.id}">✕</button>
    </div>`).join('') || '<div class="card">Sin movimientos aún</div>';
  document.querySelectorAll('.mov .del').forEach(b => b.onclick = async () => {
    if (!confirm('¿Eliminar este movimiento?')) return;
    try { await api({ action: 'delete', id: b.dataset.id }); toast('Eliminado'); renderMovs(); }
    catch (e) { toast('Error: ' + e.message); }
  });
}

// ---------------- chat (multi-conversación) ----------------
const BIENVENIDA = '¡Hola Angie! 💜 Soy tu asesora financiera. Tengo acceso a tu presupuesto y todos tus movimientos. Pregúntame lo que quieras: "¿cómo voy este mes?", "¿en qué estoy gastando de más?", "¿cuánto puedo ahorrar?"';

function chatActivo() {
  let c = chats.find(x => x.id === chatActivoId);
  if (!c) {
    c = { id: 'c' + Date.now(), titulo: 'Nueva conversación', msgs: [], ts: Date.now() };
    chats.unshift(c);
    chatActivoId = c.id;
    saveChats();
  }
  return c;
}

function saveChats() {
  localStorage.setItem('chats', JSON.stringify(chats.slice(0, 30)));
  localStorage.setItem('chatActivo', chatActivoId);
}

function formatMsg(t) {
  const esc = String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|\n)\s*\* /g, '$1• ');
}

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.innerHTML = formatMsg(text);
  $('chat-mensajes').appendChild(div);
  $('chat-mensajes').scrollTop = 1e9;
  return div;
}

function renderChatBox() {
  const c = chatActivo();
  const box = $('chat-mensajes');
  box.innerHTML = '';
  addMsg(BIENVENIDA, 'bot');
  c.msgs.forEach(m => addMsg(m.text, m.role === 'user' ? 'user' : 'bot'));
}

function renderChatLista() {
  const box = $('chat-lista');
  if (!chats.length) { box.innerHTML = '<p class="hint">Aún no tienes conversaciones.</p>'; return; }
  box.innerHTML = chats.map(c => `
    <div class="chat-item ${c.id === chatActivoId ? 'activo' : ''}" data-id="${c.id}">
      <span class="tit">💬 ${c.titulo}</span>
      <span class="fec">${new Date(c.ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
      <button class="del" data-id="${c.id}">✕</button>
    </div>`).join('');
  box.querySelectorAll('.chat-item').forEach(el => el.onclick = (ev) => {
    if (ev.target.classList.contains('del')) return;
    chatActivoId = el.dataset.id;
    saveChats();
    box.classList.add('hidden');
    renderChatBox();
  });
  box.querySelectorAll('.del').forEach(b => b.onclick = () => {
    chats = chats.filter(c => c.id !== b.dataset.id);
    if (chatActivoId === b.dataset.id) chatActivoId = chats.length ? chats[0].id : null;
    saveChats();
    renderChatLista();
    renderChatBox();
  });
}

async function enviarChat() {
  const text = $('chat-input').value.trim();
  if (!text) return;
  $('chat-input').value = '';
  const c = chatActivo();
  addMsg(text, 'user');
  c.msgs.push({ role: 'user', text });
  if (c.titulo === 'Nueva conversación') c.titulo = text.slice(0, 34);
  c.ts = Date.now();
  saveChats();
  const typing = addMsg('Pensando... 💭', 'bot typing');
  try {
    const r = await api({ action: 'chat', message: text, history: c.msgs.slice(0, -1) });
    typing.remove();
    addMsg(r.reply, 'bot');
    c.msgs.push({ role: 'model', text: r.reply });
    c.msgs = c.msgs.slice(-40);
    saveChats();
  } catch (e) {
    typing.remove();
    addMsg(e.message === 'NO_KEY'
      ? 'Aún no tienes la key de Gemini configurada 🗝️ Ve a ⚙️ Configuración y sigue los pasos (es gratis).'
      : 'Ups, error: ' + e.message, 'bot');
  }
}

// ---------------- dictado por voz 🎤 ----------------
function crearDictado(btnId, inputId, onFin) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = $(btnId);
  if (!SR) { btn.style.display = 'none'; return; }
  const rec = new SR();
  rec.lang = 'es-CO';
  rec.interimResults = true;
  rec.continuous = false;
  let grabando = false;
  rec.onresult = (ev) => {
    let texto = '';
    for (const res of ev.results) texto += res[0].transcript;
    $(inputId).value = texto.trim();
    $(inputId).dispatchEvent(new Event('input'));
  };
  rec.onend = () => {
    grabando = false;
    btn.classList.remove('rec');
    if (onFin && $(inputId).value.trim()) onFin();
  };
  rec.onerror = () => { grabando = false; btn.classList.remove('rec'); };
  btn.onclick = () => {
    if (grabando) { rec.stop(); return; }
    grabando = true;
    btn.classList.add('rec');
    $(inputId).value = '';
    try { rec.start(); } catch (e) { grabando = false; btn.classList.remove('rec'); }
  };
}

function initVoz() {
  crearDictado('chat-mic', 'chat-input', enviarChat);          // en el chat: al terminar, envía
  crearDictado('entry-mic', 'entry-input', null);              // en registrar: solo dicta, tú confirmas
}

// ---------------- config ----------------
async function probarConexion() {
  const url = $('cfg-url').value.trim();
  if (!url.includes('script.google.com')) return setEstado('cfg-estado', 'URL inválida: debe ser la de Apps Script', false);
  cfg.url = url;
  localStorage.setItem('cfg', JSON.stringify(cfg));
  setEstado('cfg-estado', 'Probando...', true);
  try {
    const st = await refreshState();
    setEstado('cfg-estado', '✓ ¡Conectada! Tu hoja está lista.', true);
    if (st.sheetUrl) { $('cfg-sheet-link').href = st.sheetUrl; $('cfg-sheet-link').classList.remove('hidden'); }
    renderMini(); renderRecs(); renderCatsConfig(); renderChips();
    flushQueue();
  } catch (e) {
    setEstado('cfg-estado', '✗ No se pudo conectar: ' + e.message, false);
  }
}

async function guardarGemini() {
  const key = $('cfg-gemini').value.trim();
  if (!key) return;
  try {
    await api({ action: 'set_key', key });
    $('cfg-gemini').value = '';
    toast('✓ Key guardada. ¡El chat ya funciona!');
  } catch (e) { toast('Error: ' + e.message); }
}

function renderRecs() {
  const recs = (state && state.recordatorios) || [];
  $('rec-lista').innerHTML = recs.map(r => `
    <div class="rec-item">
      <span>📅 <b>${r.nombre}</b> — día ${r.dia} <small>${r.monto ? '· ~' + fmt(r.monto) : ''}</small></span>
      <button class="del" data-id="${r.id}">✕</button>
    </div>`).join('') || '<p class="hint">Sin recordatorios aún. Agrega tus pagos fijos (internet, servicios, SS...).</p>';
  document.querySelectorAll('#rec-lista .del').forEach(b => b.onclick = async () => {
    try { await api({ action: 'reminder_del', id: b.dataset.id }); await refreshState(); renderRecs(); } catch (e) { toast(e.message); }
  });
}

async function agregarRec() {
  const nombre = $('rec-nombre').value.trim();
  const dia = parseInt($('rec-dia').value, 10);
  const monto = parseInt(($('rec-monto').value || '0').replace(/\D/g, ''), 10) || 0;
  if (!nombre || !dia) return toast('Pon nombre y día del mes');
  try {
    await api({ action: 'reminder_add', nombre, dia, monto });
    $('rec-nombre').value = ''; $('rec-dia').value = ''; $('rec-monto').value = '';
    await refreshState(); renderRecs(); toast('✓ Recordatorio creado');
  } catch (e) { toast('Error: ' + e.message); }
}

async function guardarWhatsApp() {
  const phone = $('wa-phone').value.trim();
  const key = $('wa-key').value.trim();
  if (!phone || !key) return setEstado('wa-estado', 'Escribe tu número y la apikey', false);
  setEstado('wa-estado', 'Guardando y enviando prueba...', true);
  try {
    await api({ action: 'set_whatsapp', phone, key });
    await api({ action: 'test_whatsapp' });
    setEstado('wa-estado', '✓ ¡Revisa tu WhatsApp! Ahí llegó la prueba 💜', true);
  } catch (e) { setEstado('wa-estado', '✗ ' + e.message, false); }
}

// --------- editor de categorías ---------
// --- mantener presionado: helper ---
function longPress(el, fn) {
  let timer = null, x0 = 0, y0 = 0;
  el.addEventListener('pointerdown', e => {
    x0 = e.clientX; y0 = e.clientY;
    timer = setTimeout(() => {
      timer = null;
      if (navigator.vibrate) navigator.vibrate(40);
      fn();
    }, 550);
  });
  const cancelar = () => { if (timer) { clearTimeout(timer); timer = null; } };
  el.addEventListener('pointerup', cancelar);
  el.addEventListener('pointerleave', cancelar);
  el.addEventListener('pointermove', e => {
    if (Math.abs(e.clientX - x0) > 10 || Math.abs(e.clientY - y0) > 10) cancelar();
  });
  el.addEventListener('contextmenu', e => e.preventDefault());
}

// --- menú de acciones (hoja inferior) ---
function actionSheet(titulo, acciones) {
  const ov = document.createElement('div');
  ov.className = 'sheet-overlay';
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.innerHTML = `<h4>${titulo}</h4>`;
  acciones.concat([{ label: 'Cancelar', fn: null }]).forEach(a => {
    const b = document.createElement('button');
    b.textContent = a.label;
    if (a.destructivo) b.classList.add('destructivo');
    b.onclick = () => { ov.remove(); if (a.fn) a.fn(); };
    sheet.appendChild(b);
  });
  ov.appendChild(sheet);
  ov.onclick = e => { if (e.target === ov) ov.remove(); };
  document.body.appendChild(ov);
}

let ordenMode = false;
let ordenLista = null;

async function eliminarCategoria(cat) {
  if (!confirm(`¿Eliminar "${cat}"?\nSus movimientos históricos pasarán a "Otros".`)) return;
  try {
    const r = await api({ action: 'cat_delete', categoria: cat });
    toast(`✓ Eliminada. ${r.reasignados} movimiento(s) pasaron a ${r.destino}`);
    await refreshState(); renderCatsConfig(); renderChips();
  } catch (e) { toast('Error: ' + e.message); }
}

function moverCategoria(cat, dir) {
  // mueve dentro de su grupo (intercambia con la vecina del mismo grupo)
  const i = ordenLista.findIndex(p => p.categoria === cat);
  if (i < 0) return;
  const g = ordenLista[i].grupo;
  let j = i + dir;
  while (j >= 0 && j < ordenLista.length && ordenLista[j].grupo !== g) j += dir;
  if (j < 0 || j >= ordenLista.length) return;
  [ordenLista[i], ordenLista[j]] = [ordenLista[j], ordenLista[i]];
  renderCatsConfig();
}

function renderCatsConfig() {
  const box = $('cats-lista');
  if (!state || !state.presupuesto || !state.presupuesto.length) {
    box.innerHTML = '<p class="hint">Conéctate primero para ver tus categorías.</p>';
    return;
  }
  const grupos = ['GASTOS', 'OBLIGACIONES', 'GUSTOS', 'PROVISIONES', 'INGRESOS'];
  const pres = (ordenMode && ordenLista) ? ordenLista : state.presupuesto;
  let html = '';
  let totalEgresos = 0, totalIngresos = 0;

  grupos.forEach(g => {
    const cats = pres.filter(p => p.grupo === g);
    if (!cats.length) return;
    const sub = cats.reduce((s, p) => s + (p.mensual || 0), 0);
    if (g === 'INGRESOS') totalIngresos += sub; else totalEgresos += sub;
    html += `<div class="cat-grupo-titulo">${GROUP_EMOJI[g]} ${g}</div>`;
    cats.forEach(p => {
      if (ordenMode) {
        html += `
          <div class="cat-item orden">
            <span class="nom">${emoji(p.categoria, p.grupo)} ${p.categoria}</span>
            <button class="mover" data-cat="${p.categoria}" data-dir="-1">▲</button>
            <button class="mover" data-cat="${p.categoria}" data-dir="1">▼</button>
          </div>`;
      } else {
        html += `
          <div class="cat-item presionable" data-cat="${p.categoria}">
            <button class="emo" data-cat="${p.categoria}" title="Cambiar ícono">${emoji(p.categoria, p.grupo)}</button>
            <span class="nom">${p.categoria}</span>
            <span class="pres">${p.mensual ? fmt(p.mensual) : ''}</span>
            <button class="cat-ren" data-cat="${p.categoria}" title="Renombrar">✏️</button>
            <button class="cat-mon" data-cat="${p.categoria}" data-m="${p.mensual}" title="Presupuesto">💲</button>
          </div>`;
      }
    });
    html += `<div class="cat-subtotal"><span>Total ${g.toLowerCase()}</span><b>${fmt(sub)}</b></div>`;
  });

  // totales generales y superávit
  const superavit = totalIngresos - totalEgresos;
  html += `
    <div class="cat-totales">
      <div class="fila"><span>💸 TOTAL EGRESOS presupuestados</span><b>${fmt(totalEgresos)}</b></div>
      <div class="fila"><span>💰 Ingresos presupuestados</span><b>${fmt(totalIngresos)}</b></div>
      ${totalIngresos > 0 ? `
      <div class="fila superavit ${superavit >= 0 ? 'pos' : 'neg'}">
        <span>${superavit >= 0 ? '✅ SUPERÁVIT' : '🚨 DÉFICIT'}</span><b>${fmt(superavit)}</b>
      </div>` : '<p class="hint">💡 Para ver tu superávit, ponle presupuesto mensual a tus ingresos: toca 💲 en "Salario fijo" y escribe cuánto recibes al mes.</p>'}
      ${superavit < 0 && totalIngresos > 0 ? '<p class="hint" style="color:var(--red)">Tu presupuesto gasta más de lo que ingresa. Ajusta las categorías hasta que el superávit vuelva a ser positivo.</p>' : ''}
    </div>`;

  if (ordenMode) {
    html += `<button id="orden-listo" class="primary" style="width:100%;margin-top:10px">✓ Guardar este orden</button>
             <button id="orden-cancelar" class="secondary" style="margin-top:8px">Cancelar</button>`;
  } else {
    html = `<p class="hint" style="margin-bottom:4px">💡 Mantén presionada una categoría para eliminarla o reordenarla.</p>` + html;
  }
  box.innerHTML = html;

  if (ordenMode) {
    box.querySelectorAll('.mover').forEach(b => b.onclick = () => moverCategoria(b.dataset.cat, Number(b.dataset.dir)));
    $('orden-listo').onclick = async () => {
      try {
        await api({ action: 'cat_reorder', orden: ordenLista.map(p => p.categoria) });
        toast('✓ Orden guardado');
        ordenMode = false; ordenLista = null;
        await refreshState(); renderCatsConfig(); renderChips();
      } catch (e) { toast('Error: ' + e.message); }
    };
    $('orden-cancelar').onclick = () => { ordenMode = false; ordenLista = null; renderCatsConfig(); };
    return; // en modo orden no hay más handlers
  }

  // mantener presionado → menú
  box.querySelectorAll('.presionable').forEach(el => longPress(el, () => {
    const cat = el.dataset.cat;
    actionSheet(`${emoji(cat)} ${cat}`, [
      { label: '↕️ Reordenar categorías', fn: () => { ordenMode = true; ordenLista = state.presupuesto.map(p => ({ ...p })); renderCatsConfig(); } },
      { label: '🗑️ Eliminar esta categoría', destructivo: true, fn: () => eliminarCategoria(cat) },
    ]);
  }));

  box.querySelectorAll('.emo').forEach(b => b.onclick = () => {
    const cat = b.dataset.cat;
    const nuevo = prompt('Escribe el emoji (ícono) para "' + cat + '".\nAbre el teclado de emojis y elige el que quieras 😄:', emoji(cat));
    if (nuevo === null) return;
    if (!prefs.emojis) prefs.emojis = {};
    const limpio = nuevo.trim();
    if (limpio) prefs.emojis[cat] = limpio; else delete prefs.emojis[cat];
    savePrefs();
    renderCatsConfig(); renderChips();
    toast(limpio ? `✓ Ícono de ${cat}: ${limpio}` : 'Ícono restaurado');
  });
  box.querySelectorAll('.cat-ren').forEach(b => b.onclick = async () => {
    const viejo = b.dataset.cat;
    const nuevo = prompt('Nuevo nombre para "' + viejo + '":', viejo);
    if (!nuevo || nuevo.trim() === viejo) return;
    try {
      const r = await api({ action: 'cat_rename', viejo, nuevo: nuevo.trim() });
      toast(`✓ Renombrada. ${r.movimientosActualizados} movimiento(s) actualizados`);
      await refreshState(); renderCatsConfig(); renderChips();
    } catch (e) { toast('Error: ' + e.message); }
  });
  box.querySelectorAll('.cat-mon').forEach(b => b.onclick = async () => {
    const cat = b.dataset.cat;
    const v = prompt('Presupuesto mensual para "' + cat + '":', b.dataset.m || '0');
    if (v === null) return;
    const mensual = parseInt(v.replace(/\D/g, ''), 10) || 0;
    try {
      await api({ action: 'cat_update', categoria: cat, mensual });
      toast('✓ Presupuesto actualizado: ' + fmt(mensual));
      await refreshState(); renderCatsConfig();
    } catch (e) { toast('Error: ' + e.message); }
  });
}

async function crearCategoria() {
  const categoria = $('cat-nueva-nombre').value.trim();
  const grupo = $('cat-nueva-grupo').value;
  const mensual = parseInt(($('cat-nueva-monto').value || '0').replace(/\D/g, ''), 10) || 0;
  if (!categoria) return toast('Escribe el nombre de la categoría');
  try {
    await api({ action: 'cat_add', grupo, categoria, mensual });
    $('cat-nueva-nombre').value = ''; $('cat-nueva-monto').value = '';
    toast('✓ Categoría creada: ' + categoria);
    await refreshState(); renderCatsConfig(); renderChips();
  } catch (e) { toast('Error: ' + e.message); }
}

function setEstado(id, msg, ok) {
  const el = $(id);
  el.textContent = msg;
  el.className = 'estado ' + (ok ? 'ok' : 'err');
}

// ---------------- UI helpers ----------------
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3200);
}

function showBanner(msg, rojo) {
  const b = $('banner');
  b.textContent = msg;
  b.className = 'banner' + (rojo || msg.startsWith('🚨') ? ' rojo' : '');
  setTimeout(() => b.classList.add('hidden'), 12000);
}

function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  $('view-' + name).classList.remove('hidden');
  document.querySelectorAll('.bottomnav button').forEach(b =>
    b.classList.toggle('active', b.dataset.view === name));
  if (name === 'registrar') renderChips(); // por si creaste/renombraste categorías
  if (name === 'resumen') renderResTab(rtabActivo);
  if (name === 'movs') renderMovs();
  if (name === 'config') {
    if (cfg.url) { $('cfg-url').value = cfg.url; renderRecs(); }
    renderCatsConfig();
  }
}

// ---------------- init ----------------
function init() {
  applyPrefs();
  renderApariencia();
  document.querySelectorAll('#tema-toggle button').forEach(b => b.onclick = () => {
    prefs.tema = b.dataset.tema;
    savePrefs();
    renderApariencia();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyPrefs);

  $('mes-label').textContent = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  $('entry-fecha').value = hoyFecha();
  renderChips();
  renderQueue();

  $('entry-input').addEventListener('input', onEntryInput);
  $('entry-input').addEventListener('keydown', e => { if (e.key === 'Enter') guardar(); });
  $('btn-guardar').onclick = guardar;
  document.querySelectorAll('#tipo-toggle button').forEach(b => b.onclick = () => {
    tipoSel = b.dataset.tipo;
    document.querySelectorAll('#tipo-toggle button').forEach(x => x.classList.toggle('active', x === b));
    catSel = null; catManual = false; onEntryInput(); renderChips();
  });

  document.querySelectorAll('.bottomnav button').forEach(b => b.onclick = () => switchView(b.dataset.view));
  $('btn-config').onclick = () => switchView('config');
  document.querySelectorAll('#res-tabs button').forEach(b => b.onclick = () => renderResTab(b.dataset.rtab));
  $('mes-prev').onclick = () => moverMes(-1);
  $('mes-next').onclick = () => moverMes(1);
  $('movs-buscar').addEventListener('input', () => renderMovs());
  $('chat-send').onclick = enviarChat;
  $('chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') enviarChat(); });
  $('cfg-probar').onclick = probarConexion;
  $('cfg-gemini-btn').onclick = guardarGemini;
  $('rec-add').onclick = agregarRec;
  $('cat-nueva-btn').onclick = crearCategoria;
  $('wa-save').onclick = guardarWhatsApp;

  // chat: conversaciones y voz
  renderChatBox();
  initVoz();
  $('chat-nuevo').onclick = () => {
    chatActivoId = null;
    chatActivo(); // crea una nueva
    $('chat-lista').classList.add('hidden');
    renderChatBox();
  };
  $('chat-lista-btn').onclick = () => {
    const box = $('chat-lista');
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) renderChatLista();
  };

  window.addEventListener('online', flushQueue);
  if (cfg.url) refreshState().then(() => { renderMini(); renderChips(); flushQueue(); });
  else { switchView('config'); setEstado('cfg-estado', 'Pega aquí la URL de tu Apps Script para empezar 💜', true); }

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', init);
