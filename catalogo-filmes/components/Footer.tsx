import Link from 'next/link';

export default function Footer() {
  return (
    <>
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
    </>
  );
}
