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
  const m = text.match(/([\d]{1,3}(?:[.,'’]\d{3})+|\d+)\s*(k)?\s*(.*)/i);
  if (!m) return null;
  let monto = parseInt(m[1].replace(/[.,'’]/g, ''), 10);
  if (m[2]) monto *= 1000;
  return { monto, desc: (m[3] || '').trim() };
}

function renderChips() {
  const list = tipoSel === 'Por cobrar' ? [] : getCats(tipoSel);
  const box = $('cat-chips');
  box.innerHTML = '';
  if (tipoSel === 'Por cobrar') {
    box.innerHTML = '<p class="hint">Se guarda como cuenta por cobrar 🤝 (no afecta tu presupuesto)</p>';
    return;
  }
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
  const tipo = tipoSel;
  const categoria = tipo === 'Por cobrar' ? 'Por cobrar' : (catSel || clasificar(p.desc, tipo));
  const mov = {
    action: 'add', fecha: $('entry-fecha').value || hoyFecha(), tipo,
    categoria, grupo: grupoDe(categoria, tipo), monto: p.monto, descripcion: p.desc,
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
  if (porCobrar) html += `<div class="grupo-card"><h4><span>🤝 ME DEBEN</span><span>${fmt(porCobrar)}</span></h4></div>`;
  $('resumen-grupos').innerHTML = html;

  // banner si hay categorías pasadas (solo mes actual)
  if (mesVista === hoyMes()) {
    const pasadas = (st.presupuesto || []).filter(p => p.mensual > 0 && (tot[p.categoria] || 0) >= p.mensual);
    if (pasadas.length) showBanner(`🚨 Presupuesto superado en: ${pasadas.map(p => p.categoria).join(', ')}`, true);
  }
}

function moverMes(delta) {
  let [y, m] = mesVista.split('-').map(Number);
  m += delta;
  if (m < 1) { m = 12; y--; }
  if (m > 12) { m = 1; y++; }
  mesVista = y + '-' + String(m).padStart(2, '0');
  renderResumen();
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
let reconocedor = null, grabando = false;
function initVoz() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { $('chat-mic').style.display = 'none'; return; }
  reconocedor = new SR();
  reconocedor.lang = 'es-CO';
  reconocedor.interimResults = true;
  reconocedor.continuous = false;
  reconocedor.onresult = (ev) => {
    let final = '', parcial = '';
    for (const res of ev.results) (res.isFinal ? final += res[0].transcript : parcial += res[0].transcript);
    $('chat-input').value = (final + parcial).trim();
  };
  reconocedor.onend = () => {
    grabando = false;
    $('chat-mic').classList.remove('rec');
    if ($('chat-input').value.trim()) enviarChat();
  };
  reconocedor.onerror = () => { grabando = false; $('chat-mic').classList.remove('rec'); };
  $('chat-mic').onclick = () => {
    if (grabando) { reconocedor.stop(); return; }
    grabando = true;
    $('chat-mic').classList.add('rec');
    $('chat-input').value = '';
    $('chat-input').placeholder = 'Te escucho... 🎙️';
    try { reconocedor.start(); } catch (e) { grabando = false; $('chat-mic').classList.remove('rec'); }
  };
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

async function importarHistorial() {
  if (typeof HISTORICO === 'undefined' || !HISTORICO.length) return;
  setEstado('importar-estado', `Importando ${HISTORICO.length} movimientos...`, true);
  try {
    const r = await api({ action: 'add_batch', items: HISTORICO });
    setEstado('importar-estado', `✓ Listo: ${r.agregados} importados, ${r.omitidos} ya existían`, true);
    refreshState();
  } catch (e) { setEstado('importar-estado', '✗ ' + e.message, false); }
}

// --------- editor de categorías ---------
function renderCatsConfig() {
  const box = $('cats-lista');
  if (!state || !state.presupuesto || !state.presupuesto.length) {
    box.innerHTML = '<p class="hint">Conéctate primero para ver tus categorías.</p>';
    return;
  }
  const grupos = ['GASTOS', 'OBLIGACIONES', 'GUSTOS', 'PROVISIONES', 'INGRESOS'];
  let html = '';
  grupos.forEach(g => {
    const cats = state.presupuesto.filter(p => p.grupo === g);
    if (!cats.length) return;
    html += `<div class="cat-grupo-titulo">${GROUP_EMOJI[g]} ${g}</div>`;
    cats.forEach(p => {
      html += `
        <div class="cat-item">
          <button class="emo" data-cat="${p.categoria}" title="Cambiar ícono">${emoji(p.categoria, p.grupo)}</button>
          <span class="nom">${p.categoria}</span>
          <span class="pres">${p.mensual ? fmt(p.mensual) : ''}</span>
          <button class="cat-ren" data-cat="${p.categoria}" title="Renombrar">✏️</button>
          <button class="cat-mon" data-cat="${p.categoria}" data-m="${p.mensual}" title="Presupuesto">💲</button>
        </div>`;
    });
  });
  box.innerHTML = html;

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
  if (name === 'resumen') renderResumen();
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
  $('mes-prev').onclick = () => moverMes(-1);
  $('mes-next').onclick = () => moverMes(1);
  $('movs-buscar').addEventListener('input', () => renderMovs());
  $('chat-send').onclick = enviarChat;
  $('chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') enviarChat(); });
  $('cfg-probar').onclick = probarConexion;
  $('cfg-gemini-btn').onclick = guardarGemini;
  $('rec-add').onclick = agregarRec;
  $('cat-nueva-btn').onclick = crearCategoria;
  $('btn-importar').onclick = importarHistorial;

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
