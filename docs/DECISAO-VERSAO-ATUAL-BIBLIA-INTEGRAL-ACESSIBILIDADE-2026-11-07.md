# Decisão de produto — versão atual e futura validação episcopal

**Data:** 7 de novembro de 2026  
**Origem:** instrução expressa da titular do Caminhos da Palavra, em conversa do projeto GEB Tecnologia.

## Independência da versão atual

O Mapa Bíblico Mestre **Teológico 1.5** é a versão autoral atual e está autorizado para publicação. A titular decidiu que uma futura **validação eclesial por um bispo convidado** será realizada como fase **independente do projeto**, gerando uma **nova versão**. Não é pré-requisito, etapa bloqueante nem critério de aprovação da versão atual.

O site não deve descrever o status futuro do parecer episcopal como deficiência ou impedimento da versão atual. Os campos de confiança e pendência de pesquisa permanecem válidos dentro da própria metodologia 1.5, sem implicar parecer eclesial.

A aba `Controle — Revisão Eclesial` conserva seu histórico e sua finalidade de fase futura. A publicação corrente utiliza somente a autorização da titular, vinculada ao blob do snapshot; pareceres eclesiais não devem ser combinados no gate desta versão.

## Bíblia Ave-Maria integral — objetivo obrigatório da experiência

A titular exige que a edição Ave-Maria seja lida **dentro do próprio Caminhos da Palavra**, com todos os 73 livros, 1.334 capítulos e 35.450 versículos, e sem encaminhar o usuário a um leitor externo para ler a Bíblia.

O leitor interno, a navegação, o catálogo e a busca devem ser preparados para esse objetivo. O texto integral não deve ser publicado antes de documentada uma licença ou outra base apropriada de reprodução: a edição utilizada registra © Editora Ave-Maria, todos os direitos reservados. A titular do site não é, por esse fato, titular dos direitos da tradução.

Manter os JSONs integrais fora do `dist/` e da raiz da Locaweb até solução documental dos direitos. Não apagar nem deslocar os originais do GitHub sem pedido específico. A exposição atual do repositório público deverá ser tratada separadamente.

## VLibras

VLibras é ferramenta **transversal** já carregada no site por `site-menu.js`. O botão não deve ser duplicado. É tradução automática auxiliar, não substitui intérprete ou revisão de material litúrgico em Libras.

## Audiodescrição e leitura em voz alta

Acessibilidade faz parte do site. A primeira etapa inclui descrição textual do ambiente e narração voluntária da descrição via síntese de fala do navegador. O leitor bíblico passa a oferecer controles de leitura em voz alta que funcionam quando texto licenciado estiver presente.

**Distinção técnica:** síntese de fala de texto e narração do ambiente não substituem **audiodescrição sincronizada de vídeos**, que exige produção específica para as cenas de cada vídeo conforme WCAG 2.2, critério 1.2.5. O site deve identificar essa diferença.

## Referências de implementação

- VLibras: https://www.vlibras.gov.br/doc/widget/installation/webpageintegration.html
- WCAG 2.2: https://www.w3c.br/traducoes/wcag/wcag22-pt-BR/
- Direitos da edição: https://www.bible.com/pt/versions/4542
- Lei 9.610/98, artigo 29: https://www.planalto.gov.br/ccivil_03/leis/l9610.htm

**Situação do projeto:** requisitos registrados, versão atual independente, leitor redirecionando internamente, componentes de acessibilidade integrados; publicação dos textos protegidos e audiodescrição sincronizada de mídia permanecem etapas próprias.
