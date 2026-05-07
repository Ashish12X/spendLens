// ============================================================
// AUDIT ENGINE — Core logic for AI spend analysis
// All rules are hardcoded (no AI) — defensible by a finance person
// ============================================================

import { ALL_TOOLS, TOOL_MAP, type ToolId, type UseCase } from './pricing-data';

export interface UserToolInput {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number; // what they're actually paying
}

export interface AuditFormData {
  tools: UserToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export type RecommendationAction =
  | 'downgrade_plan'    // Same tool, cheaper plan
  | 'reduce_seats'      // Same tool+plan, fewer seats
  | 'switch_tool'       // Different tool entirely
  | 'use_credits'       // Buy via Credex credits
  | 'optimal'           // Already well-optimized
  | 'review_api_spend'; // API spend review recommended

export interface ToolAuditResult {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentSeats: number;
  currentMonthlySpend: number;
  action: RecommendationAction;
  recommendedPlan?: string;
  recommendedTool?: string;
  recommendedToolName?: string;
  projectedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: 'high' | 'medium' | 'low' | 'optimal';
  credexOpportunity: boolean;
}

export interface AuditReport {
  id?: string;
  formData: AuditFormData;
  results: ToolAuditResult[];
  totalMonthlySpend: number;
  totalProjectedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  highSavings: boolean; // > $500/mo
  alreadyOptimal: boolean; // < $100/mo savings
  aiSummary?: string;
  createdAt?: string;
}

// Alternative tool reasoning is embedded directly in evaluateCrossTool() below.

// ============================================================
// PLAN FIT EVALUATION
// ============================================================
function evaluatePlanFit(input: UserToolInput): ToolAuditResult | null {
  const tool = TOOL_MAP[input.toolId];
  if (!tool) return null;

  const currentPlanData = tool.plans.find((p) => p.id === input.planId);
  if (!currentPlanData) return null;

  const currentPlanName = currentPlanData.name;
  const seats = input.seats;

  // Check if seats justify the plan tier
  // e.g., Team plan requires min 2 seats but if you only have 1, downgrade to Individual/Pro
  if (input.toolId === 'claude' && input.planId === 'team' && seats === 1) {
    const proPlan = tool.plans.find((p) => p.id === 'pro')!;
    const projected = proPlan.monthlyPricePerSeat * seats;
    const savings = input.monthlySpend - projected;
    if (savings > 0) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanName,
        currentSeats: seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'downgrade_plan',
        recommendedPlan: 'Pro',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Claude Team ($30/user) requires a 2-seat minimum and adds admin features you don't need as a solo user. Claude Pro ($20/user) gives identical AI capabilities for ${Math.round((savings / input.monthlySpend) * 100)}% less.`,
        severity: savings > 50 ? 'high' : 'medium',
        credexOpportunity: tool.credexAvailable,
      };
    }
  }

  if (input.toolId === 'chatgpt' && input.planId === 'team' && seats === 1) {
    const plusPlan = tool.plans.find((p) => p.id === 'plus')!;
    const projected = plusPlan.monthlyPricePerSeat * seats;
    const savings = input.monthlySpend - projected;
    if (savings > 0) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanName,
        currentSeats: seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'downgrade_plan',
        recommendedPlan: 'Plus',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `ChatGPT Team ($30/user) adds admin controls and workspace features that provide no value for a single user. Plus ($20/user) provides identical AI model access — the Team premium is pure overhead for solo use.`,
        severity: 'medium',
        credexOpportunity: tool.credexAvailable,
      };
    }
  }

  if (input.toolId === 'github_copilot' && input.planId === 'enterprise' && seats <= 5) {
    const businessPlan = tool.plans.find((p) => p.id === 'business')!;
    const projected = businessPlan.monthlyPricePerSeat * seats;
    const savings = input.monthlySpend - projected;
    if (savings > 0) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanName,
        currentSeats: seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'downgrade_plan',
        recommendedPlan: 'Business',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `GitHub Copilot Enterprise ($39/user) adds fine-tuned models and Bing search — features with marginal benefit for teams under 10. Business ($19/user) covers core coding assistance at 51% less per seat.`,
        severity: savings > 100 ? 'high' : 'medium',
        credexOpportunity: tool.credexAvailable,
      };
    }
  }

  if (input.toolId === 'cursor' && input.planId === 'business' && seats <= 3) {
    const proPlan = tool.plans.find((p) => p.id === 'pro')!;
    const projected = proPlan.monthlyPricePerSeat * seats;
    const savings = input.monthlySpend - projected;
    if (savings > 0) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanName,
        currentSeats: seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'downgrade_plan',
        recommendedPlan: 'Pro',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Cursor Business ($40/user) adds admin dashboard and SSO — zero value for teams under 4. Cursor Pro ($20/user) provides identical AI coding capabilities at exactly half the price.`,
        severity: savings > 50 ? 'high' : 'medium',
        credexOpportunity: tool.credexAvailable,
      };
    }
  }

  if (input.toolId === 'gemini' && input.planId === 'workspace' && seats <= 2) {
    const proPlan = tool.plans.find((p) => p.id === 'pro')!;
    const projected = proPlan.monthlyPricePerSeat * seats;
    const savings = input.monthlySpend - projected;
    if (savings > 0) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanName,
        currentSeats: seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'downgrade_plan',
        recommendedPlan: 'Google One AI Premium',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Gemini for Workspace ($30/user) adds Workspace app integrations that are redundant for small teams not fully embedded in Google's ecosystem. Google One AI Premium ($19.99/user) delivers Gemini Advanced at 33% less per seat.`,
        severity: 'medium',
        credexOpportunity: false,
      };
    }
  }

  return null;
}

