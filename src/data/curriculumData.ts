import type { CareerTrack } from '../utils/riskMath';

export interface EmployerSector {
  id: string;
  sectorName: string;
  examples: string;
  interviewFocus: string;
  primaryFrameworks: string;
  entryRoles: string;
}

export interface CareerProgressionStep {
  level: string;
  years: string;
  titles: string;
  focus: string;
}

export interface CareerPathSpec {
  id: CareerTrack;
  roleTitle: string;
  hiringSectors: string;
  technicalBarrier: string;
  typicalTitles: string[];
  coreDailyWork: string;
  keyResponsibilities: string[];
  technicalSkills: string[];
  softSkills: string[];
  careerProgression: CareerProgressionStep[];
  nonTechEdge: string;
  keyNotebookModules: string;
  primaryToolStack: string;
  starterDeliverable: string;
}

export interface CreditConceptDeepDive {
  id: 'pd' | 'lgd' | 'ead';
  acronym: string;
  fullName: string;
  coreFormula: string;
  plainEnglish: string;
  keyDrivers: string[];
  earlyCareerContext: string;
  typicalBenchmarks: string;
}

export interface CreditCaseStudy {
  id: string;
  title: string;
  sector: string;
  roleLens: string;
  scenario: string;
  analyticalSteps: string[];
  outcomeTakeaway: string;
  simulatorPreset: {
    drawnBalance: number;
    undrawnLimit: number;
    ccfPct: number;
    pdPct: number;
    lgdPct: number;
  };
}

export interface RvsPythonTask {
  id: string;
  taskCategory: string;
  preferredTool: 'R' | 'Python' | 'Both (R for Diagnostics, Python for Prod)';
  whyWinner: string;
  rPackages: string;
  pythonPackages: string;
  mentorAdvice: string;
}

export interface StatsEconometricsPhase {
  phaseNumber: string;
  title: string;
  plainEnglishAnalogy: string;
  coreConcepts: string[];
  practicalApplications: string[];
  recommendedResources: string[];
  creditRiskLink: string;
  learningResourcesFocus: string;
}

export interface PracticeQuestion {
  id: string;
  number: number;
  domain: 'SQL' | 'Financial Ratios' | 'Credit Loss Math' | 'ECL Staging' | 'Risk Metrics';
  title: string;
  prompt: string;
  hint: string;
  expectedNumericAnswer?: number;
  expectedUnit?: string;
  solutionSteps: string[];
  codeAnswer?: string;
  takeaway: string;
}

export interface GlossaryItem {
  term: string;
  category: 'SQL & Data' | 'Financial Ratios' | 'Loss & Capital' | 'Regulatory' | 'Scorecards';
  definition: string;
}

export const EMPLOYER_SECTORS: EmployerSector[] = [
  {
    id: 'banks',
    sectorName: 'Top Commercial Banks',
    examples: 'Global & Tier-1 Domestic Retail/Corporate Banks',
    interviewFocus: 'Basel III capital (PD/LGD/EAD), Vasicek intuition, IFRS 9 staging, and clean SQL joins.',
    primaryFrameworks: 'Basel IRB, IFRS 9 Three-Stage ECL, DSCR & Cash Flow Underwriting',
    entryRoles: 'Credit Analyst, Junior Risk Modeler, Portfolio Risk Associate',
  },
  {
    id: 'nbfcs',
    sectorName: 'NBFCs & Digital Lenders',
    examples: 'Consumer Finance, MSME Lenders, PB Fintech / PolicyBazaar',
    interviewFocus: 'High-velocity SQL window functions (cumulative disbursements), delinquency roll rates, and scorecard Gini/KS.',
    primaryFrameworks: 'Ind AS 109 / RBI ECL, 30+ / 90+ DPD Vintage Tracking, WoE Scorecards',
    entryRoles: 'Credit Risk Analyst, Collections Strategy Analyst, Decision Science Associate',
  },
  {
    id: 'gccs',
    sectorName: 'Global Capability Centers (GCCs)',
    examples: 'Captive Risk Analytics & Model Validation Hubs of Global Banks',
    interviewFocus: 'Model validation rigor (PSI, KS > 30%, backtesting), R/Python statistical validation, and regulatory documentation.',
    primaryFrameworks: 'SR 11-7 Model Risk Management, CCAR/Stress Testing, Challenger Econometrics',
    entryRoles: 'Model Validation Analyst, Quantitative Risk Analyst, Stress Testing Associate',
  },
  {
    id: 'big4',
    sectorName: 'Big Four Risk Advisory',
    examples: 'Ernst & Young (EY), PwC, Deloitte, KPMG Financial Risk Practices',
    interviewFocus: 'Multi-condition SQL data audits (Anti-Joins, NULL traps), OLAP vs. OLTP schema design, and ECL advisory.',
    primaryFrameworks: 'IFRS 9 / ECL Implementation, Credit Portfolio Audit, Data Warehouse Governance',
    entryRoles: 'Risk Advisory Consultant, Data & Credit Analytics Associate',
  },
];

