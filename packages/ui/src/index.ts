// Navigation types and config
export type NavItem = {
  href: string;
  label: string;
};

export const adminNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/suppliers', label: 'Suppliers' },
  { href: '/products', label: 'Products' },
  { href: '/inquiries', label: 'Inquiries' },
  { href: '/content', label: 'Content' }
];

export const supplierNavItems: NavItem[] = [
  { href: '/products', label: 'Products' },
  { href: '/inquiries', label: 'Inquiries' },
  { href: '/orders', label: 'Orders' }
];

// Re-export components
export * from './components/index';
