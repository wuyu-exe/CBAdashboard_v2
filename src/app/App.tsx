import { useState, useRef, useEffect } from "react";
import {
  ChevronDown, ChevronUp, Search, X, BookOpen, Users, Building2,
  Handshake, FileText, Gavel, ArrowRight, ArrowLeft, CheckSquare,
  Download, ExternalLink, HelpCircle, MessageSquare, Heart, Shield,
  Leaf, Home, Briefcase, GraduationCap, DollarSign, Truck, Star,
  Baby, CheckCircle, XCircle, Sparkles, MapPin, Database,
} from "lucide-react";

// ─── Palette tokens (homey / earthy) ────────────────────────────────────────
const P = {
  cream: "#FAF7F0",
  brown: "#3D2B1F",
  terra: "#C97B54",
  sage: "#6B9B7A",
  rose: "#C0676B",
  gold: "#D4A843",
  lavender: "#9580B8",
  teal: "#4E8FA0",
  warmBlue: "#5B7EBD",
  muted: "#8B7355",
  border: "rgba(61,43,31,0.13)",
  cardBg: "#FFFFFF",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type PageId = "what-is" | "can-do" | "cannot-do" | "why-want" | "benefit-cats" | "who-for" | "how-to";
interface StepSubItem { title: string; description: string; checklist?: string[]; type?: "example" | "template" | "worksheet"; }
interface Step { id: number; slug: string; label: string; tagline: string; color: string; textColor: string; bgLight: string; subItems: StepSubItem[]; }
interface ResourceItem { title: string; type: "template" | "case-study" | "external" | "worksheet"; step: string; description: string; tags: string[]; }
interface GlossaryTerm { term: string; abbr?: string; definition: string; }
interface BenefitCategory { id: string; label: string; icon: React.ReactNode; color: string; description: string; examples: string[]; }

// ─── Benefit categories data ─────────────────────────────────────────────────
const BENEFIT_CATEGORIES: BenefitCategory[] = [
  { id: "childcare", label: "Childcare", icon: <Baby size={15} />, color: P.gold, description: "Subsidized childcare, on-site facilities, or childcare funds for affected families.", examples: ["On-site childcare center", "Subsidy vouchers for local families", "After-school program funding"] },
  { id: "community-investment", label: "Community Investment", icon: <Heart size={15} />, color: P.rose, description: "Funds or programs directed toward community needs. Can include direct payments to affected residents or community benefit funds tied to the scale and duration of project impacts.", examples: ["$250K annual community fund", "Cultural center construction", "Public art installations"] },
  { id: "direct-finances", label: "Direct Finances", icon: <DollarSign size={15} />, color: P.sage, description: "Lump-sum or recurring payments to individual landowners, residents, or the municipality — tied to the scale and duration of project impacts.", examples: ["Host community annual payments", "Lump-sum infrastructure grant", "Revenue sharing"] },
  { id: "education", label: "Education", icon: <GraduationCap size={15} />, color: P.lavender, description: "Scholarships, STEM partnerships, vocational training, and school facility improvements.", examples: ["10 annual scholarships", "STEM lab partnership", "Vocational training program"] },
  { id: "environment", label: "Environment & Sustainability", icon: <Leaf size={15} />, color: P.sage, description: "Mitigation of short-term construction impacts (dust, noise, traffic) AND long-term operational harms (noise, groundwater, habitat loss). This is often the most critical part of the CBA.", examples: ["Air quality monitors + quarterly data", "Stormwater improvements", "Habitat buffer creation"] },
  { id: "housing", label: "Affordable Housing", icon: <Home size={15} />, color: P.teal, description: "Affordable housing units, trust fund contributions, and anti-displacement protections.", examples: ["10% units at 60% AMI", "Housing trust fund contribution", "Anti-displacement fund"] },
  { id: "landowner", label: "Landowner Protections", icon: <Shield size={15} />, color: "#B45309", description: "Compensation and protections for adjacent landowners — direct payments, easements, impact fees — calculated based on the scale and nature of project impacts.", examples: ["Property value guarantees", "Noise buffer requirements", "Fishery access agreements"] },
  { id: "local-business", label: "Local Business", icon: <Briefcase size={15} />, color: P.terra, description: "Contracting requirements favoring local and minority-owned businesses.", examples: ["30% local procurement", "MWBE participation goals", "Small business support fund"] },
  { id: "local-hiring", label: "Local Hiring", icon: <Users size={15} />, color: P.warmBlue, description: "Local and diverse hiring requirements tied to project milestones, including living wage and apprenticeship commitments.", examples: ["30% local construction hires", "Living wage requirements", "Apprenticeship programs"] },
  { id: "safety", label: "Safety", icon: <Shield size={15} />, color: P.lavender, description: "Traffic mitigation, lighting, emergency access, and safety commitments.", examples: ["Traffic signal upgrades", "Site lighting requirements", "Emergency response plans"] },
  { id: "traffic", label: "Traffic & Transportation", icon: <Truck size={15} />, color: P.terra, description: "Mitigation of short-term construction traffic AND long-term operational traffic impacts on local roads.", examples: ["Road improvement fund", "Off-peak construction hours", "Transit shuttle service"] },
  { id: "specialized", label: "Specialized / Project-Specific", icon: <Star size={15} />, color: P.teal, description: "In-kind and unique benefits — reduced energy rates for local residents, co-ownership opportunities, agricultural use of land under solar panels.", examples: ["Reduced energy rates for locals", "Co-ownership & profit sharing", "Agricultural use under solar panels"] },
];

// ─── Steps data ──────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    id: 1, slug: "prepare", label: "Prepare", tagline: "What communities and municipalities should do before any negotiation begins",
    color: "#C97B54", textColor: "#ffffff", bgLight: "#FDF5EE",
    subItems: [
      { title: "Understand the Project Context", description: "Before discussing benefits, get clear on what the developer needs — permits, zoning approvals, subsidies, or community support. That's your leverage. Clarify which impacts are short-term (construction-phase) and which are long-term (operational or environmental), since each requires different mitigation and benefit commitments.", checklist: ["Review the developer's permit applications and zoning requests", "Ask for a project timeline and funding source information", "Research the developer's previous CBAs in other towns", "Document short-term impacts (traffic, noise, dust during construction) and long-term impacts (emissions, habitat, groundwater over project lifetime)", "Identify which environmental impacts require mitigation — short-term construction and long-term operational harms that may persist for decades", "Identify which impacts may require compensation to individual landowners/residents (easements, noise) or the municipality (impact fees, infrastructure)", "Confirm ownership structure and future transfer plans"], type: "worksheet" },
      { title: "Identify Stakeholders & Build a Representative Team", description: "A CBA is only as strong as the people at the table. The most successful agreements come from broad, inclusive coalitions. Consider: local boards, municipal staff, residents (owners, renters, unhoused), EJ groups, faith and cultural groups, youth and elder advocates, regional planning agencies, and tribes.", checklist: ["Map stakeholders visually, listing who is affected and who holds decision power", "Invite representatives from underrepresented groups early", "Establish clear roles within the coalition", "Create a shared contact list and meeting schedule", "Draft a coalition agreement outlining decision-making rules"] },
      { title: "Define Community Priorities Early", description: "Don't start with what the developer offers. Start with what your community actually needs. Include both short-term needs (during construction) and long-term needs (over the project's full lifespan). Translate broad goals into measurable outcomes.", checklist: ["Use surveys or listening sessions to identify top concerns", "Rank priorities using a scoring matrix (impact, feasibility, urgency)", "Translate broad goals into measurable outcomes (e.g., X% local hires within 2 years)", "Include compensation for impacts (to landowners, residents, or the municipality)", "Include environmental mitigation — short-term and long-term", "Document essential vs. negotiable benefits"], type: "worksheet" },
      { title: "Assess Your Capacity & Identify Support Needs", description: "Communities often walk into negotiations at a disadvantage. Participating effectively often involves costs — legal review, technical analysis, facilitation, translation, and community outreach. Explore state intervenor funding, pro bono legal clinics, or ask the developer to contribute to a community foundation.\n\n⚖ Note on Legal Liability & SLAPP Protections: Community members who participate in public processes are generally protected under state and federal free-speech laws. Many states have anti-SLAPP statutes that quickly dismiss intimidation lawsuits filed by developers. Individual residents typically do not incur personal liability for engagement. Seek legal advice if threatened.", checklist: ["Contact local universities for pro bono legal or planning assistance", "Reach out to state EJ offices for technical help with environmental review", "Identify potential funding sources (state intervenor funding, municipal support, philanthropic grants, developer-funded community foundations)", "Identify funding for community consultants or translators", "Schedule capacity check-ins every few months"], type: "template" },
      { title: "Bring in a Neutral Facilitator or Mediator", description: "A neutral facilitator convenes all the right people, sets ground rules, builds a shared fact base, and prevents power imbalances from derailing negotiations. Agreements reached through facilitated processes tend to be more durable. Note: Neutral facilitation may involve costs, which can sometimes be covered through state technical assistance programs or developer-funded community foundations.", checklist: ["Choose someone with experience in land-use or public-sector negotiation", "Verify neutrality (no ties to the developer)", "Ask them to draft ground rules and a shared fact-finding plan", "Use structured agendas and time limits to keep meetings productive", "Ensure the facilitator documents agreements and distributes summaries"] },
    ],
  },
  {
    id: 2, slug: "engage", label: "Engage", tagline: "How to build meaningful, inclusive, and effective community engagement before negotiations begin",
    color: "#6B9B7A", textColor: "#ffffff", bgLight: "#F0F7F2",
    subItems: [
      { title: "Start Engagement Early and Make It Continuous", description: "Communities need to be involved before major decisions are made — not after the project is already designed. Engagement should surface concerns about both short-term construction impacts and long-term operational impacts, since these shape different types of commitments. Communities should also anticipate costs of inclusive engagement and identify funding sources early.", checklist: ["Begin outreach at least two months before permit submission", "Maintain updates through newsletters or a project webpage", "Host quarterly community briefings during construction and operation", "Identify funding for engagement costs (translation, childcare, stipends, meeting logistics)"] },
      { title: "Make Engagement Inclusive and Accessible", description: "People most affected by a project are often least likely to be at the table. Hold meetings at accessible locations, schedule at times that work for working families, provide childcare and translation, and use multiple outreach channels.", checklist: ["Consider providing childcare and food at meetings", "Offer interpretation in languages spoken locally", "Use multiple formats (in-person, virtual, pop-up)", "Partner with trusted local organizations to co-host sessions", "Identify funding for engagement supports (translation, childcare, food, stipends) through state programs or developer-funded community foundations"] },
      { title: "Map the Community and Identify Who Needs to Be at the Table", description: "Engagement starts with understanding who is affected and who has been historically excluded. Groups to consider: residents, EJ communities, neighborhood associations, faith-based groups, youth and elder advocates, local businesses, unions, tribes, municipal boards.", checklist: ["Create a stakeholder map showing influence and impact", "Use demographic data to ensure EJ community representation"] },
      { title: "Create a Clear, Transparent Engagement Plan", description: "A strong engagement plan sets expectations and builds trust. It should explain goals, outreach strategies, timeline, language access supports, how input will be collected and used, and how results will be shared back.", checklist: ["Publish the plan online and in print", "Include a timeline of engagement milestones", "Define how feedback will be incorporated into project design", "Assign responsibility for follow-up communication"], type: "template" },
      { title: "Document What You Hear and Show How It Shapes the Project", description: "Communities need to see that their input matters. Track all comments, identify recurring themes. Categorize feedback into short-term impacts (construction disruptions) and long-term impacts (environmental, health, or quality-of-life effects). Note concerns about impacts that may warrant compensation (property value changes, noise, traffic, loss of use).", checklist: ["Use a comment-tracking spreadsheet (theme, response, action taken)", "Summarize findings in plain-language reports", "Present examples to demonstrate responsiveness (\"You said, We did\")", "Archive all materials for future monitoring"] },
    ],
  },
  {
    id: 3, slug: "negotiate", label: "Negotiate", tagline: "Designing a fair, transparent, and enforceable negotiation process",
    color: "#9580B8", textColor: "#ffffff", bgLight: "#F5F3FB",
    subItems: [
      { title: "Sample Negotiation Timelines", description: "Successful CBAs follow a predictable sequence. Phase 1 — Pre-Negotiation (2–6 weeks): coalition alignment, ground rules. Phase 2 — Issue Identification (2–8 weeks): priorities, developer constraints, compensation needs for short-term construction impacts and long-term operation impacts, identify expected costs of technical analysis or legal review. Phase 3 — Option Development (4–12 weeks): evaluate options separately for short-term and long-term impacts; evaluate compensation options (direct payments, easements, impact fees) using comparable agreements as benchmarks; evaluate mitigation options using EIA findings and technical studies. Phase 4 — Drafting & Closure (2–6 weeks). Phase 5 — Implementation Planning (1–4 weeks).", checklist: ["Include estimated durations for each phase and responsible parties", "Use shared calendars to track deadlines", "Schedule debriefs after each phase to review progress"] },
      { title: "Guidance on Neutral Facilitation", description: "Neutral facilitation is one of the strongest predictors of enforceable agreements. A facilitator levels the playing field, supports joint fact-finding, and helps translate broad commitments into implementable terms.", checklist: ["Facilitators should prepare joint fact-finding summaries before each meeting", "Use consensus-building techniques like interest-based negotiation", "Consider rotating meeting chairs to balance participation"] },
      { title: "Meeting Facilitation Guides", description: "Before: circulate agenda and ground rules. During: begin with ground rules restatement, use structured rounds, track issues visually. After: distribute summary within 48 hours, identify next steps.", checklist: ["Begin with a brief recap of previous agreements", "Use visual aids to track issues", "End each meeting with a written summary and next-step assignments"], type: "template" },
      { title: "Negotiation Preparation Worksheet", description: "Enter negotiations with clarity on your interests and priorities, constraints and opportunities, information needs, draft benefit concepts, and enforcement preferences. Include compensation needs and mitigation measures for both short-term construction and long-term operational impacts.", checklist: ["Identify which impacts require compensation and who should receive it", "Potential compensation mechanisms (direct payments, easements, impact fees, community funds)", "Identify required mitigation measures for short-term and long-term impacts", "Short-term mitigation measures and long-term monitoring or mitigation strategies", "Specify enforcement penalties and reporting intervals", "Receive coalition sign-off before entering formal talks"], type: "worksheet" },
      { title: "Understanding Power Dynamics", description: "Developers have greater financial and legal resources, control over timelines, and may frame impacts narrowly. Communities should request data that distinguishes short-term construction impacts from long-term operational harms. Communities may also need expert support to estimate fair compensation for impacts, since developers often control valuation data.", checklist: ["Counter developer advantages by pooling community resources", "Use media coverage strategically to maintain transparency", "Document all offers and counter-offers to prevent misrepresentation", "Seek neutral technical experts for compensation and mitigation analysis", "Request data distinguishing short-term construction impacts from long-term operational harms"] },
    ],
  },
  {
    id: 4, slug: "draft", label: "Draft", tagline: "Translate negotiated commitments into clear, enforceable, durable language",
    color: "#D4A843", textColor: "#3D2B1F", bgLight: "#FDF8ED",
    subItems: [
      { title: "CBA Structure Template", description: "A strong CBA includes: (A) Preamble / Purpose, (B) Definitions, (C) Benefit Commitments — each with specific deliverable, timeline, responsible party, and reporting requirements, (D) Implementation & Monitoring, (E) Dispute Resolution, (F) Enforcement with successor/assigns clause, (G) Term & Amendments, (H) Signatures.", checklist: ["Use consistent numbering and defined terms throughout", "Include appendices for data reporting formats", "Require signatures from all parties and witnesses"], type: "template" },
      { title: "Menu of Example Benefits", description: "Workforce: local hiring, living wage, apprenticeships, MWBE participation. Environmental: short-term construction mitigation (dust, noise, traffic) AND long-term operational mitigation (noise buffers, groundwater, habitat). Compensation: direct payments to affected landowners/residents, impact fees, community benefit funds. Education: scholarships, STEM. Housing: affordable units, trust funds. In-kind: reduced energy rates, co-ownership, agricultural use of project land.", checklist: ["Local hiring ex: 30% of construction jobs for residents within 10 miles", "Environmental ex: Air quality monitors + quarterly data through project lifetime", "Compensation ex: Annual payments to landowners tied to operational noise levels", "In-kind ex: Reduced monthly energy bills for residents within 2 miles"] },
      { title: "Model Clauses (Benefits, Reporting, Enforcement)", description: "Benefit Delivery: 'The Developer shall provide [specific benefit] by [date].' Reporting: quarterly progress reports, publicly accessible. Monitoring Committee: meets regularly to review compliance. Notice and Cure: 30–90 day cure period. Successor Clause: all obligations bind successors for project duration.", checklist: ["Include deadlines and documentation requirements in each clause", "Specify who verifies completion (committee, agency, third party)", "Ensure dispute-resolution timelines are realistic (30–60 days)"] },
      { title: "Checklist for Enforceability", description: "Before signing, verify: Clarity & Specificity (each benefit measurable, timelines explicit, responsible parties named). Monitoring & Oversight (committee established, reporting schedule, data access guaranteed). Dispute Resolution (notice and cure, mediation option). Legal Enforceability (enforceable in court, performance bond, successor clause). Durability (term defined, amendment process specified, provisions survive ownership changes).", checklist: ["Review checklist jointly with legal counsel before signing", "Store signed copies with municipality and/or coalition", "Schedule annual reviews to confirm ongoing compliance"], type: "worksheet" },
      { title: "Common Drafting Mistakes", description: "Avoid: vague language ('will seek to hire locally'), missing timelines, no monitoring structure, no successor clause, overreliance on goodwill, overly complex benefit packages, and no amendment procedure.", checklist: ["Conduct a 'plain-language audit' to remove ambiguous terms", "Cross-reference all benefits with monitoring sections", "Include amendment procedures to adapt to project changes"] },
    ],
  },
  {
    id: 5, slug: "monitor", label: "Monitor", tagline: "Ensure commitments are implemented, tracked, and publicly accountable",
    color: "#4E8FA0", textColor: "#ffffff", bgLight: "#EEF6F9",
    subItems: [
      { title: "Monitoring Frameworks", description: "The strongest frameworks share four core components: clear responsibilities, regular reporting, transparent review, and escalation pathways. Options: (A) Developer Self-Reporting — simple but risks selective reporting. (B) Joint Monitoring Committee — shared oversight, highly effective. (C) Third-Party Independent Monitoring — independence and expertise. (D) Public Agency Monitoring — regulatory authority. (E) Hybrid Models — redundancy and resilience.", checklist: ["Developer self-reporting ex: Quarterly progress reports with metrics and photos", "Joint committee ex: Meet bi-monthly, publish minutes online", "Independent monitoring ex: Hire consultant for annual compliance audits", "Hybrid model ex: Combine community review with independent oversight"] },
      { title: "Monitoring Committee Structure", description: "Monitoring committees are one of the strongest predictors of successful enforcement. Composition: 2–5 community reps, 1–2 developer reps, optional municipal staff, optional independent expert. Committees without authority tend to dissolve (see Hunter's Point).", checklist: ["Include equal representation from community, developer, and municipality", "Choose a chair and secretary for record-keeping", "Define quorum and voting procedures", "Establish a public comment period for each meeting"] },
      { title: "Reporting Form Template", description: "Sections: (1) Summary of Progress, (2) Benefit Delivery Status table, (3) Workforce & Hiring, (4) Environmental & Mitigation Measures (short-term construction AND long-term operational), (5) Financial Commitments and Compensation Payments, (6) Community Investments, (7) Issues or Non-Compliance, (8) Attachments.", checklist: ["Require supporting documentation (receipts, photos, permits)", "Publish reports on municipal or coalition websites"], type: "template" },
    ],
  },
  {
    id: 6, slug: "enforce", label: "Enforce", tagline: "Activate the tools that ensure commitments are delivered and know when to escalate",
    color: "#C0676B", textColor: "#ffffff", bgLight: "#FDF0F0",
    subItems: [
      { title: "Enforcement Pathways", description: "Enforcement follows four stages: (A) Informal Resolution — direct communication, adjusted timelines. (B) Notice and Cure — written notice, 30–90 day cure period, committee verifies. (C) Mediation or Arbitration — faster and cheaper than litigation, keeps relationships intact. (D) Legal Enforcement (last resort) — specific performance, injunctive relief, financial penalties, performance bonds.", checklist: ["Track every enforcement step in a shared log", "Use a standard Notice and Cure form to document issues clearly", "Set calendar reminders for cure periods and mediation dates", "Keep all correspondence in one folder for quick reference", "Confirm who has authority to initiate each stage before enforcement begins"] },
      { title: "Examples of Successful Enforcement", description: "Block Island Wind Farm (RI): Clear reimbursement clause + full-time liaison → developer paid cable repair without litigation. Calverton Solar (NY): CBA embedded in municipal approval + town withheld occupancy certificate → all commitments completed. Detroit CBO: City penalty authority + public reporting → multiple projects corrected non-compliance. NECEC (ME): Third-party fund administration → benefits continued despite legal challenges. Hunter's Point (SF): Oversight collapsed after ACORN dissolved — monitoring bodies must be durable and independent.", type: "example" },
      { title: "When to Seek Legal Support", description: "Legal support is most valuable early, when issues are still fixable. Seek support when: developer repeatedly misses deadlines, cure periods expire unresolved, ownership changes, developer disputes clause meaning. Seek IMMEDIATE support when: developer refuses to comply, a benefit is at risk of disappearing, environmental harms are occurring, or the developer challenges enforceability.", checklist: ["Contact a legal clinic or municipal attorney as soon as repeated non-compliance occurs", "Gather all relevant documentation before meeting with counsel", "Ask legal advisors to confirm successor obligations and enforcement options annually"] },
    ],
  },
];

