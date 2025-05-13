// src/pages/LinksPage.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function LinksPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    api.get('/links')
       .then(res => setLinks(res.data))
       .catch(err => console.error(err));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Meus Links</h1>
      {links.length === 0 ? (
        <p>Nenhum link cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {links.map(l => (
            <li key={l.id} className="border p-2 rounded">
              <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600">
                {l.titulo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
