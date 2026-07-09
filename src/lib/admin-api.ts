import { useAuthStore } from '@/store/useAuthStore';
import type { ChefdeskSiteOptions, ChefdeskPricing } from './chefdesk';

type ApiResponse = Record<string, unknown>;

/**
 * Makes an authenticated request to the ChefDesk API proxy.
 * Automatically attaches the admin Bearer token from the auth store.
 */
export function requestAdmin<T = ApiResponse>(path: string, init: RequestInit = {}) {
  const token = useAuthStore.getState().token;

  return fetch(`/api/chefdesk${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token ? { 'x-admin-token': token } : {}),
      ...init.headers,
    },
  }).then(async (response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message =
        typeof data?.message === 'string'
          ? data.message
          : `Erro na API (${response.status})`;
      throw new Error(message);
    }

    return data as T;
  });
}

// --- Auth ---

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
  };
}

export function loginAdmin(payload: LoginPayload) {
  return requestAdmin<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// --- Cardápio ---

export interface DishItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
  tags: string[];
  dietaryRestrictions: string[];
  cuisineStyle?: string;
  isHighlight: boolean;
  additionalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface DishListParams {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BackendDish {
  id?: string;
  _id?: string;
  name?: string;
  nome?: string;
  description?: string;
  descricao?: string;
  categoria?: string;
  category?: string;
  status?: boolean | string;
  imagem?: string;
  imageUrl?: string;
  estilo?: string[];
  perfilAlimentar?: string[];
  pratoDestaque?: boolean;
  isHighlight?: boolean;
  custoAdicional?: number;
  additionalCost?: number;
  criadoEm?: string;
  createdAt?: string;
  ultimaAtualizacao?: string;
  updatedAt?: string;
  slug?: string;
}

function mapBackendDishToDishItem(item: BackendDish): DishItem {
  return {
    id: item.id || item._id || '',
    slug: item.slug || '',
    name: item.name || item.nome || '',
    description: item.description || item.descricao || '',
    category: item.categoria || item.category || '',
    status: item.status === true || item.status === 'active' ? 'active' : 'inactive',
    imageUrl: item.imagem || item.imageUrl,
    tags: Array.isArray(item.estilo) ? item.estilo : [],
    dietaryRestrictions: Array.isArray(item.perfilAlimentar) ? item.perfilAlimentar : [],
    cuisineStyle: Array.isArray(item.estilo) && item.estilo.length > 0 ? item.estilo.join(', ') : undefined,
    isHighlight: Boolean(item.pratoDestaque ?? item.isHighlight),
    additionalCost: Number(item.custoAdicional ?? item.additionalCost ?? 0),
    createdAt: item.criadoEm || item.createdAt || new Date().toISOString(),
    updatedAt: item.ultimaAtualizacao || item.updatedAt || new Date().toISOString(),
  };
}

function mapDishPayloadToBackend(payload: Partial<DishPayload>, isCreate = false): Record<string, unknown> {
  const backend: Record<string, unknown> = {};
  
  if (payload.name !== undefined) {
    backend.name = payload.name;
    backend.nome = payload.name;
    if (isCreate) {
      // Generate a simple unique slug with a short random suffix (avoids conflicts on duplicate names)
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      backend.slug = payload.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + randomSuffix;
    }
  }
  if (payload.description !== undefined) {
    backend.description = payload.description;
    backend.descricao = payload.description;
  }
  if (payload.category !== undefined) {
    backend.categoria = payload.category;
  }
  if (payload.status !== undefined) {
    backend.status = payload.status === 'active';
  }
  if (payload.imageUrl !== undefined) {
    backend.imagem = payload.imageUrl;
  }
  if (payload.dietaryRestrictions !== undefined) {
    backend.perfilAlimentar = payload.dietaryRestrictions;
  }
  if (payload.cuisineStyle !== undefined) {
    backend.estilo = payload.cuisineStyle ? [payload.cuisineStyle] : [];
  }
  if (payload.isHighlight !== undefined) {
    backend.pratoDestaque = payload.isHighlight;
  }
  if (payload.additionalCost !== undefined) {
    backend.custoAdicional = payload.additionalCost;
  }

  return backend;
}

export async function getDishes(params: DishListParams = {}): Promise<PaginatedResponse<DishItem>> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  
  // Backend expects status as boolean in query if possible, or filter in code
  // Wait, if status is active/inactive, let's map to query
  if (params.status === 'active') searchParams.set('status', 'true');
  if (params.status === 'inactive') searchParams.set('status', 'false');
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const response = await requestAdmin<PaginatedResponse<BackendDish>>(`/pratos-cardapio${query ? `?${query}` : ''}`);
  
  return {
    ...response,
    data: (response.data || []).map(mapBackendDishToDishItem),
  };
}

export async function getDishById(id: string): Promise<DishItem> {
  const response = await requestAdmin<BackendDish>(`/pratos-cardapio/${id}`);
  return mapBackendDishToDishItem(response);
}

export interface DishPayload {
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
  tags?: string[];
  dietaryRestrictions?: string[];
  cuisineStyle?: string;
  isHighlight?: boolean;
  additionalCost?: number;
}

export async function createDish(payload: DishPayload): Promise<DishItem> {
  const backendPayload = mapDishPayloadToBackend(payload, true);
  const response = await requestAdmin<BackendDish>('/pratos-cardapio', {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
  return mapBackendDishToDishItem(response);
}

export async function updateDish(id: string, payload: Partial<DishPayload>): Promise<DishItem> {
  const backendPayload = mapDishPayloadToBackend(payload, false);
  const response = await requestAdmin<BackendDish>(`/pratos-cardapio/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload),
  });
  return mapBackendDishToDishItem(response);
}

