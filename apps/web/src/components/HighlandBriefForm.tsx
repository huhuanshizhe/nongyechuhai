'use client';
import { useState, type FormEvent } from 'react';
import { Link } from '../i18n/routing';
import { directions, localize } from '../lib/highland';
import {
  createHighlandBrief,
  buildBriefMailto,
  type BriefKind,
} from '../lib/highland-intake';
export function HighlandBriefForm({
  locale,
  kind,
  email,
  initialTopic = '',
}: {
  locale: string;
  kind: BriefKind;
  email: string;
  initialTopic?: string;
}) {
  const zh = locale === 'zh';
  const [brief, setBrief] = useState<{ subject: string; text: string } | null>(
    null,
  );
  const [message, setMessage] = useState('');
  const topics =
    kind === 'buyer'
      ? directions.map((item) => ({
          value: item.slug,
          label: localize(item.name, locale),
        }))
      : [
          {
            value: 'export',
            label: zh ? '企业出海服务需求' : 'Export support for my business',
          },
          {
            value: 'supplier',
            label: zh ? '生产企业 / 供应合作' : 'Producer / supplier',
          },
          {
            value: 'channel',
            label: zh ? '海外渠道 / 采购合作' : 'Overseas channel / buyer',
          },
          {
            value: 'service',
            label: zh ? '专业服务 / 产业协同' : 'Specialist service / industry',
          },
          {
            value: 'investment',
            label: zh
              ? '投资机构 / 战略合作洽谈'
              : 'Investor / strategic discussion',
          },
        ];
  const validTopic = topics.some((topic) => topic.value === initialTopic)
    ? initialTopic
    : '';
  const messages = {
    required: zh
      ? '请填写全部必填项。'
      : 'Please complete all required fields.',
    email: zh ? '请填写有效邮箱。' : 'Please enter a valid email address.',
    'too-long': zh
      ? '内容过长，请缩短后重试。'
      : 'Please shorten the entered text.',
    consent: zh
      ? '请确认已阅读信息使用说明。'
      : 'Please confirm the information notice.',
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (name: string) => String(data.get(name) || '');
    const topic = topics.find((item) => item.value === read('topic'));
    const result = createHighlandBrief(
      kind,
      {
        name: read('name'),
        company: read('company'),
        email: read('email'),
        country: read('country'),
        topic:
          topic?.label ||
          (read('topic') === 'other'
            ? zh
              ? '其他方向'
              : 'Other direction'
            : ''),
        quantity: read('quantity'),
        requirements: read('requirements'),
        consent: data.get('consent') === 'on',
      },
      locale,
    );
    if (!result.ok) {
      setMessage(messages[result.error]);
      setBrief(null);
      return;
    }
    setBrief(result);
    setMessage(
      zh
        ? '需求文件已生成，尚未发送。请打开邮件或下载后自行发送。'
        : 'Brief prepared, not sent. Open your email app or download the brief to send it yourself.',
    );
  }
  function download() {
    if (!brief) return;
    const blob = new Blob(['\uFEFF' + brief.text], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `farmetra-${kind}-brief.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief.text);
      setMessage(
        zh
          ? '已复制。请粘贴到邮件中发送。'
          : 'Copied. Paste into your email to send.',
      );
    } catch {
      setMessage(
        zh
          ? '浏览器未允许复制，请使用下载按钮。'
          : 'Clipboard unavailable. Please download your brief instead.',
      );
    }
  }
  return (
    <div className="hp-intake">
      <aside className="hp-intake__aside">
        <p className="hp-eyebrow">
          {kind === 'buyer' ? 'SOURCING DESK' : 'PARTNERSHIP DESK'}
        </p>
        <h2>{zh ? '先把需求说清楚。' : 'Let’s start with a clear brief.'}</h2>
        <p>
          {zh
            ? '请填写产品或合作方向、目标市场和具体需求，便于后续准确对接。'
            : 'Share your product or partnership direction, target market and requirements for a more focused conversation.'}
        </p>
        <div className="hp-notice">
          {zh
            ? '当前版本只在本页生成需求文件，不会自动提交到后台或发送邮件。点击打开邮件后，仍需在你的邮件应用内确认发送。'
            : 'This version prepares a brief locally on this page. It does not automatically submit data or send email. You must confirm sending in your email application.'}
        </div>
        <p>{zh ? '现有联系邮箱' : 'Existing contact email'}</p>
        <a href={`mailto:${email}`}>{email}</a>
        <p className="hp-fineprint">
          {zh
            ? '请勿填写身份证、银行账户、客户名单等敏感信息。'
            : 'Do not include identity documents, bank details or customer lists.'}
        </p>
      </aside>
      <form
        className="hp-form"
        onSubmit={submit}
        onChange={() => {
          setBrief(null);
          setMessage('');
        }}
      >
        <div className="hp-form__grid">
          <label>
            {zh ? '联系人 *' : 'Contact name *'}
            <input name="name" required maxLength={200} autoComplete="name" />
          </label>
          <label>
            {zh ? '企业 / 机构 *' : 'Company / organisation *'}
            <input
              name="company"
              required
              maxLength={200}
              autoComplete="organization"
            />
          </label>
          <label>
            {zh ? '电子邮箱 *' : 'Email *'}
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
            />
          </label>
          <label>
            {kind === 'buyer'
              ? zh
                ? '目标国家或地区 *'
                : 'Destination country / region *'
              : zh
                ? '所在国家或地区 *'
                : 'Your country / region *'}
            <input name="country" required maxLength={200} />
          </label>
          <label>
            {kind === 'buyer'
              ? zh
                ? '采购方向 *'
                : 'Sourcing collection *'
              : zh
                ? '合作类型 *'
                : 'Partnership type *'}
            <select name="topic" required defaultValue={validTopic}>
              <option value="">{zh ? '请选择' : 'Please select'}</option>
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
              <option value="other">
                {zh ? '其他方向' : 'Other direction'}
              </option>
            </select>
          </label>
          <label>
            {kind === 'buyer'
              ? zh
                ? '预计数量及单位'
                : 'Indicative quantity & unit'
              : zh
                ? '拟合作规模 / 范围'
                : 'Proposed scope'}
            <input
              name="quantity"
              maxLength={200}
              placeholder={
                kind === 'buyer'
                  ? zh
                    ? '例如：样品 2 kg；预计每批 1 吨'
                    : 'e.g. sample 2 kg; expected 1 tonne / batch'
                  : zh
                    ? '例如：产能、渠道或专业能力'
                    : 'e.g. capacity, channels or specialist capability'
              }
            />
          </label>
          <label className="hp-form__wide">
            {zh ? '具体需求 *' : 'Requirements *'}
            <textarea
              name="requirements"
              required
              maxLength={3000}
              rows={6}
              placeholder={
                kind === 'buyer'
                  ? zh
                    ? '产品形态、用途、关键规格、包装、目标时间及所需资料。'
                    : 'Format, use, specifications, packaging, timing and required documents.'
                  : zh
                    ? '请介绍企业、可提供的资源与希望采用的合作方式。'
                    : 'Introduce your organisation, available resources and preferred way of working.'
              }
            />
          </label>
        </div>
        <label className="hp-consent">
          <input name="consent" type="checkbox" required />
          <span>
            {zh ? '我已阅读' : 'I have read the '}{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              {zh
                ? '需求信息说明（新窗口）'
                : 'enquiry information notice (new tab)'}
            </Link>
            {zh
              ? '，理解内容仅在本页生成，发送邮件由我自行确认。'
              : ' and understand that this page only prepares a brief; I decide whether to send it.'}
          </span>
        </label>
        <button className="hp-button" type="submit">
          {zh ? '生成需求文件' : 'Prepare my brief'} ↗
        </button>
        <p className="hp-fineprint">
          {zh
            ? '这不是下单或签约。具体服务、准入、供货与合作条款需另行确认。'
            : 'This is not an order or agreement. Services, access requirements, supply and partnership terms must be confirmed separately.'}
        </p>
        <p className="hp-form__status" role="status" aria-live="polite">
          {message}
        </p>
        {brief && (
          <section className="hp-brief-result">
            <h3>{zh ? '需求文件预览 · 尚未发送' : 'Your brief · not sent'}</h3>
            <pre>{brief.text}</pre>
            <div className="hp-actions">
              <a className="hp-button" href={buildBriefMailto(email, brief)}>
                {zh ? '打开邮件应用' : 'Open email app'} ↗
              </a>
              <button type="button" className="hp-link" onClick={download}>
                {zh ? '下载需求文件' : 'Download brief'} ↓
              </button>
              <button type="button" className="hp-link" onClick={copy}>
                {zh ? '复制内容' : 'Copy text'}
              </button>
            </div>
            <p className="hp-fineprint">
              {zh
                ? '若邮件未打开或内容被截断，请下载文件后手动附加至邮件。'
                : 'If your email app does not open or truncates the message, download the brief and attach it manually.'}
            </p>
          </section>
        )}
      </form>
    </div>
  );
}
