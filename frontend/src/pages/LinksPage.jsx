// src/pages/LinksPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import LinkForm from '../components/LinkForm'
import SearchFiltered from '../components/SearchFiltered';
import LoadMore from '../components/LoadMore'
import Header from '../components/Header';

export default function LinksPage({ view }) {
  const [links, setLinks] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editUrl, setEditUrl] = useState('')
  const [editTitulo, setEditTitulo] = useState('')
  const navigate = useNavigate()
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('title'); 
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Pega o e‑mail do usuário logado em localStorage
  const userEmail = localStorage.getItem('userEmail') || 'Usuário'

  // Determina qual endpoint usar
  const endpoint = view === 'mine' ? '/my-links' : view === 'favorites'? '/favorites': '/links'

  // Carrega os links
  const loadLinks = () => {
    api.get(endpoint)
      .then(res => setLinks(res.data))
      .catch(err => console.error(err))
  }
   // Carrega também a lista de favoritos (só IDs) do usuário
  const loadFavorited = () => {
    api.get('/favorites')
      .then(res => {
        const ids = new Set(res.data.map(linkObj => linkObj.id));
        setFavoritedIds(ids);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadLinks();
    loadFavorited();
  }, [view]); // toda vez que mudar “view” (all ou mine), recarrega lista e favoritos

    /********** FUNÇÕES DE FAVORITO/DESFAVORITO **********/
  const handleToggleFavorite = async (linkId) => {
    if (favoritedIds.has(linkId)) {
      // se já favoritado → desfavorita
      await api.delete(`/favorites/${linkId}`);
    } else {
      // se não for favoritado ainda → adiciona aos favoritos
      await api.post(`/favorites/${linkId}`);
    }
    // atualiza a lista de favoritos
    loadFavorited();
  };

  // Exclui um link e recarrega a lista
  const handleDelete = async (id) => {
    await api.delete(`/links/${id}`)
    loadLinks()
    loadFavorited();
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
  // Abre modal de denúncia
  const openReportModal = (link) => {
    setReportTarget(link);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportTarget(null);
  };

  const handleReportSubmit = (reason) => {
    alert(`Obrigado por reportar o link "${reportTarget.titulo}" como "${reason}".`);
    closeReportModal();
  };

  // Filta os links com base no termo de busca e no tipo de filtro
  const filteredLinks = links.filter((l) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    if (filterBy === 'title') {
      return l.titulo.toLowerCase().includes(term);
    }
    if (filterBy === 'user') {
      const authorName = l.user_email.split('@')[0].toLowerCase();
      return authorName.includes(term);
    }
    if (filterBy === 'date') {
      const dateStr = new Date(l.data_adicao).toLocaleDateString('pt-BR');
      return dateStr.includes(term);
    }
    return true;
  });

  // Define o número de links a serem exibidos por vez
  const visibleLinks = filteredLinks.slice(0, visibleCount);

  // Função para carregar mais links
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };


  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      {/* Header padronizado */}
      <Header
        activeView={view}          
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      {/* Barra de pesquisa e filtro */}
      {/* Conteúdo */}
      <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-8 max-w-[1280px] mx-auto">
        {/* Formulário de criação */}
        <div className="bg-white rounded-lg shadow p-6 mb-10 border border-gray-200">
          <LinkForm onSuccess={loadLinks} />
        </div>
        /* Título da lista */
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {view === 'mine' ? 'Meus Links' : 'Todos os Links'}
        </h2>
        {/* Filtro e pesquisa */}
        <SearchFiltered
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
        {/* Grid de cards */}
        {filteredLinks.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            {view === 'mine'
              ? 'Você ainda não adicionou nenhum link.'
              : 'Nenhum link disponível.'}
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {visibleLinks.map((l) => {
              const authorName = l.user_email.split('@')[0];
              const addedAt = new Date(l.data_adicao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
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
              const isFav = favoritedIds.has(l.id);
              return (
                <div
                  key={l.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                   {/* Título + Botões de “favoritar” e “reportar” */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {l.titulo}
                    </h3>

                    <div className="flex items-center space-x-2">
                      {/* Ícone de favoritar / desfavoritar */}
                      <button
                        onClick={() => handleToggleFavorite(l.id)}
                        title={isFav ? 'Desfavoritar' : 'Adicionar aos Favoritos'}
                        className="text-lg text-yellow-600 hover:text-yellow-800 p-1 bg-transparent border-none outline-none"
                      >
                        {isFav ? '★' : '☆'}
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
        <LoadMore
          hasMore={visibleCount < filteredLinks.length}
          onClick={handleLoadMore}
        />
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
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-center p-6 w-full">
        &copy; {new Date().getFullYear()} CompartilhaInfo. Todos os direitos reservados.
      </footer>
    </div>
  );
}
