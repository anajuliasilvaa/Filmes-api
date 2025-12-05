"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { favoritosAPI } from "@/lib/api";

export default function CriarListaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Impede render antes do auth carregar
  if (authLoading || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nome.trim()) {
      setError("O nome da lista é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      const novaLista = await favoritosAPI.create(nome.trim());

      setSuccess(`Lista "${novaLista.nome}" criada com sucesso!`);
      router.push(`/favoritos/${novaLista.id}`);
    } catch (err: any) {
      setError(err.message || "Falha ao criar a lista. Tente novamente.");
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
                  {success && <div className="alert alert-success text-center">{success}</div>}

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

                    {/* Criador */}
                    <div className="info-box mb-4">
                      <strong>Criador</strong>
                      <p className="text-muted mb-0">{user?.username || "Usuário"}</p>
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