const RESOURCES: ResourceItem[] = [
  { title: "Community Priorities Worksheet", type: "worksheet", step: "Prepare", description: "Identify and rank community needs before negotiations begin.", tags: ["prepare", "community", "planning"] },
  { title: "Community Readiness Checklist", type: "template", step: "Prepare", description: "Assess your coalition's legal, technical, and organizational capacity.", tags: ["prepare", "capacity"] },
  { title: "Stakeholder Mapping Template", type: "template", step: "Prepare", description: "Visually map who is affected and who holds decision power.", tags: ["prepare", "stakeholders"] },
  { title: "Engagement Plan Template", type: "template", step: "Engage", description: "Structured plan for inclusive, transparent community outreach.", tags: ["engage", "outreach"] },
  { title: "Comment Tracking Spreadsheet", type: "template", step: "Engage", description: "Track community input by theme, response, and action taken.", tags: ["engage", "documentation"] },
  { title: "Negotiation Preparation Worksheet", type: "worksheet", step: "Negotiate", description: "Clarify interests, constraints, and enforcement preferences before talks.", tags: ["negotiate", "planning"] },
  { title: "Meeting Facilitation Guide", type: "template", step: "Negotiate", description: "Before/during/after meeting checklist for productive CBA negotiations.", tags: ["negotiate", "facilitation"] },
  { title: "CBA Structure Template", type: "template", step: "Draft", description: "Full legal structure from preamble to signatures with all key sections.", tags: ["draft", "legal"] },
  { title: "Enforceability Checklist", type: "worksheet", step: "Draft", description: "Verify clarity, monitoring, dispute resolution, and legal enforceability.", tags: ["draft", "enforcement"] },
  { title: "CBA Reporting Form Template", type: "template", step: "Monitor", description: "Standardized quarterly reporting with all required sections.", tags: ["monitor", "reporting"] },
  { title: "Notice and Cure Form", type: "template", step: "Enforce", description: "Document non-compliance formally and track cure period deadlines.", tags: ["enforce", "legal"] },
  { title: "Block Island Wind Farm Case Study", type: "case-study", step: "Enforce", description: "Rhode Island offshore wind CBA — successful reimbursement clause and community liaison model.", tags: ["case-study", "renewable-energy", "enforce"] },
  { title: "Calverton Solar Energy Center Case Study", type: "case-study", step: "Enforce", description: "New York solar CBA embedded in municipal approval — regulatory enforcement success.", tags: ["case-study", "solar", "enforce", "monitor"] },
  { title: "Detroit Community Benefits Ordinance Case Study", type: "case-study", step: "Enforce", description: "City-mandated CBA process with institutionalized enforcement and public reporting.", tags: ["case-study", "urban", "municipal"] },
  { title: "Hunter's Point Shipyard Case Study (Cautionary)", type: "case-study", step: "Monitor", description: "San Francisco CBA where oversight collapsed — key lessons on durability.", tags: ["case-study", "cautionary", "monitor"] },
  { title: "NECEC Maine Case Study", type: "case-study", step: "Monitor", description: "Maine transmission line CBA with independent fund administration that survived legal challenges.", tags: ["case-study", "renewable-energy", "monitor"] },
  { title: "Offshore Wind CBAs in California (Berkeley Law)", type: "external", step: "Prepare", description: "Comprehensive analysis of offshore wind community benefits agreements.", tags: ["external", "renewable-energy", "research"] },
  { title: "Community Benefits Agreements Case Studies (CATF)", type: "external", step: "Prepare", description: "Federal guidelines and best practices for community benefits agreements.", tags: ["external", "research", "federal"] },
  { title: "CBA Database", type: "external", step: "Prepare", description: "Searchable database of community benefits agreements nationwide.", tags: ["external", "research", "database"] },
  { title: "Wind Energy Community Benefits Guide (DOE)", type: "external", step: "Engage", description: "DOE guide to community benefits in wind energy projects.", tags: ["external", "renewable-energy", "federal"] },
];

