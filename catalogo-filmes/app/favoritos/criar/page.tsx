// app/favoritos/criar/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { favoritosAPI } from '@/lib/api';

export default function CriarListaPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Estado para os campos do formulário
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redireciona se o usuário não estiver logado
  if (!user) {
      // Como é um Client Component, usamos o useEffect ou verificamos aqui.
      // O Next.js fará o redirecionamento se houver um wrapper de Auth,
      // mas vamos forçar a navegação para login.
      if (typeof window !== 'undefined') {
          router.push('/login');
      }
      return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome.trim()) {
      setError('O nome da lista é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      // Chama a função de API para criar a lista
      const novaLista = await favoritosAPI.create(nome.trim());
      
      setSuccess(`Lista "${novaLista.nome}" criada com sucesso!`);
      // Redireciona para os detalhes da nova lista ou para a lista principal
      router.push(`/favoritos/${novaLista.id}`);

    } catch (err: any) {
      setError(err.message || 'Falha ao criar a lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {/* Hero Section - Replicando listafavoritos_form.html */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh', position: 'relative' }}>
          <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }}></div>
          <div className="container position-relative">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      <h1 className="display-4 mb-3 wow fadeInUp" data-wow-delay="0.1s">
                          <i className="bi bi-plus-circle me-3"></i>
                          Criar Lista de Favoritos
                      </h1>
                      <p className="lead mb-4 wow fadeInUp" data-wow-delay="0.3s">
                          Organize seus filmes favoritos em uma nova coleção personalizada
                      </p>
                      <div className="wow fadeInUp" data-wow-delay="0.5s">
                          <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '14px', borderRadius: '20px' }}>
                              <i className="bi bi-tags me-2"></i>Nova Coleção
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Formulário Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '60vh' }}>
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8 col-xl-6">
                      <div className="card shadow-lg border-0 wow fadeInUp" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                          <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                              <h3 className="mb-0">
                                  <i className="bi bi-list-ul me-2"></i>
                                  Dados da Lista
                              </h3>
                          </div>
                          <div className="card-body p-5">
                              
                              {error && <div className="alert alert-danger text-center">{error}</div>}
                              {success && <div className="alert alert-success text-center">{success}</div>}

                              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                                  
                                  {/* Nome da Lista */}
                                  <div className="mb-4">
                                      <label htmlFor="nome-lista" className="form-label fw-bold text-muted">
                                          <i className="bi bi-tag me-2"></i>Nome
                                      </label>
                                      <div className="input-group">
                                          <span className="input-group-text" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                                              <i className="bi bi-heart-fill"></i>
                                          </span>
                                          <input
                                            id="nome-lista"
                                            type="text"
                                            className={`form-control ${error && !nome.trim() ? 'is-invalid' : ''}`}
                                            placeholder="Ex: Melhores de 2024"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                          />
                                      </div>
                                      <small className="text-muted">
                                          <i className="bi bi-info-circle me-1"></i>Nome da lista (ex: 'Meus Favoritos', 'Melhores de 2024')
                                      </small>
                                      {error && !nome.trim() && <div className="text-danger mt-2"><small><i className="bi bi-exclamation-triangle me-1"></i>O nome é obrigatório.</small></div>}
                                  </div>
                                  
                                  {/* Seleção de Filmes (Simplificado) */}
                                  <div className="mb-4">
                                      <label htmlFor="filmes-select" className="form-label fw-bold text-muted">
                                          <i className="bi bi-film me-2"></i>Filmes
                                      </label>
                                      <div className="filmes-selection">
                                          <div className="selection-header">
                                              <small className="text-muted">
                                                  <i className="bi bi-info-circle me-1"></i>Os filmes serão adicionados na página de detalhes da lista.
                                              </small>
                                          </div>
                                          <div className="filmes-container">
                                              {/* A seleção complexa de M2M com a API é mais eficiente em um componente separado */}
                                              <select id="filmes-select" multiple className="form-control" disabled>
                                                  <option>Nenhum filme disponível para seleção inicial via API.</option>
                                              </select>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Informações adicionais */}
                                  <div className="info-box mb-4">
                                      <div className="row">
                                          <div className="col-md-6">
                                              <div className="info-item">
                                                  <i className="bi bi-person-fill text-primary"></i>
                                                  <div>
                                                      <strong>Criador</strong>
                                                      <p className="text-muted mb-0">{user.username}</p>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="col-md-6">
                                              <div className="info-item">
                                                  <i className="bi bi-film text-primary"></i>
                                                  <div>
                                                      <strong>Filmes</strong>
                                                      <p className="text-muted mb-0">Adicione depois</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Dicas */}
                                  <div className="tips-box mb-4">
                                      <h6 className="tips-title">
                                          <i className="bi bi-lightbulb-fill me-2"></i>Dicas para criar sua lista:
                                      </h6>
                                      <ul className="tips-list">
                                          <li><strong>Nome:</strong> Use nomes descritivos como "Melhores de 2024" ou "Clássicos Imperdíveis"</li>
                                          <li><strong>Organização:</strong> Agrupe por gênero: "Filmes de Ação Favoritos"</li>
                                      </ul>
                                  </div>

                                  {/* Botões */}
                                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                      <Link href="/favoritos" className="btn btn-outline-secondary btn-lg me-md-2" style={{ borderRadius: '25px' }}>
                                          <i className="bi bi-x-circle me-2"></i>Cancelar
                                      </Link>
                                      <button type="submit" className="btn btn-success btn-lg" disabled={loading} style={{ borderRadius: '25px', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}>
                                          {loading ? (
                                            <>
                                                <i className="bi bi-arrow-clockwise spin me-2"></i>Criando...
                                            </>
                                          ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>Criar Lista
                                            </>
                                          )}
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Estilos Replicados do Template */}
      <style jsx global>{`
          .hero-section {
              border-radius: 0 0 50px 50px;
          }
          .section-title {
              color: #667eea;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 2px;
          }
          .form-control {
              border: 2px solid #e9ecef;
              border-radius: 0 10px 10px 0;
              padding: 12px 15px;
              font-size: 16px;
          }
          .input-group-text {
              border: 2px solid #e9ecef;
              border-right: none;
              border-radius: 10px 0 0 10px;
              width: 50px;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
          }
          .filmes-selection {
              border: 2px solid #e9ecef;
              border-radius: 15px;
              padding: 15px;
          }
          .selection-header {
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e9ecef;
          }
          .filmes-container select {
              width: 100%;
              min-height: 200px;
              border: 1px solid #dee2e6;
              border-radius: 10px;
              padding: 10px;
              font-size: 14px;
          }
          .info-box {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 15px;
              padding: 20px;
          }
          .info-item {
              display: flex;
              align-items: center;
              gap: 12px;
          }
          .info-item i {
              font-size: 1.2rem;
              color: var(--bs-primary);
          }
          .tips-box {
              background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
              border-radius: 15px;
              padding: 20px;
              border: 1px solid #bbdefb;
          }
          .tips-title {
              color: #667eea;
              font-weight: 600;
          }
          .tips-list {
              padding-left: 20px;
          }
          .btn {
              padding: 12px 25px;
              font-weight: 500;
              border-radius: 25px;
          }
          .btn-outline-secondary {
              border-color: #6c757d;
              color: #6c757d;
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
      `}</style>
    </>
  );
}