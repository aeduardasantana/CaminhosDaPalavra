# Revisão editorial das glosas — Ano A

**Última atualização:** 10/10/2026 · **Projeto:** Caminhos da Palavra / GEB Tecnologia

> A glosa é um roteiro escrito de preparação; não constitui interpretação em Libras nem tradução oficial. A revisão editorial em português é uma etapa distinta da validação linguística por pessoas surdas e intérpretes proficientes.

## 1. Estado real do acervo

| Indicador | Quantidade |
|---|---:|
| Celebrações Ano A | 60 |
| Itens litúrgicos com texto original importado | 241/241 |
| Itens com glosa-base cadastrada | 241/241 |
| Roteiros não salmódicos com revisão editorial ampliada | 32/181 |
| Salmos com refrão contextual próprio | 60/60 |
| Salmos com estrofes estruturadas individualmente | 13/60 |
| Salmos com estrofes ainda dependentes de conferência semântica | 47 |
| Outras leituras não salmódicas pendentes de revisão editorial ampliada | 149 |
| Leituras com as duas formas presentes no arquivo | 5 |
| Leituras identificadas somente como forma longa, sem forma breve incorporada | 11 |
| Itens cobertos por checagem estrutural no inventário CSV | 241/241 |
| Validação linguística formal em Libras | Não comprovada/documentada |

**Interpretação correta dos números:** 32 roteiros foram ampliados editorialmente; 13 salmos têm estrutura de estrofes explícita; os 47 salmos restantes receberam refrão por celebração, mas sua glosa-base ainda depende de revisão de estrofes. Assim, **196 itens** necessitam de revisão editorial detalhada adicional: 149 leituras e 47 salmos. Os 241 itens necessitam de homologação humana para qualquer alegação de validação em Libras.

## 2. Arquivos de controle

- [Matriz individual dos 241 itens (CSV)](./AUDITORIA-GLOSAS-ANO-A-241.csv): chave contextual, fonte, estado da glosa, variantes e alertas técnicos de cada leitura.
- `glosas-revisadas-ano-a.js`: 32 roteiros ampliados, identificados pelo contexto completo (ano, seção, celebração, tipo e referência).
- `psalm-glossa-context-ano-a.js`: contextos adicionais de refrão e estrofes próprios para Advento e Epifania.
- `psalm-glossa-context-2026-q4.js`: estruturas previamente cadastradas para salmos do fim do Tempo Comum do Ano A.
- `psalm-refrains-ano-a.js`: 47 refrões individuais sem estrutura de estrofes homologada.
- `liturgy-originals-a.js`: preservado como fonte original, sem edições nesta etapa.

## 3. Distribuição por tempo litúrgico

| Tempo/Seção | Celebrações | Itens | Roteiros ampliados | Salmos com estrofes estruturadas |
|---|---:|---:|---:|---:|
| ADVENTO | 4 | 16 | 12 | 4 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | 8 | 32 | 2 | 1 |
| TEMPO COMUM — ANO A | 33 | 132 | 12 | 8 |
| QUARESMA | 6 | 25 | 5 | 0 |
| PÁSCOA E TEMPO PASCAL | 8 | 32 | 1 | 0 |
| SOLENIDADES DOMINICAIS DO TEMPO COMUM | 1 | 4 | 0 | 0 |

### Advento: etapa editorial concluída por registro

Os quatro domingos do Advento têm 12 roteiros não salmódicos ampliados e quatro salmos com refrão e estrutura de estrofes contextualizados. Eles ainda dependem de ensaio e validação em Libras.

- **1º Domingo:** Sl 122, refração e quatro estrofes conforme o texto-fonte; leituras Is 2,1-5, Rm 13,11-14 e Mt 24,37-44 ampliadas.
- **2º Domingo:** Sl 72 de justiça e paz, distinto do Sl 72 da Epifania; leituras Is 11,1-10, Rm 15,4-9 e Mt 3,1-12 ampliadas.
- **3º Domingo:** Sl 146 com apenas os versos selecionados da celebração; a antiga glosa genérica incluía verso sobre príncipes que não estava no recorte do dia. Leituras Is 35,1-6.10, Tg 5,7-10 e Mt 11,2-11 ampliadas.
- **4º Domingo:** Sl 24 com o recorte próprio da celebração; a glosa genérica mencionava portas que não constavam nos versículos selecionados. Leituras Is 7,10-14, Rm 1,1-7 e Mt 1,18-24 ampliadas. A formulação de Is 7 foi alinhada ao texto original importado, mantendo 'virgem' em vez da alternativa não presente na fonte.

