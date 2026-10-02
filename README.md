# Libras com Eduarda

Primeira versão funcional do acervo católico pesquisável de **Libras com Eduarda**.

## Objetivo desta versão

- exibir **texto original e glosa lado a lado** em telas médias e grandes;
- empilhar os dois painéis em telas menores, mantendo a ordem **original → glosa**;
- pesquisar por texto original, glosa, referência bíblica, ano litúrgico, celebração e palavras-chave;
- filtrar por ano litúrgico A/B/C;
- filtrar por item litúrgico: primeira leitura, salmo, segunda leitura, aclamação e Evangelho;
- manter um módulo separado de músicas prioritárias;
- preparar o frontend para posterior migração do conteúdo local para Supabase.

## Estrutura

- `index.html` — página pública e componentes base.
- `styles.css` — responsividade e visual do comparativo original × glosa.
- `data.js` — dados locais temporários. Será substituído por consultas ao Supabase.
- `app.js` — busca, filtros, navegação e renderização.

## Conteúdo inicial

Foi incluída a estrutura da liturgia-piloto do 27º Domingo do Tempo Comum — Ano A, com Is 5,1-7; Sl 80; Fl 4,6-9; Mt 21,33-43.

O campo `original` está preparado para receber o texto integral validado do Lecionário utilizado. Nesta primeira versão ele contém somente a referência e uma nota de validação, evitando tratar uma edição não confirmada como texto oficial.

As músicas `Mãezinha do Céu` e `O Senhor é Rei` foram cadastradas apenas como prioridades de repertório; nenhuma letra integral foi incorporada nesta etapa.

## Próxima camada de dados

A arquitetura prevista no histórico do projeto é:

- Supabase/PostgreSQL para conteúdo persistente;
- autenticação administrativa;
- painel de cadastro, revisão, publicação e versionamento;
- ambiente público de consulta;
- entidades reutilizáveis entre Liturgia, Bíblia, Músicas, Rosário e Glossário;
- vídeos opcionais e integração com VLibras quando pertinente.
