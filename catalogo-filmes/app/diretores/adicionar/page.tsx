'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { diretoresAPI } from '@/lib/api';

function AdicionarDiretorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    biografia: '',
    foto: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('nome', formData.nome);
      if (formData.data_nascimento) {
        data.append('data_nascimento', formData.data_nascimento);
      }
      data.append('biografia', formData.biografia);
      if (formData.foto) {
        data.append('foto', formData.foto);
      }

      await diretoresAPI.create(data);
      router.push('/diretores');
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar diretor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Adicionar Novo Diretor</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Biografia</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={formData.biografia}
                    onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Foto</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, foto: e.target.files?.[0] || null })}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <Link href="/diretores" className="btn btn-secondary">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdicionarDiretorPage;
