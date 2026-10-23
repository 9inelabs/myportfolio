(() => {
  const C = window.PORTFOLIO;
  const page = document.body.dataset.page;
  const root = document.documentElement;
  const app = document.getElementById("app");

  // ---------- helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // "Clean [interfaces.]" -> words, with bracketed ones in the soft grey
  const twoTone = (text, animate = false) => {
    let i = 0;
    return esc(text).replace(/\[([^\]]+)\]|([^\s\[\]]+)/g, (m, soft, plain) => {
      const words = (soft || plain).split(/\s+/).filter(Boolean);
      return words.map((w) => `<span class="w${soft ? " soft" : ""}"${animate ? ` style="--i:${i++}"` : ""}>${w}</span>`).join(" ");
    });
  };
  const waLink = () => `https://wa.me/${C.person.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(C.person.whatsappMessage)}`;
  const shotSrc = (p, name) => `assets/img/work/${p.slug}/${name}.webp`;
  const projectUrl = (p) => `project.html?p=${encodeURIComponent(p.slug)}`;
  const pVars = (t) =>
    `--pl-bg:${t.bg};--pl-ink:${t.ink};--pd-bg:${t.bgDark || t.bg};--pd-ink:${t.inkDark || t.ink};--p-accent:${t.accent}`;

  const I = {
    arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4.5A2.5 2.5 0 0 1 2 12.5v-8A2.5 2.5 0 0 1 4.5 2h8A2.5 2.5 0 0 1 15 4.5V5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.9 9.88M20.52 3.45A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.4"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>',
    handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>',
  };
  const SERVICE_ICONS = {
    layout: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M9 9v11"/>',
    devices: '<rect x="2" y="4" width="14" height="10" rx="1.8"/><path d="M1.5 17.5h11"/><rect x="16" y="8" width="6.5" height="12" rx="1.6"/><path d="M19 17.5h.5"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/><path d="m14 4-4 16"/>',
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 16v5M16.5 18.5h5"/>',
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="3.75"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8"/>',
    bag: '<path d="M5.5 8h13l1 12.5h-15Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L6 21"/>',
    play: '<rect x="2.5" y="4" width="19" height="16" rx="3"/><path d="m10 9 5 3-5 3Z"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  };
  const TINTS = ["t-lime", "t-lilac", "t-sky", "t-peach"];
  const toolMark = (name) => {
    const t = C.tools.icons[name];
    if (!t) return "";
    return `<i class="tool__mark" style="--m:url('../icons/${t.icon}.svg')${t.color ? `;--c:${t.color}` : ""}" aria-hidden="true"></i>`;
  };

  const gmark = (cls = "gmark") => (C.person.companyMark ? `<svg class="${cls}" viewBox="-20 -20 1640 1640" aria-hidden="true"><use href="${esc(C.person.companyMark)}"/></svg>` : "");
  const companyLink = (inner = esc(C.person.company)) => `<a class="co-link" href="${esc(C.person.companyUrl)}" target="_blank" rel="noopener">${gmark()}${inner}</a>`;

  // ---------- shared chrome ----------
  const socialLinks = () => {
    const items = [
      ...C.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`),
      `<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a>`,
      companyLink(),
    ];
    return `<nav class="links" aria-label="Elsewhere">${items.join('<span class="sep" aria-hidden="true">/</span>')}</nav>`;
  };
  const themeBtn = `<button class="pill theme-toggle" type="button" data-theme-toggle aria-label="Switch between light and dark theme">${I.sun}${I.moon}</button>`;
  const topbar = (left) => `<header class="topbar">
      <div class="topbar__left">${left}</div>
      <div class="topbar__right">${socialLinks()}${themeBtn}</div>
    </header>`;
  const emailBar = () => `<span class="topbar__email">${esc(C.person.email)}</span>
      <button class="pill" type="button" data-copy="${esc(C.person.email)}">${I.copy}<span>Copy<span class="only-sm"> email</span></span></button>
      ${C.person.cv ? `<a class="pill" href="${esc(C.person.cv)}" target="_blank" rel="noopener">CV</a>` : ""}`;
  const footer = () => `<footer class="footer">
      <span>© ${new Date().getFullYear()} ${esc(C.person.name)}. Designed and built by me.</span>
      <div class="footer__right">${socialLinks()}<a class="to-top-link" href="#top" data-to-top>${I.up}Back to top</a></div>
    </footer>
    <button class="to-top" type="button" data-to-top aria-label="Back to top">${I.up}</button>`;

  // device mockups
  const phone = (src, alt = "", lazy = true) =>
    `<div class="phone"><img src="${src}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} decoding="async"></div>`;
  const browser = (src, alt = "", host = "", lazy = true) =>
    `<div class="browser"><div class="browser__bar"><i></i><i></i><i></i><b>${esc(host)}</b></div><img src="${src}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} decoding="async"></div>`;
  const hostOf = (p) => { if (p.site) return p.site; try { return new URL(p.links[0].url).host.replace(/^www\./, ""); } catch { return ""; } };
  const coverStack = (p, lazy = true) => {
    const names = p.cover;
    if (p.device === "logo") {
      return `<div class="logo-stage"><span class="logo-stage__tile"><img src="${esc(p.logo)}" alt="${esc(p.client || p.title)} logo"${lazy ? ' loading="lazy"' : ""}></span></div>`;
    }
    if (p.device === "browser") {
      return `<div class="web-stack stack${names[1] ? "" : " web-stack--solo"}">${browser(shotSrc(p, names[0]), `${p.title} home page`, hostOf(p), lazy)}${names[1] ? phone(shotSrc(p, names[1]), `${p.title} on mobile`, lazy) : ""}</div>`;
    }
    return `<div class="stack">${names.map((n) => phone(shotSrc(p, n), `${p.title} screen`, lazy)).join("")}</div>`;
  };

  // compact card visual: a browser preview that scrolls through the full page on hover
  const miniVisual = (p) => {
    if (p.device === "logo") return coverStack(p);
    return `<div class="browser browser--scroll"><div class="browser__bar"><i></i><i></i><i></i><b>${esc(hostOf(p) || p.title)}</b></div><div class="browser__view"><img src="${shotSrc(p, p.cover[0])}" alt="${esc(p.title)} preview" loading="lazy" decoding="async"></div></div>`;
  };

  // ---------- graphic design & motion (home) ----------
  const graphicsSection = () => {
    const G = C.graphics;
    if (!G || !G.items.length) return "";
    const types = [...new Set(G.items.map((g) => g.type))];
    return `<section class="panel" id="graphics" aria-labelledby="graphics-title">
      <div class="inner">
        <div class="head head--row">
          <div class="head" data-reveal>
            <span class="eyebrow">Graphic design</span>
            <h2 class="display h2" id="graphics-title">${twoTone(G.heading)}</h2>
            <p class="lede">${esc(G.text)}</p>
          </div>
          <div class="head-actions" data-reveal>
            <div class="filters" role="group" aria-label="Filter designs">
              <button type="button" data-gfilter="all" aria-pressed="true">All<span class="count">${G.items.length}</span></button>
              ${types.map((t) => `<button type="button" data-gfilter="${esc(t)}" aria-pressed="false">${esc(t)}<span class="count">${G.items.filter((g) => g.type === t).length}</span></button>`).join("")}
            </div>
            ${G.more ? `<a class="btn btn--ghost btn--sm" href="${esc(G.more.url)}" target="_blank" rel="noopener">${esc(G.more.label)} ${I.arrow}</a>` : ""}
          </div>
        </div>
        <div class="masonry">
          ${G.items.map((g, i) => `<button type="button" class="design" data-design="${i}" data-type="${esc(g.type)}" data-reveal style="--d:${i % 4}">
            <img src="assets/img/graphics/${esc(g.file)}.webp" alt="${esc(g.title)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">
            <span class="design__cap"><b>${esc(g.title)}</b><span>${esc(g.type)}</span></span>
          </button>`).join("")}
        </div>
      </div>
    </section>`;
  };

  const motionSection = () => {
    const M = C.motion;
    if (!M || !(M.videos.length || M.shorts.length)) return "";
    const card = (v, kind, i) => `<button type="button" class="reel reel--${kind}" data-reel="${kind}:${i}" data-reveal style="--d:${i % 4}">
        <span class="reel__thumb"><img src="assets/img/motion/${esc(v.id)}.webp" alt="" loading="lazy" decoding="async"><span class="reel__play" aria-hidden="true">${I.play}</span></span>
        <span class="reel__title">${esc(v.title)}</span>
      </button>`;
    return `<section class="panel panel--cinema" id="motion" aria-labelledby="motion-title">
      <div class="inner">
        <div class="head head--row">
          <div class="head" data-reveal>
            <span class="eyebrow">Motion</span>
            <h2 class="display h2" id="motion-title">${twoTone(M.heading)}</h2>
            <p class="lede">${esc(M.text)}</p>
          </div>
          ${M.more ? `<a class="btn btn--sm reel-more" href="${esc(M.more.url)}" target="_blank" rel="noopener" data-reveal>${esc(M.more.label)} ${I.arrow}</a>` : ""}
        </div>
        ${M.videos.length ? `<div class="reel-grid">${M.videos.map((v, i) => card(v, "video", i)).join("")}</div>` : ""}
        ${M.shorts.length ? `<h3 class="reel-sub" data-reveal>Shorts</h3><div class="reel-row">${M.shorts.map((v, i) => card(v, "short", i)).join("")}</div>` : ""}
      </div>
    </section>`;
  };

  function wireMedia() {
    const view = mediaViewer();
    const G = C.graphics, M = C.motion;
    const designs = [...app.querySelectorAll("[data-design]")];
    designs.forEach((b) => b.addEventListener("click", () => {
      const shown = designs.filter((d) => !d.hidden);
      view(shown.map((d) => { const g = G.items[+d.dataset.design]; return { src: `assets/img/graphics/${g.file}.webp`, cap: g.title }; }), shown.indexOf(b), b);
    }));
    app.querySelectorAll("[data-gfilter]").forEach((b) => b.addEventListener("click", () => {
      const f = b.dataset.gfilter;
      app.querySelectorAll("[data-gfilter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      designs.forEach((d) => (d.hidden = !(f === "all" || d.dataset.type === f)));
    }));
    if (!M) return;
    const reels = { video: M.videos.map((v) => ({ yt: v.id, cap: v.title, ratio: v.ratio || "16 / 9" })), short: M.shorts.map((v) => ({ yt: v.id, cap: v.title, ratio: "9 / 16" })) };
    app.querySelectorAll("[data-reel]").forEach((b) => b.addEventListener("click", () => {
      const [kind, i] = b.dataset.reel.split(":");
      view(reels[kind], +i, b);
    }));
  }

  // ---------- home ----------
  function renderHome() {
    const P = C.person;
    const featured = C.projects.filter((p) => !p.group);
    const more = C.projects.filter((p) => p.group === "gabeweb");
    const counts = {
      all: C.projects.length,
      design: C.projects.filter((p) => /design/i.test(p.category)).length,
      dev: C.projects.filter((p) => /development/i.test(p.category)).length,
    };
    const logos = C.clients
      .map((c) => {
        const inner = `${c.logo ? `<img src="${esc(c.logo)}" alt="${c.showName ? "" : esc(c.name)}" style="--lh:${c.height || 30}px" loading="lazy">` : ""}${c.showName || !c.logo ? `<span>${esc(c.name)}</span>` : ""}`;
        return c.url ? `<a class="logo" href="${esc(c.url)}" target="_blank" rel="noopener" aria-label="${esc(c.name)}">${inner}</a>` : `<span class="logo">${inner}</span>`;
      })
      .join("");

    app.innerHTML = `
      <section class="panel" id="top" aria-label="Introduction">
        ${topbar(emailBar())}
        <div class="hero">
          <div class="avatar"><img src="${esc(P.avatar)}" alt="Portrait of ${esc(P.name)}" width="108" height="108"><span class="avatar__tag">${esc(P.name)} 👋</span></div>
          <p class="role">${esc(P.title)} at ${companyLink()}</p>
          <h1 class="display h1">${twoTone(C.hero.headline, true)}</h1>
          <div class="hero__ctas">
            <a class="btn" href="${esc(C.hero.primaryCta.href)}">${esc(C.hero.primaryCta.label)} ${I.arrow}</a>
            <a class="btn btn--ghost" href="${esc(C.hero.secondaryCta.href)}">${esc(C.hero.secondaryCta.label)}</a>
          </div>
        </div>
      </section>

      <section class="panel panel--light clients" aria-label="Clients">
        <p class="clients__label">Brands I've designed and built for</p>
        <div class="marquee"><div class="marquee__track">
          <div class="marquee__group">${logos}</div><div class="marquee__group" aria-hidden="true">${logos}</div>
        </div></div>
      </section>

      <section class="panel" id="work" aria-labelledby="work-title">
        <div class="inner">
          <div class="head head--row">
            <div class="head" data-reveal>
              <span class="eyebrow">Selected work</span>
              <h2 class="display h2" id="work-title">${twoTone("Products I've [designed and built.]")}</h2>
            </div>
            <div class="filters" role="group" aria-label="Filter projects" data-reveal>
              <button type="button" data-filter="all" aria-pressed="true">All<span class="count">${counts.all}</span></button>
              <button type="button" data-filter="design" aria-pressed="false">Design<span class="count">${counts.design}</span></button>
              <button type="button" data-filter="dev" aria-pressed="false">Development<span class="count">${counts.dev}</span></button>
            </div>
          </div>
          <div class="work-grid">
            ${featured
              .map(
                (p, i) => `<a class="work-card" href="${projectUrl(p)}" data-p style="${pVars(p.theme)};--d:${i % 2}" data-cat="${esc(p.category)}" data-reveal>
                  <div class="work-card__visual"><div class="work-card__glow"></div>${coverStack(p)}<span class="work-card__cta" aria-hidden="true">${I.arrow}</span></div>
                  <div class="work-card__body">
                    <div class="work-card__title"><h3 class="display h3">${esc(p.title)}</h3><span class="year">${esc(p.year)}</span></div>
                    <p class="work-card__summary">${esc(p.summary)}</p>
                    <div class="work-card__tags"><span class="tag">${esc(p.category)}</span>${p.platform.slice(0, 2).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
                  </div>
                </a>`
              )
              .join("")}
          </div>
        </div>
      </section>

      ${more.length ? `<section class="panel panel--light" id="gabeweb" aria-labelledby="gabeweb-title">
        <div class="inner">
          <div class="head head--row">
            <div class="head" data-reveal>
              <span class="eyebrow eyebrow--mark">${gmark()}More work at ${esc(P.company)}</span>
              <h2 class="display h2" id="gabeweb-title">${twoTone("Built with [the Gabeweb team.]")}</h2>
            </div>
            <p class="lede" data-reveal style="max-width:42ch">Websites, hotel software and event systems I've worked on at ${companyLink()}, each designed in Figma, approved by the client, then built and launched.</p>
          </div>
          <div class="mini-grid">
            ${more.map((p, i) => `<a class="mini-card" href="${projectUrl(p)}" data-p style="${pVars(p.theme)};--d:${i % 4}" data-cat="${esc(p.category)}" data-reveal>
              <div class="mini-card__visual">${miniVisual(p)}</div>
              <div class="mini-card__body">
                <span class="mini-card__client">${esc(p.client || p.platform[0])}</span>
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.summary)}</p>
                <span class="mini-card__foot"><span class="tag">${esc(p.platform[0])}</span><span class="mini-card__go" aria-hidden="true">${I.arrow}</span></span>
              </div>
            </a>`).join("")}
          </div>
        </div>
      </section>` : ""}

      ${graphicsSection()}
      ${motionSection()}

      <section class="panel panel--light" id="services" aria-labelledby="services-title">
        <div class="inner">
          <div class="head head--center" data-reveal>
            <h2 class="display h2" id="services-title" style="font-size:clamp(28px,3.6vw,46px)">${twoTone(C.services.heading)}</h2>
          </div>
          <div class="divider" aria-hidden="true"><span>Services</span></div>
          <div class="services">
            ${C.services.items
              .map(
                (s, i) => `<article class="service ${TINTS[i % 4]}" data-reveal style="--d:${i % 4}">
                  <span class="service__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SERVICE_ICONS[s.icon] || ""}</svg></span>
                  <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
                </article>`
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="panel" id="about" aria-labelledby="about-title">
        <div class="inner about">
          <div class="about__photo" data-reveal>
            <img src="${esc(P.portrait)}" alt="${esc(P.name)}" loading="lazy">
            <span class="about__badge"><i>${gmark()}</i><span>${esc(P.title.replace(" / ", " & "))}<br>at ${esc(P.company)}</span></span>
          </div>
          <div class="about__text">
            <span class="eyebrow" data-reveal>About</span>
            <h2 class="display h2" id="about-title" data-reveal>${twoTone(C.about.heading)}</h2>
            ${C.about.bio.map((b) => `<p data-reveal>${esc(b)}</p>`).join("")}
            <div class="stats">
              ${C.about.stats.map((s, i) => `<div class="stat" data-reveal style="--d:${i}"><b data-count="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="panel panel--light" id="tools" aria-labelledby="tools-title">
        <div class="inner">
          <div class="head" data-reveal>
            <span class="eyebrow">Tools &amp; stack</span>
            <h2 class="display h2" id="tools-title">${twoTone(C.tools.heading)}</h2>
          </div>
          <div class="tools">
            ${C.tools.groups
              .map(
                (g) => `<div class="tools__group" data-reveal><h3>${esc(g.label)}</h3>
                  <div class="tool-list">${g.items.map((t) => `<span class="tool">${toolMark(t)}${esc(t)}</span>`).join("")}</div></div>`
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="panel" id="process" aria-labelledby="process-title">
        <div class="inner">
          <div class="head" data-reveal>
            <span class="eyebrow">Process</span>
            <h2 class="display h2" id="process-title">${twoTone(C.process.heading)}</h2>
          </div>
          <ol class="process" style="list-style:none;padding:0">
            ${C.process.steps
              .map(
                (s, i) => `<li class="step ${TINTS[i % 4]}" data-reveal style="--d:${i}">
                  <span class="step__n">${String(i + 1).padStart(2, "0")}</span>
                  <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`
              )
              .join("")}
          </ol>
        </div>
      </section>

      <section class="panel panel--light" id="contact" aria-labelledby="contact-title">
        <div class="contact" data-reveal>
          <span class="contact__icon" aria-hidden="true">${I.handshake}</span>
          <h2 class="display h2" id="contact-title">${twoTone(C.contact.heading)}</h2>
          <p class="lede">${esc(C.contact.text)}</p>
          <div class="contact__ctas">
            <a class="btn" href="mailto:${esc(P.email)}">${I.mail}Email me</a>
            <a class="btn btn--ghost" href="${waLink()}" target="_blank" rel="noopener">${I.whatsapp}WhatsApp</a>
          </div>
          <p class="contact__mail"><b>${esc(P.email)}</b><button class="pill" type="button" data-copy="${esc(P.email)}">${I.copy}Copy</button></p>
        </div>
        ${footer()}
      </section>`;

    // work filters
    wireMedia();
    const cards = [...app.querySelectorAll(".work-card, .mini-card")];
    app.querySelectorAll("[data-filter]").forEach((b) =>
      b.addEventListener("click", () => {
        const f = b.dataset.filter;
        app.querySelectorAll("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        cards.forEach((c) => {
          const cat = c.dataset.cat;
          c.hidden = !(f === "all" || (f === "design" && /design/i.test(cat)) || (f === "dev" && /development/i.test(cat)));
        });
      })
    );
  }

  // ---------- case study ----------
  function renderProject() {
    const slug = new URLSearchParams(location.search).get("p");
    const idx = Math.max(0, C.projects.findIndex((p) => p.slug === slug));
    const p = C.projects[idx];
    const next = C.projects[(idx + 1) % C.projects.length];
    document.title = `${p.title} · ${C.person.name}`;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", p.summary);
    const canon = document.createElement("link");
    canon.rel = "canonical"; canon.href = `${C.site.url}/project.html?p=${encodeURIComponent(p.slug)}`;
    document.head.appendChild(canon);
    document.body.setAttribute("data-p", "");
    document.body.setAttribute("style", pVars(p.theme));

    const shots = p.screens.map(([file, cap, kind]) => ({ src: shotSrc(p, file), cap, mobile: kind ? kind === "phone" : p.device !== "browser" || file.startsWith("mobile-") }));
    const desk = shots.filter((s) => !s.mobile), mob = shots.filter((s) => s.mobile);
    const groups = p.device === "phone" ? [mob, desk] : [desk, mob];
    const section = (title, body) => (body ? `<div class="case-body"><h2 class="display h3" data-reveal>${title}</h2><div class="prose">${body}</div></div>` : "");
    const shotHTML = (s) => `<button class="shot" type="button" data-shot="${shots.indexOf(s)}">${s.mobile ? phone(s.src, s.cap) : browser(s.src, s.cap, hostOf(p))}<span class="cap">${esc(s.cap)}</span></button>`;
    const galleryHTML = groups.filter((g) => g.length).map((g, i) => `<div class="gallery${g === desk ? ` gallery--web${g.length === 1 ? " gallery--single" : ""}` : ""}${i ? " gallery__sub" : ""}">${g.map(shotHTML).join("")}</div>`).join("");
    const decision = (d) => {
      const m = d.match(/^([^:]{3,32}):\s(.+)$/);
      return `<li data-reveal>${m ? `<b>${esc(m[1])}.</b> ${esc(m[2][0].toUpperCase() + m[2].slice(1))}` : esc(d)}</li>`;
    };

    app.innerHTML = `
      <section class="panel case-hero" id="top" aria-label="${esc(p.title)} overview">
        ${topbar(`<a class="pill back-link" href="index.html#work">${I.left}All work</a>`)}
        <div class="case-hero__grid">
          <div class="case-hero__text">
            <span class="eyebrow">${p.group === "gabeweb" ? `${gmark()}Built at ${esc(C.person.company)}` : "Case study"}${p.year ? ` · ${esc(p.year)}` : ""}</span>
            <h1 class="display h1">${esc(p.title)}</h1>
            <p class="lede">${esc(p.summary)}</p>
            <dl class="case-meta">
              <div><dt>Role</dt><dd>${p.roles.map(esc).join(", ")}</dd></div>
              <div><dt>Platform</dt><dd>${p.platform.map(esc).join(", ")}</dd></div>
              ${p.client ? `<div><dt>Client</dt><dd>${esc(p.client)}</dd></div>` : `<div><dt>Scope</dt><dd>${esc(p.category)}</dd></div>`}
            </dl>
            ${p.links.length ? `<div class="case-hero__ctas">${p.links.map((l, i) => `<a class="btn${i ? " btn--soft" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${I.arrow}</a>`).join("")}</div>` : ""}
          </div>
          <div class="case-hero__visual">${coverStack(p, false)}</div>
        </div>
      </section>

      <section class="panel panel--light" aria-label="The story">
        <div class="inner">
          ${section("The problem", p.problem ? `<p data-reveal>${esc(p.problem)}</p>` : "")}
          ${section(p.group ? "What was built" : "What I did", `${p.approach ? `<p data-reveal>${esc(p.approach)}</p>` : ""}${p.decisions && p.decisions.length ? `<p data-reveal>${p.group ? "Highlights:" : "Key decisions:"}</p><ol class="decisions">${p.decisions.map(decision).join("")}</ol>` : ""}`)}
          ${section("Results", p.results ? `<div class="result" data-reveal>${I.check}<p>${esc(p.results)}</p></div>` : "")}
          ${section("Tools &amp; tech", p.stack && p.stack.length ? `<div class="chips" data-reveal>${p.stack.map((t) => `<span>${toolMark(t)}${esc(t)}</span>`).join("")}</div>` : "")}
        </div>
      </section>

      ${shots.length ? `<section class="panel" aria-labelledby="screens-title">
        <div class="inner">
          <div class="head head--row">
            <div class="head" data-reveal>
              <span class="eyebrow">${shots.length} ${shots.length === 1 ? "screen" : "screens"}</span>
              <h2 class="display h2" id="screens-title">${twoTone("A closer [look.]")}</h2>
            </div>
            <p class="lede" data-reveal style="max-width:34ch">Tap any screen to see it full size.</p>
          </div>
          ${galleryHTML}
        </div>
      </section>` : ""}

      <a class="next-case" href="${projectUrl(next)}" data-p style="${pVars(next.theme)}" data-reveal>
        <div style="display:grid;gap:10px"><span class="eyebrow">Next case study</span><span class="display h2">${esc(next.title)}</span><span style="opacity:.8;max-width:60ch">${esc(next.summary)}</span></div>
        <span class="arrow-btn" aria-hidden="true">${I.right}</span>
      </a>

      <section class="panel panel--light" aria-label="Contact">
        <div class="contact" data-reveal style="padding-block:clamp(44px,6vw,80px)">
          <h2 class="display h2">${twoTone(C.contact.heading)}</h2>
          <div class="contact__ctas">
            <a class="btn" href="mailto:${esc(C.person.email)}">${I.mail}Email me</a>
            <a class="btn btn--ghost" href="${waLink()}" target="_blank" rel="noopener">${I.whatsapp}WhatsApp</a>
          </div>
        </div>
        ${footer()}
      </section>
    `;

    const view = mediaViewer();
    const items = shots.map((s) => ({ src: s.src, cap: s.cap, cls: s.mobile ? "is-phone" : "" }));
    app.querySelectorAll("[data-shot]").forEach((b) => b.addEventListener("click", () => view(items, +b.dataset.shot, b)));
  }

  // ---------- full-size viewer for screens, designs and videos ----------
  // items: { src, cap, cls } for an image, or { yt, cap, ratio } for a YouTube video
  let viewer = null;
  function mediaViewer() {
    if (viewer) return viewer;
    const lb = document.createElement("div");
    lb.className = "lightbox"; lb.hidden = true;
    lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Viewer");
    lb.innerHTML = `<div class="lightbox__bar"><span data-lb-cap></span>
        <div class="lightbox__btns">
          <button type="button" data-lb="prev" aria-label="Previous">${I.left}</button>
          <button type="button" data-lb="next" aria-label="Next">${I.right}</button>
          <button type="button" data-lb="close" aria-label="Close">${I.close}</button>
        </div></div>
      <div class="lightbox__stage" data-lb-stage></div>`;
    document.body.appendChild(lb);
    const cap = lb.querySelector("[data-lb-cap]"), stage = lb.querySelector("[data-lb-stage]");
    let list = [], cur = 0, opener = null;
    const show = (i) => {
      cur = (i + list.length) % list.length;
      const it = list[cur];
      stage.innerHTML = it.yt
        ? `<div class="lightbox__video" style="--ratio:${it.ratio || "16 / 9"}"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(it.yt)}?autoplay=1&rel=0&playsinline=1" title="${esc(it.cap)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
        : `<img src="${it.src}" alt="${esc(it.cap)}" class="${it.cls || ""}">`;
      cap.textContent = `${cur + 1} / ${list.length} · ${it.cap}`;
      lb.querySelectorAll('[data-lb="prev"], [data-lb="next"]').forEach((b) => (b.hidden = list.length < 2));
      stage.scrollTop = 0;
    };
    const close = () => {
      lb.classList.remove("open"); document.body.style.overflow = "";
      setTimeout(() => { lb.hidden = true; stage.innerHTML = ""; }, 300);
      if (opener) opener.focus();
    };
    lb.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lb]");
      if (b) { b.dataset.lb === "close" ? close() : show(cur + (b.dataset.lb === "next" ? 1 : -1)); return; }
      if (e.target === stage) close();
    });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && list.length > 1) show(cur + 1);
      if (e.key === "ArrowLeft" && list.length > 1) show(cur - 1);
    });
    viewer = (items, i, el) => {
      list = items; opener = el; show(i);
      lb.hidden = false; requestAnimationFrame(() => lb.classList.add("open"));
      document.body.style.overflow = "hidden"; lb.querySelector('[data-lb="close"]').focus();
    };
    return viewer;
  }

  // ---------- behaviour shared by both pages ----------
  function wire() {
    // copy email
    let tt;
    const toast = document.createElement("div");
    toast.className = "toast"; toast.setAttribute("role", "status");
    document.body.appendChild(toast);
    const say = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2200); };
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (b) {
        try { await navigator.clipboard.writeText(b.dataset.copy); say("Email copied"); }
        catch { say(b.dataset.copy); }
      }
      if (e.target.closest("[data-theme-toggle]")) {
        const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
        root.dataset.theme = dark ? "light" : "dark";
        try { localStorage.setItem("theme", root.dataset.theme); } catch {}
      }
    });

    // back to top: shows from the work section onward (on case studies, once past the hero)
    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-to-top]")) return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    const topBtn = document.querySelector(".to-top");
    const from = document.getElementById("work") || document.querySelector("#app > .panel + *");
    if (topBtn && from) {
      let ticking = false;
      const update = () => {
        ticking = false;
        topBtn.classList.toggle("show", from.getBoundingClientRect().top < innerHeight * 0.6);
      };
      addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      addEventListener("resize", update);
      update();
    }

    // reveal on scroll
    const els = [...document.querySelectorAll("[data-reveal], .contact")];
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  function analytics() {
    const id = C.site.gaId;
    if (!id) return;
    const s = document.createElement("script");
    s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", id);
  }

  if (page === "project") renderProject(); else renderHome();
  wire();
  analytics();
})();
