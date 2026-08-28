'use client';

import { useState } from 'react';

type ToolState = 'idle' | 'input-streaming' | 'input-available' | 'output-available' | 'output-error';

export default function Home() {
  const [input, setInput] = useState('');
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [toolData, setToolData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRunTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Stanje: input-streaming
    setToolState('input-streaming');
    setErrorMessage('');
    setToolData(null);

    await new Promise((r) => setTimeout(r, 600));

    // 2. Stanje: input-available
    setToolState('input-available');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Izvršavanje alata nije uspjelo');
      }

      // 3. Stanje: output-available
      setToolData(data);
      setToolState('output-available');
    } catch (err: any) {
      // 4. Stanje: output-error
      setErrorMessage(err.message);
      setToolState('output-error');
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ fontSize: '1.4rem', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        FE-07: Tool Results & Structured UI (Lead Scoring)
      </h1>

      <form onSubmit={handleRunTool} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Npr. Analiziraj Acme Corp sa 100 zaposlenih (ili 'FAIL Corp' za test greške)"
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Pokreni alat
        </button>
      </form>

      {/* STROJ STANJA (4 VIZUELNA TRETMANA) */}
      <div style={{ transition: 'all 0.2s ease-in-out' }}>
        {/* STANJE 1: input-streaming */}
        {toolState === 'input-streaming' && (
          <div style={{ padding: '16px', background: '#EEF2FF', borderRadius: '8px', color: '#4338CA' }}>
            ⏳ <strong>[input-streaming]</strong> Prikupljanje i strujanje ulaznih podataka...
          </div>
        )}

        {/* STANJE 2: input-available */}
        {toolState === 'input-available' && (
          <div style={{ padding: '16px', background: '#FEF3C7', borderRadius: '8px', color: '#92400E' }}>
            ⚙️ <strong>[input-available]</strong> Alat <code>scoreLead</code> započinje obradu s ulaznim parametrima...
          </div>
        )}

        {/* STANJE 3: output-available (UI Komponenta / Kartica) */}
        {toolState === 'output-available' && toolData && (
          <div style={{ padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{toolData.input.companyName}</h3>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                background: toolData.output.tier === 'Hot' ? '#D1FAE5' : '#FEF3C7',
                color: toolData.output.tier === 'Hot' ? '#065F46' : '#92400E'
              }}>
                {toolData.output.tier} Prospect
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4F46E5', fontSize: '1.2rem' }}>
                {toolData.output.score}
              </div>
              <p style={{ margin: 0, color: '#4B5563', fontSize: '0.95rem' }}>{toolData.output.summary}</p>
            </div>

            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#6B7280' }}>
              {toolData.output.keyFactors.map((factor: string, i: number) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          </div>
        )}

        {/* STANJE 4: output-error (Dizajnirano stanje greške) */}
        {toolState === 'output-error' && (
          <div style={{ padding: '16px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B' }}>
            <h4 style={{ margin: '0 0 6px 0' }}>⚠️ Greška pri izvršavanju alata (output-error)</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{errorMessage}</p>
          </div>
        )}
      </div>
    </main>
  );
}