'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { diretoresAPI } from '@/lib/api';

// --- Interfaces (Baseado no seu models.py) ---
interface FilmeInfo {
    id: number;
    titulo: string;
}

interface Diretor {
  id: number;
  nome: string;
  data_nascimento: string | null;
  biografia: string;
  foto: string | null;
  filmes?: FilmeInfo[]; // Propriedade opcional se for carregada junto
}
// ---------------------------------------------


export default function DiretoresPage() {
  const { isAdmin } = useAuth(); 
  const [diretores, setDiretores] = useState<Diretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      // Chama a função de API de listagem de diretores
      const diretoresData = await diretoresAPI.list();
      
      // Assumindo que a API retorna um array ou um objeto com 'results'
      setDiretores(diretoresData.results || diretoresData); 
    } catch (err: any) {
      setError('Erro ao carregar a lista de diretores. Verifique a conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja DELETAR este diretor? Esta ação é irreversível.')) {
      try {
        await diretoresAPI.delete(id);
        // Recarrega a lista após a exclusão
        await loadData();
      } catch (err) {
        setError('Falha ao deletar o diretor. Verifique sua permissão de Administrador.');
      }
    }
  };
  
  const formatDate = (dateString: string | null) => {
      if (!dateString) return 'N/A';
      try {
          // Converte YYYY-MM-DD para o formato local DD/MM/YYYY
          return new Date(dateString).toLocaleDateString('pt-BR');
      } catch (e) {
          return dateString; // Retorna a string original se houver erro
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

  return (
    <>
      {/* Hero Section - Replicando o diretor_list.html */}
      <div className="container-fluid hero-section d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh' }}>
        <div className="container">
          <div className="row g-5 py-5">
            <div className="col-12 text-center">
              <h1 className="display-2 text-white mb-4">Diretores de Cinema</h1>
              <p className="lead text-white mb-4">Conheça os talentos por trás dos grandes filmes</p>
              <i className="bi bi-camera-reels animate-up-down text-white" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls - Replicando o diretor_list.html */}
      {isAdmin && (
        <div className="container mt-4">
          <div className="admin-controls text-center wow fadeIn" data-wow-delay="0.1s">
            <h6 className="section-title mb-3">Gerenciar Diretores</h6>
            <Link href="/diretores/adicionar" className="btn btn-success btn-sm me-2">
              <i className="bi bi-person-plus me-1"></i>Novo Diretor
            </Link>
            <Link href="/" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i>Voltar ao Catálogo
            </Link>
          </div>
        </div>
      )}
      
      {/* Directors Section Start */}
      <div className="container-fluid p-5 bg-light">
        <div className="mb-5 text-center wow fadeIn" data-wow-delay="0.1s">
            <h5 className="section-title">Nossos Talentos</h5>
            <h1 className="display-4 mb-0">Diretores Cadastrados</h1>
        </div>
        
        {error && (
            <div className="alert alert-danger text-center">{error}</div>
        )}

        {diretores && diretores.length > 0 ? (
            <div className="row g-4">
                {diretores.map((diretor) => (
                    <div key={diretor.id} className="col-lg-3 col-md-6 wow fadeIn" data-wow-delay={`0.${diretor.id % 4 + 1}s`}>
                        <div className="director-card-full">
                            <div className="director-image-container">
                                {diretor.foto ? (
                                    // Assumindo que o endpoint API retorna a URL completa da foto
                                    <img src={diretor.foto} alt={diretor.nome} className="director-image" />
                                ) : (
                                    <div className="director-image director-placeholder">
                                        <i className="bi bi-person-circle text-primary" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                )}
                                
                                <div className="director-overlay">
                                    <div className="director-actions">
                                        <Link href={`/diretores/${diretor.id}`} className="btn btn-primary btn-sm">
                                            <i className="bi bi-info-circle me-1"></i>Perfil
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="director-info">
                                <h5 className="director-name">{diretor.nome}</h5>
                                
                                {diretor.data_nascimento && (
                                    <p className="director-birth">
                                        <i className="bi bi-calendar-event text-muted me-1"></i>
                                        {formatDate(diretor.data_nascimento)}
                                    </p>
                                )}
                                
                                <p className="director-bio">
                                    {diretor.biografia ? 
                                        diretor.biografia.substring(0, 100) + (diretor.biografia.length > 100 ? '...' : '')
                                        : <span className="text-muted"><i className="bi bi-person-badge"></i> Biografia não disponível</span>
                                    }
                                </p>
                                
                                {/* Contagem de filmes (A API deve retornar count ou filmes []) */}
                                <div className="director-films-count">
                                    <small className="text-muted">
                                        <i className="bi bi-film me-1"></i>
                                        {diretor.filmes ? diretor.filmes.length : '0'} filme(s)
                                    </small>
                                </div>

                                {/* Controles de Admin na listagem */}
                                {isAdmin && (
                                    <div className="mt-2 d-flex justify-content-end gap-2">
                                        <Link href={`/diretores/${diretor.id}/editar`} className="btn btn-outline-warning btn-sm">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(diretor.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-5">
                <div className="empty-state">
                    <i className="bi bi-person-x text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                    <h3 className="text-muted mb-3">Nenhum diretor cadastrado</h3>
                    <p className="text-muted mb-4">Comece adicionando diretores ao catálogo</p>
                    {isAdmin && (
                        <Link href="/diretores/adicionar" className="btn btn-primary">
                            <i className="bi bi-person-plus me-2"></i>Adicionar Primeiro Diretor
                        </Link>
                    )}
                </div>
            </div>
        )}
      </div>
      {/* Directors Section End */}
      
      {/* O estilo replicado dos templates Django (diretor_list.html) vai aqui */}
      <style jsx global>{`
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

        .director-card-full {
            background: #fff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .director-card-full:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .director-image-container {
            position: relative;
            height: 250px;
            overflow: hidden;
        }

        .director-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .director-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .director-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(74, 144, 226, 0.9) 0%, rgba(80, 101, 166, 0.9) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .director-card-full:hover .director-overlay {
            opacity: 1;
        }

        .director-card-full:hover .director-image {
            transform: scale(1.1);
        }

        .director-actions .btn {
            border-radius: 25px;
            padding: 8px 20px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 2px solid #fff;
            background: transparent;
            color: #fff;
            transition: all 0.3s ease;
        }

        .director-actions .btn:hover {
            background: #fff;
            color: #4a90e2;
            transform: scale(1.05);
        }

        .director-info {
            padding: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .director-name {
            color: #2c3e50;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }

        .director-birth {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 12px;
        }

        .director-bio {
            color: #5a6c7d;
            line-height: 1.6;
            margin-bottom: 15px;
            flex-grow: 1;
            font-size: 0.9rem;
        }

        .director-films-count {
            border-top: 1px solid #eee;
            padding-top: 12px;
            margin-top: auto;
        }
        
        .empty-state {
            background: #fff;
            border-radius: 15px;
            padding: 60px 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: 0 auto;
        }

        .empty-state .btn {
            border-radius: 25px;
            padding: 12px 30px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: linear-gradient(135deg, #4a90e2 0%, #5065a6 100%);
            border: none;
            transition: all 0.3s ease;
        }

        .empty-state .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(74, 144, 226, 0.4);
        }
      `}</style>
    </>
  );
}