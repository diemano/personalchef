import type { AppState, MenuSelection } from '@/store/useAppStore';
import type { PersonalizationKey, PersonalizationOptions } from '@/store/useAppStore';
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
  | 'personalizationOptions'
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

type BackendPersonalization = {
  id?: string;
  nome?: string;
  name?: string;
  descricao?: string;
  description?: string;
  valorEvento?: number;
  value?: number;
  status?: boolean | string;
};

export type ChefdeskDraftPayload = {
  currentStep: number;
  totalScreens: number;
  isNextEnabled: boolean;
  data: ChefdeskOrcamentoPayload;
};

export type ChefdeskPricingItem = {
  label: string;
  value: number;
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
  baseCost: number;
  extrasCost: number;
  pricingBreakdown: ChefdeskPricingItem[];
  status: 'novo';
  origem: 'site';
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
    data: buildOrcamentoPayload(state),
  };
}

export function buildPricingBreakdown(state: AppSnapshot) {
  const baseCost = state.guests * state.pricing.perPerson;
  const rows: ChefdeskPricingItem[] = [
    { label: 'Base', value: baseCost },
    { label: 'Garcons', value: state.event.waiterCost || 0 },
  ];
  const personalizationOptions = state.personalizationOptions || {};
  const labelFor = (key: PersonalizationKey, fallback: string) => personalizationOptions[key]?.name || fallback;

  if (state.event.hasDecoration) {
    rows.push({ label: labelFor('decoration', 'Decoracao'), value: state.pricing.decorationCost });
  }

  if (state.upsell.proteinUpgrade) {
    rows.push({ label: labelFor('proteinUpgrade', 'Troca de proteina'), value: state.guests * state.pricing.proteinUpgradePer });
  }

  if (state.upsell.duplicateDish) {
    rows.push({ label: labelFor('duplicateDish', 'Prato duplicado'), value: state.guests * state.pricing.duplicateDishPer });
  }

  if (state.upsell.additionalTime) {
    rows.push({ label: labelFor('additionalTime', 'Tempo adicional'), value: state.guests * state.pricing.additionalTimePer });
  }

  const extrasCost = rows.slice(1).reduce((total, row) => total + row.value, 0);

  return {
    baseCost,
    extrasCost,
    pricingBreakdown: rows,
  };
}

export function buildOrcamentoPayload(state: AppSnapshot): ChefdeskOrcamentoPayload {
  const eventDate = state.event.date ? new Date(state.event.date).toISOString() : new Date().toISOString();
  const pricingDetails = buildPricingBreakdown(state);

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
    ...pricingDetails,
    status: 'novo',
    origem: 'site',
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
  return requestChefdesk<ChefdeskMenuOptions>('/pratos-cardapio/menu-options').then(normalizeMenuOptions);
}

function normalizeMenuOptions(options: ChefdeskMenuOptions): ChefdeskMenuOptions {
  return (Object.keys(options) as Array<keyof ChefdeskMenuOptions>).reduce((normalized, category) => {
    const value = options[category];

    normalized[category] = {
      ...value,
      dishes: Array.isArray(value?.dishes)
        ? value.dishes.map((dish) => ({
            ...dish,
            tags: Array.isArray(dish.tags) ? dish.tags : [],
            description: dish.description || '',
          }))
        : [],
    };

    return normalized;
  }, {} as ChefdeskMenuOptions);
}

export async function getSiteOptions() {
  const response = await requestChefdesk<ChefdeskSiteOptions[] | ChefdeskSiteOptions>('/options');

  return Array.isArray(response) ? response[0] : response;
}

const PERSONALIZATION_OPTION_KEYS: Record<string, PersonalizationKey> = {
  'mudar proteina': 'proteinUpgrade',
  'troca de proteina': 'proteinUpgrade',
  'prato duplicado': 'duplicateDish',
  'tempo adicional': 'additionalTime',
  decoracao: 'decoration',
};

function normalizePersonalizationName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getPersonalizationOptionKey(name: string): PersonalizationKey | undefined {
  const normalizedName = normalizePersonalizationName(name);

  if (PERSONALIZATION_OPTION_KEYS[normalizedName]) {
    return PERSONALIZATION_OPTION_KEYS[normalizedName];
  }

  if (normalizedName.includes('prote')) return 'proteinUpgrade';
  if (normalizedName.includes('duplic')) return 'duplicateDish';
  if (normalizedName.includes('tempo')) return 'additionalTime';
  if (normalizedName.includes('decor')) return 'decoration';

  return undefined;
}

export async function getActivePersonalizationOptionKeys() {
  const options = await getPersonalizationOptions();

  return Object.values(options)
    .filter((option) => option.active)
    .map((option) => option.key);
}

export async function getPersonalizationOptions(): Promise<PersonalizationOptions> {
  const response = await requestChefdesk<{ data: BackendPersonalization[] } | BackendPersonalization[]>(
    '/personalizacoes-servico'
  );
  const personalizations = Array.isArray(response) ? response : response.data || [];

  return personalizations.reduce<PersonalizationOptions>((options, personalization) => {
    const name = personalization.nome || personalization.name;
    const isActive = personalization.status !== false && personalization.status !== 'inactive';
    const key = name ? getPersonalizationOptionKey(name) : undefined;

    if (name && key) {
      options[key] = {
        key,
        name,
        description: personalization.descricao || personalization.description || '',
        value: Number(personalization.valorEvento ?? personalization.value ?? 0),
        active: isActive,
      };
    }

    return options;
  }, {});
}
