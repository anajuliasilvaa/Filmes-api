'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { filmesAPI, generosAPI, diretoresAPI } from '@/lib/api';

interface Genero {
  id: number;
  nome: string;
}

interface Diretor {
  id: number;
  nome: string;
}

export default function AdicionarFilmePage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    ano_publicacao: '',
    sinopse: '',
    duracao: '',
    poster: null as File | null,
    generos: [] as number[],
    diretores: [] as number[]
  });
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [diretores, setDiretores] = useState<Diretor[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterFileName, setPosterFileName] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!authLoading && !isAdmin) {
      router.push('/filmes');
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [generosData, diretoresData] = await Promise.all([
        generosAPI.list(),
        diretoresAPI.list()
      ]);
      setGeneros(generosData.results || generosData);
      setDiretores(diretoresData.results || diretoresData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, poster: file }));
      setPosterFileName(file.name);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const numValue = Number(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name as 'generos' | 'diretores'], numValue]
        : prev[name as 'generos' | 'diretores'].filter(id => id !== numValue)
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: number[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(Number(options[i].value));
      }
    }
    setFormData(prev => ({ ...prev, diretores: selected }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }
    
    if (!formData.ano_publicacao) {
      newErrors.ano_publicacao = 'Ano de publicação é obrigatório';
    }
    
    if (formData.generos.length === 0) {
      newErrors.generos = 'Selecione pelo menos um gênero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append('titulo', formData.titulo);
      submitData.append('ano_publicacao', formData.ano_publicacao);
      submitData.append('sinopse', formData.sinopse);
      submitData.append('duracao', formData.duracao);
      
      if (formData.poster) {
        submitData.append('poster', formData.poster);
      }
      
      formData.generos.forEach(id => {
        submitData.append('generos_ids', id.toString());
      });
      
      formData.diretores.forEach(id => {
        submitData.append('diretores_ids', id.toString());
      });

      await filmesAPI.create(submitData);
      window.location.href = '/filmes';
    } catch (error: any) {
      console.error('Erro ao criar filme:', error);
      setErrors({ general: 'Erro ao criar filme. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
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
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh', position: 'relative' }}>
        <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }}></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 mb-3">
                <i className="fas fa-plus-circle me-3"></i>
                Adicionar Filme
              </h1>
              <p className="lead mb-4">
                Adicione um novo filme ao catálogo cinematográfico
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '60vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <h3 className="mb-0">
                    <i className="fas fa-film me-2"></i>
                    Dados do Filme
                  </h3>
                </div>
                <div className="card-body p-5">
                  {errors.general && (
                    <div className="alert alert-danger">{errors.general}</div>
                  )}

                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      {/* Título */}
                      <div className="col-md-8 mb-4">
                        <label htmlFor="titulo" className="form-label fw-bold text-muted">
                          <i className="fas fa-film me-2"></i>Título
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                            <i className="fas fa-film"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleInputChange}
                            placeholder="Digite o título do filme"
                            required
                          />
                        </div>
                        {errors.titulo && (
                          <div className="text-danger mt-2">
                            <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.titulo}</small>
                          </div>
                        )}
                      </div>

                      {/* Ano de Publicação */}
                      <div className="col-md-4 mb-4">
                        <label htmlFor="ano_publicacao" className="form-label fw-bold text-muted">
                          <i className="fas fa-calendar me-2"></i>Ano
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                            <i className="fas fa-calendar"></i>
                          </span>
                          <input
                            type="number"
                            className={`form-control ${errors.ano_publicacao ? 'is-invalid' : ''}`}
                            id="ano_publicacao"
                            name="ano_publicacao"
                            value={formData.ano_publicacao}
                            onChange={handleInputChange}
                            placeholder="2024"
                            required
                          />
                        </div>
                        {errors.ano_publicacao && (
                          <div className="text-danger mt-2">
                            <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.ano_publicacao}</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sinopse */}
                    <div className="mb-4">
                      <label htmlFor="sinopse" className="form-label fw-bold text-muted">
                        <i className="fas fa-align-left me-2"></i>Sinopse
                      </label>
                      <textarea
                        className="form-control"
                        id="sinopse"
                        name="sinopse"
                        value={formData.sinopse}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Digite a sinopse do filme"
                      ></textarea>
                    </div>

                    <div className="row">
                      {/* Duração */}
                      <div className="col-md-4 mb-4">
                        <label htmlFor="duracao" className="form-label fw-bold text-muted">
                          <i className="fas fa-clock me-2"></i>Duração (min)
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                            <i className="fas fa-clock"></i>
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            id="duracao"
                            name="duracao"
                            value={formData.duracao}
                            onChange={handleInputChange}
                            placeholder="120"
                          />
                          <span className="input-group-text" style={{ background: '#f8f9fa', border: '2px solid #e9ecef', borderLeft: 'none' }}>min</span>
                        </div>
                      </div>

                      {/* Poster */}
                      <div className="col-md-8 mb-4">
                        <label className="form-label fw-bold text-muted">
                          <i className="fas fa-image me-2"></i>Poster
                        </label>
                        <div className="upload-area" onClick={() => document.getElementById('poster')?.click()} style={{ border: '2px dashed #e9ecef', borderRadius: '10px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8f9fa', transition: 'all 0.3s ease' }}>
                          <div className="upload-content">
                            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                            <h6 className="mb-2">Adicionar Poster</h6>
                            <p className="text-muted mb-0">Clique aqui ou arraste uma imagem</p>
                            <small className="text-muted">Formatos aceitos: JPG, PNG, GIF</small>
                          </div>
                        </div>
                        <input
                          type="file"
                          id="poster"
                          name="poster"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        {posterFileName && (
                          <div className="mt-2 text-center">
                            <span className="badge bg-success px-3 py-2" style={{ borderRadius: '20px' }}>
                              <i className="fas fa-check me-1"></i>
                              {posterFileName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gêneros */}
                    <div className="mb-4">
                      <label className="form-label fw-bold text-muted">
                        <i className="fas fa-tags me-2"></i>Gêneros
                      </label>
                      <div className="card border-0 shadow-sm p-3" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
                        <div className="row">
                          {generos.map((genero) => (
                            <div key={genero.id} className="col-md-4 col-sm-6 mb-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="generos"
                                  value={genero.id}
                                  id={`genero-${genero.id}`}
                                  checked={formData.generos.includes(genero.id)}
                                  onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label fw-normal" htmlFor={`genero-${genero.id}`}>
                                  {genero.nome}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {errors.generos && (
                        <div className="text-danger mt-2">
                          <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.generos}</small>
                        </div>
                      )}
                    </div>

                    {/* Diretores */}
                    <div className="mb-4">
                      <label htmlFor="diretores" className="form-label fw-bold text-muted">
                        <i className="fas fa-user-tie me-2"></i>Diretores
                      </label>
                      <select
                        className="form-select"
                        id="diretores"
                        name="diretores"
                        multiple
                        value={formData.diretores.map(String)}
                        onChange={handleSelectChange}
                        style={{ minHeight: '120px' }}
                      >
                        {diretores.map((diretor) => (
                          <option key={diretor.id} value={diretor.id}>
                            {diretor.nome}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Segure Ctrl (ou Cmd) para selecionar múltiplos diretores</small>
                    </div>

                    {/* Botões de Ação */}
                    <div className="d-flex justify-content-between align-items-center mt-5">
                      <Link href="/filmes" className="btn btn-outline-secondary btn-lg px-4 py-2" style={{ borderRadius: '25px' }}>
                        <i className="fas fa-arrow-left me-2"></i>Voltar ao Catálogo
                      </Link>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-lg px-5 py-2"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '25px', color: 'white' }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Adicionar Filme
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

      <style jsx>{`
        .form-control, .form-select {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 12px 15px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          background: white;
        }

        textarea.form-control {
          resize: vertical;
        }

        .input-group-text {
          border: none;
          border-radius: 10px 0 0 10px;
          padding: 12px 15px;
        }

        .input-group > .form-control:not(:first-child) {
          border-radius: 0 10px 10px 0;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f0f2ff;
          transform: translateY(-2px);
        }

        .form-check-input {
          width: 1.25rem;
          height: 1.25rem;
          margin-top: 0.125rem;
          border: 2px solid #667eea;
          border-radius: 4px;
        }

        .form-check-input:checked {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 30vh;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .card-body {
            padding: 2rem;
          }
        }
      `}</style>
    </>
  );
}
