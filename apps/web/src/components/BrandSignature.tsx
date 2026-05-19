export function BrandSignature() {
  return (
    <span className="brand-signature">
      <span aria-hidden="true" className="brand-signature__icon">
        <svg viewBox="0 0 72 72">
          <rect x="5" y="5" width="62" height="62" rx="16" fill="#173628" />
          <rect x="11" y="11" width="50" height="50" rx="12" fill="none" stroke="#d3b06d" strokeWidth="2" />
          <path d="M18 49c7-2 13-7 18-17 4 6 10 11 18 14" fill="none" stroke="#f3e6c8" strokeLinecap="round" strokeWidth="4" />
          <path d="M18 54h36" fill="none" stroke="#d3b06d" strokeLinecap="round" strokeWidth="3.2" />
          <path d="M28 22c6 0 10 4 12 11-8 0-12-4-12-11Z" fill="#d7dfb1" />
          <path d="M45 23c5 1 8 5 8 10-6 0-9-3-8-10Z" fill="#9bb68c" />
        </svg>
      </span>
      <span className="brand-signature__text">
        <span className="brand-signature__title">Nongye Chuhai</span>
        <span className="brand-signature__subtitle">Direct Farm Sourcing &amp; End-to-End Export Delivery</span>
      </span>
    </span>
  );
}