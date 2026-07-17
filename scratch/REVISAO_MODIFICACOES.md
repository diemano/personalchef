# PERSONAL CHEF - REVISÃO DE MODIFICAÇÕES SUGERIDAS

> Base: Reunião 26/jun/2026 + Documento de Alterações (docx)
> Legenda: ✅ Implementado | ⚠️ Parcial | ❌ Não implementado | 🔍 A verificar

---

## 🔷 ETAPA 1: DADOS DO CLIENTE (Nome + Contato)

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 1.1 | Unificar nome e telefone na mesma página (remover página separada só de telefone) | docx | ✅ |
| 1.2 | Texto: "Olá, eu sou o Chef Lucas Medeiros e vou te acompanhar na criação do seu evento. Para começarmos, como posso te chamar?" | docx | ✅ |
| 1.3 | Adicionar vídeo de apresentação do Chef Lucas **após a etapa 1** (inserção de dados do cliente). Vídeo opcional, posicionado para criar conexão sem obstruir o fluxo. | PDF + docx | ✅ |
| 1.4 | Aumentar tamanho do nome "Chef Lucas Medeiros" | PDF | ⚠️ |
| 1.5 | Usar fontes sem serifa nas etapas (estética mais limpa e moderna) | PDF | ✅ |

---

## 🔷 ETAPA 2: EXPLICAÇÃO DO SERVIÇO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 2.1 | **INVERTER ordem**: tela de explicação do serviço ANTES da descrição de tempos. Usuário deve compreender a proposta de valor antes de detalhes técnicos. | PDF | ✅ |
| 2.2 | Texto: "Oferecemos experiências gastronômicas de alto padrão, intimistas no conforto da sua casa. Levamos toda a estrutura necessária, realizamos a montagem da mesa, finalizamos os pratos diante dos seus convidados e, ao final do evento, deixamos tudo organizado." | docx | ✅ |
| 2.3 | **REMOVER** a página "ETAPA 02" antiga (explicação de tempos) | docx | ✅ |
| 2.4 | Adicionar passo a passo explicativo do processo (ideia com IA, não precisa seguir exatamente) | docx | ✅ |

---

## 🔷 ETAPA 3: DATA DO EVENTO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 3.1 | Texto: "Para pré-reservarmos sua data, quando está previsto o seu evento?" | docx | ⚠️ |
| 3.2 | Sistema: usuário seleciona data desejada, equipe valida disponibilidade via contato direto (sem integração completa de agenda) | PDF | ✅ |

---

## 🔷 ETAPA 4: LOCAL DO EVENTO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 4.1 | Texto: "Onde será realizado o evento?" | docx | ⚠️ |
| 4.2 | **UNIR** tipo de local + ocasião na mesma página (reduzir etapas) | docx | ✅ |
| 4.3 | Adicionar opção "local não definido" para casos em que o local ainda não foi escolhido (navegação continua sem obrigatoriedade de endereço) | PDF | ✅ |
| 4.4 | Adicionar campo de **observações** na tela de endereço | PDF | ✅ |
| 4.5 | Adicionar campo de entrada de texto na opção **"outro"** dentro do tipo de local | PDF | ✅ |
| 4.6 | Desabilitar campos de endereço quando opção "local não definido" for selecionada | PDF | ✅ |

---

## 🔷 ETAPA 5: OCASIÃO / TIPO DE EVENTO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 5.1 | Remover opções pré-definidas, deixar apenas **campo de texto livre** para o cliente informar a ocasião | docx | ⚠️ |
| 5.2 | Título: "QUAL TIPO DO SEU EVENTO" | docx | ⚠️ |
| 5.3 | Placeholder/sugestões na barra: "Aniversário, casamento, noivado, batizado, confraternização, corporativo..." | docx | ✅ |
| 5.4 | Atualizar categorias de celebração incluindo **"confraternizações"** e **"batizado"** | PDF | ✅ |
| 5.5 | Unificar esta etapa com a etapa de local (item 4.2) | docx | ✅ |

---

## 🔷 ETAPA 6: CONVIDADOS

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 6.1 | Alterar tela para permitir que o usuário **digite o número exato** de convidados (em vez de botões pré-definidos) | PDF | ✅ |
| 6.2 | Definir regra dinâmica de equipe com base na quantidade de convidados (cálculo automático de garçons) | PDF | ✅ |

