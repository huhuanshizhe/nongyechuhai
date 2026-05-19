import { spawn } from 'node:child_process';
import getPort from 'get-port';

const target = process.argv[2];

if (!target) {
  throw new Error('Missing workspace target.');
}

const basePortByApp = {
  '@nongyechuhai/web': 4000,
  '@nongyechuhai/admin': 4100,
  '@nongyechuhai/supplier': 4200
};

const basePort = basePortByApp[target] ?? 4300;
const maxPort = Math.min(basePort + 99, 5000);
const port = await getPort({
  port: getPort.makeRange(basePort, maxPort)
});

process.stdout.write(`[dev-app] starting ${target} on port ${port}\n`);

const command = process.platform === 'win32' ? 'corepack.cmd' : 'corepack';
const args = ['pnpm', '--filter', target, 'dev', '--', '--port', String(port)];

const child = spawn(command, args, {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(port)
  },
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
