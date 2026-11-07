# Autorização de publicação pela titular — Caminhos da Palavra

**Registro:** AUT-TITULAR-CDP-2026-11-07-001  
**Data:** 7 de novembro de 2026 (America/Sao_Paulo)  
**Fonte:** autorização expressa da titular, registrada na conversa do projeto GEB Tecnologia.  
**Registro canônico:** [Mapa Bíblico Mestre — aba Autorizações — Titular](https://docs.google.com/spreadsheets/d/1BLqxiBfOp0RAQ3SV_kuTG-oyEnN-M1gyJE22_6TEnXo/edit#gid=1206110712).

## Decisão

A titular autorizou expressamente a publicação do conteúdo teológico e editorial autoral já incorporado ao projeto Caminhos da Palavra, referente ao snapshot do Mapa Bíblico Mestre **Teológico 1.5 — teologico-1.5-snapshot-2026-10-28**, com **1.334 registros**.

A autorização não é parecer eclesial nem atesta revisão externa. A aba **Controle — Revisão Eclesial** permanece com seus status e datas originais, sem alteração nem simulação de aprovação.

## Escopo técnico fixado

- Repositório: `aeduardasantana/CaminhosDaPalavra`, arquivo `theology-data.js`.
- Blob Git do snapshot autorizado: `e172c49628dbfec9316d3cf76efd0a170745c627`.
- 1.334 capítulos autorizados para publicação do conteúdo **autoral** de estudo, inclusive com a indicação transparente dos campos não documentados.
- 410 capítulos possuem relações teológicas com confiança diferente de "Pendente"; 924 mantêm a marcação de pesquisa de relações específicas pendente. Estes números caracterizam apenas o snapshot; não representam aprovação eclesial.
- A autorização é restrita ao blob indicado; uma versão posterior do corpus exige nova avaliação e nova autorização.

## Exclusões de direitos

A autorização da titular **não autoriza a reprodução pública do texto integral da tradução Ave-Maria**, seus comentários ou outros materiais protegidos de terceiros. Os arquivos `bibliaAveMaria.json` e `bibliaAveMariaRAW.json` devem permanecer excluídos do pacote público e da raiz FTP, como estabelecido no P1.

## Controle

A publicação depende de:
1. `ownerAuthorization.authorizedForPublicWeb === true`;
2. correspondência exata da versão e do hash do snapshot;
3. aprovação `ownerApprovalId` para cada CP-ID;
4. ausência de autorização para republicação do texto integral de terceiros;
5. testes e deploy aprovados, preservando `failClosed: true`.

A revisão eclesial externa continua como processo independente; nenhum status "Não enviado" deve ser alterado apenas pela autorização de publicação dada pela titular.
