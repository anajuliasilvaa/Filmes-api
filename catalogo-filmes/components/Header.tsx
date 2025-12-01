'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="container-fluid header-bg px-0">
      <div className="row gx-0 wow fadeIn" data-wow-delay="0.1s">
        <div className="col-lg-3 navbar-brand-bg d-none d-lg-block">
          <Link href="/" className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center">
            <Image 
              src="/logo.png" 
              alt="Logo Catálogo de Filmes" 
              width={200}
              height={60}
              className="img-fluid"
              style={{ height: 'auto' }}
            />
          </Link>
        </div>
        <div className="col-lg-9">
          <div className="row gx-0 d-none d-lg-flex header-bg contact-info">
            <div className="col-6 px-5 text-start">
              <div className="h-100 d-inline-flex align-items-center py-2 me-4">
                <i className="fa fa-envelope text-primary me-2"></i>
                <p className="mb-0">contato@catalogofilmes.com</p>
              </div>
            </div>
            <div className="col-6 px-5 text-end">    
              {isAuthenticated && user ? (
                <div className="h-100 d-inline-flex align-items-center py-2">
                  <span className="text-light me-3">
                    <i className="fa fa-user me-2"></i>
                    {user.username}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                    Sair
                  </button>
                </div>
              ) : (
                <div className="h-100 d-inline-flex align-items-center py-2">
                  <Link href="/login" className="btn btn-outline-light btn-sm me-2">Entrar</Link>
                  <Link href="/register" className="btn btn-primary btn-sm">Cadastrar</Link>
                </div>
              )}
            </div>
          </div>
          <nav className="navbar navbar-expand-lg navbar-dark p-3 p-lg-0 px-lg-5" style={{ background: '#111111' }}>
            <Link href="/" className="navbar-brand d-block d-lg-none">
              <Image 
                src="/logo.png" 
                alt="Logo Catálogo de Filmes" 
                width={150}
                height={50}
                className="img-fluid"
                style={{ height: 'auto' }}
              />
            </Link>
            <button 
              type="button" 
              className="navbar-toggler" 
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
              <div className="navbar-nav mr-auto py-0">
                <Link href="/" className="nav-item nav-link">Início</Link>
                <Link href="/generos" className="nav-item nav-link">Gêneros</Link>
                <Link href="/diretores" className="nav-item nav-link">Diretores</Link>
                
                {isAuthenticated && (
                  <div className="nav-item dropdown">
                    <Link href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                      Minha Conta
                    </Link>
                    <div className="dropdown-menu rounded-0 m-0">
                      <Link href="/perfil" className="dropdown-item">Perfil</Link>
                      <Link href="/minhas-listas" className="dropdown-item">Minhas Listas</Link>
                      <a href="#" onClick={handleLogout} className="dropdown-item">Sair</a>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-none d-lg-flex align-items-center py-2">
                <a className="btn btn-outline-secondary btn-square rounded-circle ms-2" href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-outline-secondary btn-square rounded-circle ms-2" href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="btn btn-outline-secondary btn-square rounded-circle ms-2" href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
