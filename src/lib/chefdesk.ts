import type { AppState, EventData, LeadData, MenuSelection, UpsellOptions } from '@/store/useAppStore';
import type { ReactNode } from 'react';

type AppSnapshot = Pick<
  AppState,
  | 'currentStep'
  | 'totalScreens'
  | 'isNextEnabled'
  | 'guests'
  | 'totalCost'
  | 'lead'
  | 'event'
  | 'menu'
  | 'upsell'
  | 'pricing'
  | 'draftId'
>;

type ChefdeskResponse = Record<string, unknown>;

export type ChefdeskDish = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

export type ChefdeskMenuCategory = {
  title: string;
  prompt: string;
  icon?: ReactNode;
  dishes: ChefdeskDish[];
};

export type ChefdeskMenuOptions = Record<keyof MenuSelection, ChefdeskMenuCategory>;

export type ChefdeskPricing = {
  perPerson: number;
  waiterPer: number;
  waiterCostPer: number;
  decorationCost: number;
  proteinUpgradePer: number;
  duplicateDishPer: number;
  additionalTimePer: number;
};

export type ChefdeskSiteOptions = {
  kitchenOptions: string[];
  restrictionOptions: string[];
  locationTypes: string[];
  occasions: string[];
  upsellOptions: string[];
  pricing: ChefdeskPricing;
};

export type ChefdeskDraftPayload = {
  currentStep: number;
  totalScreens: number;
  isNextEnabled: boolean;
  data: {
    guests: number;
    totalCost: number;
    pricing: AppState['pricing'];
    lead: LeadData;
    event: EventData;
    menu: MenuSelection;
    upsell: UpsellOptions;
  };
};

export type ChefdeskOrcamentoPayload = {
  cliente: {
    nome: string;
    whatsapp: string;
  };
  dataEvento: string;
  turno?: string;
  cidade: string;
  bairro?: string;
  tipoLocal: string;
  qtdPessoas: number;
  ocasiao?: string;
  estruturaCozinha: string[];
  restricoesAlimentares: {
    possuiRestricoes: boolean;
    itens: string[];
    observacoes: string;
  };
  menu: MenuSelection;
  personalizacaoServico: {
    temDecoracao: boolean;
    qtdGarcons: number;
    custoGarcons: number;
    mudouProteina: boolean;
    duplicarPrato: boolean;
    tempoAdicional: boolean;
    categoriaDuplicada?: string;
  };
  valorEstimadoTotal: number;
  status: 'novo';
};

function getRequiredString(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function requestChefdesk<T>(path: string, init: RequestInit = {}) {
  return fetch(`/api/chefdesk${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
  }).then(async (response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message =
        typeof data?.message === 'string'
          ? data.message
          : `Falha na API ChefDesk (${response.status})`;
      throw new Error(message);
    }

    return data as T;
  });
}

export function readResourceId(response: unknown) {
  if (!response || typeof response !== 'object') return undefined;

  const data = response as ChefdeskResponse;
  const nestedData = data.data && typeof data.data === 'object' ? (data.data as ChefdeskResponse) : undefined;

  return [data.id, data._id, data.uuid, nestedData?.id, nestedData?._id, nestedData?.uuid].find(
    (value): value is string => typeof value === 'string' && value.length > 0
  );
}

export function buildDraftPayload(state: AppSnapshot): ChefdeskDraftPayload {
  return {
    currentStep: state.currentStep,
    totalScreens: state.totalScreens,
    isNextEnabled: state.isNextEnabled,
    data: {
      guests: state.guests,
      totalCost: state.totalCost,
      pricing: state.pricing,
      lead: state.lead,
      event: state.event,
      menu: state.menu,
      upsell: state.upsell,
    },
  };
}

export function buildOrcamentoPayload(state: AppSnapshot): ChefdeskOrcamentoPayload {
  const eventDate = state.event.date ? new Date(state.event.date).toISOString() : new Date().toISOString();

  return {
    cliente: {
      nome: getRequiredString(state.lead.name, 'Nao informado'),
      whatsapp: getRequiredString(state.lead.phone, 'Nao informado'),
    },
    dataEvento: eventDate,
    turno: state.event.shift,
    cidade: getRequiredString(state.event.city, 'Nao informado'),
    bairro: state.event.neighborhood,
    tipoLocal: getRequiredString(state.event.locationType, 'other'),
    qtdPessoas: state.guests,
    ocasiao: state.event.occasion,
    estruturaCozinha: state.event.kitchenItems,
    restricoesAlimentares: {
      possuiRestricoes: Boolean(state.event.hasDietaryRestrictions),
      itens: state.event.dietaryRestrictions,
      observacoes: state.event.dietaryNotes,
    },
    menu: state.menu,
    personalizacaoServico: {
      temDecoracao: state.event.hasDecoration,
      qtdGarcons: state.event.waiterCount,
      custoGarcons: state.event.waiterCost,
      mudouProteina: state.upsell.proteinUpgrade,
      duplicarPrato: state.upsell.duplicateDish,
      tempoAdicional: state.upsell.additionalTime,
      categoriaDuplicada: state.upsell.duplicateCategory,
    },
    valorEstimadoTotal: state.totalCost,
    status: 'novo',
  };
}

export function saveOrcamentoDraft(state: AppSnapshot) {
  const payload = buildDraftPayload(state);

  if (state.draftId) {
    return requestChefdesk<ChefdeskResponse>(`/orcamento-drafts/${state.draftId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  return requestChefdesk<ChefdeskResponse>('/orcamento-drafts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function finalizeOrcamentoDraft(draftId: string) {
  return requestChefdesk<ChefdeskResponse>(`/orcamento-drafts/${draftId}/finalizar`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export function createOrcamento(state: AppSnapshot) {
  return requestChefdesk<ChefdeskResponse>('/orcamentos', {
    method: 'POST',
    body: JSON.stringify(buildOrcamentoPayload(state)),
  });
}

export function getMenuOptions() {
  return requestChefdesk<ChefdeskMenuOptions>('/pratos-cardapio/menu-options');
}

export async function getSiteOptions() {
  const response = await requestChefdesk<ChefdeskSiteOptions[] | ChefdeskSiteOptions>('/options');

  return Array.isArray(response) ? response[0] : response;
}
