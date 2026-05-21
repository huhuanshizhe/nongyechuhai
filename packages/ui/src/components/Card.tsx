import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({
  children,
  className = '',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        border border-[var(--border)]
        rounded-[var(--radius-lg)]
        bg-[var(--bg-card)]
        shadow-[var(--shadow)]
        overflow-hidden
        ${hover ? 'transition-[border-color,box-shadow] duration-[var(--transition)] hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Card Header
type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`p-[16px] border-b border-[var(--border)] ${className}`}>
      {children}
    </div>
  );
}

// Card Body
type CardBodyProps = {
  children: ReactNode;
  className?: string;
};

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`p-[16px] ${className}`}>
      {children}
    </div>
  );
}

// Card Footer
type CardFooterProps = {
  children: ReactNode;
  className?: string;
};

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`p-[16px] border-t border-[var(--border)] bg-[var(--neutral-50)] ${className}`}>
      {children}
    </div>
  );
}

// Data Card for Dashboard
type DataCardProps = {
  title: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
};

const dataCardVariants = {
  default: 'text-[var(--neutral-900)]',
  primary: 'text-[var(--primary)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
};

export function DataCard({
  title,
  value,
  description,
  variant = 'default',
}: DataCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="grid gap-[8px]">
          <span className="text-[12px] font-medium text-[var(--neutral-500)] uppercase tracking-wide">
            {title}
          </span>
          <strong className={`text-[28px] font-bold ${dataCardVariants[variant]}`}>
            {value}
          </strong>
          {description && (
            <p className="text-[14px] text-[var(--neutral-600)]">
              {description}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}