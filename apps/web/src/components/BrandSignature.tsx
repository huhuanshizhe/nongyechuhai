export function BrandSignature() {
  return (
    <span className="brand-signature">
      <span aria-hidden="true" className="brand-signature__icon">
        <svg viewBox="0 0 96 96" role="img">
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a3c2d" />
              <stop offset="60%" stopColor="#234a38" />
              <stop offset="100%" stopColor="#c4a04a" />
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="80" height="80" rx="16" fill="url(#brandGradient)" />
          <path d="M24 61c10-6 23-10 40-10 10 0 19 1 28 4" fill="none" stroke="rgba(255,255,255,0.6)" strokeLinecap="round" strokeWidth="3.6" />
          <path d="M24 48c11-5 24-8 40-8 10 0 19 1 28 3" fill="none" stroke="rgba(255,255,255,0.4)" strokeLinecap="round" strokeWidth="2.8" />
          <path d="M31 69 48 50 68 29" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.8" />
          <circle cx="68" cy="29" r="4.5" fill="#fef08a" />
        </svg>
      </span>
      <span className="brand-signature__text">
        <span aria-label="farmetra" className="brand-signature__wordmark">
          <span className="brand-signature__wordmark-farm">farm</span>
          <span className="brand-signature__wordmark-etra">etra</span>
        </span>
        <span className="brand-signature__subtitle">Direct Farm Sourcing · End-to-End Export</span>
      </span>
    </span>
  );
}