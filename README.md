# `aig`

AI-powered fuzzy grep using Claude Agent SDK

## Installation

```bash
npm install -g ai-grep
```

## Setup

Create `~/.aig-key` with your Anthropic API key:

```bash
echo "your-api-key-here" > ~/.aig-key
```

Or set the `ANTHROPIC_API_KEY` environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Get your API key from: https://console.anthropic.com/

## Usage

```bash
aig 'authentication logic'
aig --files 'error handling'
aig --json 'database queries'
```

### Options

- `--files` - Output only filenames with line numbers (vim-style: file.txt:42)
- `--json` - Output results as JSON
- `--help` - Show help message

