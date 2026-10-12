/* Ritos e Orações da Missa — consulta pública e glosas de apoio revisadas. */
(() => {
  const catalogo = window.LCE_MISSAL;
  const root = document.querySelector('#missalResults');
  if (!catalogo || !root) return;
  const query = document.querySelector('#missalQuery');
  const group = document.querySelector('#missalGroup');
  const count = document.querySelector('#missalCount');
  const clear = document.querySelector('#missalClear');

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
    return String(text || '').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function render() {
    const term = clean(query.value.trim());
    const category = group.value;
    const shown = catalogo.entries.filter(item => {
      if (category && item.group !== category) return false;
      const label = catalogo.groups.find(g => g.id === item.group)?.title || '';
      return !term || clean([item.title,item.text,item.note,item.role,label].join(' ')).includes(term);
    });

    count.textContent = shown.length + ' de ' + catalogo.entries.length + ' textos e referências';
    root.replaceChildren();

    if (!shown.length) {
      root.appendChild(make('p', 'empty-state', 'Nenhum texto encontrado. Experimente outra palavra.'));
      return;
    }

    shown.forEach(item => {
      const sectionName = catalogo.groups.find(g => g.id === item.group)?.title || '';
      const card = make('details', 'missal-entry');
      card.id = 'missal-' + item.id;

      const summary = make('summary', 'missal-entry-head');
      const main = make('span', 'missal-entry-main');
      main.append(
        make('span', 'missal-entry-group', sectionName),
        make('strong', 'missal-entry-title', item.title),
        make('span', 'missal-entry-subtitle', item.role)
      );
      summary.append(main, make('span', 'missal-entry-chevron', '⌄'));

      const body = make('div', 'missal-entry-body');
      const columns = make('div', 'missal-columns');

      const portuguese = make('section', 'missal-text-panel');
      portuguese.append(
        make('h4', null, 'Texto em português'),
        make('p', 'missal-text',
          String(item.text || '').trim() ||
          'Este texto da celebração ainda está sendo preparado para consulta.')
      );
      if (item.note) portuguese.append(make('p', 'missal-editorial-note', item.note));

      const gloss = make('section', 'missal-glosa-panel');
      const glossText = String(item.glosa || '').trim();
      const reviewed = item.glosaStatus === 'revisada';
      if (reviewed && glossText) {
        gloss.append(
          make('h4', null, 'Glosa de apoio à interpretação em Libras'),
          make('p','missal-glosa-content',glossText),
          make('p','missal-editorial-note',
            'Glosa escrita de apoio. A interpretação real exige domínio linguístico e adaptação ao contexto de uso.')
        );
      } else {
        gloss.append(
          make('h4', null, 'Preparação para Libras'),
          make('p', 'missal-glosa-pending', 'Glosa de apoio em elaboração.'),
          make('p', 'missal-editorial-note',
            'Quando o roteiro estiver elaborado e revisado, será exibido aqui ao lado do texto em português. Este espaço não é um campo de anotação.')
        );
      }

      columns.append(portuguese,gloss);
      body.appendChild(columns);
      card.append(summary,body);
      root.appendChild(card);
    });
  }

  query.addEventListener('input', render);
  group.addEventListener('change', render);
  clear.addEventListener('click', () => {
    query.value = '';
    group.value = '';
    render();
    query.focus();
  });
  render();
})();
