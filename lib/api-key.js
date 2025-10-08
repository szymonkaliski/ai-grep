import { readFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

export async function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) {
    return process.env.ANTHROPIC_API_KEY;
  }

  const keyPath = join(homedir(), '.aig-key');

  try {
    const key = await readFile(keyPath, 'utf-8');
    return key.trim();
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `API key not found. Please either:
  1. Set ANTHROPIC_API_KEY environment variable
  2. Create ~/.aig-key file with your API key

Get your API key from: https://console.anthropic.com/`
      );
    }
    throw error;
  }
}
