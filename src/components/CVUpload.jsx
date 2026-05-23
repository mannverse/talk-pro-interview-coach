import { useState, useRef } from 'react';
import StepHeader from './shared/StepHeader.jsx';
import { extractTextFromPDF } from '../utils/pdfParser.js';

export default function CVUpload({ onSubmit }) {
  const [cvText, setCvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileRef = useRef();

  async function processFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf') {
      setError('Please upload a PDF file (.pdf)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const extracted = await extractTextFromPDF(file);
      if (!extracted || extracted.length < 50) {
        throw new Error('Could not extract enough text. The PDF may be image-based.');
      }
      setCvText(extracted);
      setFileName(file.name);
    } catch (err) {
      setError(err.message || 'Could not read PDF. Please try a different file or paste your CV text below.');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!cvText.trim() || cvText.trim().length < 50) {
      setError('Please upload your resume or paste its content.');
      return;
    }
    onSubmit(cvText.trim());
  }

  return (
    <div className="min-h-screen bg-grid animate-fade-in">
      <StepHeader currentStep={3} />
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Upload Your Resume</h2>
          <p className="text-brand-muted mt-1">
            We'll extract your skills and experience to craft personalised questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Upload area */}
          <div
            className={`card p-10 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
              dragging
                ? 'border-brand-orange bg-brand-orange/10'
                : fileName
                ? 'border-brand-teal bg-brand-teal/5'
                : 'border-brand-border hover:border-brand-orange/50'
            }`}
            onClick={() => !fileName && fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-orange animate-spin" />
                </div>
                <div>
                  <p className="text-white font-medium">Reading your resume...</p>
                  <p className="text-brand-muted text-sm mt-1">Extracting text from PDF</p>
                </div>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/20 flex items-center justify-center text-3xl glow-teal">
                  📋
                </div>
                <div>
                  <p className="text-white font-semibold">{fileName}</p>
                  <p className="text-brand-teal text-sm mt-0.5">
                    ✓ {cvText.length.toLocaleString()} characters extracted
                  </p>
                </div>
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setShowPreview(v => !v); }}
                    className="text-brand-muted hover:text-white text-xs transition-colors underline"
                  >
                    {showPreview ? 'Hide' : 'Preview'} extracted text
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFileName(''); setCvText(''); setShowPreview(false); }}
                    className="text-brand-muted hover:text-red-400 text-xs transition-colors"
                  >
                    Remove →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-4xl">
                  📄
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Drop your resume here</p>
                  <p className="text-brand-muted mt-1">or click to browse files</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-navy border border-brand-border rounded-full px-4 py-1.5">
                  <span className="text-brand-orange text-xs font-semibold">PDF only</span>
                  <span className="text-brand-border">·</span>
                  <span className="text-brand-muted text-xs">Max 10MB</span>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={e => processFile(e.target.files[0])}
          />

          {/* Preview extracted text */}
          {showPreview && cvText && (
            <div className="card p-4 animate-slide-up">
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider mb-2">
                Extracted Content Preview
              </p>
              <pre className="text-white text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {cvText.slice(0, 1200)}{cvText.length > 1200 ? '\n\n...(truncated for preview)' : ''}
              </pre>
            </div>
          )}

          {/* Fallback paste option */}
          {!fileName && (
            <div className="text-center">
              <p className="text-brand-muted text-xs mb-2">Can't upload PDF? Paste your resume text:</p>
              <textarea
                value={cvText}
                onChange={e => { setCvText(e.target.value); setError(''); }}
                placeholder="Paste your CV / resume text here..."
                className="input-field min-h-[140px] resize-y text-sm"
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={!cvText.trim() || cvText.trim().length < 50}
            className="btn-primary w-full text-base"
          >
            Continue — Choose Interview Mode →
          </button>
        </form>
      </div>
    </div>
  );
}
