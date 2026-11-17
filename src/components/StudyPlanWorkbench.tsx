import { useMemo, useState } from 'react';
import { Check, Download, RotateCcw } from 'lucide-react';
import {
  generateStandaloneHtmlExport,
  type CareerTrack,
  type PlanDuration,
  type StudentBackground,
  type StudyMilestone,
  type StudyPlanConfig,
  type StudyWeek,
} from '../utils/riskMath';

interface StudyPlanWorkbenchProps {
  config: StudyPlanConfig;
  onUpdateConfig: (next: StudyPlanConfig) => void;
  plan: StudyWeek[];
  completedMilestones: Record<string, boolean>;
  onToggleMilestone: (id: string) => void;
  onResetProgress: () => void;
}

type CategoryFilter = 'All' | StudyMilestone['category'];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Credit Fundamentals',
  'SQL & Data',
  'Stats & Econometrics',
  'Tooling (R/Python)',
  'Interview Drill',
];

export function StudyPlanWorkbench({
  config,
  onUpdateConfig,
  plan,
  completedMilestones,
  onToggleMilestone,
  onResetProgress,
}: StudyPlanWorkbenchProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  const stats = useMemo(() => {
    const allMilestones = plan.flatMap((w) => w.milestones);
    const total = allMilestones.length;
    const completed = allMilestones.filter((m) => completedMilestones[m.id]).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalHours = plan.reduce((acc, w) => acc + w.estimatedHours, 0);
    return { total, completed, pct, totalHours };
  }, [plan, completedMilestones]);

  const handleDownloadHtml = () => {
    const html = generateStandaloneHtmlExport(plan, config, completedMilestones);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-risk-study-plan-${config.duration}w.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header & Mentor Tailoring Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              Personalized Curriculum Engine
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 text-balance">
              Tailor Your Credit Risk &amp; Analytics Study Plan
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
              Adjust your academic background, target role, and timeline. Your syllabus adapts
              automatically—pacing statistics, econometrics, SQL drills, and R/Python guidance
              around the NotebookLM guide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export Interactive HTML</span>
            </button>

            <button
              type="button"
              onClick={onResetProgress}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>

        {/* 4 Configurator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div>
            <label
              htmlFor="select-background"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Your Starting Background
            </label>
            <select
              id="select-background"
              value={config.background}
              onChange={(e) =>
                onUpdateConfig({ ...config, background: e.target.value as StudentBackground })
              }
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-2 focus:outline-[#1E3A8A]"
            >
              <option value="non-technical">Non-Technical (General / Arts)</option>
              <option value="commerce-finance">Commerce / Finance / Accounting</option>
              <option value="quantitative">Quantitative / STEM / Coding</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="select-track"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Target Career Track
            </label>
            <select
              id="select-track"
              value={config.track}
              onChange={(e) =>
                onUpdateConfig({ ...config, track: e.target.value as CareerTrack })
              }
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-2 focus:outline-[#1E3A8A]"
            >
              <option value="credit-analyst">Corporate &amp; Retail Credit Analyst</option>
              <option value="risk-modeling">Credit Risk &amp; Scorecard Modeling</option>
              <option value="model-validation">Model Validation (MRM)</option>
              <option value="regulatory-ecl">IFRS 9 / RBI ECL &amp; Stress</option>
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Plan Duration
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg h-10">
              {([4, 8, 12] as PlanDuration[]).map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => onUpdateConfig({ ...config, duration: dur })}
                  className={`text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    config.duration === dur
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dur} Weeks
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Weekly Commitment
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg h-10">
              {([6, 12, 20] as const).map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => onUpdateConfig({ ...config, weeklyHours: hrs })}
                  className={`text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    config.weeklyHours === hrs
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {hrs} hrs/wk
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Progress & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <div className="whitespace-nowrap">
              <div className="text-xs text-slate-500">Milestones Completed</div>
              <div className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                {stats.completed} / {stats.total} ({stats.pct}%)
              </div>
            </div>
            <div className="w-36 sm:w-44 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
              <div
                className="h-full bg-[#1E3A8A] transition-all duration-200"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
            <div className="text-xs text-slate-600 tabular-nums whitespace-nowrap">
              Total Guided Hours: <strong className="text-slate-900">{stats.totalHours}h</strong>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Filter milestones by competency"
            className="flex flex-wrap xl:flex-nowrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mentor Advice Banner for Non-Technical / Duration */}
      {config.background === 'non-technical' && (
        <section className="bg-slate-900 text-slate-100 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-200 leading-relaxed">
            <strong className="text-white">Mentor Guidance (Non-Technical Path):</strong> Focus on
            business intuition first. In Week 1–2, prioritize financial ratios and SQL{' '}
            <span className="font-mono text-emerald-300">SELECT / JOIN / WHERE</span> before
            attempting statistical regressions or Python scripts.
            {config.duration !== 12 &&
              ' Tip: Switch to the 12-Week plan if you want a dedicated Week 1 quantitative literacy on-ramp.'}
          </p>
        </section>
      )}

      {/* Week-by-Week Syllabus */}
      <section className="space-y-4" aria-label="Weekly Study Syllabus">
        {plan.map((week) => {
          const visibleMilestones =
            categoryFilter === 'All'
              ? week.milestones
              : week.milestones.filter((m) => m.category === categoryFilter);

          if (visibleMilestones.length === 0) {
            return null;
          }

          const weekDone = week.milestones.filter((m) => completedMilestones[m.id]).length;

          return (
            <article
              key={week.weekNumber}
              className="bg-white border border-slate-200 rounded-xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-[#1E3A8A]">Week {week.weekNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{week.phase}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{week.notebookModuleRef}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    {week.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 tabular-nums shrink-0">
                  <span>{week.estimatedHours} hrs est.</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-900">
                    {weekDone}/{week.milestones.length} Done
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mt-4">{week.focusSummary}</p>

              {/* Stats & Tooling Guidance Strip (clean surface contrast, no nested bordered card clutter) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4 mt-4 text-xs sm:text-sm">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1">
                    Statistics &amp; Econometrics Lens
                  </span>
                  <span className="text-slate-600 leading-relaxed">{week.statsFocus}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1">
                    SQL / R / Python Deliverable
                  </span>
                  <span className="text-slate-600 leading-relaxed">{week.toolingFocus}</span>
                </div>
              </div>

              {/* Checkable Milestones */}
              <ul className="divide-y divide-slate-100 mt-4">
                {visibleMilestones.map((milestone) => {
                  const checked = Boolean(completedMilestones[milestone.id]);
                  return (
                    <li key={milestone.id} className="py-3 first:pt-2 last:pb-0">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleMilestone(milestone.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                            checked
                              ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                              : 'bg-white border-slate-300 group-hover:border-[#1E3A8A]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                checked ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {milestone.title}
                            </span>
                            <span className="text-xs text-slate-500">· {milestone.category}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {milestone.detail}
                          </p>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </section>
    </div>
  );
}
