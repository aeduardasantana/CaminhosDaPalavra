# Módulo Bíblia para estudo — Ave-Maria

## Escopo
Página: `biblia-estudo.html`. Implementação: `biblia-estudo-core.js`, `biblia-estudo.js` e `biblia-estudo.css`. Testes: `tests/biblia-estudo.test.cjs`. Fontes de estrutura: `bible-data.js` do projeto e taxonomia dos 73 livros definida para a base privada da Bíblia Ave-Maria.

A edição de estudos analisada foi identificada no pacote privado como **Bíblia Sagrada Ave-Maria, 2ª edição**. O número da edição extraída do PDF não deve ser automaticamente atribuído ao exemplar externo do YouVersion (versão 4542), cujo catálogo tem metadados independentes.

A pasta de trabalho informada para arquivamento privado é https://drive.google.com/drive/folders/1V0wcbs_gRzM7u3XCAk-nU9Vl_gkhgckP?usp=drive_link . **Esta URL não implica que o sistema leia automaticamente o conteúdo dessa pasta**. O site estático não inclui credenciais, não acessa a pasta nem publica o ZIP privado.

## Funcionalidades
- Navegação por 73 livros, nove grupos do cânon católico, 1.334 capítulos; pesquisa por nome ou abreviatura de livro e por referência (ex.: `Jo 3,16-18`).
- Intervalos de versículos são marcadores de estudo, **não** uma afirmação de que o versículo indicado existe na edição. A numeração integral ainda não foi extraída/validada.
- Separação da área de texto Ave-Maria, introduções e notas editoriais, anotações pessoais e glosas autorais preliminares.
- Glosas carregadas dos arquivos de repertório litúrgico por referência e identificadas por versão (base/contextual) e estado preliminar. **Não são transcrição da Ave-Maria, sinalização em Libras, nem tradução certificada**.
- Anotações e favoritos persistem em `localStorage` sob `cdp-avm-study-notes-v1`. Exportação em JSON disponível. Nenhum dado pessoal é enviado a servidor.
- O botão "Capítulo concluído" utiliza o mesmo armazenamento do plano atual, `lce-bible365-plan-v1`, com indexação idêntica dos 365 dias; o primeiro registro usa `lce-bible365-journey-start-v1`.
- Links para esta área inseridos na Bíblia principal, no menu, nas experiências de capítulos e nos itens do plano.

## Publicação e permissões
Nenhum texto bíblico completo da Ave-Maria, nota editorial da edição ou PDF foi adicionado ao repositório ou ao FTP. A publicação atual utiliza **somente referências, metadados bibliográficos, navegação, conteúdo produzido pelo estudante e glosas preliminares já pertencentes ao repositório**. O acesso à redação completa redireciona para a fonte autorizada.

A área de pesquisa textual permanece desabilitada sem um conjunto público de versículos autorizado. O núcleo oferece um contrato preparado para futuro arquivo `window.CDP_AVM_PUBLIC_DATA`; **não criar o arquivo nem adicioná-lo ao HTML enquanto não houver documento de permissão aplicável à publicação no domínio**.

Contrato de um conjunto autorizado (exemplo fictício, não incluído na publicação):
```js
window.CDP_AVM_PUBLIC_DATA = {
  editionId: 'AVM-ESTUDOS-2',
  authorizedForWeb: true,
  permissionReference: 'IDENTIFICADOR-DO-TERMO-DE-PERMISSAO',
  chapters: {
    'JHN:3': { verses: [
      { verse: 16, text: 'SOMENTE TEXTO REAL COM PERMISSÃO REGISTRADA',
        sourcePage: 1, publicAuthorized: true }
    ]}
  }
};
```

**A existência da estrutura não concede autorização de reprodução.** Quando houver permissão, o importador deverá conferir referência, edição, página do PDF, conteúdo exato, cobertura da licença, integridade e aprovação de publicação **por trecho**. Jamais misturar o texto do Lecionário/CNBB com os versículos da Bíblia Ave-Maria.

## Testes
Em GitHub Actions, executar `node tests/biblia-estudo.test.cjs` junto às demais regressões. Também executar `node --check biblia-estudo-core.js` e `node --check biblia-estudo.js`. O teste confere catálogo, transcrição de referência, 365 dias, links de glosas, bloqueio por permissões e contratos HTML.

Procedimento de auditoria visual após deploy:
1. Abrir a página nova pelo menu, pelo botão Bíblia e por um capítulo do plano;
2. Conferir `Gn 1`, `Jo 3,16-18`, `Jó 1,1`, `1Cor 13,4-7` e referência inválida;
3. Selecionar livro/capítulo, adicionar nota e marcação, recarregar e verificar persistência;
4. Marcar capítulo concluído, abrir o plano de 365 dias e verificar que a mesma marcação aparece; desmarcar e conferir o inverso;
5. Verificar que o texto Ave-Maria completo e notas editoriais não são expostos sem licença;
6. Conferir glosas como propostas preliminares e acesso separado à Liturgia;
7. Testar telas de 320 px, 768 px e desktop, navegação por teclado e foco visível.

## Limites conhecidos
- Livro e capítulos estão cobertos integralmente, mas **não há cadastro validado de total de versículos por capítulo**.
- A busca textual da edição está desativada por ausência de conjunto autorizado.
- Notas editoriais da edição estão identificadas na modelagem privada, mas não são servidas publicamente.
- O armazenamento é local ao navegador: exportar arquivo antes de trocar de aparelho ou limpar os dados.
- O plano de leitura permanece independente de uma data de início escolhida para impressão e não foi recalculado.

## Não alterar
Não modificar a exclusão seletiva FTP, as edições litúrgicas, a redação bíblica, as glosas existentes e o controle de publicação fail-closed do Mapa Bíblico Mestre.
