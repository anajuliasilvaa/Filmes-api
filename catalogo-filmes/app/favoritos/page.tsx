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
              const previewFilmes = lista.filmes.slice(0, 3);
              const filmesRestantes = filmeCount - 3;

              return (
                <div key={lista.id} className="col-lg-4 col-md-6">
                  <div className="lista-card">

                    <div className="lista-header">
                      <div className="lista-icon">
                        <i className="bi bi-heart-fill text-danger"></i>
                      </div>
                      <div className="lista-count">
                        <span className="badge bg-primary">{filmeCount}</span>
                      </div>
                    </div>

                    <div className="lista-body">
                      <h4 className="lista-title">{lista.nome}</h4>

                      <small className="text-muted">
                        <i className="bi bi-film me-1"></i>
                        {filmeCount} {getPluralize(filmeCount, 'filme')}
                      </small>

                      {filmeCount > 0 && (
                        <div className="lista-preview">
                          {previewFilmes.map(filme => (
                            <div key={filme.id}>
                              {filme.poster ? (
                                <img src={filme.poster} className="preview-poster" />
                              ) : (
                                <div className="preview-poster preview-placeholder">
                                  <i className="bi bi-film"></i>
                                </div>
                              )}
                            </div>
                          ))}

                          {filmesRestantes > 0 && (
                            <div className="preview-more">
                              +{filmesRestantes}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="lista-overlay">
                      <div className="overlay-content">
                        <Link href={`/favoritos/${lista.id}`} className="btn btn-light btn-lg">
                          <i className="bi bi-heart me-2"></i>Abrir Lista
                        </Link>
                      </div>
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
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          transition: 0.3s;
        }
        .lista-card:hover {
          transform: translateY(-10px);
        }
        .lista-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 20px;
          color: white;
        }
        .preview-poster {
          width: 35px;
          height: 50px;
          object-fit: cover;
        }
        .lista-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          opacity: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.3s;
        }
        .lista-card:hover .lista-overlay {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
