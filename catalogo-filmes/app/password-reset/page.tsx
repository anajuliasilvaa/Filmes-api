'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function PasswordResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      await authAPI.requestPasswordReset(email);
      setMessage('Instruções de redefinição de senha foram enviadas para seu email!');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Erro ao solicitar redefinição de senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center text-center text-white py-5">
            <div className="col-lg-8">
              <div className="hero-content">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="fas fa-envelope me-3" style={{ fontSize: '3.5rem' }}></i>
                  <h1 className="display-4 fw-bold mb-0">Redefinir Senha</h1>
                </div>
                <p className="lead mb-4">Recupere o acesso à sua conta</p>
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
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-lock-open mb-2" style={{ fontSize: '2rem' }}></i>
                    <h3 className="mb-1 fw-bold">Recuperação de Senha</h3>
                    <p className="mb-0 opacity-75">Enviaremos instruções por email</p>
                  </div>
                </div>
                
                <div className="card-body p-5">
                  {message && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      <div>
                        {message}
                        <div className="mt-2">
                          <Link href="/login" className="btn btn-sm btn-success">
                            <i className="fas fa-sign-in-alt me-1"></i>Ir para Login
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  {!message && (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-muted">
                          Digite seu email cadastrado e enviaremos instruções para redefinir sua senha.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label fw-semibold">
                            <i className="fas fa-envelope me-2 text-info"></i>Email
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                            style={{ borderRadius: '10px', padding: '12px 15px' }}
                          />
                        </div>

                        <div className="d-grid gap-3">
                          <button
                            type="submit"
                            className="btn btn-lg text-white"
                            disabled={isSubmitting}
                            style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)', borderRadius: '10px', padding: '12px' }}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane me-2"></i>Enviar Instruções
                              </>
                            )}
                          </button>
                          
                          <Link href="/login" className="btn btn-outline-secondary btn-lg" style={{ borderRadius: '10px', padding: '12px' }}>
                            <i className="fas fa-arrow-left me-2"></i>Voltar ao Login
                          </Link>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Help */}
              <div className="text-center mt-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="fas fa-question-circle text-info me-2"></i>Precisa de ajuda?
                    </h6>
                    <p className="text-muted mb-3">
                      Se você não receber o email em alguns minutos, verifique sua pasta de spam.
                    </p>
                    <Link href="/perfil" className="btn btn-sm btn-outline-info">
                      <i className="fas fa-user me-1"></i>Ir para Perfil
                    </Link>
                  </div>
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
          border-color: #17a2b8;
          box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25);
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .card {
          transition: all 0.3s ease;
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
