import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

export const metadata = { 
  title: `My Profile | Dashboard | ${config.site.name}` 
} satisfies Metadata;

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 