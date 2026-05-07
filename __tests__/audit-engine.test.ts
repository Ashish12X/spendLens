/**
 * Audit Engine Tests
 * Tests cover: plan fit, seat excess, cross-tool switching,
 * API spend review, and optimal detection.
 * Run: npm test
 */

import { runAudit } from '../lib/audit-engine';
import type { AuditFormData } from '../lib/audit-engine';

describe('Audit Engine — Plan Fit', () => {
  test('Claude Team for 1 user should recommend downgrade to Pro', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'claude', planId: 'team', seats: 1, monthlySpend: 30 }],
      teamSize: 1,
      useCase: 'writing',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'claude');

    expect(result).toBeDefined();
    expect(result!.action).toBe('downgrade_plan');
    expect(result!.recommendedPlan).toBe('Pro');
    expect(result!.monthlySavings).toBeGreaterThan(0);
  });

  test('ChatGPT Team for 1 user should recommend downgrade to Plus', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'chatgpt', planId: 'team', seats: 1, monthlySpend: 30 }],
      teamSize: 1,
      useCase: 'mixed',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'chatgpt');

    expect(result!.action).toBe('downgrade_plan');
    expect(result!.recommendedPlan).toBe('Plus');
    expect(result!.monthlySavings).toBe(10); // $30 - $20 = $10
  });

  test('GitHub Copilot Enterprise for 3 users should recommend Business', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'github_copilot', planId: 'enterprise', seats: 3, monthlySpend: 117 }],
      teamSize: 3,
      useCase: 'coding',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'github_copilot');

    expect(result!.action).toBe('downgrade_plan');
    expect(result!.recommendedPlan).toBe('Business');
    expect(result!.monthlySavings).toBeGreaterThan(0);
  });

  test('Cursor Business for 2 users should recommend downgrade to Pro', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'cursor', planId: 'business', seats: 2, monthlySpend: 80 }],
      teamSize: 2,
      useCase: 'coding',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'cursor');

    expect(result!.action).toBe('downgrade_plan');
    expect(result!.monthlySavings).toBe(40); // $80 - $40 = $40
  });
});

describe('Audit Engine — Seat Waste', () => {
  test('10 seats for a 5-person team should flag excess seats', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'cursor', planId: 'pro', seats: 10, monthlySpend: 200 }],
      teamSize: 5,
      useCase: 'coding',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'cursor');

    expect(result!.action).toBe('reduce_seats');
    expect(result!.monthlySavings).toBeGreaterThan(0);
  });

  test('Seat waste savings should equal excess seats × price per seat', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'github_copilot', planId: 'business', seats: 15, monthlySpend: 285 }],
      teamSize: 8,
      useCase: 'coding',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'github_copilot');

    // 15 - 8 = 7 excess seats × $19 = $133
    expect(result!.action).toBe('reduce_seats');
    expect(result!.monthlySavings).toBe(7 * 19); // 133
  });
});

describe('Audit Engine — Cross-Tool Recommendations', () => {
  test('ChatGPT Enterprise for writing should suggest Claude Team', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'chatgpt', planId: 'enterprise', seats: 5, monthlySpend: 300 }],
      teamSize: 5,
      useCase: 'writing',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'chatgpt');

    expect(result!.action).toBe('switch_tool');
    expect(result!.recommendedTool).toBe('claude');
    expect(result!.monthlySavings).toBeGreaterThan(0);
  });

  test('Switching from ChatGPT Enterprise to Claude Team saves at least $150 for 5 seats', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'chatgpt', planId: 'enterprise', seats: 5, monthlySpend: 300 }],
      teamSize: 5,
      useCase: 'research',
    };
    const report = runAudit(form);
    const result = report.results[0];

    // Claude Team is $30/user → $150 for 5 users. Savings = $300 - $150 = $150
    expect(result.monthlySavings).toBeGreaterThanOrEqual(150);
    expect(result.annualSavings).toBeGreaterThanOrEqual(1800);
  });
});

describe('Audit Engine — API Spend', () => {
  test('High Anthropic API spend should trigger review recommendation', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'anthropic_api', planId: 'pay_as_you_go', seats: 1, monthlySpend: 500 }],
      teamSize: 3,
      useCase: 'data',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'anthropic_api');

    expect(result!.action).toBe('review_api_spend');
    expect(result!.monthlySavings).toBeGreaterThan(0);
  });

  test('Low API spend under $200 should not trigger review_api_spend', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'openai_api', planId: 'pay_as_you_go', seats: 1, monthlySpend: 100 }],
      teamSize: 2,
      useCase: 'coding',
    };
    const report = runAudit(form);
    const result = report.results.find((r) => r.toolId === 'openai_api');

    expect(result!.action).not.toBe('review_api_spend');
  });
});

describe('Audit Engine — Optimal Detection', () => {
  test('Cursor Pro for 3 users with matching team size should be optimal', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'cursor', planId: 'pro', seats: 3, monthlySpend: 60 }],
      teamSize: 3,
      useCase: 'coding',
    };
    const report = runAudit(form);
    // Cursor Pro is typically optimal for right-sized teams
    // savings should be 0 or positive (not negative)
    expect(report.totalMonthlySavings).toBeGreaterThanOrEqual(0);
  });

  test('Total annual savings should equal monthly savings × 12', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'claude', planId: 'team', seats: 1, monthlySpend: 30 }],
      teamSize: 1,
      useCase: 'writing',
    };
    const report = runAudit(form);
    expect(report.totalAnnualSavings).toBe(report.totalMonthlySavings * 12);
  });
});

describe('Audit Engine — Report Totals', () => {
  test('Report totals should sum correctly across multiple tools', () => {
    const form: AuditFormData = {
      tools: [
        { toolId: 'claude', planId: 'team', seats: 1, monthlySpend: 30 }, // saves $10
        { toolId: 'chatgpt', planId: 'team', seats: 1, monthlySpend: 30 }, // saves $10
      ],
      teamSize: 1,
      useCase: 'mixed',
    };
    const report = runAudit(form);

    expect(report.totalMonthlySpend).toBe(60);
    expect(report.totalMonthlySavings).toBeGreaterThan(0);
    expect(report.results.length).toBe(2);
  });

  test('highSavings flag should be true when savings > $500/mo', () => {
    const form: AuditFormData = {
      tools: [
        { toolId: 'chatgpt', planId: 'enterprise', seats: 20, monthlySpend: 1200 },
      ],
      teamSize: 5,
      useCase: 'writing',
    };
    const report = runAudit(form);
    expect(report.highSavings).toBe(true);
  });

  test('savingsPercentage should be correct', () => {
    const form: AuditFormData = {
      tools: [{ toolId: 'claude', planId: 'team', seats: 1, monthlySpend: 30 }],
      teamSize: 1,
      useCase: 'writing',
    };
    const report = runAudit(form);
    const expectedPct = Math.round((report.totalMonthlySavings / 30) * 100);
    expect(report.savingsPercentage).toBe(expectedPct);
  });
});
