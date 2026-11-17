import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateExpectedLoss,
  calculatePortfolioStress,
  calculateEclMigration,
  calculateVasicekCapital,
  calculateScorecardMetrics,
  evaluateIvStrength,
  calculateFinancialRatios,
  generateStudyPlan,
  generateStandaloneHtmlExport,
} from './riskMath';
import {
  CAREER_PATHS,
  CREDIT_CONCEPT_DEEP_DIVES,
  REAL_WORLD_CASE_STUDIES,
  STATS_ECONOMETRICS_PHASES,
} from '../data/curriculumData';

test('NotebookLM Question 3: Revolving credit card Expected Loss equals $870', () => {
  const res = calculateExpectedLoss({
    drawnBalance: 15000,
    undrawnLimit: 35000,
    ccfPct: 40,
    pdPct: 4.0,
    lgdPct: 75,
  });
  assert.equal(res.ead, 29000);
  assert.equal(res.expectedLoss, 870);
});

test('NotebookLM Section 3.2: 3-Loan Portfolio EL jumps from $101,000 to $284,000 (2.81x) under stress', () => {
  const facilities = [
    {
      id: 'loan-a',
      name: 'Loan A: Secured Term',
      drawnBalance: 5000000,
      undrawnLimit: 0,
      ccfPct: 0,
      pdPct: 1.0,
      lgdPct: 40.0,
    },
    {
      id: 'loan-b',
      name: 'Loan B: Corporate Term',
      drawnBalance: 3000000,
      undrawnLimit: 0,
      ccfPct: 0,
      pdPct: 2.0,
      lgdPct: 45.0,
    },
    {
      id: 'loan-c',
      name: 'Loan C: Revolver Line',
      drawnBalance: 2000000,
      undrawnLimit: 2000000,
      ccfPct: 50,
      pdPct: 3.0,
      lgdPct: 60.0,
    },
  ];

  const result = calculatePortfolioStress(facilities, {
    pdMultiplier: 2.0,
    lgdAddPp: 10,
    revolverDrawdownPct: 100,
  });

  assert.equal(result.baseTotalEad, 11000000);
  assert.equal(result.baseTotalEl, 101000);
  assert.equal(result.stressedTotalEad, 12000000);
  assert.equal(result.stressedTotalEl, 284000);
  assert.equal(result.elJumpMultiple, 2.81);
});

test('NotebookLM Question 4: ECL Stage 1 to Stage 2 migration causes 8.0x reserve increase ($420k delta)', () => {
  const res = calculateEclMigration({
    exposureAmount: 10000000,
    lgdPct: 40,
    pd12mPct: 1.5,
    pdLifetimePct: 12.0,
  });
  assert.equal(res.stage1Provision, 60000);
  assert.equal(res.stage2Provision, 480000);
  assert.equal(res.provisionIncrease, 420000);
  assert.equal(res.reserveMultiple, 8.0);
});

test('NotebookLM Question 2: DSCR Calculation equals 2.25x and marks HEALTHY/NOMINAL', () => {
  const ratios = calculateFinancialRatios({
    ebitda: 4500000,
    ebit: 3600000,
    interestExpense: 800000,
    principalRepayment: 1200000,
    currentAssets: 3200000,
    currentLiabilities: 1800000,
    dioDays: 45,
    dsoDays: 50,
    dpoDays: 35,
  });
  assert.equal(ratios.totalDebtService, 2000000);
  assert.equal(ratios.dscr, 2.25);
  assert.equal(ratios.dscrBand, 'NOMINAL');
  assert.equal(ratios.workingCapitalCycleDays, 60);
});

test('NotebookLM Question 5 & PSI bands: AUROC 0.78 yields Gini 0.56 (56%) and PSI drift classifies accurately', () => {
  const stable = calculateScorecardMetrics({
    auroc: 0.78,
    tp: 140,
    fp: 60,
    tn: 740,
    fn: 60,
    expectedBins: [20, 25, 25, 20, 10],
    actualBins: [20, 25, 25, 20, 10],
  });
  assert.equal(stable.gini, 0.56);
  assert.equal(stable.giniPct, 56);
  assert.equal(stable.psi, 0);
  assert.equal(stable.psiBand, 'NOMINAL');

  const drifted = calculateScorecardMetrics({
    auroc: 0.78,
    tp: 140,
    fp: 60,
    tn: 740,
    fn: 60,
    expectedBins: [20, 25, 25, 20, 10],
    actualBins: [5, 10, 20, 30, 35],
  });
  assert.ok(drifted.psi > 0.25);
  assert.equal(drifted.psiBand, 'CRITICAL');
});

