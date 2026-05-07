# ECONOMICS.md — Unit Economics for SpendLens

## What a Converted Lead Is Worth to Credex

Credex sells discounted AI credits, typically at 15–30% below retail. Assume:

- Average deal size: $15,000/year (conservative for a 20-person startup using $1,250/month of AI tools at retail)
- Credex margin on a deal: ~20% gross margin (sourcing + ops)
- Revenue per deal: $3,000/year gross, ~$600/year gross profit

So a converted customer is worth **~$3,000 ARR** to Credex on first-year revenue, with significant expansion potential as the team grows.

More aggressively: A Series A startup spending $5k/month on AI infrastructure signs a $60k/year contract through Credex. At 20% margin = $12k GP per customer. One whale deal justifies the tool entirely.

---

## CAC at Each Channel

| Channel | Effort | Estimated Audits | Lead Rate | Leads | Consult Rate | Consults | Close Rate | Customers | Revenue | CAC |
|---|---|---|---|---|---|---|---|---|---|---|
| HN Show HN (1 post) | 2h writing | 2,000 | 8% | 160 | 5% | 8 | 20% | 1.6 | $4,800 | ~$0 |
| Indie Hackers | 1h writing | 200 | 10% | 20 | 5% | 1 | 20% | 0.2 | $600 | ~$0 |
| LinkedIn cold DM (20 msgs) | 3h | 40 | 30% | 12 | 15% | 1.8 | 25% | 0.45 | $1,350 | ~$0 |
| Organic Twitter thread | 2h | 500 | 6% | 30 | 4% | 1.2 | 20% | 0.24 | $720 | ~$0 |

**Key insight**: CAC is effectively $0 because all channels are content/outreach with time cost only. Even at 3h of work → 0.45 customers, the ROI is infinite compared to paid ads.

If we added paid LinkedIn ads targeting "Engineering Manager" at "50–200 employees" companies:
- CPM: ~$80 (LinkedIn B2B premium)
- CTR to audit: 0.5%
- $500 ad spend → 6,250 impressions → 31 audits → 2.5 leads → 0.5 consults → 0.1 customer → $300 revenue
- Paid CAC = $5,000+. Not viable without organic validation first.

---

## Conversion Funnel

```
Landing page visit        → 100%
Audit form started        → 35%   (high intent, pain-aware visitors)
Audit completed           → 75%   (of starters — form is short)
Email captured            → 12%   (of completers — email gate is post-value)
Consultation requested    → 5%    (of leads — only high-savings cases)
Credit purchase closed    → 20%   (of consultations)
```

So: **1,000 visitors → 350 start → 263 complete → 32 leads → 1.6 consultations → 0.3 customers**

At 2,000 visits/month (sustainable organic): 630 audits/month → 75 leads → 3.8 consultations → 0.75 customers/month = **~9 customers/year from organic alone**.

At $3,000 ARR each = $27,000 ARR. Not $1M. We need volume.

---

## What Has to Be True for $1M ARR in 18 Months

Working backward from $1M ARR:
- At $3,000 average deal: **333 customers**
- In 18 months: ~18 new customers/month
- At 20% close rate on consultations: 90 consultations/month
- At 5% consult rate from leads: 1,800 leads/month
- At 12% lead rate from audits: 15,000 audits/month
- At 35% audit completion from visits: 42,000 visits/month

**42,000 visits/month in 18 months** is achievable with:
1. SEO content: "cursor vs copilot cost" type articles (5–10k/month organic by month 6)
2. Viral sharing of audit results on Twitter/LinkedIn (each shared audit = 50–500 views)
3. Referral loop: high-savings users are motivated to share — they look smart
4. Credex's existing customer base: upsell SpendLens audit to every existing Credex customer as a free benefit

Higher-probability path to $1M ARR:
- Increase average deal size to $10,000 by focusing on 50–200 person companies
- At $10,000 avg: only 100 customers needed
- 100 customers at 20% close rate = 500 consultations = 10,000 leads = 83,000 audits
- Still achievable with strong HN/viral distribution + Credex's existing network

**The single most important lever**: Average deal size. If Credex can move upmarket to $50k+ contracts, $1M ARR requires only 20 customers — achievable from the first 6 months of serious outreach.

---

## Rough Unit Economics Summary

| Metric | Conservative | Optimistic |
|---|---|---|
| Average deal size | $3,000/year | $15,000/year |
| Gross margin | 20% | 25% |
| GP per customer | $600/year | $3,750/year |
| Payback period | Immediate (no CAC) | Immediate |
| LTV (3yr retention) | $1,800 | $11,250 |
| Customers for $1M ARR | 333 | 67 |
| Audits needed/month at maturity | 15,000 | 3,000 |

The tool economics are extremely favorable because marginal cost per audit is near zero — it's a serverless compute cost of <$0.01 per audit at current scale.
