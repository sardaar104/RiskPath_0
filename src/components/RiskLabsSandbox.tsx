import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
  CREDIT_CONCEPT_DEEP_DIVES,
  REAL_WORLD_CASE_STUDIES,
  type CreditCaseStudy,
} from '../data/curriculumData';
import {
  calculateEclMigration,
  calculateExpectedLoss,
  calculateFinancialRatios,
  calculatePortfolioStress,
  calculateScorecardMetrics,
  calculateVasicekCapital,
  evaluateIvStrength,
  type PortfolioFacility,
} from '../utils/riskMath';
import { StatusBadge } from './StatusBadge';

type LabTab = 'concepts' | 'el-ecl' | 'scorecard-psi' | 'financial-ratios';

const NOTEBOOK_PORTFOLIO: PortfolioFacility[] = [
  {
    id: 'loan-a',
    name: 'Loan A: Secured Term',
    drawnBalance: 5000000,
    undrawnLimit: 0,
    ccfPct: 0,
    pdPct: 1.0,
    lgdPct: 40,
  },
  {
    id: 'loan-b',
    name: 'Loan B: Corporate Term',
    drawnBalance: 3000000,
    undrawnLimit: 0,
    ccfPct: 0,
    pdPct: 2.0,
    lgdPct: 45,
  },
  {
    id: 'loan-c',
    name: 'Loan C: Revolver Line',
    drawnBalance: 2000000,
    undrawnLimit: 2000000,
    ccfPct: 50,
    pdPct: 3.0,
    lgdPct: 60,
  },
];

