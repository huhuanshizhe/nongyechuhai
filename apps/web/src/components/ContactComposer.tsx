'use client';
import { type FormEvent, useState } from 'react';
import { directions, localize } from '../lib/highland';
import { buildBriefMailto } from '../lib/highland-intake';
import { buyerTypes } from '../lib/buyer-offerings';
export function ContactComposer({
  locale,
  email,
  initialTopic,
  initialBrief = '',
  initialBuyer = '',
}: {
  locale: string;
  email: string;
  initialTopic?: string;
  initialBrief?: string;
  initialBuyer?: string;
}) {
  const zh = locale === 'zh';
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');
  const selected = directions.some((item) => item.slug === initialTopic)
    ? initialTopic
    : initialTopic === 'partnership' ||
        initialTopic === 'rainbow-trout' ||
        initialTopic === 'product-development'
      ? initialTopic
      : '';
  function compose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) || '').trim();
    const item = directions.find((item) => item.slug === get('topic'));
    const topic = item
      ? localize(item.name, locale)
      : get('topic') === 'partnership'
        ? zh
          ? '合作交流'
          : 'Partnership'
        : get('topic') === 'rainbow-trout'
          ? zh
            ? '虹鳟采购咨询'
            : 'Rainbow trout sourcing'
          : get('topic') === 'product-development'
            ? zh
              ? '贴牌与产品开发'
              : 'Private label & product development'
            : zh
              ? '产品咨询'
              : 'Product enquiry';
    const subject = `Farmetra | ${topic}`;
    const text = [
      (zh ? '姓名' : 'Name') + ': ' + get('name'),
      (zh ? '邮箱' : 'Email') + ': ' + get('email'),
      (zh ? '企业' : 'Company') + ': ' + get('company'),
      (zh ? '业务类型' : 'Buyer type') +
        ': ' +
        (buyerTypes.find((b) => b.id === get('buyer'))?.name[
          zh ? 'zh' : 'en'
        ] || get('buyer')),
      (zh ? '目的地' : 'Destination') + ': ' + get('destination'),
      (zh ? '预计数量' : 'Expected quantity') + ': ' + get('quantity'),
      (zh ? '产品 / 合作' : 'Product / partnership') + ': ' + topic,
      '',
      get('message'),
    ].join('\n');
    setPreview(`To: ${email}\nSubject: ${subject}\n\n${text}`);
    setStatus('');
    const action = (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
      'value',
    );
    if (action !== 'preview')
      window.location.href = buildBriefMailto(email, { subject, text });
  }
  return (
    <form className="ft-contact-form" onSubmit={compose}>
      <div>
        <label>
          {zh ? '您的姓名' : 'Your name'}
          <input name="name" required maxLength={100} autoComplete="name" />
        </label>
        <label>
          {zh ? '电子邮箱' : 'Email address'}
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
          />
        </label>
        <label>
          {zh ? '企业名称' : 'Company'}
          <input name="company" maxLength={200} autoComplete="organization" />
        </label>
        <label>
          {zh ? '目标国家或地区' : 'Destination country / region'}
          <input
            name="destination"
            maxLength={120}
            autoComplete="country-name"
          />
        </label>
        <label>
          {zh ? '您的业务类型' : 'Your business type'}
          <select
            name="buyer"
            defaultValue={
              buyerTypes.some((b) => b.id === initialBuyer) ? initialBuyer : ''
            }
          >
            <option value="">
              {zh ? '请选择业务类型' : 'Select your business'}
            </option>
            {buyerTypes.map((b) => (
              <option key={b.id} value={b.id}>
                {localize(b.name, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {zh ? '预计数量（含单位）' : 'Expected quantity (with unit)'}
          <input
            name="quantity"
            maxLength={120}
            placeholder={
              zh ? '例如：500 kg，或待商议' : 'e.g. 500 kg, or to be discussed'
            }
          />
        </label>
        <label>
          {zh ? '感兴趣的产品' : 'I’m interested in'}
          <select name="topic" defaultValue={selected}>
            <option value="">{zh ? '请选择' : 'Please select'}</option>
            {directions.map((item) => (
              <option key={item.slug} value={item.slug}>
                {localize(item.name, locale)}
              </option>
            ))}
            <option value="partnership">
              {zh ? '合作交流' : 'Partnership'}
            </option>
            <option value="rainbow-trout">
              {zh ? '虹鳟采购咨询' : 'Rainbow trout sourcing'}
            </option>
            <option value="product-development">
              {zh ? '贴牌与产品开发' : 'Private label & product development'}
            </option>
          </select>
        </label>
      </div>
      <label>
        {zh ? '告诉我们您的想法' : 'What do you have in mind?'}
        <textarea
          name="message"
          rows={5}
          required
          maxLength={1800}
          defaultValue={initialBrief}
          placeholder={
            zh
              ? '产品、用途、目标市场，或一个新的合作想法。'
              : 'A product, an application, a destination or a new idea.'
          }
        />
      </label>
      <div className="ft-contact-actions">
        <button type="submit" value="email" className="ft-button">
          {zh ? '在邮件中继续' : 'Continue in email'}
        </button>
        <button
          type="submit"
          value="preview"
          className="ft-button ft-button--outline"
        >
          {zh ? '预览并复制需求' : 'Preview & copy brief'}
        </button>
      </div>
      <p>
        {zh
          ? '请在邮件应用中确认发送；也可复制需求后使用您常用的邮箱发送。'
          : 'Confirm sending in your email app, or copy the brief into your preferred email service.'}
      </p>
      {preview && (
        <section className="ft-contact-preview">
          <pre tabIndex={0}>{preview}</pre>
          <button
            type="button"
            className="ft-button ft-button--compact"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(preview);
                setStatus(
                  zh
                    ? '已复制。请粘贴到邮件中发送。'
                    : 'Copied. Paste into your email to send.',
                );
              } catch {
                setStatus(
                  zh
                    ? '请选中上方内容手动复制。'
                    : 'Select the text above to copy it manually.',
                );
              }
            }}
          >
            {zh ? '复制邮件内容' : 'Copy email text'}
          </button>
          <p role="status">{status}</p>
        </section>
      )}
      <p>
        {zh ? '也可以直接发送邮件至' : 'Or email us directly at'}{' '}
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </form>
  );
}
