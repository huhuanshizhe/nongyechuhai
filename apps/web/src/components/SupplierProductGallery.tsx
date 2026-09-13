import Image from 'next/image';
import { Link } from '../i18n/routing';

export function SupplierProductGallery({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  const products = [
    {
      image: 'supplier-red-goji-box.jpg',
      name: zh ? '红枸杞小袋装' : 'Red goji sachets',
      pack: '75 g · 5 g × 15',
      direction: 'goji',
    },
    {
      image: 'supplier-black-goji-jar.jpg',
      name: zh ? '黑枸杞瓶装' : 'Black goji jar',
      pack: '80 g',
      direction: 'black-goji',
    },
    {
      image: 'supplier-fresh-locked-goji-jar.jpg',
      name: zh ? '锁鲜枸杞瓶装' : 'Fresh-locked goji jar',
      pack: '100 g',
      direction: 'goji',
    },
    {
      image: 'supplier-goji-blossom-honey.jpg',
      name: zh ? '枸杞花蜜瓶装' : 'Goji blossom honey jar',
      pack: '450 g',
      direction: 'honey',
    },
    {
      image: 'supplier-goji-sprout-tea-jar.jpg',
      name: zh ? '枸杞芽茶瓶装' : 'Goji sprout infusion jar',
      pack: '70 g',
      direction: 'goji',
    },
    {
      image: 'supplier-goji-leaf-tea-box.jpg',
      name: zh ? '枸杞叶茶小袋装' : 'Goji leaf infusion sachets',
      pack: '60 g · 4 g × 15',
      direction: 'goji',
    },
  ];
  return (
    <section id="supplier-range" className="ft-supplier-range">
      <div className="ft-container ft-section">
        <div className="ft-heading">
          <div>
            <span className="ft-section-label">
              {zh ? '高原成品包装' : 'Supplier product range'}
            </span>
            <h2>
              {zh ? '从果实，到货架上的产品。' : 'From the berry to the shelf.'}
            </h2>
          </div>
          <p>
            {zh
              ? '探索供应商品牌的零售包装：小袋、瓶装与蜜源特色产品。围绕您的市场，进一步沟通样品、品牌及包装需求。'
              : 'Explore supplier-brand retail formats, from portioned berries to jars and floral-source honey. Discuss samples, branding and packaging for your market.'}
          </p>
        </div>
        <div className="ft-supplier-range-grid">
          {products.map((product) => (
            <figure key={product.image}>
              <Link
                href={`/sourcing?${new URLSearchParams({ direction: product.direction, brief: `${product.name} · ${product.pack}` })}`}
                aria-label={`${zh ? '咨询' : 'Enquire about'} ${product.name}`}
              >
                <Image
                  src={`/images/brand-v2/${product.image}`}
                  alt={`${zh ? '供应商提供的产品实拍：' : 'Supplier-provided product photograph: '}${product.name}`}
                  fill
                  sizes="(max-width: 650px) 50vw, 33vw"
                />
              </Link>
              <figcaption>
                <strong>{product.name}</strong>
                <span>
                  {product.pack} · {zh ? '展示包装' : 'Shown pack'} ↗
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="ft-offering-footnote">
          {zh
            ? '照片由衡塬萃提供，容量为图示包装信息。出口包装、标签、起订量、植物原料适用性及认证范围按具体产品和目标市场确认。'
            : 'Photographs are supplied by Hengyuancui; sizes refer to the packs shown. Export packaging, labels, MOQ, botanical ingredient eligibility and certification scope are confirmed for each product and destination.'}
        </p>
      </div>
    </section>
  );
}
