# PLAN.md — Implementation Roadmap

> Derived from `docs/SCOPE.md`. All functional requirements mapped to implementation tasks.

## Phase 1: Core Monitoring — ✅ Complete

- [x] **FR-01**: Fetch model list from NVIDIA API (`monitor.py:fetch_models()` — line 17)
- [x] **FR-02**: Diff current vs cached models (`monitor.py:main()` — lines 135-136)
- [x] **FR-03**: Discord webhook notifications (`monitor.py:send_discord_message()` — line 98)
- [x] **FR-04**: Daily status update when no changes (`monitor.py:main()` — line 141)
- [x] **FR-05**: Persist state to `models.json` (`monitor.py:save_models()` — line 36)
- [x] **FR-06**: Change history in `CHANGELOG.json` (`monitor.py:update_changelog()` — line 62)
- [x] **FR-07**: Generate `MODELS.md` by provider (`monitor.py:update_markdown()` — line 74)

## Phase 2: CI/CD Automation — ✅ Complete

- [x] **FR-08**: Auto-commit with `[skip ci]` (`.github/workflows/monitor.yml` — lines 37-43)
- [x] **FR-12**: Manual trigger via `workflow_dispatch` (`.github/workflows/monitor.yml` — line 7)
- [x] Cron schedule: `17 1 * * *` UTC (`.github/workflows/monitor.yml` — line 6)
- [x] Python 3.10 setup + dependency install (`.github/workflows/monitor.yml` — lines 22-30)

## Phase 3: Dashboard & Deployment — ✅ Complete

- [x] **FR-09**: Interactive dashboard (`dashboard/` — index.html, app.js, styles.css)
- [x] **FR-10**: GitHub Pages deployment (`.github/workflows/monitor.yml` — lines 45-63)
- [x] **FR-11**: Cloudflare Workers deployment (`.github/workflows/monitor.yml` — lines 65-86)
- [x] Landing page (`index.html`)

## Phase 4: Enhancements — Pending

- [ ] Add model metadata extraction (description, context window, pricing) if API extends response
- [ ] Add historical trend charts to dashboard (model count over time from CHANGELOG.json)
- [ ] Add configurable alert thresholds (e.g., alert only if > N models change)
- [ ] Add multi-channel notifications (Slack, Telegram, email) beyond Discord
- [ ] Add API health monitoring (response time, error rate tracking)

## Scope-to-Task Traceability

| Requirement | Phase | Status |
|---|---|---|
| FR-01 | Phase 1 | ✅ |
| FR-02 | Phase 1 | ✅ |
| FR-03 | Phase 1 | ✅ |
| FR-04 | Phase 1 | ✅ |
| FR-05 | Phase 1 | ✅ |
| FR-06 | Phase 1 | ✅ |
| FR-07 | Phase 1 | ✅ |
| FR-08 | Phase 2 | ✅ |
| FR-09 | Phase 3 | ✅ |
| FR-10 | Phase 3 | ✅ |
| FR-11 | Phase 3 | ✅ |
| FR-12 | Phase 2 | ✅ |
| NFR-01 | Phase 2 | ✅ |
| NFR-02 | Phase 1 | ✅ |
| NFR-03 | Phase 1 | ✅ |
| NFR-04 | Phase 2 | ✅ |
| NFR-05 | Phase 3 | ✅ |
