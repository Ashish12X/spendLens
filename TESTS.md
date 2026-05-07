# TESTS.md — Automated Test Suite

## How to Run

```bash
npm test                    # Run all tests once
npm run test:watch          # Watch mode (re-runs on file change)
npm run test:coverage       # With coverage report
```

Tests are located in `__tests__/audit-engine.test.ts`.

---

## Test Suite: Audit Engine

**File:** `__tests__/audit-engine.test.ts`  
**Framework:** Jest + ts-jest  
**Coverage:** Core audit logic in `lib/audit-engine.ts`

### Test Descriptions

| # | Test Name | What it Covers |
|---|---|---|
| 1 | `Claude Team for 1 user should recommend downgrade to Pro` | Plan fit: detects single user on team plan, recommends individual plan, savings > 0 |
| 2 | `ChatGPT Team for 1 user should recommend downgrade to Plus` | Plan fit: specific savings calculation ($30 - $20 = $10) |
| 3 | `GitHub Copilot Enterprise for 3 users should recommend Business` | Plan fit: Enterprise is overkill for small teams |
| 4 | `Cursor Business for 2 users should recommend downgrade to Pro` | Plan fit: savings = exact ($80 - $40 = $40) |
| 5 | `10 seats for a 5-person team should flag excess seats` | Seat waste: excess seats detected when seats > teamSize + 2 |
| 6 | `Seat waste savings should equal excess seats × price per seat` | Seat waste: math verified (7 excess × $19 = $133) |
| 7 | `ChatGPT Enterprise for writing should suggest Claude Team` | Cross-tool: correct tool switch recommended for use case |
| 8 | `Switching from ChatGPT Enterprise to Claude Team saves at least $150 for 5 seats` | Cross-tool: savings magnitude verified ($300 - $150 = $150) |
| 9 | `High Anthropic API spend should trigger review recommendation` | API spend: >$200/month triggers review_api_spend action |
| 10 | `Low API spend under $200 should not trigger review_api_spend` | API spend: boundary condition — $100 is below threshold |
| 11 | `Total annual savings should equal monthly savings × 12` | Report math: annual = monthly × 12 |
| 12 | `Report totals should sum correctly across multiple tools` | Multi-tool: totals aggregate correctly |
| 13 | `highSavings flag should be true when savings > $500/mo` | Threshold flag: >$500 triggers Credex CTA flag |
| 14 | `savingsPercentage should be correct` | Report math: percentage calculation matches expected formula |

### Coverage Areas

- ✅ Plan fit evaluation (all 5 tool-specific rules)
- ✅ Seat count evaluation (excess seat detection)
- ✅ Cross-tool alternative recommendations (ChatGPT → Claude for writing)
- ✅ API spend review threshold ($200/month boundary)
- ✅ Aggregate math (totals, annual savings, percentage)
- ✅ Threshold flags (highSavings, alreadyOptimal)
- ✅ Multi-tool report generation

### Not Covered (by design)

- Anthropic API call (mocked/integration test — would require live API key)
- Supabase database calls (integration test — would require live DB)
- Email delivery (integration test — would require live Resend key)
- OG image rendering (visual/e2e test)
