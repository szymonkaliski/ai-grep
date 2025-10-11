import { query } from '@anthropic-ai/claude-agent-sdk';
import { createSpinner } from './spinner.js';

const QUERY_TIMEOUT_MS = 60000;

const SEARCH_PROMPT = (
  searchQuery
) => `You are a search engine. Find files and code that match the user's search query.

IMPORTANT INSTRUCTIONS:
1. Search FUZZILY - look for:
   - Exact matches of the query
   - Related concepts and synonyms
   - Contextually relevant code/prose
   - Similar functionality or patterns
   - Comments or documentation about the concept

2. OUTPUT FORMAT - CRITICALLY IMPORTANT:
   Return ONLY matching locations, nothing else. Each line must be exactly:

   filepath:line_number

   Examples:
   filename.txt:42
   another/file.js:123
   path/to/code.py:5

   RULES:
   - ONLY filepath:line_number format, one per line
   - NO explanations, NO headers, NO markdown, NO extra text
   - NO "Here are the results:", NO "I found:", NO commentary
   - If no matches found, return nothing (empty output)
   - Sort by relevance (most relevant first)

USER SEARCH QUERY: "${searchQuery}"`;

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Query timed out after ${timeoutMs / 1000}s`)),
        timeoutMs
      )
    ),
  ]);
}

export async function executeQuery(searchQuery) {
  const spinner = createSpinner();
  const results = [];

  try {
    spinner.start();

    const options = {
      disallowedTools: ['Edit', 'Write', 'NotebookEdit', 'TodoWrite', 'Task'],
      permissionMode: 'bypassPermissions',
      systemPrompt: {
        type: 'preset',
        preset: 'claude_code',
      },
    };

    const queryExecution = (async () => {
      for await (const message of query({
        prompt: SEARCH_PROMPT(searchQuery),
        options,
      })) {
        if (message.type === 'assistant' && message.message?.content) {
          for (const block of message.message.content) {
            if (block.type === 'text') {
              results.push(block.text);
            }
          }
        }
      }
    })();

    await withTimeout(queryExecution, QUERY_TIMEOUT_MS);

    spinner.stop();

    const output = results.join('\n');
    const lines = output
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^[^:]+:\d+$/.test(line));

    return lines;
  } catch (error) {
    spinner.stop();
    if (error.message.includes('timed out')) {
      throw new Error(`Search timed out. Try a more specific query.`);
    }
    throw new Error(`Search failed: ${error.message}`);
  }
}
