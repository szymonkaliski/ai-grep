export function createSpinner() {
  let interval = null;
  let isRunning = false;

  const dots = ['', '.', '..', '...'];
  let i = 0;

  return {
    start() {
      if (!process.stdout.isTTY || isRunning) {
        return;
      }

      isRunning = true;
      process.stdout.write('\x1b[?25l');

      interval = setInterval(() => {
        const gray = '\x1b[90m';
        const reset = '\x1b[0m';
        process.stdout.write(`\r${gray}Searching${dots[i]}${reset}\x1b[K`);
        i = (i + 1) % 4;
      }, 300);
    },

    stop() {
      if (!isRunning) {
        return;
      }

      isRunning = false;

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      if (process.stdout.isTTY) {
        process.stdout.write('\r\x1b[K');
        process.stdout.write('\x1b[?25h');
      }
    },
  };
}
