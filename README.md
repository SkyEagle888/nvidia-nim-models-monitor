# 🟢 NVIDIA Integrate Models Monitor

[![NVIDIA Model Monitor](https://github.com/SkyEagle888/nvidia-integrate-models-monitor/actions/workflows/monitor.yml/badge.svg)](https://github.com/SkyEagle888/nvidia-integrate-models-monitor/actions/workflows/monitor.yml)

An automated monitoring tool that tracks changes in the available AI models on [NVIDIA's Integrate API](https://integrate.api.nvidia.com/v1/models). It sends real-time alerts to Discord whenever a model is added or removed.

## 🚀 Features
- **Automated Scanning:** Checks the NVIDIA API every 6 hours via GitHub Actions.
- **Change Detection:** Compares current models against a cached state (`models.json`).
- **Discord Notifications:** 
  - 🚨 **Alerts** for new model additions (with IDs).
  - ❌ **Alerts** for removed models.
  - ✅ **Status Updates** even when no changes are detected.
- **Smart Formatting:** Automatically splits long lists to stay within Discord's 2000-character limit.
- **Privacy:** Uses GitHub Secrets to keep webhook URLs private.

## 🛠️ How It Works
The repository uses a Python-based monitor (`monitor.py`) orchestrated by GitHub Actions. 
1. **Fetch:** Pulls the latest JSON data from NVIDIA's model endpoint.
2. **Compare:** Identifies differences between the current list and the previously saved version.
3. **Notify:** Sends a formatted message to the configured Discord Webhook.
4. **Persist:** Updates `models.json` in the repository if changes are found to keep the state synchronized.

## ⚙️ Setup for Forking
If you want to run your own instance:
1. **Fork** this repository.
2. Create a **Discord Webhook** in your preferred server/channel.
3. Go to your fork's **Settings > Secrets and variables > Actions**.
4. Add a **New repository secret**:
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: `your_webhook_url_here`
5. Enable Actions in the **Actions** tab of your fork.

---
*Maintained by [SkyEagle888](https://github.com/SkyEagle888)*
