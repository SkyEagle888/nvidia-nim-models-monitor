# 🟢 NVIDIA Integrate Models Monitor

[![NVIDIA Model Monitor](https://github.com/SkyEagle888/nvidia-integrate-models-monitor/actions/workflows/monitor.yml/badge.svg)](https://github.com/SkyEagle888/nvidia-integrate-models-monitor/actions/workflows/monitor.yml)

An automated monitoring tool that tracks changes in the available AI models on [NVIDIA's Integrate API](https://integrate.api.nvidia.com/v1/models). It sends real-time alerts to Discord whenever a model is added or removed, and posts a daily status update even when nothing has changed.

## 🚀 Features

- **Automated Daily Scanning:** Runs once per day at 01:00 UTC (09:00 HKT) via GitHub Actions cron schedule.
- **Manual Trigger:** Can also be triggered on-demand via `workflow_dispatch` from the Actions tab.
- **Change Detection:** Compares the current live model list against a cached state (`models.json`).
- **Discord Notifications:**
  - 🚨 **Alerts** when models are added or removed (lists all affected model IDs).
  - 🆕 **Initial setup message** on first run, with a preview of tracked models.
  - ✅ **Daily status update** even when no changes are detected.
- **Smart Formatting:** Automatically splits long messages into multiple parts to stay within Discord's 2000-character limit.
- **Human-Readable List:** Categorises models by provider in [MODELS.md](./MODELS.md), refreshed on every run with a GMT+8 timestamp.
- **Persistent State:** Commits updated `models.json` and `MODELS.md` back to the repository after each run.
- **Privacy:** Uses GitHub Secrets to keep the Discord webhook URL private.

## 🛠️ How It Works

The repository uses a Python-based monitor (`monitor.py`) orchestrated by GitHub Actions (`.github/workflows/monitor.yml`).

1. **Fetch:** Calls `https://integrate.api.nvidia.com/v1/models` and extracts a sorted list of model IDs.
2. **Compare:** Loads the previously saved `models.json` and computes added and removed models using set differences.
3. **Notify:** Sends a formatted Discord message via webhook — an alert if changes exist, or a quiet status update if not.
4. **Persist:** Always regenerates `MODELS.md` (grouped by provider, with a fresh timestamp). Updates `models.json` only when the model list has changed.
5. **Commit:** The `github-actions[bot]` commits and pushes both files back to the repository using `[skip ci]` to prevent a workflow loop.

## 📁 Repository Structure

| File | Description |
|---|---|
| `monitor.py` | Main Python script — fetches, compares, notifies, and saves |
| `models.json` | Persisted list of models from the last detected change |
| `MODELS.md` | Human-readable model list grouped by provider, updated every run |
| `requirements.txt` | Python dependencies (`requests`, `pytz`) |
| `.github/workflows/monitor.yml` | GitHub Actions workflow definition |

## ⚙️ Setup for Forking

If you want to run your own instance:

1. **Fork** this repository.
2. Create a **Discord Webhook** in your preferred server/channel.
3. Go to your fork's **Settings → Secrets and variables → Actions**.
4. Add a **New repository secret**:
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: `your_webhook_url_here`
5. Enable Actions in the **Actions** tab of your fork.
6. Optionally trigger the workflow manually via **Run workflow** to verify the setup.

---

*Maintained by [SkyEagle888](https://github.com/SkyEagle888)*
