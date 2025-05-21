// src/components/LoadMore.jsx
export default function LoadMore({ hasMore, onClick }) {
  if (!hasMore) return null;

  return (
    <div className="text-center mt-6">
      <button
        onClick={onClick}
        className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition"
      >
        Ver mais
      </button>
    </div>
  );
}
