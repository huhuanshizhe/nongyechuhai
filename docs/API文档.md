# farmetra（农业出海）API 文档

> 版本：v0.1 | 更新日期：2026-05-21

---

## 1. 概述

### 1.1 架构说明

本项目采用 **Next.js 16 App Router + Server Components** 架构，不是传统的 REST API。系统的"API 层"由三部分组成：

| 层 | 技术实现 | 用途 |
|----|---------|------|
| **认证路由** | NextAuth.js HTTP 路由处理器 | 登录、登出、会话管理 |
| **写入操作** | React Server Actions (`'use server'`) | 表单提交（登录、询盘创建等） |
| **数据读取** | 服务端数据获取函数 | Server Components 直连数据库查询 |

类型安全贯穿全栈（TypeScript + Prisma + Zod）。

### 1.2 基础 URL

| 应用 | 开发环境 | 用途 |
|------|---------|------|
| web | `http://localhost:4000` | 公共商店前端（买家端） |
| admin | `http://localhost:4100` | 后台管理系统 |
| supplier | `http://localhost:4200` | 供应商工作台 |

生产环境由 Vercel 分配域名。

---

## 2. 认证机制

### 2.1 技术选型

| 维度 | 选择 |
|------|------|
| 框架 | Auth.js v5（NextAuth） |
| 会话策略 | JWT（无状态，不存储数据库会话） |
| Provider | Credentials（邮箱 + 密码） |
| 密码算法 | bcrypt（兼容 MD5 遗留密码迁移） |
| Adapter | PrismaAdapter（用户和账号数据持久化到 PostgreSQL） |

### 2.2 认证流程

```
用户提交 formData { email, password }
              │
              v
  Server Action → signIn('credentials', { email, password, redirect: false })
              │
              v
  Credentials provider 的 authorize 回调:
    1. Zod 校验 email（有效邮箱格式） + password（>= 8 位）
    2. prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    3. 检查 user.status === 'ACTIVE' 且 passwordHash 不为空
    4. bcrypt.compare(password, user.passwordHash)
    5. 检查 user.role 是否在 allowedRoles 中
    6. 返回 { id, email, name, role }
              │
              v
  JWT Callback: 将 id→token.sub, role→token.role
  Session Callback: 从 token 还原 session.user.id 和 session.user.role
              │
              v
  登录成功（或抛出 AuthError）
```

### 2.3 JWT Token 载荷

```typescript
// JWT Callback 写入
token.sub = user.id;                     // 用户 UUID
token.role = user.role;                  // 'ADMIN' | 'SUPPLIER' | 'BUYER'

// Session Callback 还原
session.user.id = token.sub;
session.user.role = token.role;
```

### 2.4 类型扩展

```typescript
// packages/auth/src/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: 'ADMIN' | 'SUPPLIER' | 'BUYER';
    };
  }
  interface User {
    role?: 'ADMIN' | 'SUPPLIER' | 'BUYER';
  }
}
```

### 2.5 各应用认证配置

| 应用 | 角色限制 | 登录路径 | 成功重定向 |
|------|---------|---------|-----------|
| web | `['BUYER']` | `/login` | `/account` |
| admin | `['ADMIN']` | `/login` | `/dashboard` |
| supplier | `['SUPPLIER']` | `/login` | `/products` |

每个应用有自己的 `src/auth.ts`，独立调用 `createAppAuth()` 生成 `{ handlers, auth, signIn, signOut }`。

### 2.6 角色守卫

admin 和 supplier 应用在布局层进行渲染前校验：

```typescript
// admin layout (apps/admin/src/app/(admin)/layout.tsx)
const session = await auth();
if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/login');

// supplier layout (apps/supplier/src/app/(supplier)/layout.tsx)
const session = await auth();
if (!sessionUser || sessionUser.role !== 'SUPPLIER' || !sessionUser.id) redirect('/login');
```

web 应用对受保护页面（`/account`、`/account/inquiries/:id`）做条件渲染，游客仍可浏览产品和提交询盘。

---

## 3. NextAuth HTTP 路由

### 3.1 路由注册

每个应用在 `src/app/api/auth/[...nextauth]/route.ts` 注册路由处理器：

