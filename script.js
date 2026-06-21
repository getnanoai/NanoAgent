/* ============================================================
   NanoAgent landing — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- current year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- copy-to-clipboard ---- */
  function flash(btn) {
    var prev = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("is-copied");
    setTimeout(function () {
      btn.textContent = prev;
      btn.classList.remove("is-copied");
    }, 1600);
  }
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(btn); }).catch(function () { fallback(text, btn); });
      } else {
        fallback(text, btn);
      }
    });
  });
  function fallback(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flash(btn); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---- surface tabs ---- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === key);
      });
    });
  });

  /* ---- install selector tabs ---- */
  var itabs = document.querySelectorAll(".itab");
  var ipanels = document.querySelectorAll(".ipanel");
  var visualImg = document.querySelector(".visual__img");
  var visualBar = document.querySelector(".visual__bar");
  // ponytail: desktop falls through to nano.gif, no image for it
  var tabImg = { cli: "assets/cli.png", vscode: "assets/vscode.png", vs: "assets/vs.png", desktop: "assets/desktop.png" };
  itabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-itab");
      itabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      ipanels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-ipanel") === key);
      });
      if (visualImg && tabImg[key]) visualImg.src = tabImg[key];
      if (visualBar) visualBar.style.display = key === "cli" ? "" : "none";
    });
  });

  /* ---- CLI package-manager sub tabs ---- */
  var csubs = document.querySelectorAll(".csub__tab");
  csubs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var panel = tab.closest(".ipanel");
      if (!panel) return;
      var key = tab.getAttribute("data-csub");
      panel.querySelectorAll(".csub__tab").forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panel.querySelectorAll(".csub__panel").forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-csubpanel") === key);
      });
    });
  });

  /* ---- quickstart code tabs ---- */
  var codetabs = document.querySelectorAll(".codetab");
  codetabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var box = tab.closest(".codebox");
      if (!box) return;
      var key = tab.getAttribute("data-code");
      box.querySelectorAll(".codetab").forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
      });
      box.querySelectorAll(".codeblock").forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-code") === key);
      });
    });
  });

  /* ---- reveal on scroll ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".section, .stripband");
    targets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- feature category scrollspy ---- */
  var featLinks = document.querySelectorAll(".featnav a");
  if (featLinks.length && "IntersectionObserver" in window) {
    var featMap = {};
    featLinks.forEach(function (a) {
      featMap[a.getAttribute("href").slice(1)] = a;
    });
    var featBar = document.querySelector(".featnav__inner");
    var setActive = function (id) {
      featLinks.forEach(function (l) { l.classList.remove("is-active"); });
      var link = featMap[id];
      if (link) {
        link.classList.add("is-active");
        /* keep the active chip in view by scrolling ONLY the horizontal
           bar — never the page (scrollIntoView would hijack vertical scroll). */
        if (featBar) {
          var barRect = featBar.getBoundingClientRect();
          var linkRect = link.getBoundingClientRect();
          var delta = (linkRect.left + linkRect.width / 2) - (barRect.left + barRect.width / 2);
          featBar.scrollLeft += delta;
        }
      }
    };
    var featSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-140px 0px -68% 0px", threshold: 0 });
    document.querySelectorAll(".featcat").forEach(function (s) { featSpy.observe(s); });
  }

  /* ---- docs: auto copy buttons on code blocks ---- */
  document.querySelectorAll(".doc-prose pre").forEach(function (pre) {
    if (pre.querySelector(".codeblock__copy")) return;
    var code = pre.querySelector("code");
    var text = (code ? code.textContent : pre.textContent) || "";
    if (!text.trim()) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "codeblock__copy";
    btn.textContent = "Copy";
    btn.setAttribute("data-copy", text);
    btn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(btn); }).catch(function () { fallback(text, btn); });
      } else {
        fallback(text, btn);
      }
    });
    pre.appendChild(btn);
  });

  /* ---- docs sidebar scrollspy ---- */
  var docLinks = document.querySelectorAll(".docs__nav a");
  if (docLinks.length && "IntersectionObserver" in window) {
    var docMap = {};
    docLinks.forEach(function (a) { docMap[a.getAttribute("href").slice(1)] = a; });
    var docBar = document.querySelector(".docs__sidebar");
    var setDocActive = function (id) {
      docLinks.forEach(function (l) { l.classList.remove("is-active"); });
      var link = docMap[id];
      if (!link) return;
      link.classList.add("is-active");
      /* keep the active item visible inside the scrollable sidebar only */
      if (docBar && docBar.scrollHeight > docBar.clientHeight) {
        var bRect = docBar.getBoundingClientRect();
        var lRect = link.getBoundingClientRect();
        if (lRect.top < bRect.top || lRect.bottom > bRect.bottom) {
          docBar.scrollTop += (lRect.top - bRect.top) - bRect.height / 2 + lRect.height / 2;
        }
      }
    };
    var docSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setDocActive(e.target.id);
      });
    }, { rootMargin: "-90px 0px -68% 0px", threshold: 0 });
    document.querySelectorAll(".doc-section").forEach(function (s) { docSpy.observe(s); });
  }

  /* ---- compact a count ---- */
  function compact(n) {
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
  }

  /* ---- live GitHub star count ---- */
  var starEl = document.querySelector("[data-stars]");
  if (starEl) {
    fetch("https://api.github.com/repos/rizwan3d/NanoAgent")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && typeof d.stargazers_count === "number") {
          starEl.textContent = compact(d.stargazers_count);
        }
      })
      .catch(function () { /* keep default label */ });
  }

  /* ---- live GitHub commit count ---- */
  /* The repo endpoint has no commit total; read the paginated commits
     endpoint and parse the "last" page number from the Link header. */
  var commitEl = document.querySelector("[data-commits]");
  if (commitEl) {
    fetch("https://api.github.com/repos/rizwan3d/NanoAgent/commits?per_page=1")
      .then(function (r) {
        if (!r.ok) return null;
        var link = r.headers.get("Link");
        if (link) {
          var m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
          if (m) return parseInt(m[1], 10);
        }
        return 1; /* single page → 1 commit */
      })
      .then(function (count) {
        if (typeof count === "number") {
          commitEl.textContent = compact(count) + " commits";
        }
      })
      .catch(function () { /* keep default label */ });
  }
})();
