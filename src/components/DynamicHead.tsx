import { appInfo } from '@/types/constant';
import { ReactNode } from 'react';

type DynamicHeadProps = {
  title?: string;
  desc?: string;
  children?: ReactNode;
};

export default function DynamicHead({
  title = appInfo.title,
  desc = appInfo.desc,
  children,
}: DynamicHeadProps) {
  return (
    <head>
      <title>{title}</title>
      <meta name='description' content={desc} />
      {children}
    </head>
  );
}
