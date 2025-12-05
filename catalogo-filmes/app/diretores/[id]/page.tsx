'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { diretoresAPI } from '@/lib/api';

interface FilmeInfo {
  id: number;
  titulo: string;
  ano_lancamento?: number;
  poster?: string;
}

interface Diretor {
  id: number;
  nome: string;
  data_nascimento: string | null;
  biografia: string;
  foto: string | null;
  filmes?: FilmeInfo[];
}

function DiretorDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const id = Number(params.id);
  
  const [diretor, setDiretor] = useState<Diretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDiretor();
  }, [id]);

  const loadDiretor = async () => {
    try {
      setLoading(true);
      const data = await diretoresAPI.get(id);
      setDiretor(data);
    } catch (err: any) {
      setError('Erro ao carregar diretor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar este diretor?')) {
      try {
        await diretoresAPI.delete(id);
        router.push('/diretores');
      } catch (err) {
        setError('Erro ao deletar diretor');
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error || !diretor) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Diretor não encontrado'}</div>
        <Link href="/diretores" className="btn btn-secondary">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-4">
          <div className="card shadow">
            {diretor.foto ? (
              <img src={diretor.foto} alt={diretor.nome} className="card-img-top" style={{ height: '400px', objectFit: 'cover' }} />
            ) : (
              <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <i className="bi bi-person-circle text-muted" style={{ fontSize: '8rem' }}></i>
              </div>
            )}
            <div className="card-body">
              <h3 className="card-title">{diretor.nome}</h3>
              {diretor.data_nascimento && (
                <p className="text-muted">
                  <i className="bi bi-calendar-event me-2"></i>
                  {formatDate(diretor.data_nascimento)}
                </p>
              )}
              
              {isAdmin && (
                <div className="d-flex gap-2 mt-3">
                  <Link href={`/diretores/${diretor.id}/editar`} className="btn btn-warning btn-sm flex-fill">
                    <i className="bi bi-pencil me-1"></i>Editar
                  </Link>
                  <button onClick={handleDelete} className="btn btn-danger btn-sm flex-fill">
                    <i className="bi bi-trash me-1"></i>Deletar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Biografia</h4>
            </div>
            <div className="card-body">
              <p className="lead">{diretor.biografia || 'Biografia não disponível'}</p>
            </div>
          </div>

          <div className="card shadow">
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">Filmes Dirigidos</h4>
            </div>
            <div className="card-body">
              {diretor.filmes && diretor.filmes.length > 0 ? (
                <div className="row g-3">
                  {diretor.filmes.map((filme) => (
                    <div key={filme.id} className="col-md-6">
                      <Link href={`/filmes/${filme.id}`} className="text-decoration-none">
                        <div className="card h-100 hover-shadow">
                          {filme.poster && (
                            <img src={filme.poster} alt={filme.titulo} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                          )}
                          <div className="card-body">
                            <h6 className="card-title">{filme.titulo}</h6>
                            {filme.ano_lancamento && (
                              <small className="text-muted">{filme.ano_lancamento}</small>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">
                  <i className="bi bi-film me-2"></i>
                  Nenhum filme cadastrado para este diretor
                </p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <Link href="/diretores" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Voltar para Diretores
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

export default DiretorDetalhePage;
