# Phase 2 Context: Lead Capture & Concept (Steps 1 & 2)

## Decisions
- **Validação da Etapa 1**:
  - O campo de Nome deve validar se há pelo menos duas palavras (nome e sobrenome).
  - O campo de WhatsApp deve exigir um número no formato correto (incluindo DDD).
  - O botão de "Continuar" para a próxima etapa ficará desabilitado (ou bloqueado com feedback visual) até que o Nome, WhatsApp e a marcação de aceite da LGPD estejam preenchidos e válidos.
- **Máscara de WhatsApp**: Deve-se aplicar a máscara padrão do Brasil `(99) 99999-9999` dinamicamente no input enquanto o cliente digita.
- **Simulação de Autosave (CORE-04)**: Utilizar um mock (função com um `setTimeout` de delay e um `console.log`) engatilhado por debounce (~1 segundo) para simular o comportamento de salvamento no backend sem interromper a fluidez da UI.
- **Interatividade da Etapa 2**: A tela que apresenta o conceito de "4-course menu" e as regras (STEP-02) será estática/informativa. Não haverá sub-navegação ou cliques de detalhamento nos cards nesse momento. O foco é apresentar a oferta claramente e permitir o avanço.

## Specifics
- Consultar `./prototipos/tela 1-1.png` e `tela 1-2.png` para a Etapa 1.
- Consultar `./prototipos/tela 2-1.png` até `tela 2-3.png` para a formatação dos cards descritivos da Etapa 2.
- A biblioteca `react-hook-form` associada ao `zod` (definido no PROJECT.md) deverá ser usada para lidar com a validação rigorosa (nome composto e telefone).

## Deferred Ideas
- Requisições HTTP reais de salvamento de lead.
- Expansão de detalhes dinâmicos no conceito do cardápio.

## Canonical refs
- `./prototipos/tela 1-1.png`
- `./prototipos/tela 1-2.png`
- `./prototipos/tela 2-1.png`
- `./prototipos/tela 2-2.png`
- `./prototipos/tela 2-3.png`
