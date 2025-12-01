'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, text: '-', color: '#e9ecef' });
  const { register } = useAuth();

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

    let text = '-';
    let color = '#e9ecef';
    
    if (strength === 0) {
      text = '-';
      color = '#e9ecef';
    } else if (strength <= 25) {
      text = 'Fraca';
      color = '#dc3545';
    } else if (strength <= 50) {
      text = 'Regular';
      color = '#ffc107';
    } else if (strength <= 75) {
      text = 'Boa';
      color = '#fd7e14';
    } else {
      text = 'Forte';
      color = '#28a745';
    }

    setPasswordStrength({ strength, text, color });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    
    if (!formData.password2) {
      newErrors.password2 = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      try {
        const errorData = JSON.parse(error.message);
        setErrors(errorData);
      } catch {
        setErrors({ general: error.message || 'Erro ao criar conta. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
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
                  <i className="fas fa-user-plus me-3" style={{ fontSize: '3.5rem' }}></i>
                  <h1 className="display-4 fw-bold mb-0">Criar Conta</h1>
                </div>
                <p className="lead mb-4">Junte-se à nossa comunidade cinematográfica</p>
                <div className="d-inline-flex align-items-center bg-white bg-opacity-20 px-4 py-2 rounded-pill">
                  <span className="text-dark">Acesso Gratuito</span>
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
            <div className="col-lg-8 col-xl-6">
              <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="text-white">
                    <i className="fas fa-user-plus mb-2" style={{ fontSize: '2rem' }}></i>
                    <h3 className="mb-1 fw-bold">Cadastro de Usuário</h3>
                    <p className="mb-0 opacity-75">Crie sua conta em segundos</p>
                  </div>
                </div>
                
                <div className="card-body p-5">
                  {/* Benefits */}
                  <div className="bg-light p-4 rounded-3 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="fas fa-gift text-success me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                      <div>
                        <h6 className="fw-bold text-dark mb-2">Benefícios da sua conta:</h6>
                        <ul className="list-unstyled mb-0 text-muted small">
                          <li className="mb-1"><i className="fas fa-check text-success me-2"></i>Criar listas personalizadas de favoritos</li>
                          <li className="mb-1"><i className="fas fa-check text-success me-2"></i>Avaliar e comentar filmes</li>
                          <li className="mb-0"><i className="fas fa-check text-success me-2"></i>Acessar recomendações exclusivas</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Error Messages */}
                  {errors.general && (
                    <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ borderRadius: '15px', borderLeft: '4px solid #dc3545' }}>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-circle me-3" style={{ fontSize: '1.2rem' }}></i>
                        <div>
                          <h6 className="fw-bold mb-1">Erro no Cadastro</h6>
                          <p className="mb-0">{errors.general}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Username */}
                    <div className="mb-4">
                      <label htmlFor="username" className="form-label fw-semibold text-dark">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Nome de Usuário
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
                          placeholder="Digite seu nome de usuário"
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

                    {/* Email */}
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold text-dark">
                        <i className="fas fa-envelope me-2 text-warning"></i>
                        Email
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border-0 bg-light">
                          <i className="fas fa-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          placeholder="Digite seu email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.email && (
                        <div className="text-danger mt-1">
                          <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.email}</small>
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold text-dark">
                        <i className="fas fa-lock me-2 text-success"></i>
                        Senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border-0 bg-light">
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword1 ? 'text' : 'password'}
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
                          onClick={() => setShowPassword1(!showPassword1)}
                        >
                          <i className={`fas ${showPassword1 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="d-flex justify-content-between small text-muted">
                          <span>Força da senha:</span>
                          <span style={{ color: passwordStrength.color }}>{passwordStrength.text}</span>
                        </div>
                        <div className="progress mt-1" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${passwordStrength.strength}%`, 
                              backgroundColor: passwordStrength.color,
                              transition: 'all 0.3s'
                            }}
                          ></div>
                        </div>
                      </div>
                      {errors.password && (
                        <div className="text-danger mt-1">
                          <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.password}</small>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                      <label htmlFor="password2" className="form-label fw-semibold text-dark">
                        <i className="fas fa-check-circle me-2 text-info"></i>
                        Confirmar Senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border-0 bg-light">
                          <i className="fas fa-check-circle text-muted"></i>
                        </span>
                        <input
                          type={showPassword2 ? 'text' : 'password'}
                          className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                          id="password2"
                          name="password2"
                          placeholder="Confirme sua senha"
                          required
                          value={formData.password2}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-0 bg-light"
                          onClick={() => setShowPassword2(!showPassword2)}
                        >
                          <i className={`fas ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {formData.password2 && (
                        <div className="mt-1">
                          <small className={formData.password === formData.password2 ? 'text-success' : 'text-danger'}>
                            <i className={`fas ${formData.password === formData.password2 ? 'fa-check' : 'fa-times'} me-1`}></i>
                            {formData.password === formData.password2 ? 'Senhas coincidem' : 'Senhas não coincidem'}
                          </small>
                        </div>
                      )}
                      {errors.password2 && (
                        <div className="text-danger mt-1">
                          <small><i className="fas fa-exclamation-triangle me-1"></i>{errors.password2}</small>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid mb-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-lg py-3 fw-bold text-white"
                        style={{
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          border: 'none',
                          borderRadius: '15px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Criando conta...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus me-2"></i>
                            Criar Minha Conta
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Additional Options */}
                  <div className="text-center pt-3 border-top">
                    <div className="row g-3">
                      <div className="col-12">
                        <Link href="/login" className="text-decoration-none">
                          <div className="d-flex align-items-center justify-content-center p-3 bg-light rounded-3 hover-card">
                            <i className="fas fa-sign-in-alt me-3 text-primary" style={{ fontSize: '1.2rem' }}></i>
                            <div className="text-start">
                              <h6 className="mb-0 fw-bold text-dark">Já tem uma conta?</h6>
                              <small className="text-muted">Faça login aqui</small>
                            </div>
                          </div>
                        </Link>
                      </div>
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

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
          
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </>
  );
}
