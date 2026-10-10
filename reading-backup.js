/* Backup do progresso bíblico — armazenamento local, sem envio a servidores. */
(() => {
  'use strict';
  const KEY = 'lce-bible365-plan-v1';
  const START = 'lce-bible365-journey-start-v1';
  const panel = document.querySelector('.progress-path');
  if (!panel) return;

  const actions = document.createElement('div');
  actions.className = 'progress-backup-controls';
  const exportButton = document.createElement('button');
  exportButton.type = 'button';
  exportButton.className = 'secondary-button';
  exportButton.textContent = 'Exportar progresso';
  const importButton = document.createElement('button');
  importButton.type = 'button';
  importButton.className = 'secondary-button';
  importButton.textContent = 'Importar progresso';
  const chooser = document.createElement('input');
  chooser.type = 'file';
  chooser.accept = '.json,application/json';
  chooser.hidden = true;
  chooser.setAttribute('aria-label', 'Selecionar arquivo de backup do Plano de Leitura');
  const status = document.createElement('p');
  status.className = 'progress-backup-status';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  actions.append(exportButton, importButton, chooser, status);
  panel.querySelector('.reading-path-card > div:last-child')?.append(actions) || panel.append(actions);

  function validKey(value) {
    return typeof value === 'string' && /^[A-Z0-9]{2,4}:\d{1,3}$/.test(value);
  }
  function readProgress() {
    const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(stored)) throw new Error('O progresso salvo no navegador está inválido.');
    return stored.filter(validKey);
  }
  exportButton.addEventListener('click', () => {
    try {
      const payload = {
        application: 'caminhos-da-palavra',
        formatVersion: 1,
        exportedAt: new Date().toISOString(),
        completedChapters: [...new Set(readProgress())],
        journeyStartedAt: localStorage.getItem(START) || null
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'caminhos-da-palavra-progresso-' + new Date().toISOString().slice(0,10) + '.json';
      document.body.appendChild(link);
      link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Backup preparado. Guarde o arquivo em local seguro.';
    } catch (error) { status.textContent = error.message || 'Não foi possível exportar o progresso.'; }
  });
  importButton.addEventListener('click', () => chooser.click());
  chooser.addEventListener('change', async () => {
    const file = chooser.files?.[0];
    chooser.value = '';
    if (!file) return;
    if (file.size > 1024 * 1024) { status.textContent = 'O arquivo excede o limite de 1 MB.'; return; }
    try {
      const payload = JSON.parse(await file.text());
      if (payload?.application !== 'caminhos-da-palavra' || payload.formatVersion !== 1 ||
          !Array.isArray(payload.completedChapters) ||
          payload.completedChapters.length > 2000 ||
          !payload.completedChapters.every(validKey)) throw new Error('Arquivo de backup inválido ou incompatível.');
      const current = readProgress();
      const merged = [...new Set([...current, ...payload.completedChapters])];
      const date = payload.journeyStartedAt;
      if (date != null && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
        throw new Error('A data de início no backup está inválida.');
      }
      if (!window.confirm('Importar ' + payload.completedChapters.length + ' capítulos? As marcações atuais serão preservadas e unidas ao backup.')) return;
      localStorage.setItem(KEY, JSON.stringify(merged));
      if (date) {
        const existing = localStorage.getItem(START);
        if (!existing || date < existing) localStorage.setItem(START, date);
      }
      status.textContent = 'Progresso importado: ' + merged.length + ' capítulos concluídos. Atualizando a página.';
      window.location.reload();
    } catch (error) { status.textContent = error.message || 'Falha ao importar o backup.'; }
  });
})();