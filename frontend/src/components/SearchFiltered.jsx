// src/components/SearchFiltered.jsx

export default function SearchFiltered({
  filterBy,
  onFilterChange,
  searchTerm,
  onSearchTermChange,
  onClear,
}) {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-4 flex items-center space-x-4">
      <select
        value={filterBy}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
      >
        <option value="title">Título</option>
        <option value="user">Autor</option>
        <option value="date">Data</option>
      </select>

      <input
        type="text"
        placeholder={`Buscar por ${
          filterBy === 'title'
            ? 'título'
            : filterBy === 'user'
            ? 'autor'
            : 'data (DD/MM/AAAA)'
        }`}
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}
