# Comando 0 — duas edições e glosas independentes

## Regra do Drive
Leitor pode escolher 1 — CNBB ou 2 — Bíblia Ave-Maria para primeira leitura, segunda leitura e Evangelho. O salmo responsorial e sua glosa permanecem CNBB em ambas as opções. A escolha de tradução é independente das alternativas litúrgicas.

## Auditoria material
O acervo liturgia-br-acervo.js contém 30 datas e 96 textos de novembro/2025 capturados de API comunitária. A presença técnica não garante cotejo com o Lecionário CNBB; edição ainda sujeita a conferência versículo a versículo. Os arquivos legados A/B/C incluem redação portuguesa, não devem ser homologados como CNBB por renomeação.
O arquivo bible-data.js identifica a Bíblia Ave-Maria versão AVM/4542 e oferece catálogo/link, mas não possui o texto integral das passagens. Portanto a base separada liturgia-ave-maria-acervo.js começa vazia: 0 textos Ave-Maria importados/cotejados, 0 glosas Ave-Maria correspondentes. Não foi inventado texto dessa edição nem atribuída uma glosa CNBB à Ave-Maria.

## Código implementado
Seletor visível dentro de Liturgia + Libras (CNBB / Bíblia Ave-Maria). Ao mudar para Ave-Maria, o código substitui o texto E a glosa; quando faltarem mostra lacunas específicas, sem aproveitar a outra tradução. Um registro posterior só é aceito se edition AVM, tipo e referência forem corretos; a glosa precisa referenciar exatamente o ID textual. Salmo permanece CNBB e independe da escolha. Alternativas próprias da celebração continuam disponíveis na estrutura anterior. Conteúdo legado tem identificação explícita de edição ainda não cotejada, sem falso rótulo CNBB. Nenhum acesso do visitante chama API externa.
Teste automatizado de separação dos registros e troca foi adicionado. A verificação visual em Locaweb e no navegador não se deduz do teste nem do envio FTP.

## Critérios pendentes
- Cotejo de cada passagem importada com a redação real CNBB.
- Importação única da Bíblia Ave-Maria para primeira/segunda leituras e Evangelho e revisão de seu texto por recorte.
- Glosas integrais e revisão linguística específicas para cada tradução.
- Validação humana especializada em Libras e testes do PDF final com pares completos.
A competência 01/36 continua EM REVISÃO; não confundir Comando 0 técnico com conclusão editorial do mês.

## Matriz por ocorrência
Arquivo STATUS-EDICOES-2025-11.csv cadastra 96 ocorrências, incluindo 30 salmos/cânticos, com colunas separadas de origem, cotejo CNBB, glosa CNBB, texto Ave-Maria, glosa Ave-Maria e validação humana. Não se usa o status único “pronto” para todos os dados da data. Verificação automática da contagem e do salmo exclusivamente CNBB.
