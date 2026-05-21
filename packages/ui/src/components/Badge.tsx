import type { ReactNode } from 'react';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'inquiry' | 'direct';

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--neutral-100)] text-[var(--neutral-600)] border-[var(--border)]',
  success: 'bg-[var(--success-light)] text-[var(--success)]',
  warning: 'bg-[var(--warning-light)] text-[var(--warning)]',
  error: 'bg-[var(--error-light)] text-[var(--error)]',
  info: 'bg-[var(--info-light)] text-[var(--info)]',
  inquiry: 'bg-[var(--accent-inquiry-light)] text-[var(--accent-inquiry)]',
  direct: 'bg-[var(--accent-direct-light)] text-[var(--accent-direct)]',
};

export function Badge({
  variant = 'neutral',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-[6px]
        px-[8px] py-[4px]
        rounded-[var(--radius-full)]
        text-[12px] font-semibold
        border border-solid
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Status Badge for Admin/Supplier dashboards
type StatusType = 'new' | 'pending' | 'approved' | 'rejected' | 'published' | 'draft' | 'quoted' | 'negotiating' | 'closed_won' | 'closed_lost';

const statusToVariant: Record<StatusType, BadgeVariant> = {
  new: 'info',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  published: 'success',
  draft: 'neutral',
  quoted: 'info',
  negotiating: 'warning',
  closed_won: 'success',
  closed_lost: 'error',
};

const statusLabels: Record<StatusType, string> = {
  new: 'New',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
  draft: 'Draft',
  quoted: 'Quoted',
  negotiating: 'Negotiating',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

export function StatusBadge({ status: status }: { status: StatusType }) {
  const variant = statusToVariant[status] || 'neutral';
  const label = statusLabels[status] || status;

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}

// Trade Mode Badge
type TradeMode = 'inquiry' | 'direct';

const tradeModeLabels: Record<TradeMode, string> = {
  inquiry: 'Inquiry',
  direct: 'Direct Order',
};

export function TradeModeBadge({ mode }: { mode: TradeMode }) {
  const label = tradeModeLabels[mode] || mode;

  return (
    <Badge variant={mode}>
      {label}
    </Badge>
  );
}