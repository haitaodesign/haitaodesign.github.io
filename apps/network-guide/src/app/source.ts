import { docs, networkGuide } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/blog',
  source: docs.toFumadocsSource(),
});

export const networkGuideSource = loader({
  baseUrl: '/',
  source: networkGuide.toFumadocsSource(),
});
