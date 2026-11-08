# Modelo de vínculos do estudo bíblico — consolidação 1.0

**Data de consolidação:** 8 de novembro de 2026.  
**Projeto:** Caminhos da Palavra — GEB Tecnologia.

## Fontes canônicas e limites

1. **Mapa Bíblico Mestre Teológico 1.5:** planilha nativa do projeto (aba `Mapa Bíblico Mestre`) e snapshot versionado `theology-data.js`. São **1.334 registros por capítulo**, identificados por `CP-0001` etc., e pelas chaves `GEN:1`, `JHN:2` etc. A matriz não é uma lista de comentários por versículo.
2. **Bíblia Ave-Maria:** `data/biblia-ave-maria/bibliaAveMaria.json`; 73 livros, 1.334 capítulos, 35.450 versículos; `verse-index.js` valida limites da numeração. Texto bíblico e comentários autorais têm fontes distintas.
3. **Dicionário Bíblico, Histórico e Visual:** os verbetes já publicados em `liturgia-2025-11.js` (campo `dictionary`), com `id`, `title`, `dimension`, `contexto`, `espaco`, `source`, `review`. O dicionário preserva seu caráter preliminar.
4. **Liturgia:** `readings[YYYY-MM-DD].dictionaryRefs` da competência publicada indica associação de uma celebração ao verbete; **não atribui automaticamente o verbete a todos os versículos das leituras**.

A autorização da titular para a versão autoral atual é independente de eventual avaliação eclesial futura, a cargo de bispo convidado. O gerador só recebe o **payload público já autorizado** da matriz.

## Identificadores e relações

| Entidade | Chave | Natureza |
| --- | --- | --- |
| Livro | `GEN`, `JHN`, etc. | Referência ao catálogo canônico |
| Capítulo | `GEN:1` | Unidade de base do Mapa Teológico 1.5 |
| Versículo | `GEN:1:1` | Localizador bíblico, não observação automática |
| Passagem | Intervalo `bookId` + `startChapter:startVerse` até `endChapter:endVerse` | Abrangência da citação documental |
| Verbete | `dictionaryId`, por exemplo `templo-jerusalem` | Consulta ao dicionário existente |
| Vínculo de dicionário | `dict:<verbete-id>:<índice-da-citação>` | Referência bíblica explicitada no campo `source` do verbete |
| Observação curada | `obs:<id>` | Conteúdo futuro, sempre com `target`, `scope`, `provenance` e revisão |
| Palavra interativa | Âncora lexical | Termo, versículo, verbete e prova contextual verificada — não inferir apenas por coincidência textual |

## Escopo de um vínculo

- **`chapter`:** o verbete ou estudo relaciona-se ao capítulo como unidade; não se aplica como observação a cada versículo.
- **`chapter_range`:** capítulos consecutivos explicitamente indicados, como `Gn 6–9`.
- **`passage`:** intervalo de versículos no mesmo capítulo, como `Jo 2,13-22`.
- **`cross_chapter_passage`:** passagem que cruza capítulos, como `Sb 7,22–8,1`.
- **`verse`:** citação pontual, como `Is 2,4`, que **não é, por si só, uma exegese pontual**.

Exemplo verificável: o verbete **Templo de Jerusalém** já cita `Jo 2,13-22` na fonte. Esse dado é registrado como *referência contextual documentada* para a passagem. Ele não produz automaticamente realce na palavra “templo” nem afirma que todos os versículos têm comentário individual sobre o verbete.

A abreviação de um versículo, como `Mt 5,1-12a`, conserva no vínculo o sinal `partialVerse`; não se pode apresentar o recorte como edição fiel do versículo completo. Referências ambíguas, como a dupla numeração dos salmos, ficam sem ligação automática, para conferência humana.

## Saída operacional

O gerador `scripts/gerar-vinculos-estudo.mjs` reúne as fontes e produz, no pacote de publicação, **`dados/vinculos-estudo.json`** com:

- `chapters`: 1.334 chaves do Mapa Teológico, limites de versículos, `cpId` e IDs de relações aplicáveis ao capítulo.
- `links`: somente relações contextuais com verbetes originadas de citações bibliográficas identificáveis na fonte, e observações curadas quando existirem.
- `dictionary`: índice dos verbetes já existentes, com conteúdo e endereço da ficha para futuras consultas no próprio site.
- `liturgicalLinks`: datas litúrgicas vinculadas a verbetes por `dictionaryRefs`, sem converter referência litúrgica em anotação versicular.
- `lexicalAnchors`: exclusivamente termos verificados na curadoria, sem preenchimento automático.
- `unresolved`: referências que não puderam ser normalizadas sem ambiguidade.
- `counts`: cobertura real e números de vínculos existentes, sem declarar 35.450 comentários inexistentes.

O arquivo `data/vinculos/curadoria.json` é a origem controlada para novas **observações** e **âncoras lexicais**. Inicialmente, as listas ficam vazias: sua ausência é um estado de pesquisa honesto, não uma falha. O gerador rejeita anotações sem proveniência e âncoras sem identificação de verbete e versículo.

As funções públicas de consulta `vinculos-estudo-core.js` disponibilizam `forChapter`, `forPassage`, `forVerse` e `forLexicalAnchor`. O índice é consultável sem modificar as fichas ou o texto bíblico.

## Contrato UX — fase seguinte

- **Leitura contínua:** o intervalo escolhido permanece na leitura.
- **Tags discretas:** tema do capítulo, etapa e aliança documentados, sem poluir versículos.
- **Observação por passagem:** um único vínculo da perícope informa sua abrangência; não duplicar a mesma ficha em cada versículo.
- **Observação por versículo:** ícone individual apenas quando existir anotação realmente vinculada ao versículo, ou acesso contextual claramente rotulado como “referência da passagem”.
- **Dicionário sob demanda:** popover no desktop, painel inferior no celular, retornando ao mesmo versículo quando fechado.
- **Palavra clicável:** apenas com âncora lexical verificada, sem destacar por semelhança ortográfica.
- **Rastreabilidade:** classificação, fonte e nível de confiança ficam em detalhes secundários.
- **Pendente:** conservar literalmente o registro da pesquisa. Nunca inventar explicação, contexto ou link.

**Estado deste trabalho:** consolidações e contrato de dados, sem redesenhar automaticamente a interface ou afirmar que existem observações individuais para todos os versículos.