export const CAREER_PATHS: CareerPathSpec[] = [
  {
    id: 'credit-analyst',
    roleTitle: 'Corporate & Retail Credit Analyst',
    hiringSectors: 'Commercial Banks · NBFCs · Rating Agencies',
    technicalBarrier: 'Low-to-Moderate (Most Accessible for Non-Technical Entrants)',
    typicalTitles: [
      'Junior Credit Analyst',
      'Credit Underwriting Associate',
      'Commercial Lending Analyst',
      'Portfolio Monitoring Analyst',
    ],
    coreDailyWork:
      'Evaluate borrower financial statements, calculate DSCR and Working Capital cycles, flag receivables divergence, and recommend credit limits.',
    keyResponsibilities: [
      'Spread balance sheets, income statements, and cash flows to assess debt repayment capacity (DSCR > 1.25x, ICR > 3.0x).',
      'Draft structured Credit Approval Memos (CAMs) summarizing borrower strengths, collateral coverage, and covenant triggers.',
      'Monitor portfolio early-warning signals such as rising Days Sales Outstanding (DSO) or >30 DPD delinquency spikes.',
      'Query loan tapes in SQL to segment borrowers by industry concentration, collateral type, and utilization.',
    ],
    technicalSkills: [
      'Financial Statement Analysis & Cash-Flow Ratios (EBITDA, DSCR, Working Capital)',
      'Core SQL (SELECT, WHERE vs. HAVING, LEFT JOIN, GROUP BY)',
      'Excel Financial Modeling & Sensitivity Tables',
      'Collateral Valuation & Covenant Structuring',
    ],
    softSkills: [
      'Skeptical Inquiry (questioning optimistic management projections)',
      'Clear Executive Memo Writing (turning numbers into a Go / No-Go recommendation)',
      'Stakeholder Negotiation (pushing back constructively on relationship managers)',
      'Commercial Judgment under Incomplete Information',
    ],
    careerProgression: [
      {
        level: 'Entry',
        years: '0–2 yrs',
        titles: 'Junior Credit Analyst / Underwriting Associate',
        focus: 'Spreading financials, ratio checks, and drafting standard credit memos.',
      },
      {
        level: 'Mid-Level',
        years: '2–5 yrs',
        titles: 'Credit Manager / Assistant Vice President (AVP)',
        focus: 'Owning sector credit approvals, setting policy cutoffs, and structuring complex deals.',
      },
      {
        level: 'Senior',
        years: '5–9 yrs',
        titles: 'VP Credit Risk / Senior Portfolio Lead',
        focus: 'Chairing credit committee reviews, managing portfolio loss limits and industry caps.',
      },
      {
        level: 'Leadership',
        years: '10+ yrs',
        titles: 'Head of Credit / Chief Credit Officer (CCO)',
        focus: 'Setting institution-wide risk appetite and capital allocation strategy.',
      },
    ],
    nonTechEdge:
      'Because underwriting rewards business common sense, reading industry trends, and clear written persuasion, humanities, commerce, and economics graduates ramp up rapidly without deep coding.',
    keyNotebookModules: '§2 Financial Ratios (DSCR, ICR, DIO/DSO/DPO) + §1.1–1.2 Core SQL Filtering',
    primaryToolStack: 'Excel + SQL (PostgreSQL) + Basic Python/BI',
    starterDeliverable: '1-page Credit Underwriting Memo calculating DSCR (2.25x) and working capital red flags.',
  },
  {
    id: 'risk-modeling',
    roleTitle: 'Credit Risk Analytics & Scorecard Modeler',
    hiringSectors: 'Digital Lenders · NBFCs · Consumer Banks',
    technicalBarrier: 'Moderate-to-High (Applied Statistics, SQL & Python)',
    typicalTitles: [
      'Credit Risk Analyst',
      'Decision Science Associate',
      'Junior Risk Modeler',
      'Acquisition & Strategy Analyst',
    ],
    coreDailyWork:
      'Bin borrower features with Weight of Evidence (WoE), check Information Value (IV), fit Logistic Regression / tree scorecards, and calibrate approval cutoffs.',
    keyResponsibilities: [
      'Extract longitudinal borrower and repayment cohorts from relational warehouses using SQL CTEs and Window Functions.',
      'Engineer predictive credit bureau and cash-flow features, transforming bins via Weight of Evidence (WoE).',
      'Train interpretable Logistic Regression PD/LGD/EAD scorecards and verify discrimination (AUROC, Gini, KS > 30%).',
      'Partner with product and collections teams to adjust score cutoffs and optimize approval rate vs. expected loss.',
    ],
    technicalSkills: [
      'Advanced SQL (CTEs, DENSE_RANK(), Cumulative Windows, Anti-Joins)',
      'Python Modeling Stack (pandas, statsmodels, optbinning, scikit-learn)',
      'Logistic Regression, WoE/IV Binning & Scorecard Scaling',
      'Discrimination Metrics (AUROC, Gini, KS Statistic) & Vintage Analysis',
    ],
    softSkills: [
      'Translating Model Math into Business Policy ("What does Gini 0.56 mean for approvals?")',
      'Cross-Functional Collaboration with Engineering, Product, and Compliance',
      'Structured Experimentation & Hypothesis Framing',
      'Attention to Data Leakage & Ethical Lending Fairness',
    ],
    careerProgression: [
      {
        level: 'Entry',
        years: '0–2 yrs',
        titles: 'Credit Risk Analyst / Decision Science Associate',
        focus: 'SQL cohort extraction, vintage reporting, and assisting scorecard builds.',
      },
      {
        level: 'Mid-Level',
        years: '2–5 yrs',
        titles: 'Senior Risk Modeler / Risk Strategy Manager',
        focus: 'Owning end-to-end PD/LGD scorecards and pricing/limit optimization.',
      },
      {
        level: 'Senior',
        years: '5–9 yrs',
        titles: 'Lead Data Scientist — Credit / VP Risk Analytics',
        focus: 'Architecting multi-product underwriting engines and automated loss forecasting.',
      },
      {
        level: 'Leadership',
        years: '10+ yrs',
        titles: 'Head of Credit Decisioning / Chief Risk Officer',
        focus: 'Aligning portfolio growth, loss appetite, and regulatory governance.',
      },
    ],
    nonTechEdge:
      'Non-technical analysts who learn SQL + foundational statistics often outperform pure CS graduates in interviews because they spot target leakage (IV > 0.50) and understand real borrower behavior.',
    keyNotebookModules: '§1.3–1.4 Window Functions & CTEs + §5.1–5.2 WoE, IV, AUROC, Gini & KS',
    primaryToolStack: 'SQL + Python (pandas, statsmodels, optbinning, scikit-learn)',
    starterDeliverable: 'End-to-end Retail Scorecard notebook with WoE bins, IV audit (<0.50), and KS > 30%.',
  },
  {
    id: 'model-validation',
    roleTitle: 'Model Risk Management (MRM) & Validation',
    hiringSectors: 'Global Capability Centers (GCCs) · Big Four · Tier-1 Banks',
    technicalBarrier: 'Moderate-to-High (Econometrics, Audit Skepticism & R/Python)',
    typicalTitles: [
      'Model Validation Analyst',
      'Model Risk Management (MRM) Associate',
      'Quantitative Risk Audit Analyst',
      'Risk Advisory Consultant',
    ],
    coreDailyWork:
      'Independently challenge credit models: test conceptual soundness, discrimination (Gini/KS), calibration, population drift (PSI), and documentation compliance.',
    keyResponsibilities: [
      'Perform independent replication of PD, LGD, EAD, and stress-testing models using challenger scripts in R or Python.',
      'Monitor post-deployment stability via Population Stability Index (PSI < 0.10) and backtest predicted vs. actual default rates.',
      'Audit model development pipelines for data leakage, multicollinearity (VIF), and undocumented overrides.',
      'Write formal Validation Findings Reports graded by severity for Model Risk Committees and regulators (SR 11-7 / RBI).',
    ],
    technicalSkills: [
      'Statistical & Econometric Testing (KS, PSI, Binomial/Hosmer-Lemeshow Calibration)',
      'Dual-Tool Fluency (Python replication + R econometric challenger tests)',
      'SQL Data Audit Queries (Anti-Joins, NULL integrity checks)',
      'Regulatory Governance Standards (SR 11-7, Basel IRB, IFRS 9)',
    ],
    softSkills: [
      'Independent Skepticism & Diplomatic Challenge (delivering critical findings without friction)',
      'Audit-Grade Technical Documentation & Clarity',
      'Regulatory Mindset (thinking like an internal examiner)',
      'Synthesizing Complex Statistical Failures for Non-Quant Executives',
    ],
    careerProgression: [
      {
        level: 'Entry',
        years: '0–2 yrs',
        titles: 'Model Validation Analyst / Risk Advisory Associate',
        focus: 'Running ongoing monitoring (PSI/KS), data quality audits, and documentation checks.',
      },
      {
        level: 'Mid-Level',
        years: '2–5 yrs',
        titles: 'Senior Validation Officer / MRM Manager',
        focus: 'Leading full independent validations of IRB, IFRS 9, and ML scorecards.',
      },
      {
        level: 'Senior',
        years: '5–9 yrs',
        titles: 'VP Model Risk Governance / Director',
        focus: 'Managing bank-wide model inventory, regulatory exam defense, and challenger standards.',
      },
      {
        level: 'Leadership',
        years: '10+ yrs',
        titles: 'Head of Model Risk Management',
        focus: 'Executive oversight of model risk appetite across Credit, Market, and AI systems.',
      },
    ],
    nonTechEdge:
      'Validation is 50% statistics and 50% structured investigation and writing. Detail-oriented graduates from economics, audit, or social sciences thrive when trained in statistical governance.',
    keyNotebookModules: '§5.2–5.3 Confusion Matrix, KS, PSI (<0.10 / 0.25) + §3.3 Vasicek Capital',
    primaryToolStack: 'Python + R (econometric challenger tests, scorecard, sandwich/plm) + SQL',
    starterDeliverable: 'Model Validation Report auditing PSI drift, confusion matrix trade-offs, and IV leakage.',
  },
  {
    id: 'regulatory-ecl',
    roleTitle: 'IFRS 9 / RBI ECL & Stress Testing Analyst',
    hiringSectors: 'Banks · Big Four Advisory · GCC Treasury/Risk',
    technicalBarrier: 'Moderate (Macro Econometrics, Accounting Logic & SQL)',
    typicalTitles: [
      'IFRS 9 / ECL Analyst',
      'Regulatory Capital & Stress Testing Associate',
      'Basel III / RWA Reporting Analyst',
      'Credit Provisioning Strategist',
    ],
    coreDailyWork:
      'Build 3-Stage ECL migration pipelines (Stage 1 12M -> Stage 2 Lifetime SICR), run downturn joint-correlation stress tests, and compute Risk-Weighted Assets (RWAs).',
    keyResponsibilities: [
      'Classify credit portfolios across Stage 1 (12-Month ECL), Stage 2 (SICR > 30 DPD Lifetime ECL), and Stage 3 (>90 DPD NPA).',
      'Link macroeconomic forecasts (GDP growth, policy interest rates, unemployment) to forward-looking PD and LGD curves.',
      'Quantify the "provision cliff" impact and explain quarter-over-quarter reserve movements to Finance & Risk leadership.',
      'Calculate Basel III Risk-Weighted Assets (RWAs) and CET1 capital buffers using Vasicek asymptotic single-factor formulas.',
    ],
    technicalSkills: [
      'IFRS 9 / Ind AS 109 / RBI Three-Stage ECL & SICR Staging Logic',
      'Time-Series & Macro Econometrics (OLS, ARIMA/VAR, Newey-West SEs in R/statsmodels)',
      'SQL Staging & Roll-Rate Pipelines (CASE WHEN delinquency bucketing)',
      'Basel III Capital & Vasicek WCDR / Unexpected Loss Math',
    ],
    softSkills: [
      'Bridging Finance, Accounting, and Risk Teams (translating provisions into P&L impact)',
      'Scenario Storytelling ("How does a 150 bps rate hike change our Stage 2 reserves?")',
      'Precision & Reconciliation Discipline under Quarter-End Deadlines',
      'Regulatory Interpretation & Policy Judgment',
    ],
    careerProgression: [
      {
        level: 'Entry',
        years: '0–2 yrs',
        titles: 'ECL / Regulatory Capital Analyst',
        focus: 'Running monthly staging migrations, RWA reconciliations, and sensitivity tables.',
      },
      {
        level: 'Mid-Level',
        years: '2–5 yrs',
        titles: 'Senior Stress Testing / IFRS 9 Lead',
        focus: 'Owning macro satellite models, SICR rule calibration, and ICAAP stress scenarios.',
      },
      {
        level: 'Senior',
        years: '5–9 yrs',
        titles: 'VP Capital & Provisioning Strategy',
        focus: 'Advising CFO/CRO on capital efficiency, downturn overlays, and regulatory submissions.',
      },
      {
        level: 'Leadership',
        years: '10+ yrs',
        titles: 'Managing Director — Enterprise Risk & Capital',
        focus: 'Steering balance-sheet resilience, board stress testing, and investor disclosures.',
      },
    ],
    nonTechEdge:
      'Accounting, finance, and economics majors already understand P&L provisions, balance sheets, and macro cycles—making ECL & stress testing one of the smoothest bridges into quantitative risk.',
    keyNotebookModules: '§3.2–3.3 EL Stressing & Vasicek + §4.1–4.3 Three-Stage ECL & Basel III',
    primaryToolStack: 'SQL (staging tables) + R (macro time-series econometrics) + Python',
    starterDeliverable: 'ECL Provision Cliff simulation showing 8.0x reserve jump & 2.81x downturn EL stress.',
  },
];

