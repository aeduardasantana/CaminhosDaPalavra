# BASE LITÚRGICA BRASILEIRA — 01/11/2025 a 31/10/2028

**Situação:** levantamento da proveniência e do modelo de dados iniciado; **1.096 datas a apurar individualmente**. Este documento NÃO afirma que leituras, salmos ou textos brasileiros tenham sido extraídos integralmente.

## Decisão editorial

A base atual `liturgy-originals-a.js`, `liturgy-originals-b.js` e `liturgy-originals-c.js` contém textos de fonte identificada como Lecionário europeu. Não substituí-los silenciosamente nem rotulá-los como lecionário brasileiro. O sistema precisará de fonte brasileira confirmada, com direitos de reprodução e proveniência por leitura. Conservar os originais existentes para auditoria/rollback até substituição validada.

## Recorte e ciclos
- 01/11/2025–29/11/2025: Ano C anterior.
- 30/11/2025–28/11/2026: Ano A (dominical); ferial II em 2026.
- 29/11/2026–27/11/2027: Ano B (dominical); ferial I em 2027.
- 28/11/2027–31/10/2028: Ano C (dominical); ferial II em 2028.
- Total: **1.096 dias**, incluindo o 29 de fevereiro de 2028.
- Em 2025 o ciclo ferial é I.
- O calendário brasileiro prevê transferências próprias e opções de celebração; uma data civil não identifica sempre apenas uma Missa.

## Fontes e papéis

1. **CNBB / Edições CNBB**: referência prioritária para textos litúrgicos brasileiros e conferência de uso/autorizações. https://www.cnbb.org.br/liturgia-diaria/ — redirecionamento de acesso editorial: https://liturgiadiaria.edicoescnbb.com.br/
2. **GCatholic Brasil**: repertório para organizar dias, tempos, santos, solenidades e transferências; não tratá-lo como fonte autorizadora de reprodução integral do Lecionário. https://gcatholic.org/calendar/2025/BR-pt ; https://gcatholic.org/calendar/2026/BR-pt ; https://gcatholic.org/calendar/2027/BR-pt ; https://gcatholic.org/calendar/2028/BR-pt
3. **Canção Nova**: conferência secundária de leituras efetivamente exibidas por dia. https://liturgia.cancaonova.com/pb/
4. **Sagrada Liturgia**: conferência secundária de anuário, semanas, tempos e cores. https://sagradaliturgia.com.br/liturgia_anuario.php
5. **Lírio Católico**: conferência secundária por dia. https://www.liriocatolico.com.br/liturgia_diaria/

**Atenção:** o GCatholic pode exibir termos de português europeu mesmo em BR-pt. A configuração brasileira e a língua textual não são a mesma coisa.

## Cadastro mínimo por data

- `date` (AAAA-MM-DD), `weekday`, `liturgicalYear` (A/B/C), `weekdayReadingCycle` (I/II).
- `season`, `week`, `celebration`, `rank`, `color`, `sourceCalendarUrl`.
- `readings[]` em sequência (primeira leitura, salmo: refrão e estrofes, segunda leitura quando houver, aclamação, Evangelho, Paixão e variantes quando ocorrerem); referência, forma longa/breve, texto de origem, edição, proveniência e autorização.
- `options[]` para celebrações ou leituras alternativas legitimamente previstas (não confundir com correções regionais).
- `status`: não apurado / referências conferidas / texto brasileiro licenciado / glosa revista / Libras validada.
- `localOverrides[]`: **camada posterior**, datada e justificada, separada dos dias-base nacionais (diocese, paróquia, transferência excepcional etc.).
- `audit`: quem revisou, data, diferença encontrada e referência documental.

## Lógica técnica

1. Importar/confirmar calendário nacional para as 1.096 datas.
2. Associar referências e variantes da liturgia diária com priorização de CNBB.
3. Resolver direitos e edição antes de copiar texto integral da versão brasileira ou gerar PDFs comparativos.
4. Associar glosas por **chave de ocorrência litúrgica**, não só referência bíblica compartilhada.
5. Marcar cada item como preliminar até revisão textual e validação especializada de Libras.
6. Preservar anos A e B aprovados no sistema enquanto a base substituta não estiver pronta.
7. Testar em ambiente de homologação datas-limite, Adventos, domingos transferidos, Quaresma, Tríduo, Solenidades e salmos variantes.
8. Aplicar overrides locais em tabela própria após a base nacional.
9. Somente então migrar a visualização do site e os PDFs para a base brasileira.

## Inventário quantitativo inicial

| Período | Dias | Ciclo dominical | Resultado |
|---|---:|---|---|
| 01/11/2025–29/11/2025 | 29 | C | pendente de apuração |
| 30/11/2025–28/11/2026 | 364 | A | pendente de apuração |
| 29/11/2026–27/11/2027 | 364 | B | pendente de apuração |
| 28/11/2027–31/10/2028 | 339 | C | pendente de apuração |
| **Total** | **1.096** | A/B/C | **0 datas com leituras brasileiras integralmente homologadas nesta tarefa** |

## Riscos identificados

- Fonte europeia exibida como se fosse Lecionário brasileiro.
- Uma lista de apenas 60 celebrações por ano não cobre liturgia diária.
- Refrões e delimitações de salmos são dependentes da celebração e da edição.
- Nem toda transposição de solenidade representa exceção local; muitas são parte do calendário brasileiro.
- Reprodução editorial de textos litúrgicos depende de conferência de direitos. Link externo é alternativa temporária, não licença presumida.
