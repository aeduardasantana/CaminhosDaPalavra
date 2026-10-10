# Revisão editorial e bíblico-litúrgica — Ano B

**Atualizado em 10/10/2026 · Projeto Caminhos da Palavra / GEB Tecnologia**

> **Escopo:** o texto-fonte foi confrontado com a glosa-base e foram ampliados roteiros contextualizados. As glosas são apoio escrito à preparação; não são traduções validadas em Libras. Sem ensaio e avaliação com intérpretes proficientes e pessoas surdas, nenhum registro deve ser apresentado como homologado linguisticamente.

## 1. Indicadores reais

| Indicador | Resultado |
|---|---:|
| Celebrações do Ano B | 60 |
| Itens registrados diretamente no `lectionary-data.js` | 238 |
| Itens efetivamente exibidos (3 leituras complementares do Batismo do Senhor) | **241** |
| Textos originais com conteúdo cadastrado | 241 |
| Textos originais integrais disponíveis no acervo | **240/241** |
| Itens com glosa-base cadastrada | 241/241 |
| Roteiros não salmódicos editorialmente ampliados | **111/181** |
| Salmos com refrão e estrofes contextualizados | **28/60** |
| Salmos com refrão contextual apenas (estrofes pendentes) | **32/60** |
| Itens pendentes de revisão editorial integral | **102** |
| Glosas com homologação humana em Libras documentada nesta etapa | **0** |

**Critério para conclusão:** o Ano B **não está editorialmente completo**. Os 102 pendentes correspondem a 70 leituras não salmódicas e 32 salmos: 66 primeiras/segundas leituras e 31 salmos do Tempo Comum; Evangelho da Sagrada Família; três leituras e um salmo das solenidades dominicais restantes. A fonte incompleta da Sagrada Família requer recuperação documental, sem invenção de texto.

## 2. Etapas revisadas

- **Advento:** todas as 12 leituras não salmódicas e quatro salmos com estrofes. Os textos foram revisados por domingo.
- **Natal, Epifania e Batismo:** 23 roteiros ampliados e oito salmos com estrofes. O único Evangelho pendente deste conjunto é Lc 2,22-40, Sagrada Família, pois o arquivo-fonte apenas remete a outra página.
- **Quaresma e Domingo de Ramos:** 19 roteiros ampliados, incluindo os Evangelhos de São João e a Paixão segundo São Marcos, e seis salmos com estrofes. O roteiro da Paixão é preparação expandida, não transcrição glosada integral verso por verso.
- **Tempo Pascal, Ascensão e Pentecostes:** 24 leituras ampliadas e oito salmos com estrofes. Separadas as variantes da 2ª leitura da Páscoa, Pentecostes e Ascensão, incluindo a Sequência em bloco autônomo na interface.
- **Tempo Comum:** 33 Evangelhos (Mc e Jo) revisados, e salmos do 23º e 32º Domingos estruturados. Os demais 66 textos de 1ª/2ª leitura e 31 salmos continuam pendentes.

## 3. Correções de fonte e rastreabilidade

### 3.1 Salmo do 32º Domingo do Tempo Comum

O cadastro indicava **Sl 146**, mas o texto incorporado era do **Salmo 15(16)**. Foi restabelecido o Salmo **145(146)** a partir do próprio arquivo original do Ano B, usando a versão correspondente do 23º Domingo como fonte interna e conferindo a seleção de versículos com fontes litúrgicas externas. O valor anterior foi arquivado em [HISTORICO-CORRECAO-SALMO-ANO-B.md](./HISTORICO-CORRECAO-SALMO-ANO-B.md).

### 3.2 Refrão do 4º Domingo da Páscoa

A extração colou `DOMINGO IV 231` à alternativa `Aleluia`, transformando paginação em texto litúrgico. O marcador foi corrigido preservando o original anterior em [HISTORICO-EXTRACAO-SALMO-PASCOA-B.md](./HISTORICO-EXTRACAO-SALMO-PASCOA-B.md). A estrutura de estrofes corrigida foi cadastrada em `psalm-structures-b-3.js`.

### 3.3 Evangelho da Sagrada Família

`B|CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO|Sagrada Família|evangelho|Lc 2,22-40` contém apenas a remissão editorial **'EVANGELHO Como atrás, p. 90-91'**, seguida de informações de outras celebrações. É um registro **incompleto**. A interface passa a advertir isso; NÃO há base documental suficiente para homologar sua correspondência com a glosa-base existente. Obter a página original do Lecionário antes de concluir.

### 3.4 Original versus glosa

Os textos do Lecionário permanecem separados das glosas; salvo as duas correções rastreadas acima, o corpus original foi preservado. As novas versões residem em arquivo contextual `glosas-revisadas-ano-b.js`. O código não sobrescreveu glosas do Ano A ou do Ano C.

## 4. Refrões, estrofes e variantes

