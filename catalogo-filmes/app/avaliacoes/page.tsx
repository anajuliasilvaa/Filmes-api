// app/avaliacoes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { avaliacoesAPI } from '@/lib/api';

interface Avaliacao {
  id: number;
  filme: number;
  usuario: number; // ou objeto usuario, dependendo do serializer
  nota: number;
  comentario: string;
}

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      const data = await avaliacoesAPI.list();
      setAvaliacoes(data);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja apagar permanentemente esta avaliação?')) return;
    
    try {
      await avaliacoesAPI.delete(id);
      // Remove visualmente da lista
      setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      alert('Erro ao excluir. Verifique se você tem permissão de Admin.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Moderação de Avaliações</h1>

      <div className="grid gap-4">
        {avaliacoes.map((av) => (
          <div key={av.id} className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  Filme ID: {av.filme} | Usuário ID: {av.usuario}
                </p>
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1 font-bold">
                  ★ Nota: {av.nota}
                </div>
              </div>
              <button
                onClick={() => handleDeletar(av.id)}
                className="text-sm bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition-colors"
              >
                Remover Avaliação
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded italic text-gray-700">
              "{av.comentario || 'Sem comentário.'}"
            </div>
          </div>
        ))}

        {avaliacoes.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhuma avaliação encontrada.</p>
        )}
      </div>
    </div>
  );
}