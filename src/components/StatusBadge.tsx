import { AlertTriangle, CheckCircle2, XOctagon } from 'lucide-react';
import type { SemanticBand } from '../utils/riskMath';

interface StatusBadgeProps {
  band: SemanticBand;
  label?: string;
}

export function StatusBadge({ band, label }: StatusBadgeProps) {
  if (band === 'NOMINAL') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
        <span>{label ?? 'NOMINAL'}</span>
      </span>
    );
  }

  if (band === 'ELEVATED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
        <span>{label ?? 'ELEVATED'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200 whitespace-nowrap shrink-0">
      <XOctagon className="w-3.5 h-3.5 text-red-700 shrink-0" aria-hidden="true" />
      <span>{label ?? 'CRITICAL'}</span>
    </span>
  );
}
