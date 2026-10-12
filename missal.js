(() => {
  const catalogo = window.LCE_MISSAL;
  const root = document.querySelector('#missalResults');
  if (!catalogo || !root) return;
  const query = document.querySelector('#missalQuery');
  const group = document.querySelector('#missalGroup');
  const count = document.querySelector('#missalCount');
  const clear = document.querySelector('#missalClear');
  const noteKey = id => 'cdp-missal-notas-v1:' + id;

  catalogo.groups.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.title;
    group.appendChild(option);
  });

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function clean(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function render() {
    const term = clean(query.value.trim());
    const category = group.value;
    const shown = catalogo.entries.filter(item => {
      if (category && item.group !== category) return false;
      const label = catalogo.groups.find(g => g.id === item.group)?.title || '';
      return !term || clean([item.title, item.text, item.note, item.role, label].join(' ')).includes(term);
    });
    count.textContent = shown.length + ' de ' + catalogo.entries.length + ' textos e referências';
    root.replaceChildren();
    if (!shown.length) {
      root.appendChild(make('p','empty-state','Nenhum registro encontrado. Ajuste os filtros.'));
      return;
    }
    shown.forEach(item => {
      const sectionName = catalogo.groups.find(g => g.id === item.group)?.title || '';
      const card = make('details','missal-entry');
      card.id = 'missal-' + item.id;
      const summary = make('summary','missal-entry-head');
      const main = make('span','missal-entry-main');
      main.append(
        make('span','missal-entry-group',sectionName),
        make('strong','missal-entry-title',item.title),
        make('span','missal-entry-subtitle',item.role + ' · Missal, p. ' + item.page)
      );
      summary.append(main,make('span','missal-entry-chevron','⌄'));
      const body = make('div','missal-entry-body');
      const columns = make('div','missal-columns');
      const left = make('section','missal-text-panel');
      left.append(make('h4',null,'Texto do Missal / referência'),make('p','missal-text',item.text || 'Texto ainda não transcrito nesta versão. Consultar página ' + item.page + ' do Missal.'));
      left.append(make('p','missal-editorial-note',item.note));
      const right = make('section','missal-notes-panel');
      const heading = make('h4',null,'Preparação pessoal para Libras');
      const help = make('p','missal-editorial-note','Anote papéis, marcação espacial, expressões e escolhas de interpretação. Este campo não é uma glosa oficial, não é publicado e só fica salvo neste navegador.');
      const label = make('label','missal-note-label','Suas anotações (opcional)');
      const area = make('textarea','missal-note-input');
      area.rows = 6;
      area.maxLength = 10000;
      area.placeholder = 'Ex.: sacerdote à esquerda; assembleia à direita; revisar sinais teológicos e articulação da resposta.';
      const id = 'missalNote-' + item.id;
      area.id = id;
      label.htmlFor = id;
      try { area.value = localStorage.getItem(noteKey(item.id)) || ''; }
      catch { help.textContent += ' O armazenamento local não está disponível neste navegador.'; }
      const status = make('span','missal-save-state','');
      area.addEventListener('input', () => {
        try { localStorage.setItem(noteKey(item.id), area.value); status.textContent = 'Salvo somente neste dispositivo'; }
        catch { status.textContent = 'Não foi possível salvar neste navegador'; }
      });
      right.append(heading,help,label,area,status);
      columns.append(left,right);
      body.appendChild(columns);
      card.append(summary,body);
      root.appendChild(card);
    });
  }
  query.addEventListener('input',render);
  group.addEventListener('change',render);
  clear.addEventListener('click',()=>{query.value = '';group.value = '';render();query.focus();});
  render();
})();