export const CREDIT_CONCEPT_DEEP_DIVES: CreditConceptDeepDive[] = [
  {
    id: 'pd',
    acronym: 'PD',
    fullName: 'Probability of Default',
    coreFormula: '12-Month PD (Stage 1 / Basel) vs. Lifetime PD (Stage 2)',
    plainEnglish:
      'The statistical likelihood (0% to 100%) that a borrower will fail to meet debt obligations—typically defined as hitting 90+ Days Past Due (DPD) or bankruptcy—over a chosen time horizon.',
    keyDrivers: [
      'Borrower cash-flow cushion (DSCR < 1.0x or thin Interest Coverage < 1.5x)',
      'Early delinquency history (30+ DPD triggers SICR migration into Stage 2)',
      'Credit bureau utilization, inquiry velocity, and macroeconomic stress (GDP contraction, rate hikes)',
    ],
    earlyCareerContext:
      'Junior analysts estimate PD using Logistic Regression scorecards (for retail/NBFC loans) or internal rating grades mapped to historical corporate default tables.',
    typicalBenchmarks: 'Prime Corporate: 0.2%–1.5% · SME/Mid-Market: 1.5%–4.5% · Subprime Consumer: 5%–15%+',
  },
  {
    id: 'lgd',
    acronym: 'LGD',
    fullName: 'Loss Given Default',
    coreFormula: 'LGD = 1 − Recovery Rate (net of workout costs & discounting)',
    plainEnglish:
      'If a borrower defaults, the bank rarely loses 100% of the loan. LGD is the net percentage of the defaulted balance that remains permanently unrecovered after selling collateral, paying legal collection fees, and discounting delayed cash recoveries.',
    keyDrivers: [
      'Collateral quality & Loan-to-Value (real estate vs. specialized machinery vs. unsecured)',
      'Seniority in the capital structure (First-lien secured vs. subordinated unsecured debt)',
      'Recessionary collateral haircuts (in downturns, asset liquidation prices drop while defaults rise)',
    ],
    earlyCareerContext:
      'Underwriting associates scrutinize collateral appraisals and recovery timelines; risk modelers calibrate downturn LGD (+10 percentage points or more during stress).',
    typicalBenchmarks: 'Senior Secured / Mortgage: 15%–40% · Corporate Unsecured: 45%–60% · Credit Cards: 70%–85%',
  },
  {
    id: 'ead',
    acronym: 'EAD',
    fullName: 'Exposure at Default',
    coreFormula: 'EAD = Drawn Balance + (CCF × Undrawn Credit Limit)',
    plainEnglish:
      'The total dollar amount the borrower owes the lender at the exact moment of default. For a fixed term loan, EAD is simply the remaining principal. For a revolving line (credit card or corporate overdraft), distressed borrowers draw down unused credit right before defaulting—captured by the Credit Conversion Factor (CCF).',
    keyDrivers: [
      'Current utilization ratio (Drawn Balance / Total Approved Limit)',
      'Credit Conversion Factor (CCF ∈ [0, 1]) reflecting pre-default drawdown behavior',
      'Facility covenants (whether the bank can freeze undrawn limits early upon covenant breach)',
    ],
    earlyCareerContext:
      'A classic technical interview trap: forgetting to multiply the undrawn portion by CCF understates credit card or revolver Expected Loss significantly.',
    typicalBenchmarks: 'Term Loans: CCF = 0% (EAD = Balance) · Corporate Revolvers: CCF 40%–75% · Retail Cards: CCF 40%–80%',
  },
];

