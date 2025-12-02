// app/favoritos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { favoritosAPI } from '@/lib/api';

// --- Interfaces ---
interface FilmePreview {
  id: number;
  titulo: string;
  poster: string | null;
}

interface ListaFavoritos {
  id: number;
  nome: string;
  usuario: string; // Nome de usuário, pois configuramos o serializer
  filmes: FilmePreview[]; // Lista de filmes na lista
}
// ------------------

export default function FavoritosListPage() {
  const { user } = useAuth();
  const [listas, setListas] = useState<ListaFavoritos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Redireciona se o usuário não estiver logado (Embora a API deva bloquear, é bom ter um fallback no front)
    if (!user) {
      setError('Você precisa estar logado para ver suas listas.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      // Chama a função de API de listagem de listas
      const listasData = await favoritosAPI.list();
      
      // A API retorna as listas do usuário logado
      setListas(listasData.results || listasData); 
    } catch (err: any) {
      // 401/403 (Token expirado ou não autorizado)
      setError('Erro ao carregar listas. Tente fazer login novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getPluralize = (count: number, word: string) => count === 1 ? word : `${word}s`;

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
              {/* Opção para voltar ao login ou ao catálogo */}
          </div>
      );
  }


  return (
    <>
      {/* Hero Section - Replicando o listafavoritos_list.html */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh', position: 'relative' }}>
          <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }}></div>
          <div className="container position-relative">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      <h1 className="display-4 mb-3 wow fadeInUp" data-wow-delay="0.1s">
                          <i className="bi bi-heart-fill me-3"></i>
                          Minhas Listas de Favoritos
                      </h1>
                      <p className="lead mb-4 wow fadeInUp" data-wow-delay="0.3s">
                          Organize e gerencie suas coleções de filmes favoritos
                      </p>
                      <div className="wow fadeInUp" data-wow-delay="0.5s">
                          <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '14px', borderRadius: '20px' }}>
                              <i className="bi bi-list-task me-2"></i>{listas.length} {getPluralize(listas.length, 'Lista')}
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Controls Section */}
      <div className="container mt-4">
          <div className="admin-controls text-center wow fadeIn" data-wow-delay="0.1s">
              <h6 className="section-title mb-3">Gerenciar Listas</h6>
              <Link href="/favoritos/criar" className="btn btn-success btn-sm me-2">
                  <i className="bi bi-plus-circle me-1"></i>Nova Lista
              </Link>
              <Link href="/" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1"></i>Voltar ao Catálogo
              </Link>
          </div>
      </div>

      {/* Stats Section */}
      <div className="container-fluid stats-section p-5 my-5">
          <div className="row gx-5 gy-4 py-5 justify-content-center">
              <div className="col-lg-4 col-md-6 wow fadeIn" data-wow-delay="0.1s">
                  <div className="d-flex">
                      <div className="stats-icon">
                          <i className="bi bi-list-task fs-4 text-primary"></i>
                      </div>
                      <div className="ps-4">
                          <h5 className="text-white">Total</h5>
                          <h1 className="stats-number">{listas.length}</h1>
                          <small className="text-secondary">Lista{getPluralize(listas.length, '')} Criada{getPluralize(listas.length, '')}</small>
                      </div>
                  </div>
              </div>
              <div className="col-lg-4 col-md-6 wow fadeIn" data-wow-delay="0.2s">
                  <div className="d-flex">
                      <div className="stats-icon">
                          <i className="bi bi-heart fs-4 text-primary"></i>
                      </div>
                      <div className="ps-4">
                          <h5 className="text-white">Favoritos</h5>
                          <h1 className="stats-number">♥</h1>
                          <small className="text-secondary">Suas Coleções</small>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Lists Section */}
      <div className="container-fluid p-5 bg-light">
          <div className="mb-5 text-center wow fadeIn" data-wow-delay="0.1s">
              <h5 className="section-title">Suas Coleções</h5>
              <h1 className="display-4 mb-0">Listas de Favoritos</h1>
          </div>
          
          {listas && listas.length > 0 ? (
              <div className="row g-4">
                  {listas.map((lista, index) => {
                      const filmeCount = lista.filmes.length;
                      const previewFilmes = lista.filmes.slice(0, 3);
                      const filmesRestantes = filmeCount - 3;
                      
                      return (
                          <div key={lista.id} className="col-lg-4 col-md-6 wow fadeIn" data-wow-delay={`0.${index % 4 + 1}s`}>
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
                                      <div className="lista-meta">
                                          <small className="text-muted">
                                              <i className="bi bi-film me-1"></i>
                                              {filmeCount} {getPluralize(filmeCount, 'filme')}
                                          </small>
                                      </div>
                                      
                                      {filmeCount > 0 && (
                                          <div className="lista-preview">
                                              {previewFilmes.map((filme) => (
                                                  <div key={filme.id}>
                                                    {filme.poster ? (
                                                        // A API deve retornar a URL completa do poster
                                                        <img src={filme.poster} alt={filme.titulo} className="preview-poster" />
                                                    ) : (
                                                        <div className="preview-poster preview-placeholder">
                                                            <i className="bi bi-film"></i>
                                                        </div>
                                                    )}
                                                  </div>
                                              ))}
                                              {filmesRestantes > 0 && (
                                                  <div className="preview-more">
                                                      <span>+{filmesRestantes}</span>
                                                  </div>
                                              )}
                                          </div>
                                      )}
                                  </div>
                                  
                                  {/* Overlay para hover */}
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
                      <p className="text-muted mb-4">Comece criando sua primeira lista de filmes favoritos</p>
                      <Link href="/favoritos/criar" className="btn btn-primary">
                          <i className="bi bi-plus-circle me-2"></i>Criar Primeira Lista
                      </Link>
                  </div>
              </div>
          )}
      </div>

      <style jsx global>{`
          /* Estilos CORS do template listafavoritos_list.html */
          .hero-section {
              position: relative;
              overflow: hidden;
              border-radius: 0 0 50px 50px;
          }

          .section-title {
              color: #667eea;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 2px;
          }
          
          .admin-controls {
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }

          .stats-section {
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
          }

          .stats-icon {
              background: rgba(255, 255, 255, 0.1);
              width: 60px;
              height: 60px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          
          .stats-number {
              color: white;
              font-weight: 700;
          }
          
          .lista-card {
              background: #fff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
              position: relative;
              height: 100%;
              display: flex;
              flex-direction: column;
          }

          .lista-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          }
          
          .lista-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: space-between;
          }

          .lista-icon {
              font-size: 1.5rem;
              color: white;
          }

          .lista-count .badge {
              font-size: 0.8rem;
              padding: 5px 10px;
              border-radius: 20px;
              position: absolute;
              top: 10px;
              right: 10px;
          }

          .lista-body {
              padding: 20px;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
          }

          .lista-title {
              color: #2c3e50;
              font-weight: 600;
              margin-bottom: 10px;
              font-size: 1.2rem;
          }

          .lista-preview {
              display: flex;
              align-items: center;
              gap: 5px;
              margin-top: auto;
              flex-wrap: wrap;
          }

          .preview-poster {
              width: 35px;
              height: 50px;
              border-radius: 5px;
              object-fit: cover;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }

          .preview-placeholder {
              background: #f8f9fa;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #6c757d;
              font-size: 0.8rem;
          }

          .preview-more {
              width: 35px;
              height: 50px;
              background: #e9ecef;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              color: #6c757d;
              font-weight: 500;
          }

          .lista-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s ease;
          }

          .lista-card:hover .lista-overlay {
              opacity: 1;
          }

          .overlay-content .btn {
              border-radius: 25px;
              padding: 12px 25px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              transition: all 0.3s ease;
          }

          .empty-state {
              background: #fff;
              border-radius: 20px;
              padding: 60px 40px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              max-width: 500px;
              margin: 0 auto;
          }
      `}</style>
    </>
  );
}