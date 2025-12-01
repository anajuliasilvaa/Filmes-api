'use client';

import { useEffect, useState } from 'react';
import { avaliacoesAPI } from '../../lib/api';

interface Avaliacao {
  id: number;
  filme: number;
  comentario: string;
  nota: number;
}

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  const [filmeId, setFilmeId] = useState('');
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  const carregar = async () => {
    try {
      setLoading(true);
      const data = await avaliacoesAPI.list();
      setAvaliacoes(data.results || data);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const criar = async () => {
    try {
      await avaliacoesAPI.create({
        filme: Number(filmeId),
        comentario,
        nota: Number(nota),
      });

      setFilmeId('');
      setComentario('');
      setNota('');
      carregar();
    } catch (error) {
      console.error(error);
    }
  };

  const atualizar = async () => {
    try {
      await avaliacoesAPI.update(editId!, {
        comentario,
        nota: Number(nota),
      });

      setEditId(null);
      setComentario('');
      setNota('');
      carregar();
    } catch (error) {
      console.error(error);
    }
  };

  const deletar = async (id: number) => {
    try {
      await avaliacoesAPI.delete(id);
      carregar();
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarEdicao = (a: Avaliacao) => {
    setEditId(a.id);
    setComentario(a.comentario);
    setNota(a.nota);
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Gerenciar Avaliações</h1>

      <div style={{ marginTop: 20 }}>
        {!editId && (
          <input
            placeholder="ID do filme"
            value={filmeId}
            onChange={(e) => setFilmeId(e.target.value)}
            style={{ padding: 8, width: 200, marginRight: 10 }}
          />
        )}

        <input
          placeholder="Comentário"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          style={{ padding: 8, width: 260, marginRight: 10 }}
        />

        <input
          placeholder="Nota (0 a 10)"
          type="number"
          value={nota}
          onChange={(e) => setNota(Number(e.target.value))}
          style={{ padding: 8, width: 120, marginRight: 10 }}
        />

        {editId ? (
          <button onClick={atualizar}>Atualizar</button>
        ) : (
          <button onClick={criar}>Criar</button>
        )}
      </div>

      <ul style={{ marginTop: 30 }}>
        {avaliacoes.map((a) => (
          <li key={a.id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
            <p><strong>Filme:</strong> {a.filme}</p>
            <p><strong>Nota:</strong> {a.nota}</p>
            <p><strong>Comentário:</strong> {a.comentario}</p>

            <button onClick={() => iniciarEdicao(a)} style={{ marginRight: 10 }}>
              Editar
            </button>

            <button onClick={() => deletar(a.id)} style={{ color: 'red' }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
