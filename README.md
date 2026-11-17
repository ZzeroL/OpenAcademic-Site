# OpenAcademic-Site

OpenAcademic 产品站点（GitHub Pages，纯静态）。

## 页面

| 文件 | 内容 |
|---|---|
| `index.html` | 产品首页：收件箱、扫描通道、三件事、快速开始 |
| `docs.html` | 产品文档索引 |
| `roadmap.html` | 已知限制与规划 |
| `source.html` | 源码与自部署 |
| `404.html` | GitHub Pages 404 兜底 |

子页面共用 `assets/site.css`；首页在旧的收件箱 / 扫描样张样式之上叠加 `assets/site.css`。滚动渐入脚本在 `assets/reveal.js`。

## 链接约定

站点部署在 GitHub Pages 的项目路径下（`/<repo>/`），页面间一律使用相对链接（`./docs.html`），不要用 `/docs.html`。
