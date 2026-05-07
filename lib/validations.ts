import { z } from 'zod';

export const toolInputSchema = z.object({
  toolId: z.enum([
    'cursor',
    'github_copilot',
    'claude',
    'chatgpt',
    'anthropic_api',
    'openai_api',
    'gemini',
    'windsurf',
  ] as const),
  planId: z.string().min(1),
  seats: z.number().int().min(1).max(10000),
  monthlySpend: z.number().min(0).max(1000000),
});

export const auditFormSchema = z.object({
  tools: z.array(toolInputSchema).min(1, 'Add at least one tool'),
  teamSize: z.number().int().min(1).max(100000),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed'] as const),
});

export const leadCaptureSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().int().min(1).max(100000).optional(),
  auditId: z.string().uuid(),
  honeypot: z.string().max(0, 'Bot detected'), // Must be empty
});

export type AuditFormInput = z.infer<typeof auditFormSchema>;
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
export type ToolInput = z.infer<typeof toolInputSchema>;
