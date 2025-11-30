'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const router = useRouter();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    const newErrors: { username?: string; password?: string } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Usuário é obrigatório';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Aqui você faria a chamada para sua API de login
      console.log('Dados do login:', formData);
      
      // Simulando login bem-sucedido
      // await loginAPI(formData);
      
      // Redirecionar para a página inicial
      router.push('/');
    } catch (error) {
      setErrors({ general: 'Erro ao fazer login. Verifique suas credenciais.' });
    }
  };

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
                  <h1 className="display-4 fw-bold mb-0">Entrar</h1>
                </div>
                <p className="lead mb-4">Acesse sua conta e explore o mundo do cinema</p>
                <div className="d-inline-flex align-items-center bg-white bg-opacity-20 px-4 py-2 rounded-pill">
                  <span className="text-dark">Portal Cinematográfico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
          <div className="position-absolute" style={{ top: '20%', left: '10%', animation: 'float 6s ease-in-out infinite' }}>
            <i className="fas fa-video" style={{ fontSize: '2rem' }}></i>
          </div>
          <div className="position-absolute" style={{ top: '60%', right: '15%', animation: 'float 8s ease-in-out infinite 2s' }}>
            <i className="fas fa-star" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <div className="position-absolute" style={{ top: '40%', left: '80%', animation: 'float 7s ease-in-out infinite 4s' }}>
            <i className="fas fa-ticket-alt" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div className="position-absolute" style={{ top: '70%', left: '20%', animation: 'float 9s ease-in-out infinite 6s' }}>
            <i className="fas fa-popcorn" style={{ fontSize: '1.8rem' }}></i>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-xl-5">
              {/* Login Card */}
              <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                {/* Card Header */}
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-sign-in-alt mb-2" style={{ fontSize: '2rem' }}></i>
                    <h3 className="mb-1 fw-bold">Fazer Login</h3>
                    <p className="mb-0 opacity-75">Entre com suas credenciais</p>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="card-body p-5">
                  {/* Error Messages */}
                  {errors.general && (
                    <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ borderRadius: '15px', borderLeft: '4px solid #dc3545' }}>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-circle me-3" style={{ fontSize: '1.2rem' }}></i>
                        <div>
                          <h6 className="fw-bold mb-1">Erro de Autenticação</h6>
                          <p className="mb-0">{errors.general}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Login Form */}
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Username Field */}
                    <div className="mb-4">
                      <label htmlFor="username" className="form-label fw-semibold text-dark">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Usuário
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border-0 bg-light">
                          <i className="fas fa-user text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          id="username"
                          name="username"
                          placeholder="Digite seu usuário"
                          required
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.username && (
                        <div className="text-danger mt-1">
                          <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.username}</small>
                        </div>
                      )}
                    </div>
                    
                    {/* Password Field */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold text-dark">
                        <i className="fas fa-lock me-2 text-primary"></i>
                        Senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border-0 bg-light">
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          placeholder="Digite sua senha"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-0 bg-light"
                          onClick={togglePassword}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {errors.password && (
                        <div className="text-danger mt-1">
                          <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.password}</small>
                        </div>
                      )}
                    </div>
                    
                    {/* Submit Button */}
                    <div className="d-grid mb-4">
                      <button
                        type="submit"
                        className="btn btn-lg py-3 fw-bold text-white"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '15px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Entrar na Plataforma
                      </button>
                    </div>
                  </form>
                  
                  {/* Additional Options */}
                  <div className="text-center pt-3 border-top">
                    <div className="row g-3">
                      <div className="col-12">
                        <Link href="/register" className="text-decoration-none">
                          <div className="d-flex align-items-center justify-content-center p-3 bg-light rounded-3 hover-card">
                            <i className="fas fa-user-plus me-3 text-success" style={{ fontSize: '1.2rem' }}></i>
                            <div className="text-start">
                              <h6 className="mb-0 fw-bold text-dark">Não tem conta?</h6>
                              <small className="text-muted">Cadastre-se aqui</small>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-12">
                        <Link href="/password-reset" className="text-decoration-none">
                          <div className="d-flex align-items-center justify-content-center p-3 bg-light rounded-3 hover-card">
                            <i className="fas fa-key me-3 text-warning" style={{ fontSize: '1.2rem' }}></i>
                            <div className="text-start">
                              <h6 className="mb-0 fw-bold text-dark">Esqueceu a senha?</h6>
                              <small className="text-muted">Recuperar acesso</small>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="text-center mt-4">
                <div className="row g-3">
                  <div className="col-4">
                    <div className="text-muted">
                      <i className="fas fa-film d-block mb-1" style={{ fontSize: '1.5rem' }}></i>
                      <small>Catálogo</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-muted">
                      <i className="fas fa-star d-block mb-1" style={{ fontSize: '1.5rem' }}></i>
                      <small>Avaliações</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-muted">
                      <i className="fas fa-heart d-block mb-1" style={{ fontSize: '1.5rem' }}></i>
                      <small>Favoritos</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .hover-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hover-card:hover {
          background-color: #e9ecef !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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

        .input-group-text {
          border-radius: 10px 0 0 10px;
          border: 1px solid #e9ecef;
          border-right: none;
        }

        .input-group .form-control {
          border-radius: 0;
          border-left: none;
        }

        .input-group .btn {
          border-radius: 0 10px 10px 0;
          border-left: none;
        }

        /* Responsividade para dispositivos móveis */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 50vh !important;
          }
          
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
          
          .card-body {
            padding: 2rem !important;
          }
          
          .input-group {
            flex-direction: column;
          }
          
          .input-group-text,
          .input-group .form-control,
          .input-group .btn {
            border-radius: 10px !important;
            border: 1px solid #e9ecef !important;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}