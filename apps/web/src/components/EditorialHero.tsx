import Image from 'next/image';
import type { ReactNode } from 'react';
export function EditorialHero({
  title,
  description,
  image,
  alt,
  children,
  compact = false,
}: {
  title: ReactNode;
  description: string;
  image: string;
  alt: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`ft-hero ${compact ? 'ft-hero--compact' : ''}`}>
      <Image src={image} alt={alt} fill priority sizes="100vw" />
      <div className="ft-container ft-hero__content">
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
