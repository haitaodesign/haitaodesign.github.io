import { networkGuideSource } from '@/app/source';
import type { Metadata } from 'next';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  AUTHOR_NAME,
  OG_IMAGE,
  SITE_URL,
  guideCanonical,
  guidePath,
  stripEmoji,
} from '@/lib/seo';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = networkGuideSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const canonical = guideCanonical(params.slug);
  const headline = stripEmoji(page.data.title);
  const description =
    page.data.description ??
    'OldSea 出海网络与数字生活指南。';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    inLanguage: 'zh-CN',
    url: canonical,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  };

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return networkGuideSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = networkGuideSource.getPage(params.slug);
  if (!page) notFound();

  const title = stripEmoji(page.data.title);
  const description =
    page.data.description ??
    'OldSea 出海网络与数字生活指南。';
  const canonicalPath = guidePath(params.slug);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      locale: 'zh_CN',
      title,
      description,
      url: canonicalPath,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
