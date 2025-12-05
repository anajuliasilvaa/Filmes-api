'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { favoritosAPI, filmesAPI } from '@/lib/api';

interface Filme {
  id: number;
  titulo: string;
}

interface ListaFavoritos {
  id: number;
  nome: string;
  usuario: string;
  filmes: Filme[];
}

export default function EditarListaPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const id = parseInt(params.id as string);

  const [lista, setLista] = useState<ListaFavoritos | null>(null);
  const [nome, setNome] = useState('');
  const [todosFilmes, setTodosFilmes] = useState<Filme[]>([]);
  const [filmesSelecionados, setFilmesSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (id && user) {
      loadData();
    }
  }, [id, user, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listaData, filmesData] = await Promise.all([
        favoritosAPI.get(id),
        filmesAPI.list()
      ]);
      
      setLista(listaData);
      setNome(listaData.nome);
      setTodosFilmes(filmesData.results || filmesData);
      // Handle both full objects and IDs
      setFilmesSelecionados(
        listaData.filmes.map((f: any) => typeof f === 'number' ? f : f.id)
      );
    } catch (err) {
      setError('Lista não encontrada ou você não tem permissão para editá-la.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilme = (filmeId: number) => {
    setFilmesSelecionados(prev =>
      prev.includes(filmeId)
        ? prev.filter(id => id !== filmeId)
        : [...prev, filmeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome.trim()) {
      setError('O nome da lista é obrigatório.');
      return;
    }

    try {
      setSubmitting(true);
      await favoritosAPI.update(id, { nome: nome.trim(), filmes: filmesSelecionados });
      router.push(`/favoritos/${id}`);
    } catch (err: any) {
      setError(err.message || 'Falha ao atualizar a lista.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error && !lista) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link href="/favoritos" className="btn btn-primary">
          <i className="bi bi-arrow-left me-1"></i>Minhas Listas
        </Link>
      </div>
    );
  }

  return (
    <>
      <section
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '40vh',
          position: 'relative',
        }}
      >
        <div
          className="hero-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
          }}
        ></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 mb-3">
                <i className="bi bi-pencil-square me-3"></i>
                Editar Lista
              </h1>
              <p className="lead mb-4">
                Atualize o nome da sua lista de favoritos
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '60vh',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div
                  className="card-header text-center py-4"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  <h3 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Dados da Lista
                  </h3>
                </div>

                <div className="card-body p-5">
                  {error && <div className="alert alert-danger text-center">{error}</div>}
                  {success && <div className="alert alert-success text-center">{success}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-muted">
                        <i className="bi bi-tag me-2"></i>Nome da Lista
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          <i className="bi bi-heart-fill"></i>
                        </span>

                        <input
                          type="text"
                          className={`form-control ${error && !nome.trim() ? 'is-invalid' : ''}`}
                          placeholder="Ex: Melhores de 2024"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Seleção de Filmes */}
                    <div className="mb-4">
                      <label className="form-label fw-bold text-muted">
                        <i className="bi bi-film me-2"></i>Filmes da Lista
                      </label>
                      
                      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '10px', padding: '10px' }}>
                        {todosFilmes.map(filme => (
                          <div key={filme.id} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`filme-${filme.id}`}
                              checked={filmesSelecionados.includes(filme.id)}
                              onChange={() => toggleFilme(filme.id)}
                            />
                            <label className="form-check-label" htmlFor={`filme-${filme.id}`}>
                              {filme.titulo}
                            </label>
                          </div>
                        ))}
                      </div>
                      <small className="text-muted">
                        {filmesSelecionados.length} filme(s) selecionado(s)
                      </small>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <Link href={`/favoritos/${id}`} className="btn btn-outline-secondary btn-lg me-md-2">
                        <i className="bi bi-x-circle me-2"></i>Cancelar
                      </Link>

                      <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        disabled={submitting}
                        style={{
                          borderRadius: '25px',
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          border: 'none',
                        }}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Salvar Alterações
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

      <style jsx>{`
        .form-control {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 12px 15px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          background: white;
        }

        .input-group-text {
          border: none;
          border-radius: 10px 0 0 10px;
          padding: 12px 15px;
        }

        .input-group > .form-control {
          border-radius: 0 10px 10px 0;
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 30vh;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .card-body {
            padding: 2rem;
          }
        }
      `}</style>
    </>
  );
}
