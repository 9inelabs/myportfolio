/*
  Writes a plain-HTML copy of the portfolio content and structured data into
  index.html and sitemap.xml, so search engines can read the site without
  running JavaScript.

  Run after editing assets/js/content.js:
    node scripts/prerender.js
*/
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "assets/js/content.js"));
const C = window.PORTFOLIO;
const P = C.person;
const url = C.site.url.replace(/\/$/, "");
const plain = (s) => String(s || "").replace(/\[|\]/g, "");
const esc = (s) => plain(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const projectUrl = (p) => `project.html?p=${p.slug}`;

// ---------- structured data ----------
const person = {
  "@type": "Person",
  "@id": `${url}/#person`,
  name: P.name,
  givenName: P.firstName,
  familyName: P.name.split(" ").slice(1).join(" "),
  jobTitle: plain(P.title).replace(" / ", " and "),
  url: `${url}/`,
  image: `${url}/${P.portrait}`,
  email: `mailto:${P.email}`,
  worksFor: { "@type": "Organization", name: P.company, url: P.companyUrl },
  sameAs: C.socials.map((s) => s.url),
  knowsAbout: [...C.services.items.map((s) => s.title), ...C.tools.groups.flatMap((g) => g.items)],
};
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${url}/#website`, url: `${url}/`, name: P.name, publisher: { "@id": `${url}/#person` } },
    { "@type": "ProfilePage", "@id": `${url}/#profile`, url: `${url}/`, name: `${P.name} · ${plain(P.title)} at ${P.company}`, mainEntity: { "@id": `${url}/#person` } },
    person,
  ],
};

// ---------- crawlable copy (hidden once JavaScript renders the real page) ----------
const featured = C.projects.filter((p) => !p.group);
const more = C.projects.filter((p) => p.group);
const list = (ps) => ps.map((p) => `        <li><a href="${projectUrl(p)}">${esc(p.title)}</a>: ${esc(p.summary)}</li>`).join("\n");
const html = `<div class="prerender">
      <h1>${esc(P.name)}</h1>
      <p>${esc(P.title)} at <a href="${esc(P.companyUrl)}">${esc(P.company)}</a>. ${esc(C.hero.headline)}</p>
${C.about.bio.map((b) => `      <p>${esc(b)}</p>`).join("\n")}
      <h2>Selected work</h2>
      <ul>
${list(featured)}
      </ul>
      <h2>More work at ${esc(P.company)}</h2>
      <ul>
${list(more)}
      </ul>
      <h2>Services</h2>
      <p>${C.services.items.map((s) => esc(s.title)).join(", ")}.</p>
      <h2>Contact</h2>
      <p>Email <a href="mailto:${esc(P.email)}">${esc(P.email)}</a> or message on <a href="https://wa.me/${P.whatsapp.replace(/\D/g, "")}">WhatsApp</a>.</p>
    </div>`;

let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const swap = (src, start, end, body) => {
  const re = new RegExp(`(${start})[\\s\\S]*?(${end})`);
  if (!re.test(src)) throw new Error(`Markers ${start} … ${end} not found in index.html`);
  return src.replace(re, `$1\n${body}\n    $2`);
};
index = swap(index, "<!-- prerender:start -->", "<!-- prerender:end -->", `    ${html}`);
index = swap(index, "<!-- schema:start -->", "<!-- schema:end -->", `  <script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n  </script>`);
fs.writeFileSync(path.join(root, "index.html"), index);

// ---------- sitemap ----------
const today = new Date().toISOString().slice(0, 10);
const urls = [`${url}/`, ...C.projects.map((p) => `${url}/${projectUrl(p)}`)];
fs.writeFileSync(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u, i) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${i ? "0.7" : "1.0"}</priority></url>`)
    .join("\n")}\n</urlset>\n`
);
console.log(`index.html and sitemap.xml updated (${urls.length} URLs)`);
