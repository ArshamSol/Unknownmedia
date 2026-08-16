(function () {
  const S = window.SITE;
  const $main = document.getElementById("main");
  const $navlist = document.getElementById("navlist");
  const $listLabel = document.getElementById("listLabel");
  const $filters = document.getElementById("filters");
  const $railNav = document.getElementById("railNav");
  const $brand = document.getElementById("brand");
  const $menubtn = document.getElementById("menubtn");

  const VIEWS = [
    { id: "home", label: "Portfolio" },
    { id: "browsing", label: "Serendipitous Browsing" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];

  let activeTag = "all";
  let current = "home";

  $brand.textContent = S.brand;

  // ---- filters ----
  function buildFilters() {
    $filters.innerHTML = "";
    const mk = (id, label) => {
      const s = document.createElement("span");
      s.className = "filter";
      s.textContent = label;
      s.setAttribute("aria-pressed", id === activeTag);
      s.onclick = () => { activeTag = id; buildFilters(); buildWorkList(); if (current === "home") renderHome(); };
      return s;
    };
    $filters.appendChild(mk("all", "All"));
    S.tags.forEach(t => $filters.appendChild(mk(t, t)));
  }

  // ---- rail nav ----
  function buildRailNav() {
    $railNav.innerHTML = "";
    VIEWS.forEach(v => {
      const d = document.createElement("div");
      d.className = "navitem" + (current === v.id ? " active" : "");
      d.textContent = v.label;
      d.onclick = () => go(v.id);
      $railNav.appendChild(d);
    });
  }

  // ---- list column (work index) ----
  function visibleWork() {
    return S.work.filter(w => activeTag === "all" || (w.tags || []).includes(activeTag));
  }

  function buildWorkList() {
    const items = visibleWork();
    $listLabel.textContent = "Portfolio ⌗ " + items.length;
    $navlist.innerHTML = "";
    items.forEach((w, i) => {
      const d = document.createElement("div");
      d.className = "workitem" + (current === "work" && currentId === w.id ? " active" : "");
      d.innerHTML =
        '<span class="num">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="title">' + w.title + '</span>' +
        '<span class="yr">' + w.year + '</span>';
      d.onclick = () => go("work", w.id);
      $navlist.appendChild(d);
    });
  }

  // ---- views ----
  function renderHome() {
    document.body.classList.remove("fullproj", "infopage");
    const items = visibleWork();
    let html = '<div class="view-title">Portfolio</div><div class="grid">';
    items.forEach(w => {
      html +=
        '<a class="tile" data-id="' + w.id + '">' +
        '<div class="thumb"><span>Image</span></div>' +
        '<div class="cap"><span class="t">' + w.title + '</span><span class="y">' + w.year + '</span></div>' +
        '</a>';
    });
    html += "</div>";
    $main.innerHTML = html;
    $main.querySelectorAll(".tile").forEach(el => {
      el.onclick = () => go("work", el.dataset.id);
    });
  }

  function renderBrowsing() {
    document.body.classList.add("fullproj");
    document.body.classList.remove("infopage");
    $main.innerHTML =
      '<div class="closebar" id="closebar"><span>Close</span></div>' +
      '<div class="view-title">Serendipitous Browsing</div>' +
      '<div class="miro-embed"><iframe src="' + S.browsingEmbedUrl + '" ' +
      'frameborder="0" scrolling="no" allowfullscreen ' +
      'allow="fullscreen; clipboard-read; clipboard-write" ' +
      'referrerpolicy="no-referrer-when-downgrade"></iframe></div>';
    document.getElementById("closebar").onclick = () => go("home");
  }

  function renderAbout() {
    document.body.classList.add("infopage");
    document.body.classList.remove("fullproj");
    let html = '<div class="view-title">About</div><div class="about">';
    S.about.bio.forEach(p => { html += "<p>" + p + "</p>"; });
    html += '<div class="cv">';
    S.about.cv.forEach(sec => {
      html += "<div><h3>" + sec.heading + "</h3><ul>";
      sec.items.forEach(i => { html += "<li>" + i + "</li>"; });
      html += "</ul></div>";
    });
    html += "</div></div>";
    $main.innerHTML = html;
  }

  function renderContact() {
    document.body.classList.add("infopage");
    document.body.classList.remove("fullproj");
    let html = '<div class="view-title">Contact</div><div class="contact">';
    html += '<a class="big" href="mailto:' + S.contact.email + '">' + S.contact.email + "</a>";
    S.contact.links.forEach(l => {
      html += '<div class="row"><span class="mono">' + l.label + '</span><a href="' + l.url + '">' + l.url + "</a></div>";
    });
    html += "</div>";
    $main.innerHTML = html;
  }

  let currentId = null;

  function renderWork(id) {
    document.body.classList.add("fullproj");
    document.body.classList.remove("infopage");
    const items = visibleWork().length ? S.work : S.work;
    const idx = S.work.findIndex(w => w.id === id);
    const w = S.work[idx];
    if (!w) { go("home"); return; }

    const prev = S.work[idx - 1];
    const next = S.work[idx + 1];

    let html = '<div class="closebar" id="closebar"><span>Close</span></div>';
    html += '<div class="proj">';
    html += '<div class="eyebrow">' + w.year + '</div>';
    html += "<h1>" + w.title + "</h1>";
    html += '<div class="cols"><div class="body">';
    w.body.forEach(p => { html += "<p>" + p + "</p>"; });
    html += '</div><div class="meta">';
    html += '<div class="k">Role</div><div class="v">' + w.meta.role + '</div>';
    html += '<div class="k">Tools</div><div class="v">' + w.meta.tools + '</div>';
    if (w.tags && w.tags.length) {
      html += '<div class="k">Tags</div><div class="tags">';
      w.tags.forEach(t => { html += '<span class="tag">' + t + '</span>'; });
      html += '</div>';
    }
    html += '</div></div>';
    html += '<div class="gallery"><div class="shot"><span>Image</span></div><div class="shot"><span>Image</span></div></div>';
    html += '<div class="navbtns">';
    html += prev ? '<span data-id="' + prev.id + '">← ' + prev.title + '</span>' : '<span></span>';
    html += next ? '<span data-id="' + next.id + '">' + next.title + ' →</span>' : '<span></span>';
    html += '</div></div>';

    $main.innerHTML = html;
    currentId = id;
    document.getElementById("closebar").onclick = () => go("home");
    $main.querySelectorAll(".navbtns span[data-id]").forEach(el => {
      el.onclick = () => go("work", el.dataset.id);
    });
    buildWorkList();
  }

  function render() {
    buildRailNav();
    if (current === "work") renderWork(currentId);
    else if (current === "browsing") renderBrowsing();
    else if (current === "about") renderAbout();
    else if (current === "contact") renderContact();
    else renderHome();
    buildWorkList();
    document.body.classList.remove("navopen");
    window.scrollTo(0, 0);
  }

  function go(view, id) {
    current = view;
    currentId = id || null;
    const frag = view === "home" ? "" : (view === "work" ? "work-" + id : view);
    location.hash = frag;
    render();
  }

  function routeFromHash() {
    const h = location.hash.replace(/^#/, "");
    if (!h) { current = "home"; currentId = null; }
    else if (h.indexOf("work-") === 0) { current = "work"; currentId = h.slice(5); }
    else { current = h; currentId = null; }
    render();
  }

  window.addEventListener("hashchange", routeFromHash);

  $menubtn.onclick = () => document.body.classList.toggle("navopen");

  buildFilters();
  routeFromHash();
})();
