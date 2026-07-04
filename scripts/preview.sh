#!/bin/bash
echo "🚀 构建全站静态资源 (Quarkdown + Next.js)..."
pnpm run build

echo "📦 拼装路由..."
# 创建目标文件夹
mkdir -p apps/www/quarkdown-output/site/network-guide

# 将 Next.js 产物拷贝进 Quarkdown 网站目录下
cp -a apps/network-guide/out/* apps/www/quarkdown-output/site/network-guide/

echo "🌙 同步主站暗黑模式..."
find apps/www/quarkdown-output/site -name "*.html" -exec sed -i.bak 's|</head>|<script>if(localStorage.getItem("theme")==="dark"\|\|(!localStorage.getItem("theme")\&\&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}</script></head>|' {} +
find apps/www/quarkdown-output/site -name "*.bak" -type f -delete

echo "✅ 拼装完成！正在启动本地预览服务器..."
npx serve -l 3000 apps/www/quarkdown-output/site
