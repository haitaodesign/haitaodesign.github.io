import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { networkGuideSource } from '@/app/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={networkGuideSource.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
