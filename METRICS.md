# METRICS.md — Success Metrics for SpendLens

## North Star Metric

**Audits completed per week**

Why: SpendLens is a top-of-funnel lead-gen tool. Every audit completed is a potential Credex lead and a potential share event. "Audits completed" directly captures whether the tool is being used for its core purpose — it ignores vanity (page views) and is upstream of downstream outcomes (leads, consultations, revenue). A week with 500 audits is unambiguously better than a week with 50.

It's not leads captured — because we believe in showing value before asking. If we optimize for leads, we might move the email gate earlier and destroy trust. Audits completed keeps us honest about actual utility delivered.

---

## 3 Input Metrics That Drive the North Star

### 1. Form completion rate (started → completed audit)

**Formula:** `Audits completed / Audit form opens`  
**Target:** ≥75%  
**Why:** If people open the form but abandon it, the form is too long, confusing, or the value proposition isn't clear. This is the clearest signal of product-market fit at the micro level.

**What to fix if low:**
- Reduce form fields
- Add "typical team saves $X" social proof in the form flow
- Show a progress indicator (we already have 2-step flow with step indicator)

### 2. Audit-to-lead conversion rate (completed audit → email captured)

**Formula:** `Email leads / Audits completed`  
**Target:** ≥10%  
**Why:** Shows whether the audit result is valuable enough that users want to save/share it. If this is low, either the savings numbers are too small (product issue) or the lead capture friction is too high (UX issue).

**What to fix if low:**
- Delay the modal (currently 4 seconds — try 8 seconds)
- Add more specificity to the email CTA ("Get this sent to your CFO's inbox")
- A/B test "Save report" vs "Send me the breakdown"

### 3. 7-day unique return visitors to shared audit URLs

**Formula:** `Unique visits to /audit/[id] URLs from non-original user`  
**Target:** ≥15% of audits have at least 1 external viewer  
**Why:** This measures the viral coefficient of the share loop. If nobody's sharing their audit URL, the results page isn't compelling enough to share — or the share copy isn't interesting. This is the free growth flywheel.

**What to fix if low:**
- Make the hero savings number bigger (more screenshot-worthy)
- Pre-populate tweet text with a stronger hook
- Add "See how you compare to teams your size" to incentivize sharing

---

## What to Instrument First

Priority order:

1. **Audit form: step transitions** — track "started step 1", "started step 2", "submitted" with tool count and total spend. Instant funnel visibility.
2. **Result page: time-on-page** — if users leave in <10 seconds, the results aren't compelling.
3. **Lead modal: open rate and submission rate** — is the modal showing? Is it converting?
4. **Share button clicks** — leading indicator of viral loop health.
5. **Shared URL unique visitors** — lags by 24–48 hours but is the real viral metric.

**Tool:** PostHog (free up to 1M events/month, self-hosted option available, open source). Not Google Analytics — PostHog gives per-user event funnels without sampling.

---

## Pivot Trigger Number

**< 50 audits completed in the first 14 days after a real HN or IH post.**

This means the top-of-funnel messaging is broken — either people aren't landing on the page, or they're landing and immediately leaving. At this point:

1. Check Clarity / Hotjar for exit behavior (is the hero compelling?)
2. Check if the HN post got traction (front page = signal; buried = distribution problem, not product problem)
3. If HN front page + <50 audits: landing page copy is the problem. Rewrite and repost.
4. If HN didn't get traction: try r/ExperiencedDevs or indie hackers directly.

**Do NOT pivot the product** based on <14 days of data from a single distribution channel. The pivot trigger is about distribution validation, not product validation.

Secondary trigger: If lead-to-consultation rate is <1% after 100+ leads, the Credex consultation pitch needs revision — either the savings thresholds are wrong or the CTA copy isn't compelling.
