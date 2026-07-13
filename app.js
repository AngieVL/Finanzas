/* ================== MIS FINANZAS — app.js ================== */
'use strict';

// ---------------- Categorías (mismas de tu presupuesto) ----------------
// lista de respaldo (solo se ve antes de conectar; las reales vienen de TU hoja)
const CATS = [
  { c: 'Arriendo/Vivienda', g: 'GASTOS', e: '🏠' },
  { c: 'Servicios', g: 'GASTOS', e: '💡' },
  { c: 'Internet', g: 'GASTOS', e: '🌐' },
  { c: 'Datos móviles', g: 'GASTOS', e: '📱' },
  { c: 'Mercado, aseo', g: 'GASTOS', e: '🛒' },
  { c: 'Deudas/Créditos', g: 'OBLIGACIONES', e: '💳' },
  { c: 'Donaciones', g: 'OBLIGACIONES', e: '🙏' },
  { c: 'Restaurantes', g: 'GUSTOS', e: '🍔' },
  { c: 'Ropa', g: 'GUSTOS', e: '👗' },
  { c: 'Transporte', g: 'GUSTOS', e: '🚕' },
  { c: 'Entretenimiento', g: 'GUSTOS', e: '🎬' },
  { c: 'Otros', g: 'GUSTOS', e: '📦' },
  { c: 'Provisión Tecnología', g: 'PROVISIONES', e: '💻' },
  { c: 'Provisión Salud/Belleza', g: 'PROVISIONES', e: '💅' },
  { c: 'Provisión Viajes', g: 'PROVISIONES', e: '✈️' },
  { c: 'Provisión Regalos', g: 'PROVISIONES', e: '🎁' },
  { c: 'Provisión Emergencias', g: 'PROVISIONES', e: '🚨' },
];
const CATS_ING = [
  { c: 'Salario fijo', g: 'INGRESOS', e: '💼' },
  { c: 'Ingresos extra', g: 'INGRESOS', e: '✨' },
  { c: 'Otros Ingresos', g: 'INGRESOS', e: '➕' },
  { c: 'Reembolso', g: 'REEMBOLSOS', e: '🔄' },
];

