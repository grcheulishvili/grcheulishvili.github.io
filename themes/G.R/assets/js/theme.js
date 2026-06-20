/* G.R - interactions */
(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("G.R-theme", t); } catch (e) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("#theme-toggle");
    if (!t) return;
    var cur = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  });

  /* ---------- Code copy buttons ---------- */
  document.querySelectorAll(".highlight").forEach(function (block) {
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copy";
    btn.addEventListener("click", function () {
      var code = block.querySelector("code");
      var text = code ? code.innerText : block.innerText;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "copied ✓";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = "copy"; btn.classList.remove("copied"); }, 1600);
      });
    });
    block.appendChild(btn);
  });

  /* ---------- TOC scrollspy ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute("href").slice(1));
      var el = document.getElementById(id);
      if (el) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("toc-active"); });
          var a = map[en.target.id];
          if (a) a.classList.add("toc-active");
        }
      });
    }, { rootMargin: "-10% 0px -75% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Search (⌘K) ---------- */
  var overlay = document.getElementById("search-overlay");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var INDEX = null, ready = false, sel = -1;

  function loadIndex() {
    if (ready || !window.__SEARCH_URL__) return;
    ready = true;
    fetch(window.__SEARCH_URL__).then(function (r) { return r.json(); })
      .then(function (d) { INDEX = d; }).catch(function () { ready = false; });
  }
  function openSearch() {
    if (!overlay) return;
    loadIndex();
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    if (input) { input.value = ""; input.focus(); }
    render([]);
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    sel = -1;
  }
  function score(item, q) {
    var t = (item.title || "").toLowerCase(), s = (item.section || "").toLowerCase(),
        c = (item.content || "").toLowerCase(), tg = (item.tags || "").toLowerCase();
    var sc = 0;
    if (t.indexOf(q) === 0) sc += 100; else if (t.indexOf(q) > -1) sc += 50;
    if (tg.indexOf(q) > -1) sc += 30;
    if (s.indexOf(q) > -1) sc += 20;
    if (c.indexOf(q) > -1) sc += 8;
    return sc;
  }
  function query(q) {
    q = q.trim().toLowerCase();
    if (!q || !INDEX) return [];
    return INDEX.map(function (it) { return { it: it, sc: score(it, q) }; })
      .filter(function (x) { return x.sc > 0; })
      .sort(function (a, b) { return b.sc - a.sc; })
      .slice(0, 8).map(function (x) { return x.it; });
  }
  function render(items) {
    if (!results) return;
    sel = -1;
    if (!items.length) {
      var q = input && input.value.trim();
      results.innerHTML = '<div class="search-empty">' + (q ? "no results for '" + escapeHtml(q) + "'" : "type to search posts…") + "</div>";
      return;
    }
    results.innerHTML = items.map(function (it) {
      return '<a href="' + it.url + '">' +
        '<span class="sr-sec">' + escapeHtml(it.section || "page") + "</span>" +
        '<div class="sr-title">' + escapeHtml(it.title) + "</div>" +
        (it.description ? '<div class="sr-desc">' + escapeHtml(it.description) + "</div>" : "") +
        "</a>";
    }).join("");
  }
  function escapeHtml(s) { return (s || "").replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

  if (input) {
    input.addEventListener("input", function () { render(query(input.value)); });
  }
  function moveSel(d) {
    var links = results ? results.querySelectorAll("a") : [];
    if (!links.length) return;
    sel = (sel + d + links.length) % links.length;
    links.forEach(function (a, i) { a.classList.toggle("sel", i === sel); });
    links[sel].scrollIntoView({ block: "nearest" });
  }
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return; }
    if (e.key === "/" && document.activeElement === document.body) { e.preventDefault(); openSearch(); return; }
    if (!overlay || !overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeSearch();
    else if (e.key === "ArrowDown") { e.preventDefault(); moveSel(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSel(-1); }
    else if (e.key === "Enter") {
      var links = results.querySelectorAll("a");
      if (links[sel]) window.location = links[sel].href;
      else if (links[0]) window.location = links[0].href;
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("#search-open")) { e.preventDefault(); openSearch(); }
    else if (overlay && overlay.classList.contains("open") && !e.target.closest(".search-box")) closeSearch();
  });
})();
