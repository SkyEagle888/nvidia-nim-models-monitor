# ARCHITECTURE.md — NVIDIA Integrate Models Monitor

## System Topology

- **Runtime**: GitHub Actions (ubuntu-latest, Python 3.10)
- **Trigger**: Cron `17 1 * * *` UTC (daily) + manual `workflow_dispatch`
- **Data flow**: NVIDIA API → `monitor.py` → `models.json` / `CHANGELOG.json` / `MODELS.md` → Discord webhook + Git commit
- **Deployment pipeline**: `monitor` job → `deploy` job (GitHub Pages via `peaceiris/actions-gh-pages@v4`) + `deploy-cloudflare` job (Cloudflare Workers via `wrangler@3.99.0`)
- **GitHub Pages URL**: `https://skyeagle888.github.io/nvidia-integrate-models-monitor/`
- **Dashboard URL**: `https://skyeagle888.github.io/nvidia-integrate-models-monitor/dashboard/`

## Tech Stack & Dependencies

- **Language**: Python 3.10 (`monitor.py`)
- **Python deps**: `requests`, `pytz` (see `requirements.txt`)
- **Dashboard**: Vanilla HTML + Tailwind CSS (CDN) + vanilla JS (`dashboard/app.js`)
- **Landing page**: `index.html` — static HTML, Tailwind CSS CDN, Inter font
- **CI/CD**: GitHub Actions (`monitor.yml`)
  - `actions/checkout@v4`
  - `actions/setup-python@v5`
  - `peaceiris/actions-gh-pages@v4`
  - `npx wrangler@3.99.0`
- **No build tools, no bundlers, no package.json**

## Deployment & Infra

- **GitHub Actions workflow**: 3 jobs — `monitor` → `deploy` (GH Pages) + `deploy-cloudflare` (Workers)
- **GH Pages**: publishes entire repo root to `gh-pages` branch, `keep_files: true`, excludes `.github/**`
- **Cloudflare Workers**: static asset deployment, config generated inline (`wrangler.jsonc`)
- **Git commit**: `github-actions[bot]` commits with `[skip ci]` to prevent loops
- **Permissions**: `contents: write` (for commit + push)
- **Secrets**: `DISCORD_WEBHOOK_URL`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `GITHUB_TOKEN` (auto)

## Data Model & Schema

- **No database** — all state is file-based JSON/Markdown

### `models.json`
- Type: `string[]` — sorted array of model IDs (e.g. `"meta/llama-3.1-70b-instruct"`)
- Updated only when model list changes detected
- Last known state: 128 models tracked

### `CHANGELOG.json`
- Schema: `{ "changes": [ { "timestamp": ISO8601, "added": string[], "removed": string[], "total_models": int } ] }`
- Max 100 entries retained (`MAX_CHANGELOG_ENTRIES` in `monitor.py:15`)
- Entries appended on every detected change

### `MODELS.md`
- Auto-generated markdown grouped by provider (derived from `model.split('/')[0]`)
- Regenerated every run (timestamp refreshed)
- Format: `### 🏢 PROVIDER` headings with `- \`model-id\`` bullets

### External API Contract
- **Endpoint**: `GET https://integrate.api.nvidia.com/v1/models`
- **Response shape**: `{ "data": [ { "id": "provider/model-name", ... } ] }`
- **Usage**: Extract sorted `model['id']` list; compare against cached state
- **Business rules**:
  - Provider = first path segment before `/` (fallback: `"other"`)
  - Discord messages capped at 1900 chars, auto-split into parts
  - Initial run detected when `models.json` is empty/missing
