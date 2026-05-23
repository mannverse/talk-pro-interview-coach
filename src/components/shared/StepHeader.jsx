const STEP_LABELS = ['Profile', 'Job Description', 'Resume', 'Mode', 'Interview', 'Results'];

export default function StepHeader({ currentStep }) {
  return (
    <header className="w-full px-4 pt-6 pb-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center text-white font-black text-sm">
            TP
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tight">
              TALK <span className="text-brand-orange">PRO</span>
            </p>
            <p className="text-brand-muted text-xs leading-none">Interview Coach</p>
          </div>
        </div>

        {/* Step progress dots */}
        {currentStep > 0 && currentStep <= STEP_LABELS.length && (
          <div className="flex items-center gap-2">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`step-dot ${
                        isActive
                          ? 'w-4 h-2 bg-brand-orange rounded-full'
                          : isCompleted
                          ? 'bg-brand-teal'
                          : 'bg-brand-border'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium hidden sm:block ${
                        isActive ? 'text-brand-orange' : isCompleted ? 'text-brand-teal' : 'text-brand-border'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`h-px w-6 sm:w-10 flex-shrink-0 mb-4 sm:mb-5 ${
                        isCompleted ? 'bg-brand-teal' : 'bg-brand-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
