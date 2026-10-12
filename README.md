# Caminhos da Palavra — por Libras com Eduarda

Ambiente digital de experiência com a Palavra de Deus que reúne Bíblia, plano de leitura, calendário litúrgico e recursos de preparação da Liturgia em Libras. A proposta é favorecer leitura, compreensão, preparação e participação na vida da Igreja em uma experiência visual, organizada e acessível.

## Posicionamento

**Caminhos da Palavra** é um ambiente para viver a Palavra de Deus ao longo dos dias e no ritmo da Igreja. O acervo organiza seus estudos pela **Sagrada Escritura, Sagrada Tradição e Magistério**, reunindo também ferramentas litúrgicas e de leitura bíblica.

O projeto **não se apresenta como conteúdo em Libras**. Na frente da liturgia dominical, as glosas são ferramentas escritas de preparação e não equivalem à Libras, a uma interpretação sinalizada ou a uma tradução oficial.

Os recursos de preparação podem apoiar especialmente quem está começando a interpretar no contexto da Igreja Católica, sem substituir:

- cursos e formação linguística;
- profissionais qualificados;
- prática real de interpretação;
- contato e convivência com pessoas surdas;
- revisão e validação por usuários e profissionais competentes.

O ambiente também serve a cristãos que desejam ler a Bíblia, manter uma caminhada de leitura, acompanhar o calendário litúrgico e se preparar para a Liturgia da Palavra. A acessibilidade é tratada como princípio transversal da apresentação.

A assinatura **por Libras com Eduarda** preserva a origem e a autoria do projeto sem limitar a plataforma exclusivamente à Libras.

## Heresias, teorias e condenações documentadas (12/10/2026)

A página `heresias.html` é um catálogo público de pesquisa e estudo com **88 registros editoriais**, pesquisáveis por nome, tese, documento, autoridade e texto; possui filtros por período e família de pronunciamento. Cada registro identifica **a doutrina ou prática examinada, a posição da Igreja, sua classificação e uma fonte documental**. É um acervo em expansão, não uma lista exaustiva nem uma declaração de que todos os registros sejam heresias formais.

- `dados/heresias-controversias.json`: dados das fichas, com link de consulta e descrição.
- `docs/PROTOCOLO-HERESIAS-E-CONDENACOES.md`: regras de revisão e classificação.
- **Maçonaria** é enquadrada como associação considerada incompatível, com referências de 1884, 1983 e 2023; **gnosticismo** e as escolas antigas aparecem em contexto histórico. Não se equiparam cismas, heresias, opiniões condenadas, ideologias e práticas.
- O conteúdo permanece sujeito a revisão contínua do teor e do alcance de cada pronunciamento e de todos os links de fonte.
- O **VLibras** é transversal às páginas do projeto; **não** foram criadas glosas para esta seção. A glosa própria é recurso reservado à liturgia dominical.

## Navegação do acervo (12/10/2026)

O antigo menu horizontal foi substituído por um **menu vertical expansível** em `site-menu.js` e `site-menu.css`, presente na página inicial, na sucessão dos papas e no catálogo. O painel ocupa até metade da largura em monitores e a largura total no celular. As áreas presentes são Escritura, Tradição, Magistério e Vida Litúrgica; a Liturgia é uma área operacional de acesso, **não um quarto elemento** do depósito da fé. O projeto **Oração Visual** permanece independente.

## Ritos e Orações da Missa (12/10/2026)

A nova seção pública **Ritos da Missa** apresenta, de maneira acessível ao público leigo, os textos e as respostas da celebração, organizados em Ritos Iniciais, Profissão de Fé e Preces, Liturgia Eucarística, Rito da Comunhão, Ritos Finais e exemplos de formulários próprios.

**Base editorial interna:** Missal Romano, terceira edição típica, tradução brasileira da CNBB (2023), fornecida pela responsável do projeto.

