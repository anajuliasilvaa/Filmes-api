'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { avaliacoesAPI } from '@/lib/api';

interface Avaliacao {
  id: number;
  filme: number;
  // Trata o usuário vindo como objeto ou ID
  usuario: {
    id: number;
    username: string;
    profile?: { avatar_url?: string }; // Se tiver avatar no futuro
  } | number; 
  nota: number;
  comentario: string;
  data_avaliacao?: string;
}

interface Props {
  filmeId: number;
}

export default function AvaliacoesSection({ filmeId }: Props) {
  const { user, isAdmin } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário (Não usamos mais modal)
  const [notaInput, setNotaInput] = useState(5);
  const [comentarioInput, setComentarioInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Estado de Edição
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    carregarAvaliacoes();
  }, [filmeId]);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      const data = await avaliacoesAPI.list();
      const filtradas = Array.isArray(data) ? data : data.results || [];
      // Filtra apenas as avaliações deste filme
      const doFilme = filtradas.filter((av: any) => av.filme === Number(filmeId));
      setAvaliacoes(doFilme);
    } catch (error) {
      console.error("Erro ao carregar avaliações", error);
    } finally {
      setLoading(false);
    }
  };

  // Helpers para pegar dados do usuário com segurança
  const getUserId = (usuario: Avaliacao['usuario']) => {
    return typeof usuario === 'object' ? usuario.id : usuario;
  };

  const getUserName = (usuario: Avaliacao['usuario']) => {
    return typeof usuario === 'object' ? usuario.username : `Usuário ${usuario}`;
  };

  // Verifica se o usuário atual já fez um review
  const userHasReview = user && avaliacoes.some(av => getUserId(av.usuario) === user.id);

  // --- AÇÕES ---

  const prepararEdicao = (av: Avaliacao) => {
    setEditingId(av.id);
    setNotaInput(av.nota);
    setComentarioInput(av.comentario);
    setErrorMsg('');
    // Rola a tela até o formulário
    document.getElementById('form-avaliacao')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setNotaInput(5);
    setComentarioInput('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (editingId) {
        // EDITAR
        await avaliacoesAPI.update(editingId, {
          nota: notaInput,
          comentario: comentarioInput
        });
        setEditingId(null);
      } else {
        // CRIAR
        if (userHasReview) {
            setErrorMsg('Você já avaliou este filme.');
            setIsSubmitting(false);
            return;
        }
        await avaliacoesAPI.create({
          filme: Number(filmeId),
          nota: notaInput,
          comentario: comentarioInput
        });
      }
      
      // Limpa e recarrega
      setComentarioInput('');
      setNotaInput(5);
      await carregarAvaliacoes();
      
    } catch (error: any) {
      console.error("Erro no submit:", error);
      // Tenta pegar a mensagem de erro do backend se existir
      const msg = error.response?.data?.detail || "Erro ao salvar. Verifique sua conexão.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletar = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover esta avaliação?')) return;
    try {
      await avaliacoesAPI.delete(id);
      carregarAvaliacoes();
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  // Renderiza estrelinhas
  const renderStars = (nota: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const filled = starValue <= nota;
      return (
        <i 
          key={i}
          className={`bi ${filled ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
          style={{ 
            cursor: interactive ? 'pointer' : 'default', 
            fontSize: interactive ? '1.2rem' : '0.9rem', 
            marginRight: '3px',
            transition: 'transform 0.2s'
          }}
          onClick={() => interactive && setNotaInput(starValue)}
          onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
        ></i>
      );
    });
  };

  return (
    <div className="card shadow-lg border-0 mb-5" style={{ borderRadius: '15px', overflow: 'hidden' }}>
      
      {/* Cabeçalho */}
      <div className="card-header py-3 px-4 bg-white border-bottom">
        <h5 className="mb-0 fw-bold text-dark">
          <i className="bi bi-chat-square-text-fill me-2 text-primary"></i>
          Avaliações da Comunidade <span className="text-muted ms-2 fs-6">({avaliacoes.length})</span>
        </h5>
      </div>

      <div className="card-body bg-light p-0">
        
        {/* === LISTA DE COMENTÁRIOS === */}
        <div className="comments-list p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
          ) : avaliacoes.length === 0 ? (
            <div className="text-center py-5 opacity-50">
              <i className="bi bi-chat-dots fs-1 mb-2"></i>
              <p>Ninguém comentou ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {avaliacoes.map((av) => {
                const userId = getUserId(av.usuario);
                const userName = getUserName(av.usuario);
                const isMyReview = user && user.id === userId;

                return (
                  <div key={av.id} className={`d-flex gap-3 p-3 rounded-3 bg-white shadow-sm ${isMyReview ? 'border border-primary' : ''}`}>
                    {/* Avatar do Usuário (Simulado com Inicial) */}
                    <div className="flex-shrink-0">
                      <div className="rounded-circle bg-gradient d-flex align-items-center justify-content-center text-white fw-bold" 
                           style={{ width: '40px', height: '40px', background: isMyReview ? '#667eea' : '#ccc' }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{userName} {isMyReview && <span className="badge bg-light text-primary ms-1">Você</span>}</h6>
                          <div className="mb-1">{renderStars(av.nota)}</div>
                        </div>
                        
                        {/* Ações (Editar/Excluir) */}
                        <div className="d-flex gap-1">
                          {isMyReview && !isAdmin && (
                            <>
                              <button onClick={() => prepararEdicao(av)} className="btn btn-link p-0 text-muted me-2" title="Editar" style={{textDecoration: 'none', fontSize: '0.8rem'}}>
                                <i className="bi bi-pencil"></i> Editar
                              </button>
                              <button onClick={() => handleDeletar(av.id)} className="btn btn-link p-0 text-danger" title="Excluir" style={{textDecoration: 'none', fontSize: '0.8rem'}}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                          {isAdmin && (
                             <button onClick={() => handleDeletar(av.id)} className="btn btn-sm btn-outline-danger border-0">
                               <i className="bi bi-trash"></i>
                             </button>
                          )}
                        </div>
                      </div>
                      <p className="mb-0 text-secondary mt-1" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {av.comentario}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* === ÁREA DE ESCREVER (SOCIAL STYLE) === */}
        {user ? (
          <div id="form-avaliacao" className="p-4 bg-white border-top">
            
            {!editingId && userHasReview ? (
               <div className="alert alert-light text-center border mb-0 text-muted">
                 Você já avaliou este filme. Encontre seu comentário acima para editar.
               </div>
            ) : (
              <div className="d-flex gap-3 animate-fade-in">
                {/* Avatar do Logado */}
                <div className="d-none d-md-block">
                   <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
                        style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                     {user.username.charAt(0).toUpperCase()}
                   </div>
                </div>

                {/* Input Area */}
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-2 text-primary">
                    {editingId ? 'Editar sua avaliação' : 'Deixe sua opinião'}
                  </h6>
                  
                  {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

                  <form onSubmit={handleSubmit}>
                    {/* Seletor de Estrelas */}
                    <div className="mb-2">
                      <span className="me-2 text-muted small">Sua nota:</span>
                      {renderStars(notaInput, true)}
                    </div>

                    {/* Caixa de Texto */}
                    <div className="position-relative">
                      <textarea 
                        className="form-control bg-light border-0" 
                        rows={3}
                        placeholder="O que você achou do filme? Conte para nós..."
                        value={comentarioInput}
                        onChange={e => setComentarioInput(e.target.value)}
                        style={{ resize: 'none', borderRadius: '10px', padding: '15px' }}
                        required
                      ></textarea>
                    </div>

                    {/* Botões */}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      {editingId && (
                        <button type="button" onClick={cancelarEdicao} className="btn btn-light rounded-pill px-4">
                          Cancelar
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                        style={{ background: 'linear-gradient(to right, #667eea, #764ba2)', border: 'none' }}
                      >
                        {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar' : 'Publicar')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Estado Deslogado
          <div className="p-4 bg-light text-center border-top">
            <p className="text-muted mb-2">Faça login para deixar sua avaliação.</p>
            <a href="/login" className="btn btn-outline-primary rounded-pill px-4">Entrar</a>
          </div>
        )}

      </div>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-control:focus {
          background-color: #fff !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
      `}</style>
    </div>
  );
}