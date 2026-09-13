import Image from 'next/image';
import { Link } from '../i18n/routing';
import { localize, type Collection } from '../lib/highland';
export function EditorialProductCard({
  item,
  locale,
}: {
  item: Collection;
  locale: string;
}) {
  return (
    <Link className="ft-product" href={`/collections/${item.slug}`}>
      <div className="ft-product__image">
        <Image
          src={item.image}
          alt={localize(item.name, locale)}
          fill
          sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
      </div>
      <div className="ft-product__copy">
        <h3>{localize(item.name, locale)}</h3>
        <p>{localize(item.description, locale)}</p>
        <span>{locale === 'zh' ? '了解产品' : 'Discover more'}</span>
      </div>
    </Link>
  );
}
