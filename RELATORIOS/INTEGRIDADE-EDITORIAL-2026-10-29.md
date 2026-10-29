# Auditoria de integridade editorial — 29/10/2026

## Escopo e método

Verificação estrutural automatizada do calendário, ciclos dominicais A/B/C, ciclo ferial I/II, mapa de leituras, vínculos de glosas, acervo local de novembro de 2025 e separação entre CNBB e Bíblia Ave-Maria.

A auditoria não altera textos bíblicos, referências ou glosas. Ela verifica vínculos e registra exceções que exigem decisão editorial. Os testes estruturais não equivalem a cotejo integral com o Lecionário, autorização de reprodução nem validação humana em Libras.

## Resultados estruturais

- **Calendário:** conferência de todos os dias de 2025 a 2030, matrizes mensais e transições de ciclo no Advento. O ciclo ferial I/II é conferido separadamente do ciclo dominical A/B/C.
- **Mapa mestre:** 180 celebrações, 60 por ciclo; 717 itens; 554 referências bíblicas distintas.
- **Glosas-base:** 555 chaves não vazias; as 554 referências distintas do mapa mestre têm correspondência. A presença de uma glosa não significa que ela esteja linguisticamente validada em Libras.
- **Glosas contextuais:** 32 entradas do Ano A, 181 do Ano B e 2 do Ano C. As chaves são conferidas contra ciclo, seção, celebração, tipo e referência.
- **Acervo brasileiro de novembro/2025:** 30 datas e 96 registros. Os IDs das leituras e as associações por tipo apontam para registros existentes. Um registro de salmo conserva uma referência-fonte mais ampla que o recorte diário.
- **Edições:** primeira leitura, segunda leitura e Evangelho podem selecionar CNBB ou Ave-Maria; salmo responsorial permanece CNBB. O acervo Ave-Maria está separado e, enquanto vazio, não pode ser preenchido por fallback CNBB.

## Pendências editoriais identificadas

### 1. Batismo do Senhor — duas glosas contextuais do Ano B

As glosas contextuais do Ano B para **Is 42,1-4.6-7** e **At 10,34-38** não encontram itens correspondentes no registro B do mapa mestre. As mesmas referências aparecem no registro A para o Batismo do Senhor. O registro B contém apenas Mc 1,7-11 e sua própria observação declara que as demais leituras têm variantes a validar antes da glosa.

A consulta brasileira para a Festa do Batismo do Senhor em 08/01/2024, identificada como Ano B, apresenta o conjunto Is 42,1-4.6-7; Sl 28(29); At 10,34-38; Mc 1,7-11:
https://espacoliturgicocnbb.com.br/v1/?dia=2024-01-08&p=liturgiaDiaria&s=verDia

Isso indica que o conjunto é uma opção litúrgica conhecida, mas não resolve por si só como o projeto deve representar as opções alternativas no mapa mestre. **As duas glosas permanecem como exceções explícitas, não como leituras B confirmadas por este acervo.** Para concluir o vínculo, a decisão editorial deve registrar a opção completa e sua fonte, incluindo o salmo correspondente, ou manter essas glosas fora da seleção padrão.

### 2. Salmo de 06/11/2025 — recorte mais específico que a fonte

A referência diária é **Sl 26(27),1.4.13-14 (R. 13)**, enquanto o registro importado do acervo identifica apenas **Sl 26(27)**. O ID e o tipo existem, mas a referência do acervo não comprova o recorte versicular. O pareamento não deve inventar alinhamento por versículo/estrofe até que o recorte seja conferido.

### 3. Bíblia Ave-Maria — acervo ainda vazio

O arquivo de Ave-Maria está estruturalmente separado, mas não contém textos importados. A interface deve continuar informando a indisponibilidade de texto/glosa dessa edição, sem substituir pela redação CNBB. A incorporação exige fonte, autorização e glosa própria vinculada ao ID do texto Ave-Maria.

## Critério de aceitação automatizada

O teste `tests/integridade-editorial.test.cjs` foi incluído nos workflows de validação. Ele:

1. verifica transições do calendário e ciclos A/B/C e I/II;
2. confere a estrutura dos 180 registros e os tipos de item;
3. exige glosa-base para cada referência distinta do mapa mestre;
4. valida chaves contextuais e permite somente as duas pendências do Batismo do Senhor documentadas acima;
5. verifica vínculos por data/tipo/ID do acervo brasileiro e a exceção de referência mais ampla de 06/11;
6. confirma que os acervos CNBB e Ave-Maria permanecem independentes e que não há fallback entre edições.

**Limite:** passar nos testes significa integridade estrutural dos dados cobertos, não aprovação litúrgica final, licenciamento dos textos ou homologação das glosas por intérpretes proficientes e pessoas surdas.
