# SCOPE.md — Requirements Baseline

## Project Purpose

Automated monitoring tool that tracks changes in available AI models on NVIDIA's Integrate API (`https://integrate.api.nvidia.com/v1/models`). Provides real-time Discord alerts and a public web dashboard.

## Functional Requirements

- **FR-01**: Fetch current model list from NVIDIA Integrate API daily
- **FR-02**: Compare against cached state to detect additions and removals
- **FR-03**: Send Discord webhook notifications on detected changes
- **FR-04**: Skip Discord notification when no changes are detected (silent on no-change runs)
- **FR-05**: Persist model list state in `models.json`
- **FR-06**: Maintain change history in `CHANGELOG.json` (max 100 entries)
- **FR-07**: Generate human-readable model listing in `MODELS.md` grouped by provider
- **FR-08**: Auto-commit updated files back to repository with `[skip ci]`
- **FR-09**: Provide interactive web dashboard with search, filter, and analytics
- **FR-10**: Deploy landing page and dashboard to GitHub Pages
- **FR-11**: Deploy static assets to Cloudflare Workers as secondary CDN
- **FR-12**: Support manual workflow trigger via `workflow_dispatch`

## Business Constraints

- Zero infrastructure cost — GitHub Actions free tier, GitHub Pages free hosting
- No database — file-based state persisted in repository
- No user authentication — public read-only dashboard
- Single external dependency: NVIDIA Integrate API availability
- Discord rate limits: messages auto-split at 1900 chars

## Non-Functional Requirements

- **NFR-01**: Cron schedule: daily at 01:17 UTC (offset to avoid GitHub scheduler peak)
- **NFR-02**: API request timeout: 30 seconds
- **NFR-03**: Discord webhook timeout: 10 seconds per message part
- **NFR-04**: Python 3.10 runtime (pinned in CI)
- **NFR-05**: No build tools or bundlers — static HTML/JS/CSS dashboard

## Scope Boundaries

- **In scope**: Model list monitoring, change alerts, dashboard visualization, dual deployment
- **Out of scope**: Model performance benchmarking, API key management, user accounts, model metadata beyond ID
