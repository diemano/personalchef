# Phase 1 Context: Foundation & Layout

## Decisions
- **Transições de Layout**: A interface deve utilizar animações suaves de fade in e fade out para a transição entre as telas/passos, proporcionando uma experiência fluida.
- **Comportamento Mobile (Resumo)**: O "Bottom Sheet" (resumo móvel) deve aparecer parcialmente visível, porém apenas a partir da tela de escolhas (Etapa 6). As primeiras telas não devem exibir esse resumo.
- **Persistência de Estado Local**: O Zustand deve estar configurado para salvar o estado no `localStorage`. Além disso, a arquitetura de estado (stores, actions) deve estar preparada/isolada para uma futura integração com backend, embora no momento atual deva funcionar com dados locais e mockados.
- **Diretrizes de Design**: A estética deve ser elegante e refinada. 

## Specifics
- Consultar a pasta `./prototipos/` para guiar a construção visual.
- Utilizar os arquivos `prototipos/design-modelo1.png` e `prototipos/design-modelo2.png` como referência obrigatória para logotipo, paleta de cores, tipografia e "pegada" refinada.
- Considerar os mockups das telas (ex: `tela 1-1.png`, etc.) na pasta `./prototipos/` para estruturação do layout.

## Deferred Ideas
- A integração real do envio/recebimento de dados para um backend ativo. (A infraestrutura deve estar pronta, mas mockada).

## Canonical refs
- `./prototipos/design-modelo1.png`
- `./prototipos/design-modelo2.png`
