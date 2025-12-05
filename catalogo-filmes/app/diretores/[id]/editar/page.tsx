'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { diretoresAPI } from '@/lib/api';

function EditarDiretorPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    biografia: '',
    foto: null as File | null,
    fotoAtual: '' as string,
  });

  useEffect(() => {
    loadDiretor();
  }, [id]);

  const loadDiretor = async () => {
    try {
      setLoading(true);
      const diretor = await diretoresAPI.get(id);
      setFormData({
        nome: diretor.nome || '',
        data_nascimento: diretor.data_nascimento || '',
        biografia: diretor.biografia || '',
        foto: null,
        fotoAtual: diretor.foto || '',
      });
    } catch (err: any) {
      setError('Erro ao carregar diretor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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

      await diretoresAPI.update(id, data);
      router.push('/diretores');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar diretor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h3 className="mb-0">Editar Diretor</h3>
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
                  {formData.fotoAtual && (
                    <div className="mb-2">
                      <img 
                        src={formData.fotoAtual} 
                        alt="Foto atual" 
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                        className="rounded"
                      />
                      <p className="text-muted small mt-1">Foto atual</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, foto: e.target.files?.[0] || null })}
                  />
                  <small className="text-muted">Deixe em branco para manter a foto atual</small>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-warning"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Atualizar'}
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

export default EditarDiretorPage;
