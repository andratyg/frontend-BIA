import React from 'react';

/**
 * Reusable button component with primary and secondary styles.
 * Props:
 * - children: button label/content
 * - onClick: click handler
 * - type: button type (default 'button')
 * - variant: 'primary' | 'secondary' (default 'primary')
 * - disabled: boolean
 */
export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
  const baseClasses = 'px-5 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-brand-green text-white hover:bg-green-600 focus:ring-brand-green',
    secondary: 'bg-white text-brand-green border border-brand-green hover:bg-gray-100 focus:ring-brand-green',
  };
  const classes = `${baseClasses} ${variants[variant]}`;
  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
}
