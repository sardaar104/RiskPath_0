import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  CODE_COMPARISONS,
  R_VS_PYTHON_TASKS,
  STATS_ECONOMETRICS_PHASES,
} from '../data/curriculumData';

export function ToolingAndStatsGuide() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(R_VS_PYTHON_TASKS[0].id);
  const [codeTab, setCodeTab] = useState<'scorecard' | 'econometrics'>('scorecard');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const activeTask =
    R_VS_PYTHON_TASKS.find((t) => t.id === selectedTaskId) ?? R_VS_PYTHON_TASKS[0];
  const activeCode = CODE_COMPARISONS[codeTab];
  const activePhase = STATS_ECONOMETRICS_PHASES[activePhaseIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Section 1: R vs Python Mentor Verdict */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Tooling Strategy · Quantitative Analysis vs. Production Modeling
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 text-balance">
            R vs. Python in Credit Risk: Which Should You Prefer?
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Both languages appear in bank and consulting job descriptions, but they solve different
            halves of the risk lifecycle. Use this mentor verdict to pick the right tool for your
            target tasks—and avoid learning both simultaneously as a non-technical beginner.
          </p>
        </div>

        {/* Two-Column Direct Verdict Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="text-xs font-semibold text-[#1E3A8A] mb-1">
              Preferred for Quantitative Analysis &amp; Econometrics
            </div>
            <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">
              R (Statistical Inference &amp; Regulatory Rigor)
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              R excels when the goal is <strong>explaining why</strong> default rates move rather
              than deploying live software. Its econometric ecosystem (<span className="font-mono">plm</span>,{' '}
              <span className="font-mono">sandwich</span>, <span className="font-mono">forecast</span>,{' '}
              <span className="font-mono">scorecard</span>) makes hypothesis testing, Newey-West
              standard errors, and IFRS 9 macro-model diagnostics concise and auditable.
            </p>
            <div className="text-xs text-slate-600 pt-3 border-t border-slate-200">
              <strong className="text-slate-900">Best For:</strong> Macro PD/LGD regression, Basel
              stress-test challenger models, GCC Model Validation, and exploratory WoE/IV tables.
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="text-xs font-semibold text-emerald-800 mb-1">
              Preferred for Modeling Tasks &amp; Production Pipelines
            </div>
            <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">
              Python (End-to-End Scorecards &amp; ML Deployment)
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Python dominates <strong>building and deploying</strong> predictive models at scale.
              Teams in NBFCs, digital lenders, and commercial banks pull data from PostgreSQL into{' '}
              <span className="font-mono">pandas</span>, run <span className="font-mono">optbinning</span>{' '}
              and <span className="font-mono">scikit-learn</span> / <span className="font-mono">xgboost</span>,
              and ship scoring APIs directly to underwriting engines.
            </p>
            <div className="text-xs text-slate-600 pt-3 border-t border-slate-200">
              <strong className="text-slate-900">Best For:</strong> Credit scorecards, ML/XGBoost
              challengers, automated ETL + SQL pipelines, and Non-Technical Beginner First Language.
            </div>
          </div>
        </div>

        {/* Interactive Task Decision Matrix */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-500 mb-3">
            Select a Credit Risk Task to Inspect the Recommended Tool
          </div>

          <div
            role="tablist"
            aria-label="Credit risk tooling tasks"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg mb-5"
          >
            {R_VS_PYTHON_TASKS.map((task) => {
              const active = task.id === selectedTaskId;
              return (
                <button
                  key={task.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {task.taskCategory}
                </button>
              );
            })}
          </div>

          <div
            data-testid="r-vs-python-verdict"
            className="border border-slate-200 rounded-xl p-5 bg-white space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {activeTask.taskCategory}
              </h3>
              <span className="text-xs font-semibold text-[#1E3A8A] font-mono">
                Recommended: {activeTask.preferredTool}
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">{activeTask.whyWinner}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg">
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Key R Packages</span>
                <span className="font-mono text-slate-800">{activeTask.rPackages}</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Key Python Libraries</span>
                <span className="font-mono text-slate-800">{activeTask.pythonPackages}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              <strong className="text-slate-900">Mentor Rule:</strong> {activeTask.mentorAdvice}
            </p>
          </div>
        </div>

        {/* Side-by-Side Code Comparison */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                Side-by-Side Workflow Comparison
              </h3>
              <p className="text-xs text-slate-600">
                See how the exact same NotebookLM task reads in Python vs. R.
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setCodeTab('scorecard')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  codeTab === 'scorecard'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Logistic Scorecard &amp; WoE
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('econometrics')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  codeTab === 'econometrics'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                IFRS 9 Macro Econometrics
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-800">
                Python — {activeCode.label}
              </div>
              <pre className="p-4 text-xs font-mono text-slate-800 bg-[#F8FAFC] overflow-x-auto leading-relaxed">
                <code>{activeCode.python}</code>
              </pre>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-800">
                R — {activeCode.label}
              </div>
              <pre className="p-4 text-xs font-mono text-slate-800 bg-[#F8FAFC] overflow-x-auto leading-relaxed">
                <code>{activeCode.r}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Role of Statistics & Econometrics for Non-Technical Students */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Structured Learning Blueprint for Non-Technical Students
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 text-balance">
            The Role of Statistics &amp; Econometrics in Credit Risk
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Without a technical background, formulas like{' '}
            <span className="font-mono">ln(p/(1−p))</span> or{' '}
            <span className="font-mono">Φ⁻¹(0.999)</span> look intimidating. In practice, they
            divide cleanly into two complementary lenses. Follow the 4-stage path below from
            zero math anxiety to IFRS 9 and Scorecard fluency.
          </p>
        </div>

        {/* Statistics vs Econometrics Role Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="text-xs font-semibold text-[#1E3A8A]">
              Role 1 · Statistical Analysis (Cross-Sectional Risk Ranking)
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Statistics: Who Will Default &amp; Does Our Scorecard Rank Them?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Statistics compares borrowers against each other at a point in time. It powers{' '}
              <strong>Logistic Regression credit scorecards</strong>, Weight of Evidence (WoE)
              binning, discrimination checks (<strong>AUROC, Gini, KS &gt; 30%</strong>), and
              live population drift alerts (<strong>PSI</strong>).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="text-xs font-semibold text-emerald-800">
              Role 2 · Econometrics (Macro Causality &amp; Time-Series Forecasting)
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Econometrics: How Do Recessions Shift Defaults Over Time?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Econometrics isolates cause-and-effect over macroeconomic cycles while correcting
              time-series biases (autocorrelation, lagged GDP/rate shocks, Newey-West SEs). It
              powers <strong>IFRS 9 / RBI forward-looking ECL</strong> and{' '}
              <strong>Basel stress-testing satellite models</strong>.
            </p>
          </div>
        </div>

        {/* 4-Stage Step Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS_ECONOMETRICS_PHASES.map((phase, idx) => {
            const active = idx === activePhaseIndex;
            return (
              <button
                key={phase.phaseNumber}
                type="button"
                onClick={() => setActivePhaseIndex(idx)}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`text-xs font-mono mb-1 ${
                    active ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {phase.phaseNumber}
                </div>
                <div className="text-sm font-semibold leading-snug">{phase.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Detail Panel */}
        <div className="border border-slate-200 rounded-xl p-6 bg-[#F8FAFC] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono text-[#1E3A8A] font-semibold">
                {activePhase.phaseNumber}
              </span>
              <h3 className="font-display text-xl font-semibold text-slate-900">
                {activePhase.title}
              </h3>
            </div>
            {activePhaseIndex < STATS_ECONOMETRICS_PHASES.length - 1 && (
              <button
                type="button"
                onClick={() => setActivePhaseIndex((i) => i + 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  Plain-English Intuition
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {activePhase.plainEnglishAnalogy}
                </p>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  Direct Credit Risk Link
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {activePhase.creditRiskLink}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-emerald-800 mb-2">
                  Recommended Non-Technical Resources
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activePhase.recommendedResources.map((res, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-mono">•</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                <div className="text-xs font-semibold text-slate-700">
                  Key Concepts to Master in This Stage
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {activePhase.coreConcepts.map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-[#1E3A8A] font-semibold mt-0.5">
                        0{i + 1}.
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2.5">
                <div className="text-xs font-semibold text-[#1E3A8A]">
                  Practical Credit Risk Applications
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {activePhase.practicalApplications.map((app, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-slate-400 mt-0.5">→</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-900">Study Strategy:</strong>{' '}
                  {activePhase.learningResourcesFocus}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
