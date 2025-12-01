'use client';

import { useState, useEffect } from 'react';
import { generosAPI } from '../../lib/api';

interface Genero {
  id: number;
  nome: string;
}

export default function GenerosPage() {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const carregarGeneros = async () => {
    try {
      setLoading(true);
      const data = await generosAPI.list();
      setGeneros(data.results || data);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarGenero = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/generos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });

      if (!response.ok) throw new Error('Erro ao criar gênero');

      setNome('');
      carregarGeneros();
    } catch (error) {
      console.error(error);
    }
  };

  const atualizarGenero = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/generos/${editId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar gênero');

      setEditId(null);
      setNome('');
      carregarGeneros();
    } catch (error) {
      console.error(error);
    }
  };

  const deletarGenero = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/generos/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir gênero');

      carregarGeneros();
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarEdicao = (g: Genero) => {
    setEditId(g.id);
    setNome(g.nome);
  };

  useEffect(() => {
    carregarGeneros();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Gerenciar Gêneros</h1>

      <div style={{ marginTop: 20 }}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do gênero"
          style={{ padding: 8, width: 240 }}
        />

        {editId ? (
          <button onClick={atualizarGenero} style={{ marginLeft: 10 }}>
            Atualizar
          </button>
        ) : (
          <button onClick={criarGenero} style={{ marginLeft: 10 }}>
            Criar
          </button>
        )}
      </div>

      <ul style={{ marginTop: 30 }}>
        {generos.map((g) => (
          <li key={g.id} style={{ marginBottom: 15 }}>
            {g.nome}

            <button
              onClick={() => iniciarEdicao(g)}
              style={{ marginLeft: 10 }}
            >
              Editar
            </button>

            <button
              onClick={() => deletarGenero(g.id)}
              style={{ marginLeft: 10, color: 'red' }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