// ---------------- Clasificación automática (aprendida de tu historial) ----------------
const RULES = [
  [/servicio/i, 'Servicios'],
  [/internet/i, 'Internet'],
  [/\bdatos\b|plan datos/i, 'Datos móviles'],
  [/supermercado|mercado|\bd1\b|\bara\b|\boxxo\b|fruta|exito|éxito|leche|\bpan\b|arroz|huevo|queso|carne|pollo|verdura|galleta|cereal|aseo|jab[oó]n|detergente|papel higi/i, 'Mercado, aseo'],
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
  [/claude|adobe|photoshop|lightroom|spotify|wix\b|\bpc\b|celular|monitor|teclado|mouse|aud[ií]fono|cargador|\busb\b|jbl/i, 'Provisión Tecnología'],
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
  cat = alias[cat] || cat;
  // nunca sugerir una categoría que no exista en TU presupuesto
  if (!getCats(tipo).some(x => x.c === cat)) cat = tipo === 'Ingreso' ? 'Otros Ingresos' : 'Otros';
  return cat;
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
// adivinador de emoji por el nombre de la categoría (para las personalizadas)
const EMOJI_SUGERIDOS = [
  [/mascota|perr|gat|tobby|veterinaria/i, '🐶'], [/gym|gimnas|ejercicio|deporte/i, '🏋️'],
  [/danza|baile/i, '💃'], [/nataci/i, '🏊'],
  [/seguridad social|salud|m[eé]dic|eps|pensi[oó]n/i, '🏥'], [/belleza|est[eé]tica|u[ñn]as|cabello|spa/i, '💅'],
  [/arriendo|vivienda|hogar|mueble|decoraci/i, '🏠'], [/servicio/i, '💡'], [/internet|wifi/i, '🌐'],
  [/dato|celular|m[oó]vil/i, '📱'], [/mercado|aseo|super/i, '🛒'],
  [/transporte|taxi|gasolina|carro|moto/i, '🚕'], [/restaurante|comida|antojo|caf[eé]/i, '🍔'],
  [/ropa|moda|zapato|accesorio/i, '👗'], [/entretenimiento|cine|stream|juego/i, '🎬'],
  [/educaci|curso|libro|estudio/i, '📚'], [/tecnolog|computador|\bpc\b/i, '💻'],
  [/viaje|vacacion|paseo/i, '✈️'], [/regalo/i, '🎁'], [/emergencia/i, '🚨'],
  [/independencia|inversi[oó]n|ahorro/i, '🏡'], [/mesada|mam[aá]|pap[aá]|abuel/i, '👵'],
  [/donaci|diezmo|iglesia/i, '🙏'], [/impuesto|renta|abogad|declaraci/i, '🏛️'],
  [/cuota|tarjeta|banco|cr[eé]dito|deuda/i, '💳'], [/salario|sueldo|n[oó]mina/i, '💼'],
  [/freelance|extra/i, '✨'], [/beb[eé]|hij/i, '👶'], [/psic[oó]log|terapia/i, '🛋️'],
];

function emoji(cat, grupo) {
  // primero: el ícono que tú hayas elegido
  if (prefs.emojis && prefs.emojis[cat]) return prefs.emojis[cat];
  const x = CATS.concat(CATS_ING).find(c => c.c === cat);
  if (x) return x.e;
  // adivinar por el nombre
  for (const [re, e] of EMOJI_SUGERIDOS) if (re.test(cat)) return e;
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
    // acción: préstamos (mi plata) o custodia (su plata que yo guardo)
    const acciones = document.createElement('div');
    acciones.className = 'tipo-toggle acciones-personas';
    [['deuda', '🤝 Presté'], ['abono', '💰 Me pagó'], ['guardo', '👝 Recibí su plata'], ['entrego', '📤 Le entregué / gastó']].forEach(([val, lbl]) => {
      const b = document.createElement('button');
      b.textContent = lbl;
      b.className = accionDeuda === val ? 'active' : '';
      b.onclick = () => { accionDeuda = val; renderChips(); };
      acciones.appendChild(b);
    });
    box.appendChild(acciones);
    // pista según la acción
    const pista = document.createElement('p');
    pista.className = 'hint';
    pista.style.width = '100%';
    pista.textContent = {
      deuda: 'Prestaste TU plata: te la deben.',
      abono: 'Te devolvieron plata que habías prestado.',
      guardo: 'Entró plata DE OTRA persona a tus cuentas (tú se la guardas).',
      entrego: 'Le diste o gastó de SU plata guardada (transferencia, compra con tu tarjeta...).',
    }[accionDeuda];
    box.appendChild(pista);
    // persona
    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = '¿Quién?';
    label.style.width = '100%';
    box.appendChild(label);
    const chips = document.createElement('div');
    chips.className = 'chips';
    chips.style.width = '100%';
    const personas = new Set((prefs.personas || []));
    Object.keys((state && state.deudas) || {}).forEach(p => personas.add(p));
    Object.keys((state && state.custodias) || {}).forEach(p => personas.add(p));
    personas.forEach(p => {
      const b = document.createElement('button');
      const esCustodia = accionDeuda === 'guardo' || accionDeuda === 'entrego';
      const fuente = esCustodia ? (state && state.custodias) : (state && state.deudas);
      const saldo = fuente && fuente[p] ? fuente[p].saldo : 0;
      b.textContent = `👤 ${p}${saldo !== 0 ? ' · ' + (esCustodia ? '👝' : '') + fmt(saldo) : ''}`;
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
  let tipo = tipoSel, categoria, grupo;
  if (tipoSel === 'Por cobrar') {
    if (!personaSel) return toast('Elige quién 👤');
    tipo = { deuda: 'Por cobrar', abono: 'Abono', guardo: 'Guardo', entrego: 'Entrego' }[accionDeuda];
    categoria = personaSel;
    // recordar a esta persona para las próximas veces
    if (!(prefs.personas || []).includes(personaSel)) {
      prefs.personas = (prefs.personas || []).concat(personaSel).slice(-15);
      savePrefs();
    }
    grupo = (accionDeuda === 'guardo' || accionDeuda === 'entrego') ? 'PLATA AJENA' : 'POR COBRAR';
  } else {
    categoria = catSel || clasificar(p.desc, tipo);
    grupo = grupoDe(categoria, tipo);
  }
  const mov = {
    action: 'add', fecha: $('entry-fecha').value || hoyFecha(), tipo,
    categoria, grupo, monto: p.monto, descripcion: p.desc,
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
    toast('⏳ No se pudo guardar ahora (sin señal o Google con problemas). Quedó en pendientes y se enviará solo ✓');
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

  const grupos = ['GASTOS', 'OBLIGACIONES', 'GUSTOS'];
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

  // 🏦 PROVISIONES = alcancías: cada mes se les suma el aporte; los gastos salen del FONDO acumulado
  const alc = st.alcancias || {};
  const provCats = (st.presupuesto || []).filter(p => p.grupo === 'PROVISIONES');
  if (provCats.length) {
    const dispTotal = provCats.reduce((s, p) => s + (alc[p.categoria] ? alc[p.categoria].disponible : 0), 0);
    let rows = '';
    provCats.forEach(p => {
      const a = alc[p.categoria];
      if (!a) return;
      const gastadoMes = tot[p.categoria] || 0;
      const pctUsado = a.ahorrado > 0 ? Math.min(a.gastado / a.ahorrado, 1) : 0;
      const negativa = a.disponible < 0;
      rows += `
        <div class="cat-row">
          <div class="info">
            <span class="nombre">${emoji(p.categoria)} ${p.categoria.replace('Provisión ', '')}</span>
            <span class="valores ${negativa ? 'neg-txt' : ''}"><b>${negativa ? '−' : ''}${fmt(Math.abs(a.disponible))}</b> disponibles</span>
          </div>
          <div class="barra"><div class="${negativa ? 'over' : ''}" style="width:${Math.round(pctUsado * 100)}%; ${negativa ? '' : 'background:var(--chart-gasto)'}"></div></div>
          <div class="alc-detalle">ahorras ${fmt(a.mensual)}/mes desde ${mesCorto(a.desde)} ${a.desde.slice(0, 4)}${gastadoMes ? ` · este mes gastaste ${fmt(gastadoMes)}` : ''}</div>
        </div>`;
    });
    html += `
      <div class="grupo-card">
        <h4><span>🏦 PROVISIONES (alcancías)</span><span>${fmt(dispTotal)} disponibles</span></h4>
        ${rows}
        <p class="hint" style="margin-top:8px">Cada alcancía crece solita con tu aporte mensual. Tus compras salen del fondo acumulado — solo hay problema si una queda en negativo. Configúralas en ⚙️ Mis categorías (mantén presionada una provisión).</p>
      </div>`;
  }

  $('resumen-grupos').innerHTML = html;
  renderDeudas(st);

  // banner si hay categorías pasadas (solo mes actual); las provisiones se miden por su alcancía
  if (mesVista === hoyMes()) {
    const pasadas = (st.presupuesto || [])
      .filter(p => p.grupo !== 'PROVISIONES' && p.grupo !== 'INGRESOS' && p.mensual > 0 && (tot[p.categoria] || 0) >= p.mensual)
      .map(p => p.categoria);
    Object.keys(alc).forEach(c => { if (alc[c].disponible < 0) pasadas.push(c.replace('Provisión ', '') + ' (alcancía en negativo)'); });
    if (pasadas.length) showBanner(`🚨 Ojo con: ${pasadas.join(', ')}`, true);
  }
}

function renderDeudas(st) {
  const box = $('resumen-deudas');
  let html = '';

  // 🤝 préstamos: MI plata que me deben
  const deudas = (st && st.deudas) || {};
  const personas = Object.keys(deudas).filter(p => deudas[p].debe > 0 || deudas[p].abonado > 0);
  if (personas.length) {
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
    html += `
      <div class="grupo-card">
        <h4><span>🤝 ME DEBEN (mi plata)</span><span>${fmt(total)}</span></h4>
        ${rows}
      </div>`;
  }

  // 👝 custodia: plata de OTROS que vive en mis cuentas
  const cust = (st && st.custodias) || {};
  const dueños = Object.keys(cust).filter(p => cust[p].recibido > 0 || cust[p].entregado > 0);
  if (dueños.length) {
    dueños.sort((a, b) => cust[b].saldo - cust[a].saldo);
    const totalC = dueños.reduce((s, p) => s + cust[p].saldo, 0);
    let rows = '';
    dueños.forEach(p => {
      const c = cust[p];
      rows += `
        <div class="deuda-row">
          <div style="flex:1">
            <div class="quien">👝 ${p}</div>
            <div class="detalle">recibí ${fmt(c.recibido)} · le entregué ${fmt(c.entregado)}</div>
          </div>
          <span class="saldo custodia ${c.saldo < 0 ? 'negc' : ''}">${c.saldo < 0 ? '−' : ''}${fmt(Math.abs(c.saldo))}</span>
        </div>
        ${c.saldo < 0 ? '<p class="hint" style="color:var(--red)">Le has entregado más de lo que tenía guardado — ese excedente salió de TU plata (considera registrarlo como préstamo 🤝).</p>' : ''}`;
    });
    html += `
      <div class="grupo-card">
        <h4><span>👝 PLATA QUE GUARDO (de otros)</span><span>${fmt(totalC)}</span></h4>
        ${rows}
        <p class="hint" style="margin-top:8px">Plata ajena que vive en tus cuentas (ej: la pensión de tu mamá). No cuenta como tuya ni afecta tu presupuesto.</p>
      </div>`;
  }

  box.innerHTML = html;
}

// ---------------- escanear factura 📷 ----------------
async function comprimirImagen(file) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error('No pude leer la imagen'));
    i.src = URL.createObjectURL(file);
  });
  const escala = Math.min(1, 1400 / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * escala);
  c.height = Math.round(img.height * escala);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(img.src);
  return c.toDataURL('image/jpeg', 0.82).split(',')[1];
}

