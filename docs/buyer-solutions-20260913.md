# 海外客户采购与贴牌展示

展示按四层供应形式组织：初级产品、食品原料、加工食品、贴牌与联合开发。六类客户为食品饮料工厂、食品品牌与自有品牌、餐饮茶饮酒店、商超零售、进口商分销商、电商与专业食品渠道。

产品资料包括用户提供的枸杞原浆、NFC 红黑枸杞果汁、沙棘汁、刺梨汁和锁鲜枸杞，以及已有干果、谷物与蜂蜜方向。粉体、自有品牌果汁、小袋原浆、零食与餐饮基底按开发选项呈现。刺梨为补充采购，不推定其为青海供应商或高原产地。锁鲜不默认等同某一种冻藏或加工工艺。

筛选包括形式、业务类型、配方成分关注和搜索。最多三项比较，询价页接收所选产品和客户类型，生成可预览的邮件需求；未添加实际订单或自动发送服务。

营养与功效表达以食材成分、配方价值和产品开发定位为基础。研究对象的含量不作为平台产品营养检测值；最终标签与可用宣称根据产品和目的地确认。

## 研究依据

- [Döhler：NFC 果汁形式](https://www.doehler.com/en/our-portfolio/fruit-vegetable-ingredients/nfc-juices.html)
- [Döhler：餐饮原料应用](https://www.doehler.com/en/markets/channels/foodservice.html)
- [红枸杞类胡萝卜素原始研究](https://pubmed.ncbi.nlm.nih.gov/18486400/)
- [黑枸杞花青素分析原始研究](https://pubs.rsc.org/en/content/articlehtml/2015/ay/c5ay00612k)
- [沙棘食品加工与成分研究](https://pubmed.ncbi.nlm.nih.gov/10552673/)
- [刺梨汁成分及储存褐变原始研究](https://pubmed.ncbi.nlm.nih.gov/36939010/)
- [欧盟食品营养与健康宣称](https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims_en)
- [FDA 食品标签宣称](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements)

## 新图

模式：内置 image_gen，生成并检查单张包装概念图，无外部 CLI。

项目路径：`apps/web/public/images/brand-v2/juice-range-editorial.png`，1536 × 1024。

四色无标签果汁瓶与一个原浆袋。通用包装与原料概念图，不作为供应商产品实拍或认证证明。用于产品目录和客户方案展示。

最终提示词：

```text
Use case: photorealistic-natural. Create one premium editorial food packaging concept photograph for a B2B fruit-food sourcing website. Landscape 3:2. On a clean warm off-white stone tabletop arrange exactly four elegant small clear glass juice bottles with plain white screw caps, containing respectively orange-red goji juice, deep natural purple black-goji juice, vivid orange sea-buckthorn juice, and pale golden-yellow chestnut-rose juice, plus one small white unprinted flexible purée spout pouch and a low porcelain bowl of red dried goji berries beside a restrained small cluster of orange sea-buckthorn berries and a spoonful of dark berries. All containers entirely unlabelled, absolutely no text, brand, claims, badges or logos. Authentic fruit colours and believable liquid texture; no exaggerated neon. Editorial catalogue photography with subtle natural side light, soft shadows, high detail, warm white background, generous negative space, elegant balanced arrangement. Generic packaging and fruit ingredient concept, not a real supplier product photograph, no mountains or origin setting, no people, no certificates, no watermark. The four bottles and single pouch clearly distinguishable and all fully inside frame.
```
