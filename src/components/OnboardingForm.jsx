import { useState } from 'react';
import StepHeader from './shared/StepHeader.jsx';

const USER_TYPES = [
  { value: 'student', label: 'Student', desc: 'Still in college / school', icon: '🎓' },
  { value: 'fresher', label: 'Fresher', desc: '0–1 year of experience', icon: '🌱' },
  { value: 'experienced', label: 'Working', desc: 'Has work experience', icon: '💼' },
];

const COMPANY_TYPES = ['Startup', 'MNC', 'Government / PSU', 'Product Company', 'Agency / Consultancy'];
const INTERVIEW_STAGES = ['HR Round', 'Technical Round', 'Leadership Round', 'Not yet scheduled'];

export default function OnboardingForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    userType: '',
    yearsExp: '',
    targetRole: '',
    companyType: '',
    interviewStage: '',
  });
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email';
    if (!form.userType) errs.userType = 'Please select your experience level';
    if (form.userType === 'experienced' && !form.yearsExp)
      errs.yearsExp = 'Please enter years of experience';
    if (!form.targetRole.trim()) errs.targetRole = 'Please enter your target role';
    if (!form.companyType) errs.companyType = 'Please select a company type';
    if (!form.interviewStage) errs.interviewStage = 'Please select your interview stage';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  }

  return (
    <div className="min-h-screen bg-grid animate-fade-in">
      <StepHeader currentStep={1} />
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Tell us about yourself</h2>
          <p className="text-brand-muted mt-1">We'll use this to personalise your interview questions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="input-field"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Email ID</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="priya@email.com"
                className="input-field"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Experience level */}
          <div>
            <label className="label">Your Experience Level</label>
            <div className="grid grid-cols-3 gap-3">
              {USER_TYPES.map(({ value, label, desc, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('userType', value)}
                  className={`card p-4 text-left transition-all duration-200 hover:border-brand-orange/60 ${
                    form.userType === value
                      ? 'border-brand-orange bg-brand-orange/10 glow-orange'
                      : ''
                  }`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className={`font-semibold text-sm ${form.userType === value ? 'text-brand-orange' : 'text-white'}`}>
                    {label}
                  </p>
                  <p className="text-brand-muted text-xs mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            {errors.userType && <p className="text-red-400 text-xs mt-1">{errors.userType}</p>}
          </div>

          {/* Years of experience — conditional */}
          {form.userType === 'experienced' && (
            <div className="animate-slide-up">
              <label className="label">Years of Work Experience</label>
              <input
                type="number"
                min="1"
                max="40"
                value={form.yearsExp}
                onChange={e => set('yearsExp', e.target.value)}
                placeholder="e.g. 3"
                className="input-field max-w-[160px]"
              />
              {errors.yearsExp && <p className="text-red-400 text-xs mt-1">{errors.yearsExp}</p>}
            </div>
          )}

          {/* Target role */}
          <div>
            <label className="label">Target Role</label>
            <input
              type="text"
              value={form.targetRole}
              onChange={e => set('targetRole', e.target.value)}
              placeholder="e.g. Marketing Executive, Software Developer, Data Analyst"
              className="input-field"
            />
            {errors.targetRole && <p className="text-red-400 text-xs mt-1">{errors.targetRole}</p>}
          </div>

          {/* Company type */}
          <div>
            <label className="label">Target Company Type</label>
            <div className="flex flex-wrap gap-2">
              {COMPANY_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set('companyType', type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    form.companyType === type
                      ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                      : 'border-brand-border text-brand-muted hover:border-brand-orange/50 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.companyType && <p className="text-red-400 text-xs mt-1">{errors.companyType}</p>}
          </div>

          {/* Interview stage */}
          <div>
            <label className="label">Interview Stage</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {INTERVIEW_STAGES.map(stage => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => set('interviewStage', stage)}
                  className={`p-3 rounded-xl text-sm font-medium border text-center transition-all duration-200 ${
                    form.interviewStage === stage
                      ? 'bg-brand-teal/10 border-brand-teal text-brand-teal'
                      : 'border-brand-border text-brand-muted hover:border-brand-teal/50 hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
            {errors.interviewStage && <p className="text-red-400 text-xs mt-1">{errors.interviewStage}</p>}
          </div>

          <button type="submit" className="btn-primary w-full text-base mt-2">
            Continue — Add Job Description →
          </button>
        </form>
      </div>
    </div>
  );
}
