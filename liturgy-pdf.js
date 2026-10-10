/* Caminhos da Palavra — exportação comparativa, inteiramente local ao navegador. */
(() => {
  'use strict';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const root = document.querySelector('#liturgyResults');
  if (!root) return;

  // The site already constructs a semantic psalm sequence: refrain, stanza, repeat.
  // Export exactly those paired units rather than flattening each pane into one block.
  function contentBlock(element) {
    const title = clean(element.querySelector(':scope > .psalm-part-label')?.textContent);
    const parts = [...element.children].filter(child => !child.classList.contains('psalm-part-label'));
    const chunks = parts.length ? parts.map(child => ({
      kind: child.classList.contains('glosa-line') ? 'glosa' :
        child.classList.contains('psalm-alternative') ? 'alternative' : 'text',
      text: (child.innerText || child.textContent || '').trim()
    })).filter(part => part.text) : [{kind:'text',text:(element.innerText || element.textContent || '').trim()}];
    return {title, chunks};
  }
  function blocksFor(el) {
    if (!el) return [];
    const sequence = el.querySelector('.psalm-sequence');
    if (sequence) {
      const header = el.querySelector('.psalm-header');
      const blocks = [...sequence.children].map(contentBlock);
      if (header && clean(header.textContent)) blocks.unshift({title:'Identificação',chunks:[{kind:'text',text:clean(header.textContent)}]});
      return blocks;
    }
    const text = (el.innerText || el.textContent || '').trim();
    return [{title:'',chunks:[{kind:'text',text:text || 'Conteúdo não disponível no acervo.'}]}];
  }
  function compareRows(left, right, psalm) {
    if (psalm) {
      // The identification line has no equivalent on the glosa side.
      const header = left[0]?.title === 'Identificação' ? left.shift() : null;
      const rows = [];
      if (header) rows.push([header,{title:'',chunks:[]}]);
      if (left.length === right.length) {
        rows.push(...left.map((block,index) => [block,right[index]]));
        return rows;
      }
      // Never shift all later pairs when one unit is missing.
      rows.push([{title:'Texto original — agrupamento não confirmado',chunks:left.flatMap(x=>x.chunks)},
        {title:'Glosa — agrupamento não confirmado',chunks:right.flatMap(x=>x.chunks)}]);
      return rows;
    }
    return [[left[0],right[0]]];
  }
  function renderBlock(block) {
    if (!block) return '';
    return `<div class="unit">${block.title ? `<strong class="unit-label">${escapeHTML(block.title)}</strong>` : ''}
      ${(block.chunks||[]).map(x=>`<div class="unit-line ${x.kind==='glosa'?'is-glosa':x.kind==='alternative'?'is-alternative':''}">${escapeHTML(x.text)}</div>`).join('')}
    </div>`;
  }
  function styleFor(font, format, notes) {
    return `@page{size:${format} landscape;margin:12mm}*{box-sizing:border-box}
      html,body{margin:0;padding:0;color:#29251d;font-family:Arial,sans-serif;font-size:${font}pt}
      .mast{border-bottom:2px solid #a87318;padding:0 0 7mm;margin:0 0 7mm}
      .mast small{color:#756a55;font-size:9pt;text-transform:uppercase;letter-spacing:.08em}
      h1{font-size:17pt;margin:3mm 0 2mm} .meta{font-size:10pt;color:#655d4f}
      table{width:100%;border-collapse:collapse;table-layout:fixed}
      th{background:#ede7da;text-align:left;padding:3mm;border:1px solid #cfc7b8;font-size:10pt}
      td{width:50%;padding:4mm;vertical-align:top;border:1px solid #cfc7b8;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.48}
      tr{break-inside:avoid;page-break-inside:avoid}\n      .unit-label{display:block;font-size:.86em;color:#74531e;letter-spacing:.025em;margin-bottom:2mm}\n      .unit-line{white-space:pre-wrap;margin:0 0 1.5mm;line-height:1.48}\n      .is-glosa{background:#f2e6c9;border-left:3px solid #a87318;padding:2mm 3mm;font-weight:650;margin-bottom:1.5mm}\n      .is-alternative{font-style:italic}\n      tbody tr:nth-child(even) td{background:#fdfbf6}
      td:nth-child(2){background:#fcfaf5}
      .notice{font-size:9pt;color:#675d4d;margin-top:5mm}
      .notes{margin-top:8mm;break-inside:avoid}
      .notes h2{font-size:10pt}.notes .line{border-bottom:1px solid #cfc7b8;height:12mm}
      @media screen{body{padding:15mm;max-width:1100px;margin:auto;background:white}}
    `;
  }

  function exportItem(article) {
    const original = article.querySelector('.original-text');
    const glosa = article.querySelector('.glosa-text');
    const title = clean(article.querySelector('.card-title')?.textContent) || 'Texto litúrgico';
    const context = clean(article.querySelector('.card-kicker')?.textContent);
    const meta = clean(article.querySelector('.card-meta')?.textContent);
    const source = clean(article.querySelector('.source-version')?.textContent);
    const isPsalm = Boolean(original?.querySelector('.psalm-sequence'));\n    const left = blocksFor(original), right = blocksFor(glosa);
    const settings = document.createElement('dialog');
    settings.className = 'lce-pdf-dialog';
    settings.setAttribute('aria-label', 'Configurar PDF comparativo');
    settings.innerHTML = `<form method="dialog" class="lce-pdf-form">
      <h3>PDF litúrgico comparativo</h3><p>Configure o documento em paisagem. O texto e a glosa permanecerão lado a lado.</p>
      <label>Formato <select name="paper"><option>A4</option><option>A3</option></select></label>
      <label>Fonte <select name="font"><option>10</option><option selected>11</option><option>12</option><option>14</option></select></label>
      <label><input type="checkbox" name="reference" checked> Referência e identificação litúrgica</label>
      <label><input type="checkbox" name="notes"> Espaço para anotações</label>
      <p class="lce-pdf-caution">Nos salmos, os refrões e as estrofes serão comparados em linhas correspondentes. Se houver divergência estrutural, o PDF não inventará pares. Glosas preliminares exigem revisão.</p>
      <div class="lce-pdf-actions"><button value="cancel" class="secondary-button">Cancelar</button><button value="generate" class="primary-action">Abrir PDF / Imprimir</button></div>
    </form>`;
    document.body.appendChild(settings);
    settings.addEventListener('close', () => {
      if (settings.returnValue === 'generate') {
        const form = settings.querySelector('form');
        const paper = form.elements.paper.value === 'A3' ? 'A3' : 'A4';
        const font = ['10','11','12','14'].includes(form.elements.font.value) ? form.elements.font.value : '11';
        const reference = form.elements.reference.checked;
        const notes = form.elements.notes.checked;
        const rows = compareRows(left,right).map(([a,b]) =>
          `<tr><td>${escapeHTML(a)}</td><td>${escapeHTML(b)}</td></tr>`).join('');
        const doc = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${escapeHTML(title)} — Caminhos da Palavra</title><style>${styleFor(font,paper,notes)}</style></head><body>
          <header class="mast"><small>Caminhos da Palavra · por Libras com Eduarda</small><h1>${escapeHTML(title)}</h1>
          ${reference ? `<div class="meta">${escapeHTML([context,meta,source].filter(Boolean).join(' · '))}</div>` : ''}</header>
          <table><thead><tr><th>Texto litúrgico</th><th>Glosa de apoio à Libras</th></tr></thead><tbody>${rows}</tbody></table>
          <p class="notice">Material de estudo. Glosas são instrumentos de preparação, não constituem Libras nem tradução oficial. Verifique a fonte e os direitos de reprodução do texto.</p>
          ${notes ? '<section class="notes"><h2>Anotações</h2><div class="line"></div><div class="line"></div><div class="line"></div></section>' : ''}
          <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),350));<\/script></body></html>`;
        const pop = window.open('', '_blank');
        if (!pop) {
          alert('O navegador bloqueou a janela do PDF. Permita pop-ups para este site e tente novamente.');
        } else {
          pop.document.open(); pop.document.write(doc); pop.document.close();
        }
      }
      settings.remove();
    }, {once: true});
    if (typeof settings.showModal === 'function') settings.showModal();
    else {settings.setAttribute('open','');}
  }

  function attachButtons() {
    root.querySelectorAll('.accordion-item').forEach(article => {
      if (article.querySelector('.lce-pdf-button')) return;
      const panel = article.querySelector('.accordion-panel');
      if (!panel) return;
      const wrap = document.createElement('div');
      wrap.className = 'lce-pdf-toolbar';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary-button lce-pdf-button';
      button.textContent = 'Gerar PDF comparativo';
      button.addEventListener('click', () => exportItem(article));
      wrap.append(button);
      panel.append(wrap);
    });
  }
  const css = document.createElement('style');
  css.textContent = `.lce-pdf-toolbar{padding:13px 20px 18px;display:flex;justify-content:flex-end;border-top:1px solid #ddd6c8}
    .lce-pdf-dialog{max-width:min(94vw,520px);width:100%;border:1px solid #ddd6c8;border-radius:8px;padding:0;box-shadow:0 18px 80px #0003}
    .lce-pdf-dialog::backdrop{background:#19171291}
    .lce-pdf-form{display:grid;gap:14px;padding:25px}
    .lce-pdf-form h3,.lce-pdf-form p{margin:0}
    .lce-pdf-form label{display:flex;justify-content:space-between;align-items:center;gap:16px}
    .lce-pdf-form label:has(input){justify-content:flex-start}
    .lce-pdf-form select{min-width:120px}
    .lce-pdf-caution{font-size:.82rem;color:#6f6a60}
    .lce-pdf-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px}
    @media(max-width:600px){.lce-pdf-toolbar{justify-content:stretch}.lce-pdf-button{width:100%}}`;
  document.head.appendChild(css);
  new MutationObserver(attachButtons).observe(root,{childList:true});
  attachButtons();
})();
