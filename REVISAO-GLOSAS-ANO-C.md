# REVISÃO DAS GLOSAS — ANO C

**Data:** 11/10/2026  
**Projeto:** Caminhos da Palavra · GEB Tecnologia  
**Estado:** inventário técnico realizado; revisão editorial integral **não concluída**.  
**Ramo de referência:** `main` (`0df353dfd90c45a314407a459c014367795b768d` no início da análise).

## 1. Escopo e critérios de contagem

- **60 celebrações** cadastradas no ciclo C, **238 itens litúrgicos** (59 primeiras leituras, 59 salmos, 59 segundas leituras, 59 Evangelhos, 1 procissão, 1 Paixão). Os 238 registros têm chave correspondente em `liturgy-originals-c.js` e glosa-base vinculada por referência.
- `liturgy-originals-c.js` contém **241 chaves**, três além das 238 efetivamente cadastradas: as outras três correspondem às leituras não relacionadas no Batismo do Senhor. Não confundir chaves de textos com itens do cadastro.
- **0/238 itens aprovados nesta rodada por conferência exaustiva versículo a versículo**. O inventário e a detecção de lacunas não são revisão linguística concluída.
- **Validação especializada por pessoas surdas/intérpretes:** pendente em todos os 238 itens, salvo evidência posterior documentada.
- Prioridades são indicativas (triagem): CRÍTICA para perícopes explicitamente problemáticas; ALTA para salmos, opções e desproporções de extensão; NORMAL nos demais. Prioridade NORMAL não equivale a aprovação.

## 2. Proveniência e ressalvas

- As chaves do ciclo C apontam para textos identificados como *Lecionário Dominical — Ano C · arquivo fornecido pela responsável do projeto*, com URL original armazenada nos dados. A redação observada apresenta características do português europeu (por exemplo, `baptismo`, `recto`, `vossos`); **não afirmar que seja o texto brasileiro oficialmente aprovado sem conferência de edição e direitos**.
- O pareamento encontrado é por chave litúrgica para o original e por referência para a glosa. Portanto, uma glosa genérica compartilhada por outros ciclos não deve ser substituída globalmente como se fosse exclusiva do Ano C.
- Não editar anos A/B, nem alterar funcionalidades aprovadas, para resolver problemas exclusivos do Ano C.

## 3. Achados confirmados e tratamento

### C-001 · Batismo do Senhor — cadastro incompleto

A celebração tem somente o Evangelho `Lc 3,15-16.21-22` no cadastro do Ano C. Existem, porém, três originais com chaves exatas para a mesma celebração que **não aparecem no cadastro**: `Is 42,1-4.6-7`, `Sl 29`, `At 10,34-38`. É preciso verificar a correspondência com o Lecionário aplicável antes de registrar oficialmente a tríade e verificar eventuais opções litúrgicas. **Status: pendente — sem alteração automática do calendário.**

### C-002 · Lc 15,1-32 — três parábolas resumidas em poucas linhas

A glosa-base menciona a ovelha perdida, a moeda perdida e o filho perdido, mas omite numerosas ações, falas e transições; a conclusão teológica condensada não substitui a narrativa bíblica. Produzir glosa integral por unidades: contexto e murmuração; ovelha e celebração; moeda e alegria; filho mais novo, herança e fome; retorno e acolhida; irmão mais velho e diálogo final. **Status: correção necessária — glosa atual não aprovada.**

### C-003 · Lc 10,25-37 — bom samaritano

A glosa atual apresenta sequência narrativa resumida. Revisar integralmente o diálogo com o doutor da Lei e o motivo de sua pergunta, a viagem Jerusalém–Jericó, as atitudes distintas do sacerdote, levita e samaritano, os cuidados concretos (azeite, vinho, montaria, hospedaria, pagamento, compromisso de retorno), a pergunta final de Jesus e a resposta. **Status: correção necessária — não considerar revisado.**

### C-004 · Paixão de São Lucas — Lc 22,14–23,56

A glosa-base disponível é um resumo de grandes acontecimentos. Falta roteiro integral das mudanças de locutor, com segmentação para narrador, Jesus, Pedro, Judas, autoridades, Pilatos, multidão, soldados, condenados, José de Arimateia e outros personagens efetivos no texto. Exigir confronto entre forma longa/breve quando presentes e preservação dos movimentos e gestos não verbais. **Status: prioridade crítica — não aprovado.**

### C-005 · Salmos responsoriais

Os arquivos `psalm-structures-c-1.js` e `psalm-structures-c-2.js` mantêm estruturas de estrofes e variantes de refrão, mas a presença da estrutura não comprova fidelidade da glosa a cada estrofe. Conferir cada salmo por celebração, com correspondência refrão ↔ estrofes ↔ versículos ↔ alternativas, inclusive salmos repetidos sob outro contexto. **Status: 59 verificações editoriais pendentes.**

### C-006 · Textos extraídos — cabeçalhos e artefatos

Alguns campos originais contêm cabeçalhos e refrães próximos ao Evangelho (observado em Lc 15,1-3.11-32 e Lc 22,14–23,56), além de grafias de intervalos como `__`. Separar elementos litúrgicos, rubricas e conteúdo bíblico antes de um pareamento automático trecho a trecho. **Status: verificação manual necessária.**

## 4. Inventário rastreável dos 238 itens


Legenda: **I** = identificado no cadastro; **O** = original associado; **G** = glosa-base associada; **R** = revisão textual integral pendente; **L** = validação humana Libras pendente. Os indicadores I/O/G não representam aprovação.