export const REAL_WORLD_CASE_STUDIES: CreditCaseStudy[] = [
  {
    id: 'case-revolver-card',
    title: 'Case 1: Retail Credit Card Utilization Spike (NBFC / Digital Lender)',
    sector: 'Consumer Finance · NBFC Risk',
    roleLens: 'Credit Risk Analyst / Decision Science',
    scenario:
      'A consumer holds a $50,000 credit card limit with $15,000 currently drawn ($35,000 undrawn). Historical roll-rate data shows borrowers in this segment draw 40% of remaining undrawn credit prior to default (CCF = 40%), carry a 1-year PD of 4.0%, and yield only 25% net recoveries (LGD = 75%).',
    analyticalSteps: [
      'Undrawn Limit = $50,000 − $15,000 = $35,000.',
      'EAD = $15,000 + (0.40 × $35,000) = $15,000 + $14,000 = $29,000.',
      'Expected Loss (EL) = 4.0% × 75% × $29,000 = $870 per account (or 5.8% of current drawn balance!).',
    ],
    outcomeTakeaway:
      'An analyst who prices interest rates using only the $15,000 drawn balance underprices expected credit loss by nearly half ($450 vs. $870). Active limit management cuts CCF exposure before default.',
    simulatorPreset: {
      drawnBalance: 15000,
      undrawnLimit: 35000,
      ccfPct: 40,
      pdPct: 4.0,
      lgdPct: 75,
    },
  },
  {
    id: 'case-midmarket-revolver',
    title: 'Case 2: Mid-Market Working Capital Facility Under Margin Pressure',
    sector: 'Commercial Banking · Corporate Underwriting',
    roleLens: 'Junior Corporate Credit Analyst',
    scenario:
      'A mid-sized distributor has drawn $20,000 on a $40,000 working-capital facility ($20,000 undrawn) secured by inventory and receivables. Rising DSO slows cash collection, nudging 1-year PD to 2.5%, while collateral liquidation friction puts LGD at 45% and historical corporate revolver CCF is 50%.',
    analyticalSteps: [
      'EAD = $20,000 + (0.50 × $20,000) = $30,000 total exposure at default.',
      'Base EL = 2.5% × 45% × $30,000 = $337.50 (1.125% loss rate on EAD).',
      'If a downturn doubles PD to 5.0% and adds +10pp to LGD (55%), EL surges to $825+ as working capital drawdowns accelerate.',
    ],
    outcomeTakeaway:
      'Early-career underwriters pair ratio monitoring (DSO spikes, DSCR compression) with borrowing-base covenants to cap undrawn drawdowns before stress hits.',
    simulatorPreset: {
      drawnBalance: 20000,
      undrawnLimit: 20000,
      ccfPct: 50,
      pdPct: 2.5,
      lgdPct: 45,
    },
  },
  {
    id: 'case-ecl-cliff',
    title: 'Case 3: IFRS 9 Stage 2 Provision Cliff on a Term Loan',
    sector: 'Tier-1 Bank · Regulatory ECL & Accounting',
    roleLens: 'IFRS 9 / ECL Analyst',
    scenario:
      'Consider a $40,000 scaled commercial exposure (representing a $10M loan scaled for the lab) with zero undrawn limit (CCF = 0%) and 40% LGD. In Stage 1 (12-Month PD = 1.5%), expected provision is modest. After supply chain delays push the borrower past 30 DPD, SICR triggers Stage 2 (Lifetime PD = 12.0%).',
    analyticalSteps: [
      'Stage 1 (12-Month ECL): 1.5% × 40% × $40,000 = $240 ($60,000 on a $10M loan).',
      'Stage 2 (Lifetime ECL): 12.0% × 40% × $40,000 = $1,920 ($480,000 on a $10M loan).',
      'Reserve Multiple: 8.0x immediate jump in accounting loss provisions hitting quarterly P&L.',
    ],
    outcomeTakeaway:
      'Explaining why a small 30-DPD delinquency triggers an 8.0x accounting provision cliff is one of the highest-value skills for entry-level bank risk analysts.',
    simulatorPreset: {
      drawnBalance: 40000,
      undrawnLimit: 0,
      ccfPct: 0,
      pdPct: 12.0,
      lgdPct: 40,
    },
  },
];

