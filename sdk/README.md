# Stats SDK

Minified JS snippet for analytics. No npm install — copy the snippet into your project.

## Usage

1. Build the SDK: `yarn build:sdk` (outputs `build/sdk/stats.min.js`)
2. Copy the contents of `build/sdk/stats.min.js` into your project (e.g. `lib/stats.js`)
3. In your app entry:

```javascript
import stats from './lib/stats';

const s = stats.init({ pid: 'YOUR_PROJECT_ID' });
s.reportPage();
s.reportEvent('signup');
```

## API

- `init({ pid })` — Initialize with project ID. Returns `{ reportPage, reportEvent }`.
- `reportPage(path?)` — Report page view. Call on load; omit path for current path. SPA navigation is tracked automatically.
- `reportEvent(event)` — Report custom event.

## Token storage

Token is stored in `localStorage` under `stats-token-{pid}`. First-party, survives sessions. Server signs tokens; cannot be forged.