| Nº | Seção | Celebração | Item | Referência | Base | Prioridade | Revisão | Libras |
|---:|---|---|---|---|---|---|---|---|
| 1 | ADVENTO | 1º Domingo | 1ª leitura | Jr 33,14-16 | I/O/G | NORMAL | Pendente | Pendente |
| 2 | ADVENTO | 1º Domingo | Salmo | Sl 25 | I/O/G | ALTA | Pendente | Pendente |
| 3 | ADVENTO | 1º Domingo | 2ª leitura | 1Ts 3,12–4,2 | I/O/G | NORMAL | Pendente | Pendente |
| 4 | ADVENTO | 1º Domingo | Evangelho | Lc 21,25-28.34-36 | I/O/G | NORMAL | Pendente | Pendente |
| 5 | ADVENTO | 2º Domingo | 1ª leitura | Br 5,1-9 | I/O/G | NORMAL | Pendente | Pendente |
| 6 | ADVENTO | 2º Domingo | Salmo | Sl 126 | I/O/G | ALTA | Pendente | Pendente |
| 7 | ADVENTO | 2º Domingo | 2ª leitura | Fl 1,4-6.8-11 | I/O/G | NORMAL | Pendente | Pendente |
| 8 | ADVENTO | 2º Domingo | Evangelho | Lc 3,1-6 | I/O/G | NORMAL | Pendente | Pendente |
| 9 | ADVENTO | 3º Domingo | 1ª leitura | Sf 3,14-18 | I/O/G | NORMAL | Pendente | Pendente |
| 10 | ADVENTO | 3º Domingo | Salmo | Is 12 | I/O/G | ALTA | Pendente | Pendente |
| 11 | ADVENTO | 3º Domingo | 2ª leitura | Fl 4,4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 12 | ADVENTO | 3º Domingo | Evangelho | Lc 3,10-18 | I/O/G | NORMAL | Pendente | Pendente |
| 13 | ADVENTO | 4º Domingo | 1ª leitura | Mq 5,1-4 | I/O/G | NORMAL | Pendente | Pendente |
| 14 | ADVENTO | 4º Domingo | Salmo | Sl 80 | I/O/G | ALTA | Pendente | Pendente |
| 15 | ADVENTO | 4º Domingo | 2ª leitura | Hb 10,5-10 | I/O/G | NORMAL | Pendente | Pendente |
| 16 | ADVENTO | 4º Domingo | Evangelho | Lc 1,39-45 | I/O/G | NORMAL | Pendente | Pendente |
| 17 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | 1ª leitura | Is 62,1-5 | I/O/G | NORMAL | Pendente | Pendente |
| 18 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | Salmo | Sl 89 | I/O/G | ALTA | Pendente | Pendente |
| 19 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | 2ª leitura | At 13,16-17.22-25 | I/O/G | NORMAL | Pendente | Pendente |
| 20 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | Evangelho | Mt 1,1-25 | I/O/G | ALTA | Pendente | Pendente |
| 21 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | 1ª leitura | Is 9,1-6 | I/O/G | NORMAL | Pendente | Pendente |
| 22 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | Salmo | Sl 96 | I/O/G | ALTA | Pendente | Pendente |
| 23 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | 2ª leitura | Tt 2,11-14 | I/O/G | NORMAL | Pendente | Pendente |
| 24 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | Evangelho | Lc 2,1-14 | I/O/G | NORMAL | Pendente | Pendente |
| 25 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | 1ª leitura | Is 62,11-12 | I/O/G | NORMAL | Pendente | Pendente |
| 26 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | Salmo | Sl 97 | I/O/G | ALTA | Pendente | Pendente |
| 27 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | 2ª leitura | Tt 3,4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 28 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | Evangelho | Lc 2,15-20 | I/O/G | NORMAL | Pendente | Pendente |
| 29 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | 1ª leitura | Is 52,7-10 | I/O/G | NORMAL | Pendente | Pendente |
| 30 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | Salmo | Sl 98 | I/O/G | ALTA | Pendente | Pendente |
| 31 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | 2ª leitura | Hb 1,1-6 | I/O/G | NORMAL | Pendente | Pendente |
| 32 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | Evangelho | Jo 1,1-18 | I/O/G | ALTA | Pendente | Pendente |
| 33 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | 1ª leitura | 1Sm 1,20-22.24-28 ou Eclo 3,2-6.12-14 | I/O/G | ALTA | Pendente | Pendente |
| 34 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | Salmo | Sl 84 ou Sl 128 | I/O/G | ALTA | Pendente | Pendente |
| 35 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | 2ª leitura | 1Jo 3,1-2.21-24 ou Cl 3,12-21 | I/O/G | ALTA | Pendente | Pendente |
| 36 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | Evangelho | Lc 2,41-52 | I/O/G | NORMAL | Pendente | Pendente |
| 37 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | 1ª leitura | Nm 6,22-27 | I/O/G | NORMAL | Pendente | Pendente |
| 38 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | Salmo | Sl 67 | I/O/G | ALTA | Pendente | Pendente |
| 39 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | 2ª leitura | Gl 4,4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 40 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | Evangelho | Lc 2,16-21 | I/O/G | NORMAL | Pendente | Pendente |
| 41 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | 1ª leitura | Is 60,1-6 | I/O/G | NORMAL | Pendente | Pendente |
| 42 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | Salmo | Sl 72 | I/O/G | ALTA | Pendente | Pendente |
| 43 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | 2ª leitura | Ef 3,2-3.5-6 | I/O/G | NORMAL | Pendente | Pendente |
| 44 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | Evangelho | Mt 2,1-12 | I/O/G | NORMAL | Pendente | Pendente |
| 45 | CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Batismo do Senhor | Evangelho | Lc 3,15-16.21-22 | I/O/G | NORMAL | Pendente | Pendente |
| 46 | TEMPO COMUM — ANO C | 2º Domingo | 1ª leitura | Is 62,1-5 | I/O/G | NORMAL | Pendente | Pendente |
| 47 | TEMPO COMUM — ANO C | 2º Domingo | Salmo | Sl 96 | I/O/G | ALTA | Pendente | Pendente |
| 48 | TEMPO COMUM — ANO C | 2º Domingo | 2ª leitura | 1Cor 12,4-11 | I/O/G | NORMAL | Pendente | Pendente |
| 49 | TEMPO COMUM — ANO C | 2º Domingo | Evangelho | Jo 2,1-11 | I/O/G | NORMAL | Pendente | Pendente |
| 50 | TEMPO COMUM — ANO C | 3º Domingo | 1ª leitura | Ne 8,2-4.5-6.8-10 | I/O/G | NORMAL | Pendente | Pendente |
| 51 | TEMPO COMUM — ANO C | 3º Domingo | Salmo | Sl 19 | I/O/G | ALTA | Pendente | Pendente |
| 52 | TEMPO COMUM — ANO C | 3º Domingo | 2ª leitura | 1Cor 12,12-30 | I/O/G | ALTA | Pendente | Pendente |
| 53 | TEMPO COMUM — ANO C | 3º Domingo | Evangelho | Lc 1,1-4; 4,14-21 | I/O/G | NORMAL | Pendente | Pendente |
| 54 | TEMPO COMUM — ANO C | 4º Domingo | 1ª leitura | Jr 1,4-5.17-19 | I/O/G | NORMAL | Pendente | Pendente |
| 55 | TEMPO COMUM — ANO C | 4º Domingo | Salmo | Sl 71 | I/O/G | ALTA | Pendente | Pendente |
| 56 | TEMPO COMUM — ANO C | 4º Domingo | 2ª leitura | 1Cor 12,31–13,13 | I/O/G | ALTA | Pendente | Pendente |
| 57 | TEMPO COMUM — ANO C | 4º Domingo | Evangelho | Lc 4,21-30 | I/O/G | NORMAL | Pendente | Pendente |
| 58 | TEMPO COMUM — ANO C | 5º Domingo | 1ª leitura | Is 6,1-2.3-8 | I/O/G | NORMAL | Pendente | Pendente |
| 59 | TEMPO COMUM — ANO C | 5º Domingo | Salmo | Sl 138 | I/O/G | ALTA | Pendente | Pendente |
| 60 | TEMPO COMUM — ANO C | 5º Domingo | 2ª leitura | 1Cor 15,1-11 | I/O/G | ALTA | Pendente | Pendente |
| 61 | TEMPO COMUM — ANO C | 5º Domingo | Evangelho | Lc 5,1-11 | I/O/G | NORMAL | Pendente | Pendente |
| 62 | TEMPO COMUM — ANO C | 6º Domingo | 1ª leitura | Jr 17,5-8 | I/O/G | NORMAL | Pendente | Pendente |
| 63 | TEMPO COMUM — ANO C | 6º Domingo | Salmo | Sl 1 | I/O/G | ALTA | Pendente | Pendente |
| 64 | TEMPO COMUM — ANO C | 6º Domingo | 2ª leitura | 1Cor 15,12.16-20 | I/O/G | NORMAL | Pendente | Pendente |
| 65 | TEMPO COMUM — ANO C | 6º Domingo | Evangelho | Lc 6,17.20-26 | I/O/G | NORMAL | Pendente | Pendente |
| 66 | TEMPO COMUM — ANO C | 7º Domingo | 1ª leitura | 1Sm 26,2.7-9.12-13.22-23 | I/O/G | NORMAL | Pendente | Pendente |
| 67 | TEMPO COMUM — ANO C | 7º Domingo | Salmo | Sl 103 | I/O/G | ALTA | Pendente | Pendente |
| 68 | TEMPO COMUM — ANO C | 7º Domingo | 2ª leitura | 1Cor 15,45-49 | I/O/G | NORMAL | Pendente | Pendente |
| 69 | TEMPO COMUM — ANO C | 7º Domingo | Evangelho | Lc 6,27-38 | I/O/G | NORMAL | Pendente | Pendente |
| 70 | TEMPO COMUM — ANO C | 8º Domingo | 1ª leitura | Eclo 27,4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 71 | TEMPO COMUM — ANO C | 8º Domingo | Salmo | Sl 92 | I/O/G | ALTA | Pendente | Pendente |
| 72 | TEMPO COMUM — ANO C | 8º Domingo | 2ª leitura | 1Cor 15,54-58 | I/O/G | NORMAL | Pendente | Pendente |
| 73 | TEMPO COMUM — ANO C | 8º Domingo | Evangelho | Lc 6,39-45 | I/O/G | NORMAL | Pendente | Pendente |
| 74 | TEMPO COMUM — ANO C | 9º Domingo | 1ª leitura | 1Rs 8,41-43 | I/O/G | NORMAL | Pendente | Pendente |
| 75 | TEMPO COMUM — ANO C | 9º Domingo | Salmo | Sl 117 | I/O/G | ALTA | Pendente | Pendente |
| 76 | TEMPO COMUM — ANO C | 9º Domingo | 2ª leitura | Gl 1,1-2.6-10 | I/O/G | NORMAL | Pendente | Pendente |
| 77 | TEMPO COMUM — ANO C | 9º Domingo | Evangelho | Lc 7,1-10 | I/O/G | NORMAL | Pendente | Pendente |
| 78 | TEMPO COMUM — ANO C | 10º Domingo | 1ª leitura | 1Rs 17,17-24 | I/O/G | NORMAL | Pendente | Pendente |
| 79 | TEMPO COMUM — ANO C | 10º Domingo | Salmo | Sl 30 | I/O/G | ALTA | Pendente | Pendente |
| 80 | TEMPO COMUM — ANO C | 10º Domingo | 2ª leitura | Gl 1,11-19 | I/O/G | NORMAL | Pendente | Pendente |
| 81 | TEMPO COMUM — ANO C | 10º Domingo | Evangelho | Lc 7,11-17 | I/O/G | NORMAL | Pendente | Pendente |
| 82 | TEMPO COMUM — ANO C | 11º Domingo | 1ª leitura | 2Sm 12,7-10.13 | I/O/G | NORMAL | Pendente | Pendente |
| 83 | TEMPO COMUM — ANO C | 11º Domingo | Salmo | Sl 32 | I/O/G | ALTA | Pendente | Pendente |
| 84 | TEMPO COMUM — ANO C | 11º Domingo | 2ª leitura | Gl 2,16.19-21 | I/O/G | NORMAL | Pendente | Pendente |
| 85 | TEMPO COMUM — ANO C | 11º Domingo | Evangelho | Lc 7,36–8,3 | I/O/G | ALTA | Pendente | Pendente |
| 86 | TEMPO COMUM — ANO C | 12º Domingo | 1ª leitura | Zc 12,10-11; 13,1 | I/O/G | NORMAL | Pendente | Pendente |
| 87 | TEMPO COMUM — ANO C | 12º Domingo | Salmo | Sl 63 | I/O/G | ALTA | Pendente | Pendente |
| 88 | TEMPO COMUM — ANO C | 12º Domingo | 2ª leitura | Gl 3,26-29 | I/O/G | NORMAL | Pendente | Pendente |
| 89 | TEMPO COMUM — ANO C | 12º Domingo | Evangelho | Lc 9,18-24 | I/O/G | NORMAL | Pendente | Pendente |
| 90 | TEMPO COMUM — ANO C | 13º Domingo | 1ª leitura | 1Rs 19,16.19-21 | I/O/G | NORMAL | Pendente | Pendente |
| 91 | TEMPO COMUM — ANO C | 13º Domingo | Salmo | Sl 16 | I/O/G | ALTA | Pendente | Pendente |
| 92 | TEMPO COMUM — ANO C | 13º Domingo | 2ª leitura | Gl 5,1.13-18 | I/O/G | NORMAL | Pendente | Pendente |
| 93 | TEMPO COMUM — ANO C | 13º Domingo | Evangelho | Lc 9,51-62 | I/O/G | NORMAL | Pendente | Pendente |
| 94 | TEMPO COMUM — ANO C | 14º Domingo | 1ª leitura | Is 66,10-14 | I/O/G | NORMAL | Pendente | Pendente |
| 95 | TEMPO COMUM — ANO C | 14º Domingo | Salmo | Sl 66 | I/O/G | ALTA | Pendente | Pendente |
| 96 | TEMPO COMUM — ANO C | 14º Domingo | 2ª leitura | Gl 6,14-18 | I/O/G | NORMAL | Pendente | Pendente |
| 97 | TEMPO COMUM — ANO C | 14º Domingo | Evangelho | Lc 10,1-12.17-20 | I/O/G | ALTA | Pendente | Pendente |
| 98 | TEMPO COMUM — ANO C | 15º Domingo | 1ª leitura | Dt 30,10-14 | I/O/G | NORMAL | Pendente | Pendente |
| 99 | TEMPO COMUM — ANO C | 15º Domingo | Salmo | Sl 69 | I/O/G | ALTA | Pendente | Pendente |
| 100 | TEMPO COMUM — ANO C | 15º Domingo | 2ª leitura | Cl 1,15-20 | I/O/G | NORMAL | Pendente | Pendente |
| 101 | TEMPO COMUM — ANO C | 15º Domingo | Evangelho | Lc 10,25-37 | I/O/G | CRÍTICA | Pendente | Pendente |
| 102 | TEMPO COMUM — ANO C | 16º Domingo | 1ª leitura | Gn 18,1-10 | I/O/G | NORMAL | Pendente | Pendente |
| 103 | TEMPO COMUM — ANO C | 16º Domingo | Salmo | Sl 15 | I/O/G | ALTA | Pendente | Pendente |
| 104 | TEMPO COMUM — ANO C | 16º Domingo | 2ª leitura | Cl 1,24-28 | I/O/G | NORMAL | Pendente | Pendente |
| 105 | TEMPO COMUM — ANO C | 16º Domingo | Evangelho | Lc 10,38-42 | I/O/G | NORMAL | Pendente | Pendente |
| 106 | TEMPO COMUM — ANO C | 17º Domingo | 1ª leitura | Gn 18,20-32 | I/O/G | NORMAL | Pendente | Pendente |
| 107 | TEMPO COMUM — ANO C | 17º Domingo | Salmo | Sl 138 | I/O/G | ALTA | Pendente | Pendente |
| 108 | TEMPO COMUM — ANO C | 17º Domingo | 2ª leitura | Cl 2,12-14 | I/O/G | NORMAL | Pendente | Pendente |
| 109 | TEMPO COMUM — ANO C | 17º Domingo | Evangelho | Lc 11,1-13 | I/O/G | NORMAL | Pendente | Pendente |
| 110 | TEMPO COMUM — ANO C | 18º Domingo | 1ª leitura | Ecl 1,2; 2,21-23 | I/O/G | NORMAL | Pendente | Pendente |
| 111 | TEMPO COMUM — ANO C | 18º Domingo | Salmo | Sl 90 | I/O/G | ALTA | Pendente | Pendente |
| 112 | TEMPO COMUM — ANO C | 18º Domingo | 2ª leitura | Cl 3,1-5.9-11 | I/O/G | NORMAL | Pendente | Pendente |
| 113 | TEMPO COMUM — ANO C | 18º Domingo | Evangelho | Lc 12,13-21 | I/O/G | NORMAL | Pendente | Pendente |
| 114 | TEMPO COMUM — ANO C | 19º Domingo | 1ª leitura | Sb 18,6-9 | I/O/G | NORMAL | Pendente | Pendente |
| 115 | TEMPO COMUM — ANO C | 19º Domingo | Salmo | Sl 33 | I/O/G | ALTA | Pendente | Pendente |
| 116 | TEMPO COMUM — ANO C | 19º Domingo | 2ª leitura | Hb 11,1-2.8-19 | I/O/G | ALTA | Pendente | Pendente |
| 117 | TEMPO COMUM — ANO C | 19º Domingo | Evangelho | Lc 12,32-48 | I/O/G | ALTA | Pendente | Pendente |
| 118 | TEMPO COMUM — ANO C | 20º Domingo | 1ª leitura | Jr 38,4-6.8-10 | I/O/G | NORMAL | Pendente | Pendente |
| 119 | TEMPO COMUM — ANO C | 20º Domingo | Salmo | Sl 40 | I/O/G | ALTA | Pendente | Pendente |
| 120 | TEMPO COMUM — ANO C | 20º Domingo | 2ª leitura | Hb 12,1-4 | I/O/G | NORMAL | Pendente | Pendente |
| 121 | TEMPO COMUM — ANO C | 20º Domingo | Evangelho | Lc 12,49-53 | I/O/G | NORMAL | Pendente | Pendente |
| 122 | TEMPO COMUM — ANO C | 21º Domingo | 1ª leitura | Is 66,18-21 | I/O/G | NORMAL | Pendente | Pendente |
| 123 | TEMPO COMUM — ANO C | 21º Domingo | Salmo | Sl 117 | I/O/G | ALTA | Pendente | Pendente |
| 124 | TEMPO COMUM — ANO C | 21º Domingo | 2ª leitura | Hb 12,5-7.11-13 | I/O/G | NORMAL | Pendente | Pendente |
| 125 | TEMPO COMUM — ANO C | 21º Domingo | Evangelho | Lc 13,22-30 | I/O/G | NORMAL | Pendente | Pendente |
| 126 | TEMPO COMUM — ANO C | 22º Domingo | 1ª leitura | Eclo 3,17-18.20.28-29 | I/O/G | NORMAL | Pendente | Pendente |
| 127 | TEMPO COMUM — ANO C | 22º Domingo | Salmo | Sl 68 | I/O/G | ALTA | Pendente | Pendente |
| 128 | TEMPO COMUM — ANO C | 22º Domingo | 2ª leitura | Hb 12,18-19.22-24 | I/O/G | NORMAL | Pendente | Pendente |
| 129 | TEMPO COMUM — ANO C | 22º Domingo | Evangelho | Lc 14,1.7-14 | I/O/G | NORMAL | Pendente | Pendente |
| 130 | TEMPO COMUM — ANO C | 23º Domingo | 1ª leitura | Sb 9,13-18 | I/O/G | NORMAL | Pendente | Pendente |
| 131 | TEMPO COMUM — ANO C | 23º Domingo | Salmo | Sl 90 | I/O/G | ALTA | Pendente | Pendente |
| 132 | TEMPO COMUM — ANO C | 23º Domingo | 2ª leitura | Fm 9-10.12-17 | I/O/G | NORMAL | Pendente | Pendente |
| 133 | TEMPO COMUM — ANO C | 23º Domingo | Evangelho | Lc 14,25-33 | I/O/G | NORMAL | Pendente | Pendente |
| 134 | TEMPO COMUM — ANO C | 24º Domingo | 1ª leitura | Ex 32,7-11.13-14 | I/O/G | NORMAL | Pendente | Pendente |
| 135 | TEMPO COMUM — ANO C | 24º Domingo | Salmo | Sl 51 | I/O/G | ALTA | Pendente | Pendente |
| 136 | TEMPO COMUM — ANO C | 24º Domingo | 2ª leitura | 1Tm 1,12-17 | I/O/G | NORMAL | Pendente | Pendente |
| 137 | TEMPO COMUM — ANO C | 24º Domingo | Evangelho | Lc 15,1-32 | I/O/G | CRÍTICA | Pendente | Pendente |
| 138 | TEMPO COMUM — ANO C | 25º Domingo | 1ª leitura | Am 8,4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 139 | TEMPO COMUM — ANO C | 25º Domingo | Salmo | Sl 113 | I/O/G | ALTA | Pendente | Pendente |
| 140 | TEMPO COMUM — ANO C | 25º Domingo | 2ª leitura | 1Tm 2,1-8 | I/O/G | NORMAL | Pendente | Pendente |
| 141 | TEMPO COMUM — ANO C | 25º Domingo | Evangelho | Lc 16,1-13 | I/O/G | ALTA | Pendente | Pendente |
| 142 | TEMPO COMUM — ANO C | 26º Domingo | 1ª leitura | Am 6,1.4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 143 | TEMPO COMUM — ANO C | 26º Domingo | Salmo | Sl 146 | I/O/G | ALTA | Pendente | Pendente |
| 144 | TEMPO COMUM — ANO C | 26º Domingo | 2ª leitura | 1Tm 6,11-16 | I/O/G | NORMAL | Pendente | Pendente |
| 145 | TEMPO COMUM — ANO C | 26º Domingo | Evangelho | Lc 16,19-31 | I/O/G | NORMAL | Pendente | Pendente |
| 146 | TEMPO COMUM — ANO C | 27º Domingo | 1ª leitura | Hab 1,2-3; 2,2-4 | I/O/G | NORMAL | Pendente | Pendente |
| 147 | TEMPO COMUM — ANO C | 27º Domingo | Salmo | Sl 95 | I/O/G | ALTA | Pendente | Pendente |
| 148 | TEMPO COMUM — ANO C | 27º Domingo | 2ª leitura | 2Tm 1,6-8.13-14 | I/O/G | NORMAL | Pendente | Pendente |
| 149 | TEMPO COMUM — ANO C | 27º Domingo | Evangelho | Lc 17,5-10 | I/O/G | NORMAL | Pendente | Pendente |
| 150 | TEMPO COMUM — ANO C | 28º Domingo | 1ª leitura | 2Rs 5,14-17 | I/O/G | NORMAL | Pendente | Pendente |
| 151 | TEMPO COMUM — ANO C | 28º Domingo | Salmo | Sl 98 | I/O/G | ALTA | Pendente | Pendente |
| 152 | TEMPO COMUM — ANO C | 28º Domingo | 2ª leitura | 2Tm 2,8-13 | I/O/G | NORMAL | Pendente | Pendente |
| 153 | TEMPO COMUM — ANO C | 28º Domingo | Evangelho | Lc 17,11-19 | I/O/G | NORMAL | Pendente | Pendente |
| 154 | TEMPO COMUM — ANO C | 29º Domingo | 1ª leitura | Ex 17,8-13 | I/O/G | NORMAL | Pendente | Pendente |
| 155 | TEMPO COMUM — ANO C | 29º Domingo | Salmo | Sl 121 | I/O/G | ALTA | Pendente | Pendente |
| 156 | TEMPO COMUM — ANO C | 29º Domingo | 2ª leitura | 2Tm 3,14–4,2 | I/O/G | NORMAL | Pendente | Pendente |
| 157 | TEMPO COMUM — ANO C | 29º Domingo | Evangelho | Lc 18,1-8 | I/O/G | NORMAL | Pendente | Pendente |
| 158 | TEMPO COMUM — ANO C | 30º Domingo | 1ª leitura | Eclo 35,12-14.16-18 | I/O/G | NORMAL | Pendente | Pendente |
| 159 | TEMPO COMUM — ANO C | 30º Domingo | Salmo | Sl 34 | I/O/G | ALTA | Pendente | Pendente |
| 160 | TEMPO COMUM — ANO C | 30º Domingo | 2ª leitura | 2Tm 4,6-8.16-18 | I/O/G | NORMAL | Pendente | Pendente |
| 161 | TEMPO COMUM — ANO C | 30º Domingo | Evangelho | Lc 18,9-14 | I/O/G | NORMAL | Pendente | Pendente |
| 162 | TEMPO COMUM — ANO C | 31º Domingo | 1ª leitura | Sb 11,22–12,2 | I/O/G | NORMAL | Pendente | Pendente |
| 163 | TEMPO COMUM — ANO C | 31º Domingo | Salmo | Sl 145 | I/O/G | ALTA | Pendente | Pendente |
| 164 | TEMPO COMUM — ANO C | 31º Domingo | 2ª leitura | 2Ts 1,11–2,2 | I/O/G | NORMAL | Pendente | Pendente |
| 165 | TEMPO COMUM — ANO C | 31º Domingo | Evangelho | Lc 19,1-10 | I/O/G | NORMAL | Pendente | Pendente |
| 166 | TEMPO COMUM — ANO C | 32º Domingo | 1ª leitura | 2Mc 7,1-2.9-14 | I/O/G | NORMAL | Pendente | Pendente |
| 167 | TEMPO COMUM — ANO C | 32º Domingo | Salmo | Sl 17 | I/O/G | ALTA | Pendente | Pendente |
| 168 | TEMPO COMUM — ANO C | 32º Domingo | 2ª leitura | 2Ts 2,16–3,5 | I/O/G | NORMAL | Pendente | Pendente |
| 169 | TEMPO COMUM — ANO C | 32º Domingo | Evangelho | Lc 20,27-38 | I/O/G | ALTA | Pendente | Pendente |
| 170 | TEMPO COMUM — ANO C | 33º Domingo | 1ª leitura | Ml 3,19-20 | I/O/G | NORMAL | Pendente | Pendente |
| 171 | TEMPO COMUM — ANO C | 33º Domingo | Salmo | Sl 98 | I/O/G | ALTA | Pendente | Pendente |
| 172 | TEMPO COMUM — ANO C | 33º Domingo | 2ª leitura | 2Ts 3,7-12 | I/O/G | NORMAL | Pendente | Pendente |
| 173 | TEMPO COMUM — ANO C | 33º Domingo | Evangelho | Lc 21,5-19 | I/O/G | NORMAL | Pendente | Pendente |
| 174 | TEMPO COMUM — ANO C | 34º Domingo — Cristo Rei | 1ª leitura | 2Sm 5,1-3 | I/O/G | NORMAL | Pendente | Pendente |
| 175 | TEMPO COMUM — ANO C | 34º Domingo — Cristo Rei | Salmo | Sl 122 | I/O/G | ALTA | Pendente | Pendente |
| 176 | TEMPO COMUM — ANO C | 34º Domingo — Cristo Rei | 2ª leitura | Cl 1,12-20 | I/O/G | NORMAL | Pendente | Pendente |
| 177 | TEMPO COMUM — ANO C | 34º Domingo — Cristo Rei | Evangelho | Lc 23,35-43 | I/O/G | NORMAL | Pendente | Pendente |
| 178 | QUARESMA | 1º Domingo | 1ª leitura | Dt 26,4-10 | I/O/G | NORMAL | Pendente | Pendente |
| 179 | QUARESMA | 1º Domingo | Salmo | Sl 91 | I/O/G | ALTA | Pendente | Pendente |
| 180 | QUARESMA | 1º Domingo | 2ª leitura | Rm 10,8-13 | I/O/G | NORMAL | Pendente | Pendente |
| 181 | QUARESMA | 1º Domingo | Evangelho | Lc 4,1-13 | I/O/G | NORMAL | Pendente | Pendente |
| 182 | QUARESMA | 2º Domingo | 1ª leitura | Gn 15,5-12.17-18 | I/O/G | NORMAL | Pendente | Pendente |
| 183 | QUARESMA | 2º Domingo | Salmo | Sl 27 | I/O/G | ALTA | Pendente | Pendente |
| 184 | QUARESMA | 2º Domingo | 2ª leitura | Fl 3,17–4,1 | I/O/G | ALTA | Pendente | Pendente |
| 185 | QUARESMA | 2º Domingo | Evangelho | Lc 9,28-36 | I/O/G | NORMAL | Pendente | Pendente |
| 186 | QUARESMA | 3º Domingo | 1ª leitura | Ex 3,1-8.13-15 | I/O/G | NORMAL | Pendente | Pendente |
| 187 | QUARESMA | 3º Domingo | Salmo | Sl 103 | I/O/G | ALTA | Pendente | Pendente |
| 188 | QUARESMA | 3º Domingo | 2ª leitura | 1Cor 10,1-6.10-12 | I/O/G | NORMAL | Pendente | Pendente |
| 189 | QUARESMA | 3º Domingo | Evangelho | Lc 13,1-9 | I/O/G | NORMAL | Pendente | Pendente |
| 190 | QUARESMA | 4º Domingo | 1ª leitura | Js 5,9-12 | I/O/G | NORMAL | Pendente | Pendente |
| 191 | QUARESMA | 4º Domingo | Salmo | Sl 34 | I/O/G | ALTA | Pendente | Pendente |
| 192 | QUARESMA | 4º Domingo | 2ª leitura | 2Cor 5,17-21 | I/O/G | NORMAL | Pendente | Pendente |
| 193 | QUARESMA | 4º Domingo | Evangelho | Lc 15,1-3.11-32 | I/O/G | NORMAL | Pendente | Pendente |
| 194 | QUARESMA | 5º Domingo | 1ª leitura | Is 43,16-21 | I/O/G | NORMAL | Pendente | Pendente |
| 195 | QUARESMA | 5º Domingo | Salmo | Sl 126 | I/O/G | ALTA | Pendente | Pendente |
| 196 | QUARESMA | 5º Domingo | 2ª leitura | Fl 3,8-14 | I/O/G | NORMAL | Pendente | Pendente |
| 197 | QUARESMA | 5º Domingo | Evangelho | Jo 8,1-11 | I/O/G | NORMAL | Pendente | Pendente |
| 198 | QUARESMA | Domingo de Ramos e da Paixão | Procissão | Lc 19,28-40 | I/O/G | NORMAL | Pendente | Pendente |
| 199 | QUARESMA | Domingo de Ramos e da Paixão | 1ª leitura | Is 50,4-7 | I/O/G | NORMAL | Pendente | Pendente |
| 200 | QUARESMA | Domingo de Ramos e da Paixão | Salmo | Sl 22 | I/O/G | ALTA | Pendente | Pendente |
| 201 | QUARESMA | Domingo de Ramos e da Paixão | 2ª leitura | Fl 2,6-11 | I/O/G | NORMAL | Pendente | Pendente |
| 202 | QUARESMA | Domingo de Ramos e da Paixão | Paixão | Lc 22,14–23,56 | I/O/G | CRÍTICA | Pendente | Pendente |
| 203 | PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | 1ª leitura | At 10,34.37-43 | I/O/G | NORMAL | Pendente | Pendente |
| 204 | PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | Salmo | Sl 118 | I/O/G | ALTA | Pendente | Pendente |
| 205 | PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | 2ª leitura | Cl 3,1-4 ou 1Cor 5,6-8 | I/O/G | ALTA | Pendente | Pendente |
| 206 | PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | Evangelho | Jo 20,1-9 | I/O/G | NORMAL | Pendente | Pendente |
| 207 | PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | 1ª leitura | At 5,12-16 | I/O/G | NORMAL | Pendente | Pendente |
| 208 | PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | Salmo | Sl 118 | I/O/G | ALTA | Pendente | Pendente |
| 209 | PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | 2ª leitura | Ap 1,9-11.12-13.17-19 | I/O/G | NORMAL | Pendente | Pendente |
| 210 | PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | Evangelho | Jo 20,19-31 | I/O/G | NORMAL | Pendente | Pendente |
| 211 | PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | 1ª leitura | At 5,27-32.40-41 | I/O/G | NORMAL | Pendente | Pendente |
| 212 | PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | Salmo | Sl 30 | I/O/G | ALTA | Pendente | Pendente |
| 213 | PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | 2ª leitura | Ap 5,11-14 | I/O/G | NORMAL | Pendente | Pendente |
| 214 | PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | Evangelho | Jo 21,1-19 | I/O/G | ALTA | Pendente | Pendente |
| 215 | PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | 1ª leitura | At 13,14.43-52 | I/O/G | NORMAL | Pendente | Pendente |
| 216 | PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | Salmo | Sl 100 | I/O/G | ALTA | Pendente | Pendente |
| 217 | PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | 2ª leitura | Ap 7,9.14-17 | I/O/G | NORMAL | Pendente | Pendente |
| 218 | PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | Evangelho | Jo 10,27-30 | I/O/G | NORMAL | Pendente | Pendente |
| 219 | PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | 1ª leitura | At 14,21-27 | I/O/G | NORMAL | Pendente | Pendente |
| 220 | PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | Salmo | Sl 145 | I/O/G | ALTA | Pendente | Pendente |
| 221 | PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | 2ª leitura | Ap 21,1-5 | I/O/G | NORMAL | Pendente | Pendente |
| 222 | PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | Evangelho | Jo 13,31-33.34-35 | I/O/G | NORMAL | Pendente | Pendente |
| 223 | PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | 1ª leitura | At 15,1-2.22-29 | I/O/G | NORMAL | Pendente | Pendente |
| 224 | PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | Salmo | Sl 67 | I/O/G | ALTA | Pendente | Pendente |
| 225 | PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | 2ª leitura | Ap 21,10-14.22-23 | I/O/G | NORMAL | Pendente | Pendente |
| 226 | PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | Evangelho | Jo 14,23-29 | I/O/G | NORMAL | Pendente | Pendente |
| 227 | PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | 1ª leitura | At 1,1-11 | I/O/G | NORMAL | Pendente | Pendente |
| 228 | PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | Salmo | Sl 47 | I/O/G | ALTA | Pendente | Pendente |
| 229 | PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | 2ª leitura | Ef 1,17-23 | I/O/G | NORMAL | Pendente | Pendente |
| 230 | PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | Evangelho | Lc 24,46-53 | I/O/G | NORMAL | Pendente | Pendente |
| 231 | PÁSCOA E TEMPO PASCAL | Pentecostes | 1ª leitura | At 2,1-11 | I/O/G | NORMAL | Pendente | Pendente |
| 232 | PÁSCOA E TEMPO PASCAL | Pentecostes | Salmo | Sl 104 | I/O/G | ALTA | Pendente | Pendente |
| 233 | PÁSCOA E TEMPO PASCAL | Pentecostes | 2ª leitura | 1Cor 12,3-7.12-13 | I/O/G | NORMAL | Pendente | Pendente |
| 234 | PÁSCOA E TEMPO PASCAL | Pentecostes | Evangelho | Jo 20,19-23 | I/O/G | NORMAL | Pendente | Pendente |
| 235 | SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | 1ª leitura | Pr 8,22-31 | I/O/G | NORMAL | Pendente | Pendente |
| 236 | SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | Salmo | Sl 8 | I/O/G | ALTA | Pendente | Pendente |
| 237 | SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | 2ª leitura | Rm 5,1-5 | I/O/G | NORMAL | Pendente | Pendente |
| 238 | SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | Evangelho | Jo 16,12-15 | I/O/G | NORMAL | Pendente | Pendente |

