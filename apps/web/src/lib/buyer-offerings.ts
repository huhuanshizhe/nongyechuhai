import type { Localized } from './highland';
const l = (zh: string, en: string): Localized => ({ zh, en });
export const buyerTypes = [
  {
    id: 'manufacturers',
    name: l('食品与饮料工厂', 'Food & beverage manufacturers'),
    image: 'sea-buckthorn-editorial.png',
    need: l(
      '将特色原料放进下一款配方。',
      'Distinctive ingredients for your next formulation.',
    ),
    formats: l(
      '枸杞原浆、NFC 果汁、沙棘汁、刺梨汁、果粉与谷物原料',
      'Goji purée, NFC juices, sea buckthorn and chestnut rose juice, fruit powders and grains',
    ),
    work: l(
      '围绕可溶性固形物、酸度、粒径、微生物指标与加工适配沟通样品。',
      'Discuss Brix, acidity, particle size, microbiological specifications and processing compatibility.',
    ),
    output: l(
      '原料规格 · 批次文件 · 大包装 · 供货计划',
      'Ingredient specifications · Batch documents · Bulk packaging · Supply planning',
    ),
  },
  {
    id: 'brands',
    name: l('食品品牌与自有品牌', 'Food brands & private labels'),
    image: 'goji-editorial.png',
    need: l(
      '把产地故事做成自己的产品。',
      'Turn an origin story into your own range.',
    ),
    formats: l(
      '果汁、原浆小袋、混合果饮、枸杞零食与谷物食品',
      'Juices, goji purée sachets, fruit blends, berry snacks and grain foods',
    ),
    work: l(
      '选择现有产品贴牌，或从配方、口味、包装与品牌表达开始联合开发。',
      'Explore private labelling an existing format or develop a recipe, flavour, pack and brand presentation.',
    ),
    output: l(
      '产品简报 · 打样 · 包装选项 · 标签资料',
      'Product brief · Samples · Packaging options · Label information',
    ),
  },
  {
    id: 'foodservice',
    name: l('餐饮、茶饮与酒店', 'Foodservice, cafés & hospitality'),
    image: 'food-table-editorial.png',
    need: l(
      '让菜单有辨识度，操作更顺手。',
      'Distinctive menu ideas in practical formats.',
    ),
    formats: l(
      '果汁与饮品基底、锁鲜枸杞、谷物碗原料与蜂蜜',
      'Juices and beverage bases, fresh-locked dried goji, grains for bowls and honey',
    ),
    work: l(
      '按杯量、出品风味、储存方式与后厨使用场景选择规格。',
      'Choose formats around serving size, flavour, storage and kitchen or bar workflows.',
    ),
    output: l(
      '应用样品 · 餐饮包装 · 储存说明 · 补货需求',
      'Application samples · Foodservice packs · Storage guidance · Replenishment needs',
    ),
  },
  {
    id: 'retail',
    name: l('商超与零售采购', 'Supermarkets & retail buyers'),
    image: 'honey-editorial.png',
    need: l(
      '为货架建立有产地特色的系列。',
      'An origin-led range for your shelves.',
    ),
    formats: l(
      '零售果汁、干枸杞、谷物、蜂蜜与品牌组合',
      'Retail juices, dried goji, grains, honey and curated ranges',
    ),
    work: l(
      '围绕货架陈列、零售规格、条码、保质期与品牌标签组织选品。',
      'Build a range around shelf presentation, retail pack sizes, barcodes, shelf life and labelling.',
    ),
    output: l(
      '零售产品卡 · 外箱规格 · 标签内容 · 渠道需求',
      'Retail product cards · Case specifications · Label content · Channel requirements',
    ),
  },
  {
    id: 'importers',
    name: l('进口商与分销商', 'Importers & distributors'),
    image: 'hengtai-origin.jpg',
    need: l(
      '以一份清晰简报，对接多个品类。',
      'Connect multiple categories through one clear brief.',
    ),
    formats: l(
      '散装原料、零售食品与多品类采购组合',
      'Bulk ingredients, retail foods and multi-category sourcing',
    ),
    work: l(
      '整理供应商产品资料与目的地要求，协调样品、报价与分批供货讨论。',
      'Organise supplier information and destination needs, coordinating samples, quotations and shipment discussions.',
    ),
    output: l(
      '选品清单 · 企业资料 · 贸易条件 · 交付沟通',
      'Range shortlist · Supplier information · Trade terms · Delivery coordination',
    ),
  },
  {
    id: 'specialty',
    name: l('电商与专业食品渠道', 'E-commerce & speciality food'),
    image: 'black-goji-editorial.png',
    need: l(
      '让特色食材有更好的内容与体验。',
      'Distinctive foods with a compelling product experience.',
    ),
    formats: l(
      '小规格果饮、冲泡组合、食材套装与礼赠系列',
      'Small-format drinks, infusion blends, food kits and gifting ranges',
    ),
    work: l(
      '围绕消费场景、便携包装、产品内容与组合体验开发选品。',
      'Develop a range around consumer occasions, portable packs, product content and curated experiences.',
    ),
    output: l(
      '组合选品 · 产品图片 · 使用内容 · 包装沟通',
      'Curated range · Product imagery · Usage content · Packaging brief',
    ),
  },
] as const;
export const supplyStages = [
  {
    id: 'primary',
    name: l('初级产品', 'Whole foods'),
    copy: l(
      '干果、原粮与高原冷水鱼',
      'Dried berries, whole grains and cold-water fish',
    ),
  },
  {
    id: 'ingredient',
    name: l('食品原料', 'Food ingredients'),
    copy: l(
      '原浆、果汁、粉类与配方基底',
      'Purées, juices, powders and formulation bases',
    ),
  },
  {
    id: 'finished',
    name: l('加工食品', 'Finished foods'),
    copy: l(
      '可讨论零售与餐饮规格的食品',
      'Food formats for retail and foodservice',
    ),
  },
  {
    id: 'private-label',
    name: l('贴牌与联合开发', 'Private label & development'),
    copy: l(
      '将食材做成您的品牌产品',
      'Turn ingredients into your branded products',
    ),
  },
] as const;
export type BuyerId = (typeof buyerTypes)[number]['id'];
export type StageId = (typeof supplyStages)[number]['id'];
export type Offering = {
  id: string;
  name: Localized;
  image: string;
  stages: StageId[];
  buyers: BuyerId[];
  format: Localized;
  use: Localized;
  value: Localized;
  specs: Localized;
  development?: boolean;
  regional?: boolean;
  supplierPhoto?: boolean;
  packshot?: boolean;
  origin?: Localized;
};
const all: BuyerId[] = buyerTypes.map((b) => b.id);
export const offerings: Offering[] = [
  {
    id: 'dried-goji',
    name: l('红枸杞干果', 'Dried red goji berries'),
    image: 'supplier-red-goji-berries.jpg',
    supplierPhoto: true,
    stages: ['primary', 'finished'],
    buyers: all,
    format: l(
      '整颗干果 · 散装与零售包装',
      'Whole dried berries · Bulk and retail packs',
    ),
    use: l(
      '零食、早餐、烘焙、茶饮与混合坚果',
      'Snacks, breakfast, bakery, infusions and trail mixes',
    ),
    value: l(
      '柔和果甜与颗粒口感；红枸杞的类胡萝卜素构成可成为配方研究线索。',
      'Gentle sweetness and berry texture; red goji carotenoids offer a composition profile to explore.',
    ),
    specs: l(
      '果粒规格、含水率、异物与微生物指标、包装',
      'Berry grade, moisture, foreign matter, microbiological specifications and packs',
    ),
  },
  {
    id: 'rainbow-trout',
    name: l('高原冷水虹鳟', 'Highland cold-water rainbow trout'),
    image: 'rainbow-trout-editorial.png',
    stages: ['primary', 'ingredient'],
    buyers: ['manufacturers', 'brands', 'foodservice', 'retail', 'importers'],
    format: l(
      '整鱼、去内脏鱼与鱼片 · 冰鲜或冷冻规格沟通',
      'Whole, gutted and fillet formats · Discuss chilled or frozen specifications',
    ),
    use: l(
      '煎烤主菜、酒店餐饮、零售冷冻鱼与食品加工',
      'Pan-seared and oven-baked dishes, hospitality menus, frozen retail fish and food processing',
    ),
    value: l(
      '细腻鱼肉与鲜明的鱼片色泽，让高原产地故事延伸到水产菜单与冷链食品系列。',
      'Delicate flesh and distinctive fillet colour bring a highland origin story to seafood menus and cold-chain food ranges.',
    ),
    specs: l(
      '鱼种与养殖来源、重量分级、带皮或去皮、去刺要求、冷链温度、包装、批次追溯及目的地准入文件',
      'Species and farm origin, weight grades, skin-on or skin-off, deboning, cold-chain temperatures, packaging, batch traceability and destination import documents',
    ),
    regional: true,
    origin: l(
      '青海冷水鱼产区采购方向。具体供应企业、加工规格、可供数量与出口适用性按采购需求确认；虹鳟不等同于大西洋鲑。',
      'A sourcing opportunity from Qinghai’s cold-water fish region. Suppliers, processing formats, available volumes and export suitability are confirmed against your brief. Rainbow trout is distinct from Atlantic salmon.',
    ),
  },
  {
    id: 'goji-puree',
    name: l('枸杞原浆', 'Goji purée'),
    image: 'goji-puree-editorial-v2.jpg',
    stages: ['ingredient', 'finished'],
    buyers: all,
    format: l(
      '果肉型原浆 · 工业与小规格包装沟通',
      'Fruit purée · Discuss bulk and small-pack formats',
    ),
    use: l(
      '果饮、原浆小袋、酸奶果料与复合配方',
      'Fruit drinks, purée sachets, yoghurt preparations and blends',
    ),
    value: l(
      '保留果肉型质地与红枸杞风味，为配方增加果实感。',
      'A fruit-forward texture and red goji character for formulations.',
    ),
    specs: l(
      '可溶性固形物、果肉含量、黏度、热处理、包装与储存',
      'Brix, pulp content, viscosity, heat treatment, packaging and storage',
    ),
  },
  {
    id: 'red-goji-nfc',
    name: l('NFC 红枸杞果汁', 'NFC red goji juice'),
    image: 'red-goji-nfc-editorial-v2.jpg',
    stages: ['ingredient', 'finished'],
    buyers: all,
    format: l(
      '非浓缩还原果汁 · 单果或复配沟通',
      'Not-from-concentrate juice · Single-fruit or blend briefs',
    ),
    use: l(
      '直接饮用果汁、果汁小瓶与果味饮品',
      'Juice drinks, small-format juices and fruit beverages',
    ),
    value: l(
      '以加工路径与果实风味建立产品差异；NFC 表示非浓缩还原。',
      'Differentiate through fruit character and processing; NFC means not from concentrate.',
    ),
    specs: l(
      '果汁比例、可溶性固形物、酸度、杀菌方式、灌装与保质期',
      'Juice percentage, Brix, acidity, pasteurisation, filling and shelf life',
    ),
  },
  {
    id: 'black-goji-nfc',
    name: l('NFC 黑枸杞果汁', 'NFC black goji juice'),
    image: 'black-goji-nfc-editorial-v2.jpg',
    stages: ['ingredient', 'finished'],
    buyers: all,
    format: l('非浓缩还原黑枸杞果汁', 'Not-from-concentrate black goji juice'),
    use: l(
      '特色果汁、植物果饮与红黑枸杞复配',
      'Speciality juices, botanical fruit drinks and red–black goji blends',
    ),
    value: l(
      '黑枸杞花青素与紫色表现，为果饮提供鲜明的配方辨识度。',
      'Black goji anthocyanins and purple colour offer a distinctive formulation story.',
    ),
    specs: l(
      '果汁比例、pH、色泽与热稳定性、花青素检测、储存',
      'Juice percentage, pH, colour and heat stability, anthocyanin analysis and storage',
    ),
  },
  {
    id: 'sea-buckthorn-juice',
    name: l('沙棘汁与原浆', 'Sea buckthorn juice & purée'),
    image: 'sea-buckthorn-juice-editorial-v2.jpg',
    stages: ['ingredient', 'finished'],
    buyers: all,
    format: l('果汁、原浆与复配基底', 'Juice, purée and blending bases'),
    use: l(
      '果饮、果汁小瓶、冰沙、酸奶与甜点',
      'Fruit beverages, juice shots, smoothies, yoghurt and desserts',
    ),
    value: l(
      '明亮酸香与橙色个性；可按样品评估维生素 C 和类胡萝卜素构成。',
      'Bright acidity and orange character; assess vitamin C and carotenoid composition in the chosen sample.',
    ),
    specs: l(
      '酸度、固形物、果油分层、维生素 C 检测、储存与灌装',
      'Acidity, solids, oil separation, vitamin C analysis, storage and filling',
    ),
  },
  {
    id: 'chestnut-rose-juice',
    name: l('刺梨汁', 'Chestnut rose juice · Rosa roxburghii'),
    image: 'chestnut-rose-juice-editorial-v2.jpg',
    stages: ['ingredient', 'finished'],
    buyers: all,
    format: l(
      '特色果汁 · 单果与复配方向',
      'Speciality fruit juice · Single-fruit and blend formats',
    ),
    use: l(
      '果汁小瓶、复合果饮与餐饮基底',
      'Juice shots, fruit blends and foodservice bases',
    ),
    value: l(
      '酸香风味与维生素 C 配方研究方向；含量和保存表现按产品检测评估。',
      'Tart fruit character and a vitamin C formulation profile; assess content and retention in the actual product.',
    ),
    specs: l(
      '产区与供应主体、果汁比例、酸度、维生素 C 检测、褐变与储存',
      'Origin and supplier, juice percentage, acidity, vitamin C analysis, browning and storage',
    ),
    origin: l(
      '补充特色果汁采购；产地按供应商资料确认。',
      'Complementary juice sourcing; origin confirmed in supplier documents.',
    ),
  },
  {
    id: 'fresh-preserved-goji',
    name: l('锁鲜枸杞', 'Fresh-locked goji berries'),
    image: 'supplier-fresh-locked-goji-jar.jpg',
    supplierPhoto: true,
    packshot: true,
    stages: ['primary', 'finished'],
    buyers: all,
    format: l(
      '锁鲜干燥果实 · 瓶装与散装规格沟通',
      'Dried, fresh-locked berries · Discuss jars and bulk formats',
    ),
    use: l(
      '冲泡、早餐搭配、干果组合与特色零售',
      'Infusions, breakfast pairings, dried-fruit mixes and speciality retail',
    ),
    value: l(
      '以果粒完整度、干燥质地与包装便利性选品；锁鲜为产品工艺定位，不表示未经加工的鲜果。',
      'Choose by berry integrity, dried texture and convenient packs. Fresh-locked describes the product positioning, not unprocessed fresh fruit.',
    ),
    specs: l(
      '干燥与锁鲜工艺、含水率、果粒规格、储存条件、包装与保质期',
      'Drying and preservation process, moisture, berry grade, storage, packs and shelf life',
    ),
  },
  {
    id: 'black-goji-dried',
    name: l('黑枸杞干果', 'Dried black goji berries'),
    image: 'supplier-black-goji-jar.jpg',
    supplierPhoto: true,
    packshot: true,
    stages: ['primary', 'finished'],
    buyers: ['brands', 'foodservice', 'retail', 'importers', 'specialty'],
    format: l(
      '干果 · 冲泡与特色零售',
      'Dried berries · Infusions and speciality retail',
    ),
    use: l(
      '花草茶、特色冲泡与礼赠组合',
      'Botanical teas, speciality infusions and gifting',
    ),
    value: l(
      '紫蓝色冲泡体验；花青素色泽随 pH 与加工条件变化。',
      'A purple–blue infusion experience; anthocyanin colour varies with pH and processing.',
    ),
    specs: l(
      '果粒品质、含水率、冲泡表现、包装与检测文件',
      'Berry quality, moisture, infusion performance, packs and test documents',
    ),
  },
  {
    id: 'fruit-powders',
    name: l('果粉与粉体原料', 'Fruit powders'),
    image: 'sea-buckthorn-editorial.png',
    stages: ['ingredient', 'private-label'],
    buyers: ['manufacturers', 'brands', 'importers', 'specialty'],
    format: l(
      '枸杞与沙棘粉体 · 加工开发选项',
      'Goji and sea buckthorn powders · Development option',
    ),
    use: l(
      '固体饮料、烘焙、谷物混合与食品配方',
      'Powdered drinks, bakery, cereal blends and food formulations',
    ),
    value: l(
      '便于粉体配方与运输的加工方向，评估风味、颜色和分散性。',
      'A format for dry formulations and transport, evaluated for flavour, colour and dispersibility.',
    ),
    specs: l(
      '干燥工艺、载体配料、粒径、溶解性、含水率与检测',
      'Drying process, carrier ingredients, particle size, solubility, moisture and tests',
    ),
    development: true,
  },
  {
    id: 'grains',
    name: l('青稞与藜麦原料', 'Highland barley & quinoa'),
    image: 'quinoa-editorial.png',
    stages: ['primary', 'ingredient'],
    buyers: all,
    format: l(
      '原粮、谷物粉与混合谷物方向',
      'Whole grains, flour and grain blends',
    ),
    use: l(
      '谷物早餐、烘焙、沙拉与餐饮谷物碗',
      'Breakfast foods, bakery, salads and foodservice bowls',
    ),
    value: l(
      '谷物风味与颗粒质地，围绕蛋白质、膳食纤维和青稞 β-葡聚糖指标选品。',
      'Grain flavour and texture; discuss protein, fibre and barley beta-glucan specifications.',
    ),
    specs: l(
      '品种、净度、加工规格、烹煮性能、营养与过敏原资料',
      'Variety, purity, processing specifications, cooking performance, nutrition and allergen information',
    ),
  },
  {
    id: 'honey',
    name: l('蜂蜜原料与零售装', 'Honey · Bulk & retail'),
    image: 'supplier-goji-blossom-honey.jpg',
    supplierPhoto: true,
    packshot: true,
    stages: ['primary', 'ingredient', 'finished'],
    buyers: all,
    format: l(
      '散装蜂蜜、瓶装与便携包装沟通',
      'Bulk honey, jars and portable pack briefs',
    ),
    use: l(
      '茶饮、烘焙、早餐与食品甜味配料',
      'Tea, bakery, breakfast and food sweetening',
    ),
    value: l(
      '蜜源风味与天然甜味，为食品与餐饮配方增加层次。',
      'Floral character and sweetness for food and beverage recipes.',
    ),
    specs: l(
      '蜜源、含水率、真实性检测、结晶表现与包装',
      'Floral source, moisture, authenticity tests, crystallisation and packaging',
    ),
  },
  {
    id: 'own-label-juice',
    name: l('自有品牌果汁系列', 'Own-label juice range'),
    image: 'juice-range-editorial.png',
    stages: ['private-label'],
    buyers: ['brands', 'retail', 'importers', 'specialty'],
    format: l(
      '红枸杞、黑枸杞、沙棘、刺梨与复配果饮',
      'Red goji, black goji, sea buckthorn, chestnut rose and fruit blends',
    ),
    use: l(
      '商超果汁系列、便携小瓶与电商组合装',
      'Retail juice ranges, portable bottles and online multipacks',
    ),
    value: l(
      '从单果产品延伸到复合口味，用品牌、规格和产地内容形成系列。',
      'Build a range from single-fruit products to blends, shaped by brand, pack size and origin content.',
    ),
    specs: l(
      '产品定位、配方、灌装选项、包装起订量、标签与样品',
      'Positioning, recipe, filling options, packaging MOQ, labels and samples',
    ),
    development: true,
  },
  {
    id: 'own-label-sachets',
    name: l('原浆小袋与果汁小瓶', 'Purée sachets & juice shots'),
    image: 'juice-sachets-editorial-v2.jpg',
    stages: ['private-label'],
    buyers: ['brands', 'retail', 'importers', 'specialty'],
    format: l(
      '便携单次份量 · 枸杞原浆与复合果饮',
      'Portable single servings · Goji purée and fruit blends',
    ),
    use: l(
      '通勤、早餐搭配、旅行与礼赠',
      'On-the-go, breakfast, travel and gifting occasions',
    ),
    value: l(
      '以便携份量与果实风味构建消费场景，营养定位可按最终配方讨论。',
      'Build occasions around portable portions and fruit flavour; discuss nutrition positioning for the final recipe.',
    ),
    specs: l(
      '每份容量、配方、包装材质、货架稳定性、起订量',
      'Serving volume, recipe, pack material, shelf stability and MOQ',
    ),
    development: true,
  },
  {
    id: 'own-label-snacks',
    name: l('枸杞零食与谷物食品', 'Goji snacks & grain foods'),
    image: 'barley-editorial.png',
    stages: ['private-label'],
    buyers: ['brands', 'retail', 'importers', 'specialty'],
    format: l(
      '果干混合、谷物早餐与便携食品开发',
      'Dried fruit blends, breakfast cereals and portable food development',
    ),
    use: l(
      '早餐货架、零食系列与专业食品渠道',
      'Breakfast shelves, snack ranges and speciality food channels',
    ),
    value: l(
      '组合果实口感与谷物风味，探索纤维与蛋白质等产品定位。',
      'Combine berry texture and grain flavour, exploring fibre and protein positioning.',
    ),
    specs: l(
      '配料比例、过敏原、营养检测、包装、保质期与打样',
      'Ingredient ratios, allergens, nutrition testing, packs, shelf life and prototypes',
    ),
    development: true,
  },
  {
    id: 'foodservice-blends',
    name: l('餐饮果饮与菜单基底', 'Foodservice fruit & menu bases'),
    image: 'sea-buckthorn-editorial.png',
    stages: ['private-label', 'ingredient'],
    buyers: ['foodservice', 'brands', 'importers'],
    format: l(
      '沙棘与枸杞果饮、果泥和复配基底开发',
      'Sea buckthorn and goji beverages, purées and blended base development',
    ),
    use: l(
      '茶饮、冰沙、酸奶与酒店早餐',
      'Café drinks, smoothies, yoghurt and hotel breakfast',
    ),
    value: l(
      '按菜单口味与操作方式组织规格，让食材适应后厨和吧台。',
      'Develop formats around menu flavours and practical kitchen or bar use.',
    ),
    specs: l(
      '稀释比例、每份成本、口味、开封储存与餐饮包装',
      'Dilution, cost per serving, flavour, storage after opening and foodservice packs',
    ),
    development: true,
  },
];
