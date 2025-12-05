'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { filmesAPI, generosAPI } from '@/lib/api';

interface Genero {
  id: number;
  nome: string;
}

interface Diretor {
  id: number;
  nome: string;
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
  media_avaliacoes: number;
}

export default function FilmesPage() {
  const { user, isAdmin } = useAuth();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [filmesData, generosData] = await Promise.all([
        filmesAPI.list(),
        generosAPI.list()
      ]);
      
      setFilmes(filmesData.results || filmesData);
      setGeneros(generosData.results || generosData);
    } catch (err: any) {
      setError('Erro ao carregar filmes');
    } finally {
      setLoading(false);
    }
  };

    const loadDataGenero = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await generosAPI.list();
      setGeneros(Array.isArray(data) ? data : data.results || []); 
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar a lista de gêneros.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = async () => {
    const nome = prompt("Digite o nome do novo gênero:");
    if (!nome) return;

    try {
      await generosAPI.create(nome);
      loadDataGenero(); 
    } catch (err) {
      alert("Erro ao criar. Verifique se já existe ou se você é Admin.");
    }
  };

  const getFilmesPorGenero = (generoId: number) => {
    return filmes.filter(filme => 
      filme.generos && filme.generos.some(g => g.id === generoId)
    );
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

  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid hero-section d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh' }}>
        <div className="container">
          <div className="row g-5 py-5">
            <div className="col-12 text-center">
              <h1 className="display-2 text-white mb-4">Catálogo de Filmes</h1>
              <p className="lead text-white mb-4">Descubra, avalie e organize seus filmes favoritos</p>
              <i className="bi bi-arrow-down text-white" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="container mt-4">
          <div className="admin-controls text-center">
            <h6 className="section-title mb-3">Painel Administrativo</h6>
            <Link href="/filmes/adicionar" className="btn btn-success btn-sm me-2">
              <i className="bi bi-plus-circle me-1"></i>Adicionar Filme
            </Link>
            <button onClick={handleCreate} className="btn btn-success btn-sm me-2">
               <i className="bi bi-plus-circle me-1"></i>Novo Gênero
            </button>
            <Link href="/diretores/adicionar" className="btn btn-primary btn-sm">
              <i className="bi bi-person-plus me-1"></i>Adicionar Diretor
            </Link>
          </div>
        </div>
      )}

      {/* Movies Section */}
      <div className="container-fluid p-5 bg-light">
        <div className="mb-5 text-center">
          <h5 className="section-title">Nosso Catálogo</h5>
          <h1 className="display-4 mb-0">Todos os Filmes</h1>
          <p className="text-muted mt-2">Total: {filmes.length} filmes</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}
        
        {/* Mostrar TODOS os filmes */}
        {filmes && filmes.length > 0 ? (
          <div className="genre-section mb-5">
            <div className="row g-4">
              {filmes.map((filme) => (
                  <div key={filme.id} className="col-lg-3 col-md-6">
                    <div className="movie-card">
                      {filme.poster ? (
                        <img src={filme.poster} alt={`Poster de ${filme.titulo}`} className="movie-poster" />
                      ) : (
                        <div className="movie-poster bg-secondary d-flex align-items-center justify-content-center">
                          <i className="bi bi-film text-white" style={{ fontSize: '3rem' }}></i>
                        </div>
                      )}

                      <div className="movie-rating">
                        ⭐ {filme.media_avaliacoes?.toFixed(1) || 'N/A'}
                      </div>
                      
                      <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">{filme.titulo}</h5>
                          {filme.generos && filme.generos.length > 0 && (
                            <span className="movie-genre-tag-inline">{filme.generos[0].nome}</span>
                          )}
                        </div>
                        <p className="text-muted mb-2">{filme.ano_publicacao}</p>
                        
                        {filme.diretores && filme.diretores.length > 0 ? (
                          <p className="small text-muted mb-3">
                            Dirigido por: {filme.diretores.map(d => d?.nome || 'Desconhecido').join(', ')}
                          </p>
                        ) : (
                          <p className="small text-muted mb-3">Diretor(es) não informado(s)</p>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <Link href={`/filmes/${filme.id}`} className="btn btn-primary btn-sm">
                            <i className="bi bi-info-circle me-1"></i>Detalhes
                          </Link>
                          
                          {isAdmin && (
                            <div className="dropdown">
                              <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i className="bi bi-gear"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <Link className="dropdown-item" href={`/filmes/${filme.id}/editar`}>
                                    <i className="bi bi-pencil me-2"></i>Editar
                                  </Link>
                                </li>
                                <li>
                                  <a className="dropdown-item text-danger" href="#" onClick={(e) => {
                                    e.preventDefault();
                                    if (confirm('Tem certeza que deseja deletar este filme?')) {
                                      filmesAPI.delete(filme.id).then(() => loadData());
                                    }
                                  }}>
                                    <i className="bi bi-trash me-2"></i>Deletar
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        ) : null}

        {(!filmes || filmes.length === 0) && !loading && (
          <div className="text-center py-5">
            <i className="bi bi-collection text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h3 className="text-muted">Nenhum filme cadastrado ainda.</h3>
            <p className="text-muted">Adicione filmes para começar.</p>
            {isAdmin && (
              <Link href="/filmes/adicionar" className="btn btn-primary mt-3">
                <i className="bi bi-plus-circle me-2"></i>Adicionar Primeiro Filme
              </Link>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .section-title {
          color: #667eea;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .genre-title {
          color: #333;
          font-weight: 700;
          padding-bottom: 10px;
          border-bottom: 3px solid #667eea;
          display: inline-block;
        }

        .movie-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .movie-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .movie-poster {
          width: 100%;
          height: 300px;
          object-fit: cover;
          position: relative;
        }

        .movie-rating {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .movie-genre-tag-inline {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-controls {
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .display-2 {
            font-size: 2.5rem;
          }
          
          .movie-poster {
            height: 250px;
          }
        }
      `}</style>
    </>
  );
}