- Todos os 60 salmos têm refrão preparado por celebração. 28 têm estrofes contextuais que foram comparadas com as divisões estruturais do arquivo original; 32 continuam com necessidade de revisão semântica individual das estrofes.
- O leitor foi ajustado para interpretar **mais de uma alternativa de refrão** sem incorporá-la como uma estrofe falsa. Os salmos do 2º Domingo da Páscoa e de Pentecostes eram afetados.
- Seletores de leituras alternativas contemplam a **Procissão de Ramos**, a **2ª leitura do Domingo da Páscoa**, **Pentecostes** e a **Ascensão**. A Sequência Pascal/Pentecostal é material separado. Selecionar uma opção **não valida automaticamente** a glosa correspondente.
- Registros que contêm apenas a *forma longa* não recebem uma forma breve artificial. A visualização comparativa do PDF utiliza a leitura e a glosa efetivamente selecionadas no cartão.

## 5. Matriz das 60 celebrações

| Tempo | Celebração | Itens | Roteiros ampliados | Salmos com estrofes | Salmos com refrão apenas | Originais incompletos |
|---|---|---:|---:|---:|---:|---:|
| ADVENTO | 1º Domingo | 4 | 3 | 1 | 0 | 0 |
| ADVENTO | 2º Domingo | 4 | 3 | 1 | 0 | 0 |
| ADVENTO | 3º Domingo | 4 | 3 | 1 | 0 | 0 |
| ADVENTO | 4º Domingo | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | 4 | 2 | 1 | 0 | 1 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | 4 | 3 | 1 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Batismo do Senhor | 4 | 3 | 1 | 0 | 0 |
| TEMPO COMUM — ANO B | 2º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 3º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 4º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 5º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 6º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 7º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 8º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 9º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 10º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 11º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 12º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 13º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 14º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 15º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 16º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 17º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 18º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 19º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 20º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 21º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 22º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 23º Domingo | 4 | 1 | 1 | 0 | 0 |
| TEMPO COMUM — ANO B | 24º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 25º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 26º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 27º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 28º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 29º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 30º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 31º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 32º Domingo | 4 | 1 | 1 | 0 | 0 |
| TEMPO COMUM — ANO B | 33º Domingo | 4 | 1 | 0 | 1 | 0 |
| TEMPO COMUM — ANO B | 34º Domingo — Cristo Rei | 4 | 1 | 0 | 1 | 0 |
| QUARESMA | 1º Domingo | 4 | 3 | 1 | 0 | 0 |
| QUARESMA | 2º Domingo | 4 | 3 | 1 | 0 | 0 |
| QUARESMA | 3º Domingo | 4 | 3 | 1 | 0 | 0 |
| QUARESMA | 4º Domingo | 4 | 3 | 1 | 0 | 0 |
| QUARESMA | 5º Domingo | 4 | 3 | 1 | 0 | 0 |
| QUARESMA | Domingo de Ramos e da Paixão | 5 | 4 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | 4 | 3 | 1 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | Pentecostes | 4 | 3 | 1 | 0 | 0 |
| SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | 4 | 0 | 0 | 1 | 0 |

## 6. Critérios e testes

**Validação automatizada necessária:** conferir total de 241 chaves efetivas, integridade de original/glosa-base, 111 revisões por chaves válidas, 60 refrões, 28 contextos de estrofes e seus tamanhos exatos, ausência de modificações no conteúdo dos anos A/C, sintaxe dos JavaScript e ordem de carregamento de scripts.

**Testes funcionais externos necessários:** abrir site em desktop e celular; comparar original/glosa por leitura; selecionar alternativas e confirmar que o PDF carrega somente a opção escolhida; ensaiar salmos com múltiplos refrões; confirmar o deploy por GitHub Actions e o FTP na Locaweb. Os testes estáticos não substituem essa execução em navegador.

**Revisão linguística posterior:** cada roteiro requer validação da Libras sinalizada: concordância espacial, referenciação, troca de papéis, classificadores, expressão facial/corporal, negações, fidelidade bíblico-litúrgica e adequação à comunidade surda. Registre os responsáveis e a data da homologação.

## 7. Arquivos principais

- [AUDITORIA-GLOSAS-ANO-B-241.csv](./AUDITORIA-GLOSAS-ANO-B-241.csv) — situação e alertas individuais de todos os 241 itens.
- `glosas-revisadas-ano-b.js` — roteiros editoriais contextuais (111 registros).
- `psalm-glossa-context-ano-b.js`, `psalm-glossa-context-2026-q4.js` — salmos contextualizados.
- `psalm-refrains-ano-b.js` — refrões por celebração pendentes de estrofes.
- `psalm-structures-b-3.js` — estrutura restaurada do 4º Domingo da Páscoa.
- `app.js`, `index.html`, `liturgy-pdf.js` — exibição, carregamento e PDF (preservar os módulos compartilhados).

**Status final deste lote: revisão editorial parcial substancial, integralidade NÃO atingida e validação humana de Libras pendente.**