```typescript
import { handlers } from '../../../auth';  // 实际相对路径因应用而异
export const { GET, POST } = handlers;
```

`handlers` 由 `createAppAuth()` 返回，每个应用的 handler 独立（不同端口、不同角色限制）。

### 3.2 端点列表

| 方法 | 路径 | 说明 | 认证要求 |
|------|------|------|---------|
| `GET` | `/api/auth/signin` | 登录页面（实际被自定义页面替代） | 公开 |
| `POST` | `/api/auth/signin` | 提交凭据进行登录 | 公开 |
| `GET` | `/api/auth/callback/credentials` | 凭据回调（Auth.js 内部使用） | 公开 |
| `POST` | `/api/auth/callback/credentials` | 凭据回调（Auth.js 内部使用） | 公开 |
| `GET` | `/api/auth/session` | 获取当前会话 JSON | 公开（未登录返回 null） |
| `GET` | `/api/auth/csrf` | 获取 CSRF 令牌 | 公开 |
| `POST` | `/api/auth/signout` | 执行登出 | 需要有效会话 |
| `GET` | `/api/auth/signout` | 登出确认页 | 公开 |
| `GET` | `/api/auth/providers` | 列出已配置的认证提供方 | 公开 |

### 3.3 Session 响应格式

```json
// GET /api/auth/session（已登录时）
{
  "user": {
    "id": "uuid-string",
    "name": "User Name",
    "email": "user@example.com",
    "role": "BUYER"
  },
  "expires": "2026-05-22T00:00:00.000Z"
}

// GET /api/auth/session（未登录时）
null
```

### 3.4 说明

实际应用中，登录和登出主要由 **Server Actions** 触发（调用 `signIn()` / `signOut()` 然后 `redirect()`），而非直接访问这些 HTTP 端点。这些路由主要由 Auth.js 内部状态机使用。

---

## 4. Server Actions

所有 Server Action 使用 `'use server'` 指令标记，由 Next.js 框架处理表单提交的序列化。

### 4.1 Web 应用（apps/web）

#### 4.1.1 signInAction — 买家登录

- **文件**：`apps/web/src/app/[locale]/login/actions.ts`
- **入口**：`/[locale]/login` 页面的登录表单

```
入参: FormData
  email:    string（必填，邮箱格式）
  password: string（必填，最少 8 位）

流程:
  1. 调用 signIn('credentials', { email, password, redirect: false })
  2. 成功 → redirect('/account')
  3. 失败（catch）→ redirect('/login?error=CredentialsSignin')

返回: 无（通过 redirect 跳转）
```

#### 4.1.2 signOutAction — 买家登出

- **文件**：`apps/web/src/app/actions.ts`

```
入参: 无

流程:
  1. 调用 signOut({ redirectTo: '/' })

返回: 无（通过 redirect 跳转）
```

#### 4.1.3 submitInquiryAction — 提交询盘

- **文件**：`apps/web/src/app/rfq/actions.ts`（无 locale 版本）
- **文件**：`apps/web/src/app/[locale]/rfq/actions.ts`（含 locale 感知的 URL 构建）

```
入参: FormData
  locale?:           string  （可选，默认 'en'）
  productSlug?:      string  （可选，用于关联产品的 slug）
  customerName:      string  （必填）
  customerCompany?:  string  （可选）
  customerEmail:     string  （必填，需匹配邮箱正则 /^[^\s@]+@[^\s@]+\.[^\s@]+$/）
  customerPhone?:    string  （可选）
  customerCountry:   string  （必填，目的地市场）
  quantityRequested?: number （可选）
  targetPrice?:      number  （可选）
  currency?:         string  （可选，默认 'USD'，可选值 USD/EUR/CNY/SGD/AED）
  requirements:      string  （必填，需求描述）

验证:
  - customerName, customerEmail, customerCountry, requirements 不能为空
  - customerEmail 格式校验

流程:
  1. 获取当前 session（可选，如已登录则关联 buyerUserId）
  2. 字段验证 → 失败时 redirect(?error=missing-fields|invalid-email)
  3. 通过 productSlug 查找产品 → 获取 supplierId
  4. 无产品关联时，查找第一个状态为 APPROVED 的供应商作为后备
  5. 无可用供应商 → redirect(?error=no-supplier)
  6. 生成询盘编号: INQ-{YYYYMMDD}-{随机6位数字}
  7. prisma.inquiry.create({ data: { ... } })
  8. revalidatePath() 刷新相关路径缓存
  9. redirect 到 /rfq?submitted=1&reference=INQ-XXXXXX

返回: 无（通过 redirect 跳转）
```

