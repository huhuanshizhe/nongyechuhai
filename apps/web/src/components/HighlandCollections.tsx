'use client';
import { useState } from 'react';
import { directions, localize } from '../lib/highland';
import { EditorialProductCard } from './EditorialProductCard';
import { Link } from '../i18n/routing';
export function HighlandCollections({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const filtered = directions.filter(
    (item) =>
      (category === 'all' || category === item.category) &&
      [
        localize(item.name, locale),
        item.name.zh,
        item.name.en,
        localize(item.applications, locale),
        localize(item.formats, locale),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="ft-catalogue-controls">
        <div
          className="ft-category-tabs"
          role="group"
          aria-label={zh ? '产品分类' : 'Product categories'}
        >
          {[
            ['all', zh ? '全部产品' : 'All products'],
            ['berries', zh ? '浆果系列' : 'Berries'],
            ['grains', zh ? '谷物系列' : 'Grains'],
            ['pantry', zh ? '日常食材' : 'Pantry'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="ft-catalogue-search">
          <span className="ft-sr-only">
            {zh ? '搜索产品' : 'Search products'}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={zh ? '搜索产品或用途' : 'Search products or uses'}
          />
        </label>
      </div>
      <p role="status" className="ft-results">
        {zh
          ? `${filtered.length} 款产品系列`
          : `${filtered.length} collections`}
      </p>
      <div className="ft-product-grid">
        {filtered.map((item) => (
          <EditorialProductCard key={item.slug} item={item} locale={locale} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="ft-empty">
          <h2>{zh ? '寻找其他食材？' : 'Looking for something else?'}</h2>
          <p>
            {zh
              ? '试试其他关键词，或直接告诉我们您的想法。'
              : 'Try a different search, or tell us what you have in mind.'}
          </p>
          <div className="ft-actions">
            <button
              type="button"
              className="ft-button"
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
            >
              {zh ? '查看全部产品' : 'Show all products'}
            </button>
            <Link href="/sourcing" className="ft-text-link">
              {zh ? '联系我们' : 'Contact us'}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
