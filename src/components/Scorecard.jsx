import { useState } from 'react';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreCircle({ score }) {
  const targetOffset = CIRCUMFERENCE * (1 - score / 100);
  const color = score >= 75 ? '#00C49A' : score >= 50 ? '#FF6B35' : '#EF4444';

  return (
    <div className="relative w-36 h-36 mx-auto">
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-ring opacity-30"
        style={{ border: `3px solid ${color}` }}
      />
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#1E3550" strokeWidth="8" />
        <circle
          className="score-circle-progress"
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ '--target-offset': `${targetOffset}px` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-brand-muted text-xs font-medium">/ 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max = 10, color = '#FF6B35' }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-brand-muted text-xs">{label}</span>
        <span className="text-white text-xs font-bold">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(value / max) * 100}%`,
            background: color,
            transitionDelay: '0.3s',
          }}
        />
      </div>
    </div>
  );
}

export default function Scorecard({ results, profile, questions, answers, onRestart }) {
  const [expanded, setExpanded] = useState(null);

  if (!results) return null;

  const {
    overallScore = 0,
    jdMatchPercent = 0,
    questionFeedback = [],
    strengths = [],
    improvements = [],
    overallFeedback = '',
  } = results;

  const grade =
    overallScore >= 85 ? { label: 'Excellent', color: 'text-brand-teal', bg: 'bg-brand-teal/10 border-brand-teal/30' } :
    overallScore >= 70 ? { label: 'Good', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' } :
    overallScore >= 55 ? { label: 'Fair', color: 'text-brand-orange', bg: 'bg-brand-orange/10 border-brand-orange/30' } :
    { label: 'Needs Practice', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' };

  return (
    <div className="min-h-screen bg-grid animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-brand-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-xs">
              TP
            </div>
            <div>
              <p className="text-white font-black text-base leading-none">
                TALK <span className="text-brand-orange">PRO</span>
              </p>
              <p className="text-brand-muted text-xs">Interview Results</p>
            </div>
          </div>
          <button onClick={onRestart} className="btn-secondary text-sm py-2 px-4">
            Try Again
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Hero score card */}
        <div className="card p-8 text-center animate-slide-up">
          <p className="text-brand-muted text-sm mb-1">
            {profile?.name}'s Interview Score
          </p>
          <h2 className="text-xl font-bold text-white mb-6">
            {profile?.targetRole} · {profile?.interviewStage}
          </h2>

          <ScoreCircle score={overallScore} />

          <div className={`inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full border text-sm font-bold ${grade.bg} ${grade.color}`}>
            {grade.label}
          </div>

          {overallFeedback && (
            <p className="text-brand-muted text-sm leading-relaxed mt-4 max-w-sm mx-auto">
              {overallFeedback}
            </p>
          )}

          {/* JD Match */}
          <div className="mt-6 p-4 bg-brand-navy rounded-xl border border-brand-border inline-block min-w-[200px]">
            <p className="text-brand-muted text-xs mb-2">JD Match Score</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-brand-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${jdMatchPercent}%`,
                    background: 'linear-gradient(90deg, #FF6B35, #00C49A)',
                    transitionDelay: '0.5s',
                  }}
                />
              </div>
              <span className="text-white font-bold text-sm whitespace-nowrap">{jdMatchPercent}%</span>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-teal/20 flex items-center justify-center text-brand-teal text-sm">
                ✓
              </div>
              <h3 className="text-white font-bold">3 Key Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange text-sm">
                ↑
              </div>
              <h3 className="text-white font-bold">3 Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white text-sm leading-relaxed">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Per-question feedback */}
        <div className="card p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>📝</span> Question-by-Question Feedback
          </h3>
          <div className="space-y-3">
            {questionFeedback.map((qf, i) => {
              const q = questions.find(q => q.id === qf.questionId) || questions[i];
              const isOpen = expanded === i;
              return (
                <div key={i} className="bg-brand-navy rounded-xl border border-brand-border overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-brand-border/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <span className="w-6 h-6 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted text-xs font-bold flex-shrink-0">
                        Q{i + 1}
                      </span>
                      <span className="text-white text-sm font-medium truncate">
                        {q?.question || `Question ${i + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`text-sm font-bold ${
                          qf.score >= 8 ? 'text-brand-teal' : qf.score >= 6 ? 'text-brand-orange' : 'text-red-400'
                        }`}
                      >
                        {qf.score}/10
                      </span>
                      <span className={`text-brand-muted text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-brand-border animate-fade-in">
                      {/* The answer they gave */}
                      {answers[qf.questionId] && (
                        <div className="mb-4">
                          <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider mb-1.5">Your Answer</p>
                          <p className="text-brand-muted text-sm leading-relaxed bg-brand-card rounded-lg p-3 italic">
                            "{answers[qf.questionId]}"
                          </p>
                        </div>
                      )}

                      {/* Score breakdown */}
                      {qf.scores && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <ScoreBar label="Relevance" value={qf.scores.relevance} />
                          <ScoreBar label="Examples Used" value={qf.scores.examples} />
                          <ScoreBar label="Clarity & Structure" value={qf.scores.clarity} color="#00C49A" />
                          <ScoreBar label="Confidence" value={qf.scores.confidence} color="#00C49A" />
                        </div>
                      )}

                      {/* AI feedback */}
                      <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-lg p-3">
                        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-1">
                          AI Feedback
                        </p>
                        <p className="text-white text-sm leading-relaxed">{qf.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="card p-6 bg-gradient-to-br from-brand-card to-brand-navy border-brand-orange/30 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-3">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">Upgrade Coming Soon</span>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">
            Want a Full 30-Min Mock Interview?
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed mb-5 max-w-sm mx-auto">
            Get 15+ questions, a personalised STAR method improvement plan, and a downloadable PDF report — all for ₹99.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3 rounded-xl opacity-60 cursor-not-allowed"
          >
            🔓 Unlock Full Feedback — ₹99
          </button>
          <p className="text-brand-border text-xs mt-2">Feature launching soon · Stay tuned</p>
        </div>

        {/* Retry */}
        <div className="flex gap-3">
          <button onClick={onRestart} className="btn-secondary flex-1 text-sm">
            Practice Again with a New Role
          </button>
        </div>
      </div>
    </div>
  );
}
