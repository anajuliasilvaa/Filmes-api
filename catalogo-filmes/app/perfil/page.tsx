'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export default function PerfilPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setEmail(user.email);
    }
  }, [isAuthenticated, loading, router, user]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');

    try {
      await authAPI.updateProfile({ email });
      setMessage('Email atualizado com sucesso!');
    } catch (error: any) {
      setMessage(error.message || 'Erro ao atualizar email');
    } finally {
      setIsUpdating(false);
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
                  <i className="fas fa-user-circle me-3" style={{ fontSize: '3.5rem' }}></i>
                  <h1 className="display-4 fw-bold mb-0">Meu Perfil</h1>
                </div>
                <p className="lead mb-4">Gerencie suas informações e personalize sua experiência</p>
                <div className="d-inline-flex align-items-center bg-white bg-opacity-20 px-4 py-2 rounded-pill">
                  <span className="text-dark">Painel de Controle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              {/* Profile Information Card */}
              <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-user-circle mb-2" style={{ fontSize: '2rem' }}></i>
                    <h3 className="mb-1 fw-bold">Informações Pessoais</h3>
                    <p className="mb-0 opacity-75">Dados da sua conta</p>
                  </div>
                </div>
                
                <div className="card-body p-5">
                  <div className="row align-items-center">
                    {/* Avatar Section */}
                    <div className="col-lg-4 text-center mb-4 mb-lg-0">
                      <div className="avatar-container position-relative d-inline-block">
                        {user.profile?.avatar_url ? (
                          <img 
                            src={user.profile.avatar_url} 
                            alt={user.profile.avatar_name || 'Avatar'} 
                            className="avatar-image rounded-circle shadow-lg" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #667eea' }}
                          />
                        ) : (
                          <div 
                            className="avatar-placeholder rounded-circle shadow-lg d-flex align-items-center justify-content-center" 
                            style={{ width: '150px', height: '150px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '4px solid #ddd' }}
                          >
                            <i className="fas fa-user" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <h6 className="fw-bold text-dark mb-1">
                          {user.profile?.avatar_name || 'Sem Avatar'}
                        </h6>
                        <small className="text-muted">Avatar Disney</small>
                        <div className="mt-2">
                          <Link href="/escolher-avatar" className="btn btn-sm btn-outline-primary" style={{ borderRadius: '20px' }}>
                            <i className="fas fa-palette me-1"></i>Trocar Avatar
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Information */}
                    <div className="col-lg-8">
                      {/* Username */}
                      <div className="info-item d-flex align-items-center mb-3 p-3 bg-light rounded-3">
                        <div 
                          className="icon-circle me-3 d-flex align-items-center justify-content-center" 
                          style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%' }}
                        >
                          <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <label className="form-label fw-semibold text-muted mb-0">Nome de Usuário</label>
                          <p className="fw-bold text-dark mb-0">{user.username}</p>
                        </div>
                      </div>
                      
                      {/* Email Form */}
                      <div className="info-item mb-3 p-3 bg-light rounded-3">
                        <div className="d-flex align-items-start">
                          <div 
                            className="icon-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0" 
                            style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%' }}
                          >
                            <i className="fas fa-envelope text-white"></i>
                          </div>
                          <div className="flex-grow-1">
                            <form onSubmit={handleEmailUpdate} className="email-form">
                              <label htmlFor="email" className="form-label fw-semibold text-muted mb-2">Email</label>
                              <div className="input-group">
                                <input 
                                  type="email" 
                                  name="email" 
                                  id="email" 
                                  className="form-control" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Digite seu email" 
                                  required 
                                />
                                <button 
                                  type="submit" 
                                  className="btn text-white" 
                                  disabled={isUpdating}
                                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                                >
                                  <i className="fas fa-save me-1"></i>
                                  {isUpdating ? 'Salvando...' : 'Atualizar'}
                                </button>
                              </div>
                              {message && (
                                <small className={message.includes('sucesso') ? 'text-success' : 'text-danger'}>
                                  {message}
                                </small>
                              )}
                            </form>
                          </div>
                        </div>
                      </div>
                      
                      {/* Admin Badge */}
                      {(user.is_staff || user.is_superuser) && (
                        <div className="info-item d-flex align-items-center mb-3 p-3 bg-warning bg-opacity-10 rounded-3">
                          <div 
                            className="icon-circle me-3 d-flex align-items-center justify-content-center" 
                            style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)', borderRadius: '50%' }}
                          >
                            <i className="fas fa-crown text-white"></i>
                          </div>
                          <div>
                            <label className="form-label fw-semibold text-muted mb-0">Tipo de Conta</label>
                            <p className="fw-bold text-dark mb-0">Administrador</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Actions Card */}
              <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-shield-alt mb-2" style={{ fontSize: '2rem' }}></i>
                    <h3 className="mb-1 fw-bold">Segurança da Conta</h3>
                    <p className="mb-0 opacity-75">Proteja suas informações</p>
                  </div>
                </div>
                
                <div className="card-body p-5">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <a href="/alterar-senha" className="text-decoration-none">
                        <div className="security-card d-flex align-items-center p-4 bg-light rounded-3 hover-card" style={{ transition: 'all 0.3s ease' }}>
                          <div 
                            className="icon-circle me-4 d-flex align-items-center justify-content-center" 
                            style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%' }}
                          >
                            <i className="fas fa-key text-white" style={{ fontSize: '1.5rem' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">Alterar Senha</h6>
                            <p className="text-muted mb-0 small">Defina uma nova senha segura para sua conta</p>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="col-md-6">
                      <a href="/password-reset" className="text-decoration-none">
                        <div className="security-card d-flex align-items-center p-4 bg-light rounded-3 hover-card" style={{ transition: 'all 0.3s ease' }}>
                          <div 
                            className="icon-circle me-4 d-flex align-items-center justify-content-center" 
                            style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)', borderRadius: '50%' }}
                          >
                            <i className="fas fa-envelope text-white" style={{ fontSize: '1.5rem' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">Redefinir por Email</h6>
                            <p className="text-muted mb-0 small">Receba instruções de recuperação via email</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hover-card:hover {
          background-color: #e9ecef !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .avatar-image {
          transition: all 0.3s ease;
        }

        .avatar-image:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
        }

        .form-control {
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 12px 15px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: #fff;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          background-color: #fff;
        }

        .input-group .form-control {
          border-radius: 10px 0 0 10px;
          border-right: none;
        }

        .input-group .btn {
          border-radius: 0 10px 10px 0;
          border-left: none;
        }

        .info-item {
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background-color: #e9ecef !important;
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
          
          .card-body {
            padding: 2rem !important;
          }
          
          .avatar-image, .avatar-placeholder {
            width: 120px !important;
            height: 120px !important;
          }
          
          .icon-circle {
            width: 35px !important;
            height: 35px !important;
          }
          
          .security-card {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          .security-card .icon-circle {
            margin-bottom: 1rem !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
