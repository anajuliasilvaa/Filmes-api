"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { favoritosAPI, filmesAPI } from "@/lib/api";

interface Filme {
  id: number;
  titulo: string;
  poster: string;
}

export default function CriarListaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [nome, setNome] = useState("");
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [filmesSelecionados, setFilmesSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFilmes, setLoadingFilmes] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadFilmes();
    }
  }, [authLoading, user, router]);

  const loadFilmes = async () => {
    try {
      const data = await filmesAPI.list();
      setFilmes(data.results || data);
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
    } finally {
      setLoadingFilmes(false);
    }
  };

  const toggleFilme = (filmeId: number) => {
    setFilmesSelecionados(prev =>
      prev.includes(filmeId)
        ? prev.filter(id => id !== filmeId)
        : [...prev, filmeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nome.trim()) {
      setError("O nome da lista é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      const novaLista = await favoritosAPI.create(nome.trim());
      
      // Adicionar filmes selecionados
      for (const filmeId of filmesSelecionados) {
        await favoritosAPI.addFilme(novaLista.id, filmeId);
      }

      router.push(`/favoritos/${novaLista.id}`);
    } catch (err: any) {
      setError(err.message || "Falha ao criar a lista.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "40vh",
          position: "relative",
        }}
      >
        <div
          className="hero-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
          }}
        ></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 mb-3">
                <i className="bi bi-plus-circle me-3"></i>
                Criar Lista de Favoritos
              </h1>
              <p className="lead mb-4">
                Organize seus filmes favoritos em uma nova coleção
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "60vh",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
                <div
                  className="card-header text-center py-4"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <h3 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Dados da Lista
                  </h3>
                </div>

                <div className="card-body p-5">
                  {error && <div className="alert alert-danger text-center">{error}</div>}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-muted">
                        <i className="bi bi-tag me-2"></i>Nome
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                          }}
                        >
                          <i className="bi bi-heart-fill"></i>
                        </span>

                        <input
                          type="text"
                          className={`form-control ${error && !nome.trim() ? "is-invalid" : ""}`}
                          placeholder="Ex: Melhores de 2024"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Seleção de Filmes */}
                    <div className="mb-4">
                      <label className="form-label fw-bold text-muted">
                        <i className="bi bi-film me-2"></i>Selecionar Filmes
                      </label>
                      
                      {loadingFilmes ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm"></div>
                        </div>
                      ) : (
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '10px', padding: '10px' }}>
                          {filmes.map(filme => (
                            <div key={filme.id} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`filme-${filme.id}`}
                                checked={filmesSelecionados.includes(filme.id)}
                                onChange={() => toggleFilme(filme.id)}
                              />
                              <label className="form-check-label" htmlFor={`filme-${filme.id}`}>
                                {filme.titulo}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      <small className="text-muted">
                        {filmesSelecionados.length} filme(s) selecionado(s)
                      </small>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <Link href="/favoritos" className="btn btn-outline-secondary btn-lg me-md-2">
                        <i className="bi bi-x-circle me-2"></i>Cancelar
                      </Link>

                      <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        disabled={loading}
                        style={{
                          borderRadius: "25px",
                          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                          border: "none",
                        }}
                      >
                        {loading ? "Criando..." : "Criar Lista"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
