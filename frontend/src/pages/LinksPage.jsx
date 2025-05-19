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

  // Pega o e‑mail do usuário logado em localStorage
  const userEmail = localStorage.getItem('userEmail') || 'Usuário'

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

  // Logout: remove flags e redireciona
  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('userEmail')
    navigate('/logout')
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-900 text-white shadow-lg w-full">
        <div className="w-full max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Compartilhamento de Links</div>
          <div className="flex items-center space-x-6">
            <span className="text-lg">
              Olá, <span className="text-indigo-300">{userEmail}</span>
            </span>
            <button
              onClick={() => navigate('/links')}
              className={`px-3 py-1 rounded-md transition ${
                view === 'all'
                  ? 'bg-indigo-700 shadow-inner'
                  : 'text-gray-300 hover:bg-blue-800'
              }`}
            >
              Todos os Links
            </button>
            <button
              onClick={() => navigate('/my-links')}
              className={`px-3 py-1 rounded-md transition ${
                view === 'mine'
                  ? 'bg-indigo-700 shadow-inner'
                  : 'text-gray-300 hover:bg-blue-800'
              }`}
            >
              Meus Links
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-700 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-8 max-w-[1280px] mx-auto">
        {/* Formulário de criação */}
        <div className="bg-white rounded-lg shadow p-6 mb-10 border border-gray-200">
          <LinkForm onSuccess={loadLinks} />
        </div>

        {/* Título da lista */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {view === 'mine' ? 'Seus Links' : 'Todos os Links'}
        </h2>

        {/* Grid de cards */}
        {links.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            {view === 'mine'
              ? 'Você ainda não adicionou nenhum link.'
              : 'Nenhum link disponível.'}
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {links.map((l) => {
              const authorName = l.user_email.split('@')[0];
              const addedAt = new Date(l.data_adicao).toLocaleString();

              if (editingId === l.id) {
                return (
                  <div
                    key={l.id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  >
                    {/* Formulário de edição inline */}
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <input
                        type="text"
                        value={editTitulo}
                        onChange={(e) => setEditTitulo(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={handleEditCancel}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div
                  key={l.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {l.titulo}
                  </h3>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-indigo-700 mt-3 truncate hover:underline"
                  >
                    {l.url}
                  </a>
                  <div className="flex justify-between text-sm text-gray-500 mt-4">
                    <span>{addedAt}</span>
                    <span>{authorName}</span>
                  </div>
                  {view === 'mine' && (
                    <div className="flex justify-end space-x-4 mt-4">
                      <button
                        onClick={() => handleEditClick(l)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-center p-6 w-full">
        &copy; {new Date().getFullYear()} Compartilhamento de Links. Todos os direitos reservados.
      </footer>
    </div>
  );
}