export const R_VS_PYTHON_TASKS: RvsPythonTask[] = [
  {
    id: 'quant-econometrics',
    taskCategory: 'Quantitative Analysis & Macro Econometrics',
    preferredTool: 'R',
    whyWinner:
      'R was built by statisticians for statistical inference. Panel regressions, Newey-West robust standard errors, ARIMA/VAR macro linking for IFRS 9 ECL, and hypothesis diagnostic tables require fewer lines and expose fuller statistical rigor out of the box.',
    rPackages: 'plm, forecast, vars, lmtest, sandwich, tidyverse, data.table',
    pythonPackages: 'statsmodels, linearmodels, arch, scipy.stats',
    mentorAdvice:
      'Prefer R when your job centers on regulatory econometrics, IFRS 9 macro-overlay justification, or academic-grade statistical reporting in GCCs and Central/Commercial Banks.',
  },
  {
    id: 'scorecard-modeling',
    taskCategory: 'Production Credit Scorecards & ML Modeling',
    preferredTool: 'Python',
    whyWinner:
      'Python dominates end-to-end modeling pipelines in NBFCs, fintechs, and banks: it connects seamlessly from SQL data warehouses to feature engineering, optbinning WoE, Logistic Regression, XGBoost/LightGBM, and live REST API scoring.',
    rPackages: 'scorecard, glmnet, tidymodels, xgboost',
    pythonPackages: 'scikit-learn, optbinning, statsmodels, xgboost, lightgbm, pandas',
    mentorAdvice:
      'Prefer Python when building production PD/LGD/EAD models, automated underwriting engines, or interviewing at digital lenders and consulting data teams.',
  },
  {
    id: 'validation-challenger',
    taskCategory: 'Independent Model Validation & PSI Monitoring',
    preferredTool: 'Both (R for Diagnostics, Python for Prod)',
    whyWinner:
      'Validation teams in GCCs and Big Four frequently replicate a Python production model in R (or vice versa) to eliminate single-tool bias, run independent KS/PSI diagnostics, and verify confidence intervals.',
    rPackages: 'scorecard, pROC, InformationValue, knitr',
    pythonPackages: 'scikit-learn, scipy.stats.ks_2samp, evidently, numpy',
    mentorAdvice:
      'Learn Python deeply as your primary workhorse, plus enough R to read CRAN econometric outputs and run challenger Logistic/OLS checks.',
  },
  {
    id: 'non-tech-entry',
    taskCategory: 'Non-Technical Student First 60 Days',
    preferredTool: 'Python',
    whyWinner:
      'For someone without a coding background, SQL comes FIRST (70% of entry-level screening!). After SQL, Python’s readable syntax transfers directly across BI, analytics, and modeling roles—giving you maximum job surface area per hour invested.',
    rPackages: 'Optional in Month 3 for Basel/IFRS 9 econometric roles',
    pythonPackages: 'pandas + numpy + statsmodels (just 3 libraries cover 85% of fresher tasks)',
    mentorAdvice:
      'Sequence strictly: 1) Credit Domain & Ratios -> 2) SQL Queries -> 3) Python (pandas + statsmodels) -> 4) Add R only if targeting Macro ECL or GCC Validation.',
  },
];

export const CODE_COMPARISONS = {
  scorecard: {
    label: 'Logistic Scorecard & WoE',
    python: `# Python: Production Scorecard Pipeline (optbinning + scikit-learn)
import pandas as pd
from optbinning import BinningProcess
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

features = ["dscr", "dpd_30_count", "utilization_pct"]
binning = BinningProcess(variable_names=features)
X_woe = binning.fit_transform(df[features], df["default_flag"])

model = LogisticRegression(C=1.0)
model.fit(X_woe, df["default_flag"])

pd_pred = model.predict_proba(X_woe)[:, 1]
auroc = roc_auc_score(df["default_flag"], pd_pred)
gini = 2 * auroc - 1  # NotebookLM Benchmark: Gini = 2*AUROC - 1`,
    r: `# R: Rapid Statistical Scorecard & IV Audit (scorecard package)
library(scorecard)
library(pROC)

# 1. Automated WoE binning + Information Value (IV) table
bins <- woebin(df, y = "default_flag", x = c("dscr", "dpd_30_count", "utilization_pct"))
iv_summary <- iv(df, y = "default_flag") # Flag IV > 0.50 for leakage

df_woe <- woebin_ply(df, bins)
logit_model <- glm(default_flag ~ ., data = df_woe, family = binomial())
summary(logit_model) # Rich z-values, AIC & deviance diagnostics

pred_pd <- predict(logit_model, type = "response")
gini <- 2 * as.numeric(auc(df$default_flag, pred_pd)) - 1`,
  },
  econometrics: {
    label: 'IFRS 9 Macro Econometrics',
    python: `# Python: Macro PD Regression with Robust SE (statsmodels)
import statsmodels.api as sm

# Regress logit-transformed quarterly default rate on GDP & Policy Rate
X = sm.add_constant(macro_df[["gdp_growth_lag1", "policy_rate_chg"]])
ols = sm.OLS(macro_df["logit_pd"], X).fit(cov_type="HAC", cov_kwds={"maxlags": 2})

print(ols.summary())
# Feed Base / Upturn / Downturn macro scenarios into Stage 1 & 2 ECL`,
    r: `# R: Econometric Time-Series & Newey-West Inference (lmtest + sandwich)
library(lmtest)
library(sandwich)

# Concise formula syntax + institutional HAC standard errors
macro_fit <- lm(logit_pd ~ gdp_growth_lag1 + policy_rate_chg, data = macro_df)
coeftest(macro_fit, vcov = NeweyWest(macro_fit, lag = 2))

# Check residual autocorrelation (Durbin-Watson) for IFRS 9 audit defense
dwtest(macro_fit)`,
  },
};

