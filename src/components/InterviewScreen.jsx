import { useState, useEffect, useRef, useCallback } from 'react';

const QUESTION_TIME = 60;

function Timer({ timeLeft }) {
  const pct = (timeLeft / QUESTION_TIME) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className={`flex items-center gap-3 ${isWarning ? 'animate-timer-warn' : ''}`}>
      {/* Circle */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="#1E3550" strokeWidth="4" />
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke={isCritical ? '#EF4444' : isWarning ? '#F97316' : '#00C49A'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
          />
        </svg>
        <div
          className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${
            isCritical ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-brand-teal'
          }`}
        >
          {timeLeft}
        </div>
      </div>

      <div>
        <p className={`text-xs font-semibold ${isCritical ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-brand-muted'}`}>
          {isCritical ? '⚡ Wrap it up!' : isWarning ? '⏳ Almost out of time' : 'Time remaining'}
        </p>
        <p className="text-white text-sm font-medium">{timeLeft} seconds</p>
      </div>
    </div>
  );
}

export default function InterviewScreen({ questions, profile, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [skipped, setSkipped] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const question = questions[current];
  const answer = answers[question?.id] || '';
  const isLast = current === questions.length - 1;

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    setSkipped(false);
  }, [current]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // Auto-advance when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      setSkipped(true);
    }
  }, [timeLeft]);

  const advance = useCallback(() => {
    const finalAnswers = { ...answers };
    if (isLast) {
      onCompleteRef.current(finalAnswers);
    } else {
      setCurrent(c => c + 1);
    }
  }, [answers, isLast]);

  function handleAnswer(text) {
    setAnswers(prev => ({ ...prev, [question.id]: text }));
  }

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-grid flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="px-4 pt-5 pb-4 border-b border-brand-border bg-brand-navy/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-xs">
                TP
              </div>
              <span className="text-white font-bold text-sm">Mock Interview</span>
            </div>
            <div className="flex items-center gap-2 text-brand-muted text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Session
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-brand-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-xs font-semibold whitespace-nowrap">
              Q{current + 1} / {questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8">
        {/* Question card */}
        <div className="card p-6 mb-6 animate-slide-up" key={current}>
          {/* Question meta */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Question {current + 1}
            </span>
            {question?.type && (
              <span className="bg-brand-border text-brand-muted text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                {question.type}
              </span>
            )}
          </div>

          {/* Question text */}
          <p className="text-white text-lg font-semibold leading-relaxed mb-5">
            {question?.question}
          </p>

          {/* Timer */}
          <div className="flex items-center justify-between">
            <Timer timeLeft={timeLeft} />
            {timeLeft === 0 && (
              <span className="text-brand-muted text-xs">Time's up — answer saved</span>
            )}
          </div>
        </div>

        {/* Hint */}
        {question?.hint && (
          <div className="flex items-start gap-2 mb-4 px-1 animate-fade-in">
            <span className="text-brand-teal text-sm mt-0.5">💡</span>
            <p className="text-brand-muted text-sm leading-relaxed">
              <span className="text-brand-teal font-medium">Tip: </span>
              {question.hint}
            </p>
          </div>
        )}

        {/* Answer area */}
        <div className="flex-1 flex flex-col animate-slide-up">
          <label className="label mb-2">Your Answer</label>
          <textarea
            value={answer}
            onChange={e => handleAnswer(e.target.value)}
            placeholder="Start typing your answer here. Be specific — use real examples from your experience or studies.

For example: 'In my final year project, I led a team of 4 students to build...' or 'During my internship at XYZ, I was responsible for...'"
            className="input-field flex-1 min-h-[200px] resize-none text-sm leading-relaxed"
            autoFocus
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-brand-muted text-xs">{answer.length} characters</span>
            {answer.length < 50 && answer.length > 0 && (
              <span className="text-brand-orange text-xs">Add more detail for a better score</span>
            )}
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={advance}
            className={`btn-primary flex-1 text-base ${isLast ? 'glow-orange' : ''}`}
          >
            {isLast ? '🏁  Submit & See Results' : 'Next Question →'}
          </button>
        </div>

        {skipped && !answer && (
          <p className="text-center text-brand-muted text-xs mt-3">
            No answer recorded for this question — you can still click Next.
          </p>
        )}
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-2 pb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-brand-orange'
                : answers[questions[i]?.id]
                ? 'w-2 h-2 bg-brand-teal'
                : 'w-2 h-2 bg-brand-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
