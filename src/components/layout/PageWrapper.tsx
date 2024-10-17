import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={twMerge(
        'flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20',
        className
      )}
    >
      {children}
    </div>
  );
}
