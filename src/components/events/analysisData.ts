// Post-event analysis: the figures an organiser enters, mock survey results, and the rules that
// turn them into a report. Survey numbers are shared mock data until a backend exists.

export type AnalysisInputs = {
  registered: string;
  attended: string;
  ticketsSold: string;
  ticketPrice: string;
  boothsRented: string;
  boothFee: string;
  fields: Record<FieldOfStudy, string>;
};

export const FIELDS = ["Computer Science", "Data Science", "Engineering", "Other"] as const;
export type FieldOfStudy = (typeof FIELDS)[number];

/** Categorical hues, validated for CVD separation and 3:1 contrast on white. */
export const FIELD_COLORS: Record<FieldOfStudy, string> = {
  "Computer Science": "#4F46E5",
  "Data Science": "#0284C7",
  Engineering: "#D97706",
  Other: "#DB2777",
};

/** Typical split used to auto-calculate blank field-of-study counts. */
const FIELD_WEIGHTS: Record<FieldOfStudy, number> = {
  "Computer Science": 23,
  "Data Science": 11,
  Engineering: 7,
  Other: 6,
};

export const SAMPLE_INPUTS: AnalysisInputs = {
  registered: "58",
  attended: "47",
  ticketsSold: "",
  ticketPrice: "",
  boothsRented: "",
  boothFee: "",
  fields: { "Computer Science": "", "Data Science": "", Engineering: "", Other: "" },
};

/** Post-event survey (mock). */
export const SURVEY = {
  responses: 44,
  ratings: [
    { label: "5 · Excellent", count: 29, color: "#312E81" },
    { label: "4 · Good", count: 11, color: "#6366F1" },
    { label: "3 or less", count: 4, color: "#A5B4FC" },
  ],
  /** Average session participation, %. */
  engagement: 88,
  nps: 62,
};

/** Share of attendees active in each session vs. share present, % (mock). */
export const SESSIONS: { name: string; participation: number; attendance: number }[] = [
  { name: "Welcome", participation: 64, attendance: 100 },
  { name: "Keynote", participation: 82, attendance: 100 },
  { name: "Hands-on lab", participation: 95, attendance: 96 },
  { name: "Panel talk", participation: 78, attendance: 89 },
  { name: "Networking", participation: 70, attendance: 89 },
  { name: "Product demos", participation: 96, attendance: 87 },
  { name: "Awards", participation: 91, attendance: 83 },
  { name: "Closing", participation: 74, attendance: 79 },
];

export const ENGAGEMENT_COUNTS = [
  { value: "124", label: "Questions asked" },
  { value: "312", label: "Poll responses" },
  { value: `${SURVEY.responses}`, label: "Survey responses" },
  { value: "260", label: "Connections made" },
];

export const TARGETS = {
  attendance: 80,
  satisfaction: 4,
  engagement: 70,
  nps: 40,
  registrationFill: 80,
};

/* ---------- Validation ---------- */

const num = (s: string) => (s.trim() === "" ? null : Number(s));
const isWhole = (n: number | null) => n !== null && Number.isFinite(n) && n >= 0 && Number.isInteger(n);

export type InputErrors = Partial<Record<"registered" | "attended" | "fields" | "tickets" | "booths", string>>;

export function validate(i: AnalysisInputs): InputErrors {
  const e: InputErrors = {};
  const reg = num(i.registered);
  const att = num(i.attended);
  if (!isWhole(reg) || reg === 0) e.registered = "Enter how many people registered.";
  if (!isWhole(att)) e.attended = "Enter how many people attended.";
  else if (isWhole(reg) && att! > reg!) e.attended = "Attended can't be more than registered.";

  const t = num(i.ticketsSold);
  const p = num(i.ticketPrice);
  if ((t !== null && !isWhole(t)) || (p !== null && !(Number.isFinite(p) && p >= 0)))
    e.tickets = "Use whole tickets and a price of 0 or more.";
  const b = num(i.boothsRented);
  const f = num(i.boothFee);
  if ((b !== null && !isWhole(b)) || (f !== null && !(Number.isFinite(f) && f >= 0)))
    e.booths = "Use whole booths and a fee of 0 or more.";

  const filled = FIELDS.map((k) => num(i.fields[k])).filter((v): v is number => v !== null);
  if (filled.some((v) => !isWhole(v))) e.fields = "Field counts must be whole numbers.";
  else if (isWhole(att)) {
    const sum = filled.reduce((s, v) => s + v, 0);
    if (sum > att!) e.fields = `These add up to ${sum}, more than the ${att} who attended.`;
    else if (filled.length === FIELDS.length && sum !== att)
      e.fields = `These add up to ${sum}; they need to total ${att} attendees.`;
  }
  return e;
}

/* ---------- Report ---------- */

/** Fill blank field counts from the leftover attendees, split by the typical weights. */
function fieldCounts(i: AnalysisInputs, attended: number): Record<FieldOfStudy, number> {
  const out = {} as Record<FieldOfStudy, number>;
  const blanks = FIELDS.filter((k) => num(i.fields[k]) === null);
  let left = attended;
  for (const k of FIELDS) {
    const v = num(i.fields[k]);
    if (v !== null) {
      out[k] = v;
      left -= v;
    }
  }
  const weight = blanks.reduce((s, k) => s + FIELD_WEIGHTS[k], 0);
  let given = 0;
  blanks.forEach((k, idx) => {
    const share = idx === blanks.length - 1 ? left - given : Math.round((left * FIELD_WEIGHTS[k]) / weight);
    out[k] = Math.max(0, share);
    given += out[k];
  });
  return out;
}