const GLOSSARY: GlossaryTerm[] = [
  { term: "Community Benefits Agreement", abbr: "CBA", definition: "A legally binding contract between a developer and a community coalition or municipality that outlines specific benefits the developer must deliver in exchange for community support or non-opposition to a project." },
  { term: "Community Benefit Plan", abbr: "CBP", definition: "A non-binding plan required in some federal funding applications (e.g., DOE) that outlines how a project will engage and benefit local communities." },
  { term: "Cumulative Impact Analysis", abbr: "CIA", definition: "An assessment of cumulative environmental and social burdens required for certain energy infrastructure projects under Massachusetts state law." },
  { term: "Environmental Impact Assessment", abbr: "EIA", definition: "A study required by most states and sometimes by federal law (NEPA) that evaluates a project's environmental effects. EIA findings are a key source of data for CBA negotiations." },
  { term: "Environmental Justice", abbr: "EJ", definition: "Principles ensuring meaningful involvement and equitable distribution of environmental benefits and burdens regardless of race, income, or other protected characteristics." },
  { term: "Host Community Agreement", abbr: "HCA", definition: "An agreement — sometimes legally required — between a developer and a municipality that functions similarly to a CBA. Some states require HCAs under different names." },
  { term: "Meaningful Engagement", definition: "Early, continuous, accessible, culturally competent engagement that genuinely informs decision-making — not a one-off meeting or box-checking exercise." },
  { term: "Monitoring Committee", definition: "A body of community, developer, and sometimes municipal representatives that reviews compliance reports, requests documentation, and issues findings on a regular schedule." },
  { term: "Notice and Cure", definition: "A formal non-adversarial enforcement mechanism where a written notice of non-compliance is issued and the developer has a defined period (typically 30–90 days) to correct the breach." },
  { term: "SLAPP Suit", definition: "Strategic Lawsuit Against Public Participation — a lawsuit filed to intimidate community activists. Many states now have anti-SLAPP statutes that quickly dismiss these suits and require developers to pay legal fees." },
  { term: "Successor Clause", definition: "A CBA provision ensuring that all obligations bind future owners or operators of the project for its duration — preventing benefits from disappearing when ownership changes." },
  { term: "Performance Bond", definition: "A financial instrument that can be drawn upon if the developer fails to meet specific commitments, providing enforceable financial backing for CBA obligations." },
];