## 5. Critérios de conclusão individual

Para mudar um item de **Pendente** para **Revisão editorial concluída**, registrar: (1) edição/texto de origem conferidos e referência correta; (2) cobertura de todos os versículos realmente proclamados; (3) sujeitos, verbos, pronomes, relações causais e temporais, negação, comparação e condição; (4) personagens, interlocutores e roteiro espacial; (5) identificação separada de informação bíblica, interpretação teológica, orientação visual e glosa proposta; (6) variantes, rubricas ou estruturas de refrão quando houver; (7) revisor, data e histórico da correção. Para **Validação em Libras concluída**, exigir comprovação específica de ensaio e avaliação humana, não apenas texto escrito.

## 6. Integridade e publicação

A inspeção de conteúdo confirmou a existência de `app.js`, `lectionary-data.js`, `liturgy-originals-c.js`, glosas compartilhadas, `liturgy-pdf.js`, estruturas de salmos e workflow `.github/workflows/deploy.yml`, que direciona o FTP para `./public_html/caminhosdapalavra/` na Locaweb. **Ainda não equivale a teste de sintaxe de todos os JS, teste funcional da navegação/PDF ou confirmação de publicação.** Registrar resultados somente após execução observável.

## 7. Resumo de situação

- Celebrações inventariadas: **60**.
- Itens inventariados: **238**.
- Texto de origem vinculado: **238**.
- Glosa-base vinculada: **238**.
- Revisões integrais comprovadamente concluídas nesta rodada: **0**.
- Prioridades por triagem: NORMAL 160; ALTA 75; CRÍTICA 3.
- Pendentes: revisão exaustiva de 238 itens, validação em Libras, conferência editorial do texto de origem e testes de publicação.
- Arquivos dos anos A e B: **não modificar**.
