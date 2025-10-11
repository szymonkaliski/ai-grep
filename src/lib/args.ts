export interface ParsedArgs {
  filesOnly: boolean;
  json: boolean;
  help: boolean;
  version: boolean;
  query: string;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    filesOnly: false,
    json: false,
    help: false,
    version: false,
    query: '',
  };

  const queryParts: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--files' || arg === '-f') {
      args.filesOnly = true;
    } else if (arg === '--json' || arg === '-j') {
      args.json = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--version' || arg === '-v') {
      args.version = true;
    } else {
      queryParts.push(arg);
    }
  }

  args.query = queryParts.join(' ');

  return args;
}