// ============================================================
// SEAT COUNT EVALUATION
// ============================================================
function evaluateSeatCount(input: UserToolInput, teamSize: number): ToolAuditResult | null {
  const tool = TOOL_MAP[input.toolId];
  if (!tool) return null;

  const currentPlanData = tool.plans.find((p) => p.id === input.planId);
  if (!currentPlanData) return null;

  // If seats significantly exceed team size, flag it
  const excessSeats = input.seats - teamSize;
  if (excessSeats > 2 && teamSize > 0) {
    const unitPrice = currentPlanData.monthlyPricePerSeat;
    if (unitPrice > 0) {
      const wastedMonthly = excessSeats * unitPrice;
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanData.name,
        currentSeats: input.seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'reduce_seats',
        projectedMonthlySpend: input.monthlySpend - wastedMonthly,
        monthlySavings: wastedMonthly,
        annualSavings: wastedMonthly * 12,
        reason: `You have ${input.seats} ${tool.name} seats for a team of ${teamSize}. Removing ${excessSeats} unused seats saves $${wastedMonthly}/month — no functionality lost.`,
        severity: wastedMonthly > 100 ? 'high' : 'medium',
        credexOpportunity: tool.credexAvailable,
      };
    }
  }

  return null;
}

// ============================================================
// CROSS-TOOL ALTERNATIVE EVALUATION
// ============================================================
function evaluateCrossTool(input: UserToolInput, useCase: UseCase): ToolAuditResult | null {
  const tool = TOOL_MAP[input.toolId];
  if (!tool) return null;

  const currentPlanData = tool.plans.find((p) => p.id === input.planId);
  if (!currentPlanData) return null;

  // Coding IDE: Compare Copilot Business vs Cursor Pro
  if (
    input.toolId === 'github_copilot' &&
    input.planId === 'business' &&
    (useCase === 'coding' || useCase === 'mixed')
  ) {
    const cursorTool = TOOL_MAP['cursor'];
    const cursorPro = cursorTool.plans.find((p) => p.id === 'pro')!;
    const projected = cursorPro.monthlyPricePerSeat * input.seats;
    const savings = input.monthlySpend - projected;

    if (savings > 5 * input.seats) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanData.name,
        currentSeats: input.seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'switch_tool',
        recommendedTool: 'cursor',
        recommendedToolName: 'Cursor',
        recommendedPlan: 'Pro',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `GitHub Copilot Business ($19/user) offers tab completion and basic chat. Cursor Pro ($20/user) adds agent mode, multi-file context, and composer — meaningfully higher productivity for $1 more per seat. The switch pays for itself within days of reduced friction.`,
        severity: 'low',
        credexOpportunity: true,
      };
    }
  }

  // ChatGPT Enterprise → Claude Team for writing use cases
  if (
    input.toolId === 'chatgpt' &&
    input.planId === 'enterprise' &&
    (useCase === 'writing' || useCase === 'mixed' || useCase === 'research')
  ) {
    const claudeTool = TOOL_MAP['claude'];
    const claudeTeam = claudeTool.plans.find((p) => p.id === 'team')!;
    const projected = claudeTeam.monthlyPricePerSeat * input.seats;
    const savings = input.monthlySpend - projected;

    if (savings > 0) {
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanData.name,
        currentSeats: input.seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'switch_tool',
        recommendedTool: 'claude',
        recommendedToolName: 'Claude',
        recommendedPlan: 'Team',
        projectedMonthlySpend: projected,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `ChatGPT Enterprise (~$60/user) vs Claude Team ($30/user): for ${useCase} workloads, Claude consistently scores higher on long-document comprehension and instruction-following (Stanford HELM). At half the price, the capability trade-off favors Claude.`,
        severity: savings > 200 ? 'high' : 'medium',
        credexOpportunity: true,
      };
    }
  }

  // Windsurf → Cursor for coding (Cursor has broader ecosystem)
  if (input.toolId === 'windsurf' && input.planId === 'teams' && useCase === 'coding') {
    const cursorTool = TOOL_MAP['cursor'];
    const cursorBiz = cursorTool.plans.find((p) => p.id === 'business')!;
    const projected = cursorBiz.monthlyPricePerSeat * input.seats;
    const savings = input.monthlySpend - projected;

    if (Math.abs(savings) < 10 * input.seats) {
      // Near price parity — suggest Cursor for ecosystem
      return {
        toolId: input.toolId,
        toolName: tool.name,
        currentPlan: currentPlanData.name,
        currentSeats: input.seats,
        currentMonthlySpend: input.monthlySpend,
        action: 'switch_tool',
        recommendedTool: 'cursor',
        recommendedToolName: 'Cursor',
        recommendedPlan: 'Business',
        projectedMonthlySpend: projected,
        monthlySavings: Math.max(0, savings),
        annualSavings: Math.max(0, savings) * 12,
        reason: `Windsurf Teams ($35/user) and Cursor Business ($40/user) are near price parity. Cursor's model marketplace (GPT-4o, Claude 3.5, Gemini) gives significantly more flexibility than Windsurf's closed model stack — relevant when optimizing for model cost over time.`,
        severity: 'low',
        credexOpportunity: true,
      };
    }
  }

  return null;
}