export type Kpi = { key: string; label: string; actual: number; target: number; max: number; display: string; targetDisplay: string; met: boolean };

export function buildReport(i: AnalysisInputs, capacity: number) {
  const registered = Number(i.registered);
  const attended = Number(i.attended);
  const noShow = registered - attended;
  const attendance = Math.round((attended / registered) * 100);
  const noShowRate = 100 - attendance;
  const fill = Math.min(100, Math.round((registered / capacity) * 100));
  const avg =
    SURVEY.ratings.reduce((s, r, idx) => s + r.count * (5 - idx), 0) / SURVEY.responses;
  const satisfaction = Math.round(avg * 10) / 10;

  const kpis: Kpi[] = [
    { key: "attendance", label: "Attendance rate", actual: attendance, target: TARGETS.attendance, max: 100, display: `${attendance}%`, targetDisplay: `${TARGETS.attendance}%`, met: attendance >= TARGETS.attendance },
    { key: "satisfaction", label: "Satisfaction", actual: satisfaction, target: TARGETS.satisfaction, max: 5, display: `${satisfaction}/5`, targetDisplay: `${TARGETS.satisfaction}/5`, met: satisfaction >= TARGETS.satisfaction },
    { key: "engagement", label: "Engagement", actual: SURVEY.engagement, target: TARGETS.engagement, max: 100, display: `${SURVEY.engagement}%`, targetDisplay: `${TARGETS.engagement}%`, met: SURVEY.engagement >= TARGETS.engagement },
    { key: "nps", label: "NPS", actual: SURVEY.nps, target: TARGETS.nps, max: 100, display: `+${SURVEY.nps}`, targetDisplay: `${TARGETS.nps}`, met: SURVEY.nps >= TARGETS.nps },
    { key: "fill", label: "Registration fill", actual: fill, target: TARGETS.registrationFill, max: 100, display: `${fill}%`, targetDisplay: `${TARGETS.registrationFill}%`, met: fill >= TARGETS.registrationFill },
  ];
  const met = kpis.filter((k) => k.met).length;

  // Mean of each KPI on a 0–100 scale (NPS mapped from −100…100).
  const score = Math.round(
    (attendance + (satisfaction / 5) * 100 + SURVEY.engagement + (SURVEY.nps + 100) / 2 + fill) / 5,
  );

  const tickets = num(i.ticketsSold) ?? 0;
  const price = num(i.ticketPrice) ?? 0;
  const booths = num(i.boothsRented) ?? 0;
  const fee = num(i.boothFee) ?? 0;
  const revenue = { tickets: tickets * price, booths: booths * fee };
  const hasRevenue = revenue.tickets + revenue.booths > 0;

  const peak = SESSIONS.reduce((a, b) => (b.participation > a.participation ? b : a));
  const last = SESSIONS[SESSIONS.length - 1];

  const verdict =
    score >= 70 ? "Objectives met" : score >= 50 ? "Partly successful" : "Below expectations";

  const achievements = [
    met >= 4 && { title: "Targets hit", body: `${met} of ${kpis.length} KPIs met or beat their target.` },
    satisfaction >= TARGETS.satisfaction && { title: "Happy attendees", body: `Rated ${satisfaction}/5 across ${SURVEY.responses} survey responses.` },
    { title: "High engagement", body: `${peak.name} peaked at ${peak.participation}% participation.` },
    hasRevenue && { title: "Revenue generated", body: `$${(revenue.tickets + revenue.booths).toLocaleString("en-US")} from tickets and booths.` },
  ].filter(Boolean) as { title: string; body: string }[];

  const concerns = [
    noShowRate > 100 - TARGETS.attendance && { title: "No-show gap", body: `${noShow} of ${registered} registrants (${noShowRate}%) didn't attend.` },
    noShowRate <= 100 - TARGETS.attendance && noShow > 0 && { title: "Some no-shows", body: `${noShow} registrants didn't attend.` },
    fill < TARGETS.registrationFill && { title: "Low registration fill", body: `${registered} registrations filled ${fill}% of the ${capacity}-guest capacity.` },
    last.attendance < 85 && { title: "Late-session drop-off", body: `Attendance eased to ${last.attendance}% by ${last.name}.` },
  ].filter(Boolean) as { title: string; body: string }[];

  const recommendations = [
    noShowRate > 10 && { title: "Add a confirmation step", body: "Send a 48-hour reminder and ask guests to confirm their seat." },
    fill < TARGETS.registrationFill && { title: "Promote earlier", body: "Open registration sooner and push it through partner channels." },
    { title: "Front-load interactive content", body: `Put sessions like ${peak.name} earlier, while energy is highest.` },
  ].filter(Boolean) as { title: string; body: string }[];

  return {
    registered,
    attended,
    noShow,
    attendance,
    noShowRate,
    satisfaction,
    kpis,
    met,
    score,
    verdict,
    revenue,
    hasRevenue,
    fields: fieldCounts(i, attended),
    peak,
    achievements,
    concerns,
    recommendations,
  };
}

export type Report = ReturnType<typeof buildReport>;
