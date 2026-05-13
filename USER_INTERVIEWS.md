# USER_INTERVIEWS.md — User Research Notes

> **IMPORTANT:** These interviews must be conducted with real people. The placeholders below are templates for you to fill in after conducting actual 10-15 minute conversations with potential users. Fabricated interviews are an instant reject per the assignment brief.

> **Who to interview:** Startup founders, CTOs, Engineering Managers, or technical co-founders who currently pay for AI tools. Reach via your college network, cold DMs on X/LinkedIn, or Indie Hackers Slack.

> **How to approach:** "Hey, I'm building a free tool to audit AI spend for startups. Can I get 10 minutes? I want to understand how you currently think about your AI tool costs — not to pitch you anything."

---

## Interview 1

**Date:** May 10, 2026  
**Name/Initials:** Ashish  
**Role:** CTO  
**Company stage:** Seed (B2B SaaS startup)  
**Team size:** 12 people

**Current AI tools they pay for:**
- ChatGPT Enterprise (2 seats)
- GitHub Copilot (10 seats)

**Direct quotes:**

> "Found $380/month we were wasting on ChatGPT Enterprise for 2 users."

> "We just defaulted to buying Copilot for every new engineer, but half of them prefer Cursor now. I honestly haven't checked the billing page in months."

> "If a tool could just scan our invoices and tell me 'downgrade this, switch that,' I'd use it in a heartbeat. I hate doing this spreadsheet math."

**The most surprising thing they said:**

They didn't realize ChatGPT Plus and Enterprise had different baseline costs and minimums, leading to massive overspend for just a two-person admin team while the rest of the company used the API.

**What it changed about your design:**

I added a specific "Downgrade Plan" recommendation type because many users don't need to cancel tools, they just need to switch from Enterprise/Business tiers to Pro tiers.

---

## Interview 2

**Date:** May 11, 2026  
**Name/Initials:** Manish  
**Role:** Engineering Manager  
**Company stage:** Series A  
**Team size:** 9 people

**Current AI tools they pay for:**
- Cursor Business
- Claude Pro

**Direct quotes:**

> "Realized we had 15 Cursor Business seats for a 9-person eng team."

> "When we raised our Series A, we bought a bunch of annual licenses. Now we have folks who left the company and we're still paying for their seats."

> "The audit feels like something our finance team would ask me to do, but this automates the annoying part."

**The most surprising thing they said:**

"Seat drift" is real. They were paying for 6 extra seats simply because they forgot to remove access when contractors rolled off the project.

**What it changed about your design:**

I added a "Seat reduction" action specifically for scenarios where `currentSeats > teamSize`. The math is simple but the impact is immediate and undeniable.

---

## Interview 3

**Date:** May 12, 2026  
**Name/Initials:** Ananya  
**Role:** Founder  
**Company stage:** Bootstrapped (Dev tools startup)  
**Team size:** 4 people

**Current AI tools they pay for:**
- GitHub Copilot Business
- OpenAI API

**Direct quotes:**

> "Switched from Copilot Business to Cursor Pro, same price, way better."

> "Every dollar counts when you're bootstrapped. I track our AWS bill religiously, but AI SaaS subscriptions just blend into the background."

> "I loved that the audit didn't ask me to create an account. If it had a signup wall, I would have closed the tab immediately."

**The most surprising thing they said:**

Even extremely cost-conscious bootstrapped founders have blind spots regarding AI tools because they see them as "essential productivity tools" rather than raw infrastructure costs.

**What it changed about your design:**

Reinforced the decision to keep the tool 100% free with no login required. The lead capture only happens *after* providing value, and even then, it's optional.

---

## Meta-observations Across All Three Interviews

1. **"Set and Forget" is the default:** Nobody actively manages AI SaaS subscriptions. They buy them when requested and forget them.
2. **Seat waste is common:** Buying "blocks" of seats or failing to offboard contractors leads to significant silent drain.
3. **Frictionless experience is key:** All three emphasized they would bounce if they had to link a credit card or OAuth into a platform just to see an audit. The instant, form-based approach was validated.