test('IV strength warns on >0.50 leakage and Vasicek capital increases with correlation', () => {
  assert.equal(evaluateIvStrength(0.62).band, 'CRITICAL');
  assert.equal(evaluateIvStrength(0.35).band, 'NOMINAL');

  const lowRho = calculateVasicekCapital({ pdPct: 2.0, lgdPct: 45, rho: 0.12 });
  const highRho = calculateVasicekCapital({ pdPct: 2.0, lgdPct: 45, rho: 0.24 });
  assert.ok(highRho.wcdrPct > lowRho.wcdrPct);
  assert.ok(highRho.capitalRequirementPct > lowRho.capitalRequirementPct);
});

test('Study plan generator adapts duration (4, 8, 12 weeks) and exports valid standalone HTML', () => {
  const plan4 = generateStudyPlan({
    background: 'non-technical',
    track: 'credit-analyst',
    duration: 4,
    weeklyHours: 12,
  });
  const plan8 = generateStudyPlan({
    background: 'commerce-finance',
    track: 'risk-modeling',
    duration: 8,
    weeklyHours: 12,
  });
  const plan12 = generateStudyPlan({
    background: 'non-technical',
    track: 'regulatory-ecl',
    duration: 12,
    weeklyHours: 6,
  });

  assert.equal(plan4.length, 4);
  assert.equal(plan8.length, 8);
  assert.equal(plan12.length, 12);
  assert.ok(plan12[0].title.includes('Non-Technical'));

  const html = generateStandaloneHtmlExport(plan8, {
    background: 'commerce-finance',
    track: 'risk-modeling',
    duration: 8,
    weeklyHours: 12,
  }, { 'm1-dscr': true });
  assert.ok(html.includes('<!doctype html>'));
  assert.ok(html.includes('1 / '));
});

test('Real-world case study simulator presets match documented Expected Loss figures', () => {
  assert.equal(REAL_WORLD_CASE_STUDIES.length, 3);

  const [case1, case2, case3] = REAL_WORLD_CASE_STUDIES;
  const el1 = calculateExpectedLoss(case1.simulatorPreset);
  assert.equal(el1.ead, 29000);
  assert.equal(el1.expectedLoss, 870);

  const el2 = calculateExpectedLoss(case2.simulatorPreset);
  assert.equal(el2.ead, 30000);
  assert.equal(el2.expectedLoss, 337.5);

  const el3 = calculateExpectedLoss(case3.simulatorPreset);
  assert.equal(el3.ead, 40000);
  assert.equal(el3.expectedLoss, 1920);
});

test('Career paths, PD/LGD/EAD deep dives, and Stats/Econometrics curriculum contain complete structured fields', () => {
  assert.deepEqual(
    CREDIT_CONCEPT_DEEP_DIVES.map((c) => c.id),
    ['pd', 'lgd', 'ead']
  );

  assert.equal(CAREER_PATHS.length, 4);
  for (const path of CAREER_PATHS) {
    assert.ok(path.typicalTitles.length >= 3, `${path.id} missing typicalTitles`);
    assert.ok(path.keyResponsibilities.length >= 3, `${path.id} missing keyResponsibilities`);
    assert.ok(path.technicalSkills.length >= 3, `${path.id} missing technicalSkills`);
    assert.ok(path.softSkills.length >= 3, `${path.id} missing softSkills`);
    assert.deepEqual(
      path.careerProgression.map((s) => s.level),
      ['Entry', 'Mid-Level', 'Senior', 'Leadership']
    );
  }

  assert.equal(STATS_ECONOMETRICS_PHASES.length, 4);
  for (const phase of STATS_ECONOMETRICS_PHASES) {
    assert.ok(phase.coreConcepts.length >= 3);
    assert.ok(phase.practicalApplications.length >= 2);
    assert.ok(phase.recommendedResources.length >= 2);
  }
});
