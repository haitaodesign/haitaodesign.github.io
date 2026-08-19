import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: '零基础出海网络与数字生活指南',
  description:
    'OldSea 零基础出海指南：从科学上网、注册 Google 账号、海外手机号到出海支付，按实操步骤打通数字生活。',
  alternates: {
    canonical: '/network-guide/00_foreword',
  },
  openGraph: {
    title: '零基础出海网络与数字生活指南',
    url: '/network-guide/00_foreword',
    images: [OG_IMAGE],
  },
};

export default function RootPage() {
  redirect('/00_foreword');
}
