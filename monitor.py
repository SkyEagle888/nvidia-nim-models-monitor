import requests
import json
import os
import sys
from datetime import datetime

API_URL = "https://integrate.api.nvidia.com/v1/models"
MODELS_FILE = "models.json"
DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL")

def fetch_models():
    try:
        response = requests.get(API_URL, timeout=30)
        response.raise_for_status()
        data = response.json()
        return sorted([model['id'] for model in data.get('data', [])])
    except Exception as e:
        print(f"Error fetching models: {e}")
        return None

def load_previous_models():
    if os.path.exists(MODELS_FILE):
        try:
            with open(MODELS_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading models file: {e}")
    return []

def save_models(models):
    try:
        with open(MODELS_FILE, 'w') as f:
            json.dump(models, f, indent=2)
    except Exception as e:
        print(f"Error saving models file: {e}")

def send_discord_message(content):
    if not DISCORD_WEBHOOK_URL:
        print("DISCORD_WEBHOOK_URL not set. Skipping notification.")
        return

    # Discord limit is 2000 chars, we'll use 1900 to be safe
    MAX_LEN = 1900
    
    parts = []
    if len(content) > MAX_LEN:
        lines = content.split('\n')
        current_part = ""
        for line in lines:
            if len(current_part) + len(line) + 1 > MAX_LEN:
                parts.append(current_part)
                current_part = line + '\n'
            else:
                current_part += line + '\n'
        if current_part:
            parts.append(current_part)
    else:
        parts = [content]

    for part in parts:
        try:
            payload = {"content": part}
            response = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=10)
            response.raise_for_status()
        except Exception as e:
            print(f"Error sending Discord message part: {e}")

def main():
    current_models = fetch_models()
    if current_models is None:
        sys.exit(1)

    previous_models = load_previous_models()
    
    # Check if this is the first real run (previous was empty list)
    is_initial_run = not previous_models
    
    added = sorted(list(set(current_models) - set(previous_models)))
    removed = sorted(list(set(previous_models) - set(current_models)))

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if not added and not removed:
        message = f"🔍 **NVIDIA Model Monitor Update** ({timestamp})\n✅ No changes detected. Total models: {len(current_models)}"
    else:
        message = f"🚨 **NVIDIA Model Monitor ALERT** ({timestamp})\n"
        if is_initial_run:
            message += f"🆕 **Initial setup: Tracking {len(current_models)} models.**\n"
            # For the very first run, don't list all 180+ models to avoid spamming Discord
            if len(current_models) > 10:
                message += "Preview of models:\n" + "\n".join([f"- `{m}`" for m in current_models[:10]]) + f"\n... and {len(current_models)-10} more."
            else:
                message += "\n".join([f"- `{m}`" for m in current_models])
        else:
            if added:
                message += f"✨ **Added ({len(added)}):**\n" + "\n".join([f"- `{m}`" for m in added]) + "\n"
            if removed:
                message += f"❌ **Removed ({len(removed)}):**\n" + "\n".join([f"- `{m}`" for m in removed]) + "\n"
        
        message += f"\n📊 Total models now: {len(current_models)}"

    print(message)
    send_discord_message(message)
    
    # Save the new state if there were changes or if it's the first run
    if added or removed or is_initial_run:
        save_models(current_models)
        print("Updated models.json")

if __name__ == "__main__":
    main()
