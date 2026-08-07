// @ts-nocheck
import * as __fd_glob_8 from "../content/network-guide/07_network_assets.mdx?collection=networkGuide"
import * as __fd_glob_7 from "../content/network-guide/06_overseas_payments.mdx?collection=networkGuide"
import * as __fd_glob_6 from "../content/network-guide/05_preparation.mdx?collection=networkGuide"
import * as __fd_glob_5 from "../content/network-guide/04_sim_cards.mdx?collection=networkGuide"
import * as __fd_glob_4 from "../content/network-guide/03_google_account.mdx?collection=networkGuide"
import * as __fd_glob_3 from "../content/network-guide/02_quick_access.mdx?collection=networkGuide"
import * as __fd_glob_2 from "../content/network-guide/01_why_share.mdx?collection=networkGuide"
import * as __fd_glob_1 from "../content/network-guide/00_foreword.mdx?collection=networkGuide"
import * as __fd_glob_0 from "../content/blog/2026-05-17-hello.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/blog", {}, {"2026-05-17-hello.mdx": __fd_glob_0, });

export const networkGuide = await create.docs("networkGuide", "content/network-guide", {}, {"00_foreword.mdx": __fd_glob_1, "01_why_share.mdx": __fd_glob_2, "02_quick_access.mdx": __fd_glob_3, "03_google_account.mdx": __fd_glob_4, "04_sim_cards.mdx": __fd_glob_5, "05_preparation.mdx": __fd_glob_6, "06_overseas_payments.mdx": __fd_glob_7, "07_network_assets.mdx": __fd_glob_8, });