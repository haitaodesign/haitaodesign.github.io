# Haitao Design

这是 [haitaodesign.github.io](https://haitaodesign.github.io) 的源码仓库，一个基于 [Next.js](https://nextjs.org/) 构建的个人网站。

## 🌟 特性

- **现代技术栈**：基于 Next.js App Router 构建
- **强大内容渲染**：集成 [Quarkdown](https://github.com/quarkdown/quarkdown)，提供极其灵活且高性能的定制化 Markdown 渲染体验
- **响应式设计**：完美适配桌面端和移动端设备
- **优秀性能**：借助 Next.js 的服务端渲染和静态生成提升加载速度

## 📁 核心目录

```text
haitaodesign.github.io/
├── apps/                    # 核心应用目录 (Monorepo 工作区)
│   ├── www/                 # 个人主页主站 (Quarkdown 项目)
│   └── network-guide/       # 网络指南子站 (Next.js 项目)
├── scripts/                 # 构建与部署等相关脚本
├── pnpm-workspace.yaml      # pnpm 工作区配置
└── turbo.json               # Turborepo 构建配置
```

## 📦 环境要求

本项目已在构建流程中集成了自动下载逻辑（在 `pnpm install` 阶段会自动拉取最新版 Quarkdown），因此您只需确保系统预装了以下基础工具：

- **unzip**：用于解压自动下载的二进制工具（macOS / Linux 通常已内置，Windows 用户请确保环境支持该命令）。
- **Node.js**：推荐使用 Node.js 18+。

> 💡 **备注**：如果在自动下载过程中遇到问题，您也可以选择参考 [Quarkdown 官方项目](https://github.com/iamgio/quarkdown) 在全局手动安装（例如 macOS/Linux 用户可运行：`curl -fsSL https://raw.githubusercontent.com/quarkdown-labs/get-quarkdown/refs/heads/main/install.sh | sudo env "PATH=$PATH" bash`）。

## 🚀 本地开发

克隆项目后，首先安装依赖：

```bash
pnpm install
```

然后启动开发服务器：

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可预览。

### 其他可用命令

项目还提供了以下常用脚本：

- `pnpm build`：执行全工作区的生产环境构建 (`turbo run build`)
- `pnpm test`：运行代码与环境验证脚本 (`node scripts/verify.mjs`)
- `pnpm preview`：运行本地预览脚本 (`bash scripts/preview.sh`)

## 🛠 技术栈

- 核心框架：[Next.js](https://nextjs.org/)
- 内容渲染：[Quarkdown](https://github.com/quarkdown/quarkdown) (用于高性能、可扩展的 Markdown 渲染)
- 部署：GitHub Pages

---

*本项目由 [Antigravity](https://github.com/google/antigravity) 驱动开发。*
