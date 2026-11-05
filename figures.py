"""Redraw the three-step lesson figures in a cleaner layout at build time.

The reviewed source SVGs in content/articles/visuals/assets stay untouched. Only the copies in
dist/assets are rewritten, and only when they follow the standard "1 / LABEL" three-step template.
Title, description and every text line are carried over verbatim, so alt text and meaning are unchanged.
"""
import re, html

STYLE = ('<style>'
 '.bg{fill:#f4f6fb}.card{fill:#fff;stroke:#d9e0ec}.num{fill:#224fc5}.numt{fill:#fff;font-weight:800}'
 '.lab{fill:#224fc5;font-weight:800;letter-spacing:.06em}.t{fill:#182a40}.lead{fill:#182a40;font-weight:650}'
 '.muted{fill:#5b6b80}.arrow{stroke:#224fc5;fill:none}'
 'text{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
 '@media(prefers-color-scheme:dark){.bg{fill:#171717}.card{fill:#202020;stroke:#3a3a3a}.num{fill:#9abaff}.numt{fill:#111}'
 '.lab{fill:#9abaff}.t,.lead{fill:#ededed}.muted{fill:#a8a8a8}.arrow{stroke:#9abaff}}'
 '</style>')

def parse(svg):
    title = re.search(r'<title[^>]*>(.*?)</title>', svg, re.S)
    desc = re.search(r'<desc[^>]*>(.*?)</desc>', svg, re.S)
    texts = re.findall(r'<text([^>]*)>(.*?)</text>', svg, re.S)
    if not title or not desc or sum('class="label"' in a for a, _ in texts) != 3:
        return None
    heading, steps, foot = None, [], ''
    for attrs, body in texts:
        if 'class="label"' in attrs:
            m = re.match(r'(\d) / (.+)', html.unescape(body))
            steps.append({'label': m[2].strip(), 'lines': []})
        elif heading is None:
            heading = html.unescape(body)
        elif re.search(r'not to scale', body):
            foot = html.unescape(body)
        elif steps:
            steps[-1]['lines'].append(html.unescape(body))
    return dict(title=title[1], desc=desc[1], heading=heading, steps=steps, foot=foot)

def wrap(text, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        if cur and len(cur) + 1 + len(w) > width:
            lines.append(cur); cur = w
        else:
            cur = (cur + ' ' + w).strip()
    if cur: lines.append(cur)
    return lines

def esc(s): return html.escape(s, quote=False)

def step_lines(step, width):
    # Re-join visual line breaks from the source, then re-wrap for the new card width.
    paras, buf = [], ''
    for line in step['lines']:
        buf = (buf + ' ' + line).strip()
        if re.search(r'[.!?]$', line) or ' → ' in line or ' | ' in line or not re.search(r'[a-z,]$', line):
            paras.append(buf); buf = ''
    if buf: paras.append(buf)
    out = []
    for i, p in enumerate(paras):
        cls = 'lead' if i == 0 and len(paras) > 1 else 't'
        out += [(cls, l) for l in wrap(p, width)]
    return out

def desktop(d):
    W, cw, gap, top = 760, 220, 30, 64
    body = [max(len(step_lines(s, 25)) for s in d['steps'])]
    ch = 92 + body[0] * 22
    H = top + ch + 52
    parts = [f'<rect class="bg" width="{W}" height="{H}" rx="16"/>',
             f'<text x="24" y="38" class="lead" style="font-size:19px">{esc(d["heading"])}</text>']
    for i, s in enumerate(d['steps']):
        x = 24 + i * (cw + gap)
        parts.append(f'<rect class="card" x="{x}" y="{top}" width="{cw}" height="{ch}" rx="14"/>')
        parts.append(f'<circle class="num" cx="{x+30}" cy="{top+32}" r="15"/><text class="numt" x="{x+30}" y="{top+37}" text-anchor="middle" style="font-size:14px">{i+1}</text>')
        parts.append(f'<text class="lab" x="{x+54}" y="{top+37}" style="font-size:13px">{esc(s["label"].upper())}</text>')
        y = top + 76
        for cls, line in step_lines(s, 25):
            parts.append(f'<text class="{cls}" x="{x+18}" y="{y}" style="font-size:15px">{esc(line)}</text>'); y += 22
        if i < 2:
            ax = x + cw + 4
            parts.append(f'<path class="arrow" d="M{ax} {top+ch/2} h{gap-10} m-6 -6 l6 6 l-6 6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
    parts.append(f'<text class="muted" x="24" y="{H-18}" style="font-size:12px">{esc(d["foot"])}</text>')
    return W, H, parts

def mobile(d):
    W, x, cw = 360, 16, 328
    parts, y = [], 56
    cards = []
    for i, s in enumerate(d['steps']):
        lines = step_lines(s, 34)
        h = 60 + len(lines) * 21
        cards.append((i, s, lines, y, h)); y += h + 26
    H = y + 18
    parts += [f'<rect class="bg" width="{W}" height="{H}" rx="16"/>',
              f'<text x="16" y="34" class="lead" style="font-size:18px">{esc(d["heading"])}</text>']
    for i, s, lines, cy, h in cards:
        parts.append(f'<rect class="card" x="{x}" y="{cy}" width="{cw}" height="{h}" rx="14"/>')
        parts.append(f'<circle class="num" cx="{x+26}" cy="{cy+28}" r="13"/><text class="numt" x="{x+26}" y="{cy+33}" text-anchor="middle" style="font-size:13px">{i+1}</text>')
        parts.append(f'<text class="lab" x="{x+48}" y="{cy+33}" style="font-size:12px">{esc(s["label"].upper())}</text>')
        ly = cy + 64
        for cls, line in lines:
            parts.append(f'<text class="{cls}" x="{x+16}" y="{ly}" style="font-size:14px">{esc(line)}</text>'); ly += 21
        if i < 2:
            parts.append(f'<path class="arrow" d="M{W/2} {cy+h+5} v14 m-6 -6 l6 6 l6 -6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
    parts.append(f'<text class="muted" x="16" y="{H-10}" style="font-size:11px">{esc(d["foot"])}</text>')
    return W, H, parts

def redraw(svg, is_mobile):
    d = parse(svg)
    if not d: return None
    W, H, parts = (mobile if is_mobile else desktop)(d)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">'
            f'<title id="title">{d["title"]}</title><desc id="desc">{d["desc"]}</desc>{STYLE}' + ''.join(parts) + '</svg>')