---

## 🔷 ETAPA 7: MENU (Escolha de Pratos)

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 7.1 | Texto entrada fria: "Nome, Vamos começar a montar o seu menu. Escolha a sua entrada fria" | docx | ⚠️ |
| 7.2 | Texto entrada quente: "Nome, agora escolha a entrada quente." | docx | ⚠️ |
| 7.3 | Texto prato principal: "Nome, chegamos ao prato principal. Qual combina mais?" | docx | ⚠️ |
| 7.4 | Texto sobremesa: "Nome, para finalizar, escolha a sua sobremesa" | docx | ⚠️ |
| 7.5 | Exibir estimativa total (qtd convidados × valor unitário) a partir da tela de escolha da **entrada fria** | PDF | ⚠️ |
| 7.6 | Permitir cadastrar pratos com nome e foto no admin | PDF | ✅ |
| 7.7 | Pratos sazonais podem ser marcados como **"inativos"** (sem exclusão) | PDF | ✅ |
| 7.8 | Limite de 5MB para upload de fotos de pratos no admin (otimizar velocidade mobile) | PDF | ✅ |

---

## 🔷 ETAPA 8: PERSONALIZAÇÕES (após escolha do menu)

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 8.1 | Texto: "Caso deseje uma experiência ainda mais exclusiva, você poderá personalizá-la com as opções abaixo." | docx | ⚠️ |
| 8.2 | **Mudar proteína**: adicionar campo de texto simples abaixo da opção para o cliente especificar a alteração desejada (evitar menu complexo) | PDF + docx | ✅ |
| 8.3 | **Prato duplicado**: fluxo de seleção dedicado — ao selecionar, direcionar para etapa de escolha específica daquele prato (sem percorrer fluxo principal novamente) | PDF + docx | ✅ |
| 8.4 | **Tempo adicional**: fluxo de seleção dedicado — ao selecionar, direcionar para escolha do prato correspondente no cardápio. Tempo adicional = horas extras além das 5h padrão (2h montagem + 3h serviço) | PDF + docx | ✅ |
| 8.5 | Garantir que seleção de tempo adicional leve à escolha do prato correspondente no cardápio | PDF | ✅ |
| 8.6 | Página de personalizações posicionada logo após a etapa de escolha do menu | docx | ✅ |

---

## 🔷 ETAPA 9: RESTRIÇÕES ALIMENTARES

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 9.1 | **MUDAR ORDEM**: tela de restrições deve aparecer **APÓS a escolha do menu** (não antes) | PDF | ✅ |
| 9.2 | **SUBSTITUIR botões clicáveis** por um **campo de texto livre** com orientações | PDF | ⚠️ |
| 9.3 | Adicionar campo para especificar o **nome do convidado** com restrição alimentar | PDF | ⚠️ |
| 9.4 | Incluir **exemplos de restrições** no texto de apoio: gravidez, amamentação, alergias (ex: APLV) | PDF | ✅ |
| 9.5 | Política de custo: substituição de proteína por alergia = sem custo adicional; prato inteiramente diferente por preferência = cobrança extra | PDF | ❌ |
| 9.6 | Remover campos de "total estimado" e valores do rodapé na tela de restrições | PDF | ✅ |

---

## 🔷 ETAPA 10: ESTRUTURA DA COZINHA

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 10.1 | **MOVER** esta etapa para **após a conclusão do menu**, em seguida da página de garçons | docx | ⚠️ |
| 10.2 | Transformar em tela **informativa** (não interativa) | PDF | ✅ |
| 10.3 | Adicionar **checkbox "estou ciente"** para confirmar que o usuário compreende a necessidade de recursos (água, energia, fogão, geladeira, bancada, tomadas, pia) | PDF | ✅ |
| 10.4 | Texto: "Para garantir o bom funcionamento da experiência gastronômica, é necessário que o local disponha de uma estrutura básica, incluindo fogão, geladeira, bancada de apoio, tomadas e pia com ponto de água. Você confirma que o local do evento conta com essa estrutura básica?" | docx | ✅ |

---