export async function deactivateDish(id: string): Promise<DishItem> {
  const response = await requestAdmin<BackendDish>(`/pratos-cardapio/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: false }),
  });
  return mapBackendDishToDishItem(response);
}

export async function deleteDish(id: string): Promise<{ message: string }> {
  return requestAdmin<{ message: string }>(`/pratos-cardapio/${id}`, {
    method: 'DELETE',
  });
}

// --- Categorias ---

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories(): Promise<Category[]> {
  return [
    { id: 'coldStarter', name: 'Entrada Fria', slug: 'coldStarter' },
    { id: 'hotStarter', name: 'Entrada Quente', slug: 'hotStarter' },
    { id: 'mainCourse', name: 'Prato Principal', slug: 'mainCourse' },
    { id: 'dessert', name: 'Sobremesa', slug: 'dessert' },
  ];
}

// --- Personalizações ---

export interface Personalization {
  id: string;
  name: string;
  description: string;
  value: number;
  status: 'active' | 'inactive';
  isSystemDefined: boolean;
}

interface BackendPersonalization {
  id: string;
  nome: string;
  descricao: string;
  valorEvento: number;
  status: boolean;
  criadoEm?: string;
  ultimaAtualizacao?: string;
}

export async function getPersonalizations(): Promise<Personalization[]> {
  const response = await requestAdmin<{ data: BackendPersonalization[] }>('/personalizacoes-servico');
  const items = response.data || [];
  return items.map((item) => ({
    id: item.id,
    name: item.nome,
    description: item.descricao,
    value: item.valorEvento,
    status: item.status ? 'active' : 'inactive',
    isSystemDefined: true,
  }));
}

const PERSONALIZATION_MAP: Record<string, { key: string; priceKey: string }> = {
  'Mudar proteína': { key: 'proteinUpgrade', priceKey: 'proteinUpgradePer' },
  'Prato duplicado': { key: 'duplicateDish', priceKey: 'duplicateDishPer' },
  'Tempo adicional': { key: 'additionalTime', priceKey: 'additionalTimePer' },
  'Decoração': { key: 'decoration', priceKey: 'decorationCost' },
};

async function syncPersonalizationToOptions(
  nome: string,
  price?: number,
  status?: 'active' | 'inactive'
) {
  const mapEntry = PERSONALIZATION_MAP[nome];
  if (!mapEntry) return;

  try {
    const optionsRes = await requestAdmin<ChefdeskSiteOptions[] | ChefdeskSiteOptions>('/options');
    const options = Array.isArray(optionsRes) ? optionsRes[0] : optionsRes;
    if (!options) return;

    const optionsRecord = options as Record<string, unknown>;
    const optionsId = (optionsRecord._id || optionsRecord.id) as string | undefined;
    if (!optionsId) return;

    const updatedPricing = { ...options.pricing };
    if (price !== undefined) {
      updatedPricing[mapEntry.priceKey as keyof ChefdeskPricing] = price;
    }

    let updatedUpsellOptions = [...options.upsellOptions];
    if (status === 'active') {
      if (!updatedUpsellOptions.includes(mapEntry.key)) {
        updatedUpsellOptions.push(mapEntry.key);
      }
    } else if (status === 'inactive') {
      updatedUpsellOptions = updatedUpsellOptions.filter(k => k !== mapEntry.key);
    }

    await requestAdmin(`/options/${optionsId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        pricing: updatedPricing,
        upsellOptions: updatedUpsellOptions,
      }),
    });
  } catch (err) {
    console.error('Failed to sync personalization to options:', err);
  }
}

