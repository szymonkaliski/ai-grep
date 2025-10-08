import { readFile } from 'fs/promises';

export async function formatOutput(results, args) {
  if (results.length === 0) {
    return null;
  }

  if (args.json) {
    return JSON.stringify(
      results.map((line) => {
        const [file, lineNum] = line.split(':');
        return { file, line: parseInt(lineNum, 10) };
      }),
      null,
      2
    );
  }

  if (args.filesOnly) {
    return results.join('\n');
  }

  return await formatRipgrepStyle(results);
}

async function formatRipgrepStyle(results) {
  const cyan = '\x1b[36m';
  const green = '\x1b[32m';
  const reset = '\x1b[0m';

  const fileCache = new Map();
  const uniqueFiles = [...new Set(results.map((line) => line.split(':')[0]))];

  await Promise.all(
    uniqueFiles.map(async (file) => {
      try {
        const content = await readFile(file, 'utf-8');
        fileCache.set(file, content.split('\n'));
      } catch (error) {
        fileCache.set(file, null);
      }
    })
  );

  const output = [];
  let currentFile = '';

  for (const line of results) {
    const [file, lineNum] = line.split(':');

    if (!file || !lineNum) {
      continue;
    }

    if (file !== currentFile) {
      if (currentFile !== '') {
        output.push('');
      }
      output.push(`${cyan}${file}${reset}`);
      currentFile = file;
    }

    const lines = fileCache.get(file);
    if (lines) {
      const content = lines[parseInt(lineNum, 10) - 1] || '';
      if (content) {
        output.push(`${green}${lineNum}${reset}:${content}`);
      }
    }
  }

  return output.join('\n');
}
