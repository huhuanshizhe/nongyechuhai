const gojiSource =
  'https://www.qinghai.gov.cn/zwgk/system/2025/09/19/030081965.shtml';
const fishSource = 'https://www.qhio.gov.cn/system/2026/01/29/030510597.shtml';
const img = (name, alt) =>
  `<img src="/assets/${name}.webp" alt="${alt}" loading="lazy" decoding="async">`;

export const platformPromise = () =>
  `<section class="container section platform-promise"><p class="kicker">我们为什么做这个平台</p><h2>把企业零散的产品能力，组织成海外买家能够理解、比较、询价和持续合作的供应方案</h2><div class="promise-bottom"><p>让企业不必独自从零搭建海外窗口，让买家不必从零了解每一家供应商。</p><a class="text-link" href="/services">了解具体服务与交付 →</a></div></section>`;

export const valueJourney = () =>
  `<section class="value-section section"><div class="container"><div class="section-heading"><div><p class="kicker">从产品能力，到采购方案</p><h2>四件具体的事，<br>把两端连接起来。</h2></div><p>企业提供真实的产品与供应条件。<br>平台负责组织信息、呈现价值、衔接需求和持续跟进。</p></div><div class="value-grid">${[
    [
      '01',
      '看得懂',
      '把产品说清楚',
      'goji-editorial',
      '枸杞产品与食材展示',
      '把分散的图片、规格、用途与包装信息，整理成面向海外买家的统一产品档案。',
      '双语产品卡 · 图片与图册 · 应用说明',
      '企业少做重复介绍，买家快速理解产品。',
    ],
    [
      '02',
      '比得清',
      '把条件摆明白',
      'food-table-editorial',
      '不同高原食材的产品应用',
      '用一致的字段组织产品形态、规格、起订量、交期及可提供的文件，让比较有依据。',
      '规格对照 · 包装选项 · 文件清单',
      '企业讲清差异，买家缩小采购选择。',
    ],
    [
      '03',
      '能询价',
      '把需求接得住',
      'rainbow-trout-editorial',
      '虹鳟整鱼与鱼片品类示意',
      '将买家的用途、数量、目的地与样品要求整理为需求简报，对接能够响应的企业。',
      '采购简报 · 样品对接 · 报价协调',
      '减少来回沟通，让企业收到更清晰的需求。',
    ],
    [
      '04',
      '持续合作',
      '把后续跟下去',
      'hengtai-origin',
      '供应伙伴官网展示的枸杞采收',
      '围绕资料更新、样品反馈、报价版本与合作节点持续跟进，让沟通有人承接、有记录可查。',
      '跟进记录 · 资料更新 · 节点协调',
      '企业与买家形成连续的合作沟通。',
    ],
  ]
    .map(
      ([n, title, sub, src, alt, copy, deliver, value]) =>
        `<article class="value-card"><div class="value-photo">${img(src, alt)}<span>${n}</span></div><div class="value-copy"><p class="value-eyebrow">${sub}</p><h3>${title}</h3><p>${copy}</p><div class="value-deliver"><span>具体交付</span><strong>${deliver}</strong></div><p class="value-benefit">${value}</p></div></article>`,
    )
    .join(
      '',
    )}</div><div class="shared-foundation"><span>共享的出海基础</span><p>一个海外展示窗口，一套产品资料标准，一条采购需求协同路径。</p><a href="https://www.farmetra.com/en" target="_blank" rel="noopener">查看面向买家的呈现 ↗</a></div></div></section>`;

export const regionalAdvantages = () =>
  `<section class="region-section section"><div class="container"><div class="section-heading"><div><p class="kicker">青藏高原 · 青海特色产区</p><h2>不止是远方的风景，<br>也是有辨识度的食材原乡。</h2></div><p>从柴达木枸杞到高原冷水鱼，<br>以具体产区与特色品类，打开海外采购的想象。</p></div><div class="region-grid"><article class="region-card region-goji"><div class="region-image">${img('hengtai-about', '衡源萃官网展示的青海海西枸杞产区')}<span>QINGHAI · GOJI</span></div><div class="region-copy"><p class="kicker">柴达木枸杞</p><h3>一颗红果，<br>背后是一片产业。</h3><p>鲜明的产地身份，连接干果、食品原料与品牌化产品。平台从企业真实资料出发，将产区故事转化为可供采购讨论的产品内容。</p><div class="region-stats"><div><strong>45.23<small>万亩</small></strong><span>青海省枸杞种植面积</span></div><div><strong>20<small>万亩</small></strong><span>绿色有机认证面积*</span></div></div><p class="region-caption">2025 年 9 月公开披露。*绿色与有机认证的合并口径，非全部有机认证。</p></div></article><article class="region-card region-fish"><div class="region-image">${img('rainbow-trout-editorial', '虹鳟整鱼及鱼片，品类示意图')}<span>QINGHAI · RAINBOW TROUT</span></div><div class="region-copy"><p class="kicker">高原冷水鱼 · 虹鳟</p><h3>从高原水域，<br>走向国际市场。</h3><p>虹鳟是青海具有出口实绩的特色产业。围绕鱼类产品，可进一步对接加工形态、冷链条件、追溯资料与目标市场要求。</p><div class="region-stats"><div><strong>3.8<small>亿元以上</small></strong><span>2025 年青海冷水鱼（虹鳟鱼）出口额</span></div></div><p class="region-caption">区域产业介绍；具体供应企业与合作条件另行确认。图片为品类示意。</p></div></article></div><details class="region-sources"><summary>数据口径与来源</summary><p>枸杞数据为青海省 2025 年 9 月公开披露值；“绿色有机认证面积”为来源中的合并口径，不等同于全部取得有机认证。冷水鱼数据为 2025 全年出口额。以上均为青海省区域数据，不代表平台或合作企业的产能、认证或出口业绩。</p><a href="${gojiSource}" target="_blank" rel="noopener">青海省政府 · 绿色有机农畜产品输出地建设（2025） ↗</a><a href="${fishSource}" target="_blank" rel="noopener">青海省新闻发布会 · 外贸工作（2026 年 1 月） ↗</a></details></div></section>`;

export const qualityPrinciples = () =>
  `<section class="container section origin-principles"><div class="principles-intro"><p class="kicker">产地有故事，品质有依据</p><h2>自然的底色，<br>可信的表达。</h2><p>我们珍视高原的自然风土，也认真对待每一项产品承诺。</p></div><div class="principles-list"><article><span>01 / 自然风土</span><h3>讲清来处，保留食材个性。</h3><p>以产区、原料、风味和加工方式呈现食材的自然个性。具体配方、加工与品质特征，回到每一款产品的资料中确认。</p></article><article><span>02 / 食品安全</span><h3>让品质沟通，有文件可依。</h3><p>围绕具体产品与批次，核对检测、生产管理和追溯资料；按目标市场要求确认适用条件。</p></article><article><span>03 / 有机认证</span><h3>有认证，再谈有机。</h3><p>有机声明对应具体产品、生产主体、有效证书与适用市场。区域认证面积不代替企业和产品的认证证明。</p></article></div></section>`;
