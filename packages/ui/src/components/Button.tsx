import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'soft' | 'inquiry' | 'direct';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)]',
  ghost: 'bg-transparent text-[var(--neutral-900)] border-[var(--border)] hover:bg-[var(--neutral-100)] hover:border-[var(--border-strong)]',
  soft: 'bg-[var(--primary-light)] text-[var(--primary-dark)] border-[var(--primary-light)] hover:bg-[var(--primary)] hover:text-white',
  inquiry: 'bg-[var(--accent-inquiry-light)] text-[var(--accent-inquiry)] border-[var(--accent-inquiry)] hover:bg-[var(--accent-inquiry)] hover:text-white',
  direct: 'bg-[var(--accent-direct-light)] text-[var(--accent-direct)] border-[var(--accent-direct)] hover:bg-[var(--accent-direct)] hover:text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-[16px] text-[13px]',
  md: 'min-h-[44px] px-[20px] text-[14px]',
  lg: 'min-h-[52px] px-[28px] text-[16px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-[8px]
        rounded-[var(--radius-md)]
        border border-solid
        font-semibold
        cursor-pointer
        transition-[background,border-color,color]
        duration-[var(--transition-fast)]
        focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}