export async function updatePersonalization(
  id: string,
  payload: Partial<Pick<Personalization, 'description' | 'value'>>
): Promise<Personalization> {
  const backendPayload: Partial<BackendPersonalization> = {};
  if (payload.description !== undefined) {
    backendPayload.descricao = payload.description;
  }
  if (payload.value !== undefined) {
    backendPayload.valorEvento = payload.value;
  }

  const response = await requestAdmin<BackendPersonalization>(`/personalizacoes-servico/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload),
  });

  const updated: Personalization = {
    id: response.id,
    name: response.nome,
    description: response.descricao,
    value: response.valorEvento,
    status: response.status ? 'active' : 'inactive',
    isSystemDefined: true,
  };

  if (payload.value !== undefined) {
    await syncPersonalizationToOptions(response.nome, payload.value, undefined);
  }

  return updated;
}

export async function togglePersonalizationStatus(
  id: string,
  status: 'active' | 'inactive'
): Promise<Personalization> {
  const response = await requestAdmin<BackendPersonalization>(`/personalizacoes-servico/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: status === 'active' }),
  });

  const updated: Personalization = {
    id: response.id,
    name: response.nome,
    description: response.descricao,
    value: response.valorEvento,
    status: response.status ? 'active' : 'inactive',
    isSystemDefined: true,
  };

  await syncPersonalizationToOptions(response.nome, undefined, status);

  return updated;
}

// --- Leads, Orçamentos and Marketing ---

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  lgpdConsent: boolean;
  source: string;
  createdAt: string;
}

export interface OrcamentoItem {
  id: string;
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
  menu: Record<string, string>;
  personalizacaoServico: {
    temDecoracao: boolean;
    qtdGarcons: number;
    custoGarcons: number;
    custoDecoracao: number;
    custoProteinUpgrade: number;
    custoDuplicateDish: number;
    custoAdditionalTime: number;
    mudouProteina: boolean;
    duplicarPrato: boolean;
    tempoAdicional: boolean;
    categoriaDuplicada?: string;
    duplicateDishId?: string;
    additionalTimeCategory?: string;
    additionalTimeDishId?: string;
    proteinUpgradeText?: string;
  };
  valorEstimadoTotal: number;
  baseCost: number;
  extrasCost: number;
  pricingBreakdown: Array<{ label: string; value: number }>;
  status: string;
  origem: string;
  createdAt: string;
}

