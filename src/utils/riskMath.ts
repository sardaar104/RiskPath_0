export type StudentBackground = 'non-technical' | 'commerce-finance' | 'quantitative';
export type CareerTrack = 'credit-analyst' | 'risk-modeling' | 'model-validation' | 'regulatory-ecl';
export type PlanDuration = 4 | 8 | 12;

export interface StudyPlanConfig {
  background: StudentBackground;
  track: CareerTrack;
  duration: PlanDuration;
  weeklyHours: 6 | 12 | 20;
}

export interface StudyMilestone {
  id: string;
  title: string;
  category: 'Credit Fundamentals' | 'SQL & Data' | 'Stats & Econometrics' | 'Tooling (R/Python)' | 'Interview Drill';
  detail: string;
}

export interface StudyWeek {
  weekNumber: number;
  phase: string;
  title: string;
  focusSummary: string;
  notebookModuleRef: string;
  statsFocus: string;
  toolingFocus: string;
  estimatedHours: number;
  milestones: StudyMilestone[];
}

export interface ExpectedLossInput {
  drawnBalance: number;
  undrawnLimit: number;
  ccfPct: number; // 0 - 100
  pdPct: number; // 0 - 100
  lgdPct: number; // 0 - 100
}

export interface ExpectedLossResult {
  totalLimit: number;
  ead: number;
  expectedLoss: number;
  lossRateOnEadPct: number;
}

export function calculateExpectedLoss(input: ExpectedLossInput): ExpectedLossResult {
  const drawn = Math.max(0, input.drawnBalance);
  const undrawn = Math.max(0, input.undrawnLimit);
  const ccf = Math.min(1, Math.max(0, input.ccfPct / 100));
  const pd = Math.min(1, Math.max(0, input.pdPct / 100));
  const lgd = Math.min(1, Math.max(0, input.lgdPct / 100));

  const ead = drawn + ccf * undrawn;
  const expectedLoss = pd * lgd * ead;
  const lossRateOnEadPct = ead > 0 ? (expectedLoss / ead) * 100 : 0;

  return {
    totalLimit: drawn + undrawn,
    ead: roundTo(ead, 2),
    expectedLoss: roundTo(expectedLoss, 2),
    lossRateOnEadPct: roundTo(lossRateOnEadPct, 3),
  };
}

export interface PortfolioFacility {
  id: string;
  name: string;
  drawnBalance: number;
  undrawnLimit: number;
  ccfPct: number;
  pdPct: number;
  lgdPct: number;
}

export interface StressScenario {
  pdMultiplier: number; // e.g., 2.0 doubles PD
  lgdAddPp: number; // e.g., +10 percentage points
  revolverDrawdownPct: number; // 0-100: % of undrawn drawn under stress (100 = full drawdown)
}

export interface PortfolioStressResult {
  baseTotalEad: number;
  baseTotalEl: number;
  baseElRatePct: number;
  stressedTotalEad: number;
  stressedTotalEl: number;
  stressedElRatePct: number;
  elJumpMultiple: number;
  facilities: Array<{
    id: string;
    name: string;
    baseEad: number;
    baseEl: number;
    stressedEad: number;
    stressedEl: number;
  }>;
}

export function calculatePortfolioStress(
  facilities: PortfolioFacility[],
  stress: StressScenario
): PortfolioStressResult {
  let baseTotalEad = 0;
  let baseTotalEl = 0;
  let stressedTotalEad = 0;
  let stressedTotalEl = 0;

  const breakdown = facilities.map((f) => {
    const base = calculateExpectedLoss({
      drawnBalance: f.drawnBalance,
      undrawnLimit: f.undrawnLimit,
      ccfPct: f.ccfPct,
      pdPct: f.pdPct,
      lgdPct: f.lgdPct,
    });

    const stressedPd = Math.min(100, f.pdPct * stress.pdMultiplier);
    const stressedLgd = Math.min(100, Math.max(0, f.lgdPct + stress.lgdAddPp));
    const additionalDraw = f.undrawnLimit > 0 ? f.undrawnLimit * (stress.revolverDrawdownPct / 100) : 0;
    const stressedDrawn = f.drawnBalance + additionalDraw;
    const remainingUndrawn = Math.max(0, f.undrawnLimit - additionalDraw);

    const stressed = calculateExpectedLoss({
      drawnBalance: stressedDrawn,
      undrawnLimit: remainingUndrawn,
      ccfPct: f.ccfPct,
      pdPct: stressedPd,
      lgdPct: stressedLgd,
    });

    baseTotalEad += base.ead;
    baseTotalEl += base.expectedLoss;
    stressedTotalEad += stressed.ead;
    stressedTotalEl += stressed.expectedLoss;

    return {
      id: f.id,
      name: f.name,
      baseEad: base.ead,
      baseEl: base.expectedLoss,
      stressedEad: stressed.ead,
      stressedEl: stressed.expectedLoss,
    };
  });

  const baseElRatePct = baseTotalEad > 0 ? (baseTotalEl / baseTotalEad) * 100 : 0;
  const stressedElRatePct = stressedTotalEad > 0 ? (stressedTotalEl / stressedTotalEad) * 100 : 0;
  const elJumpMultiple = baseTotalEl > 0 ? stressedTotalEl / baseTotalEl : 0;

  return {
    baseTotalEad: roundTo(baseTotalEad, 2),
    baseTotalEl: roundTo(baseTotalEl, 2),
    baseElRatePct: roundTo(baseElRatePct, 3),
    stressedTotalEad: roundTo(stressedTotalEad, 2),
    stressedTotalEl: roundTo(stressedTotalEl, 2),
    stressedElRatePct: roundTo(stressedElRatePct, 3),
    elJumpMultiple: roundTo(elJumpMultiple, 2),
    facilities: breakdown,
  };
}

