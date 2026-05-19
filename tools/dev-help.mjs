const lines = [
  'Use one of the named dev commands instead of `pnpm dev`:',
  '  pnpm dev:web',
  '  pnpm dev:admin',
  '  pnpm dev:supplier',
  '',
  'These scripts allocate ports within the 4000-5000 range.'
];

process.stdout.write(`${lines.join('\n')}\n`);
