#!/usr/bin/env node
/**
 * Post-merge SEO:
 * 1. Write a combined sitemap.xml for Quarkdown + /network-guide
 * 2. Inject Open Graph / Twitter / JSON-LD into Quarkdown HTML (not Next pages)
 *
 * After deploy, submit https://oldsea.me/sitemap.xml in Google Search Console.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://oldsea.me';
const SITE_ROOT = path.resolve('apps/www/quarkdown-output/site');
const OG_IMAGE = `${SITE}/og.jpg`;
const SKIP_DIR_NAMES = new Set(['_next', 'theme', 'script', 'assets']);
const SKIP_HTML_NAMES = new Set(['404.html', '_not-found.html']);

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Site output not found: ${dir}`);
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walkHtml(full, acc);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html') && !SKIP_HTML_NAMES.has(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function fileToUrl(filePath) {
  const rel = path.relative(SITE_ROOT, filePath).split(path.sep).join('/');
  let url = null;
  if (rel === 'index.html') url = `${SITE}/`;
  else if (rel.endsWith('/index.html')) {
    url = `${SITE}/${rel.slice(0, -'index.html'.length)}`;
  } else if (rel.endsWith('.html')) {
    url = `${SITE}/${rel.slice(0, -'.html'.length)}`;
  }
  if (url && url !== `${SITE}/` && url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeEntities(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function attr(value) {
  return xmlEscape(String(value));
}

function urlMeta(url) {
  if (url === `${SITE}/`) {
    return { changefreq: 'weekly', priority: '1.0' };
  }
  if (url === `${SITE}/network-guide` || url.includes('/network-guide/')) {
    return { changefreq: 'weekly', priority: '0.8' };
  }
  return { changefreq: 'monthly', priority: '0.6' };
}

function writeSitemap(files) {
  const urls = [];
  const seen = new Set();

  for (const file of files) {
    const url = fileToUrl(file);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const lastmod = fs.statSync(file).mtime.toISOString().slice(0, 10);
    const { changefreq, priority } = urlMeta(url);
    urls.push({ url, lastmod, changefreq, priority });
  }

  urls.sort((a, b) => {
    if (a.url === `${SITE}/`) return -1;
    if (b.url === `${SITE}/`) return 1;
    return a.url.localeCompare(b.url);
  });

  const body = urls
    .map(
      ({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${xmlEscape(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  fs.writeFileSync(path.join(SITE_ROOT, 'sitemap.xml'), xml);
  return urls.length;
}

function extractAttr(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : '';
}

function homepageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'Old Sea',
        url: SITE,
        description:
          'Old Sea (Brett Lee) — full-stack developer becoming an AI engineer. Notes, projects, and a Chinese guide to overseas internet access.',
        publisher: { '@id': `${SITE}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE}/#person`,
        name: 'Old Sea (Brett Lee)',
        alternateName: ['Brett Lee', 'haitaodesign', '老海'],
        url: SITE,
        jobTitle: 'Full-stack Engineer',
        sameAs: ['https://github.com/haitaodesign'],
      },
    ],
  };
}

function articleJsonLd({ title, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: 'Old Sea (Brett Lee)',
      url: SITE,
    },
    image: OG_IMAGE,
  };
}

function seoSnippet({ title, description, url, isHome }) {
  const jsonLd = isHome
    ? homepageJsonLd()
    : articleJsonLd({ title, description, url });
  const ogType = isHome ? 'website' : 'article';

  return `    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="Old Sea">
    <meta property="og:title" content="${attr(title)}">
    <meta property="og:description" content="${attr(description)}">
    <meta property="og:url" content="${attr(url)}">
    <meta property="og:image" content="${attr(OG_IMAGE)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(title)}">
    <meta name="twitter:description" content="${attr(description)}">
    <meta name="twitter:image" content="${attr(OG_IMAGE)}">
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
`;
}

function injectQuarkdownSeo(files) {
  let injected = 0;

  for (const file of files) {
    const rel = path.relative(SITE_ROOT, file).split(path.sep).join('/');
    if (rel === 'network-guide' || rel.startsWith('network-guide/')) continue;

    const url = fileToUrl(file);
    if (!url) continue;

    let html = fs.readFileSync(file, 'utf8');
    if (/property=["']og:title["']/.test(html)) continue;

    const title = decodeEntities(
      extractAttr(html, /<title[^>]*>([^<]*)<\/title>/i) || 'Old Sea / Brett Lee',
    );
    const description = decodeEntities(
      extractAttr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"]*)["']/i) ||
        extractAttr(html, /<meta[^>]+content=["']([^"]*)["'][^>]+name=["']description["']/i) ||
        'Old Sea (Brett Lee) — full-stack developer becoming an AI engineer.',
    );
    const isHome = rel === 'index.html';
    const snippet = seoSnippet({ title, description, url, isHome });

    if (!/<\/head>/i.test(html)) continue;
    html = html.replace(/<\/head>/i, `${snippet}</head>`);
    fs.writeFileSync(file, html);
    injected += 1;
  }

  return injected;
}

const files = walkHtml(SITE_ROOT);
const urlCount = writeSitemap(files);
const injected = injectQuarkdownSeo(files);

if (urlCount < 2) {
  throw new Error(`sitemap.xml looks too small (${urlCount} URLs)`);
}

console.log(`SEO: wrote sitemap.xml with ${urlCount} URLs; injected metadata into ${injected} Quarkdown pages`);
