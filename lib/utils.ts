import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function getSavingsColor(savings: number): string {
  if (savings > 500) return 'text-emerald-400';
  if (savings > 100) return 'text-green-400';
  if (savings > 0) return 'text-lime-400';
  return 'text-slate-400';
}

export function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'high':
      return { label: 'High Impact', classes: 'bg-red-500/20 text-red-300 border-red-500/30' };
    case 'medium':
      return { label: 'Medium Impact', classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    case 'low':
      return { label: 'Low Impact', classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    case 'optimal':
      return { label: 'Optimal', classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    default:
      return { label: severity, classes: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
  }
}

export function getActionLabel(action: string): string {
  switch (action) {
    case 'downgrade_plan':
      return 'Downgrade Plan';
    case 'reduce_seats':
      return 'Reduce Seats';
    case 'switch_tool':
      return 'Switch Tool';
    case 'use_credits':
      return 'Use Credex Credits';
    case 'optimal':
      return 'Already Optimal';
    case 'review_api_spend':
      return 'Review API Usage';
    default:
      return action;
  }
}

export function generateShareText(savings: number, toolCount: number): string {
  if (savings > 500) {
    return `Just ran an AI spend audit and found $${formatNumber(Math.round(savings))}/month in savings across ${toolCount} tools. Free tool 👇`;
  }
  if (savings > 0) {
    return `Audited my AI tool stack and found $${formatNumber(Math.round(savings))}/month in unnecessary spend. Quick free audit 👇`;
  }
  return `Just audited my AI tool stack — spending well across ${toolCount} tools. Check yours free 👇`;
}