function initScan() {
  $('entry-scan').onclick = () => $('scan-file').click();
  $('scan-file').onchange = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    toast('📷 Leyendo tu factura... dame ~10 segundos');
    try {
      const b64 = await comprimirImagen(file);
      const r = await api({ action: 'scan_factura', imagen: b64, mime: 'image/jpeg' });
      renderScanReview(r);
      toast(`✓ Leí ${r.items.length} artículos — revísalos abajo`);
    } catch (err) {
      toast('Ups: ' + (err.message === 'NO_KEY' ? 'falta la key de Gemini en ⚙️' : err.message));
    }
  };
}

function renderScanReview(r) {
  const box = $('scan-review');
  const cats = getCats('Gasto');
  const personas = new Set((prefs.personas || []));
  Object.keys((state && state.deudas) || {}).forEach(p => personas.add(p));
  Object.keys((state && state.custodias) || {}).forEach(p => personas.add(p));
  let opciones = cats.map(c => `<option value="cat:${c.c}">${c.e} ${c.c.replace('Provisión ', 'P. ')}</option>`).join('');
  opciones += `<optgroup label="🤝 Me lo debe...">${[...personas].map(p => `<option value="deuda:${p}">🤝 ${p}</option>`).join('')}</optgroup>`;

  let html = `
    <div class="card">
      <h3>🧾 ${r.comercio || 'Tu factura'} — ${fmt(r.total || r.items.reduce((s, i) => s + i.valor, 0))}</h3>
      <p class="hint">Revisa cada artículo: desmarca los que no vayan, y elige la categoría o quién te lo debe.</p>`;
  r.items.forEach((it, i) => {
    html += `
      <div class="scan-item">
        <input type="checkbox" checked class="scan-chk" data-i="${i}">
        <div class="scan-info">
          <div class="d">${it.descripcion}</div>
          <div class="v">${fmt(it.valor)}</div>
        </div>
        <select class="scan-cat" data-i="${i}">${opciones}</select>
      </div>`;
  });
  html += `
      <button id="scan-guardar" class="primary big" style="margin-top:12px">Guardar artículos ✓</button>
      <button id="scan-cancelar" class="secondary" style="margin-top:8px">Cancelar</button>
    </div>`;
  box.innerHTML = html;
  box.classList.remove('hidden');
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // sugerencia automática de categoría por artículo
  box.querySelectorAll('.scan-cat').forEach(sel => {
    const it = r.items[Number(sel.dataset.i)];
    const sug = 'cat:' + clasificar(it.descripcion, 'Gasto');
    sel.value = sug;
    if (sel.value !== sug) sel.value = 'cat:Otros';
  });

  $('scan-cancelar').onclick = () => { box.classList.add('hidden'); box.innerHTML = ''; };
  $('scan-guardar').onclick = async () => {
    const fecha = $('entry-fecha').value || hoyFecha();
    const items = [];
    box.querySelectorAll('.scan-chk').forEach(chk => {
      if (!chk.checked) return;
      const i = Number(chk.dataset.i);
      const it = r.items[i];
      const val = box.querySelector(`.scan-cat[data-i="${i}"]`).value;
      const sep = val.indexOf(':');
      const modo = val.slice(0, sep), nombre = val.slice(sep + 1);
      if (modo === 'deuda') {
        items.push({ fecha, tipo: 'Por cobrar', grupo: 'POR COBRAR', categoria: nombre, monto: it.valor, descripcion: it.descripcion.toLowerCase() });
      } else {
        items.push({ fecha, tipo: 'Gasto', grupo: grupoDe(nombre, 'Gasto'), categoria: nombre, monto: it.valor, descripcion: it.descripcion.toLowerCase() });
      }
    });
    if (!items.length) return toast('No hay artículos marcados');
    try {
      const res = await api({ action: 'add_batch', items });
      toast(`✓ ${res.agregados} artículo(s) guardados en sus categorías`);
      box.classList.add('hidden');
      box.innerHTML = '';
      refreshState().then(() => { renderMini(); renderChips(); });
    } catch (e) { toast('Error: ' + e.message); }
  };
}

