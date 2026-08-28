'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState<'normal' | 'rate-limit' | 'server-error'>('normal');

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, testMode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Došlo je do greške prilikom generisanja.');
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Mrežna greška ili prekid veze.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      setError(null);
      sendMessage(lastUserMessage.text);
    }
  };

  return (
    <main style={{
      maxWidth: '680px',
      margin: '0 auto',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      {/* HEADER & SABOTAGE CONTROLS */}
      <header style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.25rem', margin: '0 0 8px 0', fontWeight: 600 }}>FE-08: AI Flow & Edge Cases</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
          <span>Testiraj sabotažu:</span>
          <select
            value={testMode}
            onChange={(e: any) => setTestMode(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
          >
            <option value="normal">Normalan rad (Happy Path)</option>
            <option value="rate-limit">Rate Limit (429 Error)</option>
            <option value="server-error">Mid-Stream Prekid (500 Error)</option>
          </select>
        </div>
      </header>

      {/* CHAT CONTAINER */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* EMPTY STATE (ONBOARDING) */}
        {messages.length === 0 && !isLoading && (
          <div style={{
            margin: 'auto 0',
            padding: '32px 20px',
            textAlign: 'center',
            background: '#F9FAFB',
            borderRadius: '16px',
            border: '1px dashed #D1D5DB'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>Nema aktivnih razgovora</h3>
            <p style={{ margin: '0 0 16px 0', color: '#6B7280', fontSize: '0.9rem' }}>
              Započnite razgovor odabirom jednog od predloženih pitanja:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px', margin: '0 auto' }}>
              {[
                'Analiziraj kvalifikaciju novog klijenta',
                'Kako obraditi greške u prenosu podataka?',
                'Napiši primjer Zod verifikacije za AI alate'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(suggestion)}
                  style={{
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#374151',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  💡 {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES LIST */}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: m.role === 'user' ? '#4F46E5' : '#F3F4F6',
              color: m.role === 'user' ? '#FFFFFF' : '#1F2937',
              fontSize: '0.95rem'
            }}
          >
            {m.text}
          </div>
        ))}

        {/* SKELETON LOADING STATE (Zero CLS) */}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            width: '60%',
            padding: '16px',
            borderRadius: '12px',
            background: '#F3F4F6',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ height: '12px', background: '#E5E7EB', borderRadius: '4px', width: '90%' }} />
            <div style={{ height: '12px', background: '#E5E7EB', borderRadius: '4px', width: '40%' }} />
          </div>
        )}

        {/* DESIGNED ERROR STATE WITH RETRY */}
        {error && (
          <div style={{
            padding: '14px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '10px',
            color: '#991B1B',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem'
          }}>
            <span>⚠️ {error}</span>
            <button
              onClick={handleRetry}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                background: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Pokušaj ponovo
            </button>
          </div>
        )}
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #E5E7EB', marginTop: '12px' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napišite poruku..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '16px'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 20px',
            background: isLoading || !input.trim() ? '#9CA3AF' : '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 600
          }}
        >
          Pošalji
        </button>
      </form>
    </main>
  );
}