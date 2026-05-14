# Roadmap - Personal Chef Lucas Medeiros

## Milestone 1: Conversational MVP (Phase 1-8)

### Phase 1: Captura Inicial (Lead) [DONE]
- [x] Setup do projeto e layout shell.
- [x] Tela 1.1: Nome do cliente (Chat style).
- [x] Tela 1.2: WhatsApp + LGPD (Chat style).
- [x] Persistência inicial do lead.

### Phase 2: Apresentação e Conceito [DONE]
- [x] Tela 2.1: O Menu de 4 Tempos (Cards ilustrativos).
- [x] Tela 2.2: Itens Inclusos (Lista com ícones).
- [x] Tela 2.3: Lógica de Custos (Regras adicionais).

### Phase 3: Dados do Evento [DONE]
- [x] Tela 3.1: Data e Turno (Calendário + Seleção).
- [x] Tela 3.2: Local (Cidade, Bairro, Tipo).
- [x] Tela 3.3: Convidados (Contador min 10).
- [x] Tela 3.4: Ocasião (Tags selecionáveis).

### Phase 4: Viabilidade e Adicionais [DONE]
- [x] Tela 4.1: Estrutura da Cozinha (Checklist).
- [x] Tela 4.2: Decoração (Toggle + Adicional R$ 250).
- [x] Tela 4.3: Garçons (Cálculo automático + R$ 120/garçom).

### Phase 5: Restrições Alimentares [DONE]
- [x] Tela 5.1: Alergias e Preferências (Sim/Não + Grid).

### Phase 6: Escolha do Menu (O Coração) [DONE]
- [x] Telas 6.1 a 6.4: Seleção dos pratos (Fria, Quente, Principal, Sobremesa).
- [x] Validação: 1 prato por categoria.

### Phase 7: Personalização (Upsell) [DONE]
- [x] Corrigir cálculo base do resumo: `convidados * R$ 220` deve entrar no `totalCost` antes dos adicionais.
- [x] Tela 7.1: Opções extras (Checklist: Proteína, Prato duplicado, Tempo adicional).
- [x] Tela 7.2: Seleção condicional de pratos extras.

### Phase 8: Resumo e Checkout [DONE]
- [x] Tela 8.1: Resumo final detalhado.
- [x] Botão: "Falar com o Chef" (WhatsApp Deeplink).

### Phase 9: Verificacao formal e fechamento [GAP CLOSURE]
**Goal:** Fechar as lacunas formais apontadas em `.planning/v1.0-MILESTONE-AUDIT.md` antes do arquivamento do milestone.
**Requirements:** CORE-03, STEP-07, STEP-08, WAPP-01.
**Gap Closure:** Cria evidencias de verificacao/validacao, registra UAT do fluxo completo e atualiza os requisitos pendentes.

- [ ] Criar artefatos `VERIFICATION.md` para as fases 1-8, com foco especial no fluxo completo.
- [ ] Criar ou registrar decisao de deferimento para os artefatos `VALIDATION.md`.
- [ ] Executar build/lint e registrar evidencia de verificacao.
- [ ] Validar manualmente o fluxo lead -> evento -> menu -> upsell -> checkout -> WhatsApp.
- [ ] Atualizar `REQUIREMENTS.md` para marcar CORE-03, STEP-07, STEP-08 e WAPP-01 somente apos a verificacao.