## 4. Outras leituras editoriais ampliadas

| Celebração/Seção | Item e referência |
|---|---|
| QUARESMA — 3º Domingo | evangelho · Jo 4,5-42 |
| QUARESMA — 4º Domingo | evangelho · Jo 9,1-41 |
| QUARESMA — 5º Domingo | evangelho · Jo 11,1-45 |
| QUARESMA — Domingo de Ramos e da Paixão | paixao · Mt 26,14–27,66 |
| QUARESMA — 1º Domingo | segunda-leitura · Rm 5,12-19 |
| TEMPO COMUM — ANO A — 6º Domingo | evangelho · Mt 5,17-37 |
| TEMPO COMUM — ANO A — 15º Domingo | evangelho · Mt 13,1-23 |
| PÁSCOA E TEMPO PASCAL — 3º Domingo da Páscoa | evangelho · Lc 24,13-35 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO — Natal — Vigília | evangelho · Mt 1,1-25 |
| TEMPO COMUM — ANO A — 16º Domingo | evangelho · Mt 13,24-43 |
| TEMPO COMUM — ANO A — 33º Domingo | evangelho · Mt 25,14-30 |
| TEMPO COMUM — ANO A — 34º Domingo — Cristo Rei | evangelho · Mt 25,31-46 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO — Natal — Dia | evangelho · Jo 1,1-18 |
| TEMPO COMUM — ANO A — 3º Domingo | evangelho · Mt 4,12-23 |
| TEMPO COMUM — ANO A — 17º Domingo | evangelho · Mt 13,44-52 |
| TEMPO COMUM — ANO A — 25º Domingo | evangelho · Mt 20,1-16 |
| TEMPO COMUM — ANO A — 26º Domingo | evangelho · Mt 21,28-32 |
| TEMPO COMUM — ANO A — 28º Domingo | evangelho · Mt 22,1-14 |
| TEMPO COMUM — ANO A — 32º Domingo | evangelho · Mt 25,1-13 |
| TEMPO COMUM — ANO A — 26º Domingo | segunda-leitura · Fl 2,1-11 |

## 5. Formas longa e breve

Existem **cinco** itens para os quais o material original importado contém explicitamente as duas formas. O site permite escolher qual forma visualizar, sem apagar a outra. Os roteiros de apoio indicam trechos correspondentes quando essa distinção foi revisada. A troca de texto-fonte não equivale a uma validação automática da glosa para a forma selecionada.

| Registro | Referência |
|---|---|
| 17º Domingo · TEMPO COMUM — ANO A | Mt 13,44-52 |
| 26º Domingo · TEMPO COMUM — ANO A | Fl 2,1-11 |
| 32º Domingo · TEMPO COMUM — ANO A | 1Ts 4,13-18 |
| 33º Domingo · TEMPO COMUM — ANO A | Mt 25,14-30 |
| 1º Domingo · QUARESMA | Rm 5,12-19 |

Em outros 11 itens, o texto original foi identificado como forma longa, mas não há uma forma breve importada nesse registro. A interface não deve inventar a versão ausente.

## 6. Salmos: correção de falsa equivalência

Os 60 salmos possuem refrão associado especificamente à celebração, evitando reaproveitamento indiscriminado do mesmo refrão quando o salmo se repete. **Somente 13** possuem organização explícita de estrofes no acervo atual. Nos outros **47**, as linhas da glosa-base são distribuídas preliminarmente para visualização, e o rótulo da interface explicita que o alinhamento é pendente.

Para cada um dos 47 restantes, falta confrontar os versículos realmente proclamados, a divisão por estrofes e a glosa semântica correspondente, bem como verificar variantes de refrão e alternâncias de papéis. Os salmos anteriores já estruturados também exigem validação em Libras.

## 7. Alertas editoriais e preservação do original

- Há registros importados com marcas de paginação, sinais de extração, remissões a refrões e grafias do português europeu. Esses sinais foram anotados para conferência documental, sem alterar silenciosamente o arquivo-base.
- O conteúdo do Lecionário importado não deve ser apresentado como tradução brasileira oficialmente homologada sem conferência de procedência e edição.
- Glosas longas e variantes não podem ser condensadas em sumários que omitam interlocutores, negações, encadeamento da narrativa ou partes proclamadas.
- Os arquivos de glosas-base anteriores foram preservados; os novos roteiros usam chaves específicas do Ano A, sem modificar os anos B e C.

