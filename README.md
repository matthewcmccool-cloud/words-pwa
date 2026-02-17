# Words

A dead simple PWA for saving words you hear throughout the day. Drop a word in, Claude pulls the definition, done.

## Deploy

The fastest way — deploy to Vercel:

```bash
npm i -g vercel
cd words-pwa
vercel
```

Or Netlify:
```bash
npm i -g netlify-cli
cd words-pwa
netlify deploy --prod --dir=.
```

Or literally any static host (GitHub Pages, Cloudflare Pages, etc). It's just static files.

## Setup

1. Deploy the app
2. Open it on your phone in Safari/Chrome
3. Tap ⚙ and paste your Claude API key (get one at console.anthropic.com)
4. Add to Home Screen:
   - **iOS**: Safari → Share → "Add to Home Screen"
   - **Android**: Chrome → Menu → "Add to Home Screen"

That's it. It now lives on your home screen like a native app.

## Files

```
index.html      — the entire app
manifest.json   — PWA config
sw.js           — service worker (offline support)
icons/          — app icons
```

## Notes

- API key stored locally on device only — never sent anywhere except Anthropic
- Words persist in localStorage — survives app restarts, no account needed
- Works offline (except fetching new definitions obviously)
- No tracking, no ads, no monetization, no bullshit
