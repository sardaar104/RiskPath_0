import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import {
  ESSENTIAL_GLOSSARY,
  PRACTICE_QUESTIONS,
  SQL_EXECUTION_ORDER,
} from '../data/curriculumData';

interface InterviewPrepBankProps {
  masteredQuestions: Record<string, boolean>;
  onToggleMastered: (id: string) => void;
}

export function InterviewPrepBank({
  masteredQuestions,
  onToggleMastered,
}: InterviewPrepBankProps) {
  const [selectedSqlStep, setSelectedSqlStep] = useState<number>(1);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [checkResults, setCheckResults] = useState<Record<string, 'correct' | 'incorrect' | null>>(
    {}
  );

  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCat, setGlossaryCat] = useState<string>('All');

  const activeSqlClause =
    SQL_EXECUTION_ORDER.find((s) => s.step === selectedSqlStep) ?? SQL_EXECUTION_ORDER[0];

  const masteredCount = PRACTICE_QUESTIONS.filter((q) => masteredQuestions[q.id]).length;

  const filteredGlossary = useMemo(() => {
    const query = glossarySearch.trim().toLowerCase();
    return ESSENTIAL_GLOSSARY.filter((item) => {
      const matchesCat = glossaryCat === 'All' || item.category === glossaryCat;
      const matchesText =
        query.length === 0 ||
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query);
      return matchesCat && matchesText;
    });
  }, [glossarySearch, glossaryCat]);

  const handleCheckNumeric = (qId: string, expected: number) => {
    const raw = (userInputs[qId] ?? '').replace(/[$,%\sx,]/gi, '').trim();
    const parsed = Number(raw);
    if (!raw || Number.isNaN(parsed)) {
      setCheckResults((prev) => ({ ...prev, [qId]: 'incorrect' }));
      return;
    }
    const isMatch = Math.abs(parsed - expected) <= 0.02;
    setCheckResults((prev) => ({ ...prev, [qId]: isMatch ? 'correct' : 'incorrect' }));
    if (isMatch && !masteredQuestions[qId]) {
      onToggleMastered(qId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* SQL Query Execution Order Quick Reference */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              NotebookLM §1.1–1.2 · Interview Screening Core
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              SQL Execution Order &amp; Technical Question Bank
            </h1>
          </div>
          <div className="text-sm font-mono tabular-nums font-semibold text-[#1E3A8A]">
            Questions Mastered: {masteredCount} / {PRACTICE_QUESTIONS.length}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-2.5">
            Click any SQL clause to inspect its logical execution order (Why WHERE cannot filter
            GROUP BY aggregates or Window Functions):
          </div>
          <div className="flex flex-wrap gap-2">
            {SQL_EXECUTION_ORDER.map((item) => {
              const active = item.step === selectedSqlStep;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setSelectedSqlStep(item.step)}
                  className={`px-3 py-2 text-xs font-mono font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.step}. {item.clause}
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-800">
            <span className="font-mono font-semibold text-[#1E3A8A]">
              Step {activeSqlClause.step} ({activeSqlClause.clause}):
            </span>{' '}
            {activeSqlClause.purpose}
          </div>
        </div>
      </section>

      {/* NotebookLM 5 Technical Practice Questions */}
      <section className="space-y-4" aria-label="Technical Practice Questions">
        {PRACTICE_QUESTIONS.map((q) => {
          const showSolution = Boolean(revealedSolutions[q.id]);
          const showHint = Boolean(revealedHints[q.id]);
          const isMastered = Boolean(masteredQuestions[q.id]);
          const checkStatus = checkResults[q.id];

          return (
            <article key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">
                    Question {q.number} · {q.domain}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">{q.title}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleMastered(q.id)}
                  aria-pressed={isMastered}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isMastered
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{q.prompt}</p>

              {/* Numeric Self-Check for Questions 2–5 */}
              {q.expectedNumericAnswer !== undefined && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <label htmlFor={`answer-${q.id}`} className="text-xs font-semibold text-slate-700">
                    Your Answer ({q.expectedUnit || 'decimal'}):
                  </label>
                  <input
                    id={`answer-${q.id}`}
                    type="text"
                    value={userInputs[q.id] ?? ''}
                    onChange={(e) => {
                      setUserInputs((prev) => ({ ...prev, [q.id]: e.target.value }));
                      setCheckResults((prev) => ({ ...prev, [q.id]: null }));
                    }}
                    placeholder={`e.g. ${q.expectedNumericAnswer}`}
                    className="w-36 h-9 px-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-2 focus:outline-[#1E3A8A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCheckNumeric(q.id, q.expectedNumericAnswer!)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#1E40AF] cursor-pointer"
                  >
                    Check Answer
                  </button>
                  {checkStatus === 'correct' && (
                    <span className="text-xs font-semibold text-emerald-700">
                      Correct — matches NotebookLM solution key!
                    </span>
                  )}
                  {checkStatus === 'incorrect' && (
                    <span className="text-xs font-semibold text-red-700">
                      Not quite — review the hint or expand the solution steps.
                    </span>
                  )}
                </div>
              )}

              {/* Hint & Solution Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setRevealedHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                  }
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRevealedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                  }
                  aria-expanded={showSolution}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <span>{showSolution ? 'Hide Solution Key' : 'Reveal Solution Key'}</span>
                  {showSolution ? (
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {showHint && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950">
                  <strong>Mentor Hint:</strong> {q.hint}
                </div>
              )}

              {showSolution && (
                <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-3">
                  <div className="text-xs font-semibold text-slate-800">Step-by-Step Solution</div>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-700">
                    {q.solutionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                  {q.codeAnswer && (
                    <pre className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed">
                      <code>{q.codeAnswer}</code>
                    </pre>
                  )}
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-900">Interview Takeaway:</strong> {q.takeaway}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Searchable 15-Term Essential Glossary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              NotebookLM §7 · Essential Vocabulary
            </div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Credit Risk &amp; SQL Glossary (15 Core Terms)
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Search terms (e.g. SICR, WoE)..."
                aria-label="Search credit risk glossary"
                className="w-full sm:w-64 h-9 pl-9 pr-3 text-xs border border-slate-300 rounded-lg focus:outline-2 focus:outline-[#1E3A8A]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {['All', 'SQL & Data', 'Financial Ratios', 'Loss & Capital', 'Regulatory', 'Scorecards'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGlossaryCat(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      glossaryCat === cat
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {filteredGlossary.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No glossary terms match "{glossarySearch}". Try clearing your search filter.
          </p>
        ) : (
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((item) => (
              <div key={item.term} className="p-4 bg-slate-50 rounded-lg space-y-1.5">
                <div className="text-xs text-slate-500">{item.category}</div>
                <dt className="text-sm font-semibold text-slate-900">{item.term}</dt>
                <dd className="text-xs text-slate-600 leading-relaxed">{item.definition}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
}
