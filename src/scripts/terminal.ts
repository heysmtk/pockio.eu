// Ovládání terminálu (vanilla TS, bez knihoven).
// HTML každé stránky je vždy kompletní; tento skript je jen vrstva navíc:
// klávesnice, filtr příkazů, navigace bez načítání (History API) a plynulé vypisování.
export {};

interface AppCommand { slug: string; title: string; description: string; href: string; icon: string }
type Command = { name: string; aliases?: string[]; description: string; home?: boolean } & (
  | { type: 'link'; href: string }
  | { type: 'output'; title: string; lines: string[] }
);
interface Data {
  lang: 'en' | 'cs';
  home: string;
  ui: { notFound: string; back: string; helpTitle: string; helpTip: string; tagline: string };
  commands: { apps: AppCommand[]; commands: Command[] };
}

const dataEl = document.getElementById('pockio-data');
const screen = document.getElementById('term-screen');
const titleEl = document.getElementById('term-title');
const input = document.getElementById('term-input') as HTMLInputElement | null;
const prompt = document.querySelector<HTMLElement>('[data-prompt]');
const stage = document.querySelector<HTMLElement>('main.stage');

if (dataEl?.textContent && screen && titleEl && stage) {
  init(JSON.parse(dataEl.textContent) as Data, screen, titleEl, stage);
}

