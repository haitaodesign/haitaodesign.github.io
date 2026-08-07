// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"2026-05-17-hello.mdx": () => import("../content/blog/2026-05-17-hello.mdx?collection=docs"), }),
  networkGuide: create.doc("networkGuide", {"00_foreword.mdx": () => import("../content/network-guide/00_foreword.mdx?collection=networkGuide"), "01_why_share.mdx": () => import("../content/network-guide/01_why_share.mdx?collection=networkGuide"), "02_network_assets.mdx": () => import("../content/network-guide/02_network_assets.mdx?collection=networkGuide"), "02_quick_access.mdx": () => import("../content/network-guide/02_quick_access.mdx?collection=networkGuide"), "03_google_account.mdx": () => import("../content/network-guide/03_google_account.mdx?collection=networkGuide"), "03_quick_access.mdx": () => import("../content/network-guide/03_quick_access.mdx?collection=networkGuide"), "04_google_account.mdx": () => import("../content/network-guide/04_google_account.mdx?collection=networkGuide"), "04_sim_cards.mdx": () => import("../content/network-guide/04_sim_cards.mdx?collection=networkGuide"), "05_preparation.mdx": () => import("../content/network-guide/05_preparation.mdx?collection=networkGuide"), "06_overseas_payments.mdx": () => import("../content/network-guide/06_overseas_payments.mdx?collection=networkGuide"), "06_sim_cards.mdx": () => import("../content/network-guide/06_sim_cards.mdx?collection=networkGuide"), "07_network_assets.mdx": () => import("../content/network-guide/07_network_assets.mdx?collection=networkGuide"), }),
};
export default browserCollections;