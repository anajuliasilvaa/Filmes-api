'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';

interface Character {
  _id: number;
  name: string;
  imageUrl: string;
}

interface DisneyData {
  data: Character[];
  info?: {
    count: number;
    totalPages: number;
    previousPage: string | null;
    nextPage: string | null;
  };
}

export default function EscolherAvatarPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCharacters();
    }
  }, [currentPage, isAuthenticated]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const data: DisneyData = await authAPI.getAvatars(currentPage, searchQuery);
      setCharacters(data.data || []);
      setHasNextPage(!!data.info?.nextPage);
      setHasPreviousPage(!!data.info?.previousPage);
    } catch (err) {
      console.error('Erro ao carregar personagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCharacters();
  };

  const handleSelectAvatar = async (character: Character) => {
    try {
      await authAPI.setAvatar(character.imageUrl, character.name);
      alert('Avatar atualizado com sucesso!');
      window.location.href = '/perfil';
    } catch (err) {
      alert('Erro ao atualizar avatar');
    }
  };

  const handleRandomAvatar = async () => {
    try {
      await authAPI.setRandomAvatar();
      alert('Avatar aleatório definido com sucesso!');
      window.location.href = '/perfil';
    } catch (err) {
      alert('Erro ao definir avatar aleatório');
    }
  };

  if (authLoading) {
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
      <section className="hero-section position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center text-center text-white py-5">
            <div className="col-lg-8">
              <div className="hero-content">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="fas fa-palette me-3" style={{ fontSize: '3.5rem' }}></i>
                  <h1 className="display-4 fw-bold mb-0">Avatar Disney</h1>
                </div>
                <p className="lead mb-4">Escolha seu personagem favorito e dê vida ao seu perfil</p>
                <div className="d-inline-flex align-items-center bg-white bg-opacity-20 px-4 py-2 rounded-pill">
                  <i className="fas fa-sparkles me-2"></i>
                  <span>Galeria Mágica</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-4" style={{ background: 'linear-gradient(180deg, #fff3e0 0%, #ffffff 100%)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-search mb-2" style={{ fontSize: '2rem' }}></i>
                    <h4 className="mb-1 fw-bold">Buscar Personagem</h4>
                    <p className="mb-0 opacity-75">Encontre seu favorito na magia Disney</p>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <form onSubmit={handleSearch} className="search-form">
                    <div className="input-group mb-3">
                      <span className="input-group-text border-0 bg-light">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control border-0 bg-light" 
                        placeholder="Digite o nome do personagem Disney..." 
                      />
                      <button type="submit" className="btn text-white px-4" 
                              style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)', border: 'none', borderRadius: '0 10px 10px 0' }}>
                        <i className="fas fa-magic me-2"></i>Buscar
                      </button>
                    </div>
                    
                    {searchQuery && (
                      <div className="text-center">
                        <button 
                          type="button"
                          onClick={() => { setSearchQuery(''); setCurrentPage(1); loadCharacters(); }}
                          className="btn btn-outline-secondary rounded-pill px-4">
                          <i className="fas fa-times me-2"></i>Limpar Busca
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>
        <div className="container">
          {searchQuery && (
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center bg-white px-4 py-2 rounded-pill shadow-sm">
                <i className="fas fa-search me-2 text-primary"></i>
                <span className="fw-semibold">Resultados para: <strong>"{searchQuery}"</strong></span>
                {characters.length > 0 && (
                  <span className="badge bg-primary ms-2">{characters.length} encontrado{characters.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : characters.length > 0 ? (
            <>
              <div className="row g-4" id="charactersGrid">
                {characters.map((character, index) => (
                  <div key={character._id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                    <div className="character-card h-100 bg-white rounded-4 shadow-sm border-0 overflow-hidden">
                      <div className="character-image-container position-relative">
                        <img 
                          src={character.imageUrl} 
                          alt={character.name} 
                          className="character-image w-100" 
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <div className="character-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                             style={{ background: 'rgba(0,0,0,0.7)', opacity: 0, transition: 'all 0.3s ease' }}>
                          <i className="fas fa-crown text-white" style={{ fontSize: '2rem' }}></i>
                        </div>
                      </div>
                      
                      <div className="card-body p-3 text-center">
                        <h6 className="character-name fw-bold text-dark mb-2" style={{ fontSize: '0.9rem' }}>{character.name}</h6>
                        
                        <button 
                          onClick={() => handleSelectAvatar(character)}
                          className="btn btn-sm text-white w-100 fw-bold" 
                          style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)', border: 'none', borderRadius: '10px', fontSize: '0.8rem' }}>
                          <i className="fas fa-magic me-1"></i>
                          Escolher
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {!searchQuery && (
                <div className="text-center mt-5">
                  <div className="pagination-container d-inline-flex align-items-center bg-white rounded-pill shadow-sm p-2">
                    {hasPreviousPage && (
                      <button 
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="btn btn-outline-primary rounded-pill me-2">
                        <i className="fas fa-chevron-left me-1"></i>Anterior
                      </button>
                    )}
                    
                    <span className="px-3 fw-semibold text-muted">
                      <i className="fas fa-bookmark me-1"></i>
                      Página {currentPage}
                    </span>
                    
                    {hasNextPage && (
                      <button 
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="btn btn-outline-primary rounded-pill ms-2">
                        Próxima<i className="fas fa-chevron-right ms-1"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-search-minus mb-4" style={{ fontSize: '4rem', color: '#e9ecef' }}></i>
              <h4 className="text-muted mb-3">Nenhum personagem encontrado</h4>
              {searchQuery && (
                <>
                  <p className="text-muted mb-4">Não encontramos personagens para "<strong>{searchQuery}</strong>"</p>
                  <button 
                    onClick={() => { setSearchQuery(''); loadCharacters(); }}
                    className="btn btn-primary rounded-pill px-4">
                    <i className="fas fa-sparkles me-2"></i>Ver Todos os Personagens
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="py-4" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="row g-3">
                <div className="col-md-6">
                  <button onClick={handleRandomAvatar} className="text-decoration-none w-100 border-0 p-0">
                    <div className="action-button-card h-100 p-4 text-center rounded-3" 
                         style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                      <i className="fas fa-dice mb-3" style={{ fontSize: '2.5rem' }}></i>
                      <h5 className="fw-bold mb-2">Avatar Aleatório</h5>
                      <p className="mb-0 opacity-75">Deixe a magia escolher por você</p>
                    </div>
                  </button>
                </div>
                <div className="col-md-6">
                  <Link href="/perfil" className="text-decoration-none">
                    <div className="action-button-card h-100 p-4 text-center rounded-3" 
                         style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', color: 'white', transition: 'all 0.3s ease' }}>
                      <i className="fas fa-user-circle mb-3" style={{ fontSize: '2.5rem' }}></i>
                      <h5 className="fw-bold mb-2">Voltar ao Perfil</h5>
                      <p className="mb-0 opacity-75">Gerenciar suas informações</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .character-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .character-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .character-card:hover .character-overlay {
          opacity: 1 !important;
        }

        .character-card:hover .character-image {
          transform: scale(1.1);
        }

        .character-image {
          transition: all 0.3s ease;
        }

        .action-button-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .action-button-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }

        .form-control {
          border: 1px solid #e9ecef;
          padding: 12px 15px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: #f8f9fa;
        }

        .form-control:focus {
          border-color: #ff6b6b;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
          background-color: #fff;
        }

        .input-group-text {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-right: none;
          border-radius: 10px 0 0 10px;
        }

        .pagination-container {
          border: 2px solid #e9ecef;
        }

        .pagination-container:hover {
          border-color: #ff6b6b;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.15);
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
          
          .character-image {
            height: 120px !important;
          }
          
          .character-name {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </>
  );
}
