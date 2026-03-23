# 📊 NVIDIA Model Explorer Dashboard

An interactive web dashboard for exploring and discovering AI models from NVIDIA's Integrate API.

## Features

- **🔍 Search & Filter**: Quickly find models by name or provider
- **📊 Visual Analytics**: Provider distribution and model category charts
- **📜 Change History**: Track recent model additions and removals
- **🏷️ Model Categories**: Automatic classification (Instruct, Vision, Embedding, Code, etc.)
- **📋 Export**: Copy model IDs with one click
- **📱 Responsive**: Works on desktop and mobile devices

## Access

The dashboard is automatically deployed to GitHub Pages at:
`https://<username>.github.io/nvidia-integrate-models-monitor/dashboard/`

## Local Development

To view the dashboard locally:

1. Ensure `models.json` exists in the root directory
2. Open `dashboard/index.html` in a web browser

Or use a local server:

```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000/dashboard/
```

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Charts**: Chart.js
- **Tables**: DataTables
- **Styling**: Tailwind CSS (via CDN)

## Data Sources

- `../models.json` - Current list of all available models
- `../CHANGELOG.json` - History of model changes

## Model Classification

Models are automatically categorized based on their names:

| Category | Keywords |
|----------|----------|
| Instruct | instruct, chat, rlhf |
| Vision | vision, vlm, neva, vila, deplot |
| Embedding | embed, retriever, nvclip, bge |
| Code | code, starcoder, codestral |
| Guard | guard, safety |
| Reward | reward |
| Base | base, foundation |

## Customization

### Update Model Categories

Edit `app.js` and modify the `MODEL_TYPE_PATTERNS` object:

```javascript
const MODEL_TYPE_PATTERNS = {
    'instruct': ['instruct', 'chat', 'rlhf'],
    'your-category': ['your-keyword']
};
```

### Change Colors

Edit `styles.css` to customize the color scheme.

### Adjust Page Size

In `app.js`, modify the `pageLength` option in the DataTable initialization.

## Troubleshooting

### Dashboard not loading

- Ensure `models.json` exists in the root directory
- Check browser console for errors
- Verify GitHub Pages is enabled in repository settings

### Charts not displaying

- Check internet connection (Chart.js loads from CDN)
- Verify `models.json` is valid JSON

### Change history empty

- Run `monitor.py` at least once to generate `CHANGELOG.json`
- Initial run will create the changelog file

## License

Same as the main repository.
