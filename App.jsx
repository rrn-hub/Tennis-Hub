import React, { useState, useEffect, useRef } from 'react';

/* ============================== SVG ICONS ============================== */
const TennisBallIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M4.5 5.5C7 8 8.5 11 8.5 14.5 8.5 16.5 8 18.5 6.8 20" />
    <path d="M19.5 5.5C17 8 15.5 11 15.5 14.5c0 2 .5 4 1.7 5.5" />
  </svg>
);
const LiveDotIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>
);
const TrophyIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const ListIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MapPinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const RefreshIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

/* ============================== CONSTANTS ============================== */
const TOUR = {
  ATP: { label: 'ATP', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  WTA: { label: 'WTA', cls: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  CH:  { label: 'CH',  cls: 'bg-slate-500/20 text-slate-300 border-slate-500/40' },
};

// Fallback snapshot used only if the live web fetch fails
const SNAPSHOT = [
  { id: 1, tour: 'ATP', tournament: 'Wimbledon', event: "Men's Singles", round: 'Semi-Final', status: 'live',
    p1: { name: 'Jannik Sinner', seed: 1 }, p2: { name: 'Alexander Zverev', seed: 3 },
    sets: [{ p1: 5, p2: 4 }], server: 1, pts: { p1: '30', p2: '15' } },
  { id: 2, tour: 'ATP', tournament: 'Umag', event: "Men's Singles", round: 'Round of 16', status: 'live',
    p1: { name: 'Marco Cecchinato' }, p2: { name: 'Genaro Olivieri' },
    sets: [{ p1: 6, p2: 2 }, { p1: 2, p2: 1 }], server: 2, pts: { p1: '15', p2: '40' } },
  { id: 3, tour: 'WTA', tournament: 'Athens', event: "Women's Singles", round: 'Round of 16', status: 'live',
    p1: { name: 'Nao Hibino' }, p2: { name: 'Miriana Tona' },
    sets: [{ p1: 6, p2: 4 }, { p1: 5, p2: 0 }], server: 1, pts: { p1: '40', p2: '0' } },
  { id: 20, tour: 'WTA', tournament: 'Athens', event: "Women's Singles", round: 'Round of 16', status: 'final',
    p1: { name: 'Aoi Ito' }, p2: { name: 'Yasmine Mansouri' },
    sets: [{ p1: 6, p2: 4 }, { p1: 6, p2: 0 }], winner: 1 },
  { id: 40, tour: 'WTA', tournament: 'Newport 125K', event: "Women's Singles", round: 'Quarter-Final', status: 'scheduled',
    p1: { name: 'Katie Volynets' }, p2: { name: 'Tatjana Maria' }, time: '9:40 PM' },
];

const RANKINGS = {
  ATP: [
    { rank: 1, name: 'Jannik Sinner', pts: 13450 }, { rank: 2, name: 'Carlos Alcaraz', pts: 9460 },
    { rank: 3, name: 'Alexander Zverev', pts: 7190 }, { rank: 4, name: 'Felix Auger-Aliassime', pts: 4390 },
    { rank: 5, name: 'Ben Shelton', pts: 4160 }, { rank: 6, name: 'Alex de Minaur', pts: 4110 },
    { rank: 7, name: 'Taylor Fritz', pts: 3765 }, { rank: 8, name: 'Novak Djokovic', pts: 3760 },
    { rank: 9, name: 'Daniil Medvedev', pts: 3580 }, { rank: 10, name: 'Flavio Cobolli', pts: 3460 },
    { rank: 11, name: 'Alexander Bublik', pts: 2620 }, { rank: 12, name: 'Casper Ruud', pts: 2425 },
    { rank: 13, name: 'Andrey Rublev', pts: 2420 }, { rank: 14, name: 'Jiri Lehecka', pts: 2360 },
    { rank: 15, name: 'Lorenzo Musetti', pts: 2325 },
  ],
  WTA: [
    { rank: 1, name: 'Aryna Sabalenka', pts: 9090 }, { rank: 2, name: 'Elena Rybakina', pts: 8143 },
    { rank: 3, name: 'Iga Swiatek', pts: 6409 }, { rank: 4, name: 'Jessica Pegula', pts: 5881 },
    { rank: 5, name: 'Mirra Andreeva', pts: 5653 }, { rank: 6, name: 'Amanda Anisimova', pts: 5523 },
    { rank: 7, name: 'Coco Gauff', pts: 4879 }, { rank: 8, name: 'Elina Svitolina', pts: 4471 },
    { rank: 9, name: 'Karolina Muchova', pts: 3878 }, { rank: 10, name: 'Victoria Mboko', pts: 3670 },
    { rank: 11, name: 'Belinda Bencic', pts: 3385 }, { rank: 12, name: 'Linda Noskova', pts: 3359 },
    { rank: 13, name: 'Marta Kostyuk', pts: 3156 }, { rank: 14, name: 'Naomi Osaka', pts: 2846 },
    { rank: 15, name: 'Diana Shnaider', pts: 2458 },
  ],
};

/* ============================== HELPERS ============================== */
const initials = (name) => {
  const parts = String(name).replace(/\./g, '').split(' ').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  return (parts[0]?.[0] || '') + (last[0] || '');
};
const avatarGradient = (name) => {
  const grads = [
    'from-emerald-400 to-green-600', 'from-blue-400 to-indigo-600',
    'from-pink-400 to-rose-600', 'from-amber-400 to-orange-600',
    'from-purple-400 to-fuchsia-600', 'from-cyan-400 to-teal-600',
  ];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % grads.length;
  return grads[h];
};
const TourBadge = ({ tour }) => {
  const info = TOUR[tour] || TOUR.CH;
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${info.cls}`}>{info.label}</span>;
};

/* --- Parse the JSONL that the live web-search call returns --- */
const normalizeMatch = (o) => {
  const sets = Array.isArray(o.sets) ? o.sets.map((s) =>
    Array.isArray(s) ? { p1: Number(s[0]) || 0, p2: Number(s[1]) || 0 }
                      : { p1: Number(s?.p1) || 0, p2: Number(s?.p2) || 0 }
  ) : [];
  const ptsArr = Array.isArray(o.pts) ? { p1: String(o.pts[0] ?? '0'), p2: String(o.pts[1] ?? '0') } : null;
  const status = ['live', 'final', 'scheduled'].includes(o.status) ? o.status : 'scheduled';
  return {
    tour: ['ATP', 'WTA', 'CH'].includes(o.tour) ? o.tour : 'CH',
    tournament: o.tournament || 'Tennis',
    event: o.event || '',
    round: o.round || '',
    status,
    p1: { name: typeof o.p1 === 'string' ? o.p1 : (o.p1?.name || 'Player 1'), seed: o.p1?.seed },
    p2: { name: typeof o.p2 === 'string' ? o.p2 : (o.p2?.name || 'Player 2'), seed: o.p2?.seed },
    sets,
    server: o.server === 1 ? 1 : o.server === 2 ? 2 : null,
    pts: status === 'live' ? (ptsArr || { p1: '0', p2: '0' }) : null,
    time: o.time && o.time !== 'null' ? o.time : null,
    winner: o.winner === 1 ? 1 : o.winner === 2 ? 2 : null,
  };
};

/* ============================== MATCH CARD ============================== */
const MatchCard = ({ match, onClick }) => {
  const live = match.status === 'live';
  const isFinal = match.status === 'final';
  const p1Win = match.winner === 1, p2Win = match.winner === 2;

  const setsFor = (who) => (match.sets || []).map((s) => ({
    val: who === 1 ? s.p1 : s.p2,
    win: (who === 1 ? s.p1 : s.p2) > (who === 1 ? s.p2 : s.p1),
  }));

  const PlayerRow = ({ player, who, dim, bold }) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGradient(player.name)} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
          {initials(player.name)}
        </div>
        <span className={`text-sm truncate ${dim ? 'text-slate-500' : 'text-white'} ${bold ? 'font-bold' : 'font-medium'}`}>
          {player.name}{player.seed ? <span className="text-slate-500 font-normal"> [{player.seed}]</span> : ''}
        </span>
        {live && match.server === who && <TennisBallIcon className="w-3.5 h-3.5 text-lime-400 shrink-0 animate-pulse" />}
      </div>
      <div className="flex items-center gap-1.5 shrink-0 pl-2">
        {setsFor(who).map((s, i) => (
          <span key={i} className={`w-5 text-center text-sm tabular-nums ${s.win ? 'text-lime-400 font-bold' : 'text-slate-300'}`}>{s.val}</span>
        ))}
        {live && match.pts && (
          <span className="w-7 text-center text-sm font-bold text-white bg-lime-500/20 rounded ml-0.5 tabular-nums">{match.pts[who === 1 ? 'p1' : 'p2']}</span>
        )}
      </div>
    </div>
  );

  return (
    <button onClick={() => onClick(match)}
      className="w-full text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-2xl p-3 transition-all hover:scale-[1.01] active:scale-[0.99]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <TourBadge tour={match.tour} />
          <span className="text-[11px] text-slate-400 truncate">{match.tournament}{match.round ? ' · ' + match.round : ''}</span>
        </div>
        {live ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 shrink-0">
            <LiveDotIcon className="w-2 h-2 animate-pulse" /> LIVE
          </span>
        ) : isFinal ? (
          <span className="text-[10px] font-semibold text-slate-500 shrink-0">COMPLETED</span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 shrink-0">
            <ClockIcon className="w-3 h-3" /> {match.time || 'Upcoming'}
          </span>
        )}
      </div>
      <PlayerRow player={match.p1} who={1} dim={p2Win} bold={p1Win} />
      <PlayerRow player={match.p2} who={2} dim={p1Win} bold={p2Win} />
    </button>
  );
};

/* ============================== FEATURED CARD ============================== */
const FeaturedCard = ({ match, onClick }) => {
  const PlayerBig = ({ player, who }) => (
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradient(player.name)} flex items-center justify-center text-sm font-bold text-white shrink-0 ring-2 ring-white/10`}>
        {initials(player.name)}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-white font-bold truncate">{player.name}</p>
          {match.server === who && <TennisBallIcon className="w-4 h-4 text-lime-300 animate-pulse shrink-0" />}
        </div>
        {player.seed && <p className="text-white/60 text-xs">Seed [{player.seed}]</p>}
      </div>
    </div>
  );
  return (
    <button onClick={() => onClick(match)}
      className="w-full text-left rounded-3xl p-4 mb-4 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 shadow-xl shadow-green-900/40 relative overflow-hidden transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <div className="absolute -right-6 -top-6 opacity-15"><TennisBallIcon className="w-32 h-32 text-white" /></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white truncate">{match.tournament}</span>
            {match.round && <span className="text-[11px] text-white/80 truncate">{match.round}</span>}
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-red-500/80 px-2 py-0.5 rounded-full shrink-0">
            <LiveDotIcon className="w-2 h-2 animate-pulse" /> LIVE
          </span>
        </div>
        <div className="space-y-3">
          {[1, 2].map((who) => {
            const player = who === 1 ? match.p1 : match.p2;
            return (
              <div key={who} className="flex items-center justify-between gap-2">
                <PlayerBig player={player} who={who} />
                <div className="flex items-center gap-2 shrink-0">
                  {(match.sets || []).map((s, i) => {
                    const v = who === 1 ? s.p1 : s.p2, o = who === 1 ? s.p2 : s.p1;
                    return <span key={i} className={`text-lg font-bold tabular-nums ${v > o ? 'text-lime-200' : 'text-white/70'}`}>{v}</span>;
                  })}
                  {match.pts && <span className="w-9 text-center text-lg font-black text-white bg-white/20 rounded-lg">{match.pts[who === 1 ? 'p1' : 'p2']}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-1 mt-3 text-white/80 text-xs font-medium">
          Tap for match details <ChevronRightIcon className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};

/* ============================== MATCH DETAIL ============================== */
const MatchDetail = ({ match, onClose }) => {
  if (!match) return null;
  const live = match.status === 'live';
  const setCount = (match.sets || []).length;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700/50 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-green-700 to-emerald-600 p-5 rounded-t-3xl sticky top-0">
          <div className="flex justify-between items-start mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <TourBadge tour={match.tour} />
                <span className="text-white/90 text-sm font-semibold truncate">{match.tournament}</span>
              </div>
              <p className="text-white/70 text-xs mt-0.5 truncate">{[match.event, match.round].filter(Boolean).join(' · ')}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white bg-white/10 rounded-full p-1.5 shrink-0"><CloseIcon className="w-4 h-4" /></button>
          </div>
          {live && <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-red-500/80 px-2 py-0.5 rounded-full w-fit"><LiveDotIcon className="w-2 h-2 animate-pulse" /> LIVE</span>}
          {match.status === 'scheduled' && <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-amber-500/80 px-2 py-0.5 rounded-full w-fit"><ClockIcon className="w-3 h-3" /> Starts {match.time || 'soon'}</span>}
          {match.status === 'final' && <span className="text-[11px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full w-fit inline-block">COMPLETED</span>}
        </div>

        <div className="p-5">
          {match.status !== 'scheduled' ? (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="flex items-center px-4 py-2 border-b border-slate-700/50 text-[11px] text-slate-400 font-medium">
                <span className="flex-1">Player</span>
                {Array.from({ length: setCount }).map((_, i) => <span key={i} className="w-6 text-center">S{i + 1}</span>)}
                {live && match.pts && <span className="w-8 text-center">Pts</span>}
              </div>
              {[1, 2].map((who) => {
                const player = who === 1 ? match.p1 : match.p2;
                const isWin = match.winner === who;
                return (
                  <div key={who} className="flex items-center px-4 py-3 border-b border-slate-700/30 last:border-0">
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient(player.name)} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>{initials(player.name)}</div>
                      <span className={`text-sm truncate ${isWin ? 'text-lime-400 font-bold' : 'text-white font-medium'}`}>{player.name}</span>
                      {isWin && <CheckIcon className="w-4 h-4 text-lime-400 shrink-0" />}
                      {live && match.server === who && <TennisBallIcon className="w-3.5 h-3.5 text-lime-400 animate-pulse shrink-0" />}
                    </div>
                    {(match.sets || []).map((s, i) => {
                      const v = who === 1 ? s.p1 : s.p2, o = who === 1 ? s.p2 : s.p1;
                      return <span key={i} className={`w-6 text-center text-sm tabular-nums ${v > o ? 'text-lime-400 font-bold' : 'text-slate-300'}`}>{v}</span>;
                    })}
                    {live && match.pts && <span className="w-8 text-center text-sm font-bold text-white">{match.pts[who === 1 ? 'p1' : 'p2']}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 text-center">
              <ClockIcon className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{match.p1.name}</p>
              <p className="text-slate-500 text-sm my-1">vs</p>
              <p className="text-white font-semibold">{match.p2.name}</p>
              {match.time && <p className="text-amber-400 text-sm mt-3 font-medium">Scheduled to start at {match.time}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0"><p className="text-[10px] text-slate-500">Tournament</p><p className="text-sm text-white font-medium truncate">{match.tournament}</p></div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-2">
              <TrophyIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0"><p className="text-[10px] text-slate-500">Round</p><p className="text-sm text-white font-medium truncate">{match.round || '—'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================== RANKINGS ============================== */
const Rankings = () => {
  const [tour, setTour] = useState('ATP');
  const list = RANKINGS[tour];
  const max = list[0].pts;
  return (
    <div>
      <div className="flex bg-slate-800/60 rounded-xl p-1 mb-4">
        {['ATP', 'WTA'].map((tt) => (
          <button key={tt} onClick={() => setTour(tt)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tour === tt ? (tt === 'ATP' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white') : 'text-slate-400'}`}>
            {tt} Rankings
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((p) => (
          <div key={p.rank} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${p.rank === 1 ? 'bg-amber-400 text-slate-900' : p.rank <= 3 ? 'bg-slate-300 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>{p.rank}</div>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(p.name)} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>{initials(p.name)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{p.name}</p>
              <div className="h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div className={`h-full rounded-full ${tour === 'ATP' ? 'bg-blue-400' : 'bg-pink-400'}`} style={{ width: `${(p.pts / max) * 100}%` }} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white font-bold text-sm tabular-nums">{p.pts.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">points</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-slate-500 text-[11px] mt-4">Rankings snapshot · updated weekly on tour</p>
    </div>
  );
};

/* ============================== MAIN APP ============================== */
const TennisHub = () => {
  const [tab, setTab] = useState('live');
  const [matches, setMatches] = useState(SNAPSHOT);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState('loading'); // 'loading' | 'live' | 'demo'
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');
  const fetchingRef = useRef(false);

  /* --- Real live fetch: ask Claude (with web search) for current scores --- */
  const fetchLiveScores = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      // Calls OUR serverless proxy at /api/tennis, which safely holds the
      // RapidAPI key on the server and returns clean, normalized match data.
      const res = await fetch('/api/tennis');
      if (!res.ok) throw new Error('Proxy error ' + res.status);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.matches || []);
      const parsed = rawList.map((m, i) => ({ ...normalizeMatch(m), id: i + 1 }));
      if (parsed.length === 0) throw new Error('No matches returned');

      setMatches(parsed);
      setDataMode('live');
      setLastUpdated(new Date());
      setError('');
    } catch (e) {
      setError('Live scores unavailable right now — showing sample data. Tap refresh to retry.');
      setDataMode((m) => (m === 'live' ? 'live' : 'demo'));
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  // fetch on mount + auto-refresh every 60s
  useEffect(() => {
    fetchLiveScores();
    const iv = setInterval(fetchLiveScores, 60000);
    return () => clearInterval(iv);
  }, []);

  // keep the open modal synced with refreshed data
  useEffect(() => {
    if (selected) {
      const fresh = matches.find((m) => m.id === selected.id);
      setSelected(fresh || null);
    }
  }, [matches]); // eslint-disable-line

  const live = matches.filter((m) => m.status === 'live');
  const results = matches.filter((m) => m.status === 'final');
  const upcoming = matches.filter((m) => m.status === 'scheduled');
  const featured = live[0];

  const filterFn = (m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.p1.name.toLowerCase().includes(q) || m.p2.name.toLowerCase().includes(q) || m.tournament.toLowerCase().includes(q);
  };

  const tabs = [
    { id: 'live', label: 'Live', icon: LiveDotIcon, count: live.length },
    { id: 'results', label: 'Results', icon: CheckIcon, count: results.length },
    { id: 'upcoming', label: 'Upcoming', icon: ClockIcon, count: upcoming.length },
    { id: 'rankings', label: 'Rankings', icon: ListIcon },
  ];

  const statusLine = () => {
    if (dataMode === 'loading') return 'Fetching live scores…';
    if (dataMode === 'demo') return 'Sample data';
    if (lastUpdated) return 'Live · updated ' + lastUpdated.toLocaleTimeString();
    return 'Live';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-md mx-auto pb-24">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 pt-5 pb-4 rounded-b-3xl shadow-lg shadow-green-900/30 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-xl p-1.5"><TennisBallIcon className="w-6 h-6 text-lime-200" /></div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none">Tennis Hub</h1>
                <p className="text-white/70 text-[10px] font-medium">{statusLine()}</p>
              </div>
            </div>
            <button onClick={fetchLiveScores} disabled={loading}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-60">
              <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs font-bold">{loading ? 'Loading' : 'Refresh'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
            <SearchIcon className="w-4 h-4 text-white/70" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search players or tournaments..."
              className="bg-transparent text-sm text-white placeholder-white/60 outline-none flex-1" />
            {search && <button onClick={() => setSearch('')}><CloseIcon className="w-4 h-4 text-white/70" /></button>}
          </div>
        </div>

        {/* error / demo banner */}
        {error && dataMode === 'demo' && (
          <div className="mx-4 mt-3 bg-amber-500/15 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 text-xs">{error}</div>
        )}

        {/* TABS */}
        <div className="flex gap-1 px-4 mt-4 overflow-x-auto no-scrollbar">
          {tabs.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.id;
            return (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${active ? 'bg-lime-400 text-slate-900' : 'bg-slate-800/60 text-slate-400'}`}>
                <Icon className="w-3.5 h-3.5" />
                {tb.label}
                {tb.count != null && <span className={`text-[10px] px-1.5 rounded-full ${active ? 'bg-slate-900/20' : 'bg-slate-700'}`}>{tb.count}</span>}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="px-4 mt-4">
          {loading && dataMode === 'loading' ? (
            <div className="space-y-3">
              <div className="h-40 bg-slate-800/50 rounded-3xl animate-pulse" />
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {tab === 'live' && (
                <div>
                  {featured && filterFn(featured) && <FeaturedCard match={featured} onClick={setSelected} />}
                  <div className="space-y-2">
                    {live.filter((m) => m !== featured && filterFn(m)).map((m) => <MatchCard key={m.id} match={m} onClick={setSelected} />)}
                  </div>
                  {live.filter(filterFn).length === 0 && <EmptyState text={search ? 'No live matches match your search' : 'No live matches right now'} />}
                </div>
              )}
              {tab === 'results' && (
                <div className="space-y-2">
                  {results.filter(filterFn).map((m) => <MatchCard key={m.id} match={m} onClick={setSelected} />)}
                  {results.filter(filterFn).length === 0 && <EmptyState text="No completed matches found" />}
                </div>
              )}
              {tab === 'upcoming' && (
                <div className="space-y-2">
                  {upcoming.filter(filterFn).map((m) => <MatchCard key={m.id} match={m} onClick={setSelected} />)}
                  {upcoming.filter(filterFn).length === 0 && <EmptyState text="No upcoming matches found" />}
                </div>
              )}
              {tab === 'rankings' && <Rankings />}
            </>
          )}
        </div>
      </div>

      <MatchDetail match={selected} onClose={() => setSelected(null)} />
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};

const EmptyState = ({ text }) => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 text-center mt-2">
    <TennisBallIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
    <p className="text-slate-500 text-sm">{text}</p>
  </div>
);

export default TennisHub;
