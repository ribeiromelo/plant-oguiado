# Sistema visual — Plantão Guiado

O sistema visual prioriza leitura, hierarquia e uso em telas pequenas. A identidade usa superfícies neutras, contraste entre texto e fundo e um verde discreto para navegação, foco e ações principais. Cores de alerta e de estados clínicos continuam distintas.

## Onde ficam os estilos

- `public/static/design-system.css` contém os tokens e os componentes visuais compartilhados. Ele é carregado por último nas telas de login, evolução, prescrições e receituário.
- `public/static/styles.css` mantém classes já usadas pela aplicação, como `.card`, `.btn`, `.form-input`, `.mode-tab` e `.preview-panel`.
- O HTML das telas está em `src/index.tsx`. As classes `.pg-evolucao`, `.pg-prescricoes` e `.pg-receituario` permitem ajustes específicos sem afetar outras páginas.

## Fundamentos

| Token | Valor | Uso |
| --- | --- | --- |
| `--pg-ink` | `#202b29` | Títulos e texto principal |
| `--pg-muted` | `#6b7773` | Texto secundário |
| `--pg-canvas` | `#f4f5f2` | Fundo da aplicação |
| `--pg-surface` | `#ffffff` | Superfícies e campos |
| `--pg-border` | `#dfe4df` | Bordas sutis |
| `--pg-accent` | `#335e54` | Ações principais e foco |
| `--pg-accent-soft` | `#e6efea` | Seleções e fundos discretos |

A tipografia é Inter, com fontes do sistema como alternativa. Bordas, raios e sombras compartilhados são definidos pelos tokens `--pg-border-*`, `--pg-radius-*` e `--pg-shadow`.

## Componentes e comportamento

- Cartões agrupam conteúdo e mantêm espaçamento interno consistente; campos possuem borda e indicador de foco visível.
- A navegação das páginas secundárias usa `.pg-subheader`, `.pg-header-nav` e `.pg-logout`. Na evolução, a navegação lateral recolhe abaixo de 1024 px.
- Cores adicionais são reservadas para situações que já possuem significado, como alertas, seleção de modo e categorias; elas não substituem rótulos de texto.
- A pré-visualização A4 do receituário conserva seu CSS de impressão. As alterações visuais da interface ficam em `@media screen` para não mudar a receita impressa.
- As animações respeitam a preferência de redução de movimento do sistema.

Antes de criar um componente, prefira os tokens e as classes compartilhadas existentes. Ao alterar formulários, preserve os atributos `x-model`, eventos, opções e conteúdo clínico; confira também o foco por teclado, a apresentação no celular e o resultado de impressão quando aplicável.