// ─── Shared sub-components (steps/resources/glossary — unchanged) ─────────────

function StepModule({ step, defaultOpen = false }: { step: Step; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [openItems, setOpenItems] = useState<number[]>([0]);
  const toggleItem = (idx: number) => setOpenItems(p => p.includes(idx) ? p.filter(i => i !== idx) : [...p, idx]);
  const typeLabel: Record<string, string> = { template: "Template available", worksheet: "Worksheet available", example: "Case examples" };
  const typeBadgeColor: Record<string, string> = { template: P.warmBlue, worksheet: P.lavender, example: P.sage };
  return (
    <div className="rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md" style={{ borderColor: step.color + "40" }}>
      <button className="w-full flex items-center justify-between px-6 py-5 transition-colors duration-200" style={{ backgroundColor: open ? step.color : step.bgLight }} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.3)", color: open ? "#fff" : step.color, border: open ? "none" : `2px solid ${step.color}`, fontFamily: "DM Mono, monospace" }}>{step.id}</div>
          <div className="text-left">
            <div className="font-bold text-xl" style={{ fontFamily: "Playfair Display, serif", color: open ? "#fff" : step.color }}>Step {step.id}: {step.label}</div>
            <p className="text-sm mt-0.5" style={{ color: open ? "rgba(255,255,255,0.8)" : P.muted }}>{step.tagline}</p>
          </div>
        </div>
        <div style={{ color: open ? "#fff" : step.color }}>{open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</div>
      </button>
      {open && (
        <div className="p-6 space-y-3" style={{ backgroundColor: step.bgLight }}>
          {step.subItems.map((item, idx) => (
            <div key={idx} className="rounded-xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: step.color + "25" }}>
              <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" onClick={() => toggleItem(idx)}>
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: step.color }}>{idx + 1}</span>
                  <span className="font-semibold" style={{ color: P.brown, fontFamily: "Nunito, sans-serif" }}>{item.title}</span>
                  {item.type && <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: typeBadgeColor[item.type] }}>{typeLabel[item.type]}</span>}
                </div>
                <span className="text-gray-400 ml-2 shrink-0">{openItems.includes(idx) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
              </button>
              {openItems.includes(idx) && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: step.color + "20" }}>
                  <p className="text-sm leading-relaxed mt-4 whitespace-pre-line" style={{ color: P.brown }}>{item.description}</p>
                  {item.checklist && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: P.muted }}>Action Checklist</p>
                      {item.checklist.map((check, ci) => (
                        <div key={ci} className="flex items-start gap-2.5">
                          <CheckSquare size={14} className="mt-0.5 shrink-0" style={{ color: step.color }} />
                          <span className="text-sm" style={{ color: P.brown }}>{check}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.type && (
                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: step.color }}>
                      <Download size={14} /> Download {typeLabel[item.type].replace(" available", "")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ item, onTagClick }: { item: ResourceItem; onTagClick: (tag: string) => void }) {
  const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    template: { icon: <FileText size={14} />, color: P.warmBlue, bg: "#EEF3FB" },
    worksheet: { icon: <CheckSquare size={14} />, color: P.lavender, bg: "#F3F0FB" },
    "case-study": { icon: <BookOpen size={14} />, color: P.sage, bg: "#EFF6F1" },
    external: { icon: <ExternalLink size={14} />, color: P.terra, bg: "#FBF0EA" },
  };
  const cfg = typeConfig[item.type];
  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3" style={{ borderColor: P.border }}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-snug" style={{ color: P.brown, fontFamily: "Nunito, sans-serif" }}>{item.title}</h4>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold shrink-0" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
          {cfg.icon}{item.type === "case-study" ? "Case Study" : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: P.muted }}>{item.description}</p>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map(tag => (
            <button key={tag} onClick={() => onTagClick(tag)} className="px-2 py-0.5 rounded-lg text-xs capitalize transition-colors hover:opacity-80" style={{ backgroundColor: "#EDE8DF", color: P.muted }}>{tag}</button>
          ))}
        </div>
        <button className="inline-flex items-center gap-1 text-xs font-semibold transition-colors shrink-0 hover:opacity-70" style={{ color: P.terra }}>
          {item.type === "external" ? <ExternalLink size={12} /> : <Download size={12} />}
          {item.type === "external" ? "Open" : "Download"}
        </button>
      </div>
    </div>
  );
}

