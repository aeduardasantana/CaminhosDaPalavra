# Revisão editorial das glosas — Ano A

**Data da triagem:** 10/10/2026. **Escopo:** acervo dominical e solenidades cadastradas para o ciclo A.

> Este relatório diferencia (a) cobertura estrutural, (b) revisão editorial em português de roteiros de preparação, e (c) validação linguística em Libras, que ainda requer intérpretes e pessoas surdas com proficiência, ensaio e contexto litúrgico. Não confundir glosa escrita com tradução oficial.

## Inventário do acervo

- 60 celebrações do Ano A e 241 itens associados.
- 241/241 itens com texto litúrgico importado; 241/241 com glosa-base textual.
- 60 salmos; 8 com mapeamento contextual explícito de estrofes no arquivo atual; 52 exigem checagem de correspondência entre versos/estrofes.
- 14 referências de salmo reutilizadas em celebrações diferentes, que podem usar versos e refrões distintos.
- 9 glosas com tamanho inferior a 15% do texto litúrgico, usadas como **alerta de condensação** (indicador heurístico, não erro comprovado).
- 7 roteiros com revisão editorial ampliada no arquivo `glosas-revisadas-ano-a.js`. Os outros 234 itens permanecem preliminares, não linguisticamente validados.

## Revisões editoriais ampliadas já implementadas

- `A|QUARESMA|3º Domingo|evangelho|Jo 4,5-42`: ampliação de ações e interlocutores, fidelidade da progressão narrativa e indicação de mudança de papel. **Estado:** validação em Libras pendente.
- `A|QUARESMA|4º Domingo|evangelho|Jo 9,1-41`: ampliação de ações e interlocutores, fidelidade da progressão narrativa e indicação de mudança de papel. **Estado:** validação em Libras pendente.
- `A|QUARESMA|5º Domingo|evangelho|Jo 11,1-45`: ampliação de ações e interlocutores, fidelidade da progressão narrativa e indicação de mudança de papel. **Estado:** validação em Libras pendente.
- `A|QUARESMA|Domingo de Ramos e da Paixão|paixao|Mt 26,14–27,66`: ampliação de ações e interlocutores, fidelidade da progressão narrativa e indicação de mudança de papel. **Estado:** validação em Libras pendente.

## Prioridade por condensação

| Celebração | Tipo | Referência | Palavras original/glosa | Revisão ampliada |
|---|---|---|---:|---|
| 2º Domingo | salmo | Sl 72 | 135/20 | Não |
| Epifania do Senhor | salmo | Sl 72 | 135/20 | Não |
| 6º Domingo | evangelho | Mt 5,17-37 | 509/74 | Não |
| 15º Domingo | evangelho | Mt 13,1-23 | 467/70 | Não |
| 1º Domingo | segunda-leitura | Rm 5,12-19 | 425/55 | Não |
| 3º Domingo | evangelho | Jo 4,5-42 | 741/73 | Sim |
| 4º Domingo | evangelho | Jo 9,1-41 | 757/81 | Sim |
| 5º Domingo | evangelho | Jo 11,1-45 | 741/67 | Sim |
| Domingo de Ramos e da Paixão | paixao | Mt 26,14–27,66 | 2446/108 | Sim |

## Revisão contextual dos salmos

- Advento, 2º Domingo (Sl 72): refrão **justiça e paz** e quatro grupos de estrofes.
- Epifania do Senhor (Sl 72): refrão **adoração dos povos** e quatro grupos, incluindo as ofertas dos reis.
- Os dois casos foram separados em `psalm-glossa-context-ano-a.js` para evitar reutilizar automaticamente a mesma glosa por número de salmo.
- Outros 50 salmos do Ano A ainda precisam de revisão da correspondência estrofe ↔ glosa.

## Salmos que compartilham a mesma referência

Um salmo usado em celebrações distintas pode ter repertório, versículos e refrões diferentes. A chave simples de referência (ex.: `Sl 23`) não é suficiente para garantir equivalência contextual.

| Referência | Celebrações no Ano A |
|---|---:|
| Sl 23 | 4 |
| Sl 145 | 3 |
| Sl 72 | 2 |
| Sl 146 | 2 |
| Sl 89 | 2 |
| Sl 96 | 2 |
| Sl 128 | 2 |
| Sl 67 | 2 |
| Sl 119 | 2 |
| Sl 103 | 2 |
| Sl 63 | 2 |
| Sl 95 | 2 |
| Sl 33 | 2 |
| Sl 118 | 2 |

## Limites editoriais do corpus

- 9 textos apresentam marcadores de paginação, remissões de refrão ou separadores incomuns na importação (p.ex. numeração de página no meio da leitura). Precisam de conferência com o arquivo-base. A glosa não deve silenciar alterações feitas na fonte.
- O texto importado contém grafias e formas da norma portuguesa europeia (`vós`, `há-de`, `Egipto`, etc.). Não identificar o texto como lecionário brasileiro sem conferência documental.
- Os roteiros ampliados foram escritos como **apoio à preparação de intérpretes**, preservando cenas e personagens; não asseguram paráfrase equivalente verso a verso nem ordem gramatical natural em Libras.
- As demais glosas continuam precisando de revisão semântica integral, espacialização, não manuais, papel narrativo e conferência em sinalização.

## Matriz de cobertura do Ano A

| Seção | Celebração | Itens | Textos | Glosas-base | Requisitos adicionais |
|---|---|---:|---:|---:|---|
| ADVENTO | 1º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| ADVENTO | 2º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| ADVENTO | 3º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| ADVENTO | 4º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | 4 | 4 | 4 | Salmo: validar estrofes |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Batismo do Senhor | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 2º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 3º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 4º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 5º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 6º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 7º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 8º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 9º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 10º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 11º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 12º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 13º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 14º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 15º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 16º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 17º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 18º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 19º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 20º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 21º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 22º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 23º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 24º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 25º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 26º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| TEMPO COMUM — ANO A | 27º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 28º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 29º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 30º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 31º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 32º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 33º Domingo | 4 | 4 | 4 | — |
| TEMPO COMUM — ANO A | 34º Domingo — Cristo Rei | 4 | 4 | 4 | — |
| QUARESMA | 1º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| QUARESMA | 2º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| QUARESMA | 3º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| QUARESMA | 4º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| QUARESMA | 5º Domingo | 4 | 4 | 4 | Salmo: validar estrofes |
| QUARESMA | Domingo de Ramos e da Paixão | 5 | 5 | 5 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | 4 | 4 | 4 | Salmo: validar estrofes |
| PÁSCOA E TEMPO PASCAL | Pentecostes | 4 | 4 | 4 | Salmo: validar estrofes |
| SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | 4 | 4 | 4 | Salmo: validar estrofes |

## Critérios para homologação humana

1. Verificar correspondência entre referência, trechos integralmente proclamados, refrão e variantes previstas no dia.
2. Conferir quem fala, quem recebe a mensagem, mudanças de pessoa, negações, tempos e citações diretas.
3. Planejar pontos espaciais, manutenção de referentes, alternância de papéis e coerência entre repetição de refrão e estrofes.
4. Ensaiar a interpretação em Libras e colher validação de pessoa surda proficiente, preferencialmente no contexto pastoral.
5. Registrar versão, data, responsável e comentários antes de alterar o status para 'validado'.

**Importante:** A revisão textual automática e os sete roteiros ampliados não equivalem à homologação integral das 241 glosas.
