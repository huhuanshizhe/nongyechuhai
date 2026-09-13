'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Link } from '../i18n/routing';
import { localize } from '../lib/highland';
import {
  buyerTypes,
  offerings,
  supplyStages,
  type Offering,
} from '../lib/buyer-offerings';

export function BuyerCatalogue({
  locale,
  initialBuyer = '',
  initialStage = '',
  initialFocus = '',
}: {
  locale: string;
  initialBuyer?: string;
  initialStage?: string;
  initialFocus?: string;
}) {
  const zh = locale === 'zh';
  const [stage, setStage] = useState(
    supplyStages.some((s) => s.id === initialStage) ? initialStage : 'all',
  );
  const [buyer, setBuyer] = useState(
    buyerTypes.some((b) => b.id === initialBuyer) ? initialBuyer : 'all',
  );
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(
    ['vitamin-c', 'anthocyanins', 'carotenoids', 'grains'].includes(
      initialFocus,
    )
      ? initialFocus
      : 'all',
  );
  const compositionGroups = [
    {
      id: 'vitamin-c',
      name: { zh: '维生素 C 配方方向', en: 'Vitamin C formulation' },
      items: [
        'sea-buckthorn-juice',
        'chestnut-rose-juice',
        'own-label-juice',
        'own-label-sachets',
      ],
    },
    {
      id: 'anthocyanins',
      name: { zh: '花青素与紫色果饮', en: 'Anthocyanins & purple drinks' },
      items: ['black-goji-nfc', 'black-goji-dried', 'own-label-juice'],
    },
    {
      id: 'carotenoids',
      name: { zh: '类胡萝卜素与果实风味', en: 'Carotenoids & fruit character' },
      items: [
        'dried-goji',
        'goji-puree',
        'red-goji-nfc',
        'sea-buckthorn-juice',
        'own-label-sachets',
      ],
    },
    {
      id: 'grains',
      name: { zh: '谷物纤维与蛋白质方向', en: 'Grain fibre & protein' },
      items: ['grains', 'own-label-snacks'],
    },
  ];
  const [selection, setSelection] = useState<{ ids: string[]; notice: string }>(
    { ids: [], notice: '' },
  );
  const { ids: selected, notice } = selection;
  const visible = offerings.filter(
    (item) =>
      (stage === 'all' || item.stages.some((s) => s === stage)) &&
      (buyer === 'all' || item.buyers.some((b) => b === buyer)) &&
      (focus === 'all' ||
        compositionGroups
          .find((group) => group.id === focus)
          ?.items.includes(item.id)) &&
      [
        item.name.zh,
        item.name.en,
        localize(item.format, locale),
        localize(item.use, locale),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const shortlist = offerings.filter((item) => selected.includes(item.id));
  function toggle(item: Offering) {
    setSelection((previous) => {
      if (previous.ids.includes(item.id))
        return { ids: previous.ids.filter((id) => id !== item.id), notice: '' };
      if (previous.ids.length < 3)
        return { ids: [...previous.ids, item.id], notice: '' };
      return {
        ...previous,
        notice: zh
          ? '可同时比较 3 项。请先移除一项。'
          : 'Compare up to 3 formats. Remove one to add another.',
      };
    });
  }
  function enquiry(items: Offering[]) {
    const brief = [
      zh
        ? '希望咨询以下产品或开发方案：'
        : 'I would like to discuss these products or development options:',
      ...items.map(
        (item) =>
          `• ${localize(item.name, locale)} — ${localize(item.format, locale)}`,
      ),
      '',
      zh
        ? '请提供适用规格、样品、包装选项、起订量、交期与目的地所需文件。'
        : 'Please share applicable specifications, samples, packaging options, MOQ, lead times and destination documentation.',
    ].join('\n');
    return `/sourcing?${new URLSearchParams({ brief, ...(buyer === 'all' ? {} : { buyer }), ...(items.some((item) => item.development) ? { topic: 'product-development' } : {}) })}`;
  }
  return (
    <div id="formats" className="ft-buyer-catalogue">
      <div className="ft-heading">
        <div>
          <span className="ft-section-label">
            {zh ? '按您的业务选产品' : 'Source by the way you work'}
          </span>
          <h2>
            {zh
              ? '从一颗果实，到一款品牌食品。'
              : 'From whole berries to your own food range.'}
          </h2>
        </div>
        <p>
          {zh
            ? '采购食材、选择食品原料，或开发您的品牌产品。按产品层次与业务类型缩小选择，比较后带着具体需求来交流。'
            : 'Buy whole foods, choose an ingredient or develop a branded product. Filter by format and business type, then compare options for a focused sourcing conversation.'}
        </p>
      </div>
      <div
        className="ft-format-tabs"
        role="group"
        aria-label={zh ? '供应形式' : 'Supply formats'}
      >
        <button
          type="button"
          aria-pressed={stage === 'all'}
          onClick={() => setStage('all')}
        >
          <span>00</span>
          <strong>{zh ? '全部形式' : 'All formats'}</strong>
          <small>
            {zh ? '完整产品与开发方向' : 'Products and development options'}
          </small>
        </button>
        {supplyStages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={stage === s.id}
            onClick={() => setStage(s.id)}
          >
            <span>0{i + 1}</span>
            <strong>{localize(s.name, locale)}</strong>
            <small>{localize(s.copy, locale)}</small>
          </button>
        ))}
      </div>
      <div className="ft-offering-filters">
        <label>
          <span>{zh ? '您的业务类型' : 'Your business'}</span>
          <select value={buyer} onChange={(e) => setBuyer(e.target.value)}>
            <option value="all">
              {zh ? '全部客户类型' : 'All buyer types'}
            </option>
            {buyerTypes.map((b) => (
              <option key={b.id} value={b.id}>
                {localize(b.name, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            {zh ? '配方与成分关注' : 'Formulation & composition focus'}
          </span>
          <select value={focus} onChange={(e) => setFocus(e.target.value)}>
            <option value="all">
              {zh ? '全部配方方向' : 'All formulation profiles'}
            </option>
            {compositionGroups.map((group) => (
              <option value={group.id} key={group.id}>
                {localize(group.name, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            {zh ? '搜索产品与用途' : 'Search products & applications'}
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              zh
                ? '例如 NFC、原浆、果汁、早餐'
                : 'Try NFC, purée, juice or breakfast'
            }
          />
        </label>
      </div>
      <div className="ft-offering-status">
        <p role="status">
          {zh
            ? `${visible.length} 项产品与开发方向 · 已选 ${selected.length}/3 项比较`
            : `${visible.length} products & development options · ${selected.length}/3 selected`}
        </p>
        <button
          type="button"
          onClick={() => {
            setStage('all');
            setBuyer('all');
            setQuery('');
            setFocus('all');
          }}
        >
          {zh ? '重置筛选' : 'Reset filters'}
        </button>
      </div>
      {shortlist.length > 0 && (
        <div className="ft-shortlist-bar">
          <span>
            {zh
              ? `已选 ${shortlist.length} 项采购选择`
              : `${shortlist.length} sourcing options selected`}
          </span>
          <a href="#compare">{zh ? '查看对比' : 'View comparison'} ↓</a>
          <Link
            className="ft-button ft-button--compact"
            href={enquiry(shortlist)}
          >
            {zh ? '生成询价需求' : 'Build an enquiry'} →
          </Link>
        </div>
      )}
      <div className="ft-offering-grid">
        {visible.map((item) => (
          <article key={item.id} className="ft-offering-card">
            <div className="ft-offering-image">
              <Image
                src={`/images/brand-v2/${item.image}`}
                alt={
                  zh
                    ? `${localize(item.name, locale)}的食材或应用示意`
                    : `Ingredient or serving illustration for ${localize(item.name, locale)}`
                }
                fill
                sizes="(max-width: 650px) 100vw, (max-width: 1050px) 50vw, 33vw"
              />
              <span>
                {item.development
                  ? zh
                    ? '联合开发选项'
                    : 'Development option'
                  : zh
                    ? '采购产品形态'
                    : 'Sourcing format'}
              </span>
            </div>
            <div className="ft-offering-body">
              <div className="ft-offering-tags">
                {item.stages.map((id) => (
                  <span key={id}>
                    {localize(
                      supplyStages.find((s) => s.id === id)!.name,
                      locale,
                    )}
                  </span>
                ))}
              </div>
              <h3>{localize(item.name, locale)}</h3>
              <p className="ft-offering-format">
                {localize(item.format, locale)}
              </p>
              <dl>
                <div>
                  <dt>{zh ? '适合做什么' : 'Applications'}</dt>
                  <dd>{localize(item.use, locale)}</dd>
                </div>
                <div>
                  <dt>
                    {zh ? '风味与配方价值' : 'Flavour & formulation value'}
                  </dt>
                  <dd>{localize(item.value, locale)}</dd>
                </div>
              </dl>
              <details className="ft-offering-specs">
                <summary>
                  {zh ? '采购要点与适用客户' : 'Buying points & buyer fit'}
                </summary>
                <p>{localize(item.specs, locale)}</p>
                <p>
                  {item.buyers
                    .map((id) =>
                      localize(
                        buyerTypes.find((b) => b.id === id)!.name,
                        locale,
                      ),
                    )
                    .join(' · ')}
                </p>
                {item.origin && <p>{localize(item.origin, locale)}</p>}
              </details>
              <div className="ft-offering-actions">
                <button
                  type="button"
                  aria-label={`${zh ? '比较' : 'Compare'} ${localize(item.name, locale)}`}
                  aria-pressed={selected.includes(item.id)}
                  onClick={() => toggle(item)}
                >
                  {selected.includes(item.id)
                    ? zh
                      ? '✓ 已选比较'
                      : '✓ Selected'
                    : zh
                      ? '+ 加入比较'
                      : '+ Compare'}
                </button>
                <Link href={enquiry([item])}>
                  {zh ? '咨询此项' : 'Enquire'} ↗
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="ft-empty">
          <h3>
            {zh
              ? '调整筛选，或告诉我们您的产品计划。'
              : 'Try another filter or share your product brief.'}
          </h3>
          <Link href="/sourcing" className="ft-text-link">
            {zh ? '交流采购需求' : 'Discuss your brief'} →
          </Link>
        </div>
      )}
      <p role="status" className="ft-selection-notice">
        {notice}
      </p>
      {shortlist.length > 0 && (
        <section
          id="compare"
          className="ft-shortlist"
          aria-label={zh ? '采购方案比较' : 'Sourcing comparison'}
        >
          <div className="ft-shortlist-heading">
            <h3>
              {zh ? '把采购选择放在一起看。' : 'Your options, side by side.'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelection({ ids: [], notice: '' });
              }}
            >
              {zh ? '清空比较' : 'Clear comparison'}
            </button>
          </div>
          <p className="ft-comparison-hint">
            {zh
              ? '左右滑动查看其他采购选择。'
              : 'Swipe sideways to view the other options.'}
          </p>
          <div
            className="ft-comparison-scroll"
            tabIndex={0}
            aria-label={
              zh
                ? '可横向滚动的产品比较表'
                : 'Horizontally scrollable product comparison'
            }
          >
            <table>
              <caption>
                {zh ? '所选产品形态比较' : 'Selected format comparison'}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{zh ? '比较项目' : 'Buying point'}</th>
                  {shortlist.map((item) => (
                    <th scope="col" key={item.id}>
                      {localize(item.name, locale)}
                      <button
                        type="button"
                        aria-label={`${zh ? '移除' : 'Remove'} ${localize(item.name, locale)}`}
                        onClick={() => toggle(item)}
                      >
                        ×
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    zh ? '产品形式' : 'Format',
                    (item: Offering) => localize(item.format, locale),
                  ],
                  [
                    zh ? '应用方向' : 'Applications',
                    (item: Offering) => localize(item.use, locale),
                  ],
                  [
                    zh ? '配方价值' : 'Formulation value',
                    (item: Offering) => localize(item.value, locale),
                  ],
                  [
                    zh ? '规格沟通' : 'Specifications',
                    (item: Offering) => localize(item.specs, locale),
                  ],
                  [
                    zh ? '采购路径' : 'Sourcing route',
                    (item: Offering) =>
                      item.development
                        ? zh
                          ? '按简报打样与开发'
                          : 'Brief-led sampling & development'
                        : zh
                          ? '沟通具体产品与样品'
                          : 'Product & sample discussion',
                  ],
                ].map(([label, get]) => (
                  <tr key={String(label)}>
                    <th scope="row">{String(label)}</th>
                    {shortlist.map((item) => (
                      <td key={item.id}>
                        {(get as (item: Offering) => string)(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ft-shortlist-footer">
            <p>
              {zh
                ? '以具体样品和供应商条件确认价格、起订量、交期及目的地适用性。'
                : 'Confirm price, MOQ, lead time and destination suitability against actual samples and supplier terms.'}
            </p>
            <Link href={enquiry(shortlist)} className="ft-button">
              {zh ? '带着这份选择询价' : 'Enquire about this shortlist'} →
            </Link>
          </div>
        </section>
      )}
      <p className="ft-offering-footnote">
        {zh
          ? '开发选项按配方、加工及包装条件沟通打样。图片为食材与应用示意；规格、营养含量、认证与出口条件按具体产品和目标市场确认。'
          : 'Development options are discussed through recipe, processing and packaging briefs. Ingredient and serving imagery is illustrative. Specifications, nutrient content, certification and export requirements are confirmed for each product and market.'}
      </p>
    </div>
  );
}
