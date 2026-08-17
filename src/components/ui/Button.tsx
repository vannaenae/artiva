import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'danger' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-artiva transition-all-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-artiva-teal text-white hover:bg-artiva-teal-hover focus:ring-artiva-teal shadow-artiva-sm active:scale-[0.98]',
    secondary: 'bg-artiva-teal-light text-artiva-teal-dark hover:bg-teal-100 focus:ring-artiva-teal',
    outline: 'border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 focus:ring-artiva-teal',
    'outline-white': 'border border-white/40 text-white bg-white/10 hover:bg-white/20 focus:ring-white active:scale-[0.98]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm active:scale-[0.98]',
    gold: 'bg-artiva-gold text-slate-900 font-semibold hover:bg-artiva-gold-dark hover:text-white focus:ring-artiva-gold shadow-artiva-sm active:scale-[0.98]',
    ghost: 'text-slate-600 hover:text-artiva-teal hover:bg-slate-100 focus:ring-artiva-teal',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-block shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
