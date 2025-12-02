// app/diretores/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { diretoresAPI, filmesAPI } from '@/lib/api';

// --- Interfaces ---
interface FilmeInfo {
    id: number;
    titulo: string;
    poster: string | null;
    ano_publicacao: number;
    duracao: string; // Vem como string de duração
    // Adicionar outros campos conforme necessário para renderizar o filme no card
}

interface Diretor {
  id: number;
  nome: string;
  data_nascimento: string | null;
  biografia: string;
  foto: string | null;
  // A API de detalhes pode retornar uma lista de IDs ou objetos completos de filmes
  filme_set: FilmeInfo[]; 
}
// ------------------

export default function DiretorDetailPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [diretor, setDiretor] = useState<Diretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
        loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      // Chama a função GET (Detalhe) que adicionamos no api.ts
      const diretorData = await diretoresAPI.get(id);
      
      setDiretor(diretorData); 
    } catch (err: any) {
      setError('Diretor não encontrado ou erro ao carregar detalhes.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja DELETAR o diretor ${diretor?.nome}?`)) {
      try {
        await diretoresAPI.delete(id);
        // Redireciona para a lista principal após deletar
        router.push('/diretores');
      } catch (err) {
        setError('Falha ao deletar o diretor. Verifique sua permissão.');
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

  if (error || !diretor) {
      return (
          <div className="container mt-5 text-center">
              <div className="alert alert-danger">{error}</div>
              <Link href="/diretores" className="btn btn-primary">Voltar para a lista de Diretores</Link>
          </div>
      );
  }
  
  const filmeCount = diretor.filme_set?.length || 0;
  const formatDate = (dateString: string | null) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const getPluralize = (count: number, word: string) => count === 1 ? word : `${word}s`;

  return (
    <>
      {/* Hero Section - Replicando o diretor_detail.html */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '50vh', position: 'relative' }}>
          <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}></div>
          <div className="container position-relative">
              <div className="row justify-content-center align-items-center">
                  <div className="col-lg-8">
                      <h1 className="display-4 mb-3 wow fadeInUp" data-wow-delay="0.1s">
                          <i className="bi bi-person-lines-fill me-3"></i>
                          {diretor.nome}
                      </h1>
                      <p className="lead mb-4 wow fadeInUp" data-wow-delay="0.3s">
                          Diretor de Cinema
                          {diretor.data_nascimento && ` • Nascido em ${formatDate(diretor.data_nascimento)}`}
                      </p>
                      <div className="wow fadeInUp" data-wow-delay="0.5s">
                          <span className="badge bg-light text-dark me-2 mb-2 px-3 py-2" style={{ fontSize: '14px', borderRadius: '20px' }}>
                              <i className="bi bi-film me-1"></i>
                              {filmeCount} {getPluralize(filmeCount, 'filme')}
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Detalhes do Diretor */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '80vh' }}>
          <div className="container">
              <div className="row">
                  {/* Foto e Informações Principais */}
                  <div className="col-lg-4 mb-4">
                      <div className="card shadow-lg border-0 h-100 wow fadeInLeft" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                          <div className="card-body p-4 text-center">
                              {diretor.foto ? (
                                  <img 
                                      src={diretor.foto} 
                                      alt={diretor.nome} 
                                      className="img-fluid rounded shadow-sm mb-3" 
                                      style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '15px' }}
                                  />
                              ) : (
                                  <div className="d-flex align-items-center justify-content-center bg-light rounded mb-3" style={{ height: '400px', borderRadius: '15px' }}>
                                      <div className="text-muted">
                                          <i className="bi bi-person-circle" style={{ fontSize: '5rem', marginBottom: '15px', color: 'var(--bs-primary)' }}></i>
                                          <p className="mb-0">Sem foto</p>
                                      </div>
                                  </div>
                              )}
                              
                              {/* Informações Técnicas */}
                              <div className="mt-4">
                                  <div className="row text-center">
                                      {diretor.data_nascimento && (
                                          <div className="col-12 mb-3">
                                              <div className="p-3 bg-light rounded">
                                                  <i className="bi bi-calendar-event text-primary mb-2"></i>
                                                  <h6 className="mb-0">{formatDate(diretor.data_nascimento)}</h6>
                                                  <small className="text-muted">Data de Nascimento</small>
                                              </div>
                                          </div>
                                      )}
                                      <div className="col-12 mb-3">
                                          <div className="p-3 bg-light rounded">
                                              <i className="bi bi-film text-primary mb-2"></i>
                                              <h6 className="mb-0">{filmeCount}</h6>
                                              <small className="text-muted">
                                                  {getPluralize(filmeCount, 'Filme')} Dirigido{getPluralize(filmeCount, '')}
                                              </small>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Botões de Ação */}
                              <div className="mt-4">
                                  <Link href="/diretores" className="btn btn-outline-primary btn-sm mb-2" style={{ borderRadius: '20px', width: '100%' }}>
                                      <i className="bi bi-arrow-left me-1"></i>Voltar para Lista
                                  </Link>
                                  
                                  {isAdmin && (
                                      <div className="d-grid gap-2 mt-2">
                                          <Link href={`/diretores/${diretor.id}/editar`} className="btn btn-warning" style={{ borderRadius: '20px' }}>
                                              <i className="bi bi-pencil me-1"></i>Editar Diretor
                                          </Link>
                                          <button onClick={handleDelete} className="btn btn-danger" style={{ borderRadius: '20px' }}>
                                              <i className="bi bi-trash me-1"></i>Deletar Diretor
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="col-lg-8">
                      {/* Biografia */}
                      <div className="card shadow-lg border-0 mb-4 wow fadeInRight" style={{ borderRadius: '20px' }}>
                          <div className="card-header py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                              <h5 className="mb-0">
                                  <i className="bi bi-person-badge me-2"></i>Biografia
                              </h5>
                          </div>
                          <div className="card-body p-4">
                              <p className="mb-0 text-muted" style={{ lineHeight: 1.6, fontSize: '16px' }}>
                                  {diretor.biografia || <em>Biografia não disponível para este diretor.</em>}
                              </p>
                          </div>
                      </div>

                      {/* Filmes Dirigidos */}
                      <div className="card shadow-lg border-0 mb-4 wow fadeInRight" style={{ borderRadius: '20px' }}>
                          <div className="card-header py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                              <h5 className="mb-0">
                                  <i className="bi bi-film me-2"></i>Filmes Dirigidos
                                  <span className="badge bg-light text-dark ms-2">{filmeCount}</span>
                              </h5>
                          </div>
                          <div className="card-body p-4">
                              {diretor.filme_set && diretor.filme_set.length > 0 ? (
                                  <div className="row g-3">
                                      {diretor.filme_set.map((filme) => (
                                          <div key={filme.id} className="col-md-6 mb-3">
                                              <div className="filme-card p-3 border rounded shadow-sm h-100" style={{ borderRadius: '10px', transition: 'all 0.3s ease', border: '1px solid #e9ecef' }}>
                                                  <div className="d-flex align-items-center">
                                                      {filme.poster ? (
                                                          // Nota: Aqui precisaríamos da função filmesAPI.get para pegar detalhes como gêneros e duração,
                                                          // Mas por simplicidade, estamos usando os dados limitados retornados na lista/detalhes do diretor.
                                                          <img src={filme.poster} alt={filme.titulo} className="filme-mini-poster me-3" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                                      ) : (
                                                          <div className="filme-mini-poster me-3 bg-light d-flex align-items-center justify-content-center" style={{ width: '60px', height: '80px', borderRadius: '5px' }}>
                                                              <i className="bi bi-film text-muted"></i>
                                                          </div>
                                                      )}
                                                      
                                                      <div className="flex-grow-1">
                                                          <h6 className="mb-1">
                                                              <Link href={`/filmes/${filme.id}`} className="text-decoration-none text-dark">
                                                                  {filme.titulo}
                                                              </Link>
                                                          </h6>
                                                          <p className="text-muted mb-1 small">
                                                              {filme.ano_publicacao && `${filme.ano_publicacao}`}
                                                              {filme.duracao && ` • ${filme.duracao} min`}
                                                          </p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="text-center py-5">
                                      <i className="bi bi-film text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                                      <h6 className="text-muted mb-3">Nenhum filme dirigido ainda</h6>
                                      <p className="text-muted small">Este diretor ainda não possui filmes cadastrados no catálogo.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <style jsx global>{`
          .filme-card {
              transition: all 0.3s ease;
          }
          
          .filme-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
              border-color: #667eea !important;
          }
          
          .filme-card a {
              transition: color 0.3s ease;
          }
          
          .filme-card:hover a {
              color: #667eea !important;
          }
          
          .filme-mini-poster {
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .dropdown-menu {
              border: none;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
          }
      `}</style>
    </>
  );
}