function mapBackendOrcamentoToOrcamentoItem(item: any): OrcamentoItem {
  const ps = item.personalizacaoServico || {};
  let rawObservacoes = item.restricoesAlimentares?.observacoes || '';
  let proteinUpgradeText = '';
  let duplicateDishId = ps.duplicateDishId;
  let additionalTimeCategory = ps.additionalTimeCategory;
  let additionalTimeDishId = ps.additionalTimeDishId;

  const proteinMatch = rawObservacoes.match(/\[Mudar Proteína:\s*(.*?)\]/);
  if (proteinMatch) {
    proteinUpgradeText = proteinMatch[1];
    rawObservacoes = rawObservacoes.replace(/\[Mudar Proteína:\s*(.*?)\]/, '').trim();
  }
  // Fallback: backend may store proteinUpgradeText directly on personalizacaoServico
  if (!proteinUpgradeText && typeof ps.proteinUpgradeText === 'string') {
    proteinUpgradeText = ps.proteinUpgradeText;
  }

  const duplicateMatch = rawObservacoes.match(/\[Duplicar Prato ID:\s*(.*?)\]/);
  if (duplicateMatch) {
    duplicateDishId = duplicateMatch[1];
    rawObservacoes = rawObservacoes.replace(/\[Duplicar Prato ID:\s*(.*?)\]/, '').trim();
  }

  const additionalMatch = rawObservacoes.match(/\[Tempo Adicional ID:\s*(.*?)\]/);
  if (additionalMatch) {
    additionalTimeDishId = additionalMatch[1];
    rawObservacoes = rawObservacoes.replace(/\[Tempo Adicional ID:\s*(.*?)\]/, '').trim();
  }

  const additionalCatMatch = rawObservacoes.match(/\[Tempo Adicional Cat:\s*(.*?)\]/);
  if (additionalCatMatch) {
    additionalTimeCategory = additionalCatMatch[1];
    rawObservacoes = rawObservacoes.replace(/\[Tempo Adicional Cat:\s*(.*?)\]/, '').trim();
  }

  // Backend may return mudouProteina, mudarProteina, mudou_proteina, or proteinUpgrade
  const rawMudouProteina = ps.mudouProteina ?? ps.mudarProteina ?? ps.mudou_proteina ?? ps.mudar_proteina ?? ps.proteinUpgrade;
  // Force true if proteinUpgradeText was found in observacoes
  const mudouProteina = Boolean(rawMudouProteina) || Boolean(proteinUpgradeText);

  return {
    id: item.id || item._id || '',
    cliente: {
      nome: item.cliente?.nome || '',
      whatsapp: item.cliente?.whatsapp || '',
    },
    dataEvento: item.dataEvento || '',
    turno: item.turno,
    cidade: item.cidade || '',
    bairro: item.bairro,
    tipoLocal: item.tipoLocal || 'other',
    qtdPessoas: Number(item.qtdPessoas ?? 10),
    ocasiao: item.ocasiao,
    estruturaCozinha: Array.isArray(item.estruturaCozinha) ? item.estruturaCozinha : [],
    restricoesAlimentares: {
      possuiRestricoes: Boolean(item.restricoesAlimentares?.possuiRestricoes),
      itens: Array.isArray(item.restricoesAlimentares?.itens) ? item.restricoesAlimentares.itens : [],
      observacoes: rawObservacoes,
    },
    menu: item.menu || {},
    personalizacaoServico: {
      temDecoracao: Boolean(ps.temDecoracao),
      qtdGarcons: Number(ps.qtdGarcons ?? 1),
      custoGarcons: Number(ps.custoGarcons ?? 0),
      custoDecoracao: Number(ps.custoDecoracao ?? 0),
      custoProteinUpgrade: Number(ps.custoProteinUpgrade ?? 0),
      custoDuplicateDish: Number(ps.custoDuplicateDish ?? 0),
      custoAdditionalTime: Number(ps.custoAdditionalTime ?? 0),
      mudouProteina,
      duplicarPrato: Boolean(ps.duplicarPrato),
      tempoAdicional: Boolean(ps.tempoAdicional),
      categoriaDuplicada: ps.categoriaDuplicada,
      duplicateDishId,
      additionalTimeCategory,
      additionalTimeDishId,
      proteinUpgradeText,
    },
    valorEstimadoTotal: Number(item.valorEstimadoTotal ?? 0),
    baseCost: Number(item.baseCost ?? 0),
    extrasCost: Number(item.extrasCost ?? 0),
    pricingBreakdown: Array.isArray(item.pricingBreakdown) ? item.pricingBreakdown : [],
    status: item.status || 'novo',
    origem: item.origem || 'site',
    createdAt: item.createdAt || item.criadoEm || '',
  };
}

export interface MarketingOptions {
  id: string;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}

