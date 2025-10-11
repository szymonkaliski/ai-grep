#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseArgs } from '../lib/args.js';
import { getApiKey } from '../lib/api-key.js';
import { executeQuery } from '../lib/query.js';
import { formatOutput } from '../lib/formatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.ANTHROPIC_API_KEY) {
  process.env.ANTHROPIC_API_KEY = await getApiKey();
}

async function getVersion(): Promise<string> {
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));

    if (args.version) {
      const version = await getVersion();
      console.log(version);
      process.exit(0);
    }

    if (args.help) {
      console.log(`Usage: aig [--files] [--json] <search_query>
AI-powered fuzzy grep using Claude

Options:
  --files, -f       Output only filenames with line numbers (vim-style: file.txt:42)
  --json, -j        Output results as JSON
  --version, -v     Show version number
  --help, -h        Show this help message

Examples:
  aig 'authentication logic'
  aig --files 'error handling'`);
      process.exit(0);
    }

    if (!args.query) {
      console.error('Error: Search query cannot be empty');
      process.exit(2);
    }

    const results = await executeQuery(args.query);
    const output = await formatOutput(results, args);

    if (!output) {
      console.log('No results found');
      process.exit(1);
    }

    console.log(output);
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${errorMessage}`);
    process.exit(2);
  }
}

main();
