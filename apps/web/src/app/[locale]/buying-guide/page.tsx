import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { EditorialHero } from '../../../components/EditorialHero';
import { BrandContactBand } from '../../../components/BrandContactBand';
import { highlandMetadata } from '../../../lib/highland';
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '采购指南', en: 'Buying guide' },
    {
      zh: '从产品需求到样品确认，了解与 Farmetra 开展采购合作的方式。',
      en: 'From your product brief to samples and delivery planning: a practical guide to sourcing with Farmetra.',
    },
    '/buying-guide',
  );
}
export default async function BuyingGuide({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  const steps = zh
    ? [
        [
          '告诉我们您的需求',
          '提供产品、用途、目标市场、预计数量与包装要求。已有规格表也可以在邮件中附上。',
        ],
        [
          '明确产品与供应方案',
          '围绕关键规格与供应伙伴沟通可选方案，确认哪些产品资料能够提供。',
        ],
        [
          '评估样品与商业条件',
          '沟通样品安排、费用、包装、起订量和交期；采购前共同确认规格与验收依据。',
        ],
        [
          '协调订单与交付',
          '按双方书面约定落实供应方、交易主体、付款、目的地要求及运输安排。',
        ],
      ]
    : [
        [
          'Share your brief',
          'Tell us the product, application, destination, expected volume and packaging needs. Attach an existing specification to your email if you have one.',
        ],
        [
          'Explore the right fit',
          'Discuss product options and supplier capabilities against your key specifications, including which supporting documents are available.',
        ],
        [
          'Review samples & terms',
          'Agree sample arrangements, costs, packaging, minimum quantities and lead times. Confirm specifications and acceptance criteria before purchasing.',
        ],
        [
          'Coordinate your delivery',
          'Confirm the supplier, contracting party, payment terms, destination requirements and shipping arrangements in writing.',
        ],
      ];
  const faqs = zh
    ? [
        [
          '你们服务哪些采购客户？',
          '食品品牌、进口商、分销商、零售采购及食品加工团队。无论您正在开发新的产品系列，还是寻找特色原料，都可以从具体需求开始沟通。',
        ],
        [
          '是否可以采购多个品类？',
          '可以在同一份需求中列出多个品类。我们分别沟通适配的产品与供应方案；合并装运及相关费用需根据供应地点、储运要求和订单情况确认。',
        ],
        [
          '是否支持自有品牌与包装？',
          '可以围绕自有品牌需求沟通包装规格、外文内容与供应伙伴的生产条件。可行性、起订量与设计费用按具体产品确定。',
        ],
        [
          '如何索取样品、规格表或检测资料？',
          '请注明产品、目标市场与需要核对的项目。可提供资料和样品安排依产品与供应方确认；具体认证或检测结果以对应主体、产品及有效文件为准。',
        ],
        [
          '产品价格、起订量和交期是多少？',
          '这些条件取决于规格、包装、数量、季节和目的地。网站展示产品系列，不是实时库存或固定报价；请发送需求以开展具体沟通。',
        ],
        [
          '能否出口到我的市场？',
          '需要结合产品类别、目的地要求和供应方条件逐项确认。请在首次咨询中告知目的地及您的进口要求。',
        ],
      ]
    : [
        [
          'Who do you work with?',
          'Food brands, importers, distributors, retail buying teams and food manufacturers. Start with a specific brief, whether you are developing a new range or exploring a distinctive ingredient.',
        ],
        [
          'Can I enquire about several ingredients together?',
          'Yes. Include all the products in one brief so we can discuss suitable options and suppliers. Consolidated shipping and costs depend on supply locations, storage requirements and the order.',
        ],
        [
          'Can we discuss private-label products?',
          'Yes. Share your pack format, brand requirements and destination. Feasibility, minimum quantities and design costs are confirmed with the relevant production partner.',
        ],
        [
          'How do I request samples, specifications or test documents?',
          'Tell us the product, destination and information you need to review. Document availability and sample arrangements are confirmed with the supplier. Any certification or test result must relate to the specific entity, product and valid document.',
        ],
        [
          'What are your prices, minimum quantities and lead times?',
          'They depend on specification, packaging, volume, season and destination. This website presents product collections, not live inventory or fixed offers. Send your requirements to start a specific discussion.',
        ],
        [
          'Can a product be shipped to my market?',
          'Product eligibility and documentation need to be checked against the destination and supplier. Include your country and import requirements in your first enquiry.',
        ],
      ];
  return (
    <main className="ft-main">
      <EditorialHero
        compact
        image="/images/brand-v2/food-table-editorial.png"
        alt={
          zh
            ? '谷物、浆果与蜂蜜的产品搭配'
            : 'Grains, berries and honey for a food range'
        }
        title={
          zh ? (
            <>
              从一个想法，
              <br />
              到一次具体的合作。
            </>
          ) : (
            <>
              A clear brief.
              <br />A better beginning.
            </>
          )
        }
        description={
          zh
            ? '产品、样品、包装和交付。让每一步采购沟通都有清晰的依据。'
            : 'Products, samples, packaging and delivery. Know what to discuss at each step of your sourcing journey.'
        }
      >
        <Link className="ft-button ft-button--white" href="/sourcing">
          {zh ? '发送采购需求' : 'Start your sourcing brief'}
        </Link>
      </EditorialHero>
      <section className="ft-container ft-section">
        <div className="ft-heading">
          <h2>{zh ? '合作，从这里开始。' : 'How we work together.'}</h2>
          <p>
            {zh
              ? '一个对接窗口，围绕您的产品需求协调供应与专业伙伴。'
              : 'One point of contact to coordinate product, supplier and specialist conversations around your brief.'}
          </p>
        </div>
        <ol className="ft-buying-steps">
          {steps.map(([title, copy], i) => (
            <li key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="ft-guide-band">
        <div className="ft-container ft-guide-brief">
          <div>
            <h2>
              {zh ? '一份好需求，包含什么？' : 'What makes a useful brief?'}
            </h2>
            <p>
              {zh
                ? '信息越具体，越容易找到合适的采购方案。暂不确定的内容，可留待沟通。'
                : 'The more specific the brief, the more focused the sourcing conversation. We can discuss details you have not decided yet.'}
            </p>
          </div>
          <ul>
            {(zh
              ? [
                  '产品与用途',
                  '目标国家或地区',
                  '预计采购数量',
                  '包装与自有品牌需求',
                  '期望交付时间',
                  '需要核对的规格与文件',
                ]
              : [
                  'Product and intended application',
                  'Destination country or region',
                  'Expected order volume',
                  'Packaging and private-label needs',
                  'Preferred delivery timing',
                  'Specifications and documents to review',
                ]
            ).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="ft-container ft-section ft-faq">
        <h2>{zh ? '采购前，您可能想了解。' : 'Before you enquire.'}</h2>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