## 🔷 ETAPA 11: DECORAÇÃO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 11.1 | **MOVER** para depois da escolha do menu | docx | ✅ |
| 11.2 | Texto incluso na decoração: "Estão inclusos jogo americano em couro preto ou marrom, pratos para todos os tempos do menu, talheres, arranjos florais, velas e papelaria personalizada para compor a experiência." | docx | ✅ |
| 11.3 | Observação: "itens relacionados às bebidas, como taças e copos, são de responsabilidade do cliente." | docx | ✅ |
| 11.4 | Incorporar fotografias nas telas de decoração (mais atrativo visualmente) | PDF | ✅ |
| 11.5 | Admin permitir alteração de preços e regras de decoração | PDF | ✅ |

---

## 🔷 ETAPA 12: GARÇONS / EQUIPE

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 12.1 | Texto: "Com base no número de convidados, calculamos automaticamente a quantidade de garçons recomendada para garantir um serviço ágil e fluido durante toda a experiência." | docx | ⚠️ |
| 12.2 | Quantidade de garçons calculada automaticamente com base no número de convidados | PDF + docx | ✅ |
| 12.3 | Possibilidade futura de tornar campo editável manualmente | PDF | ❌ |
| 12.4 | Manter regras técnicas de cálculo ocultas na interface do cliente (exibir apenas resultado do custo) | PDF | ✅ |

---

## 🔷 ETAPA 13: CHECKOUT / FINALIZAÇÃO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 13.1 | Texto: "Tudo pronto! Revise o resumo do seu evento e, se estiver tudo certo, entre em contato pelo WhatsApp para darmos continuidade ao atendimento." | docx | ⚠️ |
| 13.2 | Tela final deve conter **resumo** e botão **"Falar com o Chefe"** | PDF | ✅ |
| 13.3 | **DISCLAIMER**: "Importante: sua data será considerada reservada somente após a confirmação do pagamento de 50% do valor do evento." | PDF + docx | ✅ |
| 13.4 | Mensagem de confirmação ao clicar no botão de contato, redirecionando para WhatsApp com dados do orçamento | PDF | ✅ |

---

## 🔷 ETAPA 14: REMOVER VALORES / TOTAL ESTIMADO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 14.1 | Retirar campo "total estimado" e área de valores das **telas iniciais** | PDF | ✅ |
| 14.2 | Mover exibição de preços para **após a seleção do menu** | PDF | ✅ |
| 14.3 | Remover campos de "total estimado" e valores exibidos no **rodapé do orçamento** | PDF | ✅ |
| 14.4 | Exibir estimativa total a partir da tela de **entrada fria** (qtd convidados × valor unitário) | PDF | ⚠️ |

---

## 🔷 GERAL: NAVEGAÇÃO E PROGRESSO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 15.1 | Barra de progresso **dourada** (validada como ferramenta essencial) | PDF | ✅ |
| 15.2 | **Etapas clicáveis** (bullets) no topo permitindo navegação direta entre etapas sem reiniciar o processo | PDF | ✅ |
| 15.3 | Ao clicar nas opções numeradas (1 a 8), sistema deve direcionar de volta ao **início da etapa específica** | PDF | ✅ |
| 15.4 | Interface desenvolvida com conceito **mobile-first** | PDF | ✅ |

---

## 🔷 GERAL: RODAPÉ

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 16.1 | Adicionar botão **"Falar com o Chefe"** de forma **FIXA no rodapé** (sempre acessível, sem necessidade de rolagem) | PDF | ❌ |

---

## 🔷 GERAL: IDENTIDADE VISUAL

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 17.1 | Adotar cor **azul** da logomarca | PDF | ✅ |
| 17.2 | Aplicar versão **reduzida** da logomarca (fornecida por Lucas/Fernanda) | PDF | ✅ |
| 17.3 | Considerar modos claro e escuro | PDF | ❌ |
| 17.4 | Fontes sem serifa nas etapas | PDF | ✅ |

---

## 🔷 LGPD / CONSENTIMENTO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 18.1 | Modificar texto do consentimento LGPD para abordagem **mais simples e amigável** | PDF | ✅ |
| 18.2 | Sistema salva dados progressivamente no backend (equipe de vendas identifica usuários que interromperam preenchimento) | PDF | ✅ |

---

## 🔷 CACHE

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 19.1 | Implementar limpeza automática do cache do navegador após clique no botão de enviar orçamento (evitar dados residuais em novo pedido) | PDF | ✅ |

---

