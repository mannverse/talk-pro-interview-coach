import { useState } from 'react';
import ApiKeyPrompt from './components/ApiKeyPrompt.jsx';
import OnboardingForm from './components/OnboardingForm.jsx';
import JDUpload from './components/JDUpload.jsx';
import CVUpload from './components/CVUpload.jsx';
import ModeSelect from './components/ModeSelect.jsx';
import InterviewScreen from './components/InterviewScreen.jsx';
import Scorecard from './components/Scorecard.jsx';
import LoadingOverlay from './components/shared/LoadingOverlay.jsx';
import { generateQuestions, evaluateAnswers } from './utils/claudeApi.js';

const STEP = {
  API_KEY: 0,
  ONBOARDING: 1,
  JD_UPLOAD: 2,
  CV_UPLOAD: 3,
  MODE_SELECT: 4,
  INTERVIEW: 5,
  SCORECARD: 6,
};

export default function App() {
  const [step, setStep] = useState(STEP.API_KEY);
  const [apiKey, setApiKey] = useState('');
  const [profile, setProfile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [cvText, setCvText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');

  async function handleModeSelect() {
    setLoading(true);
    setLoadingMsg('Claude is analysing your CV and job description...');
    setError('');
    try {
      setTimeout(() => setLoadingMsg('Crafting 5 personalised questions for you...'), 2500);
      const qs = await generateQuestions(apiKey, profile, cvText, jdText);
      setQuestions(qs);
      setStep(STEP.INTERVIEW);
    } catch (err) {
      setError(
        err.message?.includes('API key')
          ? 'Invalid API key. Please go back and enter a valid Claude API key.'
          : err.message || 'Something went wrong generating questions. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleInterviewComplete(answersData) {
    setAnswers(answersData);
    setLoading(true);
    setLoadingMsg('Evaluating your answers...');
    setError('');
    try {
      setTimeout(() => setLoadingMsg('Generating your personalised scorecard...'), 2500);
      const evalResults = await evaluateAnswers(apiKey, questions, answersData, profile, jdText, cvText);
      setResults(evalResults);
      setStep(STEP.SCORECARD);
    } catch (err) {
      setError(err.message || 'Could not evaluate answers. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setStep(STEP.ONBOARDING);
    setProfile(null);
    setJdText('');
    setCvText('');
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setError('');
  }

  return (
    <div className="min-h-screen bg-brand-navy">
      {loading && <LoadingOverlay message={loadingMsg} />}

      {error && (
        <div className="fixed top-4 inset-x-4 mx-auto max-w-md z-50 animate-slide-up">
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-xl p-4 flex items-start gap-3 shadow-xl backdrop-blur-sm">
            <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">Something went wrong</p>
              <p className="text-xs mt-0.5 opacity-80">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-white text-sm flex-shrink-0 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {step === STEP.API_KEY && (
        <ApiKeyPrompt onSubmit={key => { setApiKey(key); setStep(STEP.ONBOARDING); }} />
      )}
      {step === STEP.ONBOARDING && (
        <OnboardingForm onSubmit={p => { setProfile(p); setStep(STEP.JD_UPLOAD); }} />
      )}
      {step === STEP.JD_UPLOAD && (
        <JDUpload onSubmit={text => { setJdText(text); setStep(STEP.CV_UPLOAD); }} />
      )}
      {step === STEP.CV_UPLOAD && (
        <CVUpload onSubmit={text => { setCvText(text); setStep(STEP.MODE_SELECT); }} />
      )}
      {step === STEP.MODE_SELECT && (
        <ModeSelect profile={profile} onContinue={handleModeSelect} />
      )}
      {step === STEP.INTERVIEW && (
        <InterviewScreen
          questions={questions}
          profile={profile}
          onComplete={handleInterviewComplete}
        />
      )}
      {step === STEP.SCORECARD && (
        <Scorecard
          results={results}
          profile={profile}
          questions={questions}
          answers={answers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