- `missal-data.js`: inventário inicial de 30 registros selecionados, com papéis litúrgicos e observações.
- `missal.js`: busca, filtros, texto em português e painel de glosa de apoio. O painel só publica glosas quando forem explicitamente marcadas como revisadas e houver texto correspondente. Caso contrário, apresenta aviso de elaboração.
- `missal.css`: interface responsiva para leitura por partes da celebração.
- **O PDF original não é publicado ou vinculado no site, e suas páginas não são exibidas.** O documento serve de fonte de trabalho editorial, não como ferramenta que o visitante precisa consultar.
- Os campos para anotações pessoais foram removidos da interface; não há mais escrita ou armazenamento de novas notas nesse módulo.
- A transcrição do texto requer conferência editorial; entradas parciais ou sem texto são apresentadas como material em preparação, não como ritos completos.
- A Liturgia da Palavra mantém o acervo próprio de leituras, salmos e Evangelhos, cuja edição brasileira ainda requer verificação. O módulo dos Ritos da Missa não substitui o Lecionário.

O objetivo é apresentar o conteúdo litúrgico ao público sem exigir que conheça os livros usados na sacristia, enquanto a glosa escrita serve de apoio à preparação do intérprete e não equivale à interpretação sinalizada.

## Integridade editorial e fontes

A regra de publicação é **não inventar dados**. Todo dado factual deve possuir respaldo verificável; ausência documental permanece visível como lacuna. Consulte [Política editorial e de fontes](./POLITICA-EDITORIAL-E-FONTES.md).

