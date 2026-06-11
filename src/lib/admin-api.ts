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

function mapBackendDishToDishItem(item: any): DishItem {
  return {
    id: item.id || item._id,
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

function mapDishPayloadToBackend(payload: Partial<DishPayload>): any {
  const backend: any = {};
  
  if (payload.name !== undefined) {
    backend.name = payload.name;
    backend.nome = payload.name;
    // Generate a simple slug
    backend.slug = payload.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
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
  const response = await requestAdmin<PaginatedResponse<any>>(`/pratos-cardapio${query ? `?${query}` : ''}`);
  
  return {
    ...response,
    data: (response.data || []).map(mapBackendDishToDishItem),
  };
}

export async function getDishById(id: string): Promise<DishItem> {
  const response = await requestAdmin<any>(`/pratos-cardapio/${id}`);
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
  const backendPayload = mapDishPayloadToBackend(payload);
  const response = await requestAdmin<any>('/pratos-cardapio', {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
  return mapBackendDishToDishItem(response);
}

export async function updateDish(id: string, payload: Partial<DishPayload>): Promise<DishItem> {
  const backendPayload = mapDishPayloadToBackend(payload);
  const response = await requestAdmin<any>(`/pratos-cardapio/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload),
  });
  return mapBackendDishToDishItem(response);
}

export async function deactivateDish(id: string): Promise<DishItem> {
  const response = await requestAdmin<any>(`/pratos-cardapio/${id}`, {
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

    const optionsId = (options as any)._id || (options as any).id;
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
