'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { favoritosAPI } from '@/lib/api';
import { useRouter } from 'next/navigation'; 

// --- Interfaces ---
interface FilmePreview {
  id: number;
  titulo: string;
  poster: string | null;
}

interface ListaFavoritos {
  id: number;
  nome: string;
  usuario: string;
  filmes: FilmePreview[];
}
// ------------------

export default function FavoritosListPage() {
  const router = useRouter(); 
  const { user } = useAuth();

  const [listas, setListas] = useState<ListaFavoritos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login'); 
      return;
    }

    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const listasData = await favoritosAPI.list();
      
      console.log('Dados das listas:', listasData);
      console.log('Primeira lista:', listasData.results?.[0] || listasData[0]);

      setListas(listasData.results || listasData);
    } catch (err) {
      setError('Erro ao carregar listas. Faça login novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getPluralize = (count: number, word: string) =>
    count === 1 ? word : `${word}s`;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '40vh',
          position: 'relative'
        }}>
        <div className="hero-overlay"
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}></div>

        <div className="container position-relative">
          <h1 className="display-4 mb-3">
            <i className="bi bi-heart-fill me-3"></i>
            Minhas Listas de Favoritos
          </h1>
          <p className="lead mb-4">Organize e gerencie suas coleções de filmes favoritos</p>

          <div>
            <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '14px', borderRadius: '20px' }}>
              <i className="bi bi-list-task me-2"></i>
              {listas.length} {getPluralize(listas.length, 'Lista')}
            </span>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="container mt-4 text-center">
        <Link href="/favoritos/criar" className="btn btn-success btn-sm me-2">
          <i className="bi bi-plus-circle me-1"></i>Nova Lista
        </Link>
        <Link href="/" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Voltar ao Catálogo
        </Link>
      </div>

      {/* Listas */}
      <div className="container-fluid p-5 bg-light">
        <div className="mb-5 text-center">
          <h5 className="section-title">Suas Coleções</h5>
          <h1 className="display-4 mb-0">Listas de Favoritos</h1>
        </div>

        {listas.length > 0 ? (
          <div className="row g-4">
            {listas.map((lista, index) => {
              const filmeCount = lista.filmes.length;
              const previewFilmes = lista.filmes.slice(0, 4);
              const filmesRestantes = filmeCount - 4;

              return (
                <div key={lista.id} className="col-lg-4 col-md-6">
                  <div className="lista-card">
                    
                    {/* Header da Lista */}
                    <div className="lista-header">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h4 className="lista-title mb-0">
                          <i className="bi bi-heart-fill text-danger me-2"></i>
                          {lista.nome}
                        </h4>
                      </div>
                      <div className="lista-meta">
                        <span className="badge bg-primary">
                          <i className="bi bi-film me-1"></i>
                          {filmeCount} {getPluralize(filmeCount, 'filme')}
                        </span>
                        <span className="text-muted ms-2">
                          <i className="bi bi-person-fill me-1"></i>
                          {lista.usuario}
                        </span>
                      </div>
                    </div>

                    {/* Miniaturas dos Posters */}
                    <div className="lista-posters">
                      {filmeCount > 0 ? (
                        <>
                          {previewFilmes.map((filme, idx) => (
                            <div key={`${lista.id}-filme-${filme.id}-${idx}`} className="poster-miniatura">
                              {filme.poster ? (
                                <img src={filme.poster} alt={filme.titulo} className="poster-img" />
                              ) : (
                                <div className="poster-img poster-placeholder">
                                  <i className="bi bi-film"></i>
                                </div>
                              )}
                            </div>
                          ))}
                          {filmesRestantes > 0 && (
                            <div className="poster-miniatura more-badge">
                              +{filmesRestantes}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="empty-list-message">
                          <i className="bi bi-inbox me-2"></i>
                          Nenhum filme adicionado
                        </div>
                      )}
                    </div>

                    {/* Footer com ações */}
                    <div className="lista-footer">
                      <Link href={`/favoritos/${lista.id}`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye me-1"></i>Ver
                      </Link>
                      <Link href={`/favoritos/${lista.id}/editar`} className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-pencil me-1"></i>Editar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state">
              <i className="bi bi-heart-break text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h3 className="text-muted mb-3">Nenhuma lista criada ainda</h3>
              <p className="text-muted mb-4">Comece criando sua primeira lista</p>
              <Link href="/favoritos/criar" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Criar Primeira Lista
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Estilos globais */}
      <style jsx global>{`
        .lista-card {
          background: #fff;
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .lista-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        /* Header da Lista */
        .lista-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 2px solid #dee2e6;
        }
        
        .lista-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .lista-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.85rem;
          margin-top: 8px;
        }
        
        .lista-meta .badge {
          padding: 5px 10px;
          border-radius: 12px;
          font-weight: 500;
        }
        
        /* Miniaturas dos Posters */
        .lista-posters {
          padding: 15px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          min-height: 100px;
          background: #fff;
        }
        
        .poster-miniatura {
          width: 60px;
          height: 85px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .poster-miniatura:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.25);
          z-index: 5;
        }
        
        .poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .poster-placeholder {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 1.5rem;
        }
        
        /* Badge de mais filmes */
        .more-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
          border-radius: 8px;
        }
        
        /* Mensagem de lista vazia */
        .empty-list-message {
          color: #6c757d;
          font-size: 0.9rem;
          font-style: italic;
          padding: 10px;
        }
        
        /* Footer com ações */
        .lista-footer {
          padding: 15px 20px;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .lista-footer .btn {
          border-radius: 20px;
          font-size: 0.85rem;
          padding: 6px 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .lista-footer .btn:hover {
          transform: translateY(-2px);
        }
        
        /* Empty State */
        .empty-state {
          padding: 60px 20px;
        }
        
        .section-title {
          color: #667eea;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .lista-title {
            font-size: 1rem;
          }
          
          .poster-miniatura {
            width: 50px;
            height: 70px;
          }
          
          .lista-footer {
            flex-direction: column;
          }
          
          .lista-footer .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
