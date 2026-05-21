import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
};

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-[32px] text-center text-[var(--neutral-500)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-[var(--neutral-50)] border-b border-[var(--border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-[16px] py-[12px] text-left text-[12px] font-semibold text-[var(--neutral-700)] uppercase tracking-wide ${col.width ? `w-[${col.width}]` : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={`
                border-b border-[var(--border)] last:border-b-0
                transition-[background] duration-[var(--transition-fast)]
                hover:bg-[var(--neutral-50)]
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-[16px] py-[14px] text-[14px] text-[var(--neutral-700)]"
                >
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Data Row for simpler list display
type DataRowProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function DataRow({ label, value, className = '' }: DataRowProps) {
  return (
    <div className={`flex items-center justify-between py-[8px] ${className}`}>
      <span className="text-[14px] text-[var(--neutral-500)]">{label}</span>
      <span className="text-[14px] font-medium text-[var(--neutral-900)]">{value}</span>
    </div>
  );
}