// ============================================================
// CREDEX CREDIT OPPORTUNITY
// ============================================================
function evaluateCredexOpportunity(input: UserToolInput): ToolAuditResult | null {
  const tool = TOOL_MAP[input.toolId];
  if (!tool || !tool.credexAvailable) return null;

  // Only flag if spend is significant and tool has credits available
  if (input.monthlySpend >= 100) {
    const credexDiscount = 0.2; // Conservative 20% discount estimate
    const savings = input.monthlySpend * credexDiscount;

    return {
      toolId: input.toolId,
      toolName: tool.name,
      currentPlan: tool.plans.find((p) => p.id === input.planId)?.name ?? input.planId,
      currentSeats: input.seats,
      currentMonthlySpend: input.monthlySpend,
      action: 'use_credits',
      projectedMonthlySpend: input.monthlySpend * (1 - credexDiscount),
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Credex sources discounted ${tool.name} credits from companies that overforecast AI usage. At your spend level ($${input.monthlySpend}/mo), a typical 15–25% discount saves $${Math.round(savings)}/month with zero workflow change.`,
      severity: savings > 100 ? 'high' : 'medium',
      credexOpportunity: true,
    };
  }

  return null;
}

// ============================================================
// API SPEND AUDIT
// ============================================================
function evaluateApiSpend(input: UserToolInput): ToolAuditResult | null {
  const tool = TOOL_MAP[input.toolId];
  if (!tool || tool.category !== 'api') return null;

  if (input.monthlySpend > 200) {
    return {
      toolId: input.toolId,
      toolName: tool.name,
      currentPlan: 'Pay-as-you-go',
      currentSeats: input.seats,
      currentMonthlySpend: input.monthlySpend,
      action: 'review_api_spend',
      projectedMonthlySpend: input.monthlySpend * 0.7, // 30% savings estimate via model downsizing
      monthlySavings: input.monthlySpend * 0.3,
      annualSavings: input.monthlySpend * 0.3 * 12,
      reason: `At $${input.monthlySpend}/month in ${tool.name} spend, model selection is the highest-leverage lever. Routing 80% of calls to a tier-2 model (Haiku/GPT-4o-mini) and reserving the flagship for complex tasks typically cuts API bills 25–40% with minimal quality impact.`,
      severity: 'high',
      credexOpportunity: tool.credexAvailable,
    };
  }

  return null;
}

// ============================================================
// MAIN AUDIT FUNCTION
// ============================================================
export function runAudit(formData: AuditFormData): AuditReport {
  const results: ToolAuditResult[] = [];

  for (const input of formData.tools) {
    const tool = TOOL_MAP[input.toolId];
    if (!tool) continue;

    const currentPlanData = tool.plans.find((p) => p.id === input.planId);
    if (!currentPlanData) continue;

    // Run checks in priority order, take the best recommendation
    const checks: (ToolAuditResult | null)[] = [
      evaluatePlanFit(input),
      evaluateSeatCount(input, formData.teamSize),
      evaluateCrossTool(input, formData.useCase),
      evaluateApiSpend(input),
    ];

    const bestRecommendation = checks.find((r) => r !== null && r.monthlySavings > 0);

    if (bestRecommendation) {
      results.push(bestRecommendation);
    } else {
      // Check Credex credits as a fallback opportunity
      const credexResult = evaluateCredexOpportunity(input);
      if (credexResult) {
        results.push(credexResult);
      } else {
        // Tool is already optimal
        results.push({
          toolId: input.toolId,
          toolName: tool.name,
          currentPlan: currentPlanData.name,
          currentSeats: input.seats,
          currentMonthlySpend: input.monthlySpend,
          action: 'optimal',
          projectedMonthlySpend: input.monthlySpend,
          monthlySavings: 0,
          annualSavings: 0,
          reason: `Your ${tool.name} ${currentPlanData.name} plan is appropriately sized for ${input.seats} user${input.seats > 1 ? 's' : ''} on a ${formData.useCase} workflow. No changes recommended.`,
          severity: 'optimal',
          credexOpportunity: false,
        });
      }
    }
  }

  const totalMonthlySpend = formData.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalProjectedSpend = results.reduce((sum, r) => sum + r.projectedMonthlySpend, 0);
  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const savingsPercentage =
    totalMonthlySpend > 0 ? Math.round((totalMonthlySavings / totalMonthlySpend) * 100) : 0;

  return {
    formData,
    results,
    totalMonthlySpend,
    totalProjectedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsPercentage,
    highSavings: totalMonthlySavings > 500,
    alreadyOptimal: totalMonthlySavings < 100,
  };
}

// ============================================================
// UTILITY: Get tool by ID
// ============================================================
export function getToolById(id: ToolId) {
  return TOOL_MAP[id];
}

export function getAllTools() {
  return ALL_TOOLS;
}