## 🔷 PAINEL ADMINISTRATIVO

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 20.1 | Criar menu de **"Marketing"** no admin para inserção de códigos de rastreamento (Pixel Facebook, Google Analytics, Google Tag Manager) | PDF | ✅ |
| 20.2 | Admin deve consolidar todas as informações: modificações de proteína, duplicidade de pratos, permitindo visualizar e fechar contratos | PDF | ✅ |
| 20.3 | Painel de leads e orçamentos (Sprint 3) | PDF | ✅ |
| 20.4 | Permitir alteração de preços e regras de decoração | PDF | ✅ |
| 20.5 | Limite de 5MB para upload de fotos de pratos | PDF | ✅ |
| 20.6 | Pratos sazonais: marcar como "inativos" sem exclusão | PDF | ✅ |

---

## 🔷 RASTREAMENTO / MARKETING

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 21.1 | Migrar tráfego de campanhas para o site (maior precisão na captura de dados via pixel) | PDF | ✅ |
| 21.2 | Configurar eventos de conversão para cada clique nas etapas do processo | PDF | ❌ |
| 21.3 | Disponibilizar informações de eventos para Google Tag Manager e Facebook Pixel | PDF | ⚠️ |
| 21.4 | Permitir identificação de pontos de desistência dos usuários | PDF | ❌ |

---

## 🔷 IMAGENS E MÍDIA

| # | Modificação | Fonte | Status |
|---|-------------|-------|--------|
| 22.1 | Incorporar fotografias nas telas de decoração e execução | PDF | ✅ |
| 22.2 | Enviar imagens ilustrativas do serviço de gastronomia (Lucas/Fernanda) | PDF | ⚠️ |

---

## 📊 RESUMO

| Categoria | Total | ✅ | ⚠️ | ❌ |
|-----------|-------|-----|------|------|
| Etapa 1: Dados do Cliente | 5 | 4 | 1 | 0 |
| Etapa 2: Explicação Serviço | 4 | 4 | 0 | 0 |
| Etapa 3: Data | 2 | 1 | 1 | 0 |
| Etapa 4: Local | 6 | 5 | 1 | 0 |
| Etapa 5: Ocasião | 5 | 3 | 2 | 0 |
| Etapa 6: Convidados | 2 | 2 | 0 | 0 |
| Etapa 7: Menu | 8 | 4 | 4 | 0 |
| Etapa 8: Personalizações | 6 | 5 | 1 | 0 |
| Etapa 9: Restrições | 6 | 3 | 2 | 1 |
| Etapa 10: Cozinha | 4 | 3 | 1 | 0 |
| Etapa 11: Decoração | 5 | 5 | 0 | 0 |
| Etapa 12: Garçons | 4 | 2 | 1 | 1 |
| Etapa 13: Checkout | 4 | 3 | 1 | 0 |
| Etapa 14: Remover Valores | 4 | 3 | 1 | 0 |
| Navegação/Progresso | 4 | 4 | 0 | 0 |
| Rodapé | 1 | 0 | 0 | 1 |
| Identidade Visual | 4 | 3 | 0 | 1 |
| LGPD | 2 | 2 | 0 | 0 |
| Cache | 1 | 1 | 0 | 0 |
| Admin | 6 | 6 | 0 | 0 |
| Rastreamento | 4 | 1 | 1 | 2 |
| Imagens/Mídia | 2 | 1 | 1 | 0 |
| **TOTAL** | **89** | **65** | **18** | **6** |

### Percentuais:
- ✅ **Implementado**: 65/89 = **73%**
- ⚠️ **Parcial**: 18/89 = **20%**
- ❌ **Não implementado**: 6/89 = **7%**

---

## 📝 OBSERVAÇÕES DETALHADAS

### Itens ⚠️ Parciais (18 itens):

