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

## Mapa da Jornada — nova experiência de leitura (28/10/2026)

A interface de `historia-da-salvacao.html` passou de índice lateral/cartões aninhados para **mapa simbólico navegável**. O endereço não mudou.

- **Mapa A:** oito estações conectadas por um traçado sinuoso, com início na Criação e conclusão na consumação. A estação da Igreja mantém a relação dos 267 papas e sua pesquisa histórica.
- **Mapa B:** cinco estações no caminho da vida cristã, cobrindo 19 módulos na ordem pedagógica prevista (criaturas, alma e espírito, graça, sacramentos, virtudes, *sensus fidei*, Novíssimos).
- **Seleção:** cada marco do mapa é um botão de acesso a um painel de leitura com assunto, narrativa integral, referências bíblicas e documentais. O painel permite voltar ao mapa e passar à etapa anterior ou seguinte.
- **Acesso direto:** âncoras legadas como `#maria`, `#sucessao-pontificia` e `#b18` identificam e abrem automaticamente a estação e o tema. O legado `papas.html` mantém o redirecionamento existente.
- **Visual responsivo:** caminho sinuoso sobre fundo de pergaminho no desktop; trilha vertical de marcos alternados no celular. O mapa é simbólico, não territorial nem uma cronologia com datas artificialmente inferidas.
- **Acessibilidade e continuidade:** botões/diálogo nativos, foco e tecla Escape, painel com navegação anterior/próxima, suporte à redução de movimento; se o script do mapa não executar, a página original permanece acessível com seus painéis.
- **Preservação:** o código antigo dos capítulos não foi apagado ou copiado com divergências; `percurso-mapa.js` apenas reutiliza o conteúdo existente no painel de leitura. `percurso-mapa.css` contém somente a nova camada visual.
- **Limites de teste:** conferência de números, scripts, referências internas e deploy não substitui inspeção visual em navegador e no celular. A aprovação eclesial é independente do design.

Referência de arquitetura, criada no Google Drive antes da alteração:
https://docs.google.com/document/d/1laOluDr3sPMMek2EH0k0NxcicSRvndNzh7BkXVP_y20/edit

## Dois eixos em uma página — HS-2026-10-12.4

A página canônica `historia-da-salvacao.html` reúne **duas perspectivas complementares da única salvação em Cristo**, com controle por abas acessível a teclado e links profundos:
- **Eixo A: O que Deus realizou** — preserva os oito movimentos, 16 capítulos, 54 parágrafos, 33 conexões e a lista pesquisável dos 267 pontificados na mesma etapa da Igreja. O antigo `papas.html` continua redirecionando para `#sucessao-pontificia`.
- **Eixo B: Como a pessoa responde à graça** — cinco grandes movimentos, com 19 módulos (`#b01` até `#b19`), sobre criaturas, corpo/alma/espírito, liberdade, pecado, graça, sacramentos, virtudes, Espírito Santo, *sensus fidei*, santidade e Novíssimos. Cada tema mantém formulação original, ampliação explicativa derivada do Caderno de Fundamentação e ligação à etapa correspondente no eixo histórico.
- **Integração** — oito pontes no Eixo A conduzem ao tema apropriado do Eixo B; os 19 módulos pessoais ligam de volta à História. As âncoras abrem automaticamente a aba e os painéis necessários; a interface apresenta apenas uma perspectiva de cada vez com JavaScript, e mantém ambos os conteúdos legíveis sem JavaScript.
- **Fonte e cronologia** — a lista de papas permanece baseada na transcrição dos registros da Santa Sé; o nome anterior de Pedro é Simão (Jo 1,42). O painel pessoal foi extraído de documentos do Drive, sem criar uma segunda página desconectada nem substituir a versão HS-2026-10-12.2.
- **Proveniência de leitura** — os conceitos filosóficos da tradição aristotélico-tomista não são apresentados como dogmas; as fontes anteriores ao Vaticano II e as auxiliares posteriores são diferenciadas. Não há FAQ fabricada.
- **Status** — material catequético em estudo; a publicação técnica não equivale à revisão eclesial externa.

Fontes de documentação prévia, criadas ANTES do código:
1. Arquitetura dos dois eixos: https://docs.google.com/document/d/1_aDHWRO1jKUBJxEp-FODASxDFmlM_2WsXUoopHje1KY/edit
2. Caderno de fundamentação: https://docs.google.com/document/d/1WG2pLaY6uobaKwqNERKfEK0BbziRPNxdit_lNsOfats/edit
3. Base de implantação dos 19 módulos: https://docs.google.com/document/d/1R6RyDs02-L540wn6xRo2FcWPwoawN1E6eGVuoCHQeHg/edit

## História da Salvação e Sucessão Apostólica — jornada unificada (HS-2026-10-12.2)