export const STATS_ECONOMETRICS_PHASES: StatsEconometricsPhase[] = [
  {
    phaseNumber: 'Stage 01',
    title: 'Descriptive Intuition & Financial Distributions',
    plainEnglishAnalogy:
      'Think of a loan portfolio like height or income in a city: one billionaire skews the "average" income, so banks look at medians, percentiles, and dispersion.',
    coreConcepts: [
      'Mean vs. Median & Skewness (why loan losses have long right tails)',
      'Variance, Standard Deviation & Percentiles (95th / 99.9th loss quantiles)',
      'Cross-tabulations & Roll-Rate Percentages (% moving from 30 DPD to 90 DPD)',
    ],
    practicalApplications: [
      'Summarize portfolio loan exposure by sector and bucket borrowers into 0, 30+, and 90+ DPD vintages.',
      'Spot outlier corporate exposures that distort average DSCR or average ticket size.',
    ],
    recommendedResources: [
      'Khan Academy: Summarizing Quantitative Data & Distributions (Free)',
      'StatQuest with Josh Starmer: Histograms, Mean vs. Median & Standard Deviation (YouTube)',
      'Spreadsheet Drill: Build a 12-month DPD roll-rate matrix in Excel or Google Sheets',
    ],
    creditRiskLink: 'Distinguishing average Expected Loss (EL) from extreme tail Unexpected Loss (UL).',
    learningResourcesFocus: 'Visual spreadsheets + Khan Academy Descriptive Stats (Zero calculus needed).',
  },
  {
    phaseNumber: 'Stage 02',
    title: 'Probability, Odds & Hypothesis Testing',
    plainEnglishAnalogy:
      'Probability asks "out of 100 borrowers, how many default?" Hypothesis testing asks "is this jump in defaults real noise or an actual population shift?"',
    coreConcepts: [
      'Conditional Probability P(Default | DPD > 30) & Joint Correlation during downturns',
      'Normal Distribution Φ(z) & Inverse Quantiles Φ⁻¹(0.999) for tail risk',
      'Odds = p / (1 - p), Log-Odds, and Two-Sample Separation (KS Statistic & p-values)',
    ],
    practicalApplications: [
      'Compute Weight of Evidence (WoE) and Information Value (IV) across borrower age and utilization bins.',
      'Run Kolmogorov-Smirnov (KS > 30%) and PSI drift checks to verify whether a scorecard still works.',
    ],
    recommendedResources: [
      'StatQuest: Probability, Odds, Log-Odds & p-values Explained Clearly',
      'Think Stats (Allen Downey) — Chapters 1–4 for intuitive probability without heavy proofs',
      'Credit Risk Analytics (Baesens, Rösch & Scheule) — Chapter 3 on WoE & Scorecard Metrics',
    ],
    creditRiskLink:
      'Powers Weight of Evidence (WoE), Basel Vasicek WCDR formula, KS > 30% validation, and PSI drift alerts.',
    learningResourcesFocus: 'Practice converting percentages to odds and reading p-values conceptually.',
  },
  {
    phaseNumber: 'Stage 03',
    title: 'Linear & Logistic Regression (Scorecard Engine)',
    plainEnglishAnalogy:
      'Regression draws the clearest weighted scorecard rule: "Every +0.5x drop in DSCR adds X points of risk, holding loan size constant."',
    coreConcepts: [
      'OLS Linear Regression Intuition & Coefficient Interpretation ("holding others constant")',
      'Multicollinearity (VIF): why putting both Income and Tax Paid breaks scorecard weights',
      'Binary Logistic Regression ln(p/(1-p)) = β₀ + β₁X₁ for 0/1 Default Prediction',
    ],
    practicalApplications: [
      'Fit a 4-to-6 variable retail credit scorecard predicting 12-month default probability (PD).',
      'Evaluate cutoff thresholds using Confusion Matrix Precision vs. Recall and AUROC / Gini (2×AUROC − 1).',
    ],
    recommendedResources: [
      'An Introduction to Statistical Learning (ISLR, James et al.) — Chapters 3 & 4 (Free PDF, R & Python)',
      'StatQuest: Logistic Regression & ROC/AUC Step-by-Step',
      'Python optbinning / R scorecard documentation walkthroughs on sample German Credit data',
    ],
    creditRiskLink:
      'Direct engine behind Retail Credit Scorecards (NotebookLM §5.1) and Confusion Matrix cutoff tuning.',
    learningResourcesFocus: 'Interpret regression output tables (β signs, p-values, AUROC) before coding.',
  },
  {
    phaseNumber: 'Stage 04',
    title: 'Econometrics: Time-Series & Causal Diagnostics',
    plainEnglishAnalogy:
      'Pure Machine Learning asks "what correlates today?" Econometrics asks "when GDP drops 2% next year, how do defaults respond over 4 quarters without spurious coincidence?"',
    coreConcepts: [
      'Stationarity & Lagged Macro Effects (GDP shock today -> defaults peak 2–3 quarters later)',
      'Autocorrelation & Heteroskedasticity (why standard errors shrink falsely without HAC/Newey-West)',
      'Panel Data & Survival / Vintage Curves for Lifetime ECL across Stage 1 -> Stage 2',
    ],
    practicalApplications: [
      'Build IFRS 9 / RBI ECL satellite models linking GDP, inflation, and policy rates to quarterly default rates.',
      'Produce Base, Upturn, and Downturn probability-weighted Lifetime ECL projections for bank reserves.',
    ],
    recommendedResources: [
      'Introductory Econometrics (Jeffrey Wooldridge) — Conceptual focus on OLS, Time-Series & HAC SEs',
      'Ben Lambert Econometrics Playlist (YouTube) — Intuitive visual explanations for non-math majors',
      'Basel Committee / IFRS 9 ECL Implementation Guidance & R sandwich/lmtest vignettes',
    ],
    creditRiskLink:
      'Required by IFRS 9, Ind AS 109, and RBI ECL directions for forward-looking macroeconomic provisioning.',
    learningResourcesFocus: 'Read econometrics conceptually (Gujarati / Wooldridge intuition) and run small R/statsmodels labs.',
  },
];

