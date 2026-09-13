/** Local-only brief preparation. This module never persists or submits customer data. */
export type BriefKind = 'buyer' | 'partner';
export type BriefFields = {
  name: string;
  company: string;
  email: string;
  country: string;
  topic: string;
  quantity: string;
  requirements: string;
  consent: boolean;
};
export type BriefResult =
  | { ok: true; text: string; subject: string }
  | { ok: false; error: 'required' | 'email' | 'too-long' | 'consent' };
export function createHighlandBrief(
  kind: BriefKind,
  fields: BriefFields,
  locale: string,
): BriefResult {
  const value = Object.fromEntries(
    Object.entries(fields)
      .filter(([key]) => key !== 'consent')
      .map(([key, v]) => [key, String(v).trim()]),
  ) as Omit<BriefFields, 'consent'>;
  if (
    !value.name ||
    !value.company ||
    !value.email ||
    !value.country ||
    !value.topic ||
    !value.requirements
  )
    return { ok: false, error: 'required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
    return { ok: false, error: 'email' };
  if (
    value.requirements.length > 3000 ||
    Object.entries(value).some(
      ([key, v]) => key !== 'requirements' && v.length > 200,
    )
  )
    return { ok: false, error: 'too-long' };
  if (!fields.consent) return { ok: false, error: 'consent' };
  const zh = locale === 'zh';
  const title =
    kind === 'buyer'
      ? zh
        ? '高原产品采购需求'
        : 'Plateau sourcing brief'
      : zh
        ? '平台合作意向'
        : 'Platform partnership brief';
  const labels = zh
    ? [
        '联系人',
        '企业 / 机构',
        '电子邮箱',
        '目标市场 / 所在地区',
        '产品方向 / 合作类型',
        '预计数量及单位 / 合作规模',
        '具体需求',
      ]
    : [
        'Contact',
        'Company / organisation',
        'Email',
        'Destination / location',
        'Collection / partnership type',
        'Indicative quantity & unit / scope',
        'Requirements',
      ];
  const lines = [
    value.name,
    value.company,
    value.email,
    value.country,
    value.topic,
    value.quantity || '—',
    value.requirements,
  ];
  return {
    ok: true,
    subject: `Farmetra | ${title}`,
    text: `Farmetra — ${title}\n\n${lines.map((line, i) => labels[i] + ': ' + line).join('\n\n')}\n\n${zh ? '本文件为沟通需求，不构成订单、供货承诺或投资要约。' : 'This brief is for discussion and is not an order, supply commitment or investment offer.'}`,
  };
}
export function buildBriefMailto(
  email: string,
  brief: { subject: string; text: string },
): string {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(brief.text)}`;
}
