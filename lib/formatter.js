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

    try {
      const content = await getLineContent(file, parseInt(lineNum, 10));
      if (content) {
        output.push(`${green}${lineNum}${reset}:${content}`);
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return output.join('\n');
}

async function getLineContent(filePath, lineNum) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    return lines[lineNum - 1] || '';
  } catch (error) {
    return null;
  }
}