Na relação dos papas, os 267 registros são apresentados com campos de nome de nascimento e datas transcritos da [tabela da Santa Sé](https://www.vatican.va/content/vatican/pt/holy-father.html), preservando lacunas, datas alternativas e formas originais. O arquivo de apoio é `vatican-pontificates-raw.js`. Em 12/10/2026, a tabela fornecia 134 campos de nome de nascimento e deixava 133 em branco. A qualidade factual dos demais módulos necessita conferências próprias, que não devem ser confundidas com a conferência desta lista.

## Sucessão Apostólica e Papas

- Página pública autônoma: `papas.html`, vinculada ao menu e à apresentação inicial, sem alterar as seções de Bíblia, Plano de Leitura, Calendário, Liturgia e Missal.
- Catequese confessional católica: continuidade entre a Aliança com Israel (patriarcas, doze tribos, Moisés, monarquia, divisão dos reinos, profetas e exílio), as promessas messiânicas, Jesus Cristo, os Apóstolos e o ministério petrino. A sucessão é apresentada como doutrina da Igreja, não como hipótese.
- Jesus judeu, Maria e José, as genealogias de Mt 1 e Lc 3, os títulos Messias, Cristo e Emanuel e o cumprimento das profecias.
- Quatro Evangelhos: ênfase judaica em Mateus, Marcos, Lucas e João com suas perspectivas catequéticas; públicos apresentados como orientações, não exclusividades.
- Resposta de Israel a Jesus tratada conforme o Catecismo §§ 595–598 e Nostra Aetate, 4: não há culpa ou rejeição coletiva de todo o povo judeu; a origem judaica do cristianismo é preservada.
- Relação cronológica de **267 registros** conforme o catálogo oficial da Santa Sé (consultado em 12/10/2026), de São Pedro até Leão XIV, com pesquisa por nome/número, filtro por século e inversão da ordem.
- Nota histórica sobre o pontificado de Bento IX registrado três vezes e sobre a não inclusão de antipapas na relação oficial.
- Referências: https://www.vatican.va/content/vatican/pt/holy-father.html e Catecismo da Igreja Católica §§ 880–882.
- Dados mantidos localmente no HTML, sem banco de dados e sem dependência de buscas externas no funcionamento da lista. Em futuras mudanças no pontificado, a lista precisa ser revisada editorialmente conforme a Santa Sé.

## Liturgia dominical

A base estruturada atual contém:

- 180 celebrações dos ciclos A, B e C;
- 717 itens litúrgicos;
- 554 referências bíblicas distintas;
- primeira leitura;
- salmo responsorial;
- segunda leitura;
- Evangelho;
- procissão e Paixão quando aplicáveis;
- formas e variantes registradas quando já identificadas no levantamento-base.

Cada uma das 554 referências possui agora uma **glosa-base preliminar** vinculada. Quando uma mesma perícope se repete em celebrações diferentes, a glosa é reutilizada pela referência e poderá futuramente receber variantes contextuais.

As glosas-base permanecem em status de elaboração/revisão. Não devem ser apresentadas como Libras validada.

### Texto litúrgico oficial

A interface já possui o campo **Texto litúrgico · Missal/Lecionário** separado da glosa.

O texto integral da edição brasileira não foi copiado automaticamente de páginas da internet. Para publicação lado a lado em escala, é necessário trabalhar com uma fonte oficialmente validada e com direito adequado de reprodução. Até isso ser resolvido, a plataforma preserva a referência litúrgica e a estrutura de pareamento.

## Calendário litúrgico

A navegação cobre 2026 a 2030 e calcula:

- ciclos A/B/C;
- Advento;
- Natal;
- Sagrada Família;
- Quaresma;
- Tríduo Pascal;
- Páscoa;
- Ascensão no domingo;
- Pentecostes;
- Santíssima Trindade;
- Cristo Rei;
- domingos do Tempo Comum.

Referência operacional para o Brasil:

- GCatholic Brasil: https://gcatholic.org/calendar/2026/BR-pt

Referência normativa complementar:

- Secretariado Nacional de Liturgia: https://www.liturgia.pt/documentos/ano_lit.php

O calendário próprio brasileiro, transferências de solenidades e santoral detalhado devem continuar sendo validados antes de o banco ser tratado como calendário litúrgico nacional completo.

## Bíblia Sagrada Ave-Maria

O navegador interno contém os 73 livros e capítulos da Bíblia Católica.

Leitura licenciada:

- https://www.bible.com/pt/versions/4542

Áudio:

- https://www.bible.com/pt/audio-bible-app-versions/4542-avm-b%C3%ADblia-sagrada-ave-maria

O repositório mantém metadados, navegação, relações, glosas próprias e progresso. O texto integral protegido permanece na fonte licenciada enquanto não houver autorização ou API adequada para reprodução interna.

A conexão entre versões bíblicas e suas respectivas glosas fica para uma etapa futura.

## Plano de leitura — versão definitiva (365 dias, capítulos)

**Proposta do Caminhos da Palavra:** leitura integral dos 73 livros e 1.334 capítulos da Bíblia Católica em 365 dias, sem repetir capítulos e sem marcar versículos. Novo Testamento nos dias 1–75; Antigo Testamento nos dias 76–365. Os Salmos são atribuídos automaticamente, em ordem numérica, aos dias 1–150: Salmo 1 no dia 1, Salmo 2 no dia 2, até Salmo 150 no dia 150. Nesse período, cada Salmo acompanha os capítulos do Novo Testamento ou do Antigo Testamento previstos para o dia; nos dias 151–365 permanecem somente os outros capítulos. O ritmo fica entre 3 e 5 capítulos por dia.

**Referências de inspiração para a ordem dos livros** (não fontes literais da distribuição diária):
- Monsenhor Jonas Abib, Canção Nova: https://padrejonas.cancaonova.com/informativos/artigos/em-que-ordem-ler-a-biblia/
- *Revista Ave Maria*, “Por onde começar a ler a Bíblia?”, setembro de 2026, p. 6: https://revistaavemaria.com.br/wp-content/uploads/2026/09/avemaria-setembro2026-05.pdf

O cronograma é **adaptação própria do Caminhos da Palavra**, sem as releituras de I João e João previstas na inspiração metodológica; as indicações da revista não especificam um Salmo por dia. A intercalagem exata dos 150 salmos foi estabelecida neste projeto.

### Regras técnicas e preservação do progresso

- O site e o PDF são produzidos pela mesma função `buildDatedSchedule`.
- Uma marcação por capítulo, por meio da chave histórica `LIVRO:CAPÍTULO` (ex.: `PSA:1`), sem alterar a chave `lce-bible365-plan-v1` do armazenamento local.
- O conteúdo e as datas do plano são fixos para cada data de início escolhida. A data de impressão não modifica o acompanhamento online.
- Conclusões de capítulos anteriores são mantidas, mesmo que a data programada desses capítulos tenha mudado. O dia corrente online é o primeiro dia ainda não concluído de forma consecutiva.
- As 1.334 chaves aparecem exatamente uma vez no roteiro; não há dias vazios.
- A opção de impressão gera o cronograma de 365 dias com caixas exclusivamente para marcar capítulos.

## Acessibilidade

O site usa:

- layout responsivo;
- navegação por teclado;
- hierarquia visual leve;
- listas expansíveis;
- texto e glosa lado a lado em telas maiores;
- empilhamento previsível em telas pequenas;
- widget oficial do VLibras como recurso complementar.

O VLibras não substitui interpretação humana.

## Arquivos principais

- `index.html` — navegação, apresentação do projeto e estrutura pública.
- `styles.css` — sistema visual, responsividade e impressão.
- `data.js` — conteúdo piloto e referências gerais.
- `lectionary-data.js` — banco estruturado dos ciclos A/B/C.
- `glosa-psalms.js` — glosas-base dos salmos/cânticos.
- `glosa-gospels.js` — glosas-base dos Evangelhos, procissões e Paixões.
- `glosa-new-testament.js` — glosas-base das leituras apostólicas.
- `glosa-old-testament.js` — glosas-base das leituras do Antigo Testamento.
- `bible-data.js` — livros, capítulos e ordem do plano de leitura.
- `calendar.js` — calendário e ciclos litúrgicos.
- `app.js` — busca, filtros, accordions, calendário, Bíblia e plano.
- `.github/workflows/main.yml` — deploy FTP para Locaweb.

## Próximas etapas

- fonte/licença para os textos litúrgicos integrais da edição brasileira;
- revisão linguística e pastoral das glosas;
- enriquecimento do calendário brasileiro com solenidades transferidas e calendário próprio;
- Supabase/PostgreSQL;
- painel administrativo e fluxo de validação;
- vídeos próprios e interpretação humana em Libras;
- expansão de músicas, orações, rosário e glossário;
- conexão futura entre versões bíblicas e glosas específicas de cada tradução.

## Auditoria UX e manutenção — 10/10/2026

- Navegação sem subpáginas físicas por âncoras `#inicio`, `#biblia`, `#plano-de-leitura`, `#calendario-liturgico`, `#liturgia-e-libras`; títulos de aba atualizados por seção e histórico do navegador preservado.
- Link específico de leitura: `#liturgia-e-libras?data=AAAA-MM-DD&item=salmo` (o tipo pode ser leitura ou evangelho conforme os valores cadastrados). Cada cartão oferece copiar o link. O link direciona à seção, aplica data e tipo de item; não identifica um registro individual quando há mais de um com o mesmo tipo na data.
- Calendário: indicador do dia atual, aviso de disponibilidade de leituras no nome acessível dos dias e botão de retorno ao mês atual.
- Plano de Leitura: botões Exportar/Importar progresso geram e leem JSON local. Importação valida catálogo e faixas de capítulos, limita tamanho e une as marcações existentes às importadas; não apaga capítulos previamente concluídos. O usuário deve guardar o arquivo com segurança. Não há envio para servidores.
- Acessibilidade: foco visível e modo de movimento reduzido; ainda são necessários testes manuais em teclado, leitores de tela e aparelhos móveis.
- PDFs: o cronograma é impresso em um documento isolado da interface para evitar o VLibras no papel; o PDF litúrgico conserva comparação por trechos quando disponíveis. Os dois fluxos requerem confirmação visual após o deploy.
- HTTPS: verificar no painel da Locaweb o certificado SSL do subdomínio, a validade e o redirecionamento HTTP→HTTPS. Não publicar regras de redirect sem confirmar SSL ativo e a topologia da hospedagem.
- Deploy: workflow GitHub Actions configurado na `main` para FTP em `public_html/caminhosdapalavra/`; sucesso de commits não garante, por si só, publicação ou validade do HTTPS.

### Critérios de aceitação manuais recomendados

1. Abrir cada âncora em aba anônima, atualizar e testar Voltar/Avançar.
2. Copiar um link de salmo, abrir em nova aba e confirmar data e tipo aplicados.
3. Marcar um capítulo, exportar o JSON, importar em outro navegador e confirmar a união sem perda das marcações.
4. Navegar pelo calendário com Tab e Shift+Tab, testar mês atual e clicar numa data com leitura.
5. Conferir PDF de 365 dias no começo, no dia 150, no dia 151 e no final, verificando tabelas sem coluna vazia.
6. Conferir a prévia do PDF litúrgico em A4 retrato, sem controles flutuantes.
7. Validar `https://caminhosdapalavra.compassrosesystems.com.br/` e o certificado SSL em um navegador real.

## Revisão editorial das glosas — Ano A (atualização 10/10/2026)

**Situação real da revisão:** 60 celebrações, 241 itens com original e glosa-base, 32 roteiros não salmódicos com revisão editorial ampliada, 60 refrões contextualizados por celebração e 13 salmos com estrutura de estrofes explícita. Ainda exigem revisão editorial integral 149 leituras não salmódicas e 47 salmos cuja correspondência semântica das estrofes não foi homologada.

O **Advento** (16 itens) possui revisão editorial por registro: 12 roteiros ampliados e quatro salmos com refrões e estrofes específicos. Outros roteiros importantes do Natal, Quaresma, Páscoa e Tempo Comum receberam ampliação; o trabalho não está integralmente concluído.

Os textos ampliados estão em `glosas-revisadas-ano-a.js`, por chave contextual. A glosa-base original e o texto original do Lecionário permanecem preservados. Os refrões exclusivos foram registrados em `psalm-refrains-ano-a.js`; os contextos completos de estrofes, em `psalm-glossa-context-ano-a.js` e `psalm-glossa-context-2026-q4.js`. Um teste automatizado de 13 salmos confirmou que o número de estrofes de glosa corresponde à divisão original cadastrada.

A página Liturgia permite selecionar forma longa ou breve apenas quando **ambas as formas estão efetivamente presentes no texto-fonte** (cinco registros no Ano A), preservando a opção escolhida na visualização para impressão. Em outros 11 registros, só a forma longa está disponível: não há geração de uma forma breve fictícia.

Consulte [REVISAO-GLOSAS-ANO-A.md](./REVISAO-GLOSAS-ANO-A.md) e a [matriz individual dos 241 itens](./AUDITORIA-GLOSAS-ANO-A-241.csv). **Nenhuma revisão escrita deve ser anunciada como tradução validada em Libras** sem avaliação com intérpretes proficientes e pessoas surdas, especialmente quanto a naturalidade, espacialização, concordância discursiva, recursos não manuais e adequação litúrgica.


## Revisão editorial das glosas — Ano B (11/10/2026)

O inventário do Ano B cobre **60 celebrações e 241 itens efetivamente exibidos** (238 declarados e três leituras complementares do Batismo do Senhor). Todos possuem texto-fonte e glosa-base. Há **181 roteiros editoriais contextualizados para 181 itens não salmódicos** e **60 salmos com refrão específico e divisão de estrofes por celebração**. O mapeamento foi conferido estruturalmente.

Nesta etapa foram preservados os 111 roteiros anteriores, elaborados 70 novos e contextualizados os 32 salmos restantes. O Evangelho da Sagrada Família foi recuperado nas formas longa e breve das páginas 90–91 do próprio PDF-fonte do Lecionário. Correções de paginação de dois salmos têm histórico arquivado. O registro Ef 1,3-14 da forma longa apresenta possível lacuna na própria edição-fonte e aguarda deliberação editorial.

**Limite de validade:** cobertura editorial escrita não significa tradução pronta ou homologada em Libras. A Paixão segundo Marcos, em particular, segue como roteiro de cenas e precisa de comparação integral fala a fala, ensaio e validação humana. O texto-fonte provém de edição portuguesa e não está certificado como tradução oficial brasileira.

Consulte [REVISAO-GLOSAS-ANO-B.md](./REVISAO-GLOSAS-ANO-B.md) e [AUDITORIA-GLOSAS-ANO-B-241.csv](./AUDITORIA-GLOSAS-ANO-B-241.csv). Os anos A e C, a Bíblia, o Plano de Leitura, os links e os demais módulos permanecem preservados.
