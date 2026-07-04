import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/blog',
});

export const networkGuide = defineDocs({
  dir: 'content/network-guide',
});

export default defineConfig();
