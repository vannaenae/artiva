import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const hoverStyle = hoverable 
    ? 'hover:shadow-artiva-md hover:-translate-y-0.5 transition-all-fast cursor-pointer border-slate-300' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-artiva-lg border border-slate-200/80 shadow-artiva-sm p-5 ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};
