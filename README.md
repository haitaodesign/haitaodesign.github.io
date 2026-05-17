# haitaodesign.github.io

Brett 的个人站点，由 [Quarkdown](https://github.com/iamgio/quarkdown) 编写，GitHub Actions 构建并发布。

## 结构

- `src/main.qd` — 站点入口
- `src/blog/` — 博客文章（`YYYY-MM-DD-slug.qd`）
- `archive/index.html` — 迁移前的静态门户（仅作参考）

## 本地构建

```bash
# 安装 Quarkdown CLI（见 https://github.com/iamgio/quarkdown）
quarkdown c src/main.qd --out-name site --clean
# 预览 quarkdown-output/site/index.html
```

## 部署

1. 推送至 **`main`** 分支触发 [Build workflow](.github/workflows/build.yml)
2. 产物发布到 **`dist`** 分支
3. 在仓库 **Settings → Pages** 中设置：**Source = Deploy from branch**，**Branch = `dist`**，**Folder = `/ (root)`**

## 写新文章

1. 在 `src/blog/` 新建 `YYYY-MM-DD-标题.qd`
2. 复制现有文章头部（`.docname`、`.include {template/setup.qd}`、`.blogpost date:{...}`）
3. 推送到 `main`，等待 CI 完成
