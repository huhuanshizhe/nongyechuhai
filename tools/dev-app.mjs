import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import getPort, { portNumbers } from 'get-port';

const target = process.argv[2];

if (!target) {
  throw new Error('Missing workspace target.');
}

for (const envFile of ['.env', '.env.local']) {
  const envPath = join(process.cwd(), envFile);

  if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}

const basePortByApp = {
  '@nongyechuhai/web': 4000,
  '@nongyechuhai/admin': 4100,
  '@nongyechuhai/supplier': 4200
};

const basePort = basePortByApp[target] ?? 4300;
const maxPort = Math.min(basePort + 99, 5000);
const port = await getPort({
  port: portNumbers(basePort, maxPort)
});

process.stdout.write(`[dev-app] starting ${target} on port ${port}\n`);

const isWindows = process.platform === 'win32';
const command = isWindows ? 'cmd.exe' : 'corepack';
const args = isWindows
  ? ['/c', 'corepack', 'pnpm', '--filter', target, 'dev', '--port', String(port)]
  : ['pnpm', '--filter', target, 'dev', '--port', String(port)];

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
