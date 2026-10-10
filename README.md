# Caminhos da Palavra — por Libras com Eduarda

Ambiente digital de experiência com a Palavra de Deus que reúne Bíblia, plano de leitura, calendário litúrgico e recursos de preparação da Liturgia em Libras. A proposta é favorecer leitura, compreensão, preparação e participação na vida da Igreja em uma experiência visual, organizada e acessível.

## Posicionamento

**Caminhos da Palavra** é um ambiente para viver a Palavra de Deus ao longo dos dias e no ritmo da Igreja. A experiência integra quatro caminhos principais: **Bíblia Sagrada, Plano de Leitura, Calendário Litúrgico e Liturgia e Libras**.

O projeto **não se apresenta como conteúdo em Libras**. Na frente Liturgia e Libras, as glosas são ferramentas escritas de preparação e não equivalem à Libras, a uma interpretação sinalizada ou a uma tradução oficial.

Os recursos de preparação podem apoiar especialmente quem está começando a interpretar no contexto da Igreja Católica, sem substituir:

- cursos e formação linguística;
- profissionais qualificados;
- prática real de interpretação;
- contato e convivência com pessoas surdas;
- revisão e validação por usuários e profissionais competentes.

O ambiente também serve a cristãos que desejam ler a Bíblia, manter uma caminhada de leitura, acompanhar o calendário litúrgico e se preparar para a Liturgia da Palavra. A acessibilidade é tratada como princípio transversal da apresentação.

A assinatura **por Libras com Eduarda** preserva a origem e a autoria do projeto sem limitar a plataforma exclusivamente à Libras.

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

## Revisão editorial das glosas — Ano A (10/10/2026)

O acervo do Ano A contém **60 celebrações e 241 itens**, com originais e glosas-base associados. Foi realizada triagem estrutural dos 241 registros e revisão editorial ampliada de 7 roteiros prioritários (Jo 4,5-42; Jo 9,1-41; Jo 11,1-45; Mt 26,14–27,66; Rm 5,12-19; Mt 5,17-37; Mt 13,1-23). Os textos reescritos estão isolados em `glosas-revisadas-ano-a.js`, identificados pela chave da celebração, sem alterar as glosas dos ciclos B e C.

Também foram criados mapeamentos específicos de refrão e estrofes para o **Salmo 72** no 2º Domingo do Advento e na Epifania, evitando reutilizar uma mesma glosa para configurações litúrgicas distintas. A correspondência dos demais salmos deve ser conferida individualmente.

O inventário, os alertas editoriais e os critérios de homologação estão em [REVISAO-GLOSAS-ANO-A.md](./REVISAO-GLOSAS-ANO-A.md). **A revisão editorial escrita não constitui validação da Libras**: naturalidade, espacialização, uso de marcadores não manuais, adequação pastoral e concordância com a comunidade surda dependem de análise especializada e ensaio. Os demais itens continuam classificados como preliminares.

