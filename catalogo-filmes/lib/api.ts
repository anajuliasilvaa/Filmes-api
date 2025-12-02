// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  profile?: {
    avatar_url?: string;
    avatar_name?: string;
  };
}

// Helper para obter o token do localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Helper para fazer requisições autenticadas
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Se o token expirou, tentar renovar
  if (response.status === 401 && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Tentar novamente com o novo token
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
}

// Renovar access token usando refresh token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data: { access: string } = await response.json();
      localStorage.setItem('access_token', data.access);
      return true;
    }
  } catch (error) {
    console.error('Erro ao renovar token:', error);
  }

  // Se falhou, limpar tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return false;
}

// API de Autenticação
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao fazer login');
    }

    const data: TokenResponse = await response.json();
    
    // Salvar tokens no localStorage
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    return data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/user/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await fetchWithAuth('/api/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }

    // Limpar tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async getProfile(): Promise<User> {
    const response = await fetchWithAuth('/api/user/perfil/');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar perfil');
    }

    return response.json();
  },

  async updateProfile(data: { email?: string }): Promise<User> {
    const response = await fetchWithAuth('/api/user/perfil/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao atualizar perfil');
    }

    return response.json();
  },

  async changePassword(data: { old_password: string; new_password: string }): Promise<void> {
    const response = await fetchWithAuth('/api/user/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.old_password?.[0] || error.new_password?.[0] || 'Erro ao alterar senha');
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/user/password-reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao solicitar redefinição de senha');
    }
  },

  async getAvatars(page: number = 1, search?: string) {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await fetchWithAuth(`/api/user/avatar/?page=${page}${searchParam}`);
    if (!response.ok) throw new Error('Erro ao buscar avatares');
    return response.json();
  },

  async setAvatar(avatarUrl: string, avatarName: string) {
    const response = await fetchWithAuth('/api/user/avatar/', {
      method: 'POST',
      body: JSON.stringify({ avatar_url: avatarUrl, avatar_name: avatarName }),
    });
    if (!response.ok) throw new Error('Erro ao definir avatar');
    return response.json();
  },

  async setRandomAvatar() {
    const response = await fetchWithAuth('/api/user/avatar/random/', {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Erro ao definir avatar aleatório');
    return response.json();
  },

  isAuthenticated(): boolean {
    return !!getAccessToken();
  },
};

// API de Filmes
export const filmesAPI = {
  async list(page: number = 1) {
    // Adicionar timestamp para evitar cache
    const timestamp = new Date().getTime();
    const response = await fetchWithAuth(`/api/v1/filmes/?page=${page}&_t=${timestamp}`);
    if (!response.ok) throw new Error('Erro ao buscar filmes');
    return response.json();
  },

  async get(id: number) {
    const response = await fetchWithAuth(`/api/v1/filmes/${id}/`);
    if (!response.ok) throw new Error('Erro ao buscar filme');
    return response.json();
  },

  async create(data: any) {
    const token = getAccessToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Se for FormData, não adicionar Content-Type (o browser faz automaticamente)
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}/api/v1/filmes/`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Erro ao criar filme');
    return response.json();
  },

  async update(id: number, data: any) {
    const token = getAccessToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Se for FormData, não adicionar Content-Type
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}/api/v1/filmes/${id}/`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar filme');
    return response.json();
  },

  async delete(id: number) {
    const response = await fetchWithAuth(`/api/v1/filmes/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar filme');
  },
};

// API de Gêneros
export const generosAPI = {
  async list() {
    const response = await fetchWithAuth('/api/v1/generos/');
    if (!response.ok) throw new Error('Erro ao buscar gêneros');
    return response.json();
  },
};

// ==============================================
// SEÇÃO AJUSTADA COM OS SEUS CRUDS
// ==============================================

// API de Diretores
export const diretoresAPI = {
  async list() {
    const response = await fetchWithAuth('/api/v1/diretores/');
    if (!response.ok) throw new Error('Erro ao buscar diretores');
    return response.json();
  },

  async get(id: number) { 
    const response = await fetchWithAuth(`/api/v1/diretores/${id}/`);
    if (!response.ok) throw new Error('Erro ao buscar diretor');
    return response.json();
  },

  async update(id: number, data: any) { 
    const response = await fetchWithAuth(`/api/v1/diretores/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar diretor');
    return response.json();
  },

  async delete(id: number) { 
    const response = await fetchWithAuth(`/api/v1/diretores/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar diretor');
  },
};

// API de Favoritos
export const favoritosAPI = {
  async list() {
    const response = await fetchWithAuth('/api/v1/favoritos/');
    if (!response.ok) throw new Error('Erro ao buscar favoritos');
    return response.json();
  },

  async create(nome: string) {
    const response = await fetchWithAuth('/api/v1/favoritos/', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    });
    if (!response.ok) throw new Error('Erro ao criar lista');
    return response.json();
  },
  
  async get(listaId: number) { 
    const response = await fetchWithAuth(`/api/v1/favoritos/${listaId}/`);
    if (!response.ok) throw new Error('Erro ao buscar lista');
    return response.json();
  },

  async update(listaId: number, data: { nome?: string }) { 
    const response = await fetchWithAuth(`/api/v1/favoritos/${listaId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar lista');
    return response.json();
  },

  async delete(listaId: number) { 
    const response = await fetchWithAuth(`/api/v1/favoritos/${listaId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar lista');
  },

  async addFilme(listaId: number, filmeId: number) {
    const response = await fetchWithAuth(`/api/v1/favoritos/${listaId}/filmes/`, {
      method: 'POST',
      body: JSON.stringify({ filme_id: filmeId }),
    });
    if (!response.ok) throw new Error('Erro ao adicionar filme');
    return response.json();
  },
};
// ==============================================

export default {
  authAPI,
  filmesAPI,
  generosAPI,
  diretoresAPI,
  favoritosAPI,
};

// API de Avaliações
export const avaliacoesAPI = {
  async list() {
    const response = await fetchWithAuth('/api/v1/avaliacoes/');
    if (!response.ok) throw new Error('Erro ao buscar avaliações');
    return response.json();
  },

  async create(data: { filme: number; comentario: string; nota: number }) {
    const response = await fetchWithAuth('/api/v1/avaliacoes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar avaliação');
    return response.json();
  },

  async update(id: number, data: { comentario?: string; nota?: number }) {
    const response = await fetchWithAuth(`/api/v1/avaliacoes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar avaliação');
    return response.json();
  },

  async delete(id: number) {
    const response = await fetchWithAuth(`/api/v1/avaliacoes/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar avaliação');
  },
};