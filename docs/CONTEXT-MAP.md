# CONTEXT-MAP.md — NVIDIA Integrate Models Monitor

## Module Mappings

### Core Monitor
- `monitor.py` | Main orchestrator: fetch, compare, notify, persist | Lines 1-169 | Validated: ✅ 2026-05-18
- `models.json` | Persisted sorted model ID array (last known state) | Auto-generated | Validated: ✅ 2026-05-18
- `CHANGELOG.json` | Change history with timestamps (max 100 entries) | Auto-generated | Validated: ✅ 2026-05-18
- `MODELS.md` | Human-readable model list grouped by provider | Auto-generated | Validated: ✅ 2026-05-18
- `requirements.txt` | Python deps: requests, pytz | Lines 1-2 | Validated: ✅ 2026-05-18

### Dashboard
- `dashboard/index.html` | Dashboard HTML shell | Validated: ✅ 2026-05-18
- `dashboard/app.js` | Dashboard logic: search, filter, charts, pagination | Validated: ✅ 2026-05-18
- `dashboard/styles.css` | Dashboard stylesheet | Validated: ✅ 2026-05-18
- `dashboard/README.md` | Dashboard documentation | Validated: ✅ 2026-05-18

### Landing Page
- `index.html` | Static landing page with stats, features, CTA | Lines 1-357 | Validated: ✅ 2026-05-18

### CI/CD
- `.github/workflows/monitor.yml` | GitHub Actions: monitor + deploy (GH Pages + Cloudflare) | Lines 1-86 | Validated: ✅ 2026-05-18

### Config
- `.gitignore` | Ignores `__pycache__/`, `*.pyc` | Validated: ✅ 2026-05-18
- `README.md` | Project documentation with setup instructions | Validated: ✅ 2026-05-18

## File Responsibilities

| File | Responsibility |
|---|---|
| `monitor.py` | Fetch NVIDIA API, diff models, send Discord alerts, update files |
| `models.json` | Single source of truth for last-known model list |
| `CHANGELOG.json` | Append-only change log with add/remove events |
| `MODELS.md` | Human-readable provider-grouped model listing |
| `requirements.txt` | Pin Python runtime dependencies |
| `index.html` | Public landing page (GitHub Pages / Cloudflare) |
| `dashboard/` | Interactive web dashboard for model exploration |
| `.github/workflows/monitor.yml` | Automation: cron trigger, run monitor, deploy artifacts |

## Validation Status

- All source files validated against current `master` branch (commit `ccd953d`)
- No linting or type-checking pipeline configured
- Validation method: manual code review + runtime observation via GitHub Actions
