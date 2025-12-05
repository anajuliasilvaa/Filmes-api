// app/favoritos/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { favoritosAPI } from '@/lib/api';

// --- Interfaces (Baseadas no modelo ListaFavoritos) ---
interface FilmePreview {
  id: number;
  titulo: string;
  poster: string | null;
  ano_publicacao?: number;
  duracao?: string;
  media_avaliacoes?: number;
  generos?: { id: number, nome: string }[];
}

interface ListaFavoritos {
  id: number;
  nome: string;
  usuario: string; // Nome de usuário, vindo do Serializer
  filmes: FilmePreview[]; 
}
// ------------------

export default function FavoritosDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [lista, setLista] = useState<ListaFavoritos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
        loadData();
    }
  }, [id, user]);

  const loadData = async () => {
    // Redireciona se não estiver logado, pois é uma página privada.
    if (!user) {
        router.push('/login');
        return;
    }
      
    try {
      setLoading(true);
      setError('');
      // Chama a função GET (Detalhe) que adicionamos no api.ts
      const listaData = await favoritosAPI.get(id);
      
      setLista(listaData); 
    } catch (err: any) {
      setError('Lista de Favoritos não encontrada ou você não tem permissão para acessá-la.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteLista = async () => {
    if (confirm(`Tem certeza que deseja DELETAR a lista "${lista?.nome}"?`)) {
      try {
        await favoritosAPI.delete(id);
        // Redireciona para a lista principal após deletar
        router.push('/favoritos');
      } catch (err) {
        setError('Falha ao deletar a lista. Verifique se você é o criador.');
      }
    }
  };
  
  const handleRemoveFilme = async (filmeId: number) => {
    if (confirm('Deseja realmente remover este filme da lista?')) {
        try {
            await favoritosAPI.removeFilme(id, filmeId); 
            await loadData();
        } catch (err) {
            setError('Falha ao remover filme.');
        }
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
  const getPluralize = (count: number, word: string) => count === 1 ? word : `${word}s`;

  return (
    <>
      {/* Hero Section - Replicando listafavoritos_detail.html */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh', position: 'relative' }}>
          <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }}></div>
          <div className="container position-relative">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      <h1 className="display-4 mb-3 wow fadeInUp" data-wow-delay="0.1s">
                          <i className="bi bi-heart-fill me-3"></i>
                          {lista.nome}
                      </h1>
                      <p className="lead mb-4 wow fadeInUp" data-wow-delay="0.3s">
                          Lista criada por: <strong>{lista.usuario}</strong>
                      </p>
                      <div className="wow fadeInUp" data-wow-delay="0.5s">
                          <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '14px', borderRadius: '20px' }}>
                              <i className="bi bi-film me-2"></i>{filmeCount} {getPluralize(filmeCount, 'filme')}
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Action Controls - Replicando listafavoritos_detail.html */}
      <div className="container mt-4">
          <div className="admin-controls text-center wow fadeIn" data-wow-delay="0.1s">
              <h6 className="section-title mb-3">Ações da Lista</h6>
              <Link href="/favoritos" className="btn btn-outline-secondary btn-sm me-2">
                  <i className="bi bi-arrow-left me-1"></i>Minhas Listas
              </Link>
              <Link href={`/favoritos/${lista.id}/editar`} className="btn btn-warning btn-sm me-2">
                  <i className="bi bi-pencil me-1"></i>Editar Lista
              </Link>
              <button onClick={handleDeleteLista} className="btn btn-danger btn-sm">
                  <i className="bi bi-trash me-1"></i>Deletar Lista
              </button>
          </div>
      </div>

      {/* Stats Section */}
      <div className="container-fluid stats-section p-5 my-5">
          <div className="row gx-5 gy-4 py-5 justify-content-center">
              <div className="col-lg-3 col-md-6 wow fadeIn" data-wow-delay="0.1s">
                  <div className="d-flex">
                      <div className="stats-icon">
                          <i className="bi bi-film fs-4 text-primary"></i>
                      </div>
                      <div className="ps-4">
                          <h5 className="text-white">Filmes</h5>
                          <h1 className="stats-number">{filmeCount}</h1>
                          <small className="text-secondary">Na Lista</small>
                      </div>
                  </div>
              </div>
              <div className="col-lg-3 col-md-6 wow fadeIn" data-wow-delay="0.2s">
                  <div className="d-flex">
                      <div className="stats-icon">
                          <i className="bi bi-heart fs-4 text-primary"></i>
                      </div>
                      <div className="ps-4">
                          <h5 className="text-white">Lista</h5>
                          <h1 className="stats-number">♥</h1>
                          <small className="text-secondary">Favoritos</small>
                      </div>
                  </div>
              </div>
              <div className="col-lg-3 col-md-6 wow fadeIn" data-wow-delay="0.3s">
                  <div className="d-flex">
                      <div className="stats-icon">
                          <i className="bi bi-person-fill fs-4 text-primary"></i>
                      </div>
                      <div className="ps-4">
                          <h5 className="text-white">Criador</h5>
                          <h1 className="stats-number">{lista.usuario.charAt(0).toUpperCase()}</h1>
                          <small className="text-secondary">{lista.usuario}</small>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Movies Section */}
      <div className="container-fluid p-5 bg-light">
          <div className="mb-5 text-center wow fadeIn" data-wow-delay="0.1s">
              <h5 className="section-title">Sua Coleção</h5>
              <h1 className="display-4 mb-0">Filmes da Lista</h1>
          </div>
          
          {filmeCount > 0 ? (
              <div className="row g-4">
                  {lista.filmes.map((filme, index) => (
                      <div key={filme.id} className="col-lg-3 col-md-4 col-sm-6 wow fadeIn" data-wow-delay={`0.${index % 4 + 1}s`}>
                          <div className="movie-card-favorite">
                              <div className="movie-poster-container">
                                  {filme.poster ? (
                                      <img src={filme.poster} alt={filme.titulo} className="movie-poster" />
                                  ) : (
                                      <div className="movie-poster movie-placeholder">
                                          <i className="bi bi-film text-primary" style={{ fontSize: '3rem' }}></i>
                                      </div>
                                  )}
                                  
                                  <div className="movie-overlay">
                                      <div className="movie-actions">
                                          <Link href={`/filmes/${filme.id}`} className="btn btn-primary btn-sm me-2">
                                              <i className="bi bi-info-circle me-1"></i>Detalhes
                                          </Link>
                                          <button onClick={() => handleRemoveFilme(filme.id)} className="btn btn-danger btn-sm">
                                              <i className="bi bi-x-circle me-1"></i>Remover
                                          </button>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="movie-info">
                                  <h5 className="movie-title">{filme.titulo}</h5>
                                  <p className="movie-year">
                                      <i className="bi bi-calendar-event me-1"></i>
                                      {filme.ano_publicacao || "Ano não informado"}
                                  </p>
                                  
                                  {filme.generos && filme.generos.length > 0 && (
                                      <div className="movie-genres">
                                          {filme.generos.map((genero) => (
                                              <span key={genero.id} className="badge bg-secondary me-1">{genero.nome}</span>
                                          ))}
                                      </div>
                                  )}
                                  
                                  <div className="movie-duration">
                                      <small className="text-muted">
                                          <i className="bi bi-clock me-1"></i>
                                          {filme.duracao || 'N/A'}
                                      </small>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-center py-5">
                  <div className="empty-state">
                      <i className="bi bi-heart-break text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                      <h3 className="text-muted mb-3">Lista vazia</h3>
                      <p className="text-muted mb-4">Esta lista ainda não possui filmes adicionados</p>
                      <Link href="/" className="btn btn-primary">
                          <i className="bi bi-search me-2"></i>Explorar Filmes
                      </Link>
                  </div>
              </div>
          )}
      </div>
      
      {/* Estilos */}
      <style jsx global>{`
          /* Estilos replicados de listafavoritos_detail.html */
          .hero-section {
              border-radius: 0 0 50px 50px;
          }
          .section-title {
              color: #667eea;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 2px;
          }
          .admin-controls .btn {
              margin: 0 5px;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 0.875rem;
              font-weight: 500;
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
          
          .movie-card-favorite {
              background: #fff;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
              height: 100%;
              display: flex;
              flex-direction: column;
              position: relative;
          }
          .movie-card-favorite:hover {
              transform: translateY(-10px);
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          }
          .movie-poster-container {
              position: relative;
              height: 300px;
              overflow: hidden;
          }
          .movie-poster {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
          .movie-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s ease;
          }
          .movie-card-favorite:hover .movie-overlay {
              opacity: 1;
          }
          .movie-actions .btn {
              border-radius: 25px;
          }
          .movie-info {
              padding: 20px;
              flex-grow: 1;
          }
          .movie-title {
              font-weight: 600;
              font-size: 1.1rem;
          }
          .movie-year {
              font-size: 0.9rem;
          }
          .movie-duration {
              margin-top: auto;
              padding-top: 10px;
              border-top: 1px solid #f8f9fa;
          }
          .empty-state .btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
      `}</style>
    </>
  );
}