// ---------------- pestañas del resumen ----------------
let rtabActivo = 'mes';
function renderResTab(tab) {
  rtabActivo = tab;
  document.querySelectorAll('#res-tabs button').forEach(b =>
    b.classList.toggle('active', b.dataset.rtab === tab));
  ['mes', 'tend', 'patri', 'metas'].forEach(t =>
    $('rtab-' + t).classList.toggle('hidden', t !== tab));
  if (tab === 'mes') renderResumen();
  if (tab === 'tend') renderTendencias();
  if (tab === 'patri') { patriItems = null; renderPatrimonio(); }
  if (tab === 'metas') renderMetas();
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
  let p, inv;
  try { p = await api({ action: 'patrimonio_get' }); }
  catch (e) { box.innerHTML = `<div class="card">Sin conexión: ${e.message}</div>`; return; }
  try { inv = await api({ action: 'inversiones_get' }); }
  catch (e) { inv = { cuentas: [], aportes: [], itemsPatrimonio: [] }; }
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

  // --- inversiones 🪙 ---
  html += '<div class="card"><h3>🪙 Mis inversiones</h3>';
  if (!inv.cuentas.length) {
    html += '<p class="hint">Registra cada plata que metas a una inversión (Insights, BTC, Fiducuenta...) y la app calculará cuánto has ganado comparando con tu Patrimonio. 💡 Usa el <b>mismo nombre</b> que le pones al activo en tu patrimonio.</p>';
  } else {
    inv.cuentas.forEach(c => {
      const tieneValor = c.valorActual !== null;
      html += `
        <div class="inv-cuenta">
          <div class="inv-head"><b>${c.cuenta}</b>
            ${tieneValor && c.ganancia !== null ? `<span class="delta ${c.ganancia >= 0 ? 'pos' : 'neg'}">${c.ganancia >= 0 ? '▲' : '▼'} ${fmt(Math.abs(c.ganancia))}${c.rendimiento !== null ? ' (' + (c.ganancia >= 0 ? '+' : '−') + Math.abs(c.rendimiento) + '%)' : ''}</span>` : ''}
          </div>
          <div class="inv-datos">
            <span>💵 Aportado: <b>${fmt(c.aportado)}</b></span>
            <span>${tieneValor ? `📈 Vale hoy: <b>${fmt(c.valorActual)}</b>` : '📈 Valor: agrégalo en tu patrimonio con este mismo nombre'}</span>
          </div>
        </div>`;
    });
    html += `<p class="hint">El "vale hoy" sale de tu último registro de Patrimonio${inv.mesValor ? ' (' + mesCorto(inv.mesValor) + ')' : ''}.</p>`;
  }
  html += `
    <div class="cat-form" style="margin-top:10px">
      <input id="inv-cuenta" type="text" list="inv-sugerencias" placeholder="¿A cuál inversión? (ej: BTC)">
      <datalist id="inv-sugerencias">${(inv.itemsPatrimonio || []).map(i => `<option value="${i}">`).join('')}</datalist>
      <input id="inv-monto" type="text" inputmode="numeric" placeholder="¿Cuánto metiste? (negativo si retiraste)">
      <button id="inv-add" class="primary">+ Registrar aporte</button>
    </div>`;
  if (inv.aportes && inv.aportes.length) {
    html += '<details style="margin-top:10px"><summary class="hint" style="cursor:pointer">Ver últimos aportes</summary>';
    inv.aportes.slice(0, 10).forEach(a => {
      html += `<div class="patri-hist"><span>${a.fecha} · ${a.cuenta}</span><span><b>${a.monto < 0 ? '−' : '+'}${fmt(Math.abs(a.monto))}</b> <button class="del inv-del" data-id="${a.id}">✕</button></span></div>`;
    });
    html += '</details>';
  }
  html += '</div>';

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

  // eventos de inversiones
  const invAddBtn = $('inv-add');
  if (invAddBtn) invAddBtn.onclick = async () => {
    const cuenta = $('inv-cuenta').value.trim();
    const raw = ($('inv-monto').value || '').trim();
    const monto = (raw.startsWith('-') ? -1 : 1) * (parseInt(raw.replace(/\D/g, ''), 10) || 0);
    if (!cuenta || !monto) return toast('Escribe la inversión y el monto');
    try {
      await api({ action: 'inv_add', cuenta, monto });
      toast(`✓ Aporte registrado: ${fmt(Math.abs(monto))} en ${cuenta}`);
      renderPatrimonio();
    } catch (e) { toast('Error: ' + e.message); }
  };
  box.querySelectorAll('.inv-del').forEach(b => b.onclick = async (e) => {
    e.preventDefault();
    if (!confirm('¿Eliminar este aporte?')) return;
    try { await api({ action: 'inv_del', id: b.dataset.id }); toast('Eliminado'); renderPatrimonio(); }
    catch (err) { toast('Error: ' + err.message); }
  });

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

// ---------------- metas de ahorro 🎯 ----------------
function mesesHasta(fechaStr) {
  if (!fechaStr || !/^\d{4}-\d{2}/.test(fechaStr)) return null;
  const limite = new Date(fechaStr + 'T12:00:00');
  const hoy = new Date();
  return Math.max((limite.getFullYear() - hoy.getFullYear()) * 12 + limite.getMonth() - hoy.getMonth(), 0);
}

async function renderMetas() {
  const box = $('rtab-metas');
  const st = await refreshState();
  const metas = (st && st.metas) || [];
  let html = '';

  if (!metas.length) {
    html += '<div class="card"><p class="hint">Crea tu primera meta de ahorro: un viaje ✈️, la cuota inicial de tu casa 🏡, lo que sueñes. La app te dirá cuánto ahorrar cada mes y te lo recordará los días 1 y 15 💜</p></div>';
  }
  metas.forEach(m => {
    const pct = m.objetivo > 0 ? Math.min(Math.round(m.ahorrado / m.objetivo * 100), 100) : 0;
    const falta = Math.max(m.objetivo - m.ahorrado, 0);
    const meses = mesesHasta(m.fecha);
    const lograda = m.ahorrado >= m.objetivo;
    let plan = '';
    if (lograda) plan = '🎉 ¡META LOGRADA!';
    else if (meses === null) plan = `Te faltan ${fmt(falta)}`;
    else if (meses === 0) plan = `⏰ ¡La fecha llegó! Te faltan ${fmt(falta)}`;
    else plan = `Te faltan ${fmt(falta)} · ahorra ~<b>${fmt(Math.ceil(falta / meses))}/mes</b> (${meses} mes${meses > 1 ? 'es' : ''} restantes)`;
    html += `
      <div class="card meta-card ${lograda ? 'lograda' : ''}">
        <div class="meta-head">
          <h3>${m.nombre}</h3>
          <button class="del meta-del" data-id="${m.id}">✕</button>
        </div>
        <div class="info-meta">
          <span class="pct-grande">${pct}%</span>
          <span>${fmt(m.ahorrado)} de <b>${fmt(m.objetivo)}</b>${m.fecha ? ` · para el ${m.fecha}` : ''}</span>
        </div>
        <div class="barra alta"><div class="${lograda ? '' : 'meta'}" style="width:${pct}%; ${lograda ? '' : 'background:var(--chart-gasto)'}"></div></div>
        <p class="plan">${plan}</p>
        ${lograda ? '' : `<button class="secondary meta-abonar" data-id="${m.id}">💵 Abonar a esta meta</button>`}
      </div>`;
  });

  html += `
    <div class="card">
      <h3>➕ Nueva meta</h3>
      <label>¿Qué quieres lograr?</label>
      <input id="meta-nombre" type="text" placeholder="Ej: Viaje a San Andrés ✈️">
      <label>¿Cuánto necesitas?</label>
      <input id="meta-objetivo" type="text" inputmode="numeric" placeholder="Ej: 3.000.000">
      <label>¿Para cuándo? (opcional)</label>
      <input id="meta-fecha" type="date">
      <button id="meta-crear" class="primary" style="width:100%">Crear meta 🎯</button>
    </div>`;

  box.innerHTML = html;

  box.querySelectorAll('.meta-del').forEach(b => b.onclick = async () => {
    if (!confirm('¿Eliminar esta meta?')) return;
    try { await api({ action: 'meta_del', id: b.dataset.id }); toast('Meta eliminada'); renderMetas(); }
    catch (e) { toast('Error: ' + e.message); }
  });
  box.querySelectorAll('.meta-abonar').forEach(b => b.onclick = async () => {
    const v = prompt('¿Cuánto abonas a la meta?');
    if (v === null) return;
    const monto = parseInt(v.replace(/\D/g, ''), 10) || 0;
    if (!monto) return;
    try {
      const r = await api({ action: 'meta_abonar', id: b.dataset.id, monto });
      toast('✓ Abonado. Llevas ' + fmt(r.ahorrado));
      renderMetas();
    } catch (e) { toast('Error: ' + e.message); }
  });
  $('meta-crear').onclick = async () => {
    const nombre = $('meta-nombre').value.trim();
    const objetivo = parseInt(($('meta-objetivo').value || '').replace(/\D/g, ''), 10) || 0;
    const fecha = $('meta-fecha').value;
    if (!nombre || !objetivo) return toast('Ponle nombre y monto a tu meta');
    try {
      await api({ action: 'meta_add', nombre, objetivo, fecha });
      toast('✓ Meta creada: ' + nombre);
      renderMetas();
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
      <span class="emoji">${{ 'Ingreso': '💰', 'Por cobrar': '🤝', 'Abono': '💵', 'Guardo': '👝', 'Entrego': '📤', 'Reembolso': '🔄' }[m.tipo] || emoji(m.categoria)}</span>
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
function BIENVENIDA() {
  const n = prefs.nombre ? ` ${prefs.nombre}` : '';
  return `¡Hola${n}! 💜 Soy tu asesora financiera. Tengo acceso a tu presupuesto y todos tus movimientos. Pregúntame lo que quieras: "¿cómo voy este mes?", "¿en qué estoy gastando de más?", "¿cuánto puedo ahorrar?"`;
}

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
  addMsg(BIENVENIDA(), 'bot');
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
    const r = await api({ action: 'chat', message: text, history: c.msgs.slice(0, -1), nombre: prefs.nombre || '' });
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

async function configurarAlcancia(cat, p) {
  const a = (state && state.alcancias && state.alcancias[cat]) || {};
  const f = prompt(
    `🏦 Alcancía de "${cat.replace('Provisión ', '')}"\n\n` +
    `Cada mes se le suma tu aporte (${fmt(p.mensual)}).\n` +
    `¿Cuánto tenía YA ahorrado ANTES de empezar a contar? (fondo inicial)`,
    String(p.fondoInicial || 0));
  if (f === null) return;
  const fondo = parseInt(f.replace(/\D/g, ''), 10) || 0;
  const d = prompt('¿Desde qué mes empieza a ahorrar? (formato: 2026-01)', p.desde || '2026-01');
  if (d === null) return;
  if (!/^\d{4}-\d{2}$/.test(d.trim())) return toast('El mes debe ser como 2026-01');
  try {
    await api({ action: 'cat_fondo', categoria: cat, fondo, desde: d.trim() });
    toast('✓ Alcancía configurada');
    await refreshState(); renderCatsConfig();
  } catch (e) { toast('Error: ' + e.message); }
}

function cambiarGrupo(cat, grupoActual) {
  const nombres = { GASTOS: '🧾 Gasto fijo', OBLIGACIONES: '📌 Obligación', GUSTOS: '🛍️ Gusto', PROVISIONES: '🏦 Provisión (alcancía)', INGRESOS: '💰 Ingreso' };
  const acciones = Object.keys(nombres)
    .filter(g => g !== grupoActual)
    .map(g => ({
      label: nombres[g],
      fn: async () => {
        try {
          const r = await api({ action: 'cat_move', categoria: cat, grupo: g });
          toast(`✓ "${cat}" ahora es ${nombres[g]}. ${r.actualizados} movimiento(s) actualizados`);
          await refreshState(); renderCatsConfig(); renderChips();
        } catch (e) { toast('Error: ' + e.message); }
      }
    }));
  actionSheet(`¿A qué grupo mover "${cat}"?`, acciones);
}

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
    html = `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
              <button id="btn-reordenar" class="chip-btn">↕️ Reordenar</button>
              <span class="hint" style="flex:1">💡 o mantén presionada una categoría para más opciones (eliminar, cambiar de grupo...)</span>
            </div>` + html;
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

  const btnReord = $('btn-reordenar');
  if (btnReord) btnReord.onclick = () => {
    ordenMode = true;
    ordenLista = state.presupuesto.map(x => ({ ...x }));
    renderCatsConfig();
  };

  // mantener presionado → menú
  box.querySelectorAll('.presionable').forEach(el => longPress(el, () => {
    const cat = el.dataset.cat;
    const p = state.presupuesto.find(x => x.categoria === cat);
    const acciones = [];
    if (p && p.grupo === 'PROVISIONES') {
      acciones.push({ label: '🏦 Configurar alcancía (fondo y desde cuándo)', fn: () => configurarAlcancia(cat, p) });
    }
    acciones.push(
      { label: '📂 Cambiar de grupo', fn: () => cambiarGrupo(cat, p ? p.grupo : '') },
      { label: '↕️ Reordenar categorías', fn: () => { ordenMode = true; ordenLista = state.presupuesto.map(x => ({ ...x })); renderCatsConfig(); } },
      { label: '🗑️ Eliminar esta categoría', destructivo: true, fn: () => eliminarCategoria(cat) },
    );
    actionSheet(`${emoji(cat)} ${cat}`, acciones);
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
  $('cfg-nombre').value = prefs.nombre || '';
  $('cfg-nombre').onchange = () => {
    prefs.nombre = $('cfg-nombre').value.trim();
    savePrefs();
    renderChatBox();
    toast(prefs.nombre ? `✓ ¡Hola ${prefs.nombre}! 💜` : 'Nombre borrado');
  };
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
  initScan();
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
