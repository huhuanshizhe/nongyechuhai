export function BrandSignature() {
  return (
    <span className="brand-signature">
      <span aria-hidden="true" className="brand-signature__icon">
        <svg viewBox="0 0 88 88">
          <rect x="5" y="5" width="78" height="78" rx="20" fill="#163629" />
          <circle cx="44" cy="44" r="26" fill="none" stroke="#dcc28d" strokeWidth="2.4" />
          <path d="M18 44h52" fill="none" stroke="#dcc28d" strokeOpacity="0.72" strokeWidth="1.8" />
          <path d="M44 18c-8 8-12 17-12 26s4 18 12 26" fill="none" stroke="#dcc28d" strokeOpacity="0.7" strokeWidth="1.8" />
          <path d="M44 18c8 8 12 17 12 26s-4 18-12 26" fill="none" stroke="#dcc28d" strokeOpacity="0.7" strokeWidth="1.8" />
          <path d="M28 57c5-1 9-5 13-11 5 5 10 8 18 9" fill="none" stroke="#f4ead3" strokeLinecap="round" strokeWidth="4.2" />
          <path d="M39 24c7 1 12 6 14 14-11 1-16-3-14-14Z" fill="#b9cf8f" />
          <path d="M24 63h40" fill="none" stroke="#c89b55" strokeLinecap="round" strokeWidth="3.2" />
        </svg>
      </span>
      <span className="brand-signature__text">
        <span className="brand-signature__title">farmetra</span>
        <span className="brand-signature__subtitle">Global Agricultural Sales Platform</span>
      </span>
    </span>
  );
}