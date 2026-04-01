'use client'; // Esto le dice a Next.js que este componente corre en el navegador

import { useState } from 'react';

export function UrlInput({ onPostFetched }: { onPostFetched: (data: any) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFetch = async () => {
    // Validar que haya una URL
    if (!url) {
      setError('Por favor ingresa una URL');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Hacemos la petición a nuestra API que creamos antes
      const response = await fetch('/api/fetch-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Llamamos a la función que nos pasó el componente padre
        onPostFetched(result.data);
      } else {
        setError(result.error || 'Error al obtener el post');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="url-input-container">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Pega aquí el link de Instagram, Facebook o X"
        className="url-input"
      />
      
      <button 
        onClick={handleFetch}
        disabled={loading}
        className="fetch-button"
      >
        {loading ? 'Obteniendo...' : 'Obtener Post'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}