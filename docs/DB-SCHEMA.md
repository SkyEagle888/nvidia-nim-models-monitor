# DB-SCHEMA.md — NVIDIA Integrate Models Monitor

## Database Definitions

This project uses **no traditional database**. All persistent state is file-based JSON/Markdown committed to the repository.

### File: `models.json`

| Field | Type | Description |
|---|---|---|
| *(root)* | `string[]` | Sorted array of model ID strings |

**Example**: `["01-ai/yi-large", "meta/llama-3.1-70b-instruct", ...]`

- Updated only when `monitor.py` detects a diff between live API and cached state
- Written by `save_models()` in `monitor.py:36-40`
- Read by `load_previous_models()` in `monitor.py:27-34`

---

### File: `CHANGELOG.json`

| Field | Type | Description |
|---|---|---|
| `changes` | `ChangeEntry[]` | Array of change records (max 100) |
| `changes[].timestamp` | `string` (ISO 8601) | UTC timestamp of detection |
| `changes[].added` | `string[]` | Model IDs added since last check |
| `changes[].removed` | `string[]` | Model IDs removed since last check |
| `changes[].total_models` | `int` | Total model count after change |

- Append-only; oldest entries pruned at `MAX_CHANGELOG_ENTRIES = 100`
- Written by `save_changelog()` in `monitor.py:52-60`
- Read by `load_changelog()` in `monitor.py:43-50`

---

### File: `MODELS.md`

- Generated markdown, not structured data
- Schema: `# heading → *timestamp* → **total** → ### PROVIDER → - \`model-id\``
- Regenerated every workflow run regardless of changes
- Written by `update_markdown()` in `monitor.py:74-96`

---

### External: NVIDIA Integrate API

- **Endpoint**: `GET https://integrate.api.nvidia.com/v1/models`
- **Response schema**: `{ "data": [ { "id": string, ... } ] }`
- **Extracted field**: `data[].id` only — all other fields ignored

## Migration History

- No migrations — file schemas have been stable since initial commit
- `CHANGELOG.json` `MAX_CHANGELOG_ENTRIES` introduced as cap at 100 entries
