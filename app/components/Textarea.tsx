import React from 'react';

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2" {...props} />
);