function GlossarySection() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = GLOSSARY.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || (g.abbr && g.abbr.toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: P.muted }} />
        <input className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all" style={{ borderColor: P.border, backgroundColor: "#fff", color: P.brown, fontFamily: "Nunito, sans-serif" }} placeholder="Search terms…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-2">
        {filtered.map(g => (
          <div key={g.term} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: P.border }}>
            <button className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-amber-50" onClick={() => setExpanded(expanded === g.term ? null : g.term)}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ color: P.brown, fontFamily: "Nunito, sans-serif" }}>{g.term}</span>
                {g.abbr && <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ backgroundColor: "#FDF5EE", color: P.terra, fontFamily: "DM Mono, monospace" }}>{g.abbr}</span>}
              </div>
              {expanded === g.term ? <ChevronUp size={14} style={{ color: P.muted }} /> : <ChevronDown size={14} style={{ color: P.muted }} />}
            </button>
            {expanded === g.term && (
              <div className="px-5 pb-4 border-t" style={{ borderColor: P.border }}>
                <p className="text-sm leading-relaxed mt-3" style={{ color: P.muted }}>{g.definition}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm py-8" style={{ color: P.muted }}>No terms found.</p>}
      </div>
    </div>
  );
}

// ─── Sub-page content ────────────────────────────────────────────────────────