## 8. Matriz por celebração

| Tempo | Celebração | Itens | Roteiros ampliados | Salmos com estrofes estruturadas |
|---|---|---:|---:|---:|
| ADVENTO | 1º Domingo | 4 | 3 | 1 |
| ADVENTO | 2º Domingo | 4 | 3 | 1 |
| ADVENTO | 3º Domingo | 4 | 3 | 1 |
| ADVENTO | 4º Domingo | 4 | 3 | 1 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Vigília | 4 | 1 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Noite | 4 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Aurora | 4 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Natal — Dia | 4 | 1 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Sagrada Família | 4 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Santa Maria, Mãe de Deus | 4 | 0 | 0 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Epifania do Senhor | 4 | 0 | 1 |
| CICLO DO NATAL — CELEBRAÇÕES DE REPERTÓRIO | Batismo do Senhor | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 2º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 3º Domingo | 4 | 1 | 0 |
| TEMPO COMUM — ANO A | 4º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 5º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 6º Domingo | 4 | 1 | 0 |
| TEMPO COMUM — ANO A | 7º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 8º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 9º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 10º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 11º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 12º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 13º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 14º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 15º Domingo | 4 | 1 | 0 |
| TEMPO COMUM — ANO A | 16º Domingo | 4 | 1 | 0 |
| TEMPO COMUM — ANO A | 17º Domingo | 4 | 1 | 0 |
| TEMPO COMUM — ANO A | 18º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 19º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 20º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 21º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 22º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 23º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 24º Domingo | 4 | 0 | 0 |
| TEMPO COMUM — ANO A | 25º Domingo | 4 | 1 | 0 |
| TEMPO COMUM — ANO A | 26º Domingo | 4 | 2 | 0 |
| TEMPO COMUM — ANO A | 27º Domingo | 4 | 0 | 1 |
| TEMPO COMUM — ANO A | 28º Domingo | 4 | 1 | 1 |
| TEMPO COMUM — ANO A | 29º Domingo | 4 | 0 | 1 |
| TEMPO COMUM — ANO A | 30º Domingo | 4 | 0 | 1 |
| TEMPO COMUM — ANO A | 31º Domingo | 4 | 0 | 1 |
| TEMPO COMUM — ANO A | 32º Domingo | 4 | 1 | 1 |
| TEMPO COMUM — ANO A | 33º Domingo | 4 | 1 | 1 |
| TEMPO COMUM — ANO A | 34º Domingo — Cristo Rei | 4 | 1 | 1 |
| QUARESMA | 1º Domingo | 4 | 1 | 0 |
| QUARESMA | 2º Domingo | 4 | 0 | 0 |
| QUARESMA | 3º Domingo | 4 | 1 | 0 |
| QUARESMA | 4º Domingo | 4 | 1 | 0 |
| QUARESMA | 5º Domingo | 4 | 1 | 0 |
| QUARESMA | Domingo de Ramos e da Paixão | 5 | 1 | 0 |
| PÁSCOA E TEMPO PASCAL | Domingo da Páscoa | 4 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 2º Domingo da Páscoa | 4 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 3º Domingo da Páscoa | 4 | 1 | 0 |
| PÁSCOA E TEMPO PASCAL | 4º Domingo da Páscoa | 4 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 5º Domingo da Páscoa | 4 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | 6º Domingo da Páscoa | 4 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | Ascensão do Senhor | 4 | 0 | 0 |
| PÁSCOA E TEMPO PASCAL | Pentecostes | 4 | 0 | 0 |
| SOLENIDADES DOMINICAIS DO TEMPO COMUM | Santíssima Trindade | 4 | 0 | 0 |

## 9. Testes e homologação

- Confirmar sintaxe dos scripts JavaScript, total de 241 chaves, referência original e glosa presente por item, unicidade das revisões contextuais e cobertura de 60 refrões.
- Validar visualização do texto original versus glosa no desktop/celular e PDF, incluindo troca de forma longa/breve e correspondência exata de estrofes.
- Verificar a publicação GitHub Actions → FTP/Locaweb. Um commit em `main` não comprova implantação concluída.
- Validar humanamente os roteiros escritos com intérpretes experientes e pessoas surdas proficientes, registrando a versão aprovada, data, responsáveis e eventuais ajustes.

**Status do projeto:** revisão editorial em andamento; a cobertura estrutural está completa, mas não há fundamento para afirmar que as 241 glosas estejam linguisticamente revisadas e homologadas.
