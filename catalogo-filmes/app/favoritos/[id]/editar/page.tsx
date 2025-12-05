// app/favoritos/[id]/editar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { favoritosAPI, filmesAPI } from '@/lib/api';

// --- Interfaces ---
interface FilmeOption {
  id: number;
  titulo: string;
}

interface ListaFavoritos {
  id: number;
  nome: string;
  usuario: string; 
  filmes: FilmeOption[]; 
}
// ------------------

export default function EditarListaPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const { user } = useAuth();
  
  const [lista, setLista] = useState<ListaFavoritos | null>(null);
  const [nome, setNome] = useState('');
  const [filmesDisponiveis, setFilmesDisponiveis] = useState<FilmeOption[]>([]);
  const [filmesSelecionados, setFilmesSelecionados] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // FUNÇÃO AUXILIAR CORRIGIDA: Pluralização 
  const getPluralize = (count: number, word: string) => count === 1 ? word : `${word}s`;

  // 1. Carregar dados da Lista e Filmes Disponíveis
  useEffect(() => {
    if (id && user) {
        loadData();
    } else if (!user) {
        // Redireciona se não estiver autenticado
        router.push('/login');
    }
  }, [id, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Chama a API para pegar os detalhes da lista atual
      const listaData = await favoritosAPI.get(id);
      
      // Chama a API para listar todos os filmes disponíveis (para a lista de seleção)
      const todosFilmesResponse = await filmesAPI.list(1); // Buscamos a primeira página
      
      const todosFilmes: FilmeOption[] = todosFilmesResponse.results || todosFilmesResponse;
      
      setLista(listaData);
      setNome(listaData.nome);
      setFilmesDisponiveis(todosFilmes);
      
      // Converte os filmes da lista atual para IDs e preenche a seleção
      const idsAtuais = listaData.filmes.map((f: FilmeOption) => f.id);
      setFilmesSelecionados(idsAtuais);
      
    } catch (err: any) {
      setError('Erro ao carregar dados da lista ou você não tem permissão.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Manipular a seleção de filmes (multi-select)
  const handleFilmesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFilmesSelecionados(selectedOptions);
  };
  
  // 3. Lógica de Submissão do Formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('O nome da lista é obrigatório.');
      return;
    }

    try {
      setSaving(true);
      
      // Chamada de PUT/PATCH para atualizar o nome da lista E os filmes
      await favoritosAPI.update(id, { 
        nome: nome.trim(),
        filmes: filmesSelecionados // Adiciona os IDs dos filmes selecionados
      });

      alert(`Lista "${nome.trim()}" atualizada com sucesso!`);
      router.push(`/favoritos/${id}`);

    } catch (err: any) {
      setError(err.message || 'Falha ao salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error || !lista) {
      return (
          <div className="container mt-5 text-center">
              <div className="alert alert-danger">{error}</div>
              <Link href="/favoritos" className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Minhas Listas
              </Link>
          </div>
      );
  }
  
  const filmeCount = lista.filmes?.length || 0;
  
  return (
    <>
      {/* Hero Section - Replicando editar_lista.html */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh', position: 'relative' }}>
          <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }}></div>
          <div className="container position-relative">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      <h1 className="display-4 mb-3 wow fadeInUp" data-wow-delay="0.1s">
                          <i className="bi bi-pencil-square me-3"></i>
                          Editar Lista de Favoritos
                      </h1>
                      <p className="lead mb-4 wow fadeInUp" data-wow-delay="0.3s">
                          Atualize as informações da lista: <strong>{lista.nome}</strong>
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Formulário Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '60vh' }}>
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8 col-xl-6">
                      <div className="card shadow-lg border-0 wow fadeInUp" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                          <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                              <h3 className="mb-0">
                                  <i className="bi bi-list-ul me-2"></i>
                                  Atualizar Dados
                              </h3>
                          </div>
                          <div className="card-body p-5">
                              
                              {error && <div className="alert alert-danger text-center">{error}</div>}

                              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                                  
                                  {/* Nome da Lista */}
                                  <div className="mb-4">
                                      <label htmlFor="nome-lista" className="form-label fw-bold text-muted">
                                          <i className="bi bi-tag me-2"></i>Nome
                                      </label>
                                      <div className="input-group">
                                          <span className="input-group-text" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                                              <i className="bi bi-heart-fill"></i>
                                          </span>
                                          <input
                                            id="nome-lista"
                                            type="text"
                                            className="form-control"
                                            placeholder="Nome da Lista"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                          />
                                      </div>
                                      <small className="text-muted">
                                          <i className="bi bi-info-circle me-1"></i>Nome da lista (ex: 'Meus Favoritos')
                                      </small>
                                  </div>

                                  {/* Seleção de Filmes (M2M) - Renderização baseada no template Django */}
                                  <div className="mb-4">
                                      <label htmlFor="filmes-select" className="form-label fw-bold text-muted">
                                          <i className="bi bi-film me-2"></i>Filmes
                                      </label>
                                      <div className="filmes-selection">
                                          <div className="selection-header">
                                              <small className="text-muted">
                                                  <i className="bi bi-info-circle me-1"></i>Selecione os filmes que deseja manter na lista
                                              </small>
                                          </div>
                                          <div className="filmes-container">
                                              <select 
                                                  id="filmes-select"
                                                  multiple
                                                  className="form-control"
                                                  value={filmesSelecionados.map(String)}
                                                  onChange={handleFilmesChange}
                                                  style={{ minHeight: '200px' }}
                                              >
                                                  {filmesDisponiveis.map(filme => (
                                                      <option key={filme.id} value={filme.id}>
                                                          {filme.titulo}
                                                      </option>
                                                  ))}
                                              </select>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Informações adicionais */}
                                  <div className="info-box mb-4">
                                      <div className="row">
                                          <div className="col-md-6">
                                              <div className="info-item">
                                                  <i className="bi bi-person-fill text-primary"></i>
                                                  <div>
                                                      <strong>Criador</strong>
                                                      <p className="text-muted mb-0">{lista.usuario}</p>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="col-md-6">
                                              <div className="info-item">
                                                  <i className="bi bi-film text-primary"></i>
                                                  <div>
                                                      <strong>Filmes Atual</strong>
                                                      <p className="text-muted mb-0">{filmeCount} {getPluralize(filmeCount, 'filme')}</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Dicas */}
                                  <div className="tips-box mb-4">
                                      <h6 className="tips-title">
                                          <i className="bi bi-lightbulb-fill me-2"></i>Dicas para editar sua lista:
                                      </h6>
                                      <ul className="tips-list">
                                          <li>**Nome:** Atualize se quiser um nome mais descritivo</li>
                                          <li>**Filmes:** Use o campo acima para selecionar ou remover filmes da sua lista.</li>
                                      </ul>
                                  </div>

                                  {/* Botões */}
                                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                      <Link href={`/favoritos/${id}`} className="btn btn-outline-secondary btn-lg me-md-2" style={{ borderRadius: '25px' }}>
                                          <i className="bi bi-x-circle me-2"></i>Cancelar
                                      </Link>
                                      <button type="submit" className="btn btn-warning btn-lg" disabled={saving} style={{ borderRadius: '25px', background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)', border: 'none', color: 'white' }}>
                                          {saving ? (
                                            <>
                                                <i className="bi bi-arrow-clockwise spin me-2"></i>Salvando...
                                            </>
                                          ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>Salvar Alterações
                                            </>
                                          )}
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Estilos Replicados do Template */}
      <style jsx global>{`
          /* Estilos replicados de editar_lista.html e listafavoritos_form.html */
          .hero-section { border-radius: 0 0 50px 50px; }
          .form-control { border: 2px solid #e9ecef; border-radius: 0 10px 10px 0; padding: 12px 15px; }
          .input-group-text { border: 2px solid #e9ecef; border-right: none; border-radius: 10px 0 0 10px; width: 50px; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; }
          .filmes-selection { border: 2px solid #e9ecef; border-radius: 15px; padding: 15px; }
          .selection-header { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e9ecef; }
          .filmes-container select { width: 100%; min-height: 200px; border: 1px solid #dee2e6; border-radius: 10px; padding: 10px; font-size: 14px; }
          .filmes-container select option:checked { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 500; }
          .info-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; padding: 20px; border: 1px solid #dee2e6; }
          .info-item { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
          .info-item i { font-size: 1.2rem; color: var(--bs-primary); }
          .tips-box { background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 15px; padding: 20px; border: 1px solid #ffc107; }
          .tips-title { color: #856404; font-weight: 600; }
          .tips-list { padding-left: 20px; }
          .btn { padding: 12px 25px; font-weight: 500; border-radius: 25px; }
          .btn-outline-secondary { border-color: #6c757d; color: #6c757d; }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}