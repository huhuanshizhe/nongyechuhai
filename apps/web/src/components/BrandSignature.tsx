import { useId } from 'react';

export function BrandSignature() {
  const plateGradientId = useId();
  const glowGradientId = useId();
  const routeGradientId = useId();

  return (
    <span className="brand-signature">
      <span aria-hidden="true" className="brand-signature__icon">
        <svg viewBox="0 0 96 96" role="img">
          <defs>
            <linearGradient id={plateGradientId} x1="14" y1="10" x2="84" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#173628" />
              <stop offset="48%" stopColor="#224737" />
              <stop offset="100%" stopColor="#9b7332" />
            </linearGradient>
            <radialGradient id={glowGradientId} cx="0" cy="0" r="1" gradientTransform="translate(70 28) rotate(132) scale(32 30)" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(244, 199, 106, 0.95)" />
              <stop offset="58%" stopColor="rgba(244, 199, 106, 0.24)" />
              <stop offset="100%" stopColor="rgba(244, 199, 106, 0)" />
            </radialGradient>
            <linearGradient id={routeGradientId} x1="34" y1="72" x2="72" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f7f0df" />
              <stop offset="100%" stopColor="#f3c364" />
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="80" height="80" rx="18" fill={`url(#${plateGradientId})`} />
          <rect x="14" y="14" width="68" height="68" rx="15" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
          <rect x="14" y="14" width="68" height="68" rx="15" fill={`url(#${glowGradientId})`} opacity="0.86" />
          <circle cx="71" cy="28" r="6.4" fill="#f1c56a" />
          <circle cx="71" cy="28" r="10.6" fill="none" stroke="rgba(241,197,106,0.24)" strokeWidth="1.5" />
          <path d="M18 64c9.2-5.8 19.4-8.8 30.8-8.8 11.6 0 22.6 2.8 33.2 8.6" fill="none" stroke="rgba(255,255,255,0.18)" strokeLinecap="round" strokeWidth="2.2" />
          <path d="M18 74c10.4-6.6 21.8-10 34.2-10 10.8 0 20.8 2.4 30.2 7.2" fill="none" stroke="rgba(255,255,255,0.14)" strokeLinecap="round" strokeWidth="2.8" />
          <path d="M24 52.6c8.8-4.8 18.4-7.2 29-7.2 11 0 21.4 2.4 31.2 7" fill="none" stroke="rgba(255,255,255,0.1)" strokeLinecap="round" strokeWidth="1.6" />
          <path d="M39.2 70.2c1.2-17 10.2-31.2 28.6-44.6" fill="none" stroke={`url(#${routeGradientId})`} strokeLinecap="round" strokeWidth="5.2" />
          <path d="M66.8 24.8 76 27.1 71.6 35.8" fill="none" stroke="#faf4e8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.8" />
          <path d="M39.4 43.4c5 .2 8.8 2.6 11.4 7.2-5-.2-8.8-2.6-11.4-7.2Z" fill="rgba(250,244,232,0.88)" />
          <path d="M50.8 49.2c5.6-1.4 10.8.4 15.4 5.4-5.8 1.4-10.8-.4-15.4-5.4Z" fill="rgba(241,197,106,0.94)" />
        </svg>
      </span>
      <span className="brand-signature__text">
        <span aria-label="farmetra" className="brand-signature__wordmark">
          <span className="brand-signature__wordmark-farm">farm</span>
          <span aria-hidden="true" className="brand-signature__wordmark-seed" />
          <span className="brand-signature__wordmark-etra">etra</span>
        </span>
        <span className="brand-signature__subtitle">Direct Farm Sourcing · End-to-End Export</span>
      </span>
    </span>
  );
}