const LOADING_TIPS = [
  'Analyzing your profile against the job description...',
  'Crafting questions tailored to your experience level...',
  'Reviewing key skills from your resume...',
  'Preparing your personalized interview...',
  'Almost ready — your interview is being set up...',
];

export default function LoadingOverlay({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/90 backdrop-blur-sm animate-fade-in">
      <div className="card p-8 max-w-sm mx-4 text-center">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-orange animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-brand-teal animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
        </div>

        <p className="text-white font-semibold text-lg mb-2">
          {message || 'Processing...'}
        </p>
        <p className="text-brand-muted text-sm">
          Powered by Claude AI — this may take a few seconds
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-orange opacity-80 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
