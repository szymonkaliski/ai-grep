import {
  query,
  type Options,
  type PermissionMode,
} from '@anthropic-ai/claude-agent-sdk';
import { createSpinner } from './spinner.js';

const QUERY_TIMEOUT_MS = 60000;

const SEARCH_PROMPT = (
  searchQuery: string
): string => `You are a search engine. Find files and code that match the user's search query.

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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Query timed out after ${timeoutMs / 1000}s`)),
        timeoutMs
      )
    ),
  ]);
}

export async function executeQuery(searchQuery: string): Promise<string[]> {
  const spinner = createSpinner();
  const results: string[] = [];

  try {
    spinner.start();

    const options: Options = {
      disallowedTools: ['Edit', 'Write', 'NotebookEdit', 'TodoWrite', 'Task'],
      permissionMode: 'bypassPermissions' as PermissionMode,
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
      .filter((line) => /^[^:]+:\d+$/.test(line))
      .sort((a, b) => {
        const [fileA, lineNumA] = a.split(':');
        const [fileB, lineNumB] = b.split(':');

        if (fileA !== fileB) {
          return fileA.localeCompare(fileB);
        }

        return parseInt(lineNumA, 10) - parseInt(lineNumB, 10);
      });

    return lines;
  } catch (error) {
    spinner.stop();
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('timed out')) {
      throw new Error(`Search timed out. Try a more specific query.`);
    }
    throw new Error(`Search failed: ${errorMessage}`);
  }
}