export interface EclMigrationInput {
  exposureAmount: number;
  lgdPct: number;
  pd12mPct: number;
  pdLifetimePct: number;
}

export interface EclMigrationResult {
  stage1Provision: number;
  stage2Provision: number;
  provisionIncrease: number;
  reserveMultiple: number;
}

export function calculateEclMigration(input: EclMigrationInput): EclMigrationResult {
  const ead = Math.max(0, input.exposureAmount);
  const lgd = Math.min(1, Math.max(0, input.lgdPct / 100));
  const pd12m = Math.min(1, Math.max(0, input.pd12mPct / 100));
  const pdLife = Math.min(1, Math.max(0, input.pdLifetimePct / 100));

  const stage1Provision = roundTo(pd12m * lgd * ead, 2);
  const stage2Provision = roundTo(pdLife * lgd * ead, 2);
  const provisionIncrease = roundTo(stage2Provision - stage1Provision, 2);
  const reserveMultiple = stage1Provision > 0 ? roundTo(stage2Provision / stage1Provision, 2) : 0;

  return {
    stage1Provision,
    stage2Provision,
    provisionIncrease,
    reserveMultiple,
  };
}

// Standard Normal CDF using Abramowitz & Stegun approximation (error < 7.5e-8)
export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.31938153 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

