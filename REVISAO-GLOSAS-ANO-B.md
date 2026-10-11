# Revisão editorial, bíblica e litúrgica — Ano B

**Atualização:** 11/10/2026 · **Projeto:** Caminhos da Palavra / GEB Tecnologia

> **Escopo e limite:** Foram produzidos ou preservados roteiros editoriais textuais para todos os registros do Ano B, com alinhamento explícito dos 60 salmos por celebração. Estes roteiros escritos NÃO equivalem à interpretação em Libras, não são traduções oficiais e ainda requerem cotejo detalhado de cada unidade textual, ensaio e validação com intérpretes e pessoas surdas proficientes.

## 1. Cobertura e inventário

| Indicador | Verificação |
|---|---:|
| Celebrações do Ano B | **60** |
| Itens literais em `lectionary-data.js` | **238** |
| Itens efetivamente exibidos, incluindo 3 complementos do Batismo | **241** |
| Textos-fonte identificados e presentes no cadastro | **241/241** |
| Glosas-base cadastradas | **241/241** |
| Roteiros editoriais não salmódicos contextualizados | **181/181** |
| Salmos com refrão específico e estrutura de estrofes | **60/60** |
| Registros sem roteiro contextual ou estrutura salmódica | **0** |
| Homologação humana registrada em Libras | **0** |

**Interpretação:** a cobertura editorial estrutural foi concluída no acervo cadastrado. Isso não comprova correspondência exaustiva verso a verso nos 181 roteiros, em particular a Paixão, nem validação linguística em Libras; a revisão semântica fina e o ensaio permanecem atividades de homologação.

## 2. Revisões realizadas nesta execução

- Identificados os **111 roteiros já revisados** anteriormente; foram preservados e acrescidos **70 roteiros novos**, incluindo as primeiras e segundas leituras de todos os domingos do Tempo Comum que permaneciam sem revisão e o Evangelho da Sagrada Família.
- Revisadas, em chave contextual, relações de personagens, interlocutores, temporalidade, negação e figuras de linguagem, com foco em exortações paulinas e narrativas do Antigo Testamento.
- Completadas as **32 estruturas de salmos que faltavam** no arquivo `psalm-glossa-context-ano-b-complemento.js`; carregadas após os refrões específicos e antes de `app.js`.
- Confirmada automaticamente a correspondência entre **60 estruturas de estrofes de glosa** e os respectivos **60 grupos de estrofes do texto litúrgico**. Esse teste avalia quantidades e posições, não homologa por si só o significado em Libras.
- Corrigidos o refrão dividido por ponto e vírgula e a segmentação de três estrofes do Salmo 32 do 6º Domingo do Tempo Comum; a alteração no parser afeta somente o ciclo B.
- Retiradas duas marcas documentadas de paginação inseridas dentro dos versos dos salmos de Cristo Rei e da Santíssima Trindade, preservando o texto anterior no histórico Git.
- Recuperado o texto integral da **Sagrada Família, Lc 2,22-40** (formas longa e breve) diretamente do PDF do Lecionário original vinculado ao projeto, páginas editoriais 90–91. A remissão anterior era incompleta e misturava texto da celebração seguinte.

## 3. Revisões específicas e pontos de atenção

**Marcos e João:** os roteiros contextuais já existentes foram preservados. A Paixão segundo Marcos é um roteiro narrativo organizado em cenas, mas **não uma transcrição integral, fala a fala**. Precisa de conferência litúrgica de todos os locutores e pausas antes da interpretação. A procissão de Ramos distingue expressamente as opções Mc 11 e Jo 12; o leitor deve selecionar a efetivamente proclamada.

**Ef 1,3-14, 15º Domingo do Tempo Comum:** a versão que o próprio PDF do Lecionário rotula como “forma longa” aparenta omitir versículos esperados pela referência. Esse problema está na fonte fornecida; não completar silenciosamente por inferência. A forma breve está mantida. Necessária decisão editorial documentada a partir da edição litúrgica autorizada.

**Fonte e idioma:** o documento-fonte é um Lecionário em português europeu, não se deve apresentá-lo como texto oficial brasileiro sem confirmação adicional. O original foi preservado, exceto pelas duas correções de extração rastreadas e pela recuperação literal da remissão incompleta.

**Libras:** não considerar glosas escritas sequências obrigatórias de sinais. Os roteiros ainda precisam de revisão de escolhas lexicais, papéis espaciais, expressões não manuais e prática de sinalização com participação da comunidade surda.

## 4. Rastreabilidade e arquivos

- [Matriz individual dos 241 itens](./AUDITORIA-GLOSAS-ANO-B-241.csv) — situação editorial, referências, variantes e alertas.
- `glosas-revisadas-ano-b.js` — 181 roteiros com chaves contextuais.
- `psalm-glossa-context-ano-b.js`, `psalm-glossa-context-2026-q4.js` e `psalm-glossa-context-ano-b-complemento.js` — estrofes organizadas por celebração.
- `psalm-refrains-ano-b.js` — refrões específicos, inclusive alternativas permitidas.
- [Histórico da restauração da Sagrada Família](./HISTORICO-RECUPERACAO-SAGRADA-FAMILIA-B.md).
- [Histórico de correção da paginação de salmos](./HISTORICO-EXTRACAO-SALMOS-B-FINAL.md).
- Históricos de correções anteriores: `HISTORICO-CORRECAO-SALMO-ANO-B.md`, `HISTORICO-EXTRACAO-SALMO-PASCOA-B.md`.

## 5. Validação técnica e critérios de aceite

**Testes executados:** integridade dos 241 registros exibidos, unicidade de chaves, disponibilidade dos 181 roteiros, 60 salmos com contexto, 60 estruturas de estrofes com contagem compatível, carregamento de scripts e sintaxe JavaScript. A opção de forma longa e breve da Sagrada Família está disponível no próprio original.

**Testes ainda exigidos em navegador real:** comparação visual original ↔ glosa, fluxo de escolha de forma longa/breve, versões móveis e impressão em PDF litúrgico (A4/A3), além de conferir a execução do FTP para Locaweb e a disponibilidade pública da versão recém-publicada.

**Situação editorial:** cobertura do acervo alcançada; **homologação em Libras e revisão detalhada de cada proposição continuam pendentes**. Não anunciar como interpretação pronta ou material linguisticamente validado.
