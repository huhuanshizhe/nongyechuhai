import {
  platformPromise,
  valueJourney,
  regionalAdvantages,
  qualityPrinciples,
} from './advantages.mjs';
const overseas = 'https://www.farmetra.com/en';
const email = process.env.CONTACT_EMAIL || 'export@farmetra.com';
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
const photo = (src, alt, cls = '', eager = false) =>
  `<img class="${cls}" src="/assets/${src.replace(/\.(png|jpg)$/, '.webp')}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const link = (href, text, cls = 'button') =>
  `<a class="${cls}" href="${href}">${text}</a>`;
const intro = (kicker, title, copy) =>
  `<section class="page-intro container"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lead">${copy}</p></section>`;
const cta = (title = '让下一次出海，<br>从一次有准备的合作开始。') =>
  `<section class="cta"><div class="container cta-inner"><div><p>携手高原产业，共拓海外市场</p><h2>${title}</h2></div>${link('/contact', '洽谈合作', 'button light')}</div></section>`;
const services = [
  [
    '产品国际化',
    '把产地好产品，转化为买家看得懂的采购资料。',
    ['产品规格与用途梳理', '外文资料与产品图册', '包装表达与品牌内容'],
    'goji-editorial.png',
  ],
  [
    '海外展示与获客',
    '建立面向海外采购商的产品与品牌窗口。',
    [
      'Farmetra 海外官网展示',
      '产品内容与数字渠道运营',
      '采购需求整理与跟进支持',
    ],
    'food-table-editorial.png',
  ],
  [
    '供应链与交付协同',
    '围绕订单需求，衔接企业与专业服务资源。',
    [
      '样品、报价与资料对接',
      '检测、认证及物流资源协调',
      '交付节点与商务沟通支持',
    ],
    'hengtai-origin.jpg',
  ],
];
const products = [
  ['枸杞', 'goji-editorial.png', '干果、原料与品牌化食品', '浆果'],
  ['沙棘', 'sea-buckthorn-editorial.png', '饮品、果制品与食品配料', '浆果'],
  ['青稞', 'barley-editorial.png', '谷物、粉类与谷物食品', '谷物'],
  ['藜麦', 'quinoa-editorial.png', '谷物原料与复合食品', '谷物'],
  ['黑枸杞', 'black-goji-editorial.png', '干果、冲泡与特色食品', '浆果'],
  ['蜂蜜', 'honey-editorial.png', '天然甜味与零售食品', '蜂产品'],
  [
    '冷水鱼 · 虹鳟',
    'rainbow-trout-editorial.png',
    '区域特色产业 · 加工、冷链与出口协同方向',
    '水产',
  ],
];
const serviceCards = () =>
  services
    .map(
      ([title, copy, list, img]) =>
        `<article class="service-card">${photo(img, title)}<div><h3>${title}</h3><p>${copy}</p><ul>${list.map((x) => `<li>${x}</li>`).join('')}</ul></div></article>`,
    )
    .join('');
const journey = () =>
  `<ol class="journey">${[
    ['需求沟通', '明确企业产品、现有能力与目标市场。'],
    ['资料评估', '核对主体、产品、授权与可提供的文件。'],
    ['方案与签约', '确认服务范围、交付内容、费用及分工。'],
    ['上线与对接', '完成内容准备，开展展示与需求沟通。'],
  ]
    .map(
      ([t, c], i) => `<li><span>${i + 1}</span><h3>${t}</h3><p>${c}</p></li>`,
    )
    .join('')}</ol>`;
