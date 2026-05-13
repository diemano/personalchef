# Personal Chef Lucas Medeiros

## What This Is

Uma aplicação web conversacional de tela única projetada para guiar os clientes do Chef Lucas Medeiros através de um processo de orçamento autônomo e interativo. O sistema substitui o atendimento manual via WhatsApp, permitindo que os clientes estruturem um evento (menu de 4 tempos para no mínimo 10 pessoas) com cálculo dinâmico de custos e salvamento contínuo de progresso (lead capture).

## Core Value

A experiência do cliente deve ser fluida e o cálculo do orçamento (real-time) deve ser preciso e transparente a cada interação, culminando em um link de WhatsApp pré-preenchido para fechamento.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Interface conversacional em tela única com 4 seções: Header (progresso), Corpo (interação), Resumo Lateral/Bottom Sheet (cálculo real-time) e Rodapé (navegação).
- [ ] Etapa 1: Captura de lead (nome, WhatsApp, LGPD).
- [ ] Etapa 2: Apresentação do serviço, itens inclusos e lógica de custos adicionais.
- [ ] Etapa 3: Dados do evento (data, turno, local, mínimo de 10 convidados, ocasião).
- [ ] Etapa 4: Viabilidade e adicionais (estrutura de cozinha, decoração, cálculo automático de garçons).
- [ ] Etapa 5: Restrições alimentares detalhadas (alergias, preferências).
- [ ] Etapa 6: Escolha do menu de 4 tempos (Fria, Quente, Principal, Sobremesa).
- [ ] Etapa 7: Personalização/Upsell (troca de proteína, prato duplicado, tempo adicional).
- [ ] Etapa 8: Resumo final, cálculo completo (base + adicionais) e geração de deeplink do WhatsApp com template da mensagem codificado.
- [ ] Autosave contínuo do progresso do lead (debounce de 1 segundo).

### Out of Scope

- [Pagamento/Checkout nativo] — O fechamento financeiro ocorre via WhatsApp com o Chef.
- [Scroll vertical longo clássico] — A interface deve transitar as visões como passos (horizontal/fade).
- [Orçamentos para menos de 10 pessoas] — Regra de negócio bloqueia o simulador para quantidades menores.

## Context

A aplicação é uma ferramenta de otimização de atendimento e vendas. Atualmente, o Chef perde tempo detalhando o menu e as regras de custos via chat. A solução deve ser "Mobile-First", pois o público chega primariamente via links em redes sociais (Instagram/WhatsApp). O front-end exige cálculos dinâmicos constantes e reatividade imediata na interface, exigindo uma boa arquitetura de gerenciamento de estado.

## Constraints

- **Tecnologia**: React ou Next.js — Melhor performance, SEO e reatividade.
- **Estilização**: Tailwind CSS — Design responsivo ágil.
- **Gerenciamento de Estado**: React Context API ou Zustand — Para controle global do orçamento sem prop-drilling excessivo.
- **Formulários**: React Hook Form + Zod — Controle de validação rigoroso (ex: limite de convidados, telefone, LGPD).
- **Componentes UI**: Lucide React, Radix UI, ou shadcn/ui — Proporciona um design sofisticado alinhado com gastronomia premium.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Abordagem Conversacional (Step-by-step) | Reduz a fricção e guia o cliente de forma semelhante a uma conversa humana. | — Pending |
| Debounce no Autosave | Previne a perda de leads sem sobrecarregar a infraestrutura com requisições HTTP excessivas. | — Pending |

---
*Last updated: 2026-05-13 after initialization*