// Inverse Standard Normal CDF (Acklam's rational approximation)
export function normalInvCdf(p: number): number {
  const clamped = Math.min(0.999999, Math.max(0.000001, p));
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (clamped < pLow) {
    const q = Math.sqrt(-2 * Math.log(clamped));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (clamped <= pHigh) {
    const q = clamped - 0.5;
    const r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }
  const q = Math.sqrt(-2 * Math.log(1 - clamped));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

export interface VasicekInput {
  pdPct: number;
  lgdPct: number;
  rho: number; // systematic asset correlation 0.01 - 0.30
  confidence?: number; // default 0.999
}

export interface VasicekResult {
  wcdrPct: number;
  capitalRequirementPct: number; // K = LGD * (WCDR - PD)
  expectedLossPct: number;
}

export function calculateVasicekCapital(input: VasicekInput): VasicekResult {
  const pd = Math.min(0.99, Math.max(0.0001, input.pdPct / 100));
  const lgd = Math.min(1, Math.max(0, input.lgdPct / 100));
  const rho = Math.min(0.5, Math.max(0.005, input.rho));
  const conf = input.confidence ?? 0.999;

  const zPd = normalInvCdf(pd);
  const zConf = normalInvCdf(conf);
  const wcdr = normalCdf((zPd + Math.sqrt(rho) * zConf) / Math.sqrt(1 - rho));
  const k = Math.max(0, lgd * (wcdr - pd));

  return {
    wcdrPct: roundTo(wcdr * 100, 2),
    capitalRequirementPct: roundTo(k * 100, 2),
    expectedLossPct: roundTo(pd * lgd * 100, 2),
  };
}

export type SemanticBand = 'NOMINAL' | 'ELEVATED' | 'CRITICAL';

export interface ScorecardAnalysisResult {
  gini: number;
  giniPct: number;
  ksApprox: number;
  ksBand: SemanticBand;
  ksLabel: string;
  accuracyPct: number;
  precisionPct: number;
  recallPct: number;
  specificityPct: number;
  psi: number;
  psiBand: SemanticBand;
  psiLabel: string;
}

export function evaluatePsi(expectedShares: number[], actualShares: number[]): {
  psi: number;
  band: SemanticBand;
  label: string;
} {
  const eps = 0.0001;
  const expSum = expectedShares.reduce((a, b) => a + b, 0) || 1;
  const actSum = actualShares.reduce((a, b) => a + b, 0) || 1;

  let psi = 0;
  for (let i = 0; i < expectedShares.length; i++) {
    const e = Math.max(eps, expectedShares[i] / expSum);
    const a = Math.max(eps, (actualShares[i] ?? 0) / actSum);
    psi += (a - e) * Math.log(a / e);
  }
  const rounded = roundTo(psi, 4);
  if (rounded < 0.1) {
    return { psi: rounded, band: 'NOMINAL', label: 'Stable Population — No Action Required' };
  }
  if (rounded <= 0.25) {
    return { psi: rounded, band: 'ELEVATED', label: 'Moderate Drift — Monitor Closely' };
  }
  return { psi: rounded, band: 'CRITICAL', label: 'Significant Drift — Recalibrate / Redevelop' };
}

export function calculateScorecardMetrics(params: {
  auroc: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  expectedBins: number[];
  actualBins: number[];
}): ScorecardAnalysisResult {
  const auroc = Math.min(0.99, Math.max(0.5, params.auroc));
  const gini = roundTo(2 * auroc - 1, 4);
  const giniPct = roundTo(gini * 100, 1);

  // Operational proxy relationship between Gini/AUROC and KS under binormal separation
  const dPrime = Math.SQRT2 * normalInvCdf(auroc);
  const ksApprox = roundTo((2 * normalCdf(dPrime / 2) - 1) * 100, 1);
  const ksBand: SemanticBand = ksApprox >= 35 ? 'NOMINAL' : ksApprox >= 30 ? 'ELEVATED' : 'CRITICAL';
  const ksLabel =
    ksApprox >= 30
      ? 'Meets Deployment Benchmark (KS > 30%)'
      : 'Below Deployment Benchmark (KS < 30%)';

  const total = params.tp + params.fp + params.tn + params.fn;
  const accuracyPct = total > 0 ? roundTo(((params.tp + params.tn) / total) * 100, 1) : 0;
  const precisionPct =
    params.tp + params.fp > 0 ? roundTo((params.tp / (params.tp + params.fp)) * 100, 1) : 0;
  const recallPct =
    params.tp + params.fn > 0 ? roundTo((params.tp / (params.tp + params.fn)) * 100, 1) : 0;
  const specificityPct =
    params.tn + params.fp > 0 ? roundTo((params.tn / (params.tn + params.fp)) * 100, 1) : 0;

  const psiEval = evaluatePsi(params.expectedBins, params.actualBins);

  return {
    gini,
    giniPct,
    ksApprox,
    ksBand,
    ksLabel,
    accuracyPct,
    precisionPct,
    recallPct,
    specificityPct,
    psi: psiEval.psi,
    psiBand: psiEval.band,
    psiLabel: psiEval.label,
  };
}

export function evaluateIvStrength(iv: number): {
  label: string;
  recommendation: string;
  band: SemanticBand;
} {
  if (iv < 0.02) {
    return {
      label: 'Not Predictive (< 0.02)',
      recommendation: 'Exclude variable from scorecard.',
      band: 'CRITICAL',
    };
  }
  if (iv < 0.1) {
    return {
      label: 'Weak Predictive Power (0.02 – 0.10)',
      recommendation: 'Include only if domain rationale is critical.',
      band: 'ELEVATED',
    };
  }
  if (iv < 0.3) {
    return {
      label: 'Medium Predictive Power (0.10 – 0.30)',
      recommendation: 'Standard candidate predictor for Logistic Regression.',
      band: 'NOMINAL',
    };
  }
  if (iv <= 0.5) {
    return {
      label: 'Strong Predictive Power (0.30 – 0.50)',
      recommendation: 'Core risk driver; verify stability across vintages.',
      band: 'NOMINAL',
    };
  }
  return {
    label: 'Suspiciously High (> 0.50)',
    recommendation: 'Audit immediately for target data leakage or post-default proxies.',
    band: 'CRITICAL',
  };
}

export interface FinancialRatiosInput {
  ebitda: number;
  ebit: number;
  interestExpense: number;
  principalRepayment: number;
  currentAssets: number;
  currentLiabilities: number;
  dioDays: number;
  dsoDays: number;
  dpoDays: number;
}

export interface FinancialRatiosResult {
  totalDebtService: number;
  dscr: number;
  dscrBand: SemanticBand;
  dscrVerdict: string;
  interestCoverage: number;
  icrBand: SemanticBand;
  currentRatio: number;
  workingCapitalCycleDays: number;
}

export function calculateFinancialRatios(input: FinancialRatiosInput): FinancialRatiosResult {
  const totalDebtService = Math.max(1, input.interestExpense + input.principalRepayment);
  const dscr = roundTo(input.ebitda / totalDebtService, 2);
  const interestCoverage = roundTo(input.ebit / Math.max(1, input.interestExpense), 2);
  const currentRatio = roundTo(input.currentAssets / Math.max(1, input.currentLiabilities), 2);
  const workingCapitalCycleDays = Math.round(input.dioDays + input.dsoDays - input.dpoDays);

  let dscrBand: SemanticBand = 'NOMINAL';
  let dscrVerdict = 'Healthy Repayment Cushion (DSCR > 1.25x)';
  if (dscr < 1.0) {
    dscrBand = 'CRITICAL';
    dscrVerdict = 'Cash Shortfall Risk (DSCR < 1.00x — Reserves / Refinancing Needed)';
  } else if (dscr <= 1.25) {
    dscrBand = 'ELEVATED';
    dscrVerdict = 'Thin Margin (1.00x – 1.25x — Sensitive to Revenue Shocks)';
  }

  let icrBand: SemanticBand = 'NOMINAL';
  if (interestCoverage < 1.5) {
    icrBand = 'CRITICAL';
  } else if (interestCoverage < 3.0) {
    icrBand = 'ELEVATED';
  }

  return {
    totalDebtService,
    dscr,
    dscrBand,
    dscrVerdict,
    interestCoverage,
    icrBand,
    currentRatio,
    workingCapitalCycleDays,
  };
}

export function generateStudyPlan(config: StudyPlanConfig): StudyWeek[] {
  const isNonTech = config.background === 'non-technical';
  const isCommerce = config.background === 'commerce-finance';

  const trackLabelMap: Record<CareerTrack, string> = {
    'credit-analyst': 'Corporate & Retail Credit Underwriting',
    'risk-modeling': 'Credit Risk Analytics & Scorecard Modeling',
    'model-validation': 'Model Risk Management (MRM) & Validation',
    'regulatory-ecl': 'IFRS 9 / RBI ECL & Basel Capital Strategy',
  };

  const toolingByTrack: Record<CareerTrack, string> = {
    'credit-analyst': isNonTech
      ? 'Start with SQL querying + Excel cash-flow modeling; add Python pandas later for portfolio slicing.'
      : 'SQL + Excel sensitivity models + Python for automated financial ratio screening.',
    'risk-modeling':
      'SQL for data extraction + Python (scikit-learn, statsmodels, optbinning) as primary modeling stack; R literacy for statistical checks.',
    'model-validation':
      'Python for pipeline replication + R (plm, sandwich, scorecard) for independent econometric challenger tests and PSI/KS audits.',
    'regulatory-ecl':
      'SQL for staging migration tables + R for macro time-series econometrics (ARIMA/VAR) + Python for automated ECL scenario runs.',
  };

  const baseModules: Omit<StudyWeek, 'weekNumber' | 'estimatedHours'>[] = [
    {
      phase: 'Phase 1 · Financial & Data Foundations',
      title: 'Financial Statements, Solvency Ratios & SQL Execution Order',
      focusSummary: isNonTech
        ? `Build intuition from household cash flow to corporate EBITDA before touching code. Learn why ${trackLabelMap[config.track]} relies on DSCR (>1.25x) and clean SQL filtering.`
        : 'Master corporate cash-flow underwriting metrics alongside SQL logical execution order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT).',
      notebookModuleRef: 'NotebookLM §1.1 & §2.1–2.2',
      statsFocus:
        'Descriptive statistics: mean vs. median borrower debt, skewness in loan sizes, and ratio benchmarking.',
      toolingFocus: isNonTech
        ? 'Zero-to-one SQL setup (PostgreSQL / DB Fiddle): SELECT, WHERE vs. HAVING, and NULL three-valued logic.'
        : 'PostgreSQL multi-condition filtering, NULL handling, and ratio calculation queries.',
      milestones: [
        {
          id: 'm1-dscr',
          title: 'Compute DSCR, Interest Coverage, and Working Capital Cycle (DIO + DSO - DPO)',
          category: 'Credit Fundamentals',
          detail: 'Verify healthy thresholds (>1.25x DSCR, >3.0x ICR) and identify Receivables-to-Sales red flags.',
        },
        {
          id: 'm1-sql-order',
          title: 'Memorize the 7-step SQL logical execution order & WHERE vs. HAVING rule',
          category: 'SQL & Data',
          detail: 'Write 3 queries filtering raw loans (WHERE) vs. aggregated customer exposure > $50k (HAVING).',
        },
        {
          id: 'm1-stats-desc',
          title: 'Interpret skewed loan distributions using percentiles instead of averages',
          category: 'Stats & Econometrics',
          detail: 'Compare mean vs. 50th/90th percentile portfolio balances to avoid outlier bias.',
        },
      ],
    },
    {
      phase: 'Phase 1 · Financial & Data Foundations',
      title: 'Relational Joins, Anti-Joins, Window Functions & OLAP Schemas',
      focusSummary:
        'Combine borrower master tables with loan disbursement ledgers safely without losing missing records or duplicating balances.',
      notebookModuleRef: 'NotebookLM §1.2–1.5',
      statsFocus:
        'Cohort & vintage aggregation logic: understanding cumulative exposure growth across borrower tenure.',
      toolingFocus:
        'Master LEFT JOIN, Anti-Joins (WHERE right_id IS NULL), DENSE_RANK() vs. RANK(), and CTE pipelines.',
      milestones: [
        {
          id: 'm2-joins',
          title: 'Write an Anti-Join audit query to find borrowers with zero active loans',
          category: 'SQL & Data',
          detail: 'Practice LEFT JOIN ... WHERE l.loan_id IS NULL and verify NULL comparison traps.',
        },
        {
          id: 'm2-window',
          title: 'Build a CTE + DENSE_RANK() query for Top-N borrowers per sector',
          category: 'SQL & Data',
          detail: 'Solve NotebookLM Practice Question 1 and compare ROW_NUMBER vs. RANK vs. DENSE_RANK.',
        },
        {
          id: 'm2-schema',
          title: 'Contrast OLTP Normalization (3NF) vs. OLAP Denormalization & Indexing',
          category: 'Tooling (R/Python)',
          detail: 'Explain Clustered vs. Non-Clustered index trade-offs for risk reporting queries.',
        },
      ],
    },
    {
      phase: 'Phase 2 · Core Credit Loss Mechanics',
      title: 'Expected Loss Framework (PD, LGD, EAD & Revolving CCF)',
      focusSummary:
        'Translate borrower default risk into dollar loss expectations across term loans and revolving credit lines.',
      notebookModuleRef: 'NotebookLM §3.1–3.2',
      statsFocus:
        'Probability fundamentals: conditional probability of default, expected value E[Loss], and joint correlation under stress.',
      toolingFocus: isCommerce
        ? 'Implement the 3-loan EL table in Excel first, then replicate in Python pandas or R data.frame.'
        : toolingByTrack[config.track],
      milestones: [
        {
          id: 'm3-el-math',
          title: 'Calculate Revolving EAD = Drawn + CCF × Undrawn and EL = PD × LGD × EAD',
          category: 'Credit Fundamentals',
          detail: 'Solve NotebookLM Question 3 ($29,000 EAD and $870 EL) by hand and in the interactive lab.',
        },
        {
          id: 'm3-stress',
          title: 'Model joint downturn correlation (2.81x EL jump when PD, LGD & drawdowns spike)',
          category: 'Stats & Econometrics',
          detail: 'Demonstrate why doubling PD alone understates crisis losses when parameters co-move.',
        },
      ],
    },
    {
      phase: 'Phase 2 · Core Credit Loss Mechanics',
      title: 'Unexpected Loss, Normal Tail Risk & Basel Vasicek Capital',
      focusSummary:
        'Understand why banks price Expected Loss into interest rates while holding CET1 Capital against extreme 99.9th percentile tail losses.',
      notebookModuleRef: 'NotebookLM §3.3 & §4.3',
      statsFocus:
        'Standard Normal Distribution Φ(z), inverse quantiles Φ⁻¹(0.999), and systematic asset correlation ρ.',
      toolingFocus:
        config.track === 'model-validation' || config.track === 'regulatory-ecl'
          ? 'Code the Vasicek WCDR formula in R (pnorm/qnorm) and verify against Python scipy.stats.norm.'
          : 'Simulate Vasicek capital sensitivity using our Risk Lab and verify RWA intuition.',
      milestones: [
        {
          id: 'm4-vasicek',
          title: 'Derive intuition for WCDR and Capital Requirement K = LGD × (WCDR - PD)',
          category: 'Stats & Econometrics',
          detail: 'Explain why higher systematic correlation ρ widens the tail between EL and 99.9% VaR.',
        },
        {
          id: 'm4-basel',
          title: 'Distinguish EL (P&L provisions & pricing) from UL (CET1 Capital & RWAs)',
          category: 'Credit Fundamentals',
          detail: 'Prepare a 60-second interview explanation of Basel III capital buffers.',
        },
      ],
    },
    {
      phase: 'Phase 3 · Regulatory Provisioning & Econometrics',
      title: 'IFRS 9 / Ind AS 109 Three-Stage ECL & Macro Econometrics',
      focusSummary:
        'Learn how forward-looking macroeconomic models shift loans from 12-Month ECL (Stage 1) to Lifetime ECL (Stage 2) and create provision cliffs.',
      notebookModuleRef: 'NotebookLM §4.1–4.2',
      statsFocus:
        'Time-series & econometric intuition: linking GDP, unemployment, and interest rates to forward-looking PD curves.',
      toolingFocus:
        config.track === 'regulatory-ecl'
          ? 'Use R (forecast / lm) to regress historical default rates against macro GDP shocks.'
          : 'Compare R econometric summary tables vs. Python statsmodels OLS outputs.',
      milestones: [
        {
          id: 'm5-ecl-stages',
          title: 'Contrast Stage 1 (12M ECL), Stage 2 (SICR >30 DPD, Lifetime ECL), and Stage 3 (>90 DPD NPA)',
          category: 'Credit Fundamentals',
          detail: 'Solve NotebookLM Question 4 showing the 8.0x provision cliff ($60k to $480k).',
        },
        {
          id: 'm5-macro',
          title: 'Map macroeconomic scenarios (Base, Upturn, Downturn) to probability-weighted ECL',
          category: 'Stats & Econometrics',
          detail: 'Explain why ECL is countercyclical compared to legacy Incurred Loss accounting.',
        },
      ],
    },
    {
      phase: 'Phase 3 · Regulatory Provisioning & Econometrics',
      title: 'Logistic Regression Scorecards, WoE Binning & Information Value',
      focusSummary:
        'Bridge statistics to real credit scoring: learn how banks turn raw borrower age, income, and DPD into monotonic risk points.',
      notebookModuleRef: 'NotebookLM §5.1',
      statsFocus:
        'Odds, log-odds ln(p/(1-p)), Maximum Likelihood intuition, and monotonic Weight of Evidence (WoE) transformation.',
      toolingFocus:
        config.track === 'credit-analyst'
          ? 'Understand WoE/IV output tables used by underwriting policy teams.'
          : 'Compare Python optbinning + LogisticRegression vs. R scorecard package.',
      milestones: [
        {
          id: 'm6-woe',
          title: 'Compute WoE = ln(% Non-Defaults / % Defaults) and Information Value (IV)',
          category: 'Stats & Econometrics',
          detail: 'Memorize IV decision thresholds and spot IV > 0.50 as a data leakage red flag.',
        },
        {
          id: 'm6-logit',
          title: 'Interpret Logistic Regression β coefficients as log-odds shifts',
          category: 'Tooling (R/Python)',
          detail: 'Walk through a 4-variable retail scorecard in Python or R.',
        },
      ],
    },
    {
      phase: 'Phase 4 · Model Validation & Interview Mastery',
      title: 'Discrimination, Calibration, KS Statistic & PSI Monitoring',
      focusSummary:
        'Evaluate whether a credit model ranks risky borrowers properly (AUROC, Gini, KS > 30%) and detect live population drift (PSI).',
      notebookModuleRef: 'NotebookLM §5.2–5.3',
      statsFocus:
        'Confusion matrix Type I/II errors, cumulative distribution separation (KS), and KL-divergence intuition behind PSI.',
      toolingFocus:
        'Build an automated PSI & KS validation checklist in Python or R for deployed scorecards.',
      milestones: [
        {
          id: 'm7-metrics',
          title: 'Convert AUROC to Gini (2×AUROC - 1) and verify KS > 30% deployment hurdle',
          category: 'Credit Fundamentals',
          detail: 'Solve NotebookLM Question 5 (AUROC 0.78 -> Gini 0.56 / 56%).',
        },
        {
          id: 'm7-psi',
          title: 'Apply PSI Decision Framework (<0.10 Stable, 0.10–0.25 Monitor, >0.25 Recalibrate)',
          category: 'Stats & Econometrics',
          detail: 'Test bin shift scenarios in the Scorecard & PSI Risk Lab.',
        },
      ],
    },
    {
      phase: 'Phase 4 · Model Validation & Interview Mastery',
      title: 'Full Mock Interview Loop: NBFCs, GCCs, Commercial Banks & Big Four',
      focusSummary:
        'Synthesize SQL coding, financial ratios, loss math, and econometric reasoning under timed interview conditions.',
      notebookModuleRef: 'NotebookLM §6–7 (Full Question Bank & Glossary)',
      statsFocus:
        'Translate technical math (p-values, VIF multicollinearity, Gini, PSI) into plain business English for Risk Directors.',
      toolingFocus:
        'Complete end-to-end case study: extract cohort in SQL -> model PD/EL in Python/R -> present risk memo.',
      milestones: [
        {
          id: 'm8-qbank',
          title: 'Score 5/5 on the NotebookLM Technical Practice Question Bank without hints',
          category: 'Interview Drill',
          detail: 'SQL Top-2 Sector, DSCR 2.25x, Revolving EL $870, ECL 8.0x Cliff, and Gini 56%.',
        },
        {
          id: 'm8-glossary',
          title: 'Articulate all 15 Essential Glossary terms with real lending examples',
          category: 'Interview Drill',
          detail: 'Practice Anti-Join, SICR, Vasicek, CCF, and WoE aloud for interview fluency.',
        },
      ],
    },
  ];

  // Adapt cadence to 4, 8, or 12 weeks
  if (config.duration === 4) {
    // Condense 8 modules into 4 intensive sprint weeks
    const condensed: StudyWeek[] = [];
    for (let i = 0; i < 4; i++) {
      const a = baseModules[i * 2];
      const b = baseModules[i * 2 + 1];
      condensed.push({
        weekNumber: i + 1,
        phase: a.phase,
        title: `${a.title.split('&')[0].trim()} & ${b.title.split('&')[0].trim()}`,
        focusSummary: `${a.focusSummary} ${b.focusSummary}`,
        notebookModuleRef: `${a.notebookModuleRef} + ${b.notebookModuleRef}`,
        statsFocus: `${a.statsFocus} / ${b.statsFocus}`,
        toolingFocus: `${a.toolingFocus}`,
        estimatedHours: config.weeklyHours,
        milestones: [...a.milestones, ...b.milestones],
      });
    }
    return condensed;
  }

  if (config.duration === 12) {
    // Expand with 4 dedicated beginner bridge / capstone weeks (ideal for non-technical students)
    const extraBridge: Omit<StudyWeek, 'weekNumber' | 'estimatedHours'> = {
      phase: 'Phase 0 · Non-Technical On-Ramp',
      title: 'Quantitative Literacy & Business Framing for Non-Technical Entrants',
      focusSummary:
        'Demystify financial statements, percentages, logarithms, and basic spreadsheet logic before writing SQL or statistical code.',
      notebookModuleRef: 'Pre-Guide Foundation (Bridge to NotebookLM §1–2)',
      statsFocus:
        'Comfort with proportions, odds vs. probabilities, weighted averages, and reading histograms.',
      toolingFocus:
        'Excel / Google Sheets pivot tables + installing PostgreSQL/DB Fiddle & Python/RStudio gently.',
      milestones: [
        {
          id: 'm0-accounting',
          title: 'Trace Revenue -> EBITDA -> EBIT -> Net Cash Flow on a real annual report',
          category: 'Credit Fundamentals',
          detail: 'Understand why lenders care about EBITDA cash cushion over accounting Net Profit.',
        },
        {
          id: 'm0-odds',
          title: 'Convert probabilities (p = 4%) into odds (p/(1-p)) and log-odds',
          category: 'Stats & Econometrics',
          detail: 'Build mathematical comfort needed later for Logistic Regression and WoE.',
        },
      ],
    };

    const extraSqlDrill: Omit<StudyWeek, 'weekNumber' | 'estimatedHours'> = {
      phase: 'Phase 1 · Financial & Data Foundations',
      title: 'Applied SQL Portfolio Case Study (NBFC & Digital Lending Dataset)',
      focusSummary:
        'Reinforce joins, window functions, and delinquency bucketing (0 DPD, 30+ DPD, 90+ DPD) on a realistic loan tape.',
      notebookModuleRef: 'Applied Drill on NotebookLM §1.1–1.4',
      statsFocus:
        'Roll-rate matrices: tracking how loans transition from Current -> 30 DPD -> 90+ DPD.',
      toolingFocus:
        'Write 10 timed PostgreSQL queries mirroring Big Four & PB Fintech screening tests.',
      milestones: [
        {
          id: 'm2b-dpd',
          title: 'Bucket borrowers into Stage 1, Stage 2 (>30 DPD), and NPA (>90 DPD) via SQL CASE WHEN',
          category: 'SQL & Data',
          detail: 'Combine CTEs with SUM(loan_amount) to compute portfolio delinquency rates.',
        },
      ],
    };

    const extraRvsPyLab: Omit<StudyWeek, 'weekNumber' | 'estimatedHours'> = {
      phase: 'Phase 3 · Regulatory Provisioning & Econometrics',
      title: 'R vs. Python Applied Econometrics & Scorecard Mini-Project',
      focusSummary:
        'Execute one end-to-end analytical task in your primary tool while contrasting how the counterpart tool handles it.',
      notebookModuleRef: 'Applied Drill on NotebookLM §5.1–5.3',
      statsFocus:
        'OLS assumptions (heteroskedasticity, autocorrelation, multicollinearity VIF) vs. Logistic classification.',
      toolingFocus: toolingByTrack[config.track],
      milestones: [
        {
          id: 'm6b-project',
          title: 'Build & document a 5-feature Credit Scorecard or Macro PD Regression notebook',
          category: 'Tooling (R/Python)',
          detail: 'Include WoE table, IV check (<0.50), AUROC/Gini, KS curve, and PSI stability check.',
        },
      ],
    };

    const extraCapstone: Omit<StudyWeek, 'weekNumber' | 'estimatedHours'> = {
      phase: 'Phase 4 · Model Validation & Interview Mastery',
      title: 'Portfolio Capstone Defense & Targeted Employer Applications',
      focusSummary:
        'Tailor your resume bullets and project walkthrough for Banks, NBFCs, GCCs, or Big Four Risk Advisory.',
      notebookModuleRef: 'Full NotebookLM Synthesis & Career Positioning',
      statsFocus:
        'Explain model limitations, downturn correlation, and regulatory governance clearly under follow-up questioning.',
      toolingFocus:
        'Package SQL scripts, ratio templates, and Python/R markdown report into a clean GitHub/portfolio memo.',
      milestones: [
        {
          id: 'm8b-memo',
          title: 'Write a 1-page Credit Committee & Model Validation Executive Memo',
          category: 'Interview Drill',
          detail: 'Translate quantitative outputs (DSCR, EL jump, Gini, PSI) into a Go / No-Go lending decision.',
        },
      ],
    };

    const twelve = [
      extraBridge,
      baseModules[0],
      baseModules[1],
      extraSqlDrill,
      baseModules[2],
      baseModules[3],
      baseModules[4],
      baseModules[5],
      extraRvsPyLab,
      baseModules[6],
      baseModules[7],
      extraCapstone,
    ];

    return twelve.map((item, idx) => ({
      ...item,
      weekNumber: idx + 1,
      estimatedHours: config.weeklyHours,
    }));
  }

  // Default 8-week plan
  return baseModules.map((item, idx) => ({
    ...item,
    weekNumber: idx + 1,
    estimatedHours: config.weeklyHours,
  }));
}

export function generateStandaloneHtmlExport(
  plan: StudyWeek[],
  config: StudyPlanConfig,
  completedIds: Record<string, boolean>
): string {
  const totalMilestones = plan.reduce((acc, w) => acc + w.milestones.length, 0);
  const doneCount = plan.reduce(
    (acc, w) => acc + w.milestones.filter((m) => completedIds[m.id]).length,
    0
  );

  const weekRows = plan
    .map(
      (w) => `
    <section class="week-card">
      <div class="week-meta">Week ${w.weekNumber} · ${escapeHtml(w.phase)} · ${w.estimatedHours} hrs · ${escapeHtml(w.notebookModuleRef)}</div>
      <h3>${escapeHtml(w.title)}</h3>
      <p>${escapeHtml(w.focusSummary)}</p>
      <div class="grid-two">
        <div><strong>Statistics &amp; Econometrics:</strong> ${escapeHtml(w.statsFocus)}</div>
        <div><strong>SQL / R / Python Focus:</strong> ${escapeHtml(w.toolingFocus)}</div>
      </div>
      <ul>
        ${w.milestones
          .map(
            (m) => `<li><label><input type="checkbox" ${
              completedIds[m.id] ? 'checked' : ''
            } onchange="toggleCheck(this)" /> <strong>[${escapeHtml(m.category)}]</strong> ${escapeHtml(
              m.title
            )} — <span>${escapeHtml(m.detail)}</span></label></li>`
          )
          .join('')}
      </ul>
    </section>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Personalized Credit Risk Study Plan</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; background: #F7F8FA; color: #0F172A; max-width: 960px; margin: 0 auto; padding: 32px 20px; line-height: 1.6; }
  h1 { font-family: Georgia, serif; margin-bottom: 4px; }
  .subtitle { color: #475569; margin-bottom: 24px; font-size: 14px; }
  .summary { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .week-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
  .week-meta { font-size: 12px; color: #1E3A8A; font-weight: 600; margin-bottom: 6px; }
  .grid-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; background: #F8FAFC; padding: 12px; border-radius: 8px; font-size: 13px; margin: 12px 0; }
  ul { list-style: none; padding: 0; margin: 12px 0 0; }
  li { padding: 6px 0; border-top: 1px solid #F1F5F9; font-size: 14px; }
  li span { color: #475569; }
</style>
</head>
<body>
  <h1>Credit Risk &amp; Finance Personalized Study Plan</h1>
  <div class="subtitle">Track: ${escapeHtml(config.track)} · Background: ${escapeHtml(
    config.background
  )} · Duration: ${config.duration} Weeks (${config.weeklyHours} hrs/week)</div>
  <div class="summary">
    <div><strong>Milestone Completion:</strong> <span id="progress">${doneCount} / ${totalMilestones}</span></div>
    <div><strong>Core Frameworks:</strong> EL = PD × LGD × EAD · IFRS 9 3-Stage ECL · DSCR &amp; Working Capital · WoE / IV / KS / PSI · PostgreSQL</div>
  </div>
  ${weekRows}
  <script>
    function toggleCheck() {
      var boxes = document.querySelectorAll('input[type="checkbox"]');
      var checked = 0;
      boxes.forEach(function(b) { if (b.checked) checked++; });
      document.getElementById('progress').textContent = checked + ' / ' + boxes.length;
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function roundTo(val: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}
