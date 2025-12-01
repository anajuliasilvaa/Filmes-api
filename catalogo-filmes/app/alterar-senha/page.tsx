'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function AlterarSenhaPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.new_password !== formData.confirm_password) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.new_password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await authAPI.changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });
      setMessage('Senha alterada com sucesso!');
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => {
        router.push('/perfil');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
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
      <section className="hero-section position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center text-center text-white py-5">
            <div className="col-lg-8">
              <div className="hero-content">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="fas fa-key me-3" style={{ fontSize: '3.5rem' }}></i>
                  <h1 className="display-4 fw-bold mb-0">Alterar Senha</h1>
                </div>
                <p className="lead mb-4">Mantenha sua conta segura com uma senha forte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)', minHeight: '70vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-xl-5">
              <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-shield-alt mb-2" style={{ fontSize: '2rem' }}></i>
                    <h3 className="mb-1 fw-bold">Segurança da Conta</h3>
                    <p className="mb-0 opacity-75">Defina uma nova senha</p>
                  </div>
                </div>
                
                <div className="card-body p-5">
                  {message && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      {message}
                    </div>
                  )}
                  
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="old_password" className="form-label fw-semibold">
                        <i className="fas fa-lock me-2 text-primary"></i>Senha Atual
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="old_password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        required
                        placeholder="Digite sua senha atual"
                        style={{ borderRadius: '10px', padding: '12px 15px' }}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="new_password" className="form-label fw-semibold">
                        <i className="fas fa-key me-2 text-primary"></i>Nova Senha
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                        placeholder="Digite sua nova senha"
                        style={{ borderRadius: '10px', padding: '12px 15px' }}
                      />
                      <small className="text-muted">Mínimo de 6 caracteres</small>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirm_password" className="form-label fw-semibold">
                        <i className="fas fa-check-double me-2 text-primary"></i>Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        placeholder="Confirme sua nova senha"
                        style={{ borderRadius: '10px', padding: '12px 15px' }}
                      />
                    </div>

                    <div className="d-grid gap-3">
                      <button
                        type="submit"
                        className="btn btn-lg text-white"
                        disabled={isSubmitting}
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', padding: '12px' }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Alterando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Alterar Senha
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => router.push('/perfil')}
                        className="btn btn-outline-secondary btn-lg"
                        style={{ borderRadius: '10px', padding: '12px' }}
                      >
                        <i className="fas fa-arrow-left me-2"></i>Voltar ao Perfil
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
        .form-control {
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem !important;
          }
          
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </>
  );
}