**Página canônica única:** `historia-da-salvacao.html`. A História da Salvação e a relação dos 267 pontificados **não são mais duas experiências paralelas**: todos os dados estão no mesmo percurso. O antigo endereço `papas.html` encaminha para `historia-da-salvacao.html#sucessao-pontificia`, sem perder os acessos preexistentes.

- **Oito etapas expansíveis:** Criação/Queda; Noé/Abraão/patriarcas; Israel/Moisés/Arca; Davi/profetas; Maria/Messias; Nova e Eterna Aliança; Igreja/Pedro/papas/fé e razão; segunda vinda/consumação.
- **Conteúdo integral:** preservados **16 capítulos**, **54 parágrafos** da versão-mestre, **33 conexões A/B/C/D** e **11 referências bibliográficas**, verificados por comparação com o conteúdo do Drive.
- **Interatividade:** cada etapa traz título autoexplicativo e resumo antes de abrir; cada capítulo se expande independentemente para revelar personagens, explicação integral, passagens bíblicas e conexões; submenu lateral/horizontal permite abrir diretamente qualquer tema, inclusive a lista dos papas; opção expandir/recolher; busca de pontífices por nome, nome anterior e número, filtro por século e ordem.
- **Dados papais:** o novo `papal-name-index.js` fornece os nomes pontifícios, alinhados ordinalmente ao arquivo `vatican-pontificates-raw.js` já existente, cuja fonte é a tabela da Santa Sé. Simão → Pedro baseia-se em João 1,42. Somente nomes anteriores documentados aparecem como “Antes chamado ...”; as lacunas ficam sem campo público. Datas alternativas da Santa Sé são preservadas.
- **Fonte-mestre Drive HS-2026-10-12.1:** https://docs.google.com/document/d/1d7Prfhp180AXiZ6GYvbeo8bA6IQKBfVdtssjw8YAR3M/edit
- **Decisão de arquitetura HS-2026-10-12.2, arquivada antes da implementação:** https://docs.google.com/document/d/1qKTNHIttZkp2gHCovrp78BPsAACEz7ppC_KmHAFszMc/edit
- **Governança:** a Matriz Teológico 1.5 não foi modificada. A catequese permanece identificada como estudo sem declaração de aprovação eclesial formal. A lista de papas não recebeu nomes, datas ou acontecimentos presumidos. As perguntas frequentes não são incluídas sem pesquisa de demanda real. O histórico da antiga `papas.html` está preservado no Git e nos snapshots do Drive.

### Fundamento doutrinal da sucessão

A sucessão dos pontífices está incorporada à etapa da Igreja, depois das palavras de Cristo a Pedro (Jo 1,42; Mt 16,18–19; Lc 22,31–32; Jo 21,15–17), dos testemunhos de Clemente Romano e Irineu e da doutrina de `Pastor Aeternus` (Vaticano I). Cristo é a Cabeça da Igreja; os papas sucedem Pedro em seu ministério, não por descendência familiar de Jesus ou do Apóstolo. A lista conserva as 267 posições da relação histórica da Santa Sé, incluindo os pontificados descontínuos de Bento IX e a distinção dos antipapas.

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


## Competência 01/36 — novembro de 2025 (23/10/2026)

O **Dicionário Bíblico, Histórico e Visual** tem página própria em `dicionario.html` (URL pública `/dicionario.html`) e link no menu *Vida litúrgica*. Sua primeira entrega apresenta **12 fichas preliminares** da competência 01/36, com busca, filtro por dimensão, proveniência documental e vínculos por data. Fichas são materiais editoriais de estudo, não sinais oficiais nem glosas validadas. A navegação do calendário aponta para as fichas canônicas, evitando duplicar o texto. Fonte inicial: `liturgia-2025-11.js`; o módulo permite agregar bases de outras competências, sem alterá-las automaticamente.

A camada `liturgia-2025-11.js` reúne as **30 datas** com referências de trabalho, classificações litúrgicas, fontes e ressalvas editoriais; inclui alternativas explícitas para Finados e roteiros visuais preliminares de 1, 2, 9, 16, 23 e 30 de novembro, além de verbetes do Dicionário Bíblico, Histórico e Visual. Não substitui a base dominical aprovada nem publica texto integral da edição brasileira. O calendário reconhece as decisões específicas da CNBB de 2025. O PDF disponível pelo diálogo de impressão desta ficha contém apenas referências e conteúdo autoral de preparação, **não a reprodução do Lecionário**.

Consulte `RELATORIOS/2025-11.md` e `CONTROLE-36-COMPETENCIAS.csv`. Todas as glosas aguardam cotejo integral por unidade e validação humana especializada; a competência **permanece em revisão**, não concluída.

### Revisão mensal de novembro de 2025 — entradas por dia