export const SQL_EXECUTION_ORDER = [
  {
    step: 1,
    clause: 'FROM / JOIN',
    purpose: 'Identifies base tables (e.g., borrowers, loans), combines rows, and evaluates join keys.',
  },
  {
    step: 2,
    clause: 'WHERE',
    purpose: 'Filters raw individual rows BEFORE grouping (e.g., loans originated in 2024 or active = TRUE).',
  },
  {
    step: 3,
    clause: 'GROUP BY',
    purpose: 'Collapses individual rows into summary buckets by shared keys (e.g., sector, customer_id).',
  },
  {
    step: 4,
    clause: 'HAVING',
    purpose: 'Filters aggregated buckets AFTER grouping (e.g., SUM(loan_amount) > 50000).',
  },
  {
    step: 5,
    clause: 'SELECT',
    purpose: 'Evaluates expressions, aggregates, and Window Functions (DENSE_RANK, SUM() OVER).',
  },
  {
    step: 6,
    clause: 'ORDER BY',
    purpose: 'Sorts the final projected result set (can reference SELECT aliases).',
  },
  {
    step: 7,
    clause: 'LIMIT / OFFSET',
    purpose: 'Restricts the exact number of rows returned to the client.',
  },
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q1-sql',
    number: 1,
    domain: 'SQL',
    title: 'Identifying Top 2 Sector Borrowers',
    prompt:
      'Write a PostgreSQL query to rank borrowers by total loan balance within each industry sector and extract the top 2 borrowers per sector (handling ties without skipping rank 2).',
    hint: 'Join borrowers and loans, aggregate SUM(loan_amount) in a CTE, and apply DENSE_RANK() OVER (PARTITION BY sector ORDER BY SUM(loan_amount) DESC).',
    solutionSteps: [
      'Use an INNER JOIN between borrowers (b) and loans (l) on borrower_id.',
      'Group by b.sector and b.borrower_name to compute SUM(l.loan_amount) AS total_balance.',
      'Wrap the ranking with DENSE_RANK() OVER (PARTITION BY b.sector ORDER BY SUM(l.loan_amount) DESC) AS rnk inside a CTE so tied top borrowers do not skip rank 2.',
      'Filter the CTE in the outer SELECT with WHERE rnk <= 2 and ORDER BY sector, rnk.',
    ],
    codeAnswer: `WITH RankedBorrowers AS (
    SELECT 
        b.sector,
        b.borrower_name,
        SUM(l.loan_amount) AS total_balance,
        DENSE_RANK() OVER (
            PARTITION BY b.sector 
            ORDER BY SUM(l.loan_amount) DESC
        ) AS rnk
    FROM borrowers AS b
    INNER JOIN loans AS l 
        ON b.borrower_id = l.borrower_id
    GROUP BY b.sector, b.borrower_name
)
SELECT sector, borrower_name, total_balance
FROM RankedBorrowers
WHERE rnk <= 2
ORDER BY sector, rnk;`,
    takeaway:
      'Interviewers at EY and PB Fintech check whether you know why DENSE_RANK() differs from RANK() (no gaps on ties) and why window functions cannot be filtered directly inside WHERE without a CTE.',
  },
  {
    id: 'q2-dscr',
    number: 2,
    domain: 'Financial Ratios',
    title: 'DSCR Calculation & Repayment Capacity Case',
    prompt:
      'A commercial borrower reports an EBITDA of $4,500,000, annual interest expense of $800,000, and principal debt repayment due of $1,200,000. Calculate the DSCR (numeric value) and evaluate repayment capacity.',
    hint: 'Total Debt Service = Interest Expense + Principal Repayment. Divide EBITDA by Total Debt Service and compare against 1.25x.',
    expectedNumericAnswer: 2.25,
    expectedUnit: 'x',
    solutionSteps: [
      'Total Debt Service = $800,000 + $1,200,000 = $2,000,000.',
      'DSCR = EBITDA / Total Debt Service = $4,500,000 / $2,000,000 = 2.25x.',
      'Benchmark Evaluation: 2.25x comfortably exceeds the healthy 1.25x credit threshold, indicating strong operational cash flow cushion.',
    ],
    takeaway:
      'Underwriters prioritize cash flow coverage over paper net profit because principal repayments are paid out of cash, not post-tax accounting income.',
  },
  {
    id: 'q3-el',
    number: 3,
    domain: 'Credit Loss Math',
    title: 'Revolving Line Expected Loss (EL)',
    prompt:
      'A borrower holds a credit card account with a drawn balance of $15,000 on a total credit limit of $50,000. Assuming a Credit Conversion Factor (CCF) of 40%, a 1-year PD of 4.0%, and an LGD of 75%, calculate the Expected Loss in dollars.',
    hint: 'First compute Undrawn Limit ($50k - $15k), then EAD = Drawn + CCF × Undrawn, then EL = PD × LGD × EAD.',
    expectedNumericAnswer: 870,
    expectedUnit: '$',
    solutionSteps: [
      'Undrawn Limit = $50,000 - $15,000 = $35,000.',
      'EAD = Drawn Balance + (CCF × Undrawn Limit) = $15,000 + (0.40 × $35,000) = $15,000 + $14,000 = $29,000.',
      'Expected Loss (EL) = PD × LGD × EAD = 0.04 × 0.75 × $29,000 = $870.',
    ],
    takeaway:
      'For revolving lines (cards, overdrafts), distressed borrowers draw down unused credit right before defaulting—ignoring CCF severely underestimates EAD.',
  },
  {
    id: 'q4-ecl',
    number: 4,
    domain: 'ECL Staging',
    title: 'ECL Stage 1 to Stage 2 Provision Cliff',
    prompt:
      'A corporate loan of $10,000,000 (LGD = 40%) was originated in Stage 1 with a 12-month PD of 1.5%. Due to supply chain disruptions, its 30-day DPD trigger is breached, migrating it to Stage 2 where its lifetime PD is 12.0%. Calculate the dollar increase in accounting loss provisions.',
    hint: 'Compute Stage 1 (12-month PD × LGD × EAD) and Stage 2 (Lifetime PD × LGD × EAD), then take Stage 2 minus Stage 1.',
    expectedNumericAnswer: 420000,
    expectedUnit: '$',
    solutionSteps: [
      'Stage 1 Provision (12-Month ECL) = 0.015 × 0.40 × $10,000,000 = $60,000.',
      'Stage 2 Provision (Lifetime ECL) = 0.120 × 0.40 × $10,000,000 = $480,000.',
      'Provision Increase = $480,000 - $60,000 = $420,000 (an 8.0x reserve increase / provision cliff).',
    ],
    takeaway:
      'Breaching the >30 DPD SICR trigger causes an abrupt jump from 12-month to full lifetime loss recognition, creating the classic IFRS 9 / RBI ECL "provision cliff".',
  },
  {
    id: 'q5-gini',
    number: 5,
    domain: 'Risk Metrics',
    title: 'Gini Coefficient Conversion from AUROC',
    prompt:
      'A validation team reports an AUROC of 0.78 for a newly developed retail credit scorecard. Compute the corresponding Gini Coefficient (as a decimal, e.g., 0.56).',
    hint: 'Recall the linear identity relating Area Under ROC to Gini discrimination power: Gini = 2 × AUROC - 1.',
    expectedNumericAnswer: 0.56,
    expectedUnit: '',
    solutionSteps: [
      'Gini Coefficient = 2 × AUROC - 1.',
      'Gini = 2 × 0.78 - 1 = 1.56 - 1 = 0.56 (or 56%).',
    ],
    takeaway:
      'AUROC 0.50 equals random guessing (Gini = 0.00); strong consumer scorecards typically sit in the 0.45–0.70 Gini band alongside KS > 30%.',
  },
];