#### 4.1.4 getInquiryDetails — 获取询盘详情

- **文件**：`apps/web/src/app/[locale]/rfq/actions.ts`

```
入参:
  inquiryNumber: string

返回: InquiryDetail | null

InquiryDetail = {
  id:              string;
  inquiryNumber:   string;
  status:          string;
  createdAt:       Date;
  updatedAt:       Date;
  customerName:    string;
  customerEmail:   string;
  customerPhone:   string | null;
  customerCompany: string | null;
  customerCountry: string | null;
  quantityRequested: number | null;
  targetPrice:     Decimal | null;
  currency:        string | null;
  requirements:    string | null;
  product: {
    name:          string;
    slug:          string;
    coverImageUrl: string | null;
    category: { name: string } | null;
  } | null;
  supplier: {
    organization: { name: string };
  };
  quotes: Array<{
    id:           string;
    quoteNumber:  string;
    status:       string;
    currency:     string;
    totalAmount:  Decimal | null;
    minOrderQty:  number | null;
    leadTimeDays: number | null;
    validUntil:   Date | null;
    notes:        string | null;
    sentAt:       Date | null;
  }>;
}

说明:
  - 仅查询已发送（status === 'SENT'）的报价
  - 报价按 sentAt 倒序排列
```

---

### 4.2 Admin 应用（apps/admin）

#### 4.2.1 loginAction — 管理员登录

- **文件**：`apps/admin/src/app/login/actions.ts`

```
入参: FormData
  email:    string
  password: string

流程:
  1. 调用 signIn('credentials', { email, password, redirectTo: '/dashboard' })
  2. AuthError → redirect('/login?error=credentials')
  3. 非 AuthError → throw（交给 Next.js 错误边界处理）

返回: 无（通过 redirect 跳转）
```

#### 4.2.2 signOutAction — 管理员登出

- **文件**：`apps/admin/src/app/(admin)/actions.ts`

```
入参: 无

流程:
  1. 调用 signOut({ redirectTo: '/login' })

返回: 无（通过 redirect 跳转）
```

---

### 4.3 Supplier 应用（apps/supplier）

#### 4.3.1 loginAction — 供应商登录

- **文件**：`apps/supplier/src/app/login/actions.ts`

```
入参: FormData
  email:    string
  password: string

流程:
  1. 调用 signIn('credentials', { email, password, redirectTo: '/products' })
  2. AuthError → redirect('/login?error=credentials')
  3. 非 AuthError → throw

返回: 无（通过 redirect 跳转）
```

#### 4.3.2 signOutAction — 供应商登出

- **文件**：`apps/supplier/src/app/(supplier)/actions.ts`

```
入参: 无

流程:
  1. 调用 signOut({ redirectTo: '/login' })

返回: 无（通过 redirect 跳转）
```

---

## 5. 数据读取层（"Read API"）

服务端数据获取函数由 Server Components 直接调用，构成应用的"读 API"层。这些函数内部通过 Prisma 查询数据库并返回映射后的 DTO。

### 5.1 Web 应用数据函数（apps/web/src/lib/storefront.ts）

| 函数 | 入参 | 返回 | 缓存 | 用途 |
|------|------|------|------|------|
| `getStorefrontShellData()` | — | `{ publishedProductCount, approvedSupplierCount, activeCategoryCount }` | `cache()` | 全局头部/底部信号数据 |
| `getHomepageData()` | — | `{ featuredProducts, featuredCategories, editorial }` | `cache()` | 首页内容 |
| `getCatalogPageData(filters)` | `{ category?, mode? }` | `{ products, categories, productGroups, supplierPrograms, activeCategory, activeMode, modeCounts }` | — | 产品目录 + 筛选 |
| `getProductDetail(slug)` | `slug: string` | `{ product: StorefrontProductDetail, relatedProducts } \| null` | `cache()` | 产品详情 + 相关产品 |
| `getRfqPageData(slug?)` | `slug?: string` | `{ products, selectedProduct }` | — | 询盘表单下拉选项 |
| `getCmsPageBySlug(slug)` | `slug: string` | `CmsPageContent \| null` | `cache()` | CMS 内容页 |
| `getBuyerAccountData(userId)` | `userId: string` | `BuyerAccountData \| null` | `cache()` | 买家仪表盘 |
| `getBuyerInquiries(userId)` | `userId: string` | `InquirySummary[]` | — | 买家询盘列表 |

