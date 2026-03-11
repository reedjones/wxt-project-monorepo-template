import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
        className,
      ].join(' ')}
    >
      {title && (
        <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      )}
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