function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function RiskLabsSandbox() {
  const [activeLab, setActiveLab] = useState<LabTab>('concepts');
  const [selectedConceptId, setSelectedConceptId] = useState<'pd' | 'lgd' | 'ead'>('pd');
  const [activeCaseBanner, setActiveCaseBanner] = useState<string | null>(null);

  // Lab 1 State: Single Revolver + Portfolio Stress + ECL Staging + Vasicek
  const [drawnBalance, setDrawnBalance] = useState(15000);
  const [undrawnLimit, setUndrawnLimit] = useState(35000);
  const [ccfPct, setCcfPct] = useState(40);
  const [pdPct, setPdPct] = useState(4.0);
  const [lgdPct, setLgdPct] = useState(75);

  const [downturnActive, setDownturnActive] = useState(true);
  const [pdMultiplier, setPdMultiplier] = useState(2.0);
  const [lgdAddPp, setLgdAddPp] = useState(10);
  const [revolverDrawdownPct, setRevolverDrawdownPct] = useState(100);
  const [vasicekRho, setVasicekRho] = useState(0.15);

  // ECL Staging state (NotebookLM Question 4 defaults)
  const [eclStage, setEclStage] = useState<'stage1' | 'stage2'>('stage2');
  const [eclBalance, setEclBalance] = useState(10000000);
  const [eclPd12m, setEclPd12m] = useState(1.5);
  const [eclPdLife, setEclPdLife] = useState(12.0);
  const [eclLgd, setEclLgd] = useState(40);

  // Lab 2 State: Scorecard & PSI
  const [auroc, setAuroc] = useState(0.78);
  const [ivTestVal, setIvTestVal] = useState(0.32);
  const [psiShiftLevel, setPsiShiftLevel] = useState(0); // 0 = stable, 15 = moderate, 35 = severe

  // Lab 3 State: Corporate Solvency Ratios (NotebookLM Question 2 defaults)
  const [ebitda, setEbitda] = useState(4500000);
  const [ebit, setEbit] = useState(3600000);
  const [interestExpense, setInterestExpense] = useState(800000);
  const [principalRepayment, setPrincipalRepayment] = useState(1200000);
  const [dioDays, setDioDays] = useState(45);
  const [dsoDays, setDsoDays] = useState(50);
  const [dpoDays, setDpoDays] = useState(35);

  const elResult = useMemo(
    () =>
      calculateExpectedLoss({
        drawnBalance,
        undrawnLimit,
        ccfPct,
        pdPct,
        lgdPct,
      }),
    [drawnBalance, undrawnLimit, ccfPct, pdPct, lgdPct]
  );

  const stressResult = useMemo(
    () =>
      calculatePortfolioStress(NOTEBOOK_PORTFOLIO, {
        pdMultiplier: downturnActive ? pdMultiplier : 1,
        lgdAddPp: downturnActive ? lgdAddPp : 0,
        revolverDrawdownPct: downturnActive ? revolverDrawdownPct : 0,
      }),
    [downturnActive, pdMultiplier, lgdAddPp, revolverDrawdownPct]
  );

  const vasicek = useMemo(
    () =>
      calculateVasicekCapital({
        pdPct,
        lgdPct,
        rho: vasicekRho,
      }),
    [pdPct, lgdPct, vasicekRho]
  );

  const eclResult = useMemo(
    () =>
      calculateEclMigration({
        exposureAmount: eclBalance,
        lgdPct: eclLgd,
        pd12mPct: eclPd12m,
        pdLifetimePct: eclPdLife,
      }),
    [eclBalance, eclLgd, eclPd12m, eclPdLife]
  );

  const scorecardMetrics = useMemo(() => {
    const expectedBins = [20, 25, 25, 20, 10];
    const shift = psiShiftLevel;
    const actualBins = [
      Math.max(2, 20 - shift * 0.45),
      Math.max(4, 25 - shift * 0.3),
      25,
      20 + shift * 0.3,
      10 + shift * 0.45,
    ];
    return {
      ...calculateScorecardMetrics({
        auroc,
        tp: Math.round(110 + (auroc - 0.5) * 180),
        fp: Math.round(130 - (auroc - 0.5) * 180),
        tn: Math.round(670 + (auroc - 0.5) * 180),
        fn: Math.round(90 - (auroc - 0.5) * 100),
        expectedBins,
        actualBins,
      }),
      expectedBins,
      actualBins,
    };
  }, [auroc, psiShiftLevel]);

  const ivEval = useMemo(() => evaluateIvStrength(ivTestVal), [ivTestVal]);

  const ratiosResult = useMemo(
    () =>
      calculateFinancialRatios({
        ebitda,
        ebit,
        interestExpense,
        principalRepayment,
        currentAssets: 3200000,
        currentLiabilities: 1800000,
        dioDays,
        dsoDays,
        dpoDays,
      }),
    [ebitda, ebit, interestExpense, principalRepayment, dioDays, dsoDays, dpoDays]
  );

  const resetLabDefaults = () => {
    setDrawnBalance(15000);
    setUndrawnLimit(35000);
    setCcfPct(40);
    setPdPct(4.0);
    setLgdPct(75);
    setDownturnActive(true);
    setPdMultiplier(2.0);
    setLgdAddPp(10);
    setRevolverDrawdownPct(100);
    setVasicekRho(0.15);
    setEclStage('stage2');
    setEclBalance(10000000);
    setEclPd12m(1.5);
    setEclPdLife(12.0);
    setEclLgd(40);
    setAuroc(0.78);
    setIvTestVal(0.32);
    setPsiShiftLevel(0);
    setEbitda(4500000);
    setEbit(3600000);
    setInterestExpense(800000);
    setPrincipalRepayment(1200000);
    setDioDays(45);
    setDsoDays(50);
    setDpoDays(35);
    setActiveCaseBanner(null);
  };

  const loadCaseIntoSimulator = (cs: CreditCaseStudy) => {
    setDrawnBalance(cs.simulatorPreset.drawnBalance);
    setUndrawnLimit(cs.simulatorPreset.undrawnLimit);
    setCcfPct(cs.simulatorPreset.ccfPct);
    setPdPct(cs.simulatorPreset.pdPct);
    setLgdPct(cs.simulatorPreset.lgdPct);
    setActiveCaseBanner(cs.title);
    setActiveLab('el-ecl');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeConcept =
    CREDIT_CONCEPT_DEEP_DIVES.find((c) => c.id === selectedConceptId) ??
    CREDIT_CONCEPT_DEEP_DIVES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Lab Header & Segmented Lab Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="shrink-0">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Foundational Concepts &amp; Interactive Sandbox
          </div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 whitespace-nowrap">
            Credit Risk Foundations &amp; Labs
          </h1>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div
            role="tablist"
            aria-label="Select credit risk lab"
            className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeLab === 'concepts'}
              onClick={() => setActiveLab('concepts')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLab === 'concepts'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. PD, LGD, EAD &amp; Cases
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeLab === 'el-ecl'}
              onClick={() => setActiveLab('el-ecl')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLab === 'el-ecl'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. EL, ECL &amp; Vasicek
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeLab === 'scorecard-psi'}
              onClick={() => setActiveLab('scorecard-psi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLab === 'scorecard-psi'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Scorecard &amp; PSI
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeLab === 'financial-ratios'}
              onClick={() => setActiveLab('financial-ratios')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLab === 'financial-ratios'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. DSCR &amp; Ratios
            </button>
          </div>

          <button
            type="button"
            onClick={resetLabDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* MODULE 1: Foundational PD, LGD, EAD Deep-Dive & Case Studies */}
      {activeLab === 'concepts' && (
        <div className="space-y-6">
          {/* Interactive PD / LGD / EAD Triad Explorer */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Foundational Credit Loss Equation · EL = PD × LGD × EAD
                </div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  Understanding PD, LGD, and EAD From First Principles
                </h2>
              </div>

              <div
                role="tablist"
                aria-label="Core credit risk parameters"
                className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto"
              >
                {CREDIT_CONCEPT_DEEP_DIVES.map((item) => {
                  const active = item.id === selectedConceptId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedConceptId(item.id)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-slate-900 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.acronym} · {item.fullName.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    {activeConcept.acronym} — {activeConcept.fullName}
                  </h3>
                  <span className="font-mono text-xs text-[#1E3A8A] font-medium">
                    {activeConcept.coreFormula}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeConcept.plainEnglish}
                </p>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-800">
                    What Drives {activeConcept.acronym} in Practice?
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {activeConcept.keyDrivers.map((driver, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-xs text-[#1E3A8A] font-semibold mt-0.5">
                          0{i + 1}.
                        </span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Early-Career Analyst Lens
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeConcept.earlyCareerContext}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Typical Industry Benchmarks
                  </div>
                  <p className="text-xs font-mono text-slate-800 leading-relaxed">
                    {activeConcept.typicalBenchmarks}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveLab('el-ecl')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#1E40AF] transition-colors cursor-pointer"
                  >
                    <span>Test {activeConcept.acronym} in Live Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Real-World Early-Career Case Studies */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Applied Lending Scenarios
                </div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  Real-World Credit Risk Case Studies
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Walk through the numbers below, then load any scenario directly into the interactive
                EL simulator.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {REAL_WORLD_CASE_STUDIES.map((cs) => (
                <article
                  key={cs.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500">
                      {cs.sector} · {cs.roleLens}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug">
                      {cs.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cs.scenario}
                    </p>

                    <div className="bg-slate-50 rounded-lg p-3.5 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-800">
                        Step-by-Step Calculation
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-xs font-mono text-slate-700">
                        {cs.analyticalSteps.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">Analyst Takeaway:</strong>{' '}
                      {cs.outcomeTakeaway}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => loadCaseIntoSimulator(cs)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#1E3A8A] bg-slate-50 border border-slate-200 rounded-lg hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] transition-colors cursor-pointer"
                    >
                      <span>Load Case into EL Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* LAB 2: EL, Downturn Stress, ECL Provision Cliff & Vasicek */}
      {activeLab === 'el-ecl' && (
        <div className="space-y-6">
          {activeCaseBanner && (
            <div className="bg-slate-900 text-slate-100 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span>
                <strong className="text-white">Loaded Case Preset:</strong> {activeCaseBanner}
              </span>
              <button
                type="button"
                onClick={resetLabDefaults}
                className="text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Clear Preset
              </button>
            </div>
          )}
          {/* Two-Zone Sandbox: Visual Stage (Left) + Control Deck (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Stage (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    Revolving Expected Loss &amp; Vasicek Tail Buffer
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live equation: <span className="font-mono">EL = PD × LGD × (Drawn + CCF × Undrawn)</span>
                  </p>
                </div>
                <StatusBadge
                  band={
                    elResult.lossRateOnEadPct > 5
                      ? 'CRITICAL'
                      : elResult.lossRateOnEadPct > 2
                      ? 'ELEVATED'
                      : 'NOMINAL'
                  }
                  label={
                    elResult.lossRateOnEadPct > 5
                      ? 'HIGH LOSS RATE'
                      : elResult.lossRateOnEadPct > 2
                      ? 'MODERATE LOSS'
                      : 'LOW LOSS RATE'
                  }
                />
              </div>

              {/* Primary KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Exposure at Default</div>
                  <div
                    data-testid="lab-ead-value"
                    className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1"
                  >
                    {formatUsd(elResult.ead)}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Expected Loss (EL)</div>
                  <div
                    data-testid="lab-el-value"
                    className="text-lg font-semibold font-mono tabular-nums text-[#1E3A8A] mt-1"
                  >
                    {formatUsd(elResult.expectedLoss)}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">Vasicek 99.9% WCDR</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1">
                    {vasicek.wcdrPct.toFixed(2)}%
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500">UL Capital Buffer (K)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-amber-700 mt-1">
                    {vasicek.capitalRequirementPct.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* SVG Loss Distribution Curve (EL vs Unexpected Loss VaR 99.9%) */}
              <div className="border border-slate-200 rounded-lg p-4 bg-[#F8FAFC]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mb-3">
                  <span className="font-semibold text-slate-800">
                    Loss Distribution Intuition: EL (P&amp;L Provision) vs. UL (CET1 Capital)
                  </span>
                  <span className="font-mono tabular-nums">
                    Asset Corr ρ = {vasicekRho.toFixed(2)} · 99.9th Percentile VaR
                  </span>
                </div>
                <svg
                  viewBox="0 0 600 185"
                  className="w-full h-44"
                  role="img"
                  aria-label="Credit loss probability density curve showing Expected Loss mean and 99.9th percentile Unexpected Loss tail"
                >
                  {/* Coordinate Baseline */}
                  <line x1="30" y1="150" x2="570" y2="150" stroke="#CBD5E1" strokeWidth="1.5" />

                  {/* Skewed Loss Curve Path */}
                  <path
                    d="M 35 150 C 70 148, 95 40, 145 35 C 200 30, 250 110, 355 136 C 430 147, 510 149, 565 150"
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                  />

                  {/* EL Shaded Region */}
                  <path
                    d="M 35 150 C 70 148, 95 40, 145 35 L 145 150 Z"
                    fill="#059669"
                    fillOpacity="0.18"
                  />

                  {/* UL Shaded Region (Dynamic Width based on WCDR - PD spread) */}
                  {(() => {
                    const varX = Math.min(545, Math.max(220, 210 + vasicek.wcdrPct * 7));
                    return (
                      <>
                        <path
                          d={`M 145 35 C 200 30, 250 110, 355 136 C 420 146, ${varX} 149, ${varX} 150 L 145 150 Z`}
                          fill="#D97706"
                          fillOpacity="0.18"
                        />
                        <line
                          x1="145"
                          y1="25"
                          x2="145"
                          y2="150"
                          stroke="#059669"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <text x="145" y="18" textAnchor="middle" fontSize="11" fill="#065F46" fontWeight="600">
                          EL ({vasicek.expectedLossPct.toFixed(2)}%)
                        </text>

                        <line
                          x1={varX}
                          y1="30"
                          x2={varX}
                          y2="150"
                          stroke="#DC2626"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <text x={varX} y="22" textAnchor="middle" fontSize="11" fill="#991B1B" fontWeight="600">
                          99.9% VaR (WCDR {vasicek.wcdrPct.toFixed(1)}%)
                        </text>

                        {/* UL Bracket Arrow cleanly positioned below curve line */}
                        <line x1="150" y1="132" x2={varX - 5} y2="132" stroke="#B45309" strokeWidth="1.5" />
                        <rect
                          x={(145 + varX) / 2 - 96}
                          y="108"
                          width="192"
                          height="18"
                          rx="4"
                          fill="#FFFFFF"
                          fillOpacity="0.9"
                        />
                        <text
                          x={(145 + varX) / 2}
                          y="120"
                          textAnchor="middle"
                          fontSize="10.5"
                          fill="#92400E"
                          fontWeight="600"
                        >
                          Unexpected Loss (UL) = {vasicek.capitalRequirementPct.toFixed(2)}% Capital
                        </text>
                      </>
                    );
                  })()}
                  <text x="30" y="170" fontSize="10" fill="#64748B">
                    0% Portfolio Loss
                  </text>
                  <text x="565" y="170" textAnchor="end" fontSize="10" fill="#64748B">
                    Severe Crisis Tail
                  </text>
                </svg>
              </div>

              {/* IFRS 9 Stage 1 vs Stage 2 Provision Cliff Explorer */}
              <div className="border-t border-slate-200 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      IFRS 9 / RBI Three-Stage ECL Provision Cliff Simulator
                    </h3>
                    <p className="text-xs text-slate-600">
                      Toggle SICR (&gt;30 DPD) migration to observe the jump from 12-Month ECL to
                      Lifetime ECL.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setEclStage('stage1')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        eclStage === 'stage1'
                          ? 'bg-white text-slate-900 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Stage 1 (12M ECL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEclStage('stage2')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        eclStage === 'stage2'
                          ? 'bg-white text-slate-900 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Stage 2 (SICR &gt;30 DPD)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500">Active Stage Provision</div>
                    <div
                      data-testid="ecl-active-provision"
                      className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1"
                    >
                      {formatUsd(
                        eclStage === 'stage1'
                          ? eclResult.stage1Provision
                          : eclResult.stage2Provision
                      )}
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500">Stage 1 → Stage 2 Cliff Delta</div>
                    <div className="text-lg font-semibold font-mono tabular-nums text-red-700 mt-1">
                      +{formatUsd(eclResult.provisionIncrease)}
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-lg flex flex-col justify-between">
                    <div className="text-xs text-slate-500">Reserve Jump Multiple</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-lg font-semibold font-mono tabular-nums text-slate-900">
                        {eclResult.reserveMultiple.toFixed(1)}x
                      </span>
                      <StatusBadge
                        band={eclStage === 'stage1' ? 'NOMINAL' : 'ELEVATED'}
                        label={eclStage === 'stage1' ? 'PERFORMING' : 'LIFETIME ECL'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control & Concept Deck (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h2 className="font-display text-lg font-semibold text-slate-900 pb-3 border-b border-slate-100">
                Parameter Controls
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="slider-drawn" className="text-slate-700">
                      Drawn Balance ($)
                    </label>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">
                      {formatUsd(drawnBalance)}
                    </span>
                  </div>
                  <input
                    id="slider-drawn"
                    type="range"
                    min={0}
                    max={50000}
                    step={1000}
                    value={drawnBalance}
                    onChange={(e) => setDrawnBalance(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="slider-undrawn" className="text-slate-700">
                      Undrawn Limit ($)
                    </label>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">
                      {formatUsd(undrawnLimit)}
                    </span>
                  </div>
                  <input
                    id="slider-undrawn"
                    type="range"
                    min={0}
                    max={50000}
                    step={1000}
                    value={undrawnLimit}
                    onChange={(e) => setUndrawnLimit(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="slider-ccf" className="text-slate-700">
                      Credit Conversion Factor (CCF %)
                    </label>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">
                      {ccfPct}%
                    </span>
                  </div>
                  <input
                    id="slider-ccf"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={ccfPct}
                    onChange={(e) => setCcfPct(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="slider-pd" className="text-slate-700">
                      1-Year Probability of Default (PD %)
                    </label>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">
                      {pdPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    id="slider-pd"
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={pdPct}
                    onChange={(e) => setPdPct(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="slider-lgd" className="text-slate-700">
                      Loss Given Default (LGD %)
                    </label>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">
                      {lgdPct}%
                    </span>
                  </div>
                  <input
                    id="slider-lgd"
                    type="range"
                    min={10}
                    max={95}
                    step={5}
                    value={lgdPct}
                    onChange={(e) => setLgdPct(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="slider-rho" className="text-slate-700">
                      Vasicek Systematic Correlation (ρ)
                    </label>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">
                      {vasicekRho.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="slider-rho"
                    type="range"
                    min={0.04}
                    max={0.28}
                    step={0.01}
                    value={vasicekRho}
                    onChange={(e) => setVasicekRho(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  <strong className="text-slate-900">Concept Check:</strong> With default settings
                  ($15k drawn, $35k undrawn, 40% CCF, 4% PD, 75% LGD), EAD = $29,000 and EL = $870
                  (exact NotebookLM Practice Question 3).
                </p>
                <p>
                  <strong className="text-slate-900">Why Correlation ρ Matters:</strong> Higher ρ
                  means borrowers fail together during recessions, expanding Unexpected Loss capital
                  even when average EL stays constant.
                </p>
              </div>
            </div>
          </div>

          {/* 3-Loan Downturn Stress Table (NotebookLM Section 3.2) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Portfolio Downturn Stressing &amp; Joint Correlation (NotebookLM §3.2)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Observe why doubling PD does not merely double EL (2.0x) — joint increases in
                  LGD and revolver drawdowns amplify portfolio EL by{' '}
                  <strong className="font-mono tabular-nums text-slate-900">
                    {stressResult.elJumpMultiple.toFixed(2)}x
                  </strong>
                  .
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDownturnActive((v) => !v)}
                  aria-pressed={downturnActive}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    downturnActive
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {downturnActive ? 'Downturn Stress: ON' : 'Downturn Stress: OFF (Base)'}
                </button>
              </div>
            </div>

            {downturnActive && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="stress-pd-mult">PD Stress Multiplier</label>
                    <span className="font-mono tabular-nums font-semibold">{pdMultiplier.toFixed(1)}x</span>
                  </div>
                  <input
                    id="stress-pd-mult"
                    type="range"
                    min={1}
                    max={4}
                    step={0.5}
                    value={pdMultiplier}
                    onChange={(e) => setPdMultiplier(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="stress-lgd-pp">LGD Collateral Haircut (+pp)</label>
                    <span className="font-mono tabular-nums font-semibold">+{lgdAddPp} pp</span>
                  </div>
                  <input
                    id="stress-lgd-pp"
                    type="range"
                    min={0}
                    max={25}
                    step={5}
                    value={lgdAddPp}
                    onChange={(e) => setLgdAddPp(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="stress-drawdown">Revolver Undrawn Drawdown (%)</label>
                    <span className="font-mono tabular-nums font-semibold">{revolverDrawdownPct}%</span>
                  </div>
                  <input
                    id="stress-drawdown"
                    type="range"
                    min={0}
                    max={100}
                    step={25}
                    value={revolverDrawdownPct}
                    onChange={(e) => setRevolverDrawdownPct(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2.5 pr-4 font-semibold">Loan Facility</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Base EAD</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Base EL</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Stressed EAD</th>
                    <th className="py-2.5 pl-4 font-semibold text-right">Stressed EL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-xs sm:text-sm">
                  {stressResult.facilities.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2.5 pr-4 font-sans font-medium text-slate-900">{row.name}</td>
                      <td className="py-2.5 px-4 text-right text-slate-700">
                        {formatUsd(row.baseEad)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-900">
                        {formatUsd(row.baseEl)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-700">
                        {formatUsd(row.stressedEad)}
                      </td>
                      <td className="py-2.5 pl-4 text-right font-semibold text-slate-900">
                        {formatUsd(row.stressedEl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 font-mono tabular-nums text-sm font-semibold bg-slate-50">
                    <td className="py-3 px-2 font-sans text-slate-900">Portfolio Total</td>
                    <td className="py-3 px-4 text-right text-slate-900">
                      {formatUsd(stressResult.baseTotalEad)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900">
                      {formatUsd(stressResult.baseTotalEl)} ({stressResult.baseElRatePct.toFixed(2)}%)
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900">
                      {formatUsd(stressResult.stressedTotalEad)}
                    </td>
                    <td
                      data-testid="portfolio-stressed-el"
                      className="py-3 px-4 text-right text-red-700"
                    >
                      {formatUsd(stressResult.stressedTotalEl)} ({stressResult.elJumpMultiple.toFixed(2)}x)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LAB 2: Scorecard Discrimination, WoE/IV & PSI */}
      {activeLab === 'scorecard-psi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Scorecard Discrimination (AUROC / Gini / KS) &amp; PSI Drift
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validation requires <span className="font-mono">KS &gt; 30%</span> and{' '}
                  <span className="font-mono">PSI &lt; 0.10</span> for stable deployment.
                </p>
              </div>
              <StatusBadge band={scorecardMetrics.psiBand} label={scorecardMetrics.psiBand} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">AUROC</div>
                <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1">
                  {auroc.toFixed(2)}
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Gini (2×AUC−1)</div>
                <div
                  data-testid="lab-gini-value"
                  className="text-lg font-semibold font-mono tabular-nums text-[#1E3A8A] mt-1"
                >
                  {scorecardMetrics.gini.toFixed(2)} ({scorecardMetrics.giniPct.toFixed(0)}%)
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">KS Separation</div>
                <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1">
                  {scorecardMetrics.ksApprox.toFixed(1)}%
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Population PSI</div>
                <div
                  data-testid="lab-psi-value"
                  className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1"
                >
                  {scorecardMetrics.psi.toFixed(3)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-50 rounded-lg text-xs">
              <span className="font-medium text-slate-700">{scorecardMetrics.ksLabel}</span>
              <StatusBadge band={scorecardMetrics.ksBand} label={`KS ${scorecardMetrics.ksApprox.toFixed(0)}%`} />
            </div>

            {/* Interactive SVG ROC Curve vs Random Diagonal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-[#F8FAFC]">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  ROC Discrimination Curve (AUROC {auroc.toFixed(2)})
                </div>
                <svg
                  viewBox="0 0 240 190"
                  className="w-full h-44"
                  role="img"
                  aria-label="ROC curve comparing scorecard discrimination against random 45-degree baseline"
                >
                  <line x1="35" y1="160" x2="220" y2="160" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="35" y1="20" x2="35" y2="160" stroke="#CBD5E1" strokeWidth="1" />
                  {/* Random 45-deg baseline */}
                  <line
                    x1="35"
                    y1="160"
                    x2="220"
                    y2="20"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  {/* Bowed ROC Curve governed by AUROC */}
                  {(() => {
                    const lift = (auroc - 0.5) * 2; // 0 to 1
                    const ctrlX = 127 - lift * 75;
                    const ctrlY = 90 - lift * 62;
                    return (
                      <path
                        d={`M 35 160 Q ${ctrlX} ${ctrlY}, 220 20`}
                        fill="none"
                        stroke="#1E3A8A"
                        strokeWidth="2.5"
                      />
                    );
                  })()}
                  <text x="127" y="180" textAnchor="middle" fontSize="10" fill="#64748B">
                    1 − Specificity (False Positive Rate)
                  </text>
                  <text
                    x="14"
                    y="90"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748B"
                    transform="rotate(-90 14 90)"
                  >
                    Sensitivity (TPR)
                  </text>
                </svg>
              </div>

              {/* PSI Bin Drift Visualizer */}
              <div className="border border-slate-200 rounded-lg p-4 bg-[#F8FAFC]">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Score Bin Drift: Expected vs. Actual ({scorecardMetrics.psiLabel.split('—')[0].trim()})
                </div>
                <div className="space-y-2.5 pt-2">
                  {scorecardMetrics.expectedBins.map((exp, idx) => {
                    const act = scorecardMetrics.actualBins[idx];
                    return (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between text-slate-600 font-mono tabular-nums mb-1">
                          <span>Band {idx + 1}</span>
                          <span>
                            Exp {exp.toFixed(0)}% / Act {act.toFixed(0)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-2 bg-slate-200 rounded overflow-hidden">
                            <div className="h-full bg-slate-500" style={{ width: `${exp * 2}%` }} />
                          </div>
                          <div className="h-2 bg-slate-200 rounded overflow-hidden">
                            <div
                              className={`h-full ${
                                scorecardMetrics.psiBand === 'CRITICAL'
                                  ? 'bg-red-600'
                                  : scorecardMetrics.psiBand === 'ELEVATED'
                                  ? 'bg-amber-600'
                                  : 'bg-[#1E3A8A]'
                              }`}
                              style={{ width: `${Math.min(100, act * 2)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Control Deck */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-slate-900 pb-3 border-b border-slate-100">
              Validation Controls &amp; IV Leakage Audit
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <label htmlFor="slider-auroc">Model AUROC</label>
                  <span className="font-mono tabular-nums font-semibold">{auroc.toFixed(2)}</span>
                </div>
                <input
                  id="slider-auroc"
                  type="range"
                  min={0.52}
                  max={0.94}
                  step={0.01}
                  value={auroc}
                  onChange={(e) => setAuroc(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <label htmlFor="slider-psi-shift">Live Population Score Drift</label>
                  <span className="font-mono tabular-nums font-semibold">
                    PSI {scorecardMetrics.psi.toFixed(3)}
                  </span>
                </div>
                <input
                  id="slider-psi-shift"
                  type="range"
                  min={0}
                  max={40}
                  step={2}
                  value={psiShiftLevel}
                  onChange={(e) => setPsiShiftLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <label htmlFor="slider-iv">Feature Information Value (IV) Auditor</label>
                  <span className="font-mono tabular-nums font-semibold">{ivTestVal.toFixed(2)}</span>
                </div>
                <input
                  id="slider-iv"
                  type="range"
                  min={0.01}
                  max={0.7}
                  step={0.01}
                  value={ivTestVal}
                  onChange={(e) => setIvTestVal(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-3 p-3.5 bg-slate-50 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900">{ivEval.label}</span>
                    <StatusBadge band={ivEval.band} />
                  </div>
                  <p className="text-xs text-slate-600">{ivEval.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: Borrower Solvency & Working Capital */}
      {activeLab === 'financial-ratios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Corporate Underwriting: DSCR, ICR &amp; Working Capital Cycle
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preloaded with NotebookLM Question 2 ($4.5M EBITDA, $0.8M Interest, $1.2M Principal).
                </p>
              </div>
              <StatusBadge band={ratiosResult.dscrBand} label={ratiosResult.dscrBand} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">DSCR (EBITDA / Debt Service)</div>
                <div
                  data-testid="lab-dscr-value"
                  className="text-2xl font-semibold font-mono tabular-nums text-slate-900 mt-1"
                >
                  {ratiosResult.dscr.toFixed(2)}x
                </div>
                <div className="text-xs text-slate-600 mt-1">Benchmark: &gt; 1.25x</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Interest Coverage (EBIT / Int.)</div>
                <div className="text-2xl font-semibold font-mono tabular-nums text-slate-900 mt-1">
                  {ratiosResult.interestCoverage.toFixed(2)}x
                </div>
                <div className="text-xs text-slate-600 mt-1">Benchmark: &gt; 3.00x</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Cash Conversion Cycle</div>
                <div className="text-2xl font-semibold font-mono tabular-nums text-[#1E3A8A] mt-1">
                  {ratiosResult.workingCapitalCycleDays} Days
                </div>
                <div className="text-xs text-slate-600 mt-1">DIO + DSO − DPO</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
              <strong className="text-slate-900">Underwriter Verdict:</strong>{' '}
              {ratiosResult.dscrVerdict}. Total annual debt service is{' '}
              <span className="font-mono font-semibold tabular-nums">
                {formatUsd(ratiosResult.totalDebtService)}
              </span>
              .
              {dsoDays > 75 &&
                ' Red Flag: Elevated Days Sales Outstanding (DSO > 75 days) signals delayed customer collections or channel stuffing.'}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-slate-900 pb-3 border-b border-slate-100">
              Borrower Cash Flow Inputs
            </h2>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="slider-ebitda">Operating EBITDA ($)</label>
                <span className="font-mono tabular-nums font-semibold">{formatUsd(ebitda)}</span>
              </div>
              <input
                id="slider-ebitda"
                type="range"
                min={1000000}
                max={8000000}
                step={250000}
                value={ebitda}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setEbitda(next);
                  setEbit(Math.round(next * 0.8));
                }}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="slider-interest">Annual Interest Expense ($)</label>
                <span className="font-mono tabular-nums font-semibold">
                  {formatUsd(interestExpense)}
                </span>
              </div>
              <input
                id="slider-interest"
                type="range"
                min={200000}
                max={2500000}
                step={100000}
                value={interestExpense}
                onChange={(e) => setInterestExpense(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="slider-principal">Principal Repayment Due ($)</label>
                <span className="font-mono tabular-nums font-semibold">
                  {formatUsd(principalRepayment)}
                </span>
              </div>
              <input
                id="slider-principal"
                type="range"
                min={200000}
                max={3000000}
                step={100000}
                value={principalRepayment}
                onChange={(e) => setPrincipalRepayment(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="input-dio" className="block text-xs font-medium text-slate-600 mb-1">
                  DIO (Days)
                </label>
                <input
                  id="input-dio"
                  type="number"
                  value={dioDays}
                  onChange={(e) => setDioDays(Number(e.target.value))}
                  className="w-full h-9 px-2.5 text-sm font-mono border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="input-dso" className="block text-xs font-medium text-slate-600 mb-1">
                  DSO (Days)
                </label>
                <input
                  id="input-dso"
                  type="number"
                  value={dsoDays}
                  onChange={(e) => setDsoDays(Number(e.target.value))}
                  className="w-full h-9 px-2.5 text-sm font-mono border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="input-dpo" className="block text-xs font-medium text-slate-600 mb-1">
                  DPO (Days)
                </label>
                <input
                  id="input-dpo"
                  type="number"
                  value={dpoDays}
                  onChange={(e) => setDpoDays(Number(e.target.value))}
                  className="w-full h-9 px-2.5 text-sm font-mono border border-slate-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
