import { useState, useRef } from 'react';
import StepHeader from './shared/StepHeader.jsx';
import { extractTextFromPDF, extractTextFromTxt } from '../utils/pdfParser.js';

export default function JDUpload({ onSubmit }) {
  const [tab, setTab] = useState('paste'); // 'paste' | 'file'
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  async function processFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      setError('Please upload a .pdf or .txt file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const extracted = ext === 'pdf'
        ? await extractTextFromPDF(file)
        : await extractTextFromTxt(file);
      setText(extracted);
      setFileName(file.name);
    } catch (err) {
      setError('Could not read file. Please paste the JD text instead.');
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
    if (!text.trim() || text.trim().length < 50) {
      setError('Please add the job description (at least 50 characters).');
      return;
    }
    onSubmit(text.trim());
  }

  return (
    <div className="min-h-screen bg-grid animate-fade-in">
      <StepHeader currentStep={2} />
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Add the Job Description</h2>
          <p className="text-brand-muted mt-1">
            Paste or upload the JD — the more detail, the better your questions will be.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-brand-navy rounded-xl border border-brand-border w-fit">
            {[
              { id: 'paste', label: '✏️  Paste Text' },
              { id: 'file', label: '📄  Upload File' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setTab(id); setError(''); }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === id
                    ? 'bg-brand-card text-white border border-brand-border'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Paste tab */}
          {tab === 'paste' && (
            <div className="animate-fade-in">
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setError(''); }}
                placeholder="Paste the full job description here...

Example:
We are looking for a Marketing Executive to join our team. The ideal candidate will have experience in digital marketing, content creation, and social media management. You will be responsible for creating and executing marketing campaigns..."
                className="input-field min-h-[280px] resize-y leading-relaxed"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-brand-muted text-xs">{text.length} characters</span>
                {text.length < 50 && text.length > 0 && (
                  <span className="text-brand-orange text-xs">Add more detail for better questions</span>
                )}
              </div>
            </div>
          )}

          {/* File upload tab */}
          {tab === 'file' && (
            <div className="animate-fade-in">
              <div
                className={`card p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
                  dragging
                    ? 'border-brand-orange bg-brand-orange/10'
                    : 'border-brand-border hover:border-brand-orange/50'
                }`}
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-brand-border border-t-brand-orange rounded-full animate-spin" />
                    <p className="text-brand-muted text-sm">Extracting text from file...</p>
                  </div>
                ) : fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal/20 flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <p className="text-white font-medium text-sm">{fileName}</p>
                    <p className="text-brand-teal text-xs">{text.length} characters extracted</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setFileName(''); setText(''); }}
                      className="text-brand-muted hover:text-red-400 text-xs mt-1 transition-colors"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-4xl">📁</div>
                    <div>
                      <p className="text-white font-medium">Drop your JD file here</p>
                      <p className="text-brand-muted text-sm mt-1">or click to browse</p>
                    </div>
                    <p className="text-brand-border text-xs">Supports .pdf and .txt</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={e => processFile(e.target.files[0])}
              />
              {/* Still show text preview if file was loaded */}
              {text && !loading && (
                <div className="mt-4 card p-4">
                  <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider mb-2">Extracted Preview</p>
                  <p className="text-white text-sm leading-relaxed line-clamp-4">{text}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!text.trim() || text.trim().length < 50}
              className="btn-primary flex-1 text-base"
            >
              Continue — Upload Resume →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
