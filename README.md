# haitaodesign.github.io

Brett's personal site. Built with [Quarkdown](https://github.com/iamgio/quarkdown), deployed by GitHub Actions.

## Layout

- `src/main.qd` — site entry
- `src/blog/` — blog posts (`YYYY-MM-DD-slug.qd`)
- `archive/index.html` — old static portal (reference only)

## Build locally

```bash
# Install Quarkdown CLI: https://github.com/iamgio/quarkdown
quarkdown c src/main.qd --out-name site --clean
# Open quarkdown-output/site/index.html
```

## Deploy

1. Push to **`main`** to run [Build workflow](.github/workflows/build.yml)
2. Output goes to the **`dist`** branch
3. **Settings → Pages**: Deploy from branch **`dist`**, folder **`/ (root)`**

## New blog post

1. Add `src/blog/YYYY-MM-DD-slug.qd`
2. Copy the header from an existing post (`.docname`, `.include {template/setup.qd}`, `.blogpost date:{...}`)
3. Push to `main` and wait for CI
