const HOST = process.env.RAPIDAPI_HOST || 'tennis-api-atp-wta-itf.p.rapidapi.com';
const KEY = process.env.RAPIDAPI_KEY;

const SOURCES = [
  { path: '/tennis/v2/atp/fixtures', tour: 'ATP' },
  { path: '/tennis/v2/wta/fixtures', tour: 'WTA' },
];

async function grab(path) {
  const r = await fetch('https://' + HOST + path, {
    headers: { 'x-rapidapi-host': HOST, 'x-rapidapi-key': KEY },
  });
  const text = await r.text();
  if (!r.ok) return { ok: false, status: r.status, says: text.slice(0, 200) };
  try {
    return { ok: true, json: JSON.parse(text) };
  } catch (e) {
    return { ok: false, status: 200, says: 'not JSON' };
  }
}

function toMatch(m, tour) {
  const nameOf = (p, fallback) => {
    if (!p) return fallback;
    if (typeof p === 'string') return p;
    return p.name || fallback;
  };
  const countryOf = (p) => (p && p.countryAcr && p.countryAcr !== 'N/A' ? p.countryAcr : null);

  const n1 = nameOf(m.player1, 'Player 1');
  const n2 = nameOf(m.player2, 'Player 2');
  const c1 = countryOf(m.player1);
  const c2 = countryOf(m.player2);

  const isDoubles = n1.includes('/') || n2.includes('/');
  const seedOf = (s) => (s === null || s === undefined || s === '' ? undefined : String(s));

  return {
    tour,
    tournament: isDoubles ? tour + ' Doubles' : tour + ' Singles',
    round: '',
    status: m.live ? 'live' : 'scheduled',
    p1: { name: c1 ? n1 + ' (' + c1 + ')' : n1, seed: seedOf(m.seed1) },
    p2: { name: c2 ? n2 + ' (' + c2 + ')' : n2, seed: seedOf(m.seed2) },
    sets: [],
    server: null,
    pts: null,
    time: m.timeGame || m.date || null,
    winner: null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60');

  if (!KEY) {
    res.status(200).json({ ok: false, problem: 'RAPIDAPI_KEY is not set in Vercel.', matches: [] });
    return;
  }

  const matches = [];
  const notes = [];
  let rawSample = null;

  for (const src of SOURCES) {
    let r;
    try {
      r = await grab(src.path);
    } catch (e) {
      notes.push({ path: src.path, error: String(e.message || e) });
      continue;
    }

    if (!r.ok) {
      notes.push({ path: src.path, status: r.status, says:
