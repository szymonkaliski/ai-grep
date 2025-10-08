#!/usr/bin/env node

import { parseArgs } from '../lib/args.js';
import { getApiKey } from '../lib/api-key.js';
import { executeQuery } from '../lib/query.js';
import { formatOutput } from '../lib/formatter.js';

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    if (args.help) {
      console.log(`Usage: aig [--files] [--json] <search_query>
AI-powered fuzzy grep using Claude

Options:
  --files    Output only filenames with line numbers (vim-style: file.txt:42)
  --json     Output results as JSON
  --help     Show this help message

Examples:
  aig 'authentication logic'
  aig --files 'error handling'`);
      process.exit(0);
    }

    if (!args.query) {
      console.error('Error: search query cannot be empty');
      process.exit(1);
    }

    const apiKey = await getApiKey();
    const results = await executeQuery(args.query, apiKey);
    const output = await formatOutput(results, args);

    if (!output) {
      console.log('No results found');
      process.exit(1);
    }

    console.log(output);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
