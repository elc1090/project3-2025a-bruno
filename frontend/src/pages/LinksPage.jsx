// src/pages/LinksPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import LinkForm from '../components/LinkForm'

export default function LinksPage({ view }) {
  const [links, setLinks] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editUrl, setEditUrl] = useState('')
  const [editTitulo, setEditTitulo] = useState('')
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

  // Inicia edição: preenche campos e marca editingId
  const handleEditClick = (link) => {
    setEditingId(link.id)
    setEditUrl(link.url)
    setEditTitulo(link.titulo)
  }

  // Envia atualização
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/links/${editingId}`, {
        url: editUrl,
        titulo: editTitulo
      })
      setEditingId(null)
      loadLinks()
    } catch (err) {
      console.error('Erro ao editar:', err)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
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
      <ul className="space-y-4">
        {links.map(l => {
          const userName = l.user_email.split('@')[0]
          const addedAt = new Date(l.data_adicao).toLocaleString()

          // Se estiver editando este link...
          if (editingId === l.id) {
            return (
              <li key={l.id} className="border p-4 rounded space-y-2">
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={editTitulo}
                    onChange={e => setEditTitulo(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="url"
                    value={editUrl}
                    onChange={e => setEditUrl(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="px-4 bg-blue-500 text-white rounded">
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className="px-4 bg-gray-300 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </li>
            )
          }
          // Se não estiver editando, exibe o link normalmente
          return (
            <li
              key={l.id}
              className="border p-4 rounded space-y-1"
            >
              <h2 className="text-lg font-semibold">{l.titulo}</h2>

              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {l.url}
              </a>

              <p className="text-sm text-gray-500">Adicionado em: {addedAt}</p>

              <p className="text-sm text-gray-500">
                Por: <strong>{userName}</strong>
              </p>

              {view === 'mine' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(l)}
                    className="text-green-500 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      )}
    </main>
  )
}
