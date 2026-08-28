'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Sistemska greška na ruti:', error);
  }, [error]);

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '24px', borderRadius: '12px', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ color: '#991B1B', marginTop: 0 }}>Došlo je do neočekivane greške</h2>
        <p style={{ color: '#7F1D1D', fontSize: '0.95rem' }}>
          {error.message || 'Ruta je naišla na problem koji nije mogao biti obrađen.'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: '12px',
            padding: '10px 18px',
            background: '#DC2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Pokušaj ponovo (Reset)
        </button>
      </div>
    </div>
  );
}