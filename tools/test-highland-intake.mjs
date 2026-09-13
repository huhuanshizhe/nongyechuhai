import assert from 'node:assert/strict';
import {
  createHighlandBrief,
  buildBriefMailto,
} from '../apps/web/src/lib/highland-intake.ts';
const valid = {
  name: 'Test Buyer',
  company: 'QA Example',
  email: 'qa@example.invalid',
  country: 'Test market',
  topic: 'Plateau goji berries',
  quantity: '2 kg sample',
  requirements: 'Please discuss dried fruit specifications.',
  consent: true,
};
let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  process.stdout.write('PASS ' + name + '\n');
}
check('valid buyer brief is prepared, not submitted', () => {
  const result = createHighlandBrief('buyer', valid, 'en');
  assert.equal(result.ok, true);
  assert.match(result.text, /This brief is for discussion/);
  assert.match(result.text, /2 kg sample/);
});
check('Chinese partnership brief', () => {
  const result = createHighlandBrief(
    'partner',
    { ...valid, topic: '投资机构 / 战略合作洽谈' },
    'zh',
  );
  assert.equal(result.ok, true);
  assert.match(result.subject, /平台合作意向/);
  assert.match(result.text, /不构成订单、供货承诺或投资要约/);
});
for (const key of [
  'name',
  'company',
  'email',
  'country',
  'topic',
  'requirements',
])
  check('reject missing ' + key, () =>
    assert.deepEqual(
      createHighlandBrief('buyer', { ...valid, [key]: '  ' }, 'en'),
      { ok: false, error: 'required' },
    ),
  );
check('reject invalid email', () =>
  assert.deepEqual(
    createHighlandBrief('buyer', { ...valid, email: 'not-an-email' }, 'en'),
    { ok: false, error: 'email' },
  ),
);
check('reject missing consent', () =>
  assert.deepEqual(
    createHighlandBrief('buyer', { ...valid, consent: false }, 'en'),
    { ok: false, error: 'consent' },
  ),
);
check('reject oversized requirements', () =>
  assert.deepEqual(
    createHighlandBrief(
      'buyer',
      { ...valid, requirements: 'a'.repeat(3001) },
      'en',
    ),
    { ok: false, error: 'too-long' },
  ),
);
check('reject oversized short field', () =>
  assert.deepEqual(
    createHighlandBrief('buyer', { ...valid, name: 'a'.repeat(201) }, 'en'),
    { ok: false, error: 'too-long' },
  ),
);
check('accept exact length boundary', () =>
  assert.equal(
    createHighlandBrief(
      'buyer',
      { ...valid, requirements: 'a'.repeat(3000) },
      'en',
    ).ok,
    true,
  ),
);
check('optional quantity', () =>
  assert.equal(
    createHighlandBrief('buyer', { ...valid, quantity: '' }, 'en').ok,
    true,
  ),
);
check('trim commercial fields', () => {
  const result = createHighlandBrief(
    'buyer',
    { ...valid, name: '  Example  ' },
    'en',
  );
  assert.equal(result.ok, true);
  assert.match(result.text, /Contact: Example\n/);
});
check('email content is encoded without parameter injection', () => {
  const result = createHighlandBrief(
    'buyer',
    { ...valid, requirements: 'a & b?subject=fake#fragment\n中文' },
    'en',
  );
  assert.equal(result.ok, true);
  const mail = buildBriefMailto('export@farmetra.com', result);
  const url = new URL(mail);
  assert.equal(url.searchParams.get('subject'), result.subject);
  assert.equal(url.searchParams.get('body'), result.text);
  assert.equal(url.hash, '');
  assert.equal(url.searchParams.size, 2);
});
process.stdout.write(
  '\n' +
    passed +
    ' intake tests passed. No email, database or network calls were made.\n',
);
