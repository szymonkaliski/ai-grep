# `ai-grep`

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

- `--files`, `-f` - Output only filenames with line numbers (vim-style: file.txt:42)
- `--json`, `-j` - Output results as JSON
- `--version`, `-v` - Show version number
- `--help`, `-h` - Show help message

## Development

This project is written in TypeScript.

### Setup

```bash
npm install
```

### Building

```bash
npm run build        # Compile TypeScript to dist/
npm run typecheck    # Run type checking without building
```

### Testing locally

```bash
npm run build
node dist/bin/aig.js 'your search query'
```
