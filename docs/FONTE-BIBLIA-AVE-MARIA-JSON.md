# Fonte da Bíblia Ave-Maria em JSON — registro de cópia

**Atualização:** 07/11/2026  
**Estado:** os dois arquivos originais foram copiados para o repositório CaminhosDaPalavra, na pasta `data/biblia-ave-maria/`, para preparação do conteúdo de estudo.

## Origem e rastreabilidade

- Origem: https://github.com/fidalgobr/bibliaAveMariaJSON
- Arquivo: `data/biblia-ave-maria/bibliaAveMaria.json`
  - Git blob SHA: `4b18758111c97c16c1e0d26f7d61e39bec20a765`
  - Tamanho: 6.618.747 bytes
- Arquivo: `data/biblia-ave-maria/bibliaAveMariaRAW.json`
  - Git blob SHA: `2277c2509c8a1f73e5537a3b8f7bc26edf20fd82`
  - Tamanho: 5.442.856 bytes
- Procedimento de cópia e conferência: `.github/workflows/copiar-biblia-ave-maria-json.yml`.
- Os hashes verificados no destino correspondem aos arquivos de origem consultados.

## Contagens da base

| Testamento | Livros | Capítulos | Versículos |
| --- | ---: | ---: | ---: |
| Antigo | 46 | 1.074 | 27.498 |
| Novo | 27 | 260 | 7.952 |
| **Total** | **73** | **1.334** | **35.450** |

A rotina de importação confere ambas as versões do JSON, sequências de capítulos e versículos, ausência de texto vazio e hashes dos arquivos.

## Integração com o projeto

- **Situação:** arquivos copiados para armazenamento no repositório; a interface de estudo ainda não os carrega automaticamente.
- **Deploy:** a pasta `data/` está excluída pelo script `scripts/preparar-publicacao.mjs`. Os arquivos não entram no pacote FTP da Locaweb.
- **Independência editorial:** nenhum arquivo de liturgia, glosa, Lecionário ou plano de leitura foi substituído.
- **Próximos trabalhos técnicos:** indexação por livro, capítulo e versículo; navegação no módulo de estudo; pesquisa e sincronização com anotações, mantendo separadas a redação Ave-Maria, a redação litúrgica e as glosas.
- **Decisões editoriais e condições de uso/publicação:** responsabilidade da titular do projeto; a cópia técnica não altera automaticamente a política de exibição do site.

## Identificação da fonte

A integridade estrutural e a identidade binária dos arquivos não comprovam, por si, cotejo textual com uma edição impressa; tal confronto permanece uma verificação editorial distinta.