### 5.2 Admin 应用数据函数（apps/admin/src/lib/admin-data.ts）

| 函数 | 入参 | 返回 | 用途 |
|------|------|------|------|
| `getAdminDashboardData()` | — | `{ metrics[4], pulse[2], recentInquiries[5], suppliers[4], products[5], content[4] }` | 运营仪表盘 |
| `getAdminSuppliersPageData()` | — | `SupplierRow[]` | 供应商管理列表 |
| `getAdminProductsPageData()` | — | `ProductRow[]` | 商品管理列表 |
| `getAdminInquiriesPageData()` | — | `InquiryRow[]` | 询盘管理列表 |
| `getAdminContentPageData()` | — | `{ pages: PageRow[], faqItems: FaqRow[] }` | 内容管理 |

### 5.3 Supplier 应用数据函数（apps/supplier/src/lib/supplier-data.ts）

| 函数 | 入参 | 返回 | 用途 |
|------|------|------|------|
| `getSupplierWorkspace(userId)` | `userId: string` | `{ id, organizationName, location, status, verificationLabel, ...counts } \| null` | 侧边栏信息 + 身份校验 |
| `getSupplierProductsPageData(supplierId)` | `supplierId: string` | `{ summary: { publishedCount, pendingCount, totalCount }, products[] }` | 自有商品管理 |
| `getSupplierInquiriesPageData(supplierId)` | `supplierId: string` | `InquiryRow[]` | 收到的询盘 |
| `getSupplierOrdersPageData(supplierId)` | `supplierId: string` | `{ summary: { totalCount, openOrderCount }, orders[] }` | 自有订单管理 |

---

## 6. 核心类型定义

### 6.1 产品相关 DTO

```typescript
// 产品卡片（列表/卡片展示用）
type StorefrontProductCard = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  currency: string;
  priceMinValue: number | null;
  priceMaxValue: number | null;
  tradeModeLabel: string;         // "Inquiry program" | "Direct order program"
  tradeModeTone: 'inquiry' | 'purchase';
  tradeModeDescription: string;
  priceLabel: string;             // 格式化后的价格文本（如 "$12.00 - $18.00 reference range"）
  primaryImageUrl: string;
  primaryImageAlt: string;
  categoryName: string;
  categorySlug: string;
  portfolioGroup: 'fresh' | 'dried' | 'retail' | null;
  supplierName: string;
  supplierLocation: string;
  supplierDescription: string | null;
  supplierVerified: boolean;
  model: string | null;
  specHighlights: Array<{ label: string; value: string }>;
  seoTitle: string | null;
  seoDescription: string | null;
};

// 产品详情（继承卡片，扩展画廊/FAQ/变体）
type StorefrontProductDetail = StorefrontProductCard & {
  richDescriptionHtml: string;
  gallery: Array<{ url: string; alt: string }>;
  faqItems: Array<{ question: string; answer: string }>;
  variants: Array<{
    sku: string;
    title: string;
    priceLabel: string;
    stockLabel: string;
  }>;
};
```

### 6.2 买家相关 DTO

```typescript
type BuyerAccountData = {
  buyerName: string;
  buyerEmail: string;
  metrics: {
    openInquiryCount: number;    // 进行中的询盘
    quotedInquiryCount: number;  // 已报价的询盘
    activeOrderCount: number;    // 进行中的订单
    paidOrderCount: number;      // 已支付的订单
  };
  inquiries: Array<{
    inquiryNumber: string;
    status: string;
    statusTone: 'green' | 'amber' | 'earth' | 'slate';
    productName: string;
    supplierName: string;
    quoteCount: number;
    createdAt: string;
  }>;
  orders: Array<{
    orderNumber: string;
    status: string;
    statusTone: 'green' | 'amber' | 'earth' | 'slate';
    paymentStatus: string;
    paymentTone: 'green' | 'amber' | 'earth' | 'slate';
    supplierName: string;
    productLabel: string;
    totalAmount: string;
    createdAt: string;
  }>;
};
```

