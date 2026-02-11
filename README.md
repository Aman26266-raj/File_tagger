# File Tagger

Local file tagging utility with a CLI and minimal UI. Tags are stored locally in
`~/.file-tagger/db.json` and never leave your device.

## Install

```bash
npm install -g file-tagger
```

Optional Python wrapper (requires the Node CLI installed):

```bash
pip install file-tagger
```

## Usage

```bash
file-tagger add <path> <key>=<value>
file-tagger remove <path> <key>=<value>
file-tagger search <path|.> <key>=<value>
file-tagger ui --port 5173
```

Examples:

```bash
file-tagger add ./docs/plan.md team=alpha
file-tagger search . team=alpha
file-tagger remove ./docs/plan.md team=alpha
file-tagger ui
```

## Tests

```bash
npm test
```