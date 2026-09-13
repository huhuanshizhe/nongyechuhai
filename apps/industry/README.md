# Farmetra 产业合作网站

面向国内产业带企业、地方产业组织、供应链服务与产业合作方的独立展示站。与海外采购官网共享品牌素材，但独立目录、独立 Vercel 项目和独立域名。

## 本地

- 仓库根目录执行 `corepack pnpm install`。
- `corepack pnpm --filter @nongyechuhai/industry build`。
- `corepack pnpm --filter @nongyechuhai/industry dev`，访问 `http://localhost:4300`。
- `node tools/smoke-industry.mjs http://localhost:4300` 检查页面和素材。

## Vercel

- 项目：`farmetra-industry`。
- Git：`huhuanshizhe/nongyechuhai`，分支 `main`。
- Root Directory：`apps/industry`；包含根目录外源文件。
- Framework：Other；Build：`node build.mjs`；Output：`dist`。
- 构建时从 `apps/web/public` 读取已有素材，以 Sharp 输出轻量 WebP。
- `SITE_URL` 可设为最终完整域名。未设置时使用 Vercel 提供的项目正式域名，以生成 canonical 和 sitemap。
- `CONTACT_EMAIL` 可配置商务联系邮箱，默认 `export@farmetra.com`。

绑定二级域名时，在本项目添加域名，再按照 Vercel 提供的实际 DNS 记录解析。不要将国内域名绑定到海外站、后台或供应商应用。

## 范围

八个展示页面：平台概览、首页、企业服务、产业资源、合作共建、企业加入、合作洽谈与信息说明。支持品类筛选、手机导航、企业资料清单下载、合作方向预填、邮件预览与复制。联系内容不会直接写入服务器，须由访客在邮箱中发送。未实现交易、支付、企业审批或业务后台。

## 内容边界

平台公司为拟设主体；涂豆出海提供建设运营服务，不作为本方案出资方。未公布融资金额、收益承诺或未经确认的企业数量。衡源萃关系由项目发起人提供，企业公开信息参考其官网。图片使用授权、产品规格与商务收件情况应在正式运营前核对。创意产品与产地视觉不替代供应商实物或资质证明。
