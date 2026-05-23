import StepHeader from './shared/StepHeader.jsx';

const MODES = [
  {
    id: 'free',
    price: '₹0',
    label: 'Free Practice',
    questions: 5,
    time: '5 min',
    color: 'brand-orange',
    borderClass: 'border-brand-orange',
    bgClass: 'bg-brand-orange/5',
    badgeClass: 'bg-brand-orange text-white',
    icon: '🎯',
    features: [
      '5 AI-personalised questions',
      'Based on your CV + JD',
      'Timed per question (60s)',
      'Instant scorecard & feedback',
    ],
    available: true,
  },
  {
    id: 'standard',
    price: '₹49',
    label: 'Standard Mock',
    questions: 10,
    time: '15 min',
    color: 'blue-500',
    borderClass: 'border-brand-border',
    bgClass: '',
    badgeClass: 'bg-brand-border text-brand-muted',
    icon: '⚡',
    features: [
      '10 deeper questions',
      'Follow-up questions',
      'STAR method coaching',
      'Detailed improvement plan',
    ],
    available: false,
  },
  {
    id: 'full',
    price: '₹99',
    label: 'Full Mock Interview',
    questions: '15+',
    time: '30 min',
    color: 'yellow-500',
    borderClass: 'border-brand-border',
    bgClass: '',
    badgeClass: 'bg-brand-border text-brand-muted',
    icon: '🏆',
    features: [
      'Complete mock interview',
      'Behavioral + Technical',
      'Personalised STAR plan',
      'PDF feedback report',
    ],
    available: false,
  },
];

export default function ModeSelect({ profile, onContinue }) {
  return (
    <div className="min-h-screen bg-grid animate-fade-in">
      <StepHeader currentStep={4} />
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <p className="text-brand-muted text-sm mb-1">Almost there, {profile?.name?.split(' ')[0]} 👋</p>
          <h2 className="text-2xl font-bold text-white">Choose Your Interview Mode</h2>
          <p className="text-brand-muted mt-1">
            Start free — upgrade for a deeper, more comprehensive mock.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {MODES.map(mode => (
            <div
              key={mode.id}
              className={`card p-6 flex flex-col transition-all duration-200 relative ${mode.borderClass} ${mode.bgClass} ${
                !mode.available ? 'opacity-60' : ''
              } ${mode.available ? 'hover:scale-[1.02]' : ''}`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${mode.badgeClass}`}>
                  {mode.available ? 'Free Tier' : 'Coming Soon'}
                </span>
                <span className="text-2xl">{mode.icon}</span>
              </div>

              {/* Price + label */}
              <div className="mb-1">
                <span className={`text-3xl font-black ${mode.available ? 'text-brand-orange' : 'text-brand-muted'}`}>
                  {mode.price}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{mode.label}</h3>
              <div className="flex items-center gap-3 text-brand-muted text-sm mb-5">
                <span>{mode.questions} questions</span>
                <span className="w-1 h-1 rounded-full bg-brand-border" />
                <span>{mode.time}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-6">
                {mode.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={mode.available ? 'text-brand-teal' : 'text-brand-border'}>
                      {mode.available ? '✓' : '○'}
                    </span>
                    <span className={mode.available ? 'text-white' : 'text-brand-muted'}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {mode.available ? (
                <button
                  onClick={onContinue}
                  className="btn-primary w-full glow-orange"
                >
                  Start Free Mock →
                </button>
              ) : (
                <button disabled className="w-full py-3 rounded-xl text-sm font-medium border border-brand-border text-brand-muted cursor-not-allowed">
                  Coming Soon
                </button>
              )}

              {/* Recommended badge */}
              {mode.available && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Start Here
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* What happens next */}
        <div className="card p-5 border-brand-border/60">
          <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider mb-3">
            What happens next
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '🤖', title: 'AI Generates Questions', desc: 'Claude analyses your CV + JD to create 5 personalised questions' },
              { icon: '⏱️', title: 'You Answer Each One', desc: '60 seconds per question — type your best answer' },
              { icon: '📊', title: 'Instant Scorecard', desc: 'Get a score, per-question feedback, strengths & improvements' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="text-white text-xs font-semibold mb-1">{title}</p>
                <p className="text-brand-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
