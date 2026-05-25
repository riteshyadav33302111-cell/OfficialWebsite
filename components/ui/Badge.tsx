interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'coral' | 'amber' | 'sage' | 'gray';
}

const variantStyles: Record<string, string> = {
  primary: 'border-[var(--accent-primary)] text-[var(--accent-primary)]',
  secondary: 'border-[var(--accent-secondary)] text-[var(--accent-secondary)]',
  coral: 'border-[var(--accent-coral)] text-[var(--accent-coral)]',
  amber: 'border-[var(--accent-amber)] text-[var(--accent-amber)]',
  sage: 'border-[var(--accent-sage)] text-[var(--accent-sage)]',
  gray: 'border-[var(--accent-gray)] text-[var(--accent-gray)]',
};

export default function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`tag ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
