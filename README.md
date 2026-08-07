# Brett (Old Sea)

个人主页源码仓库。线上：[oldsea.me](https://oldsea.me)（镜像：[haitaodesign.github.io](https://haitaodesign.github.io)）。

本文说明技术方案与日常维护方式。

## 技术方案

全站为**纯静态**产物，托管在 GitHub Pages。仓库是 pnpm + Turborepo 的 monorepo，两套内容栈分别构建后合并发布。

| 部分 | 技术 | 路径 |
|------|------|------|
| 主站 | [Quarkdown](https://github.com/iamgio/quarkdown)（`.qd` → HTML） | `apps/www` |
| 子站 `/network-guide` | Next.js 16（`output: "export"`）+ Fumadocs（MDX） | `apps/network-guide` |
| 包管理 / 编排 | pnpm 9 workspaces + Turborepo | 根目录 |
| 部署 | GitHub Actions → `dist` 分支 | `.github/workflows/build.yml` |

构建与发布流程：

```text
push main
  → pnpm build（Quarkdown 主站 + Next 导出子站）
  → 将 network-guide/out 合并进 www/quarkdown-output/site/network-guide/
  → 向 HTML 注入暗色主题脚本
  → 发布到 dist 分支（CNAME: oldsea.me）
```

主站博客以 Quarkdown（`apps/www/src/blog/*.qd`）为准；`apps/network-guide/content/blog` 为 Fumadocs 集合，不作为主站博客源。

## 目录结构

```text
haitaodesign.github.io/
├── apps/
│   ├── www/                         # 主站（Quarkdown）
│   │   ├── src/
│   │   │   ├── main.qd              # 站点入口
│   │   │   ├── setup.qd             # 主题 / SEO / CSS 变量
│   │   │   ├── about.qd / projects.qd / contacts.qd / blog.qd / footer.qd
│   │   │   ├── blog/YYYY-MM-DD-slug.qd
│   │   │   ├── stylesheets/style.css
│   │   │   └── js/
│   │   └── scripts/install-quarkdown.mjs
│   └── network-guide/               # 指南子站（Next + Fumadocs）
│       ├── content/network-guide/*.mdx
│       ├── next.config.ts           # basePath: /network-guide, output: export
│       └── source.config.ts
├── scripts/
│   ├── preview.sh                   # 全站构建 + 合并 + 本地预览
│   └── verify.mjs
├── .github/workflows/build.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

遗留目录（勿当现行源）：根下空的 `src/`、`_old_quarkdown_backup/`、`apps/www/archive/`。

## 环境要求

- Node.js 20+
- pnpm 9（见根 `packageManager`）
- `unzip`（`pnpm install` 时解压 Quarkdown CLI）

安装依赖会经 `apps/www` 的 postinstall 自动下载 Quarkdown。若失败，可参考 [Quarkdown 安装说明](https://github.com/iamgio/quarkdown) 手动安装。

## 常用命令

```bash
pnpm install    # 安装依赖并拉取 Quarkdown
pnpm build      # 全工作区生产构建
pnpm preview    # 构建 → 合并产物 → 注入暗色脚本 → serve :3000
pnpm dev        # 仅启动 network-guide（Next dev），不是全站预览
pnpm test       # scripts/verify.mjs（路径校验可能已过时，勿单独依赖）
```

本地要看与线上一致的合并结果，用 `pnpm preview`，不要用 `pnpm dev`。

## 内容维护

### 改主站页面

编辑 `apps/www/src/` 下对应 `.qd`：

- `about.qd` / `projects.qd` / `contacts.qd` / `blog.qd` / `footer.qd`
- 全局主题与站点配置：`setup.qd`
- 入口拼装：`main.qd`

Quarkdown **缩进敏感**，改完后建议 `pnpm build` 或 `pnpm preview` 验证。

### 写博客

1. 新增 `apps/www/src/blog/YYYY-MM-DD-slug.qd`
2. 头部参考现有文章，例如：

```text
.docname {标题}
.include {template/setup.qd}
.blogpost date:{May 17, 2026}
```

3. `blog.qd` 会通过文件列表自动收录，无需手动注册
4. push `main`，等 CI 部署

### 改出海指南

编辑 `apps/network-guide/content/network-guide/*.mdx`（frontmatter 含 `title`）。  
静态资源放 `apps/network-guide/public/`。

改 Next / Fumadocs 前：本仓库 Next 与常见资料可能不一致（见 [AGENTS.md](./AGENTS.md)）。先读子站依赖里的官方指南：`apps/network-guide/node_modules/next/dist/docs/`（需已 `pnpm install`）。

## 发布

1. 向 `main` 推送（触发 [Build workflow](.github/workflows/build.yml)）
2. CI 构建、合并、注入暗色脚本后，写入 **`dist`** 分支
3. GitHub Pages：Deploy from branch **`dist`**，folder **`/`**；CNAME 为 `oldsea.me`

暗色主题脚本由 CI 与 `scripts/preview.sh` 在构建后注入，**不在** Quarkdown 源码里维护。
