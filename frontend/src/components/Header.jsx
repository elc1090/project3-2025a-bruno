// src/components/Header.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header({ activeView, userEmail, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="relative w-full bg-gradient-to-r from-blue-800 to-indigo-600 text-white shadow-xl">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Título */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/links')}
        >
          <img
            src="logo2.png"
            alt="Logo Compartilha Info"
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-wide">
            CompartilhaInfo
          </span>
        </div>

        {/* -- Itens de Menu em Desktop -- */}
        <nav className="hidden md2:flex items-center space-x-8">
          <button
            onClick={() => navigate('/links')}
            className={`flex items-center space-x-1 uppercase text-sm font-medium transition duration-200 ${
              activeView === 'all'
                ? 'border-b-2 border-white pb-1'
                : 'hover:text-gray-200'
            }`}
          >
            <span>Todos os Links</span>
          </button>
          <button
            onClick={() => navigate('/my-links')}
            className={`flex items-center space-x-1 uppercase text-sm font-medium transition duration-200 ${
              activeView === 'mine'
                ? 'border-b-2 border-white pb-1'
                : 'hover:text-gray-200'
            }`}
          >
            <span>Meus Links</span>
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className={`flex items-center space-x-1 uppercase text-sm font-medium transition duration-200 ${
              activeView === 'favorites'
                ? 'border-b-2 border-white pb-1'
                : 'hover:text-gray-200'
            }`}
          >
            <span>Favoritos</span>
          </button>
          <span className="ml-8 text-sm">
            <strong className="text-indigo-200">{userEmail}</strong>
          </span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 uppercase text-sm font-medium hover:text-gray-200 transition duration-200"
          >
            <span>Sair</span>
          </button>    
        </nav>

        {/* -- Botão Hamburger (Mobile) -- */}
        <button
          className="md2:hidden focus:outline-none z-20"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ==== MENU MOBILE FULLSCREEN OVERLAY ==== */}
      {isMobileMenuOpen && (
        <>
          {/* Fundo semitransparente */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Painel lateral */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20 transform transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <span className="text-xl font-bold text-gray-800">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4 px-6 py-6">
              <button
                onClick={() => {
                  navigate('/links')
                  setIsMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-2 text-gray-300 hover:text-indigo-600 transition duration-200 ${
                  activeView === 'all' ? 'font-semibold' : ''
                }`}
              >
                <span>Todos os Links</span>
              </button>

              <button
                onClick={() => {
                  navigate('/my-links')
                  setIsMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-2 text-gray-300 hover:text-indigo-600 transition duration-200 ${
                  activeView === 'mine' ? 'font-semibold' : ''
                }`}
              >
                <span>Meus Links</span>
              </button>

              <button
                onClick={() => {
                  navigate('/favorites')
                  setIsMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-2 text-gray-300 hover:text-indigo-600 transition duration-200 ${
                  activeView === 'favorites' ? 'font-semibold' : ''
                }`}
              >
                <span>Favoritos</span>
              </button>

              <button
                onClick={() => {
                  onLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2 text-gray-300 hover:text-indigo-600 transition duration-200"
              >
                <span>Sair</span>
              </button>

              <div className="pt-6 border-t mt-4">
                <span className="block text-gray-500 text-sm">
                  <strong>{userEmail}</strong>
                </span>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