Os scripts `estudo-liturgico-2025-11-01a15.js` e `estudo-liturgico-2025-11-16a30.js` acrescentam **96 estudos por ocorrência**, organizados em **288 unidades de pareamento autoral** (síntese de conteúdo ↔ roteiro textual de glosa preliminar) para todos os dias de 01 a 30/11/2025. Na seção Liturgia + Libras, a seleção por data passa a priorizar essa camada sem modificar o repertório dominical legado. O PDF da ocorrência imprime os pares e identifica o caráter **não oficial** da síntese. **Nenhum texto brasileiro completo foi autorizado/homologado, nenhuma glosa está integralmente revisada e nenhuma validação humana em Libras foi efetuada.**

O Dicionário associado ao mês contém **46 fichas preliminares**. Fontes e limites editoriais constam em `RELATORIOS/2025-11.md` e o estado administrativo continua `EM_REVISAO`.

### Interface da Liturgia + Libras (novembro de 2025)

Na competência 01/36, o comparativo prioriza **Texto litúrgico** e **Glosa de estudo**. A fonte, limites editoriais e notas linguísticas ficam em áreas recolhíveis. O material de glosa mantém status preliminar e não deve ser confundido com interpretação validada. PDFs não disponíveis não geram botões inativos; o arquivo de controle e os relatórios preservam todas as pendências.

### Salmos responsoriais na Liturgia + Libras

Refrão em destaque **uma vez**, com indicação "Repetir após cada estrofe". Versos divididos em quadros com referências extraídas da ocorrência local somente quando a segmentação da fonte digital coincide. Em glosas versiculares com referências suficientes, agrupamento correspondente de cada estrofe; sem correspondência comprovável, não são atribuídos números por suposição.

### Respostas da assembleia e ciclo ferial

O comparativo registra o diálogo litúrgico após primeira/segunda leituras e após Evangelho (sem duplicá-lo após salmos/cânticos). O ciclo ferial **I/II** considera o ano civil ímpar/par no Tempo Comum, independentemente do ciclo dominical **A/B/C**; a seleção individual da celebração prevalece sobre qualquer regra geral.

### Associação do acervo local a outros anos

O mesmo texto importado pode servir a datas com semana, dia e ciclo litúrgico equivalentes, sem novas buscas. No Tempo Comum, primeira leitura e salmo seguem I/II, Evangelho é anual; domingos seguem A/B/C. Celebrações próprias prevalecem. Não se considera completa uma missa com leituras parcialmente cobertas. As glosas seguem marcadas como preliminares.

### Alternância CNBB / Bíblia Ave-Maria (Comando 0)

Na Liturgia + Libras, o seletor aplica CNBB ou Bíblia Ave-Maria às primeiras e segundas leituras e ao Evangelho. Texto e glosa são vinculados à mesma edição; salmos sempre CNBB. `liturgia-ave-maria-acervo.js` contém um acervo separado ainda vazio, e a ausência de texto/glosa é informada sem substituir pela redação CNBB. O corpus brasileiro existente é proveniente de API comunitária e continua pendente de cotejo direto com o Lecionário CNBB. Veja RELATORIOS/COMANDO-0-EDICOES.md.

### Competência 01/36 — revisão em execução

O acervo local mantém 96 ocorrências em novembro/2025; foram auditados 288 rascunhos de síntese temática, três leituras com 18 unidades de glosa preliminar por versículo (05/11) e 93 leituras que **ainda não têm glosa integral**. As páginas distinguem essas situações explicitamente; relatório por ocorrência em `RELATORIOS/COBERTURA-GLOSA-2025-11.csv`.

Para incorporar uma versão **Ave-Maria distinta e autorizada**, a rotina `node scripts/importar-ave-maria.mjs --input arquivo.json` importa em `liturgia-ave-maria-acervo.js` uma vez por texto/recorte e vincula glosas ao ID textual. Exige no lote `edition: AVM`, `period: 2025-11`, `sourceEdition`, `publicationAuthorization`, e `entries` com `date`, `kind`, `reference`, `text` e `gloss.segments` opcional. Rejeita salmo, recorte divergente, duplicidade e texto vazio; não pesquisa nem copia automaticamente uma tradução sob direitos de terceiros. Testes usam apenas textos fictícios. Ver `RELATORIOS/REVISAO-COMPETENCIA-01.md`.

- 06/11/2025: preparação por versículos acrescentada à primeira leitura (6), ao salmo (5 contando o refrão) e ao Evangelho (10). São glosas PRELIMINARES, ainda não validadas por pessoa surda/intérprete.

### Visualização paralela sincronizada

Para leituras com glosa preliminar referenciada por versículos, o texto e a glosa correspondente aparecem na mesma linha horizontal (colunas CNBB/AVM e glosa), com divisórias discretas. No celular, cada trecho apresenta texto e, logo abaixo, a glosa. Salmos são alinhados por refrão único e estrofes. O pareamento depende de correspondência completa de referências: se uma fonte omitir ou acrescentar versículos sem glosa, o leitor mantém o layout original e não inventa alinhamento. Sínteses temáticas não são apresentadas como glosas integrais. As versões CNBB e Ave-Maria continuam isoladas, com salmo sempre CNBB.
