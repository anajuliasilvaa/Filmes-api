import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineList - Seu Catálogo de Filmes",
  description: "Explore o mundo do cinema com nosso catálogo completo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/png" href="/img/aba.png" />
        
        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        
        {/* Icon Font Stylesheet */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        
        {/* Libraries Stylesheet */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          rel="stylesheet"
        />
        
        {/* Custom Footer CSS */}
        {/* <link href="/css/footer.css" rel="stylesheet" /> */}
      </head>
      <body className={inter.className}>
        {/* Header Start */}
        <div className="container-fluid header-bg px-0">
          <div className="row gx-0 wow fadeIn" data-wow-delay="0.1s">
            <div className="col-lg-3 navbar-brand-bg d-none d-lg-block">
              <Link href="/" className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center">
                <Image 
                  src="/img/logo.png" 
                  alt="Logo Catálogo de Filmes" 
                  width={200}
                  height={60}
                  className="img-fluid"
                  style={{ maxHeight: '60px', width: 'auto' }}
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
                  {/* Estado de usuário não autenticado - você pode adicionar lógica de autenticação depois */}
                  <div className="h-100 d-inline-flex align-items-center py-2">
                    <Link href="/login" className="btn btn-outline-light btn-sm me-2">Entrar</Link>
                    <Link href="/register" className="btn btn-primary btn-sm">Cadastrar</Link>
                  </div>
                </div>
              </div>
              <nav className="navbar navbar-expand-lg navbar-dark p-3 p-lg-0 px-lg-5" style={{ background: '#111111' }}>
                <Link href="/" className="navbar-brand d-block d-lg-none">
                  <Image 
                    src="/img/logo.png" 
                    alt="Logo Catálogo de Filmes" 
                    width={150}
                    height={50}
                    className="img-fluid"
                    style={{ maxHeight: '60px', width: 'auto' }}
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
                    
                    {/* Dropdown para usuário autenticado - você pode adicionar condicional depois */}
                    <div className="nav-item dropdown">
                      <Link href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                        Minha Conta
                      </Link>
                      <div className="dropdown-menu rounded-0 m-0">
                        <Link href="/perfil" className="dropdown-item">Perfil</Link>
                        <Link href="/minhas-listas" className="dropdown-item">Minhas Listas</Link>
                        <Link href="/logout" className="dropdown-item">Sair</Link>
                      </div>
                    </div>
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
        {/* Header End */}

        {/* Messages Area - você pode adicionar um sistema de mensagens depois */}
        {/* <div className="alert alert-info">
          Mensagem de exemplo
        </div> */}

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer Start */}
        <div className="container-fluid footer-bg footer-text px-5 mt-5">
          <div className="row gx-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="col-lg-8 col-md-6">
              <div className="row gx-5">
                <div className="col-lg-4 col-md-12 pt-5 mb-5">
                  <h3 className="footer-title mb-4">Contato</h3>
                  <div className="d-flex mb-2">
                    <i className="bi bi-geo-alt footer-primary me-2"></i>
                    <p className="mb-0">Guanambi, BA, Brasil</p>
                  </div>
                  <div className="d-flex mb-2">
                    <i className="bi bi-envelope-open footer-primary me-2"></i>
                    <p className="mb-0">contato@catalogofilmes.com</p>
                  </div>
                  <div className="d-flex mb-2">
                    <i className="bi bi-telephone footer-primary me-2"></i>
                    <p className="mb-0">+55 4002-8922</p>
                  </div>
                  <div className="d-flex mt-4 social-links">
                    <a className="btn btn-outline-secondary btn-square rounded-circle me-2" href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-outline-secondary btn-square rounded-circle me-2" href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-outline-secondary btn-square rounded-circle me-2" href="#">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a className="btn btn-outline-secondary btn-square rounded-circle" href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                  <h3 className="footer-title mb-4">Links Rápidos</h3>
                  <div className="d-flex flex-column justify-content-start">
                    <Link className="footer-text mb-2" href="/">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Início
                    </Link>
                    <Link className="footer-text mb-2" href="/diretores">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Diretores
                    </Link>
                    <Link className="footer-text mb-2" href="/minhas-listas">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Minhas Listas
                    </Link>
                    <Link className="footer-text mb-2" href="/generos">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Gêneros
                    </Link>
                    <Link className="footer-text mb-2" href="/perfil">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Perfil
                    </Link>
                    <Link className="footer-text" href="/contato">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Contato
                    </Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                  <h3 className="footer-title mb-4">Sobre o Catálogo</h3>
                  <div className="d-flex flex-column justify-content-start">
                    <Link className="footer-text mb-2" href="/filmes">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Filmes
                    </Link>
                    <Link className="footer-text mb-2" href="/avaliacoes">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Avaliações
                    </Link>
                    <Link className="footer-text mb-2" href="/favoritos">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Favoritos
                    </Link>
                    <Link className="footer-text mb-2" href="/novidades">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Novidades
                    </Link>
                    <Link className="footer-text mb-2" href="/suporte">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Suporte
                    </Link>
                    <Link className="footer-text" href="/privacidade">
                      <i className="bi bi-arrow-right footer-primary me-2"></i>Política de Privacidade
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 p-5" style={{ background: '#111111' }}>
                <h3 className="footer-title mb-4">Newsletter</h3>
                <h6 className="text-uppercase text-light mb-2">Receba nossas atualizações</h6>
                <p className="small footer-text">Fique por dentro das novidades do mundo do cinema</p>
                <form action="" method="post" className="newsletter-form">
                  <div className="input-group">
                    <input type="email" className="form-control border-white p-3" placeholder="Seu Email" required />
                    <button className="btn btn-primary" type="submit">Inscrever</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid py-4 py-lg-0 px-5" style={{ background: '#111111' }}>
          <div className="row gx-5">
            <div className="col-lg-8">
              <div className="py-lg-4 text-center">
                <p className="footer-text mb-0">
                  &copy; <a className="text-light fw-bold" href="#">CineList</a>. Todos os direitos reservados.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="py-lg-4 text-center">
                <p className="text-light mb-0">
                  Desenvolvido com <i className="bi bi-heart-fill text-danger"></i> para cinéfilos
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer End */}

        {/* Back to Top */}
        <a href="#" className="btn btn-dark py-3 fs-4 back-to-top">
          <i className="bi bi-arrow-up"></i>
        </a>

        {/* JavaScript Libraries */}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js" strategy="afterInteractive" />
        
        {/* Custom Scripts */}
        <Script id="custom-scripts" strategy="afterInteractive">
          {`
            // Back to top button
            $(window).scroll(function () {
              if ($(this).scrollTop() > 100) {
                $('.back-to-top').fadeIn('slow');
              } else {
                $('.back-to-top').fadeOut('slow');
              }
            });
            $('.back-to-top').click(function () {
              $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
              return false;
            });
            
            // Active navbar link
            $(document).ready(function() {
              var currentPath = window.location.pathname;
              $('.navbar-nav .nav-link').each(function() {
                var linkPath = $(this).attr('href');
                if (linkPath === currentPath) {
                  $(this).addClass('active');
                } else {
                  $(this).removeClass('active');
                }
              });
              
              // Initialize WOW.js animations
              new WOW().init();
            });
          `}
        </Script>
      </body>
    </html>
  );
}