export const ESSENTIAL_GLOSSARY: GlossaryItem[] = [
  {
    term: 'Anti-Join',
    category: 'SQL & Data',
    definition:
      'A SQL pattern (LEFT JOIN ... WHERE right_key IS NULL) used to isolate records in one table lacking matching keys in another (e.g., customers without active loans).',
  },
  {
    term: 'Denormalization',
    category: 'SQL & Data',
    definition:
      'Deliberately combining tables or introducing controlled redundancy to eliminate costly multi-table joins and speed up OLAP data warehouse analytics.',
  },
  {
    term: 'Debt Service Coverage Ratio (DSCR)',
    category: 'Financial Ratios',
    definition:
      'Operating cash flow (or EBITDA) divided by total debt service (interest + principal). Healthy benchmark > 1.25x; < 1.0x indicates cash shortfall.',
  },
  {
    term: 'Probability of Default (PD)',
    category: 'Loss & Capital',
    definition:
      'Estimated statistical likelihood that a borrower defaults (typically 90+ DPD or bankruptcy) over a 12-month or lifetime horizon.',
  },
  {
    term: 'Loss Given Default (LGD)',
    category: 'Loss & Capital',
    definition:
      'Net percentage of exposure lost if default occurs after collateral liquidation, workout fees, and time-value discounting (1 - Recovery Rate).',
  },
  {
    term: 'Exposure at Default (EAD)',
    category: 'Loss & Capital',
    definition:
      'Total dollar balance expected to be owed to the lender at default: Drawn Balance + (CCF × Undrawn Limit).',
  },
  {
    term: 'Credit Conversion Factor (CCF)',
    category: 'Loss & Capital',
    definition:
      'Estimated fraction [0, 1] of an undrawn revolving credit line that a borrower will draw down prior to defaulting.',
  },
  {
    term: 'Vasicek Model',
    category: 'Loss & Capital',
    definition:
      'Single-factor asymptotic model used in Basel IRB frameworks to derive 99.9th percentile Worst-Case Default Rate (WCDR) and Unexpected Loss capital.',
  },
  {
    term: 'Expected Credit Loss (ECL)',
    category: 'Regulatory',
    definition:
      'Forward-looking accounting provisioning framework (IFRS 9 / Ind AS 109 / RBI) incorporating macroeconomic forecasts proactively from origination.',
  },
  {
    term: 'Significant Increase in Credit Risk (SICR)',
    category: 'Regulatory',
    definition:
      'Risk threshold (rebuttably >30 DPD) shifting a loan from Stage 1 (12-Month ECL) to Stage 2 (Lifetime ECL), triggering the provision cliff.',
  },
  {
    term: 'Days Past Due (DPD)',
    category: 'Regulatory',
    definition:
      'Elapsed calendar days since a borrower missed an obligated principal or interest installment.',
  },
  {
    term: 'Non-Performing Asset (NPA)',
    category: 'Regulatory',
    definition:
      'A Stage 3 credit-impaired loan where principal or interest payment is overdue for more than 90 days.',
  },
  {
    term: 'Weight of Evidence (WoE)',
    category: 'Scorecards',
    definition:
      'Log-ratio transformation ln(% Non-Defaults / % Defaults) quantifying the risk separation of binned predictor attributes for logistic scorecards.',
  },
  {
    term: 'Gini Coefficient',
    category: 'Scorecards',
    definition:
      'Discrimination metric measuring scorecard ranking power relative to random guessing (2 × AUROC - 1).',
  },
  {
    term: 'Population Stability Index (PSI)',
    category: 'Scorecards',
    definition:
      'Distribution shift monitor comparing live deployment scores against development expectations (<0.10 Stable, 0.10–0.25 Monitor, >0.25 Recalibrate).',
  },
];
