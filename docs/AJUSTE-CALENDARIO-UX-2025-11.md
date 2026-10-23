# Ajuste de navegação — Calendário → Liturgia e Libras

Data: 23/10/2026. Ajuste limitado ao acesso ao acervo pelo calendário, sem edição de glosas ou textos litúrgicos.

- A ação "Abrir texto e glosa de apoio desta data" aparece no início do bloco **Liturgia da Palavra**, antes da longa seção de catequese e santos. Aparece somente quando `entriesForDate()` tem registros do acervo dominical. O botão antigo ao final foi retirado, para evitar duplicidade de caminhos.
- Para datas sem registro dominical e sem roteiro editorial, aparece aviso de indisponibilidade, sem ação enganosa.
- Nas datas com `glosaBlocks` preliminares da competência 01/36, uma segunda ação desloca a leitura para o **roteiro visual em estudo**, sem apresentá-lo como glosa validada.
- URL para revisar novembro de 2025: `https://caminhosdapalavra.compassrosesystems.com.br/#calendario-liturgico?mes=2025-11`.
- URL para abrir o primeiro Domingo do Advento: `https://caminhosdapalavra.compassrosesystems.com.br/#calendario-liturgico?data=2025-11-30`.
- URL direta para acervo de textos e glosas, onde cadastrados: `https://caminhosdapalavra.compassrosesystems.com.br/#liturgia-e-libras?data=2025-11-30`.
- URLs por dia validam ano, mês e dia antes de selecionar; mês aceita `YYYY-MM`. As mudanças do seletor e das setas também refletem na URL.
- As glosas ainda exigem revisão integral e validação humana; o texto brasileiro oficial ainda requer cotejo/autorizações. Nenhum novo conteúdo litúrgico foi homologado nesta alteração.

Teste automático adicionado: `tests/calendario-ux.test.cjs`; os demais testes existentes continuam ativos.
