import React from 'react';

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" {...props} />
);