import { useEffect, useMemo, useState } from 'react';
import { InterviewPrepBank } from './components/InterviewPrepBank';
import { OverviewSection } from './components/OverviewSection';
import { RiskLabsSandbox } from './components/RiskLabsSandbox';
import { StudyPlanWorkbench } from './components/StudyPlanWorkbench';
import { ToolingAndStatsGuide } from './components/ToolingAndStatsGuide';
import { TopBar, type ActiveTab } from './components/TopBar';
import {
  generateStudyPlan,
  type CareerTrack,
  type StudyPlanConfig,
} from './utils/riskMath';

const STORAGE_KEYS = {
  config: 'creditrisk_mentor_config_v1',
  milestones: 'creditrisk_mentor_milestones_v1',
  questions: 'creditrisk_mentor_questions_v1',
};

const DEFAULT_CONFIG: StudyPlanConfig = {
  background: 'non-technical',
  track: 'risk-modeling',
  duration: 8,
  weeklyHours: 12,
};

function readInitialTab(): ActiveTab {
  if (typeof window === 'undefined') return 'overview';
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (
    tab === 'overview' ||
    tab === 'study-plan' ||
    tab === 'risk-labs' ||
    tab === 'tooling-stats' ||
    tab === 'interview-prep'
  ) {
    return tab;
  }
  if (params.get('autostart') === '1') {
    return 'study-plan';
  }
  return 'overview';
}

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(readInitialTab);
  const [config, setConfig] = useState<StudyPlanConfig>(() =>
    readStoredJson<StudyPlanConfig>(STORAGE_KEYS.config, DEFAULT_CONFIG)
  );
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() =>
    readStoredJson<Record<string, boolean>>(STORAGE_KEYS.milestones, {})
  );
  const [masteredQuestions, setMasteredQuestions] = useState<Record<string, boolean>>(() =>
    readStoredJson<Record<string, boolean>>(STORAGE_KEYS.questions, {})
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
    } catch {
      // Ignore storage quota issues
    }
  }, [config]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.milestones, JSON.stringify(completedMilestones));
    } catch {
      // Ignore storage quota issues
    }
  }, [completedMilestones]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(masteredQuestions));
    } catch {
      // Ignore storage quota issues
    }
  }, [masteredQuestions]);

  const plan = useMemo(() => generateStudyPlan(config), [config]);

  const milestoneCounts = useMemo(() => {
    const all = plan.flatMap((w) => w.milestones);
    const done = all.filter((m) => completedMilestones[m.id]).length;
    return { done, total: all.length };
  }, [plan, completedMilestones]);

  const handleToggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetProgress = () => {
    setCompletedMilestones({});
    setMasteredQuestions({});
  };

  const handleToggleMastered = (id: string) => {
    setMasteredQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectCareerForPlan = (track: CareerTrack) => {
    setConfig((prev) => ({ ...prev, track }));
    setActiveTab('study-plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#0F172A]">
      <TopBar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'overview' && (
          <OverviewSection
            onNavigate={setActiveTab}
            onSelectCareerForPlan={handleSelectCareerForPlan}
            completedMilestonesCount={milestoneCounts.done}
            totalMilestonesCount={milestoneCounts.total}
          />
        )}

        {activeTab === 'study-plan' && (
          <StudyPlanWorkbench
            config={config}
            onUpdateConfig={setConfig}
            plan={plan}
            completedMilestones={completedMilestones}
            onToggleMilestone={handleToggleMilestone}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeTab === 'risk-labs' && <RiskLabsSandbox />}

        {activeTab === 'tooling-stats' && <ToolingAndStatsGuide />}

        {activeTab === 'interview-prep' && (
          <InterviewPrepBank
            masteredQuestions={masteredQuestions}
            onToggleMastered={handleToggleMastered}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            CreditRisk Mentor · Structured around the Core SQL &amp; Credit Risk Interview Study Guide
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('study-plan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Study Plan
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('risk-labs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Concepts &amp; Labs
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('tooling-stats');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Stats &amp; Tooling
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('interview-prep');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Interview Prep
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
