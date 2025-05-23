// src/pages/FavoritesPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import SearchFiltered from '../components/SearchFiltered'
import LoadMore from '../components/LoadMore'
import Header from '../components/Header'

export default function FavoritesPage({ onLogout }) {
  const [favorites, setFavorites] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('title')
  const [editingId, setEditingId] = useState(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Modal de denúncia 
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportTarget, setReportTarget] = useState(null)

  // Pega o email do usuário logado
  const userEmail = localStorage.getItem('userEmail') || 'Usuário'

  const navigate = useNavigate()

  // Carrega apenas os links que o usuário favoritou
  const loadFavorites = () => {
    api.get('/favorites')
      .then(res => setFavorites(res.data))
      .catch(err => console.error(err))
  }

  useEffect(loadFavorites, [])

  // Apagar favorito (não apaga o link em si, apenas o vínculo de favorito)
  const handleRemoveFavorite = async (linkId) => {
    await api.delete(`/favorites/${linkId}`)
    loadFavorites()
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    onLogout()
    navigate('/login')
  }

  /**** EDIÇÃO INLINE ****/
  const handleEditClick = (link) => {
    setEditingId(link.id)
    setEditTitulo(link.titulo)
    setEditUrl(link.url)
  }
  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitulo('')
    setEditUrl('')
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    await api.put(`/links/${editingId}`, {
      titulo: editTitulo,
      url: editUrl
    })
    setEditingId(null)
    setEditTitulo('')
    setEditUrl('')
    loadFavorites()
  }

  /**** MODAL DE DENÚNCIA ****/
  const openReportModal = (link) => {
    setReportTarget(link)
    setShowReportModal(true)
  }
  const closeReportModal = () => {
    setShowReportModal(false)
    setReportTarget(null)
  }
  const handleReportSubmit = (reason) => {
    alert(`Obrigado por reportar o link "${reportTarget.titulo}" como "${reason}".`)
    closeReportModal()
  }

  /**** FILTRO DE BUSCA ****/
  const filteredFavs = favorites.filter((l) => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true

    if (filterBy === 'title') {
      return l.titulo.toLowerCase().includes(term)
    }
    if (filterBy === 'user') {
      const authorName = l.user_email.split('@')[0].toLowerCase()
      return authorName.includes(term)
    }
    if (filterBy === 'date') {
      const dateStr = new Date(l.data_adicao).toLocaleDateString('pt-BR')
      return dateStr.includes(term)
    }
    return true
  })

  // Define o número de links a serem exibidos por vez
  const visibleLinks = filteredFavs.slice(0, visibleCount);

  // Função para carregar mais links
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      {/* -------- HEADER -------- */}
      <Header
              activeView="favorites"        
              userEmail={userEmail}
              onLogout={handleLogout}
            />

      {/* -------- ESPAÇO ENTRE HEADER E CONTEÚDO -------- */}
      <div className="h-4 bg-gray-100"></div>

      {/* -------- FORMULÁRIO DE ADIÇÃO -------- */}
      <main className="flex-1 w-full px-6 md:px-8 lg:px-10 py-4 max-w-[1280px] mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Seus Favoritos</h2>
        
        {/* -------- BUSCA -------- */}
        <SearchFiltered
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
        />

        {/* Grid de cards (favoritos) */}
        {filteredFavs.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Você ainda não favoritou nenhum link.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {visibleLinks.map((l) => {
              const authorName = l.user_email.split('@')[0]
              const addedAt = new Date(l.data_adicao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })

              if (editingId === l.id) {
                return (
                  <div
                    key={l.id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  >
                    {/* EDIÇÃO INLINE */}
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
                )
              }

              return (
                <div
                  key={l.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  {/* Título + Ícone de Desfavoritar (ou desfavoritar) */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {l.titulo}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {/* Clicando aqui, remove de favorito */}
                      <button
                        onClick={() => handleRemoveFavorite(l.id)}
                        title="Remover dos Favoritos"
                        className="text-lg text-yellow-600 hover:text-yellow-800 p-1 bg-transparent border-none outline-none"
                      >
                        ★
                      </button>
                      {/* Botão de denúncia */}
                        <button
                          onClick={() => openReportModal(l)}
                          title="Reportar"
                          className="text-lg text-red-500 hover:text-red-700 p-1 bg-transparent border-none outline-none"
                        >
                          📢
                        </button>
                      </div>
                  </div>

                  {/* Link clicável */}
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-indigo-700 mt-3 truncate hover:underline"
                  >
                    {l.url}
                  </a>

                  {/* Data e autor */}
                  <div className="flex justify-between text-sm text-gray-500 mt-4">
                    <span>{addedAt}</span>
                    <span>{authorName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <LoadMore
        hasMore={visibleCount < filteredFavs.length}
        onClick={handleLoadMore}
        />
      </main>
      

      {/* -------- FOOTER -------- */}
      <footer className="bg-gray-900 text-gray-300 text-center p-6 w-full">
        &copy; {new Date().getFullYear()} CompartilhaInfo. Todos os direitos reservados.
      </footer>

      {/* -------- MODAL DE DENÚNCIA -------- */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Reportar link</h3>
            <p className="mb-4 text-gray-700">Por que você quer reportar este link?</p>
            <div className="space-y-2">
              {['Fake News', 'Conteúdo Inapropriado', 'Link Quebrado', 'Outro'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReportSubmit(reason)}
                  className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-200 rounded"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={closeReportModal}
              className="mt-4 text-sm text-red-500 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
