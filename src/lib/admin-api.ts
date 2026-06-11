import { useAuthStore } from '@/store/useAuthStore';

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
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
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

export function getDishes(params: DishListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  if (params.status) searchParams.set('status', params.status);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return requestAdmin<PaginatedResponse<DishItem>>(`/pratos-cardapio${query ? `?${query}` : ''}`);
}

export function getDishById(id: string) {
  return requestAdmin<DishItem>(`/pratos-cardapio/${id}`);
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

export function createDish(payload: DishPayload) {
  return requestAdmin<DishItem>('/pratos-cardapio', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateDish(id: string, payload: Partial<DishPayload>) {
  return requestAdmin<DishItem>(`/pratos-cardapio/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deactivateDish(id: string) {
  return requestAdmin<DishItem>(`/pratos-cardapio/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'inactive' }),
  });
}

// --- Categorias ---

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export function getCategories() {
  return requestAdmin<Category[]>('/categorias');
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

export function getPersonalizations() {
  return requestAdmin<Personalization[]>('/personalizacoes');
}

export function updatePersonalization(id: string, payload: Partial<Pick<Personalization, 'description' | 'value'>>) {
  return requestAdmin<Personalization>(`/personalizacoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function togglePersonalizationStatus(id: string, status: 'active' | 'inactive') {
  return requestAdmin<Personalization>(`/personalizacoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
