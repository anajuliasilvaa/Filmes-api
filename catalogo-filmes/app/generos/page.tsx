'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // <--- Importante para o botão funcionar
import { useAuth } from '@/contexts/AuthContext'; 
import { generosAPI } from '@/lib/api';

interface Genero {
  id: number;
  nome: string;
}

export default function GenerosPage() {
  const { isAdmin } = useAuth();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await generosAPI.list();
      setGeneros(Array.isArray(data) ? data : data.results || []); 
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar a lista de gêneros.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const nome = prompt("Digite o nome do novo gênero:");
    if (!nome) return;

    try {
      await generosAPI.create(nome);
      loadData(); 
    } catch (err) {
      alert("Erro ao criar. Verifique se já existe ou se você é Admin.");
    }
  };

  const handleEdit = async (genero: Genero) => {
    const novoNome = prompt("Editar nome do gênero:", genero.nome);
    if (!novoNome || novoNome === genero.nome) return;

    try {
      await generosAPI.update(genero.id, novoNome);
      loadData(); 
    } catch (err) {
      alert("Erro ao editar. Verifique suas permissões.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja DELETAR este gênero?')) {
      try {
        await generosAPI.delete(id);
        setGeneros(prev => prev.filter(g => g.id !== id));
      } catch (err) {
        alert('Falha ao deletar.');
      }
    }
  };

  if (loading) {
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
      <div className="container-fluid hero-section d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '40vh' }}>
        <div className="container">
          <div className="row g-5 py-5">
            <div className="col-12 text-center">
              <h1 className="display-2 text-white mb-4">Gêneros de Cinema</h1>
              <p className="lead text-white mb-4">Explore o catálogo através das categorias</p>
              <i className="bi bi-tags-fill animate-up-down text-white" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls - COM O BOTÃO NOVO */}
      {isAdmin && (
        <div className="container mt-4">
          <div className="admin-controls text-center wow fadeIn" data-wow-delay="0.1s">
            <h6 className="section-title mb-3">Gerenciar Gêneros</h6>
            <div className="d-flex justify-content-center gap-2">
                <button 
                    onClick={handleCreate} 
                    className="btn btn-success btn-sm"
                >
                  <i className="bi bi-plus-circle me-1"></i>Novo Gênero
                </button>

                {/* --- BOTÃO VOLTAR AO CATÁLOGO ADICIONADO AQUI --- */}
                <Link href="/" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1"></i>Voltar ao Catálogo
                </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de Gêneros */}
      <div className="container-fluid p-5 bg-light">
        <div className="mb-5 text-center wow fadeIn" data-wow-delay="0.1s">
            <h5 className="section-title">Categorias</h5>
            <h1 className="display-4 mb-0">Gêneros Disponíveis</h1>
        </div>
        
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {generos && generos.length > 0 ? (
            <div className="row g-4">
                {generos.map((genero, index) => (
                    <div key={genero.id} className="col-lg-3 col-md-6 wow fadeIn" data-wow-delay={`0.${index % 4 + 1}s`}>
                        <div className="director-card-full">
                            
                            <div className="director-image-container">
                                <div className="director-placeholder">
                                    <i className="bi bi-film text-primary" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                                </div>
                            </div>
                            
                            <div className="director-info text-center">
                                <h5 className="director-name mt-2" style={{ fontSize: '1.5rem' }}>{genero.nome}</h5>
                                <p className="director-bio text-muted">Categoria de Filmes</p>
                                
                                {isAdmin && (
                                    <div className="mt-3 d-flex justify-content-center gap-2 border-top pt-3">
                                        <button 
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => handleEdit(genero)}
                                            title="Editar nome"
                                        >
                                            <i className="bi bi-pencil me-1"></i> Editar
                                        </button>

                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(genero.id)}
                                            title="Excluir gênero"
                                        >
                                            <i className="bi bi-trash me-1"></i> Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-5">
                <div className="empty-state">
                    <i className="bi bi-tags text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                    <h3 className="text-muted mb-3">Nenhum gênero encontrado</h3>
                    
                    {/* Opção extra: mostrar o botão de voltar também quando não há gêneros */}
                    <Link href="/" className="btn btn-primary mt-3">
                        Voltar ao Catálogo
                    </Link>
                </div>
            </div>
        )}
      </div>
      
      <style jsx global>{`
        .hero-section { position: relative; overflow: hidden; border-radius: 0 0 50px 50px; }
        .section-title { color: #667eea; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        .admin-controls { padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .director-card-full { background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; }
        .director-card-full:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); }
        .director-image-container { position: relative; height: 200px; overflow: hidden; }
        .director-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); display: flex; align-items: center; justify-content: center; }
        .director-info { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
        .director-name { color: #2c3e50; font-weight: 600; margin-bottom: 10px; font-size: 1.1rem; }
        .empty-state { background: #fff; border-radius: 15px; padding: 60px 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); max-width: 500px; margin: 0 auto; }
      `}</style>
    </>
  );
}