export async function getLeads(): Promise<LeadItem[]> {
  const response = await requestAdmin<any>('/leads');
  const items = Array.isArray(response) ? response : response.data || [];
  return items.map((item: any) => ({
    id: item.id || item._id || '',
    name: item.name || item.nome || '',
    phone: item.phone || item.whatsapp || '',
    lgpdConsent: Boolean(item.lgpdConsent),
    source: item.source || 'web',
    createdAt: item.createdAt || item.criadoEm || '',
  })).sort((a: LeadItem, b: LeadItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLeadById(id: string): Promise<LeadItem> {
  const item = await requestAdmin<any>(`/leads/${id}`);
  return {
    id: item.id || item._id || '',
    name: item.name || item.nome || '',
    phone: item.phone || item.whatsapp || '',
    lgpdConsent: Boolean(item.lgpdConsent),
    source: item.source || 'web',
    createdAt: item.createdAt || item.criadoEm || '',
  };
}

export async function getOrcamentos(): Promise<OrcamentoItem[]> {
  const response = await requestAdmin<any>('/orcamentos');
  const items = Array.isArray(response) ? response : response.data || [];
  return items.map(mapBackendOrcamentoToOrcamentoItem).sort((a: OrcamentoItem, b: OrcamentoItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrcamentoById(id: string): Promise<OrcamentoItem> {
  const item = await requestAdmin<any>(`/orcamentos/${id}`);
  return mapBackendOrcamentoToOrcamentoItem(item);
}

export async function deleteOrcamento(id: string): Promise<any> {
  return requestAdmin(`/orcamentos/${id}`, {
    method: 'DELETE',
  });
}

export async function updateOrcamentoStatus(id: string, status: string): Promise<any> {
  return requestAdmin(`/orcamentos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteLead(id: string): Promise<any> {
  return requestAdmin(`/leads/${id}`, {
    method: 'DELETE',
  });
}

export async function getMarketingOptions(): Promise<MarketingOptions> {
  const response = await requestAdmin<any>('/options');
  const option = Array.isArray(response) ? response[0] : response;
  
  return {
    id: option?.id || option?._id || '',
    facebookPixelId: option?.facebookPixelId || '',
    googleAnalyticsId: option?.googleAnalyticsId || '',
    googleTagManagerId: option?.googleTagManagerId || '',
  };
}

export async function updateMarketingOptions(id: string, payload: Partial<Omit<MarketingOptions, 'id'>>): Promise<any> {
  return requestAdmin(`/options/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// --- Mídias / Identidade do Site ---

export interface MediaOptions {
  id: string;
  chefTitle: string;
  chefLogoUrl: string;
  chefAvatarUrl: string;
  conceptVideoUrl: string;
  decorationImageUrl: string;
}

const MEDIA_DEFAULTS: Omit<MediaOptions, 'id'> = {
  chefTitle: 'Chef Lucas Medeiros',
  chefLogoUrl: '/logo-azul1.png',
  chefAvatarUrl: '/chef-lucas-avatar.jpg',
  conceptVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-kitchen-professional-service-41662-large.mp4',
  decorationImageUrl: '/decoracao_mesa.png',
};

export async function getMediaOptions(): Promise<MediaOptions> {
  const response = await requestAdmin<any>('/options');
  const option = Array.isArray(response) ? response[0] : response;

  return {
    id: option?.id || option?._id || '',
    chefTitle: option?.chefTitle || MEDIA_DEFAULTS.chefTitle,
    chefLogoUrl: option?.chefLogoUrl || MEDIA_DEFAULTS.chefLogoUrl,
    chefAvatarUrl: option?.chefAvatarUrl || MEDIA_DEFAULTS.chefAvatarUrl,
    conceptVideoUrl: option?.conceptVideoUrl || MEDIA_DEFAULTS.conceptVideoUrl,
    decorationImageUrl: option?.decorationImageUrl || MEDIA_DEFAULTS.decorationImageUrl,
  };
}

export async function updateMediaOptions(
  id: string,
  payload: Partial<Omit<MediaOptions, 'id'>>
): Promise<any> {
  return requestAdmin(`/options/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
