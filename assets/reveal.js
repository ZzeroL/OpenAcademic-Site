(function () {
  document.documentElement.classList.add("js");
  var nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  window.__oaReveal = true;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach(function (node) { node.classList.add("is-in"); });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(function (node) { node.classList.add("is-in"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  nodes.forEach(function (node) { observer.observe(node); });
})();
