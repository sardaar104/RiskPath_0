import { useState } from 'react';
import { ArrowRight, BookOpen, Briefcase, Check, Compass, Layers } from 'lucide-react';
import { CAREER_PATHS, EMPLOYER_SECTORS } from '../data/curriculumData';
import type { CareerTrack } from '../utils/riskMath';
import type { ActiveTab } from './TopBar';

interface OverviewSectionProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectCareerForPlan: (track: CareerTrack) => void;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
}

export function OverviewSection({
  onNavigate,
  onSelectCareerForPlan,
  completedMilestonesCount,
  totalMilestonesCount,
}: OverviewSectionProps) {
  const [imgError, setImgError] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string>(EMPLOYER_SECTORS[0].id);
  const [selectedCareerId, setSelectedCareerId] = useState<CareerTrack>(CAREER_PATHS[0].id);

  const activeSector =
    EMPLOYER_SECTORS.find((s) => s.id === selectedSectorId) ?? EMPLOYER_SECTORS[0];
  const activeCareer =
    CAREER_PATHS.find((c) => c.id === selectedCareerId) ?? CAREER_PATHS[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Editorial Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Mentor Thesis & Primary CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 sm:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
                <span>NotebookLM Core SQL &amp; Credit Risk Guide</span>
                <span aria-hidden="true">·</span>
                <span>Early-Career Mentorship</span>
                <span aria-hidden="true">·</span>
                <span>Non-Technical Friendly</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-semibold tracking-tight text-slate-900 leading-[1.15] text-balance mb-5">
                From Non-Technical Student to Job-Ready Credit Risk Analyst
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl mb-6">
                Credit risk teams at Commercial Banks, NBFCs, GCCs, and Big Four firms do not hire
                coders first—they hire analysts who understand why borrowers default, how cash flows
                cover debt, and how SQL, Statistics, and R or Python prove it. Follow this structured
                roadmap built directly from your NotebookLM study dossier.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-7">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Current Study Progress
                  </div>
                  <div className="text-lg font-semibold text-slate-900 tabular-nums">
                    {completedMilestonesCount} of {totalMilestonesCount} Milestones Mastered
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Core Skill Sequence
                  </div>
                  <div className="text-[13px] font-medium text-slate-800 whitespace-nowrap">
                    Ratios → SQL → EL &amp; ECL → Stats → R / Python
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('study-plan')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <span>Build Personalized Study Plan</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('risk-labs')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Learn PD, LGD, EAD &amp; Labs</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Illustration */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="relative flex-1 min-h-[260px] bg-slate-100">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_credit_workbench_1794866198905.jpg"
                  alt="Architectural illustration of balance scales, normal default probability distribution, and credit ledger grids"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 to-slate-200">
                  <Compass className="w-10 h-10 text-[#1E3A8A] mb-3" aria-hidden="true" />
                  <p className="font-display text-lg font-semibold text-slate-900">
                    Credit Risk Analytical Workbench
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    EL = PD × LGD × EAD · Three-Stage ECL · Scorecard Validation
                  </p>
                </div>
              )}
            </div>
            <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between gap-4 text-xs text-slate-600">
              <span>Grounded in 7 NotebookLM Modules</span>
              <span className="font-mono tabular-nums text-slate-800 font-medium">
                EL · ECL · WoE · SQL
              </span>
            </div>
          </div>
        </div>

        {/* 4-Column Full-Width Analytical Pillar Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1.5">01 · Financial Underwriting</div>
            <h2 className="font-sans text-base font-semibold text-slate-900 mb-1.5">
              Cash-Flow Solvency Ratios
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              DSCR (<span className="font-mono tabular-nums">&gt;1.25x</span>), Interest Coverage (
              <span className="font-mono tabular-nums">&gt;3.0x</span>), and Working Capital Cycle
              (<span className="font-mono">DIO + DSO − DPO</span>) to spot default liquidity traps.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1.5">02 · Loss &amp; Capital Math</div>
            <h2 className="font-sans text-base font-semibold text-slate-900 mb-1.5">
              EL, Downturn Stress &amp; Vasicek
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Expected Loss (<span className="font-mono">PD × LGD × EAD</span>), revolving CCF
              drawdowns, and 99.9th percentile Unexpected Loss capital buffers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1.5">03 · Provisioning &amp; Scorecards</div>
            <h2 className="font-sans text-base font-semibold text-slate-900 mb-1.5">
              3-Stage ECL, WoE &amp; PSI
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stage 1 to Stage 2 SICR cliffs (<span className="font-mono tabular-nums">&gt;30 DPD</span>),
              WoE/IV binning, Gini/KS (<span className="font-mono tabular-nums">&gt;30%</span>), and
              PSI drift rules.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1.5">04 · Data &amp; Querying</div>
            <h2 className="font-sans text-base font-semibold text-slate-900 mb-1.5">
              Core SQL &amp; R / Python Bridge
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Execution order, Anti-Joins, <span className="font-mono">DENSE_RANK()</span>, and
              choosing R for econometrics vs. Python for ML scorecards.
            </p>
          </div>
        </div>
      </section>

      {/* Employer Sector Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Finance Sector Hiring Landscape
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 text-balance">
                Where Credit Risk Careers Live &amp; What They Test
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Hiring sectors"
              className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
            >
              {EMPLOYER_SECTORS.map((sector) => {
                const active = sector.id === selectedSectorId;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedSectorId(sector.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sector.sectorName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">
                Typical Organizations
              </div>
              <p className="text-sm font-medium text-slate-900">{activeSector.examples}</p>
              <div className="text-xs font-semibold text-slate-500 mt-4 mb-1.5">
                Entry-Level Job Titles
              </div>
              <p className="text-sm text-slate-700">{activeSector.entryRoles}</p>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">
                What Technical Loops Screen For
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{activeSector.interviewFocus}</p>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">
                Core Analytical Frameworks
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeSector.primaryFrameworks}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Career Path Explorer for Non-Technical Entrants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Early-Career Role Explorer · Tailored for Non-Technical Entrants
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 text-balance">
                Explore Credit Risk Career Paths &amp; Progression
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Select a track to inspect typical job titles, day-to-day responsibilities, technical
              vs. soft skills, and the 4-stage advancement ladder.
            </p>
          </div>

          {/* 4 Track Selector Buttons */}
          <div
            role="tablist"
            aria-label="Credit risk career paths"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {CAREER_PATHS.map((path, index) => {
              const active = path.id === selectedCareerId;
              return (
                <button
                  key={path.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCareerId(path.id)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs mb-1 ${active ? 'text-slate-200' : 'text-slate-500'}`}
                    >
                      0{index + 1} · {path.hiringSectors.split('·')[0].trim()}
                    </div>
                    <div className="text-sm font-semibold leading-snug">{path.roleTitle}</div>
                  </div>
                  <div
                    className={`text-xs mt-3 pt-2 border-t ${
                      active
                        ? 'border-white/20 text-slate-100'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {path.technicalBarrier.split('(')[0].trim()} Barrier
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Career Blueprint Panel */}
          <div
            data-testid="career-path-detail"
            className="border border-slate-200 rounded-xl p-6 bg-[#F8FAFC] space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  {activeCareer.hiringSectors} · {activeCareer.technicalBarrier}
                </div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  {activeCareer.roleTitle}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                  {activeCareer.coreDailyWork}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectCareerForPlan(activeCareer.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                <span>Load Study Plan for This Track</span>
              </button>
            </div>

            {/* Row 1: Job Titles + Non-Tech Advantage + Responsibilities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Typical Entry &amp; Early-Career Job Titles
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-800">
                    {activeCareer.typicalTitles.map((title) => (
                      <li key={title} className="flex items-center gap-2">
                        <span className="text-[#1E3A8A] font-mono text-xs">→</span>
                        <span>{title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-emerald-800 mb-1.5">
                    Why Non-Technical Candidates Succeed Here
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeCareer.nonTechEdge}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <strong className="text-slate-900">Starter Portfolio Artifact:</strong>{' '}
                    {activeCareer.starterDeliverable}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5">
                <div className="text-xs font-semibold text-slate-700 mb-3">
                  Key Day-to-Day Responsibilities
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {activeCareer.keyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-[#1E3A8A] font-semibold mt-0.5">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Row 2: Technical vs Soft Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="text-xs font-semibold text-[#1E3A8A] mb-3">
                  Required Technical Skills
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {activeCareer.technicalSkills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="text-xs font-semibold text-emerald-800 mb-3">
                  Required Soft &amp; Business Skills
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {activeCareer.softSkills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2">
                      <Check
                        className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Row 3: 4-Stage Career Progression Ladder */}
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-xs font-semibold text-slate-700 mb-4">
                Long-Term Career Progression Ladder
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeCareer.careerProgression.map((step, i) => (
                  <div
                    key={step.level}
                    className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-[#1E3A8A]">
                          0{i + 1} · {step.level}
                        </span>
                        <span className="font-mono tabular-nums">{step.years}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 mb-1.5">
                        {step.titles}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Mentor Guidance Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-slate-100 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Layers className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Mentor Note for Non-Technical Backgrounds</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-white mb-2 text-balance">
              Do You Need Computer Science to Break Into Credit Risk?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              No. Most top credit underwriters and risk analysts start from commerce, economics,
              business, or liberal arts. Your competitive edge is financial logic (DSCR, ECL staging,
              downturn correlation) paired with clean SQL and foundational statistics—not software
              engineering.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('tooling-stats')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>View Stats &amp; R/Python Guide</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('interview-prep')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Test Practice Questions</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
