# Libras com Eduarda — Católicos

Plataforma web acessível para organização e estudo de conteúdos católicos em Libras.

## Estado atual

A interface pública já contém:

- **Liturgia** em visualização de lista/accordion;
- abertura de apenas um item por vez;
- **texto litúrgico × glosa** lado a lado em telas maiores;
- empilhamento responsivo em celular;
- destaque visual principal na **glosa**, não nas observações;
- observações de cenário, movimento, foco e mudança de papel em estilo secundário;
- busca por texto, referência bíblica, ano litúrgico, item litúrgico e **data**;
- **VLibras Widget** oficial;
- calendário navegável de **2026 a 2030**;
- módulo da **Bíblia Sagrada Ave-Maria**, com os 73 livros e capítulos;
- acesso à leitura e ao áudio da AVM por fonte licenciada da Editora Ave-Maria na YouVersion;
- plano de leitura baseado no método **“A Bíblia no meu dia a dia”**, de Monsenhor Jonas Abib;
- progresso persistido no navegador;
- dois indicadores separados no plano:
  - progresso do método, incluindo repetições previstas;
  - percentual de capítulos distintos da Bíblia já percorridos;
- repertório de músicas prioritárias.

## Fontes e validação

### Calendário litúrgico

Referência operacional de calendário para o Brasil:

- GCatholic — Brasil: https://gcatholic.org/calendar/2026/BR-pt

Referência normativa complementar sobre o ano litúrgico:

- Secretariado Nacional de Liturgia: https://www.liturgia.pt/documentos/ano_lit.php

Referência brasileira para os ciclos dominicais A/B/C:

- CNBB: https://www.cnbb.org.br/a-liturgia-e-o-ano-b/

A implementação atual gera a estrutura calendárica, tempos litúrgicos, ciclos, domingos e principais celebrações móveis para 2026–2030. Celebrações próprias, memórias e santoral detalhado podem ser adicionados em uma próxima camada de dados.

### Texto litúrgico

O sistema está configurado para trabalhar com o **texto litúrgico do Lecionário/Missal utilizado no Brasil** como versão principal da liturgia.

O campo já existe em cada registro e permanece separado da glosa.

Nesta etapa, o repositório não reproduz integralmente uma edição brasileira ainda não fornecida/licenciada. Quando o texto validado for incorporado, cada unidade poderá ser pareada com sua glosa correspondente.

### Bíblia Ave-Maria

A Bíblia Ave-Maria é tratada como versão própria e independente da glosa litúrgica.

Leitura licenciada:

- https://www.bible.com/pt/versions/4542

Áudio:

- https://www.bible.com/pt/audio-bible-app-versions/4542-avm-b%C3%ADblia-sagrada-ave-maria

A arquitetura cadastra localmente apenas metadados dos 73 livros, capítulos, referências, progresso, glosas próprias e relacionamentos. O texto bíblico protegido permanece na fonte licenciada enquanto não houver autorização/API para reprodução interna.

## Plano de leitura — Monsenhor Jonas Abib

Fonte-base:

- Canção Nova / Monsenhor Jonas Abib: https://padrejonas.cancaonova.com/?p=1441

A programação permite:

- meta diária de 3 ou 4 capítulos;
- marcar capítulos concluídos;
- salvar o progresso no navegador;
- respeitar repetições do método;
- distinguir repetição do plano de cobertura real da Bíblia;
- abrir o capítulo correspondente na Bíblia Ave-Maria.

## Arquivos

- `index.html` — estrutura da interface pública.
- `styles.css` — sistema visual e responsividade.
- `data.js` — conteúdo litúrgico e repertório inicial.
- `bible-data.js` — 73 livros, capítulos e sequência do plano Jonas Abib.
- `calendar.js` — calendário litúrgico programático 2026–2030.
- `app.js` — busca, accordions, calendário, Bíblia, plano e navegação.
- `.github/workflows/main.yml` — deploy FTP para Locaweb.

## Próxima camada

- Supabase/PostgreSQL;
- painel administrativo;
- versionamento e revisão;
- pareamento do texto litúrgico por unidade de sentido com cada glosa;
- conteúdo completo dos ciclos A/B/C;
- integração de música, rosário, orações e glossário;
- vídeos próprios em Libras;
- sincronização de calendário mais granular;
- autenticação e perfis administrativos.
