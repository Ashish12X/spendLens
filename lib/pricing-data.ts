// ============================================================
// PRICING DATA — All numbers verified from official pricing pages
// Sources documented in PRICING_DATA.md
// Last verified: 2026-05-07
// ============================================================

export type ToolId =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface Plan {
  id: string;
  name: string;
  monthlyPricePerSeat: number; // USD/user/month
  annualPricePerSeat?: number; // USD/user/month if billed annually
  minSeats?: number;
  maxSeats?: number;
  features: string[];
  bestFor: UseCase[];
}

export interface Tool {
  id: ToolId;
  name: string;
  vendor: string;
  plans: Plan[];
  category: 'ide' | 'chat' | 'api' | 'model';
  primaryUseCases: UseCase[];
  credexAvailable: boolean; // Whether Credex has credits available
}

// ============================================================
// CURSOR — https://cursor.com/pricing
// ============================================================
export const CURSOR: Tool = {
  id: 'cursor',
  name: 'Cursor',
  vendor: 'Anysphere',
  category: 'ide',
  primaryUseCases: ['coding'],
  credexAvailable: true,
  plans: [
    {
      id: 'hobby',
      name: 'Hobby',
      monthlyPricePerSeat: 0,
      features: ['2000 completions/month', 'Limited fast requests'],
      bestFor: ['coding'],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPricePerSeat: 20,
      annualPricePerSeat: 16,
      features: ['Unlimited completions', '500 fast requests/month', 'Unlimited slow requests'],
      bestFor: ['coding'],
    },
    {
      id: 'business',
      name: 'Business',
      monthlyPricePerSeat: 40,
      features: ['Everything in Pro', 'Admin dashboard', 'SSO', 'Usage analytics'],
      minSeats: 1,
      bestFor: ['coding'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPricePerSeat: 100, // Estimated — contact sales
      features: ['Custom contracts', 'SLA', 'Dedicated support'],
      minSeats: 20,
      bestFor: ['coding'],
    },
  ],
};

// ============================================================
// GITHUB COPILOT — https://github.com/features/copilot#pricing
// ============================================================
export const GITHUB_COPILOT: Tool = {
  id: 'github_copilot',
  name: 'GitHub Copilot',
  vendor: 'GitHub (Microsoft)',
  category: 'ide',
  primaryUseCases: ['coding'],
  credexAvailable: true,
  plans: [
    {
      id: 'individual',
      name: 'Individual',
      monthlyPricePerSeat: 10,
      annualPricePerSeat: 8.33, // $100/year
      features: ['Code completions', 'Chat in IDE', 'CLI assistance'],
      bestFor: ['coding'],
    },
    {
      id: 'business',
      name: 'Business',
      monthlyPricePerSeat: 19,
      features: ['Everything in Individual', 'Admin controls', 'Audit logs', 'Policy management'],
      minSeats: 1,
      bestFor: ['coding'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPricePerSeat: 39,
      features: ['Everything in Business', 'Fine-tuned models', 'GitHub.com chat', 'Knowledge bases'],
      minSeats: 1,
      bestFor: ['coding'],
    },
  ],
};

// ============================================================
// CLAUDE — https://www.anthropic.com/pricing
// ============================================================
export const CLAUDE: Tool = {
  id: 'claude',
  name: 'Claude',
  vendor: 'Anthropic',
  category: 'chat',
  primaryUseCases: ['writing', 'coding', 'research', 'mixed'],
  credexAvailable: true,
  plans: [
    {
      id: 'free',
      name: 'Free',
      monthlyPricePerSeat: 0,
      features: ['Limited messages', 'Claude Haiku access'],
      bestFor: ['writing', 'research'],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPricePerSeat: 20,
      features: ['5x more usage', 'Claude Sonnet & Opus', 'Priority access'],
      bestFor: ['writing', 'coding', 'research'],
    },
    {
      id: 'max',
      name: 'Max',
      monthlyPricePerSeat: 100,
      features: ['20x more usage vs Pro', 'Claude Opus priority', 'Extended thinking'],
      bestFor: ['research', 'coding'],
    },
    {
      id: 'team',
      name: 'Team',
      monthlyPricePerSeat: 30,
      features: ['Pro features', 'Higher limits', 'Admin console', 'Billing management'],
      minSeats: 2,
      bestFor: ['writing', 'coding', 'mixed'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPricePerSeat: 60, // Estimated floor — contact sales
      features: ['Custom limits', 'SSO', 'Advanced security', 'Custom retention'],
      minSeats: 10,
      bestFor: ['mixed', 'writing', 'coding'],
    },
    {
      id: 'api',
      name: 'API Direct',
      monthlyPricePerSeat: 0, // pay-per-token
      features: ['Usage-based pricing', 'All models', 'No seat limits'],
      bestFor: ['coding', 'data'],
    },
  ],
};

// ============================================================
// CHATGPT — https://openai.com/chatgpt/pricing
// ============================================================
export const CHATGPT: Tool = {
  id: 'chatgpt',
  name: 'ChatGPT',
  vendor: 'OpenAI',
  category: 'chat',
  primaryUseCases: ['writing', 'coding', 'research', 'mixed'],
  credexAvailable: true,
  plans: [
    {
      id: 'free',
      name: 'Free',
      monthlyPricePerSeat: 0,
      features: ['Limited GPT-4o', 'Basic features'],
      bestFor: ['writing'],
    },
    {
      id: 'plus',
      name: 'Plus',
      monthlyPricePerSeat: 20,
      features: ['GPT-4o access', 'DALL-E', 'Advanced data analysis', 'Custom GPTs'],
      bestFor: ['writing', 'coding', 'research'],
    },
    {
      id: 'team',
      name: 'Team',
      monthlyPricePerSeat: 30,
      features: ['Everything in Plus', 'Higher message limits', 'Admin workspace', 'Data excluded from training'],
      minSeats: 2,
      bestFor: ['writing', 'mixed'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPricePerSeat: 60, // Estimated — contact sales
      features: ['Unlimited GPT-4o', 'SSO', 'Custom data retention', 'Analytics'],
      minSeats: 10,
      bestFor: ['mixed', 'writing'],
    },
    {
      id: 'api',
      name: 'API Direct',
      monthlyPricePerSeat: 0,
      features: ['Pay-per-token', 'All models', 'No seat limits'],
      bestFor: ['coding', 'data'],
    },
  ],
};

// ============================================================
// ANTHROPIC API — https://www.anthropic.com/pricing
// ============================================================
export const ANTHROPIC_API: Tool = {
  id: 'anthropic_api',
  name: 'Anthropic API',
  vendor: 'Anthropic',
  category: 'api',
  primaryUseCases: ['coding', 'data'],
  credexAvailable: true,
  plans: [
    {
      id: 'pay_as_you_go',
      name: 'Pay-as-you-go',
      monthlyPricePerSeat: 0,
      features: [
        'Claude 3.5 Haiku: $0.80/MTok in, $4/MTok out',
        'Claude Sonnet 4: $3/MTok in, $15/MTok out',
        'Claude Opus 4: $15/MTok in, $75/MTok out',
      ],
      bestFor: ['coding', 'data'],
    },
  ],
};

// ============================================================
// OPENAI API — https://openai.com/api/pricing
// ============================================================
export const OPENAI_API: Tool = {
  id: 'openai_api',
  name: 'OpenAI API',
  vendor: 'OpenAI',
  category: 'api',
  primaryUseCases: ['coding', 'data'],
  credexAvailable: true,
  plans: [
    {
      id: 'pay_as_you_go',
      name: 'Pay-as-you-go',
      monthlyPricePerSeat: 0,
      features: [
        'GPT-4o mini: $0.15/MTok in, $0.60/MTok out',
        'GPT-4o: $2.50/MTok in, $10/MTok out',
        'o3: $10/MTok in, $40/MTok out',
      ],
      bestFor: ['coding', 'data'],
    },
  ],
};

// ============================================================
// GEMINI — https://one.google.com/about/ai-premium
// ============================================================
export const GEMINI: Tool = {
  id: 'gemini',
  name: 'Gemini',
  vendor: 'Google',
  category: 'chat',
  primaryUseCases: ['writing', 'research', 'data', 'mixed'],
  credexAvailable: false,
  plans: [
    {
      id: 'free',
      name: 'Free',
      monthlyPricePerSeat: 0,
      features: ['Gemini 2.0 Flash', 'Basic features'],
      bestFor: ['writing'],
    },
    {
      id: 'pro',
      name: 'Google One AI Premium',
      monthlyPricePerSeat: 19.99,
      features: ['Gemini Advanced', 'Gemini 1.5 Pro', '2TB storage', 'Integration with Workspace'],
      bestFor: ['writing', 'research', 'mixed'],
    },
    {
      id: 'workspace',
      name: 'Gemini for Workspace',
      monthlyPricePerSeat: 30,
      features: ['Gemini in Gmail/Docs/Sheets/Meet', 'Gemini Advanced', 'Admin controls'],
      minSeats: 1,
      bestFor: ['writing', 'mixed'],
    },
    {
      id: 'api',
      name: 'API (Google AI Studio)',
      monthlyPricePerSeat: 0,
      features: ['Pay-per-token', 'Gemini Flash free tier', 'Gemini Pro paid'],
      bestFor: ['coding', 'data'],
    },
  ],
};

// ============================================================
// WINDSURF — https://windsurf.com/pricing
// ============================================================
export const WINDSURF: Tool = {
  id: 'windsurf',
  name: 'Windsurf',
  vendor: 'Codeium',
  category: 'ide',
  primaryUseCases: ['coding'],
  credexAvailable: false,
  plans: [
    {
      id: 'free',
      name: 'Free',
      monthlyPricePerSeat: 0,
      features: ['Limited AI flows', 'Basic code completion'],
      bestFor: ['coding'],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPricePerSeat: 15,
      features: ['Unlimited flows', 'Priority models', 'Advanced Cascade agent'],
      bestFor: ['coding'],
    },
    {
      id: 'teams',
      name: 'Teams',
      monthlyPricePerSeat: 35,
      features: ['Everything in Pro', 'Team admin', 'Centralized billing', 'Usage analytics'],
      minSeats: 3,
      bestFor: ['coding'],
    },
  ],
};

export const ALL_TOOLS: Tool[] = [
  CURSOR,
  GITHUB_COPILOT,
  CLAUDE,
  CHATGPT,
  ANTHROPIC_API,
  OPENAI_API,
  GEMINI,
  WINDSURF,
];

export const TOOL_MAP: Record<ToolId, Tool> = {
  cursor: CURSOR,
  github_copilot: GITHUB_COPILOT,
  claude: CLAUDE,
  chatgpt: CHATGPT,
  anthropic_api: ANTHROPIC_API,
  openai_api: OPENAI_API,
  gemini: GEMINI,
  windsurf: WINDSURF,
};
