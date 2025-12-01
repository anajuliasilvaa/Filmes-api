export interface Genero {
  id: number;
  nome: string;
}

export interface Diretor {
  id: number;
  nome: string;
  foto?: string;
  biografia?: string;
}

export interface Avaliacao {
  id: number;
  usuario: {
    id: number;
    username: string;
  };
  nota: number;
  comentario: string;
  data_criacao: string;
}

export interface Filme {
  id: number;
  titulo: string;
  ano_publicacao: number;
  sinopse: string;
  duracao: number;
  poster: string;
  generos: Genero[];
  diretores: Diretor[];
  avaliacoes?: Avaliacao[];
  media_avaliacoes?: number;
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

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
