import React from 'react';

export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ${props.disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#7C65C1] text-white hover:bg-[#6B44BB]'} h-10 px-4 py-2`} {...props}>
    {children}
  </button>
);