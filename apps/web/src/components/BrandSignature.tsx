export function BrandSignature() {
  return (
    <span className="brand-signature">
      <span aria-hidden="true" className="brand-signature__icon">
        <svg viewBox="0 0 72 72">
          <rect x="6" y="6" width="60" height="60" rx="18" fill="#1d5334" />
          <path d="M18 43c10-1 18-8 24-21 8 10 12 16 18 18" fill="none" stroke="#f4e7c7" strokeLinecap="round" strokeWidth="4" />
          <path d="M24 52c9-4 17-12 23-26" fill="none" stroke="#d6b26a" strokeLinecap="round" strokeWidth="4" />
          <path d="M45 18c8 1 11 6 11 13-8-1-12-5-11-13Z" fill="#c6d88b" />
        </svg>
      </span>
      <span className="brand-signature__text">
        <span className="brand-signature__title">Nongye Chuhai</span>
        <span className="brand-signature__subtitle">Direct Farm Sourcing &amp; End-to-End Export Delivery</span>
      </span>
    </span>
  );
}