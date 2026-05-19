# nongyechuhai

农业出海项目的新代码仓库。

## 技术基线

- Node 22
- pnpm workspace + Turbo
- Next.js 16 + React 19
- Prisma + Neon PostgreSQL
- Auth.js

## 本地开发

```powershell
corepack enable
corepack prepare pnpm@9.15.0 --activate
corepack pnpm install
corepack pnpm dev:web
corepack pnpm dev:admin
corepack pnpm dev:supplier
```

三个应用的本地端口约束在 4000-5000 范围，由根目录脚本自动挑选。

## 下一步

1. 补齐 apps/web、apps/admin、apps/supplier 的业务壳。
2. 落地 packages/db 的 Prisma schema 与首次迁移。
3. 接入 Auth.js、供应商工作台和 RFQ 流程。
