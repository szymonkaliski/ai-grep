# `ai-grep`

When you're looking for something, but you're not exactly sure what.
AI fuzzy grep using Claude Agent SDK.

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

- `--files`, `-f` - Output only filenames with line numbers
- `--json`, `-j` - Output results as JSON
- `--version`, `-v` - Show version number
- `--help`, `-h` - Show help message

