#!/usr/bin/env node
/**
 * Kontrollerer det byggede site i _site/ for de fejl, der stille ødelægger
 * synligheden i Google og AI-assistenter — og som ingen opdager ved at se på
 * siden i en browser.
 *
 * Kør via ./scripts/test.sh, eller alene efter et build:
 *     node scripts/check-seo.mjs
 *
 * Bruger kun Node's indbyggede moduler, så der skal intet installeres.
 * Afslutter med kode 1 hvis noget fejler, så CI kan stoppe en dårlig push.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = path.resolve(import.meta.dirname, '..', '_site');
const ORIGIN = 'https://ejbyif-badminton.dk';

if (!fs.existsSync(SITE)) {
  console.error('FEJL: _site/ findes ikke. Kør ./scripts/build.sh først.');
  process.exit(1);
}

const errors = [];
const warnings = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : [full];
});

const allFiles = walk(SITE);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const rel = f => path.relative(SITE, f);
const read = f => fs.readFileSync(f, 'utf8');

const titles = new Map();
const descriptions = new Map();

// ---------------------------------------------------------------- HTML sider
for (const file of htmlFiles) {
  const name = rel(file);
  const html = read(file);
  const is404 = name === '404.html';

  // Urenderet Liquid er et tegn på en tastefejl i en skabelon. Det ville ellers
  // først blive opdaget som synligt "{{ ... }}" på det live site.
  const liquid = html.match(/\{\{[^}]{0,80}\}\}|\{%[^%]{0,80}%\}/g);
  if (liquid) fail(name, `urenderet Liquid i output: ${liquid.slice(0, 3).join(' ')}`);

  // --- <title> ---
  const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1]?.trim();
  if (!title) fail(name, 'mangler <title>');
  else {
    if (!/Ejby/i.test(title)) fail(name, `<title> nævner ikke klubnavnet: "${title}"`);
    if (title.length > 65) warn(name, `<title> er ${title.length} tegn; Google klipper typisk ved ~60`);
    if (titles.has(title)) fail(name, `<title> er identisk med ${titles.get(title)} — hver side skal have sin egen`);
    else titles.set(title, name);
  }

  // --- meta description ---
  const desc = /<meta name="description" content="([\s\S]*?)"\s*\/?>/.exec(html)?.[1]?.trim();
  if (!desc) fail(name, 'mangler meta description');
  else {
    if (desc.length < 50) warn(name, `meta description er kun ${desc.length} tegn`);
    if (desc.length > 170) warn(name, `meta description er ${desc.length} tegn; klippes typisk ved ~155`);
    if (!is404) {
      if (descriptions.has(desc)) warn(name, `meta description er identisk med ${descriptions.get(desc)}`);
      else descriptions.set(desc, name);
    }
  }

  // --- canonical ---
  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  if (!canonical) fail(name, 'mangler canonical-link');
  else if (!canonical.startsWith(ORIGIN)) fail(name, `canonical er ikke absolut: ${canonical}`);

  // --- præcis én <h1> ---
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length === 0) fail(name, 'mangler <h1>');
  else if (h1s.length > 1) fail(name, `har ${h1s.length} <h1>-overskrifter; der må kun være én`);

  // --- billeder skal have alt-tekst ---
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt=/.test(img)) fail(name, `<img> uden alt-tekst: ${img.slice(0, 70)}`);
  }

  // --- iframes skal have title (tilgængelighed) ---
  for (const frame of html.match(/<iframe\b[^>]*>/g) ?? []) {
    if (!/\btitle=/.test(frame)) warn(name, '<iframe> uden title-attribut');
  }

  // --- JSON-LD ---
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) fail(name, 'mangler JSON-LD strukturerede data');
  for (const [, raw] of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      fail(name, `JSON-LD kan ikke parses: ${e.message}`);
      continue;
    }
    const graph = data['@graph'];
    if (!Array.isArray(graph)) { fail(name, 'JSON-LD mangler @graph'); continue; }

    const ids = new Set(graph.map(n => n['@id']).filter(Boolean));
    // Hver @id-reference skal kunne opløses, ellers ignorerer Google noden.
    const refs = [];
    const collect = node => {
      if (Array.isArray(node)) return node.forEach(collect);
      if (node && typeof node === 'object') {
        const keys = Object.keys(node);
        if (keys.length === 1 && keys[0] === '@id') refs.push(node['@id']);
        else keys.forEach(k => collect(node[k]));
      }
    };
    collect(graph);
    for (const ref of refs) {
      if (!ids.has(ref)) fail(name, `JSON-LD refererer til ukendt @id "${ref}"`);
    }

    for (const node of graph) {
      if (!node['@type']) fail(name, 'JSON-LD-node uden @type');
      // Tomme strenge i markup er værre end udeladte felter.
      for (const [key, val] of Object.entries(node)) {
        if (val === '' || val === null) fail(name, `JSON-LD: feltet "${key}" er tomt i ${node['@type']}`);
      }
    }

    const types = graph.flatMap(n => [].concat(n['@type']));
    for (const required of ['SportsClub', 'WebSite', 'WebPage', 'BreadcrumbList']) {
      if (!types.includes(required)) fail(name, `JSON-LD mangler ${required}-node`);
    }

    // Brødkrummer skal være nummereret 1..n uden huller.
    const crumbs = graph.find(n => [].concat(n['@type']).includes('BreadcrumbList'));
    const positions = (crumbs?.itemListElement ?? []).map(i => i.position);
    positions.forEach((p, i) => {
      if (p !== i + 1) fail(name, `brødkrumme nr. ${i + 1} har position ${p}`);
    });

    const faq = graph.find(n => [].concat(n['@type']).includes('FAQPage'));
    if (faq) {
      for (const q of faq.mainEntity ?? []) {
        if (!q.name?.trim()) fail(name, 'FAQ-spørgsmål uden tekst');
        const answer = q.acceptedAnswer?.text?.trim() ?? '';
        if (answer.length < 40) fail(name, `FAQ-svar er for kort til at stå alene: "${q.name}"`);
      }
    }
  }
}

// --------------------------------------------------------- Filer i roden
const robots = path.join(SITE, 'robots.txt');
if (!fs.existsSync(robots)) fail('robots.txt', 'findes ikke');
else {
  const txt = read(robots);
  if (!/^Sitemap:\s*\S+/m.test(txt)) fail('robots.txt', 'mangler Sitemap-linje');
  // Hver gruppe skal selv gentage sine Disallow-regler: en navngiven crawler
  // arver IKKE regler fra "User-agent: *".
  const groups = txt.split(/\n(?=User-agent:)/).filter(g => g.startsWith('User-agent:'));
  if (groups.length < 2) fail('robots.txt', 'ingen navngivne AI-crawlere fundet');
  const seen = new Set();
  for (const group of groups) {
    const agent = /User-agent:\s*(\S+)/.exec(group)[1];
    if (seen.has(agent)) fail('robots.txt', `"User-agent: ${agent}" optræder to gange; grupperne skal slås sammen`);
    seen.add(agent);
    if (!/Disallow:\s*\/assets\/docs\//.test(group)) {
      fail('robots.txt', `gruppen "${agent}" mangler Disallow for /assets/docs/`);
    }
  }
  for (const expected of ['OAI-SearchBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot']) {
    if (!seen.has(expected)) warn('robots.txt', `crawleren ${expected} er ikke nævnt eksplicit`);
  }
}

const llms = path.join(SITE, 'llms.txt');
if (!fs.existsSync(llms)) fail('llms.txt', 'findes ikke');
else {
  const txt = read(llms);
  if (/\{\{|\{%/.test(txt)) fail('llms.txt', 'indeholder urenderet Liquid');
  if (!txt.startsWith('# ')) fail('llms.txt', 'skal starte med en H1-overskrift');
  if (!/^> /m.test(txt)) fail('llms.txt', 'mangler blockquote-resumé efter overskriften');
  if (txt.length < 800) fail('llms.txt', `er kun ${txt.length} tegn — ser ufuldstændig ud`);
  // Priser og adresse er hele pointen med filen.
  for (const needle of ['Skovvang 4', '4623', 'Senior Motion', 'Flex-hygge', 'Baneudlejning']) {
    if (!txt.includes(needle)) fail('llms.txt', `nævner ikke "${needle}"`);
  }
  for (const m of txt.matchAll(/\]\((https:\/\/[^)]+)\)/g)) {
    const url = m[1];
    if (!url.startsWith(ORIGIN)) continue;
    const p = url.slice(ORIGIN.length).replace(/\/$/, '');
    const candidates = [path.join(SITE, p, 'index.html'), path.join(SITE, p), path.join(SITE, `${p}.html`)];
    if (p && !candidates.some(c => fs.existsSync(c))) fail('llms.txt', `linker til en side der ikke findes: ${url}`);
  }
}

const sitemap = path.join(SITE, 'sitemap.xml');
if (!fs.existsSync(sitemap)) fail('sitemap.xml', 'findes ikke — er jekyll-sitemap aktiveret?');
else {
  const xml = read(sitemap);
  for (const p of ['/', '/tilbud/', '/kontakt/', '/om-klubben/', '/bestyrelsen/', '/vedtaegter/']) {
    if (!xml.includes(`${ORIGIN}${p}<`)) fail('sitemap.xml', `mangler ${p}`);
  }
  if (xml.includes('/assets/docs/')) fail('sitemap.xml', 'indeholder PDF-filer, der er udelukket i robots.txt');
}

// ------------------------------------------------------------------ Rapport
console.log(`Gennemgik ${htmlFiles.length} HTML-sider i _site/\n`);
for (const w of warnings) console.log(`  ADVARSEL  ${w}`);
if (warnings.length) console.log('');
for (const e of errors) console.log(`  FEJL      ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} fejl, ${warnings.length} advarsler. Ret fejlene før du pusher.`);
  process.exit(1);
}
console.log(`Ingen fejl${warnings.length ? `, ${warnings.length} advarsler` : ''}. Klar til push.`);
