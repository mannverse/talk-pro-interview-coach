import { useState } from 'react';

export default function ApiKeyPrompt({ onSubmit }) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('API key should start with "sk-ant-". Get yours at console.anthropic.com');
      return;
    }
    setError('');
    onSubmit(trimmed);
  }

  return (
    <div className="min-h-screen bg-grid flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-black text-lg glow-orange">
          TP
        </div>
        <div>
          <p className="text-white font-black text-2xl leading-none tracking-tight">
            TALK <span className="text-brand-orange">PRO</span>
          </p>
          <p className="text-brand-muted text-sm leading-none mt-0.5">with Aman · Interview Coach</p>
        </div>
      </div>

      <div className="card w-full max-w-md p-8 animate-slide-up">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-brand-orange text-xs font-semibold uppercase tracking-widest">
              AI-Powered Mock Interviews
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Ace Your Next Interview
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            Get personalized questions based on your CV and job description, then receive instant AI feedback on your answers.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: '🎯', label: 'Role-specific\nQuestions' },
            { icon: '⏱️', label: 'Timed\nPractice' },
            { icon: '📊', label: 'Instant\nScorecard' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-brand-navy rounded-xl p-3 text-center border border-brand-border">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-brand-muted text-xs leading-tight whitespace-pre-line">{label}</p>
            </div>
          ))}
        </div>

        {/* API Key form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              Claude API Key
              <span className="ml-1 text-brand-orange">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={e => { setKey(e.target.value); setError(''); }}
                placeholder="sk-ant-api03-..."
                className="input-field pr-12 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors text-lg"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
            <p className="text-brand-muted text-xs mt-1.5">
              Your key is never stored — it only lives in your browser session.{' '}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange hover:underline"
              >
                Get a free key →
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={!key.trim()}
            className="btn-primary w-full text-base"
          >
            Start Interview Prep →
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-brand-muted text-xs mt-6 text-center max-w-xs">
        Built for students &amp; freshers in India · Powered by Anthropic Claude
      </p>
    </div>
  );
}
