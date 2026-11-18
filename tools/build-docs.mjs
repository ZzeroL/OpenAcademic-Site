#!/usr/bin/env node
/**
 * Build the static product-doc pages from tools/docs/*.mjs.
 *
 * Usage: node tools/build-docs.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import start from "./docs/start.mjs";
import mechanism from "./docs/mechanism.mjs";
import data from "./docs/data.mjs";
import engineering from "./docs/engineering.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const outDir = join(root, "docs");

const docs = [...start, ...mechanism, ...data, ...engineering].sort((a, b) => a.order - b.order);
const bySlug = new Map(docs.map((d) => [d.slug, d]));

const esc = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const chrome = (doc, body) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#F5F5F7">
<meta name="color-scheme" content="light">
<link rel="icon" type="image/svg+xml" href="../assets/logo-mark-sm.svg">
<meta name="description" content="${esc(doc.desc)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(doc.plainTitle)} · 产品文档 · OpenAcademic">
<meta property="og:description" content="${esc(doc.desc)}">
<meta property="og:locale" content="zh_CN">
<meta property="og:site_name" content="OpenAcademic">
<title>${esc(doc.plainTitle)} · 产品文档 · OpenAcademic</title>
<link rel="stylesheet" href="../assets/site.css">
<link rel="stylesheet" href="../assets/docs.css">
<script>document.documentElement.classList.add("js");setTimeout(function(){if(!window.__oaReveal){document.querySelectorAll(".reveal").forEach(function(n){n.classList.add("is-in");});}},2000);</script>
</head>
<body>

<a class="skip" href="#main">跳到正文</a>

<header class="masthead">
  <div class="mast-inner">
    <a class="brand" href="../index.html" aria-label="OpenAcademic 首页">
      <img class="brand-mark" src="../assets/logo-mark-sm.svg" alt="" width="26" height="26">
      <span class="brand-text">
        <span class="brand-name">OpenAcademic</span>
        <span class="brand-sub">Research Production Line</span>
      </span>
    </a>
    <nav class="mast-nav" aria-label="页面导航">
      <a href="../index.html">首页</a>
      <a href="../docs.html" aria-current="page">文档</a>
      <a href="../roadmap.html">路线图</a>
      <a href="../source.html">源码</a>
    </nav>
    <a class="mast-cta" href="https://github.com/ZzeroL/OpenAcademic" target="_blank" rel="noopener">GitHub <span class="arr" aria-hidden="true">↗</span></a>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="foot">
  <div class="container">
    <div class="foot-inner">
      <div>
        <div class="foot-brand"><img class="mark" src="../assets/logo-mark-sm.svg" alt="" width="22" height="22">OpenAcademic</div>
        <p class="foot-tag">可核对的研究生产线 · Apache-2.0</p>
      </div>
      <nav class="foot-nav" aria-label="页脚导航">
        <a href="../index.html">首页</a>
        <a href="../docs.html">文档</a>
        <a href="../roadmap.html">路线图</a>
        <a href="../source.html">源码</a>
        <a href="https://github.com/ZzeroL/OpenAcademic" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
    <div class="foot-meta">
      <span>Apache License 2.0 · OpenAcademic contributors</span>
      <span>OpenAcademic · 产品文档 · 2026</span>
    </div>
  </div>
</footer>

<script src="../assets/reveal.js" defer></script>
<script>
(function(){
  var links = document.querySelectorAll(".doc-toc a[href^='#']");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function(a){ map[a.getAttribute("href").slice(1)] = a; });
  var sections = document.querySelectorAll(".prose section[id]");
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      links.forEach(function(a){ a.classList.remove("on"); });
      var link = map[e.target.id];
      if (link) link.classList.add("on");
    });
  }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
  sections.forEach(function(s){ io.observe(s); });
})();
</script>
</body>
</html>
`;

const tocList = (doc) =>
  doc.sections
    .map(
      (s) => `        <li><a href="#${s.id}"><span class="i">${s.num}</span><span>${s.title}</span></a></li>`
    )
    .join("\n");

const mobileToc = (doc) => `      <details class="toc-mobile">
        <summary>本页目录 · ${doc.sections.length} 节</summary>
        <ol>
${tocList(doc)}
        </ol>
      </details>`;

const related = (doc) => {
  const links = (doc.related || []).map((slug) => bySlug.get(slug)).filter(Boolean);
  if (!links.length) return "";
  return `      <aside class="related">
        <p class="k">继续阅读</p>
        <div class="related-grid">
${links
  .map(
    (d) => `          <a href="./${d.slug}.html"><span class="tag">${d.sectionEn}</span><span class="t">${d.plainTitle}</span><span class="d">${d.card}</span></a>`
  )
  .join("\n")}
        </div>
      </aside>`;
};

const docnav = (doc) => {
  const i = docs.findIndex((d) => d.slug === doc.slug);
  const prev = docs[i - 1];
  const next = docs[i + 1];
  if (!prev && !next) return "";
  return `      <nav class="docnav" aria-label="文档翻页">
${prev ? `        <a class="prev" href="./${prev.slug}.html"><span class="k">← 上一篇 · ${prev.sectionEn}</span><span class="t">${prev.plainTitle}</span></a>` : "        <span></span>"}
${next ? `        <a class="next" href="./${next.slug}.html"><span class="k">下一篇 · ${next.sectionEn} →</span><span class="t">${next.plainTitle}</span></a>` : "        <span></span>"}
      </nav>`;
};

const render = (doc) => {
  const hero = `  <div class="doc-hero">
    <div class="container">
      <nav class="crumb" aria-label="面包屑">
        <a href="../docs.html">文档</a><span class="sep">/</span><span>${doc.sectionEn}</span><span class="sep">/</span><span class="here">${doc.plainTitle}</span>
      </nav>
      <div class="doc-head">
        <div>
          <p class="eyebrow">${doc.eyebrow}</p>
          <h1>${doc.titleLead}<br><span class="grad">${doc.titleGrad}</span></h1>
          <p class="lead">${doc.lead}</p>
          <div class="docmeta">
            <span>更新 ${doc.updated}</span><span class="dot"></span>
            <span>约 ${doc.read}</span><span class="dot"></span>
            <span class="state">${doc.status}</span>
          </div>
        </div>
        <aside class="doc-facts" aria-label="页面要点">
${doc.facts.map((f) => `          <div><b>${f.b}</b><span>${f.s}</span></div>`).join("\n")}
        </aside>
      </div>
    </div>
  </div>`;

  const shell = `  <div class="container doc-shell">
    <aside class="doc-toc" aria-label="本页目录">
      <p class="toc-k">本页目录</p>
      <ol>
${tocList(doc)}
      </ol>
      <div class="toc-block">
        <p class="toc-k">文档索引</p>
        <a href="../docs.html"><b>全部 15 篇</b><span>DOCS / INDEX</span></a>
        <a href="../roadmap.html"><b>已知限制与规划</b><span>STATUS / 2026-11-13</span></a>
      </div>
    </aside>

    <article class="prose">
${mobileToc(doc)}

${doc.sections
  .map(
    (s) => `      <section id="${s.id}">
        <h2><span class="n">${s.num}</span>${s.title}</h2>
${s.html}
      </section>`
  )
  .join("\n\n")}

${docnav(doc)}

${related(doc)}

      <p class="doc-note"><b>口径</b>本页口径截至 ${doc.updated}，随代码与实测更新；涉及字段与接口时，以仓库中的实现为准。</p>
    </article>
  </div>`;

  return chrome(doc, `${hero}\n\n${shell}`);
};

mkdirSync(outDir, { recursive: true });
for (const doc of docs) {
  writeFileSync(join(outDir, `${doc.slug}.html`), render(doc), "utf8");
  console.log(`docs/${doc.slug}.html`);
}
console.log(`\n${docs.length} pages built.`);