### 6.3 Prisma Select 模式

项目使用 Prisma 类型安全的 validator 模式定义查询字段集：

```typescript
// 定义（storefront.ts）
const productCardSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  slug: true,
  name: true,
  // ... 具体字段
  category: {
    select: { id: true, slug: true, name: true, /* ... */ }
  },
  supplier: {
    select: {
      isVerified: true,
      organization: { select: { name: true, country: true, city: true } }
    }
  }
});

// 类型推导
type ProductQueryResult = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;
```

---

## 7. 错误处理

### 7.1 表单验证错误

询盘提交使用 **redirect + URL search params** 传递错误码：

```
错误码:
  missing-fields  — 必填字段（customerName / customerEmail / customerCountry / requirements）未填写
  invalid-email   — 邮箱格式不匹配正则
  no-supplier     — 系统没有可用供应商接收询盘

模式:
  redirect(buildRedirectUrl(locale, productSlug, errorCode))

前端消费:
  const errorMessage = getErrorMessage(isZh, errorCode);
  // 根据语言返回中文或英文的错误提示
```

### 7.2 认证错误

登录失败通过 catch `AuthError` 处理：

```typescript
try {
  await signIn('credentials', { email, password, redirect: false });
  redirect(successPath);
} catch (error) {
  if (error instanceof AuthError) {
    redirect('/login?error=CredentialsSignin');
  }
  throw error; // 非 AuthError 交给 Next.js 错误边界
}
```

### 7.3 空状态和未找到

所有列表和详情页均实现完整的空状态处理：

| 场景 | 处理方式 |
|------|---------|
| 产品不存在（404） | 显示 "Product not found" 卡片 + 返回产品目录链接 |
| 无询盘 | 空状态提示 + 引导浏览产品目录 |
| 无报价 | "No quotes yet" + 48小时首次响应承诺说明 |
| 无匹配筛选结果 | 提示 + 重置筛选链接 |
| 未登录访问受保护页 | 显示引导登录界面 |
| 供应商未关联组织 | `getSupplierWorkspace()` 返回 null，layout 重定向到 `/login` |

### 7.4 全局 404

`apps/web/src/app/not-found.tsx` 提供全局 404 页面，包含返回产品目录和询盘中心的链接。

---

## 8. 环境变量

### 8.1 变量清单

通过 `packages/config/src/env.ts` 的 Zod Schema 验证：

| 变量 | 类型 | 必填 | 默认值 | 用途 |
|------|------|------|--------|------|
| `DATABASE_URL` | string | 是 | — | Prisma 主数据库连接 |
| `DIRECT_URL` | string | 否 | — | Prisma 直连（用于迁移） |
| `AUTH_SECRET` | string | 是 | — | Auth.js JWT 签名密钥 |
| `AUTH_URL` | URL | 否 | `http://localhost:4000` | Auth.js 基础 URL |
| `AUTH_TRUST_HOST` | enum | 否 | `true` | 是否信任 Host header |
| `AI_BASE_URL` | URL | 否 | — | AI API 基础地址 |
| `AI_MODEL` | string | 否 | — | AI 模型名称 |
| `AI_API_KEY` | string | 否 | — | AI API 密钥 |
| `NEXT_PUBLIC_SITE_URL` | URL | 否 | `http://localhost:4000` | 公共站点 URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | email | 否 | — | 联系邮箱 |

### 8.2 验证方式

```typescript
// packages/config/src/env.ts
import { z } from 'zod';

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  // ...
});

export function readServerEnv(source = process.env): ServerEnv {
  return serverEnvSchema.parse(source);
}
```

---

> 本文档基于 `nongyechuhai` 项目当前代码状态编写。当前阶段的 API 以 Server Actions 和数据获取函数为主，未来若新增 REST 端点请同步更新本文档。
