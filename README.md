# Tennis Hub

A Cricbuzz-style tennis app: live scores, results, upcoming matches, and ATP/WTA rankings.
It gets real data from a tennis API, kept safe behind a tiny serverless function so your
secret key never shows up in the browser.

## How it fits together

```
Browser (src/App.jsx)  --->  /api/tennis  (runs on Vercel's server)  --->  Tennis API
        shows scores          holds your secret key + fixes CORS         real live data
```

## Setup (do this with a parent — the sites ask for an account)

### 1. Get a free API key
1. Make an account at https://rapidapi.com
2. Search for a tennis API (for example "Tennis Live API" or "Tennis API - ATP WTA ITF").
3. Subscribe to its **Basic / Free** plan.
4. Copy your key (RapidAPI calls it `X-RapidAPI-Key`). **Keep it private.**

### 2. Put the code on GitHub
1. Make a new GitHub repo.
2. Upload this whole `tennis-hub` folder to it.

### 3. Deploy on Vercel
1. Go to https://vercel.com and click **Add New -> Project**.
2. Import your GitHub repo. Vercel auto-detects Vite — just click **Deploy**.

### 4. Add your secret key (the important part)
1. In Vercel: **Project -> Settings -> Environment Variables**.
2. Add these:
   - `RAPIDAPI_KEY` = your key from step 1
   - `RAPIDAPI_HOST` = the API's host, e.g. `tennis-live-api.p.rapidapi.com`
   - `RAPIDAPI_LIVE_PATH` = the live endpoint path, e.g. `/tennis/v2/extend/api/events/live`
3. Click **Redeploy** so the new settings take effect.

Your key lives only in Vercel's settings. It is never in the code and never sent to the browser.

## Finalize the data mapping (one quick step)

Every tennis API names its fields a little differently. To make the scores show up perfectly:

1. After deploying, open `https://YOUR-SITE.vercel.app/api/tennis?raw=1` in your browser.
2. Copy the JSON you see.
3. Paste it to Claude and say "map this to Tennis Hub."
   Claude will adjust `normalize()` in `api/tennis.js` to match your API exactly.

Until then, the app falls back to sample data if it can't read the live feed, so it always looks fine.

## Run it on your own computer (optional)

```bash
npm install
# copy .env.example to .env and paste your key
npm run dev
```

Then open the local address it prints (usually http://localhost:5173).

## Notes
- Free API tiers limit how many requests you get, so the app caches results for ~20 seconds
  and refreshes every 60 seconds. That is plenty for a scores app and easy on the free tier.
- Rankings are a built-in snapshot (they barely change day to day). You can wire them to a
  ranking endpoint later the same way.
