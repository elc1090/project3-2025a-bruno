import { useState } from 'react';
import api from '../services/api';

export default function LinkForm({ onSuccess }) {
  const [url, setUrl] = useState('');
  const [titulo, setTitulo] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !titulo) {
      setErro('URL e título são obrigatórios.');
      return;
    }
    try {
      await api.post('/links', { url, titulo });
      setUrl('');
      setTitulo('');
      setErro('');
      onSuccess(); // notifica para recarregar a lista
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao criar link');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 bg-blue-900 text-white rounded hover:bg-blue-950"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
