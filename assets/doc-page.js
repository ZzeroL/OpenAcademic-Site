(function () {
  var body = document.body;
  if (!body) return;
  var root = body.getAttribute("data-root") || "..";

  function h(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // Shared masthead
  var masthead = h(
    '<header class="masthead">' +
      '<div class="mast-inner">' +
      '<a class="brand" href="' + root + '/index.html" aria-label="OpenAcademic 首页">' +
      '<span class="brand-mark">OA</span>' +
      '<span class="brand-text"><span class="brand-name">OpenAcademic</span>' +
      '<span class="brand-sub">Research Production Line</span></span></a>' +
      '<nav class="mast-nav" aria-label="页面导航">' +
      '<a href="' + root + '/index.html">首页</a>' +
      '<a href="' + root + '/docs.html" aria-current="page">文档</a>' +
      '<a href="' + root + '/roadmap.html">路线图</a>' +
      '<a href="' + root + '/source.html">源码</a>' +
      "</nav>" +
      '<a class="mast-cta" href="https://github.com/ZzeroL/OpenAcademic" target="_blank" rel="noopener">GitHub <span class="arr" aria-hidden="true">↗</span></a>' +
      "</div></header>"
  );
  var skip = body.querySelector(".skip");
  if (skip && skip.nextSibling) body.insertBefore(masthead, skip.nextSibling);
  else body.insertBefore(masthead, body.firstChild);

  // Shared footer
  var foot = h(
    '<footer class="foot">' +
      '<div class="container"><div class="foot-inner"><div>' +
      '<div class="foot-brand"><span class="mark">OA</span>OpenAcademic</div>' +
      '<p class="foot-tag">可核对的研究生产线 · Apache-2.0</p></div>' +
      '<nav class="foot-nav" aria-label="页脚导航">' +
      '<a href="' + root + '/index.html">首页</a>' +
      '<a href="' + root + '/docs.html">文档</a>' +
      '<a href="' + root + '/roadmap.html">路线图</a>' +
      '<a href="' + root + '/source.html">源码</a>' +
      '<a href="https://github.com/ZzeroL/OpenAcademic" target="_blank" rel="noopener">GitHub</a>' +
      "</nav></div>" +
      '<div class="foot-meta"><span>Apache License 2.0 · OpenAcademic contributors</span>' +
      "<span>OpenAcademic · 产品文档 · 2026</span></div></div></footer>"
  );
  var main = body.querySelector("main");
  if (main && main.nextSibling) body.insertBefore(foot, main.nextSibling);
  else body.appendChild(foot);

  // TOC from section headings
  var article = body.querySelector(".prose");
  if (!article) return;
  var sections = Array.prototype.slice.call(article.querySelectorAll("section[id]"));
  var tocList = body.querySelector("[data-doc-toc] ol");
  var mobileToc = null;
  if (sections.length) {
    var items = sections
      .map(function (section) {
        var h2 = section.querySelector("h2");
        if (!h2) return "";
        var numEl = h2.querySelector(".n");
        var num = numEl ? numEl.textContent.trim() : "";
        var label = "";
        Array.prototype.forEach.call(h2.childNodes, function (node) {
          if (node === numEl) return;
          label += node.textContent;
        });
        return (
          '<li><a href="#' + section.id + '"><span class="i">' + num + "</span><span>" + label.trim() + "</span></a></li>"
        );
      })
      .join("");

    if (tocList) tocList.innerHTML = items;

    mobileToc = h(
      '<details class="toc-mobile"><summary>本页目录 · ' +
        sections.length +
        ' 节</summary><ol>' +
        items +
        "</ol></details>"
    );
    var first = article.querySelector("section");
    if (first) article.insertBefore(mobileToc, first);
  }

  // Highlight the current section in the sidebar TOC
  if (tocList && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(tocList.querySelectorAll("a"));
    var map = {};
    links.forEach(function (a) {
      map[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.remove("on");
          });
          var link = map[entry.target.id];
          if (link) link.classList.add("on");
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      io.observe(section);
    });
  }
})();
