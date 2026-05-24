# 产品图片 AI 生成说明

当前站点已经支持以下图片优先级：

1. apps/web/public/images/products/<slug>/ 下的本地生成图
2. 受控 fallback 图源
3. 数据库中原有图片

这意味着后续只要把新图生成到固定目录，前台就会自动覆盖旧图，不需要再去改组件代码。

## 运行前提

需要配置以下环境变量：

- AI_BASE_URL
- AI_API_KEY
- AI_IMAGE_MODEL

说明：

- 脚本默认按 OpenAI-compatible 图片接口调用。
- 推荐把 AI_IMAGE_MODEL 设为 gpt-image-1 或你的兼容图片模型。
- 文字类接口现有的 AI_MODEL 不会被这个脚本强依赖。
- 如果没有 AI 图片密钥，脚本会自动回退为站点调性的 SVG 产品图，保证上线时不再出现错图。

## 常用命令

先做 prompt 预览，不调用模型：

```powershell
corepack pnpm images:generate --dry-run --limit=3
```

无密钥情况下，直接生成全量品牌化 SVG 替换图：

```powershell
corepack pnpm images:generate --include-detail --mode=svg
```

只生成首页最急的几个产品主图：

```powershell
corepack pnpm images:generate --slugs=halal-curry-chicken-ready-meal,west-lake-longjing-tea,chinese-mitten-crab
```

为指定产品同时生成主图和详情辅图：

```powershell
corepack pnpm images:generate --slugs=organic-morel-mushroom,organic-morel-retail-box --include-detail
```

强制走真实 AI 出图：

```powershell
corepack pnpm images:generate --include-detail --mode=ai
```

全量生成所有产品主图：

```powershell
corepack pnpm images:generate
```

## 输出目录

生成后的文件会写入：

- hero.webp 或 hero.png 或 hero.jpeg
- detail-1.webp 或 detail-1.png 或 detail-1.jpeg

如果回退为 SVG 模式，则会输出：

- hero.svg
- detail-1.svg

目录结构如下：

```text
apps/web/public/images/products/
  <slug>/
    hero.webp
    detail-1.webp
  generation-report.json
```

如果使用 dry run，会把 prompt 预览写到：

```text
docs/product-image-prompts.json
```

## 建议的生成节奏

上线前优先做三批：

1. 首页和目录最先出现的产品
2. 高价值和高信任敏感产品
3. 包装型 SKU 和详情页需要辅图的产品

建议先生成主图，确认风格稳定后再追加 detail 图，避免一次性把成本打满。

## 当前风格约束

脚本已经把以下要求写入 prompt：

- 专业农业出口平台，不是电商促销海报
- 写实商业摄影，不要插画感和 3D 感
- 温暖中性色与深绿色基调，贴合 farmetra 现有视觉
- 构图留白干净，适合卡片和详情页裁切
- 避免文字、水印、伪标签、夸张色彩和无关道具

## 需要人工复核的点

- 包装图是否出现不可用文字
- 产地属性是否被模型误画成其他物种
- 即食食品是否过度“餐厅摆盘化”而失去 B2B 包装可信度
- 海鲜和生鲜产品是否显得像零售摊位而非出口项目