// src/pages/LinksPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import LinkForm from '../components/LinkForm'

export default function LinksPage({ view }) {
  const [links, setLinks] = useState([])
  const navigate = useNavigate()

  // Determina qual endpoint usar
  const endpoint = view === 'mine' ? '/my-links' : '/links'

  // Carrega os links
  const loadLinks = () => {
    api.get(endpoint)
      .then(res => setLinks(res.data))
      .catch(err => console.error(err))
  }

  useEffect(loadLinks, [view])

  // Exclui um link e recarrega a lista
  const handleDelete = async (id) => {
    await api.delete(`/links/${id}`)
    loadLinks()
  }

  return (
    <main className="p-4">
      {/* Menu de Abas */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => navigate('/links')}
          className={view === 'all' ? 'font-bold underline' : 'text-gray-600'}
        >
          Todos os Links
        </button>
        <button
          onClick={() => navigate('/my-links')}
          className={view === 'mine' ? 'font-bold underline' : 'text-gray-600'}
        >
          Meus Links
        </button>
        <button
          onClick={() => navigate('/logout')}
          className="text-red-500 ml-auto"
        >
          Sair
        </button>
      </div>

      {/* Formulário de Adição */}
      <LinkForm onSuccess={loadLinks} />

      {/* Lista de Links */}
      {links.length === 0 ? (
        <p>Nenhum link cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {links.map(l => (
            <li
              key={l.id}
              className="border p-2 rounded flex justify-between items-start"
            >
              <div>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600"
                >
                  {l.titulo}
                </a>
                <p className="text-sm text-gray-500">
                  Adicionado por: <strong>{l.user_email}</strong>
                </p>
              </div>
              <button
                onClick={() => handleDelete(l.id)}
                className="text-red-500 hover:underline"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