function SubPage({ pageId, onBack }: { pageId: PageId; onBack: () => void }) {
  useEffect(() => { window.scrollTo(0, 0); }, [pageId]);

  const configs: Record<PageId, { title: string; color: string; bgColor: string; emoji: string; img?: string; content: React.ReactNode }> = {
    "what-is": {
      title: "What is a CBA?", color: P.terra, bgColor: "#FDF5EE", emoji: "📜",
      img: "https://images.unsplash.com/photo-1761620230471-2f801c276763?w=900&h=360&fit=crop&auto=format",
      content: (
        <div className="space-y-8">
          <div className="rounded-3xl p-6 border-l-4" style={{ backgroundColor: "#FDF5EE", borderColor: P.terra }}>
            <p className="text-base leading-relaxed" style={{ color: P.brown }}>
              A <strong>Community Benefits Agreement (CBA)</strong> is a legally binding contract between a developer and a community coalition or municipality that outlines specific benefits the developer must deliver in exchange for community support or non-opposition to a project.
            </p>
          </div>
          <div className="rounded-3xl p-6" style={{ background: "linear-gradient(135deg, #3D2B1F 0%, #6B4C38 100%)" }}>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">Our Philosophy</p>
            <p className="text-white leading-relaxed font-medium">
              "Every infrastructure project can and should be looked at through a public interest and fairness lens. It is not FAIR to ignore costs and impacts on local residents so the majority can benefit. If the benefits are substantial to the region, there must be some way of using a share of those gains to make affected residents whole."
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>A brief history</h3>
            <p className="text-sm leading-relaxed" style={{ color: P.muted }}>CBAs emerged in the late 1990s and early 2000s as communities sought more equitable outcomes from major development projects, especially where residents had historically been excluded from decision-making. They have since expanded into renewable energy, infrastructure, and utility-scale projects, where concerns about fairness, siting impacts, and trust are especially acute.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border-2" style={{ borderColor: P.sage + "50", backgroundColor: "#EFF6F1" }}>
              <div className="flex items-center gap-2 mb-3"><CheckCircle size={18} style={{ color: P.sage }} /><h4 className="font-bold" style={{ color: "#2D6B3A", fontFamily: "Playfair Display, serif" }}>What a CBA CAN do</h4></div>
              {["Create legally enforceable obligations", "Ensure benefits are specific and measurable", "Build trust through structured oversight", "Reduce conflict and delays", "Strengthen long-term accountability with successor clauses"].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm mb-2" style={{ color: "#2D6B3A" }}><ArrowRight size={11} className="mt-1 shrink-0" />{item}</div>
              ))}
            </div>
            <div className="rounded-2xl p-5 border-2" style={{ borderColor: P.rose + "50", backgroundColor: "#FBF0F0" }}>
              <div className="flex items-center gap-2 mb-3"><XCircle size={18} style={{ color: P.rose }} /><h4 className="font-bold" style={{ color: "#8B3A3A", fontFamily: "Playfair Display, serif" }}>What a CBA CANNOT do</h4></div>
              {["Replace meaningful community engagement", "Guarantee outcomes without capacity or representation", "Function without clear commitments and oversight", "Ensure compliance if benefits are vague"].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm mb-2" style={{ color: "#8B3A3A" }}><X size={11} className="mt-1 shrink-0" />{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ borderColor: P.gold + "60", backgroundColor: "#FDF9EE" }}>
            <p className="text-sm font-medium" style={{ color: P.brown }}><strong>📌 Note:</strong> Some states require similar agreements under different names (e.g., Host Community Agreements, Development Agreements, Impact Mitigation Agreements). This dashboard applies to both required and voluntary agreements. Always research your state's requirements first.</p>
          </div>
        </div>
      ),
    },
    "can-do": {
      title: "What a CBA Can Do", color: P.sage, bgColor: "#EFF6F1", emoji: "✅",
      img: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=900&h=360&fit=crop&auto=format",
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed" style={{ color: P.muted }}>When well-designed and properly enforced, a CBA can be a powerful tool for communities to secure lasting, meaningful benefits from development projects.</p>
          {[
            { n: "1", title: "Create Legally Enforceable Obligations", desc: "CBAs can be enforced in court. Communities can monitor commitments and hold developers to them through legal remedies including specific performance, injunctive relief, and financial penalties.", ex: "Block Island's CBA included a reimbursement clause the developer honored years later — without litigation — when seabed erosion damaged the cable." },
            { n: "2", title: "Ensure Benefits Are Specific and Measurable", desc: "A good CBA ties every commitment to a specific deliverable, timeline, responsible party, and reporting requirement. Vague promises become enforceable obligations.", ex: "Example: '30% of construction jobs shall be filled by residents within 10 miles of the project site, verified by quarterly payroll reports.'" },
            { n: "3", title: "Build Trust and Transparency", desc: "Structured negotiation and oversight processes create durable relationships between communities, municipalities, and developers — reducing adversarial dynamics over time.", ex: "" },
            { n: "4", title: "Reduce Conflict and Delays", desc: "Developers often negotiate CBAs to secure local support, avoid opposition, and streamline permitting. Early agreement saves everyone time and money.", ex: "" },
            { n: "5", title: "Strengthen Long-Term Accountability", desc: "Monitoring committees, reporting requirements, successor clauses, and performance bonds help ensure benefits persist even when ownership changes or projects evolve over decades.", ex: "" },
          ].map(item => (
            <div key={item.n} className="flex gap-4 p-5 rounded-2xl border" style={{ borderColor: P.sage + "40", backgroundColor: "#F5FAF6" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5" style={{ backgroundColor: P.sage }}>{item.n}</div>
              <div>
                <p className="font-bold mb-1.5" style={{ color: P.brown, fontFamily: "Playfair Display, serif" }}>{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: P.muted }}>{item.desc}</p>
                {item.ex && <div className="mt-2 pl-3 border-l-2 text-xs italic leading-relaxed" style={{ borderColor: P.sage, color: "#4A7A5A" }}>{item.ex}</div>}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    "cannot-do": {
      title: "What a CBA Cannot Do", color: P.rose, bgColor: "#FBF0F0", emoji: "⚠️",
      img: "https://images.unsplash.com/photo-1768697532398-5f5c761095d8?w=900&h=360&fit=crop&auto=format",
      content: (
        <div className="space-y-6">
          <div className="rounded-2xl p-5 border-l-4" style={{ borderColor: P.rose, backgroundColor: "#FBF0F0" }}>
            <p className="text-sm leading-relaxed font-medium" style={{ color: "#8B3A3A" }}>Understanding the limits of a CBA is just as important as understanding its powers. A CBA is only as strong as the process, capacity, and structures behind it.</p>
          </div>
          {[
            { title: "Replace Meaningful Community Engagement", desc: "A CBA cannot fix a broken or inequitable process retroactively. If communities have been excluded from decisions, a CBA signed after the fact provides weak protection. Engagement must come first.", source: "Susskind et al., 1999" },
            { title: "Guarantee Equitable Outcomes Without Capacity", desc: "If community coalitions lack organizational stability, legal capacity, or broad representation, benefits are more likely to slip. The Hunter's Point case illustrates how oversight collapsed when the coalition dissolved.", source: "De Barbieri, 2016; Been, 2010" },
            { title: "Function Without Clear Commitments and Oversight", desc: "Without specific, measurable commitments, independent oversight, and ongoing monitoring, CBAs become symbolic. Vague language ('will seek to hire locally') cannot be enforced.", source: "Wolf-Powers, 2010; Marcello, 2007" },
            { title: "Ensure Compliance Based on Goodwill Alone", desc: "If enforcement depends on relationships rather than legal structure, benefits erode when leadership changes, ownership transfers, or a project runs into financial trouble.", source: "Gross, 2007; Clarke, 2016" },
            { title: "Substitute for State Law Requirements", desc: "In states where CBAs are voluntary, certain benefits may not be legally enforceable through a contract alone. Always understand your state's legal framework before negotiating.", source: "" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl border" style={{ borderColor: P.rose + "40", backgroundColor: "#FDF5F5" }}>
              <XCircle size={20} className="shrink-0 mt-1" style={{ color: P.rose }} />
              <div>
                <p className="font-bold mb-1.5" style={{ color: P.brown, fontFamily: "Playfair Display, serif" }}>{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: P.muted }}>{item.desc}</p>
                {item.source && <p className="text-xs mt-2 italic" style={{ color: P.rose }}>Source: {item.source}</p>}
              </div>
            </div>
          ))}
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#F5FAF6" }}>
            <p className="font-bold mb-2" style={{ color: P.sage, fontFamily: "Playfair Display, serif" }}>The takeaway</p>
            <p className="text-sm leading-relaxed" style={{ color: P.muted }}>A CBA is a tool — not a guarantee. Its effectiveness depends entirely on the process, capacity, and structures surrounding it. Use this dashboard to build those foundations before and during negotiation.</p>
          </div>
        </div>
      ),
    },
    "why-want": {
      title: "Why Might You Want One?", color: P.gold, bgColor: "#FDF9EE", emoji: "💡",
      img: "https://images.unsplash.com/photo-1595598239736-223ad4fe7da5?w=900&h=360&fit=crop&auto=format",
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed" style={{ color: P.muted }}>Communities and municipalities pursue CBAs because they create real, enforceable change — not just promises. Here are five core reasons, plus guidance on what kinds of benefits to pursue.</p>
          {[
            { n: "1", title: "Create Enforceable Commitments", desc: "Benefits are legal obligations, not goodwill. Example: Block Island's reimbursement clause was honored years later without litigation.", color: P.terra },
            { n: "2", title: "Reduce Conflict & Delays", desc: "Developers negotiate CBAs to secure local support and streamline permitting. Early agreement saves everyone time and money.", color: P.sage },
            { n: "3", title: "Improve Equity & Procedural Justice", desc: "CBAs rebalance power by giving communities a structured role in shaping project outcomes — ensuring the public interest is served, not just shareholders.", color: P.lavender },
            { n: "4", title: "Build Long-Term Trust", desc: "Community liaisons, advisory committees, and transparent reporting foster durable collaboration beyond a single project.", color: P.teal },
            { n: "5", title: "Protect Communities from Risk", desc: "Well-designed CBAs include successor clauses, performance bonds, monitoring committees, and dispute-resolution mechanisms — so benefits persist even when ownership changes.", color: P.rose },
          ].map(item => (
            <div key={item.n} className="flex gap-4 p-4 rounded-2xl border" style={{ borderColor: item.color + "35", backgroundColor: item.color + "0d" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: item.color }}>{item.n}</div>
              <div><p className="font-bold text-sm mb-1" style={{ color: P.brown, fontFamily: "Playfair Display, serif" }}>{item.title}</p><p className="text-xs leading-relaxed" style={{ color: P.muted }}>{item.desc}</p></div>
            </div>
          ))}
          <div className="rounded-2xl p-5 border-2" style={{ borderColor: P.gold + "50", backgroundColor: "#FFFAED" }}>
            <p className="font-bold mb-3" style={{ color: "#7A5B0A", fontFamily: "Playfair Display, serif" }}>💡 Think beyond financial benefits</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: P.muted }}>In-kind benefits can be just as valuable as direct payments. Consider negotiating for:</p>
            {["Reduced monthly energy rates for residents near the project", "Co-ownership opportunities providing long-term profit sharing", "Agricultural use of land under solar panels for community food production", "Job training and apprenticeship programs for local youth", "Scholarships and STEM education partnerships"].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm mb-1.5" style={{ color: "#7A5B0A" }}><Sparkles size={12} className="mt-1 shrink-0" />{item}</div>
            ))}
          </div>
        </div>
      ),
    },
    "benefit-cats": {
      title: "Common Benefit Categories", color: P.lavender, bgColor: "#F5F2FB", emoji: "🏘️",
      content: (
        <div className="space-y-5">
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#F5F2FB", border: `1px solid ${P.lavender}40` }}>
            <p className="text-sm leading-relaxed" style={{ color: P.brown }}>These benefits address both <strong>short-term construction impacts</strong> (noise, dust, traffic disruptions) and <strong>long-term operational impacts</strong> (noise, visual impacts, ecological harm, groundwater risks). CBAs should distinguish between the two. Many can include direct payments to affected landowners or residents, impact fees to the municipality, or community benefit funds tied to the scale and duration of project impacts.</p>
          </div>
          <div className="grid gap-3">
            {BENEFIT_CATEGORIES.map(cat => (
              <details key={cat.id} className="rounded-2xl border-2 overflow-hidden group" style={{ borderColor: cat.color + "40" }}>
                <summary className="flex items-center gap-3 px-5 py-3.5 cursor-pointer list-none hover:opacity-90 transition-opacity" style={{ backgroundColor: cat.color + "12" }}>
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 text-sm" style={{ backgroundColor: cat.color }}>{cat.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: P.brown, fontFamily: "Nunito, sans-serif" }}>{cat.label}</span>
                  <ChevronDown size={14} className="ml-auto group-open:rotate-180 transition-transform" style={{ color: cat.color }} />
                </summary>
                <div className="px-5 pb-4 pt-2" style={{ backgroundColor: "#fff" }}>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: P.muted }}>{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.examples.map((ex, i) => <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: cat.color }}>{ex}</span>)}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      ),
    },
    "who-for": {
      title: "Who This Dashboard Is For", color: P.teal, bgColor: "#EEF6F9", emoji: "👥",
      img: "https://images.unsplash.com/photo-1770211829818-9a518f5095ac?w=900&h=360&fit=crop&auto=format",
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed" style={{ color: P.muted }}>This dashboard is designed for community organizers, municipality officials, and local boards who often face development project decisions with limited staff capacity, limited legal expertise, and limited time.</p>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>Primary Audiences</h3>
            {[
              { icon: <Users size={18} />, title: "Community Organizers & EJ Advocates", desc: "Often working part-time or as volunteers, these users need accessible tools to level the playing field in negotiations with well-resourced developers and articulate community priorities.", color: P.terra },
              { icon: <Building2 size={18} />, title: "Municipal Officials & Staff", desc: "Town managers, planners, sustainability coordinators, conservation commissions, selectboards, and zoning boards needing clear frameworks, templates, and state-specific guidance to navigate CBA processes efficiently.", color: P.sage },
              { icon: <Gavel size={18} />, title: "Local Government Boards", desc: "Volunteer boards responsible for decisions affecting land use, permitting, and community well-being.", color: P.teal },
            ].map(a => (
              <div key={a.title} className="flex gap-4 p-4 rounded-2xl mb-3 border" style={{ borderColor: a.color + "35", backgroundColor: a.color + "0d" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.color + "20", color: a.color }}>{a.icon}</div>
                <div><p className="font-bold text-sm mb-1" style={{ color: P.brown, fontFamily: "Playfair Display, serif" }}>{a.title}</p><p className="text-xs leading-relaxed" style={{ color: P.muted }}>{a.desc}</p></div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>Secondary Audiences</h3>
            {[
              { icon: <Handshake size={18} />, title: "Developers & Project Proponents", desc: "Seeking to understand community expectations, reduce project risk, and negotiate durable agreements.", color: P.gold },
              { icon: <BookOpen size={18} />, title: "Consultants & Technical Advisors", desc: "Supporting municipalities or communities in negotiation, engagement, or monitoring processes.", color: P.lavender },
              { icon: <GraduationCap size={18} />, title: "Researchers & Students", desc: "Studying community engagement, energy transitions, or planning processes.", color: P.warmBlue },
            ].map(a => (
              <div key={a.title} className="flex gap-3 p-4 rounded-2xl mb-2 bg-white border" style={{ borderColor: P.border }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.color + "18", color: a.color }}>{a.icon}</div>
                <div><p className="font-semibold text-sm mb-0.5" style={{ color: P.brown, fontFamily: "Nunito, sans-serif" }}>{a.title}</p><p className="text-xs" style={{ color: P.muted }}>{a.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "how-to": {
      title: "How to Use This Dashboard", color: P.warmBlue, bgColor: "#EEF3FB", emoji: "🗺️",
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed" style={{ color: P.muted }}>This dashboard is structured as a step-by-step toolkit that guides you through the entire CBA process — from early preparation to long-term enforcement. Here's how to get the most out of it.</p>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: P.border }}>
            {[
              { n: "01", title: "Understand Your State's Legal Context First", desc: "Before anything else, research what your state and local law requires. In many states, a CBA-like agreement (called a Host Community Agreement or Development Agreement) may already be required. Know the rules before you negotiate.", icon: <MapPin size={16} /> },
              { n: "02", title: "Use the 6-Step Process", desc: "Scroll down to find the six step accordions: Prepare → Engage → Negotiate → Draft → Monitor → Enforce. Each step expands to reveal detailed guidance, checklists, and downloadable resources.", icon: <ChevronDown size={16} /> },
              { n: "03", title: "Download Templates & Worksheets", desc: "Look for the 'Template' and 'Worksheet' badges inside each step. These are ready-to-use starting points for your coalition or municipality.", icon: <Download size={16} /> },
              { n: "04", title: "Browse the Resource Library", desc: "Scroll below the 6-step section to find all templates, case studies (Block Island, Calverton, Detroit, NECEC), and external links in a searchable, filterable collection.", icon: <BookOpen size={16} /> },
              { n: "05", title: "Explore the CBA Database", desc: "[description of database]", icon: <Database size={16} /> },
              { n: "06", title: "Use the Glossary", desc: "Key terms throughout the dashboard are defined in the glossary, accessible from the main navigation. Reference it anytime to clarify terminology.", icon: <Search size={16} /> },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 border-b last:border-0" style={{ borderColor: P.border, backgroundColor: i % 2 === 0 ? "#fff" : "#F8F5FF" }}>
                <div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mb-0" style={{ backgroundColor: P.warmBlue, fontFamily: "DM Mono, monospace" }}>
                    {item.n}
                  </div>
                </div>
                <div><p className="font-bold text-sm mb-1" style={{ color: P.brown, fontFamily: "Playfair Display, serif" }}>{item.title}</p><p className="text-xs leading-relaxed" style={{ color: P.muted }}>{item.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#FDF9EE", border: `1px solid ${P.gold}50` }}>
            <p className="text-sm font-medium" style={{ color: P.brown }}>💛 <strong>Tip:</strong> Glossary terms throughout the site are marked — open the glossary anytime to look up CBA, EIA, HCA, successor clauses, SLAPP suits, and more.</p>
          </div>
        </div>
      ),
    },
  };

  const cfg = configs[pageId];
  return (
    <div style={{ backgroundColor: P.cream, minHeight: "100vh", fontFamily: "Nunito, sans-serif" }}>
      {/* Back bar */}
      <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: "rgba(250,247,240,0.97)", backdropFilter: "blur(8px)", borderColor: P.border }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:opacity-80" style={{ backgroundColor: cfg.color + "18", color: cfg.color }}>
            <ArrowLeft size={15} /> Back to Home
          </button>
          <span className="text-sm font-semibold" style={{ color: P.muted }}>{cfg.emoji} {cfg.title}</span>
        </div>
      </div>
      {/* Hero image */}
      {cfg.img && (
        <div className="w-full h-48 sm:h-64 overflow-hidden" style={{ backgroundColor: cfg.color + "30" }}>
          <img src={cfg.img} alt={cfg.title} className="w-full h-full object-cover" style={{ filter: "brightness(0.85) saturate(1.1)" }} />
        </div>
      )}
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: cfg.color + "20", color: cfg.color }}>
            {cfg.emoji} CBA Toolkit
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>{cfg.title}</h1>
          <div className="h-1 w-16 rounded-full" style={{ backgroundColor: cfg.color }} />
        </div>
        {cfg.content}
      </div>
    </div>
  );
}

// ─── Landing card component ───────────────────────────────────────────────────

function LandingCard({ pageId, title, desc, color, bgColor, emoji, onClick, tall }: {
  pageId: PageId; title: string; desc: string; color: string; bgColor: string;
  emoji: string; onClick: () => void; tall?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left rounded-3xl border-2 overflow-hidden transition-all duration-200 cursor-pointer flex flex-col"
      style={{
        borderColor: hovered ? color : color + "40",
        backgroundColor: P.cardBg,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 40px ${color}25` : "0 2px 8px rgba(61,43,31,0.07)",
        minHeight: tall ? 220 : 180,
      }}
    >
      {/* Colored top strip */}
      <div className="px-6 py-5 flex items-start justify-between" style={{ backgroundColor: hovered ? color : bgColor, transition: "background-color 0.2s" }}>
        <span className="text-3xl">{emoji}</span>
        <ArrowRight size={18} style={{ color: hovered ? "white" : color, transition: "color 0.2s" }} />
      </div>
      {/* Card body */}
      <div className="px-6 py-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-base leading-snug" style={{ fontFamily: "Playfair Display, serif", color: hovered ? color : P.brown, transition: "color 0.2s" }}>{title}</h3>
        <p className="text-xs leading-relaxed flex-1" style={{ color: P.muted }}>{desc}</p>
        <div className="text-xs font-bold mt-2" style={{ color: color }}>Read more →</div>
      </div>
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId | null>(null);
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("home");

  const sectionsRef = {
    home: useRef<HTMLDivElement>(null),
    steps: useRef<HTMLDivElement>(null),
    resources: useRef<HTMLDivElement>(null),
    glossary: useRef<HTMLDivElement>(null),
  };

  const scrollTo = (section: keyof typeof sectionsRef) => {
    sectionsRef[section].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(section);
  };

  const filteredResources = RESOURCES.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || r.description.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchFilter = resourceFilter === "all" || r.type === resourceFilter || r.tags.includes(resourceFilter) || r.step.toLowerCase() === resourceFilter;
    return matchSearch && matchFilter;
  });

  const filterOptions = [
    { value: "all", label: "All" }, { value: "template", label: "Templates" }, { value: "worksheet", label: "Worksheets" },
    { value: "case-study", label: "Case Studies" }, { value: "external", label: "External" },
    { value: "prepare", label: "Prepare" }, { value: "engage", label: "Engage" }, { value: "negotiate", label: "Negotiate" },
    { value: "draft", label: "Draft" }, { value: "monitor", label: "Monitor" }, { value: "enforce", label: "Enforce" },
  ];

  // Sub-page routing
  if (currentPage) {
    return <SubPage pageId={currentPage} onBack={() => { setCurrentPage(null); window.scrollTo(0, 0); }} />;
  }

  const openPage = (id: PageId) => { setCurrentPage(id); window.scrollTo(0, 0); };

  return (
    <div style={{ fontFamily: "Nunito, sans-serif", backgroundColor: P.cream }}>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b" style={{ backgroundColor: "rgba(250,247,240,0.97)", backdropFilter: "blur(8px)", borderColor: P.border }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: P.terra, fontFamily: "DM Mono, monospace" }}>CBA</div>
            <span className="font-black text-sm hidden sm:block" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>CBA Toolkit</span>
          </button>
          <div className="flex items-center gap-1">
            {(["home", "steps", "resources", "glossary"] as const).map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all" style={{ backgroundColor: activeSection === s ? P.terra : "transparent", color: activeSection === s ? "#fff" : P.muted }}>
                {s === "steps" ? "6 Steps" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div ref={sectionsRef.home}>
        <section className="relative overflow-hidden">
          {/* Background photo */}
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1400&h=500&fit=crop&auto=format" alt="Green field landscape" className="w-full h-full object-cover" style={{ filter: "brightness(0.35) saturate(0.8)" }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
                🌱 Massachusetts Pilot · Spring 2026
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Community Benefits<br />
                <span style={{ color: "#F5C842" }}>Agreement</span> Toolkit
              </h1>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.82)" }}>
                A step-by-step interactive guide to negotiating, drafting, monitoring, and enforcing CBAs — built for communities, municipalities, and developers.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => scrollTo("steps")} className="px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:opacity-90" style={{ backgroundColor: P.terra, color: "#fff" }}>
                  Start the 6 Steps ↓
                </button>
                <button onClick={() => scrollTo("resources")} className="px-6 py-3 rounded-2xl font-bold text-sm transition-all" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                  Browse Resources
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Landing card grid ──────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <LandingCard pageId="what-is" title="What is a CBA?" desc="A legally binding contract that turns community priorities into enforceable commitments from developers." color={P.terra} bgColor="#FDF5EE" emoji="📜" onClick={() => openPage("what-is")} />
            <LandingCard pageId="can-do" title="What a CBA Can Do" desc="Create enforceable obligations, measurable benefits, build trust, reduce conflict, and protect communities long-term." color={P.sage} bgColor="#EFF6F1" emoji="✅" onClick={() => openPage("can-do")} />
            <LandingCard pageId="cannot-do" title="What a CBA Cannot Do" desc="Understand the real limits — CBAs cannot replace engagement, guarantee outcomes, or work without oversight." color={P.rose} bgColor="#FBF0F0" emoji="⚠️" onClick={() => openPage("cannot-do")} />
          </div>

          {/* Row 2 — 2 wide cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <LandingCard pageId="why-want" title="Why Might You Want One?" desc="Five reasons communities pursue CBAs — from enforceable commitments to in-kind benefits like reduced energy rates and co-ownership." color={P.gold} bgColor="#FDF9EE" emoji="💡" onClick={() => openPage("why-want")} tall />
            <LandingCard pageId="benefit-cats" title="Common Benefit Categories" desc="Explore 12 benefit types addressing both short-term construction impacts and long-term operational impacts — from local hiring to agricultural land use." color={P.lavender} bgColor="#F5F2FB" emoji="🏘️" onClick={() => openPage("benefit-cats")} tall />
          </div>

          {/* Row 3 — 2 nav cards + 1 external database */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LandingCard pageId="who-for" title="Who This Dashboard Is For" desc="Community organizers, municipal officials, local boards, developers, consultants, and researchers." color={P.teal} bgColor="#EEF6F9" emoji="👥" onClick={() => openPage("who-for")} />
            <LandingCard pageId="how-to" title="How to Use It →" desc="A quick orientation to the 6-step toolkit, resource library, glossary, and CBA database." color={P.warmBlue} bgColor="#EEF3FB" emoji="🗺️" onClick={() => openPage("how-to")} />
            {/* CBA Database — external link */}
            <a
              href="https://renewable-energy.mit.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left rounded-3xl border-2 overflow-hidden flex flex-col transition-all duration-200 cursor-pointer no-underline group"
              style={{ borderColor: "#4A7C59" + "40", backgroundColor: P.cardBg, minHeight: 180 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px #4A7C5925"; (e.currentTarget as HTMLElement).style.borderColor = "#4A7C59"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(61,43,31,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "#4A7C5940"; }}
            >
              <div className="px-6 py-5 flex items-start justify-between" style={{ backgroundColor: "#EDF5F0", transition: "background-color 0.2s" }}>
                <span className="text-3xl">🗄️</span>
                <ExternalLink size={18} style={{ color: "#4A7C59" }} />
              </div>
              <div className="px-6 py-4 flex-1 flex flex-col gap-2">
                <h3 className="font-bold text-base leading-snug" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>CBA Database</h3>
                <p className="text-xs leading-relaxed flex-1" style={{ color: P.muted }}>Browse real-world Community Benefits Agreements from across the country.</p>
                <div className="text-xs font-bold mt-2" style={{ color: "#4A7C59" }}>Open database ↗</div>
              </div>
            </a>
          </div>

          {/* Philosophy bar */}
          <div className="mt-6 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "linear-gradient(135deg, #3D2B1F 0%, #5C3E2E 100%)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xl">🌿</div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.85)" }}>
              <strong className="text-white">Our philosophy:</strong> It is not selfishness that motivates community concerns — it is a desire to be treated fairly. Every project that benefits the region must reckon with the costs borne by a subset of local residents. <em style={{ color: "#F5C842" }}>Those costs deserve recognition, mitigation, and fair compensation.</em>
            </p>
            <button onClick={() => scrollTo("steps")} className="shrink-0 px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all hover:opacity-90" style={{ backgroundColor: P.terra, color: "#fff" }}>
              Begin →
            </button>
          </div>
        </section>
      </div>

      {/* ── 6-Step Process ─────────────────────────────────────────────────── */}
      <div ref={sectionsRef.steps} className="border-t" style={{ borderColor: P.border }}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>The 6-Step CBA Process</h2>
            <p className="text-sm max-w-lg mx-auto" style={{ color: P.muted }}>Click each step to expand detailed guidance, action checklists, and downloadable resources.</p>
          </div>
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto pb-2">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center shrink-0">
                <div className="flex flex-col items-center gap-1 px-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md" style={{ backgroundColor: step.color, fontFamily: "DM Mono, monospace" }}>{step.id}</div>
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: P.muted }}>{step.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-0.5 mb-5" style={{ background: `linear-gradient(to right, ${step.color}, ${STEPS[i + 1].color})` }} />}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {STEPS.map((step, i) => <StepModule key={step.id} step={step} defaultOpen={i < 2} />)}
          </div>
        </section>
      </div>

      {/* ── Resource Library ───────────────────────────────────────────────── */}
      <div ref={sectionsRef.resources} className="border-t" style={{ borderColor: P.border, backgroundColor: "#F2EDE4" }}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>Resource Library</h2>
            <p className="text-sm" style={{ color: P.muted }}>Templates, worksheets, case studies, and external resources — searchable and filterable.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: P.muted }} />
              <input className="w-full pl-9 pr-4 py-2.5 rounded-2xl border text-sm focus:outline-none transition-all" style={{ borderColor: P.border, backgroundColor: "#fff", color: P.brown, fontFamily: "Nunito, sans-serif" }} placeholder="Search resources…" value={resourceSearch} onChange={e => setResourceSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map(opt => (
              <button key={opt.value} onClick={() => setResourceFilter(opt.value)} className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all" style={{ backgroundColor: resourceFilter === opt.value ? P.terra : "#fff", color: resourceFilter === opt.value ? "#fff" : P.muted, border: `1px solid ${resourceFilter === opt.value ? P.terra : P.border}` }}>{opt.label}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((item, i) => <ResourceCard key={i} item={item} onTagClick={tag => setResourceFilter(tag)} />)}
          </div>
          {filteredResources.length === 0 && (
            <div className="text-center py-16" style={{ color: P.muted }}>
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No resources match your search.</p>
            </div>
          )}
        </section>
      </div>

      {/* ── Glossary ───────────────────────────────────────────────────────── */}
      <div ref={sectionsRef.glossary} className="border-t" style={{ borderColor: P.border }}>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ fontFamily: "Playfair Display, serif", color: P.brown }}>Glossary</h2>
            <p className="text-sm" style={{ color: P.muted }}>Key terms used throughout this dashboard, with plain-language definitions.</p>
          </div>
          <GlossarySection />
        </section>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t" style={{ borderColor: P.border, backgroundColor: P.brown }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: P.terra }}>CBA</div>
                <span className="font-black text-white text-sm" style={{ fontFamily: "Playfair Display, serif" }}>CBA Toolkit</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>A step-by-step toolkit guiding communities, municipalities, and developers through the Community Benefits Agreement process. Massachusetts Pilot · Spring 2026.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Navigate</h4>
              {(["home", "steps", "resources", "glossary"] as const).map(s => (
                <button key={s} onClick={() => scrollTo(s)} className="block text-xs mb-1.5 capitalize transition-colors hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s === "steps" ? "6-Step Process" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-xs mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Help & Feedback</h4>
              <button className="flex items-center gap-1.5 text-xs mb-1.5 transition-colors hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}><HelpCircle size={12} />Help & FAQ</button>
              <button className="flex items-center gap-1.5 text-xs mb-1.5 transition-colors hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}><MessageSquare size={12} />Send Feedback</button>
              <button className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}><Heart size={12} />Acknowledgements</button>
            </div>
          </div>
          <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>CBA Dashboard · Spring 2026 · Massachusetts Pilot</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Built to support community organizing and environmental justice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
