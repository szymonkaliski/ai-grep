export function parseArgs(argv) {
  const args = {
    filesOnly: false,
    json: false,
    help: false,
    query: '',
  };

  const queryParts = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--files') {
      args.filesOnly = true;
    } else if (arg === '--json') {
      args.json = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      queryParts.push(arg);
    }
  }

  args.query = queryParts.join(' ');

  return args;
}
