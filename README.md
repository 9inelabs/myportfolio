# Franklyn Raymond · Portfolio

The portfolio site for Franklyn Raymond, Developer / UI/UX Specialist at Gabeweb, to be served at **franklyn.gabeweb.org**.

It's a plain static site (HTML, CSS and JavaScript) with no build step and no dependencies. Upload the folder to any static host as it is.

## Editing content

All text, links, projects, services, tools and stats live in **`assets/js/content.js`**. Edit that file, save, and reload.

- **Headlines:** words in `[brackets]` show in the lighter grey, like `"Clean [interfaces.] Solid [code.]"`.
- **CV button:** set `person.cv` to a PDF path, such as `"assets/franklyn-raymond-cv.pdf"`. An empty value hides the button.
- **Social links:** add or remove entries in `socials`.
- **Analytics:** paste your Google Analytics ID (`G-XXXXXXXXXX`) into `site.gaId`.

### Adding a project

1. Create `assets/img/work/<slug>/` and add the screens. WebP at 780px wide works best for phone screens, and 1600px for desktop screenshots.
2. Copy one entry in `projects`, change its `slug`, text and `theme` colours, and list the image file names (without `.webp`) under `screens` and `cover`.
3. Set `device` to `"phone"` for apps, or `"browser"` for websites. For a website, name its mobile screenshots `mobile-*.webp` to show them in phone frames.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, clients, selected work, services, about, tools, process, contact |
| `project.html?p=<slug>` | Case study page for each project |
| `404.html` | Not-found page |

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to franklyn.gabeweb.org

Pick any static host:

- **Vercel:** import the GitHub repo, choose the "Other" framework preset with no build command, then add `franklyn.gabeweb.org` under Settings → Domains.
- **Netlify:** import the repo (leave the build command empty and set the publish directory to `/`), then add the custom domain.
- **GitHub Pages:** Settings → Pages → deploy from the `main` branch root, then set the custom domain to `franklyn.gabeweb.org`.
- **cPanel / shared hosting:** create the `franklyn` subdomain, then upload every file in this folder to its document root.

Then add a DNS record for the subdomain wherever gabeweb.org's DNS is managed. For Vercel, Netlify and GitHub Pages this is usually a `CNAME` record from `franklyn` to the host's address. Each host shows the exact value when you add the domain.

## Credits

- Fonts: [Archivo](https://fonts.google.com/specimen/Archivo) and [Albert Sans](https://fonts.google.com/specimen/Albert+Sans), self-hosted under the SIL Open Font License.
- Tool logos: [Simple Icons](https://simpleicons.org) (CC0). Brand marks belong to their owners.
