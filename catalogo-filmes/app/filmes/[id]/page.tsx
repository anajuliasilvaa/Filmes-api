'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { filmesAPI } from '@/lib/api';

interface Genero {
  id: number;
  nome: string;
}

interface Diretor {
  id: number;
  nome: string;
}

interface Avaliacao {
  id: number;
  usuario: {
    id: number;
    username: string;
  };
  nota: number;
  comentario: string;
  data_criacao: string;
}

interface Filme {
  id: number;
  titulo: string;
  ano_publicacao: number;
  sinopse: string;
  duracao: number;
  poster: string;
  generos: Genero[];
  diretores: Diretor[];
  avaliacoes: Avaliacao[];
  media_avaliacoes: number;
}

export default function FilmeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (params.id && user) {
      loadFilme();
    }
  }, [params.id, user, authLoading, router]);

  const loadFilme = async () => {
    try {
      setLoading(true);
      const data = await filmesAPI.get(Number(params.id));
      setFilme(data);
    } catch (err: any) {
      setError('Erro ao carregar filme');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return;
    
    try {
      await filmesAPI.delete(Number(params.id));
      router.push('/filmes');
    } catch (err) {
      alert('Erro ao deletar filme');
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

  if (error || !filme) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          {error || 'Filme não encontrado'}
        </div>
        <div className="text-center">
          <Link href="/filmes" className="btn btn-primary">
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '50vh', position: 'relative' }}>
        <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}></div>
        <div className="container position-relative">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 mb-3">
                <i className="fas fa-film me-3"></i>
                {filme.titulo}
              </h1>
              <p className="lead mb-4">
                {filme.ano_publicacao && `${filme.ano_publicacao}`}
                {filme.duracao && ` • ${filme.duracao} min`}
              </p>
              <div>
                {filme.generos && filme.generos.length > 0 ? (
                  filme.generos.map((genero) => (
                    <span key={genero.id} className="badge bg-light text-dark me-2 mb-2 px-3 py-2" style={{ fontSize: '14px', borderRadius: '20px' }}>
                      {genero.nome}
                    </span>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detalhes do Filme */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '80vh' }}>
        <div className="container">
          <div className="row">
            {/* Poster e Informações Principais */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-lg border-0 h-100" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-body p-4 text-center">
                  {filme.poster ? (
                    <img src={filme.poster} alt={`Poster de ${filme.titulo}`} className="img-fluid rounded shadow-sm mb-3" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light rounded mb-3" style={{ height: '400px' }}>
                      <div className="text-muted">
                        <i className="fas fa-image fa-3x mb-2"></i>
                        <p className="mb-0">Sem imagem de poster</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Informações Técnicas */}
                  <div className="mt-4">
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <div className="p-3 bg-light rounded">
                          <i className="fas fa-calendar text-primary mb-2"></i>
                          <h6 className="mb-0">{filme.ano_publicacao || 'N/A'}</h6>
                          <small className="text-muted">Ano</small>
                        </div>
                      </div>
                      <div className="col-6 mb-3">
                        <div className="p-3 bg-light rounded">
                          <i className="fas fa-clock text-primary mb-2"></i>
                          <h6 className="mb-0">{filme.duracao || 'N/A'} min</h6>
                          <small className="text-muted">Duração</small>
                        </div>
                      </div>
                    </div>
                    
                    {/* Diretores */}
                    {filme.diretores && filme.diretores.length > 0 && (
                      <div className="mt-3">
                        <div className="p-3 bg-light rounded">
                          <i className="fas fa-user-tie text-primary mb-2"></i>
                          <h6 className="mb-2">Diretor{filme.diretores.length > 1 ? 'es' : ''}</h6>
                          <div className="d-flex flex-wrap justify-content-center gap-2">
                            {filme.diretores.map((diretor) => (
                              <span key={diretor.id} className="badge px-3 py-2" style={{ background: '#007cba', borderRadius: '15px', color: 'white', fontSize: '12px' }}>
                                {diretor.nome}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="col-lg-8">
              {/* Sinopse */}
              <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: '20px' }}>
                <div className="card-header py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <h5 className="mb-0">
                    <i className="fas fa-book-open me-2"></i>Sinopse
                  </h5>
                </div>
                <div className="card-body p-4">
                  <p className="mb-0 text-muted" style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    {filme.sinopse || 'Sinopse não disponível.'}
                  </p>
                </div>
              </div>

              {/* Avaliações */}
              <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: '20px' }}>
                <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <h5 className="mb-0">
                    <i className="fas fa-star me-2"></i>Avaliações
                  </h5>
                  {user && (
                    <Link href={`/filmes/${filme.id}/avaliar`} className="btn btn-light btn-sm" style={{ borderRadius: '20px' }}>
                      <i className="fas fa-plus me-1"></i>Adicionar
                    </Link>
                  )}
                </div>
                <div className="card-body p-4">
                  <div className="avaliacoes-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {filme.avaliacoes && filme.avaliacoes.length > 0 ? (
                      filme.avaliacoes.map((avaliacao) => (
                        <div key={avaliacao.id} className="mb-4 p-3 bg-light rounded-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-3" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                {avaliacao.usuario.username[0].toUpperCase()}
                              </div>
                              <div>
                                <h6 className="mb-0">{avaliacao.usuario.username}</h6>
                                <div className="text-warning">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i key={star} className={star <= avaliacao.nota ? 'fas fa-star' : 'far fa-star'}></i>
                                  ))}
                                  <span className="ms-2 text-muted">({avaliacao.nota}/5)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mb-0 text-muted">{avaliacao.comentario}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-star-half-alt text-muted fa-3x mb-3"></i>
                        <p className="text-muted">Este filme ainda não tem avaliações.</p>
                        {user && (
                          <Link href={`/filmes/${filme.id}/avaliar`} className="btn btn-outline-primary" style={{ borderRadius: '20px' }}>
                            <i className="fas fa-plus me-2"></i>Seja o primeiro a avaliar
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex gap-3 flex-wrap">
                      <Link href="/filmes" className="btn btn-outline-secondary btn-lg px-4 py-2" style={{ borderRadius: '25px' }}>
                        <i className="fas fa-arrow-left me-2"></i>Voltar ao Catálogo
                      </Link>
                    </div>
                    
                    {isAdmin && (
                      <div className="btn-group" role="group">
                        <Link href={`/filmes/${filme.id}/editar`} className="btn btn-outline-primary btn-lg px-4 py-2" style={{ borderRadius: '25px 0 0 25px' }}>
                          <i className="fas fa-edit me-2"></i>Editar
                        </Link>
                        <button onClick={handleDelete} className="btn btn-outline-danger btn-lg px-4 py-2" style={{ borderRadius: '0 25px 25px 0' }}>
                          <i className="fas fa-trash me-2"></i>Deletar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .avatar-circle {
          transition: all 0.3s ease;
        }

        .avatar-circle:hover {
          transform: scale(1.1);
        }

        .badge {
          transition: all 0.3s ease;
        }

        .badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .btn-outline-secondary:hover,
        .btn-outline-primary:hover,
        .btn-outline-danger:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 40vh;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .avaliacoes-container {
            max-height: 300px;
          }
        }
      `}</style>
    </>
  );
}
