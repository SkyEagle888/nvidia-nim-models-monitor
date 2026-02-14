# NVIDIA Integrate Models Monitor

A simple GitHub Action that monitors NVIDIA's model list and notifies Discord about any changes.

## How it works
- The script fetches the model list from `https://integrate.api.nvidia.com/v1/models` every 6 hours.
- It compares the current list with the `models.json` stored in the repository.
- It sends a notification to a Discord Webhook.
- If changes are detected, it updates `models.json` and commits the changes back to the repository.

## Setup
1. Create a Discord Webhook for your channel.
2. Go to **Settings > Secrets and variables > Actions** in this repository.
3. Add a new repository secret named `DISCORD_WEBHOOK_URL` with your webhook URL.
