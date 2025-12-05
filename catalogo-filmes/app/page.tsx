'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { filmesAPI, generosAPI } from '@/lib/api';


// --- Interfaces ---
interface Genero {
  id: number;
  nome: string;
}

interface Filme {
  id: number;
  titulo: string;
  poster: string | null;
  generos: number[] | Genero[]; 
  ano_publicacao: number;
  sinopse: string;
  media_avaliacoes?: number; 
}
// ------------------

export default function HomePage() {
  const { user, isAdmin } = useAuth();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [resGeneros, resFilmes] = await Promise.all([
          generosAPI.list(),
          filmesAPI.list()
        ]);

        setGeneros(Array.isArray(resGeneros) ? resGeneros : resGeneros.results || []);
        setFilmes(Array.isArray(resFilmes) ? resFilmes : resFilmes.results || []);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const getFilmesPorGenero = (generoId: number) => {
    return filmes.filter(filme => {
      if (!filme.generos) return false;
      return filme.generos.some((g: any) => {
        const id = typeof g === 'object' ? g.id : g;
        return id === generoId;
      });
    });
  };


  const loadData = async () => {
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
      loadData(); 
    } catch (err) {
      alert("Erro ao criar. Verifique se já existe ou se você é Admin.");
    }
  };

  const filmeDestaque = filmes.length > 0 
    ? filmes.reduce((prev, current) => {
        const notaPrev = prev.media_avaliacoes || 0;
        const notaCurr = current.media_avaliacoes || 0;
        return (notaPrev > notaCurr) ? prev : current;
      })
    : null;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* --- HERO SECTION (DESTAQUE) --- */}
      <div className="container-fluid hero-section d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '50vh' }}>
        <div className="container">
          {filmeDestaque ? (
            <div className="row align-items-center g-5 py-5">
              <div className="col-lg-6 text-white">
                <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">
                  ★ Destaque da Comunidade
                </span>
                <h1 className="display-3 fw-bold mb-4">{filmeDestaque.titulo}</h1>
                <p className="lead mb-4" style={{ opacity: 0.9 }}>
                  {filmeDestaque.sinopse 
                    ? (filmeDestaque.sinopse.length > 200 ? filmeDestaque.sinopse.substring(0, 200) + '...' : filmeDestaque.sinopse) 
                    : 'Confira os detalhes e avalie este filme.'}
                </p>
                <div className="d-flex gap-3">
                   {/* Botão Ver Detalhes */}
                   <Link href={`/filmes/${filmeDestaque.id}`} className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-primary">
                     <i className="bi bi-eye me-2"></i>Ver Detalhes
                   </Link>
                   
                   {/* Botão Avaliar (AGORA É UM LINK TAMBÉM) */}
                   <Link href={`/filmes/${filmeDestaque.id}`} className="btn btn-outline-light btn-lg rounded-pill px-4">
                     <i className="bi bi-star me-2"></i>Avaliar
                   </Link>
                </div>
              </div>
              
              <div className="col-lg-6 d-none d-lg-block text-center">
                {filmeDestaque.poster && (
                  <img 
                    src={filmeDestaque.poster} 
                    alt={filmeDestaque.titulo} 
                    className="img-fluid rounded shadow-lg animate-up-down"
                    style={{ maxHeight: '450px', border: '5px solid rgba(255,255,255,0.2)' }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <h1 className="display-4">Bem-vindo ao CineList</h1>
              <p>O seu catálogo de filmes favorito.</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="container mt-4 mb-4">
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

      {/* --- CONTEÚDO PRINCIPAL (POR CATEGORIA) --- */}
      <div className="container-fluid p-5 bg-light">
        
        {generos.map((genero) => {
          const filmesDaCategoria = getFilmesPorGenero(genero.id);
          if (filmesDaCategoria.length === 0) return null;

          return (
            <div key={genero.id} className="mb-5 category-block wow fadeIn">
              <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                <h3 className="text-primary fw-bold mb-0">
                  <i className="bi bi-tag-fill me-2"></i>{genero.nome}
                </h3>
                <span className="badge bg-secondary ms-3 rounded-pill">{filmesDaCategoria.length}</span>
              </div>

              <div className="custom-carousel-container">
                <div className="custom-carousel">
                  {filmesDaCategoria.map((filme) => (
                    <div key={filme.id} className="carousel-item-card">
                      <div className="movie-card shadow-sm h-100 bg-white rounded-3 overflow-hidden border">
                        
                        <div className="poster-area position-relative" style={{ height: '300px' }}>
                          {filme.poster ? (
                            <img src={filme.poster} alt={filme.titulo} className="w-100 h-100 object-fit-cover" />
                          ) : (
                            <div className="d-flex justify-content-center align-items-center h-100 bg-light text-muted">
                              <i className="bi bi-film fs-1"></i>
                            </div>
                          )}
                          <div className="position-absolute top-0 end-0 m-2">
                             <span className="badge bg-warning text-dark shadow-sm">
                               <i className="bi bi-star-fill me-1"></i>
                               {filme.media_avaliacoes ? filme.media_avaliacoes.toFixed(1) : '-'}
                             </span>
                          </div>
                        </div>

                        <div className="p-3 d-flex flex-column">
                          <h6 className="fw-bold text-dark text-truncate mb-1" title={filme.titulo}>{filme.titulo}</h6>
                          <small className="text-muted mb-3">{filme.ano_publicacao}</small>
                          
                          <Link href={`/filmes/${filme.id}`} className="btn btn-outline-primary btn-sm w-100 mt-auto rounded-pill">
                            Ver Detalhes
                          </Link>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filmes.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted">Nenhum filme cadastrado ainda.</h3>
          </div>
        )}

      </div>

      <style jsx>{`
        .hero-section {
            border-radius: 0 0 50px 50px;
            margin-bottom: 2rem;
        }
        @keyframes up-down {
            0% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0); }
        }
        .animate-up-down {
            animation: up-down 3s ease-in-out infinite;
        }
        .custom-carousel-container {
            position: relative;
            width: 100%;
        }
        .custom-carousel {
            display: flex;
            overflow-x: auto;
            gap: 20px;
            padding: 10px 5px 25px 5px;
            scroll-behavior: smooth;
        }
        .custom-carousel::-webkit-scrollbar {
            height: 8px;
        }
        .custom-carousel::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .custom-carousel::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 10px;
        }
        .custom-carousel::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }
        .carousel-item-card {
            flex: 0 0 220px;
            transition: transform 0.3s ease;
        }
        .carousel-item-card:hover {
            transform: translateY(-5px);
        }
        .movie-card {
            transition: box-shadow 0.3s ease;
        }
        .movie-card:hover {
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .object-fit-cover {
            object-fit: cover;
        }
      `}</style>
    </>
  );
}