export const pages = [
  {
    path: '/',
    title: '让高原好产品，走向世界市场',
    description:
      '青藏高原农产品食品出海平台，连接产业带企业、供应链伙伴与海外市场，共建产品国际化、海外展示和采购协同能力。',
    body: `
    <section class="hero">${photo('plateau-hero.png', '高原雪山、河谷与谷物景观', 'hero-image', true)}<div class="container hero-content"><p>青藏高原农产品食品出海平台</p><h1>高原好产品，<br>世界大市场。</h1><p class="hero-description">连接产业带企业与海外市场。<br>让产地优势，成为品牌与产品走向世界的起点。</p><div class="actions">${link('/join', '企业加入平台', 'button light')}${link('/cooperation', '产业合作洽谈', 'text-link white')}</div></div><div class="hero-bottom container"><span>立足青藏高原</span><span>服务农产品与食品产业</span><a href="${overseas}" target="_blank" rel="noopener">访问海外采购官网 ↗</a></div></section>
    ${platformPromise()}${regionalAdvantages()}${valueJourney()}${qualityPrinciples()}
    <section class="pale section"><div class="container"><div class="section-heading"><div><p class="kicker">企业服务</p><h2>把出海需要的能力，<br>接到企业身边。</h2></div>${link('/services', '查看服务体系', 'text-link')}</div><div class="service-grid">${serviceCards()}</div></div></section>
    <section class="container section origin-split"><div class="origin-photo">${photo('hengtai-about.png', '衡源萃供应伙伴官网展示的枸杞产区')}</div><div class="origin-copy"><p class="kicker">产业资源</p><h2>扎根产地，<br>从真实的产品开始。</h2><p>枸杞、沙棘、高原谷物与蜂产品，是我们展开产业合作的特色方向。围绕企业真实的产品、生产条件和供应能力，共同整理适合海外沟通的产品资料。</p><div class="partner-mini"><strong>衡源萃</strong><span>青海海西 · 枸杞供应伙伴</span></div>${link('/resources', '走近产业与供应伙伴', 'text-link')}</div></section>
    <section class="navy section"><div class="container"><div class="section-heading"><div><p class="kicker">一起参与</p><h2>不同角色，<br>在这里找到合作的位置。</h2></div><p>从一家企业的产品出海，<br>到一条产业带的共同成长。</p></div><div class="role-grid">${[
      [
        '产业带企业',
        '提供特色产品、生产与供应能力，共同准备产品资料，参与海外展示与需求对接。',
        '/join',
        '了解企业加入',
      ],
      [
        '供应链与服务伙伴',
        '围绕检测认证、包装设计、物流仓储与贸易服务，建立专业协同。',
        '/cooperation#supply',
        '了解生态合作',
      ],
      [
        '地方与产业合作方',
        '围绕区域品牌、企业组织、服务载体与阶段项目，探索共建方式。',
        '/cooperation',
        '了解产业共建',
      ],
    ]
      .map(
        ([t, c, h, l]) =>
          `<article><h3>${t}</h3><p>${c}</p>${link(h, l, 'text-link white')}</article>`,
      )
      .join('')}</div></div></section>
    <section class="container section"><div class="section-heading"><div><p class="kicker">企业合作路径</p><h2>先把合作说清楚，<br>再把出海做扎实。</h2></div>${link('/join', '查看加入流程与资料', 'text-link')}</div>${journey()}</section>${cta()}`,
  },
  {
    path: '/about',
    title: '平台概览',
    description: '了解平台定位、双站协同、主体与运营分工，以及分阶段建设路径。',
    body: `${intro('平台概览', '一个产业平台，<br>连接两端的真实需求。', '国内组织产品、企业与服务资源；海外呈现产地价值，连接采购需求。两端协同，不止于展示。')}
    <section class="container architecture"><article><span>国内产业合作窗口</span><h2>组织产业，<br>服务企业。</h2><p>企业加入、产业招商、产品准备、供应链合作与出海服务。</p>${link('/services', '了解企业服务', 'text-link')}</article><div class="architecture-center"><img src="/icon.svg" alt="Farmetra"><strong>共同的产品与品牌资源</strong><p>资料规范<br>需求沟通<br>持续运营</p></div><article><span>海外采购窗口</span><h2>面向买家，<br>连接市场。</h2><p>产品图册、产地故事、品质依据、采购指南与商务联系。</p>${link(overseas, '查看海外官网 ↗', 'text-link')}</article></section>
    <section class="pale section"><div class="container"><div class="section-heading"><h2>以清晰分工，<br>支撑长期合作。</h2><p>平台建设按照独立主体、专业运营与产业协作的架构推进。</p></div><div class="governance"><article><h3>独立平台公司</h3><p>拟新设平台公司作为项目经营与资产承载主体，负责融资、预算、合作签约与经营管理。主体登记及股权安排以正式文件为准。</p></article><article><h3>涂豆出海</h3><p>承担方案架构、平台建设与运营服务，以服务合同明确交付、权限和协作机制；不作为本方案中的出资方。</p></article><article><h3>产业与专业伙伴</h3><p>企业负责产品和供应资料，专业伙伴按约提供检测、认证、物流等支持，围绕具体项目界定责任与收费。</p></article></div></div></section>
    <section class="container section"><div class="section-heading"><h2>先建立能力，<br>再扩大协作。</h2><p>阶段目标按协议与实施计划确定，不以展示内容代替已完成的经营成果。</p></div><ol class="roadmap"><li><span>起步阶段</span><h3>建立窗口与产品基础</h3><p>完成双站展示、产品资料框架与首批企业沟通，形成可持续维护的内容体系。</p></li><li><span>协作阶段</span><h3>形成服务与对接机制</h3><p>按产品与市场开展内容运营、采购沟通、样品对接和专业资源协同。</p></li><li><span>拓展阶段</span><h3>扩展企业与市场连接</h3><p>依据实际反馈迭代品类和服务，逐步扩展合作企业与渠道资源。</p></li></ol></section>${cta()}`,
  },
  {
    path: '/services',
    title: '企业出海服务',
    description:
      '产品国际化、海外展示、采购对接与供应链协同，为产业带企业提供可约定、可交付的出海服务。',
    body: `${intro('企业服务', '让出海的每一步，<br>都有具体的工作承接。', '围绕企业已有的产品与能力，选择适合当前阶段的服务。服务范围、成果、周期和费用在启动前明确。')}
    ${valueJourney()}
    <section class="container service-editorial">${services.map(([t, c, list, img], i) => `<article class="service-row ${i === 1 ? 'reverse' : ''}">${photo(img, t)}<div><h2>${t}</h2><p class="lead">${c}</p><ul class="check-list">${list.map((x) => `<li>${x}</li>`).join('')}</ul><p class="muted">${['交付围绕规格档案、外文内容、图片与图册等可核对的成果展开。', '根据服务约定开展内容维护、需求记录与沟通跟进，不承诺询盘或销售结果。', '具体检测、认证、通关和物流工作由符合条件的专业主体按约执行。'][i]}</p>${link('/contact?type=enterprise', '咨询这项服务', 'text-link')}</div></article>`).join('')}</section>
    <section class="navy section"><div class="container"><div class="section-heading"><h2>根据阶段选服务，<br>根据交付谈合作。</h2></div><div class="role-grid"><article><h3>产品准备</h3><p>适合尚未建立海外资料的企业。梳理产品、图片、包装与外文内容，建立基础展示资产。</p></article><article><h3>持续运营</h3><p>适合需要长期维护海外窗口的企业。围绕内容、渠道和需求跟进约定周期服务。</p></article><article><h3>专项协同</h3><p>适合已有明确项目或采购需求的企业。按样品、包装、文件或交付协调等专项工作合作。</p></article></div><p class="section-note">费用按服务内容与工作量协商。第三方费用单独确认；不承诺订单、销售额、利润或融资结果。</p></div></section>${cta()}`,
  },
  {
    path: '/resources',
    title: '产业与供应资源',
    description:
      '发现青藏高原特色产品方向与衡源萃供应伙伴，了解产业资源参与方式。',
    body: `${intro('产业资源', '好产品的背后，<br>是土地与认真做事的人。', '围绕高原特色农产品与食品，连接愿意做好产品、准备好资料、共同服务海外市场的企业。')}
    ${regionalAdvantages()}
    <section class="container supplier-feature"><div>${photo('hengtai-about.png', '衡源萃官网展示的枸杞产区', '', true)}</div><div><p class="kicker">枸杞供应伙伴</p><h2>衡源萃</h2><p class="company-name">海西恒泰工贸有限公司</p><p>扎根青海海西，围绕枸杞等高原特色农产品开展种植、加工与销售，产品涉及红枸杞、黑枸杞、枸杞叶茶和蜂蜜。</p><a class="text-link" href="https://www.hengyuancui.com/" target="_blank" rel="noopener">访问企业官网 ↗</a><p class="muted">具体产品、规格与合作条件按企业提供的资料确认。</p></div></section>
    <section class="pale section"><div class="container"><div class="section-heading"><div><p class="kicker">特色品类</p><h2>从高原风味，<br>打开产品合作的可能。</h2></div><p>以下为产业合作与产品开发方向，具体供给以企业资料和采购确认结果为准。</p></div><div class="filters" role="group" aria-label="按品类筛选">${['全部', '浆果', '谷物', '蜂产品', '水产'].map((x, i) => `<button type="button" data-filter="${x}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div><div class="product-grid">${products.map(([name, img, copy, cat]) => `<article class="product-card" data-category="${cat}">${photo(img, name + '产品展示')}<div><h3>${name}</h3><p>${copy}</p></div></article>`).join('')}</div><p id="filter-status" class="muted" role="status">共 ${products.length} 个特色品类</p></div></section>
    ${qualityPrinciples()}
    <section class="container section origin-split"><div class="origin-copy"><h2>您的产品，<br>也可以从这里出发。</h2><p>欢迎具有明确产品、供应能力和合法经营资质的农业与食品企业洽谈合作。平台不以展示图片替代企业审核，也不将品类介绍作为产品认证。</p>${link('/join', '了解加入方式')}</div><div class="origin-photo">${photo('hengtai-origin.jpg', '供应伙伴官网展示的枸杞采收')}</div></section>${cta()}`,
  },
  {
    path: '/join',
    title: '企业加入平台',
    description: '了解产业带企业加入流程、资料清单、合作边界与常见问题。',
    body: `${intro('企业加入', '把您的好产品，<br>带进更广阔的合作。', '无论您是种植加工企业、食品品牌还是产业组织，都可以从一次具体的产品与能力沟通开始。')}
    <section class="container join-top"><div>${photo('goji-editorial.png', '高原枸杞产品展示', '', true)}</div><div><h2>什么样的企业<br>适合参与？</h2><ul class="check-list"><li>具有明确产品与合法经营主体</li><li>能够提供真实的产品、生产与供应资料</li><li>愿意协同准备外文内容、样品与商务沟通</li><li>接受基于协议的责任分工与服务收费</li></ul>${link('/contact?type=enterprise', '发起企业合作沟通')}</div></section>
    <section class="pale section"><div class="container"><h2>从了解，到合作。</h2>${journey()}</div></section>
    <section class="container section documents"><div><p class="kicker">沟通前准备</p><h2>先准备这几类资料，<br>让对接更有效。</h2><p>首次沟通可先提供概要。涉及资质原件、价格、客户与其他敏感信息时，请在双方确认后通过约定渠道交换。</p><button class="button" type="button" id="download-checklist">下载企业资料清单</button></div><div class="document-list">${[
      ['企业与联系人', '企业名称、所在地、联系人、业务角色及经营范围。'],
      [
        '产品与供应',
        '产品名称、规格、包装、产季、供货方式及可沟通的数量范围。',
      ],
      ['图片与品牌', '产品、包装和产地图片，以及品牌与图片的使用授权情况。'],
      ['文件与目标', '可提供的检测认证资料、已有出口经验及希望进入的市场。'],
    ]
      .map(([t, c]) => `<article><h3>${t}</h3><p>${c}</p></article>`)
      .join('')}</div></section>
    <section class="container section faq"><h2>合作前，先把问题讲明白。</h2>${[
      [
        '加入平台是否必须投资？',
        '企业可以通过产品供应、服务采购或资源合作参与，不以股权投资作为一般企业合作的前提。投资合作另行沟通与审议。',
      ],
      [
        '平台是否承诺订单？',
        '不承诺订单、销量或利润。我们约定并交付产品内容、展示运营和需求协同等具体工作，商业结果受产品、市场及交易条件影响。',
      ],
      [
        '产品与客户资料如何管理？',
        '资料使用范围、展示授权、客户线索处理和保密安排在合作协议中明确。未经授权，不公开企业敏感资料。',
      ],
      [
        '企业是否需要独家合作？',
        '不预设一刀切的独家安排。品牌、区域、品类及客户协作边界根据具体合作商议，并以书面协议为准。',
      ],
    ]
      .map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`)
      .join('')}</section>${cta()}`,
  },
  {
    path: '/cooperation',
    title: '产业合作与招商',
    description:
      '面向地方产业组织、园区、供应链服务伙伴与产业投资合作方的共建窗口。',
    body: `${intro('合作共建', '汇聚各自所长，<br>共建高原产业出海能力。', '围绕企业、产区、服务和市场的真实需求，明确资源投入、工作责任与合作收益，形成可持续的协作。')}
    <section class="container cooperation-list"><article><div><span>地方与产业合作</span><h2>让区域品牌，<br>拥有面向海外的表达。</h2></div><div><p>适合地方产业组织、园区、协会及区域品牌运营方。围绕企业组织、产品目录、区域内容与出海服务活动，共同确定项目范围。</p><ul class="check-list"><li>特色产业与企业资源梳理</li><li>区域产品展示与品牌内容共建</li><li>企业出海培训与服务对接</li></ul>${link('/contact?type=regional', '洽谈区域合作', 'text-link')}</div></article><article id="supply"><div><span>供应链与专业服务</span><h2>把专业能力，<br>接到具体项目里。</h2></div><div><p>欢迎检测认证、包装设计、国际物流、海外仓储与贸易服务伙伴参与。根据服务资质、覆盖范围、收费和责任边界，开展项目协作。</p><ul class="check-list"><li>明确服务覆盖与适用条件</li><li>按项目确认报价与执行责任</li><li>建立资料与交付节点协同</li></ul>${link('/contact?type=supply', '洽谈服务合作', 'text-link')}</div></article><article><div><span>产业投资合作</span><h2>以独立主体，<br>承载长期建设。</h2></div><div><p>平台计划以新设公司承载经营与资产，面向具有产业资源、市场协同能力与长期建设意愿的合作方，开展投资与共建沟通。</p><ul class="check-list"><li>围绕资金、产业和市场资源讨论参与方式</li><li>明确股权治理与阶段资金用途</li><li>通过尽调、协商与正式协议落实合作</li></ul><p class="muted">此处为合作交流入口，不构成公开募资、投资要约或收益承诺。具体方案在专项沟通中提供。</p>${link('/contact?type=investment', '联系产业合作团队', 'text-link')}</div></article></section>
    <section class="navy section"><div class="container"><div class="section-heading"><h2>合作，不只看投入什么。<br>也看如何共同推进。</h2></div><div class="role-grid"><article><h3>资源与目标</h3><p>明确参与方提供的资金、企业、产品、渠道或专业能力，以及合作希望解决的问题。</p></article><article><h3>责任与交付</h3><p>用协议约定工作范围、费用、交付节点、资产归属和信息使用方式。</p></article><article><h3>复盘与迭代</h3><p>依据资料完成度、企业服务记录、需求跟进与项目交付情况评估阶段工作。</p></article></div></div></section>${cta('共建的第一步，<br>是把各自的优势说清楚。')}`,
  },
  {
    path: '/contact',
    title: '合作洽谈',
    description: '与平台沟通企业加入、区域共建、供应链协同与产业投资合作。',
    body: `${intro('合作洽谈', '聊聊您的产品，<br>也聊聊我们能一起做的事。', '请选择合作方向，简要介绍您的企业、资源或需求。具体资料可在后续沟通中交换。')}
    <section class="container contact-layout"><aside><div class="contact-picture">${photo('food-table-editorial.png', '特色食品与原料的餐桌组合', '', true)}</div><h2>产业合作联系</h2><a class="email" href="mailto:${escape(email)}">${escape(email)}</a><p>面向产业带企业、地方产业组织、供应链伙伴及产业合作方。</p><a class="text-link" href="${overseas}/sourcing">海外采购需求请访问 Farmetra ↗</a></aside><form id="cooperation-form" data-email="${escape(email)}"><div class="form-grid"><label>合作方向<select name="type"><option value="enterprise">企业加入与出海服务</option><option value="regional">地方与产业共建</option><option value="supply">供应链与专业服务</option><option value="investment">产业投资合作</option></select></label><label>企业 / 机构名称<input name="company" required maxlength="150" autocomplete="organization"></label><label>联系人<input name="name" required maxlength="80" autocomplete="name"></label><label>邮箱<input name="email" type="email" required maxlength="200" autocomplete="email"></label><label>电话（选填）<input name="phone" type="tel" maxlength="50" autocomplete="tel"></label><label>所在地区<input name="region" maxlength="100" autocomplete="address-level1"></label></div><label>合作需求<textarea name="message" rows="6" required maxlength="1800" placeholder="请简述产品、现有资源，以及您希望开展的合作。"></textarea></label><div class="actions"><button class="button" type="submit" value="email">在邮件中继续</button><button class="button outline" type="submit" value="preview">预览并复制需求</button></div><p class="form-note">此表单整理邮件内容，不直接提交资料。请在邮件应用中确认发送，或复制后使用常用邮箱发送。<a href="/privacy">信息使用说明</a></p><section id="brief-preview" hidden><h3>合作需求邮件</h3><pre id="brief-text" tabindex="0"></pre><button class="button outline" type="button" id="copy-brief">复制邮件内容</button><p id="copy-status" role="status"></p></section></form></section>`,
  },
  {
    path: '/privacy',
    title: '信息使用说明',
    description: '了解本网站的合作信息、邮件沟通与资料授权安排。',
    body: `${intro('信息使用说明', '您的资料，<br>用于您发起的合作沟通。', '请仅提供与合作有关的信息。涉及敏感资料时，双方可以另行约定传递方式与保密安排。')}<section class="container section legal"><h2>合作联系</h2><p>您主动发送的企业、联系人、邮箱与合作需求，用于回复咨询和开展相关商务沟通。表单仅在浏览器内整理邮件，不直接向网站服务器提交合作内容。</p><h2>邮件与复制</h2><p>您需要在邮件应用中确认发送。预览与复制不会自动发送资料；下载的资料清单保存在您的设备上。邮件的处理也受您所用邮件服务的规则影响。</p><h2>基础访问</h2><p>托管服务可能处理 IP 地址、访问时间、页面路径等基础请求信息，用于提供与保护网站服务。本展示站不主动接入广告追踪工具。</p><h2>展示与授权</h2><p>企业商标、照片、产品资料与合作内容的公开使用范围，按权利人与平台的约定执行。产品系列图与应用展示不替代实物样品、检测文件或供应能力确认。</p><h2>联系与更正</h2><p>如需更正或请求删除您已经发送的联系信息，请发送邮件至 <a href="mailto:${escape(email)}">${escape(email)}</a>。</p></section>`,
  },
];
export function render(page) {
  const nav = [
    ['/about', '平台概览'],
    ['/services', '企业服务'],
    ['/resources', '产业资源'],
    ['/cooperation', '合作共建'],
    ['/join', '企业加入'],
  ];
  const site =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL
      : '');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${page.title} | 青藏高原农产品食品出海平台</title><meta name="description" content="${page.description}"><meta name="theme-color" content="#14334c"><link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css">${site ? `<link rel="canonical" href="${site}${page.path}">` : ''}<meta property="og:title" content="${page.title}"><meta property="og:description" content="${page.description}"><meta property="og:type" content="website"><meta property="og:locale" content="zh_CN"><script src="/app.js" defer></script></head><body><a class="skip" href="#main">跳转到正文</a><header class="header"><div class="container header-inner"><a class="brand" href="/" aria-label="青藏高原农产品食品出海平台首页"><img src="/icon.svg" alt=""><span><strong>Farmetra <small>产业合作</small></strong><span>青藏高原农产品食品出海平台</span></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">菜单</button><nav id="main-nav" aria-label="主要导航">${nav.map(([h, t]) => `<a href="${h}" ${page.path === h ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav><a class="overseas-link" href="${overseas}" target="_blank" rel="noopener">海外官网 ↗</a></div></header><main id="main">${page.body}</main><footer class="footer"><div class="container footer-top"><div><a class="brand" href="/"><img src="/icon.svg" alt=""><span><strong>Farmetra <small>产业合作</small></strong><span>青藏高原农产品食品出海平台</span></span></a><p>扎根高原产业，连接世界市场。</p></div><div><h2>了解平台</h2><a href="/about">平台概览</a><a href="/services">企业服务</a><a href="/resources">产业资源</a></div><div><h2>参与合作</h2><a href="/join">企业加入</a><a href="/cooperation">产业合作与招商</a><a href="/contact">合作洽谈</a></div><div><h2>海外窗口</h2><a href="${overseas}" target="_blank" rel="noopener">Farmetra 海外官网 ↗</a><a href="mailto:${escape(email)}">${escape(email)}</a></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Farmetra 产业合作</span><span>建设与运营服务：涂豆出海</span><a href="/privacy">信息使用说明</a></div></footer></body></html>`;
}
