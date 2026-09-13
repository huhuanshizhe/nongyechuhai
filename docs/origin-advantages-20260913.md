# 产地优势与平台价值展示更新

## 数据与口径

- 青海省枸杞种植面积 45.23 万亩；绿色有机认证面积 20 万亩。2025 年 9 月公开披露。后者是来源中的合并口径，不是全部取得有机认证的面积。
- 英文页面换算为约 30,153 / 13,333 公顷，同时保留原始亩数和换算关系：15 亩 = 1 公顷。
- 2025 年青海冷水鱼（虹鳟鱼）出口额超过 3.8 亿元。
- 以上仅为青海省区域统计，不扩展为整个青藏高原的数据，不代表平台或合作企业的产能、认证、供应量或出口业绩。
- 冷水鱼为区域产业介绍，不冒称已有供应伙伴，不提供生食承诺。采购咨询需要逐项确认供应商与目的地条件。

来源：

- [青海省政府：绿色有机农畜产品输出地建设成效亮眼，2025-09-19](https://www.qinghai.gov.cn/zwgk/system/2025/09/19/030081965.shtml)
- [青海日报同期版面备份](https://epaper.tibet3.com/qhrb/pic/202509/19/403bc2d0-e070-4d35-9c0a-fe781cfcbbad.pdf)
- [青海省外贸工作新闻发布会，2026 年 1 月](https://www.qhio.gov.cn/system/2026/01/29/030510597.shtml)

## 两站分工

海外站：首页与产地页加入枸杞、虹鳟图文和可展开的数据来源；品质页补充自然风土、食品安全资料和具体有机认证边界。虹鳟咨询跳转至已有联系页并预选主题。

国内站：首页保留完整核心 slogan，并以四组图文展示“看得懂、比得清、能询价、持续合作”，说明具体交付与双方价值。产业资源页加入产区依据、品质表达和水产品类筛选；企业服务页展示四步工作。

## 新配图与生成记录

模式：内置 image_gen，单张新图生成。未使用 CLI 或外部 API。

项目素材：`apps/web/public/images/brand-v2/rainbow-trout-editorial.png`（1536 × 1024）。国内构建生成 WebP 衍生图。

定位：通用虹鳟品类示意，不是实际企业、养殖基地或产品批次的照片。已检查整鱼与两块鱼片、无文字、无证书或品牌标识。

完整提示词：

```text
Use case: photorealistic-natural.
Asset type: one original editorial food category photograph for Farmetra's premium Qinghai–Tibet plateau foods website. This is generic illustrative category photography, not an actual supplier photo, and must not imply any documented farm, supplier, or origin.
Scene/backdrop: clean crushed ice in a dark slate tray on a restrained cool blue-grey tabletop.
Subject: exactly one whole rainbow trout and exactly two orange-pink rainbow-trout fillet portions, elegantly displayed together on the ice. The whole trout has correct silvery finely speckled skin, a subtle pink lateral band, realistic head, eye, gill cover, natural fins and tail, and accurate undistorted fish anatomy. Show the whole fish fully within the frame. The two fillet portions have natural orange-pink trout flesh, delicate realistic muscle texture and fine pale connective lines, plausible size and thickness.
Style/medium: original photorealistic editorial food photography, polished international B2B food catalog quality, clean and appetizing with authentic fine textures.
Composition/framing: landscape 3:2 aspect ratio, balanced elegant arrangement, slightly elevated three-quarter view, entire whole fish and both distinct fillet portions clearly visible, uncluttered composition.
Lighting/mood: subtle natural sidelight, soft shadows, controlled ice highlights, restrained cool blue-grey surroundings with natural fish colors.
Constraints: chilled uncooked food ingredients presented for sale and subsequent cooking; no raw consumption scene, no salmon sashimi, sushi, thin sashimi slices, dining setup or utensils. No mountains, farm, supplier setting, packaging, certificates, badges, text, logos, watermarks, or people. No garnish or added props. Generate exactly one image.
```
