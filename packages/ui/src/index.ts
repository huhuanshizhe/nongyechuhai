export type NavItem = {
  href: string;
  label: string;
};

export const adminNavItems: NavItem[] = [
  { href: '/dashboard', label: '仪表盘' },
  { href: '/suppliers', label: '供应商' },
  { href: '/products', label: '商品' },
  { href: '/inquiries', label: '询盘' },
  { href: '/content', label: '内容' }
];

export const supplierNavItems: NavItem[] = [
  { href: '/products', label: '商品管理' },
  { href: '/inquiries', label: '询盘处理' },
  { href: '/orders', label: '订单跟进' }
];

export const marketingHighlights = [
  {
    title: 'SSR storefront first',
    description: 'Prioritize product discovery, metadata, and inquiry entry before heavy integrations.'
  },
  {
    title: 'Unified supplier workflow',
    description: 'Admin and supplier apps will share one schema while keeping permissions isolated.'
  },
  {
    title: 'Mock payment, real order model',
    description: 'Stabilize order and payment adapter boundaries before connecting a live gateway.'
  }
];
