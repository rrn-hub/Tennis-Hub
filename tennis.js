// ============================================================
//  /api/tennis  —  Vercel Serverless Function
// ------------------------------------------------------------
//  This runs on Vercel's SERVER, not in the browser. That means:
//    1. Your secret API key stays hidden (never sent to the browser)
//    2. It fixes CORS (the browser is allowed to call your own site)
//
//  It reads settings from Environment Variables you set in Vercel:
//    RAPIDAPI_KEY        (required)  your secret RapidAPI key
//    RAPIDAPI_HOST       (optional)  defaults to the Tennis Live API host
//    RAPIDAPI_LIVE_PATH  (optional)  the endpoint path for live matches
//
//  Debug tip: visit  /api/tennis?raw=1  to see the EXACT data the
//  tennis API returns. Copy that and send it to Claude to finalize
//  the field mapping in normalize() below.
// ============================================================

const HOST = process.env.RAPIDAPI_HOST || 'tennis-live-api.p.rapidapi.com';
const KEY = process.env.RAPIDAPI_KEY;
const LIVE_PATH = process.env.RAPIDAPI_LIVE_PATH || '/tennis/v2/extend/api/events/live';

async function callRapid(path) {
  const url = 'https://' + HOST + path;
  const r = await fetch(url, {
    headers: {
      'x-rapidapi-host': HOST,
      'x-rapidapi-key': KEY,
      'Content-Type': 'application/json',
    },
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error('Upstream ' + r.status + ': ' + body.slice(0, 200));
  }
  return r.json();
}

// Pick the first value that exists from a list of possible field names.
const pick = (obj, keys, fallback) => {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== '') return obj[k];
  }
  return fallback;
};

// Turn one raw match from the API into the shape our app expects.
// NOTE: tennis APIs all name their fields differently, so this tries
// several common names. Once you see a real response (via ?raw=1),
// tweak the key lists below to match exactly.
function normalize(m) {
  const name1 = pick(m, ['event_first_player', 'home', 'player1', 'p1', 'homeTeam', 'first_player'], 'Player 1');
  const name2 = pick(m, ['event_second_player', 'away', 'player2', 'p2', 'awayTeam', 'second_player'], 'Player 2');

  const rawStatus = String(pick(m, ['event_status', 'status', 'match_status', 'state'], '')).toLowerCase();
  let status = 'scheduled';
  if (/(live|in ?play|inprogress|1st|2nd|3rd|set)/.test(rawStatus)) status = 'live';
  else if (/(finished|final|ended|completed|ft|walkover|retired)/.test(rawStatus)) status = 'final';

  // Sets: many APIs give an array like [{ first: 6, second: 4 }, ...]
  let sets = [];
  const rawSets = pick(m, ['scores', 'sets', 'periods', 'setScores'], null);
  if (Array.isArray(rawSets)) {
    sets = rawSets.map((s) => ({
      p1: Number(pick(s, ['score_first', 'first', 'home', 'p1', 'homeScore'], 0)) || 0,
      p2: Number(pick(s, ['score_second', 'second', 'away', 'p2', 'awayScore'], 0)) || 0,
    }));
  }

  const tourRaw = String(pick(m, ['event_type_type', 'tour', 'category', 'competition'], '')).toUpperCase();
  let tour = 'CH';
  if (tourRaw.includes('ATP')) tour = 'ATP';
  else if (tourRaw.includes('WTA')) tour = 'WTA';

  const serveRaw = String(pick(m, ['event_serve', 'server', 'serving'], '')).toLowerCase();
  let server = null;
  if (serveRaw.includes('first') || serveRaw === '1' || serveRaw === 'home') server = 1;
  else if (serveRaw.includes('second') || serveRaw === '2' || serveRaw === 'away') server = 2;

  const winRaw = String(pick(m, ['event_winner', 'winner'], '')).toLowerCase();
  let winner = null;
  if (winRaw.includes('first') || winRaw === '1' || winRaw === 'home') winner = 1;
  else if (winRaw.includes('second') || winRaw === '2' || winRaw === 'away') winner = 2;

  const pts = status === 'live'
    ? {
        p1: String(pick(m, ['event_game_result_first', 'p1_points', 'homePoints'], '0')),
        p2: String(pick(m, ['event_game_result_second', 'p2_points', 'awayPoints'], '0')),
      }
    : null;

  return {
    tour,
    tournament: pick(m, ['tournament_name', 'tournament', 'league', 'competition_name'], 'Tennis'),
    event: pick(m, ['event_type_type', 'event'], ''),
    round: pick(m, ['tournament_round', 'round', 'round_name'], ''),
    status,
    p1: { name: name1 },
    p2: { name: name2 },
    sets,
    server,
    pts,
    time: pick(m, ['event_time', 'start_time', 'time', 'scheduled'], null),
    winner,
  };
}

export default async function handler(req, res) {
  // allow the browser (and quick testing) to read this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=20'); // cache 20s to save free-tier requests

  if (!KEY) {
    res.status(500).json({ error: 'RAPIDAPI_KEY is not set in Vercel environment variables.' });
    return;
  }

  try {
    const upstream = await callRapid(LIVE_PATH);

    // Debug mode: /api/tennis?raw=1  -> see the exact upstream shape
    if (req.query && req.query.raw) {
      res.status(200).json(upstream);
      return;
    }

    // The list of matches can live under different keys depending on the API.
    const list = Array.isArray(upstream)
      ? upstream
      : (upstream.result || upstream.data || upstream.matches || upstream.events || []);

    const matches = list.map(normalize);
    res.status(200).json({ matches, count: matches.length });
  } catch (err) {
    res.status(502).json({ error: String(err.message || err), matches: [] });
  }
}