| # | Item | Observação |
|---|------|------------|
| 1.4 | Aumentar tamanho nome Chef | Tamanho atual: `text-xs md:text-sm lg:text-base`. Poderia ser maior. |
| 3.1 | Texto data | Texto atual não corresponde exatamente ao solicitado no docx. |
| 4.1 | Texto local | Usa frase diferente: "Onde e em qual ocasião será realizado..." |
| 5.1 | Campo texto livre ocasião | Step3_2_Local já tem campo texto livre, mas Step3_4_Ocasion (step 9) ainda existe com botões (embora skipado na navegação). |
| 5.2 | Título ocasião | Label atual: "Qual o tipo de comemoração / ocasião?" em vez de "QUAL TIPO DO SEU EVENTO" |
| 7.1-7.4 | Textos do menu | Prompts usam textos genéricos como "Vamos começar a montar seu banquete...", não o padrão "Nome, ..." do docx |
| 7.5 | Total a partir da entrada fria | Valores aparecem a partir do step 18 (upsell), não do step 14 (entrada fria). Condição: `showValues = currentStep >= 18` |
| 8.1 | Texto personalizações | "Agora entram os toques de personalização..." vs texto do docx |
| 9.2 | Botões → campo texto | Ainda mantém botões iniciais "Sim/Não" antes de mostrar textarea |
| 9.3 | Nome do convidado | Apenas placeholder no textarea menciona; não há campo estruturado separado por restrição |
| 10.1 | Ordem cozinha | Está após upsell mas ANTES de decoração e garçons. docx pedia após garçons. |
| 12.1 | Texto garçons | Mensagem diferente da especificada no docx |
| 13.1 | Texto checkout | "Tudo pronto. Revise o resumo..." vs "Tudo pronto! Revise o resumo do seu evento e, se estiver tudo certo, entre em contato..." |
| 14.4 | Total na entrada fria | Exibido apenas no step 18 (upsell), e não no step 14 (entrada fria) como solicitado |
| 21.3 | Eventos GTM/Pixel | IDs configuráveis, mas sem estrutura de eventos por etapa |
| 22.2 | Imagens ilustrativas | Depende de conteúdo externo (Lucas/Fernanda) |

### Itens ❌ Não Implementados (6 itens):

| # | Item | Observação |
|---|------|------------|
| 9.5 | Política de custo restrições | Não visível na UI. Info sobre custo zero para alergia vs custo extra para preferência. |
| 12.3 | Garçons editável | Não implementado (previsto como feature futura na própria reunião) |
| 16.1 | Botão fixo "Falar com Chefe" | Footer atual só tem Voltar/Continuar. Nenhum botão fixo de WhatsApp. |
| 17.3 | Modos claro/escuro | Apenas tema escuro implementado. Sem toggle. |
| 21.2 | Eventos de conversão por etapa | Nenhum tracking de eventos por clique em etapa. |
| 21.4 | Tracking de desistência | Sem identificação de drop-off points. |

---

## 🔍 NOTAS ADICIONAIS

### Fluxo de navegação atual (confirmado):
```
Step 1: Step1_1_Name (nome + telefone + LGPD unificados)
Step 2: [SKIP] → Step1_2_Contact (órfão, nunca acessado no fluxo normal)
Step 3: Step2_2_Inclusos (explicação do serviço + vídeo opcional)
Step 4: Step2_1_Menu (explicação dos 4 tempos)
Step 5: Step2_3_Costs (preview de custos de personalização)
Step 6: Step3_1_DateShift (seletor de data)
Step 7: Step3_2_Local (local + ocasião unificados)
Step 8: Step3_3_Convidados (input numérico + botões +/-)
Step 9: [SKIP] → Step3_4_Ocasion (órfão, ocasião já está no step 7)
Step 14-17: Step6_MenuSelection (entrada fria, entrada quente, principal, sobremesa)
Step 13: Step5_1_Dietary (restrições alimentares, após menu ✅)
Step 18: Step7_1_Upsell (personalizações: proteína, duplicar, tempo extra)
Step 19,21: DuplicateDish (categoria → prato)
Step 22,23: AdditionalCourse (categoria → prato)
Step 10: Step4_1_Kitchen (checkbox "estou ciente")
Step 11: Step4_2_Decoration (com foto + itens inclusos)
Step 12: Step4_3_Waiters (cálculo automático)
Step 20: Step8_1_Checkout (resumo + disclaimer 50% + WhatsApp)
```

### Arquivos órfãos (existem mas não são usados no fluxo principal):
- `Step1_2_Contact.tsx` — Step 2, skipado pela navegação
- `Step3_4_Ocasion.tsx` — Step 9, skipado pela navegação (ocasião foi unificada no Step 7)

### Funcionalidades que dependem de terceiros:
- Textos finais das telas (Lucas/Fernanda)
- Logo reduzida (Lucas/Fernanda)
- Fotos ilustrativas (Lucas/Fernanda)
- Conteúdo de vídeo (Lucas/Fernanda)
- Configuração de Pixel/GTM (Lucas/Fernanda + Diemano)