function init(data: Data, screen: HTMLElement, titleEl: HTMLElement, stage: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  if (prompt) prompt.hidden = false;
  document.documentElement.classList.add('js');

  const { apps, commands } = data.commands;

  // ---------- pomocné ----------
  function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const nameOf = (raw: string) => raw.trim().replace(/^\//, '').toLowerCase();

  /** Všechny názvy, které jde napsat (pro Tab). */
  function allNames(): string[] {
    const names = ['help'];
    for (const a of apps) names.push(a.slug);
    for (const c of commands) names.push(c.name, ...(c.aliases ?? []));
    return names;
  }

  // ---------- plynulé vypisování ----------
  let timer = 0;
  let cursor: HTMLElement | null = null;
  let pending: HTMLElement[] = [];

  function finish() {
    cursor?.remove();
    cursor = null;
    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
    for (const e of pending) e.classList.add('on');
    pending = [];
  }

  function stream(root: Element | null) {
    finish();
    if (!root || reduced.matches) return;
    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n as Text;
        if (t.nodeValue?.trim() && !t.parentElement?.closest('[data-stream-block]')) nodes.push(t);
      }
      const items: HTMLElement[] = [];
      for (const node of nodes) {
        const frag = document.createDocumentFragment();
        for (const part of (node.nodeValue ?? '').split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(part);
          } else {
            const sp = el('span', 'sw', part);
            frag.append(sp);
          }
        }
        node.replaceWith(frag);
      }
      root.querySelectorAll<HTMLElement>('.sw, [data-stream-block]').forEach((e) => {
        if (e.hasAttribute('data-stream-block')) e.classList.add('fade');
        items.push(e);
      });
      pending = items.slice();
      cursor = el('span', 'tc');
      cursor.setAttribute('aria-hidden', 'true');
      let i = 0;
      timer = window.setInterval(() => {
        try {
          for (let k = 0; k < 3 && i < items.length; k++, i++) items[i]?.classList.add('on');
          pending = items.slice(i);
          const last = items[i - 1];
          if (last && cursor && last.classList.contains('sw')) last.after(cursor);
          if (i >= items.length) finish();
        } catch {
          finish();
        }
      }, 35);
    } catch {
      finish();
    }
  }

  // ---------- výběr v seznamu ----------
  const rows = () => Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-cmd-list] a.cmd'));
  const isVisible = (r: HTMLElement) => !r.closest('[hidden]');
  const visibleRows = () => rows().filter(isVisible);
  function select(row: HTMLAnchorElement | undefined) {
    for (const r of rows()) r.classList.toggle('is-selected', r === row);
  }
  function move(delta: number) {
    const vis = visibleRows();
    if (!vis.length) return;
    const cur = vis.findIndex((r) => r.classList.contains('is-selected'));
    const next = cur < 0 ? (delta > 0 ? 0 : vis.length - 1) : (cur + delta + vis.length) % vis.length;
    select(vis[next]);
  }
  // Hledání přes všechny příkazy (viditelné, skryté i appky), ať jsi na jakékoli stránce.
  interface Found { name: string; description: string; href?: string; run?: boolean; icon?: string }
  function searchAll(q: string): Found[] {
    const seen = new Set<string>();
    const all: (Found & { names: string[] })[] = [
      { name: 'help', names: ['help'], description: data.ui.helpTitle, run: true },
      ...commands.map((c) => ({
        name: c.name,
        names: [c.name, ...(c.aliases ?? [])],
        description: c.description,
        ...(c.type === 'link' ? { href: c.href } : { run: true }),
      })),
      ...apps.map((a) => ({ name: a.slug, names: [a.slug], description: a.title, href: a.href, icon: a.icon })),
    ];
    const hits = all.filter((f) => {
      if (seen.has(f.name)) return false;
      const ok = !q || f.names.some((n) => n.startsWith(q));
      if (ok) seen.add(f.name);
      return ok;
    });
    // přesná shoda první
    hits.sort((x, y) => Number(y.names.includes(q)) - Number(x.names.includes(q)));
    return hits;
  }

  let results: HTMLElement | null = null;

  function renderResults(found: Found[]) {
    const box = el('div', 'select');
    box.dataset.results = '';
    if (!found.length) {
      box.append(el('p', 'label', `${data.ui.notFound} /${nameOf(input?.value ?? '')}`));
    } else {
      const ul = el('ul', 'cmds');
      ul.dataset.cmdList = '';
      for (const f of found) {
        const li = el('li');
        const a = el('a', 'cmd');
        a.href = f.href ?? '#';
        if (f.run) a.dataset.run = f.name;
        else a.dataset.term = '';
        a.dataset.cmd = f.name;
        const mark = el('span', 'mark', '▸');
        mark.setAttribute('aria-hidden', 'true');
        const d = el('span', 'd');
        if (f.icon) {
          const img = el('img', 'ico');
          img.src = f.icon;
          img.alt = '';
          img.width = img.height = 20;
          d.append(img);
        }
        d.append(f.description);
        a.append(mark, el('span', 'n', `/${f.name}`), d);
        li.append(a);
        ul.append(li);
      }
      box.append(ul);
    }
    return box;
  }

  function applyFilter() {
    const typing = !!input && input.value.trim().startsWith('/');
    results?.remove();
    results = null;
    screen.querySelectorAll<HTMLElement>('.select:not([data-results])').forEach((s) => (s.hidden = typing));
    if (typing) {
      results = renderResults(searchAll(input ? nameOf(input.value) : ''));
      const back = screen.querySelector('.back');
      if (back) back.before(results);
      else screen.append(results);
    }
    select(visibleRows()[0]);
  }

  /** Otevře řádek seznamu: příkaz s výpisem (`data-run`) ho spustí, ostatní přejdou na stránku. */
  function openRow(a: HTMLAnchorElement) {
    if (a.dataset.run) runCommand(a.dataset.run);
    else void navigate(a.href);
  }

  // ---------- zobrazení obrazovky ----------
  function setScreen(nodes: Node[], title: string, variant: string) {
    screen.replaceChildren(...nodes);
    titleEl.textContent = title;
    stage.dataset.variant = variant;
    window.scrollTo(0, 0);
  }

  function makeLogo(): HTMLElement | null {
    const old = screen.querySelector<HTMLElement>('.logo');
    if (!old) return null;
    const a = el('a', 'logo logo--md logo--framed');
    for (const attr of Array.from(old.attributes)) {
      if (attr.name.startsWith('data-astro-cid')) a.setAttribute(attr.name, attr.value);
    }
    a.setAttribute('href', data.home);
    a.setAttribute('aria-label', 'Pockio');
    a.dataset.term = '';
    a.innerHTML = old.innerHTML;
    return a;
  }

  /** Výpis příkazu zadaný v terminálu (help, output příkazy, command not found). */
  function showOutput(command: string, build: (out: HTMLElement) => void) {
    const logo = makeLogo();
    const echo = el('p', 'echo');
    const b = el('b', undefined, '>');
    const em = el('em', undefined, '/');
    const home = el('a', undefined, 'home');
    home.href = data.home;
    home.dataset.term = '';
    em.append(home, command);
    echo.append(b, ' ', em);
    const out = el('div', 'out');
    out.dataset.stream = '';
    build(out);
    const back = el('p', 'back');
    const a = el('a', undefined, data.ui.back);
    a.href = data.home;
    a.dataset.term = '';
    back.append(a);
    setScreen([...(logo ? [logo] : []), echo, out, back], `pockio — ${command}`, 'page');
    stream(out);
  }

  function showHelp() {
    showOutput('/help', (out) => {
      out.append(el('h2', undefined, data.ui.helpTitle));
      const dl = el('dl', 'kv');
      dl.style.gridTemplateColumns = '18ch 1fr';
      const add = (name: string, desc: string, href?: string) => {
        const dt = el('dt');
        if (href) {
          const a = el('a', undefined, `/${name}`);
          a.href = href;
          a.dataset.term = '';
          dt.append(a);
        } else {
          dt.textContent = `/${name}`;
        }
        dl.append(dt, el('dd', undefined, desc));
      };
      for (const c of commands) add(c.name, c.description, c.type === 'link' ? c.href : undefined);
      for (const a of apps) add(a.slug, a.title, a.href);
      add('help', data.ui.helpTitle);
      out.append(dl, el('p', 'mut', data.ui.helpTip));
    });
  }

  function showNotFound(raw: string) {
    const cmd = '/' + nameOf(raw);
    showOutput(cmd, (out) => out.append(el('p', undefined, `${data.ui.notFound} ${cmd}`)));
  }

  function showCommandOutput(c: Extract<Command, { type: 'output' }>) {
    showOutput(`/${c.name}`, (out) => {
      out.append(el('h2', undefined, c.title));
      for (const line of c.lines) out.append(el('p', undefined, line));
    });
  }

  // ---------- spuštění příkazu ----------
  function runCommand(raw: string, pushOutput = true) {
    const name = nameOf(raw === '?' ? 'help' : raw);
    if (!name) return;
    if (input) input.value = '';
    const app = apps.find((a) => a.slug === name);
    const cmd = commands.find((c) => c.name === name || c.aliases?.includes(name));
    if (name === 'help') {
      showHelp();
    } else if (app) {
      void navigate(app.href);
      return;
    } else if (cmd?.type === 'link') {
      void navigate(cmd.href);
      return;
    } else if (cmd?.type === 'output') {
      showCommandOutput(cmd);
    } else {
      showNotFound(raw);
    }
    if (pushOutput) history.pushState({ out: raw === '?' ? 'help' : raw }, '', location.href);
  }

  // ---------- navigace bez načítání ----------
  let navToken = 0;

  /** Dotáhne styly, které cílová stránka potřebuje a aktuální ještě nemá. */
  function syncHead(doc: Document) {
    const key = (n: Element) => n.getAttribute('href') ?? n.textContent ?? '';
    const have = new Set(Array.from(document.head.querySelectorAll('style, link[rel=stylesheet]')).map(key));
    doc.head.querySelectorAll('style, link[rel=stylesheet]').forEach((n) => {
      if (!have.has(key(n))) document.head.append(document.importNode(n, true));
    });
    document.head.querySelectorAll('link[rel=canonical], link[rel=alternate][hreflang]').forEach((n) => n.remove());
    doc.head.querySelectorAll('link[rel=canonical], link[rel=alternate][hreflang]').forEach((n) => {
      document.head.append(document.importNode(n, true));
    });
  }

  function syncFooter(doc: Document) {
    document.querySelectorAll<HTMLElement>('[data-footer]').forEach((a) => {
      const other = doc.querySelector(`[data-footer="${a.dataset.footer}"]`);
      if (other?.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    const list = document.querySelector('[data-lang-menu] ul');
    const newList = doc.querySelector('[data-lang-menu] ul');
    if (list && newList) list.replaceChildren(...Array.from(newList.childNodes).map((n) => document.importNode(n, true)));
  }

  async function load(url: string, push: boolean) {
    const token = ++navToken;
    finish();
    try {
      const res = await fetch(url, { headers: { Accept: 'text/html' } });
      if (!res.ok) throw new Error(String(res.status));
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const newScreen = doc.getElementById('term-screen');
      const newStage = doc.querySelector<HTMLElement>('main.stage');
      if (!newScreen || !newStage) throw new Error('not a terminal page');
      if (token !== navToken) return;
      syncHead(doc);
      syncFooter(doc);
      document.title = doc.title;
      if (push) history.pushState({}, '', url);
      if (input) input.value = '';
      setScreen(
        Array.from(newScreen.childNodes).map((n) => document.importNode(n, true)),
        doc.getElementById('term-title')?.textContent ?? '',
        newStage.dataset.variant ?? 'page',
      );
      stream(screen.querySelector('[data-stream]'));
    } catch {
      location.href = url; // záloha: obyčejné načtení stránky
    }
  }

  function navigate(url: string) {
    const target = new URL(url, location.href);
    if (target.href === location.href && !(history.state as { out?: string } | null)?.out) {
      finish(); // už tu jsme, jen dokončíme případné vypisování
      return;
    }
    return load(target.pathname + target.search, true);
  }

  // ---------- události ----------
  document.addEventListener('click', (e) => {
    finish();
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const run = (e.target as Element).closest<HTMLAnchorElement>('a[data-run]');
    if (run) {
      e.preventDefault();
      openRow(run);
      return;
    }
    // odkazy v Markdownu nemají `data-term`, všechny interní odkazy ve výpisu jsou stránky terminálu
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-term], .out a');
    if (a?.getAttribute('href')?.startsWith('mailto:')) return;
    if (!a || a.origin !== location.origin) return;
    e.preventDefault();
    void navigate(a.href);
  });
  document.addEventListener('mousedown', finish);

  // hover posouvá výběr, aby byl zvýrazněný vždy jen jeden řádek
  document.addEventListener('mouseover', (e) => {
    const row = (e.target as Element).closest<HTMLAnchorElement>('[data-cmd-list] a.cmd');
    if (row && !row.classList.contains('is-selected')) select(row);
  });

  window.addEventListener('popstate', (e) => {
    const state = e.state as { out?: string } | null;
    if (state?.out) runCommand(state.out, false);
    else void load(location.pathname + location.search, false);
  });

  input?.closest('form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input) return;
    const typed = input.value.trim();
    const hit = typed.startsWith('/') ? visibleRows().find((r) => r.classList.contains('is-selected')) : undefined;
    if (hit) openRow(hit);
    else if (typed) runCommand(input.value);
    else {
      const sel = rows().find((r) => r.classList.contains('is-selected') && isVisible(r));
      if (sel) openRow(sel);
    }
  });

  input?.addEventListener('input', applyFilter);

  function complete() {
    if (!input) return false;
    const typed = input.value.trim();
    if (!typed.startsWith('/')) return false;
    const q = nameOf(typed);
    const matches = [...new Set(allNames())].filter((n) => n.startsWith(q));
    const first = matches[0];
    if (!first) return false;
    let common = first;
    for (const m of matches) while (!m.startsWith(common)) common = common.slice(0, -1);
    if (common.length <= q.length && matches.length > 1) return false;
    input.value = '/' + common;
    applyFilter();
    return true;
  }

  const isTextField = (t: EventTarget | null) =>
    t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement;

  document.addEventListener('keydown', (e) => {
    finish();
    if (coarse.matches || e.metaKey || e.ctrlKey || e.altKey) return;
    const onInput = e.target === input;
    const neutral = onInput || e.target === document.body;

    if (e.key === 'Escape' && onInput && input?.value) {
      input.value = '';
      applyFilter();
      e.preventDefault();
    } else if (e.key === 'Tab' && onInput && !e.shiftKey) {
      // Tab doplňuje jen při psaní příkazu, jinak se chová běžně (žádná klávesová past)
      if (complete()) e.preventDefault();
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && neutral && rows().length) {
      move(e.key === 'ArrowDown' ? 1 : -1);
      e.preventDefault();
    } else if (e.key === 'Enter' && e.target === document.body) {
      const sel = rows().find((r) => r.classList.contains('is-selected') && isVisible(r));
      if (sel) {
        e.preventDefault();
        openRow(sel);
      }
    } else if ((e.key === '/' || e.key === '?') && !isTextField(e.target) && e.target === document.body) {
      if (e.key === '?') {
        e.preventDefault();
        runCommand('help');
      } else {
        input?.focus(); // znak „/" se pak napíše do vstupu
      }
    }
  });
}
