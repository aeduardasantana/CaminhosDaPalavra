# BLOCO 18 — Relatório de homologação da experiência bíblica

**Data:** 11/11/2026  
**Projeto:** Caminhos da Palavra — por Libras com Eduarda  
**Escopo:** leitor bíblico Ave-Maria, navegação, mobile, acessibilidade, links, integridade estrutural e controles teológicos, métricas e verificação HTTP do ambiente publicado.  
**Método:** execução do `tests/homologacao-bloco18.cjs` em Chromium no GitHub Actions, sobre o pacote público construído temporariamente em `dist/`; inspeção HTTP da Locaweb.  
**Resultado:** **NÃO HOMOLOGADO** — 133 verificações aprovadas, uma falha de contraste e uma pendência bloqueante de autorização documental. Os resultados são verificações técnicas e não representam aprovação eclesial.

## Evidências

- PR de homologação: https://github.com/aeduardasantana/CaminhosDaPalavra/pull/41
- Execução completa do BLOCO 18: https://github.com/aeduardasantana/CaminhosDaPalavra/actions/runs/43090626337
- Artefato `bloco18-homologacao-relatorio`: anexado à execução do workflow (JSON somente com metadados e resultados; não reproduz o texto bíblico).
- Regressões existentes: https://github.com/aeduardasantana/CaminhosDaPalavra/actions/runs/43090626453

## Matriz de aceitação

| Área | Escopo verificado | Resultado |
| --- | --- | --- |
| Integridade de dados | 73 livros; 1.334 capítulos; 35.450 versículos com ordem, presença e consistência entre índices e JSON por livro | Aprovado |
| Integridade teológica estrutural | 1.334 capítulos vinculados a chaves e ao controle editorial; `failClosed=true` | Aprovado tecnicamente |
| Teologia de conteúdo | Julgamento da conformidade doutrinal de cada explicação, glosa, escolha exegética e fonte | **Não homologado nesta bateria**; exige amostragem especializada e revisão editorial independente |
| Mobile e responsividade | Chromium a 360, 390 e 768 px; rolagem horizontal | Aprovado no ambiente isolado |
| Desktop | Chromium a 1.440 px | Funcional; 1 falha de contraste |
| Navegação | Gênesis 1 → 2, busca Jo 3,16–18, rejeição de Gn 1,32, seleção e fluxo de capítulo | Aprovado |
| Notas | Gravação e persistência de anotação após recarregar; teste em navegador isolado | Aprovado |
| Acessibilidade semântica | `lang=pt-BR`, região principal única, campos etiquetados, foco por Tab | Aprovado |
| WCAG automatizada | axe-core nas quatro resoluções | Uma ocorrência `color-contrast` de impacto sério no desktop |
| Links internos | 7 caminhos internos únicos do leitor e 5 da página inicial; nenhuma resposta 4xx no ambiente isolado | Aprovado para caminhos examinados |
| Desempenho local | Tempo de DOMContentLoaded e métricas de recursos no runner | Medido; não equivale a Core Web Vitals |
| Disponibilidade pública | HTTP 200 para `biblia-estudo.html`, `verse-index.js` e `dados/biblia-ave-maria/GEN.json` na Locaweb | Aprovado apenas para esses 3 endpoints |
| Direitos da edição Ave-Maria | Coerência entre o texto distribuído e autorização documental declarada | **Bloqueante** |

## Falha A — contraste do livro selecionado

- **Alvo identificado pelo axe-core:** `button[aria-current="true"] > small` na lista de livros.
- **Regra CSS atual:** `.study-group button small{color:#736a5e;white-space:nowrap}`
- **Estado selecionado:** fundo `#f2e5c9`.
- **Contraste calculado:** aproximadamente 4,26:1 (texto regular; mínimo WCAG AA 4,5:1).
- **Correção recomendada, não aplicada na produção:** adicionar `.study-group button[aria-current="true"] small{color:#5c4c32}` ao CSS, que proporciona aproximadamente 6,64:1 sobre esse fundo, e repetir a auditoria.

## Pendência bloqueante B — direitos de reprodução

A etapa de geração produziu 73 arquivos por livro, com 35.450 versículos da tradução Ave-Maria no pacote `dist/`. O campo **`licensedBibleTextAuthorized=false`** consta do controle editorial de origem, e o código da plataforma publica os arquivos em `dados/biblia-ave-maria/`. A verificação externa também obteve HTTP 200 para `GEN.json` (218.577 bytes).

**Não é possível declarar a distribuição autorizada com a documentação técnica atual.** A titular deve comprovar a base de reprodução aplicável ou aprovar uma arquitetura que não distribua o texto integral protegido antes do aceite definitivo. A presença de um PDF, arquivo JSON ou exemplar pessoal não constitui, isoladamente, licença de publicação na web.

## Métricas observadas

| Viewport | DOMContentLoaded local | Tempo total do roteiro automatizado (inclui múltiplas interações e axe-core) |
| --- | ---: | ---: |
| 360 × 800 | 98 ms | 2.876 ms |
| 390 × 844 | 87 ms | 1.992 ms |
| 768 × 1024 | 90 ms | 2.221 ms |
| 1.440 × 900 | 99 ms | 2.441 ms |

Na execução em runner Ubuntu 24.04, o navegador registrou 22 recursos e aproximadamente 4.006 KiB decodificados em cada rodada, após o recarregamento. Esses números referem-se ao servidor local, não a usuários reais da Locaweb.

**Smoke de produção (11/11/2026, GitHub runner):**

| Endereço examinado | HTTP | TTFB | Tempo total | Bytes |
| --- | ---: | ---: | ---: | ---: |
| `biblia-estudo.html` | 200 | 1,186 s | 1,186 s | 13.475 |
| `verse-index.js` | 200 | 0,838 s | 0,838 s | 4.718 |
| `dados/biblia-ave-maria/GEN.json` | 200 | 0,701 s | 1,195 s | 218.577 |

Esses acessos isolados não medem LCP, CLS, INP, latência de usuário brasileiro nem experiência em rede móvel real.

## Limites e próximos critérios de aceite

1. **Não foi feita homologação visual presencial em dispositivos físicos**, com leitores de tela reais ou o widget VLibras conectado. O CI isolou requisições externas para não confundir indisponibilidade de terceiros com defeitos internos.
2. **Não foi realizado cotejo versículo por versículo com o PDF impresso da Editora Ave-Maria**; a consistência comprova a estrutura do JSON utilizado, não a identidade textual de cada edição.
3. **Não foi emitido parecer teológico sobre as 1.334 explicações.** Os vínculos de capítulo e o estado de publicação são coerentes; doutrina e exegese exigem revisão de conteúdo específica.
4. A correção visual, seguida de novo teste axe-core, e a regularização documental de distribuição são pré-requisitos para o aceite.
5. Não houve publicação, merge, alteração de textos bíblicos, glosas, catálogo doutrinal ou Mapa Bíblico Mestre no âmbito deste relatório.

**Decisão final:** manter BLOCO 18 como **HOMOLOGAÇÃO TÉCNICA PARCIAL — NÃO APROVADA PARA ENCERRAMENTO**, preservando integralmente a versão de produção.
