import { appInfo } from '@/types/constant';
import Head from 'next/head';
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
    <Head>
      <title>{title}</title>
      <meta name='description' content={desc} />
      {children}
    </Head>
  );
}
