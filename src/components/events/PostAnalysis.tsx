"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ENGAGEMENT_COUNTS,
  FIELDS,
  FIELD_COLORS,
  SAMPLE_INPUTS,
  SESSIONS,
  SURVEY,
  buildReport,
  validate,
  type AnalysisInputs,
  type Kpi,
} from "./analysisData";
import Donut from "./charts/Donut";
import LineChart from "./charts/LineChart";
import { Card } from "./WorkspacePage";
import {
  AlertTriangleIcon,
  CheckIcon,
  PenIcon,
  SparklesIcon,
  DownloadIcon,
} from "./icons";

type EventInfo = { title: string; date: string; venue: string; capacity: number };

export default function PostAnalysis({ event }: { event: EventInfo }) {
  const [inputs, setInputs] = useState<AnalysisInputs>(SAMPLE_INPUTS);
  const [view, setView] = useState<"form" | "report">("form");
  const [tried, setTried] = useState(false);
  const errors = validate(inputs);
  const valid = Object.keys(errors).length === 0;

  const generate = () => {
    setTried(true);
    if (!valid) return;
    setView("report");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "report" && valid) {
    return <ReportView event={event} inputs={inputs} onEdit={() => setView("form")} />;
  }

  return (
    <InputsForm
      inputs={inputs}
      setInputs={setInputs}
      errors={tried ? errors : {}}
      onSubmit={generate}
    />
  );
}

/* ---------------- Form ---------------- */

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  invalid,
  prefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  prefix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="text-[#DC2626]"> *</span>}
      </label>
      <div
        className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-3.5 transition-colors focus-within:border-[#A5A8F5] focus-within:ring-4 focus-within:ring-[#4F46E5]/10 ${
          invalid ? "border-[#FCA5A5]" : "border-[#E2E5EC]"
        }`}
      >
        {prefix && <span className="text-sm text-[#64748B]">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          required={required}
          className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
        />
      </div>
    </div>
  );
}

function Group({ title, note, error, children }: { title: string; note?: string; error?: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 flex flex-col gap-4 border-none p-0">
      <legend className="mb-4 p-0 text-sm font-bold text-[#0F172A]">
        {title}
        {note && <span className="ml-1.5 font-medium text-[#64748B]">{note}</span>}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
      {error && (
        <p role="alert" className="m-0 flex items-center gap-1.5 text-[13px] font-medium text-[#B91C1C]">
          <AlertTriangleIcon size={15} />
          {error}
        </p>
      )}
    </fieldset>
  );
}

function InputsForm({
  inputs,
  setInputs,
  errors,
  onSubmit,
}: {
  inputs: AnalysisInputs;
  setInputs: (f: (i: AnalysisInputs) => AnalysisInputs) => void;
  errors: ReturnType<typeof validate>;
  onSubmit: () => void;
}) {
  const set = (k: Exclude<keyof AnalysisInputs, "fields">) => (v: string) =>
    setInputs((i) => ({ ...i, [k]: v }));
  const attended = Number(inputs.attended) || 0;
  const fieldSum = FIELDS.reduce((s, f) => s + (Number(inputs.fields[f]) || 0), 0);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Card title="Post-event figures" subtitle="Add the real results and JatJeng builds the analysis around them." bodyClassName="flex flex-col gap-8 p-5 sm:p-7">
        <div className="flex items-start gap-3 rounded-2xl border border-[#E0E3FB] bg-[#F5F6FF] p-4">
          <SparklesIcon size={18} className="mt-0.5 shrink-0 text-[#4F46E5]" />
          <p className="m-0 text-sm leading-relaxed text-[#334155]">
            <strong className="font-bold text-[#3730A3]">Attendance drives the report.</strong> It
            sets the KPI score, participant charts and recommendations. Ticket, booth and
            field-of-study figures are optional.
          </p>
        </div>

        <Group title="Attendance" error={errors.registered ?? errors.attended}>
          <Field id="pa-registered" label="Registered participants" required value={inputs.registered} onChange={set("registered")} invalid={!!errors.registered} placeholder="e.g. 58" />
          <Field id="pa-attended" label="People who attended" required value={inputs.attended} onChange={set("attended")} invalid={!!errors.attended} placeholder="e.g. 47" />
        </Group>

        <Group title="Tickets and booths" note="optional" error={errors.tickets ?? errors.booths}>
          <Field id="pa-tickets" label="Tickets sold" value={inputs.ticketsSold} onChange={set("ticketsSold")} invalid={!!errors.tickets} />
          <Field id="pa-price" label="Price per ticket" prefix="$" value={inputs.ticketPrice} onChange={set("ticketPrice")} invalid={!!errors.tickets} />
          <Field id="pa-booths" label="Booths rented" value={inputs.boothsRented} onChange={set("boothsRented")} invalid={!!errors.booths} />
          <Field id="pa-fee" label="Fee per booth" prefix="$" value={inputs.boothFee} onChange={set("boothFee")} invalid={!!errors.booths} />
        </Group>

        <Group
          title="Field of study"
          note={`optional · blanks are auto-calculated${attended ? ` · ${fieldSum} of ${attended} entered` : ""}`}
          error={errors.fields}
        >
          {FIELDS.map((f) => (
            <Field
              key={f}
              id={`pa-${f}`}
              label={f}
              value={inputs.fields[f]}
              onChange={(v) => setInputs((i) => ({ ...i, fields: { ...i.fields, [f]: v } }))}
              placeholder="Auto-calculate"
              invalid={!!errors.fields}
            />
          ))}
        </Group>

        <div className="flex justify-end border-t border-[#EEF0F5] pt-6">
          <button
            type="submit"
            className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border-none bg-[#4F46E5] px-6 text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.55)] hover:bg-[#4338CA]"
          >
            <SparklesIcon size={17} />
            Generate report
          </button>
        </div>
      </Card>
    </form>
  );
}

/* ---------------- Report ---------------- */

function Section({ title, subtitle, badge, children }: { title: string; subtitle: string; badge?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="m-0 text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
          <p className="m-0 text-[13px] text-[#64748B]">{subtitle}</p>
        </div>
        {badge && (
          <span className="rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-bold text-[#3730A3]">{badge}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function TargetNote({ k }: { k: Kpi }) {
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${k.met ? "text-[#15803D]" : "text-[#B45309]"}`}>
      {k.met ? <CheckIcon size={13} /> : <AlertTriangleIcon size={13} />}
      {k.met ? "Target met" : "Below target"} · target {k.targetDisplay}
    </span>
  );
}

function ReportView({ event, inputs, onEdit }: { event: EventInfo; inputs: AnalysisInputs; onEdit: () => void }) {
  const r = useMemo(() => buildReport(inputs, event.capacity), [inputs, event.capacity]);
  const headline = r.kpis.slice(0, 4);
  const totalRevenue = r.revenue.tickets + r.revenue.booths;

  return (
    <div className="flex flex-col gap-9">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#4338CA,#6D28D9)] p-6 text-white sm:p-8 print:border print:border-[#E6E8F0] print:bg-none print:text-[#0F172A]">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.07]" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-3">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/85 print:text-[#475569]">
              <CheckIcon size={14} />
              Event completed · AI report generated
            </span>
            <h2 className="m-0 text-[clamp(22px,3vw,30px)] font-extrabold leading-tight tracking-[-0.02em]">
              {event.title} — post-event analysis
            </h2>
            <p className="m-0 text-[15px] leading-relaxed text-white/90 print:text-[#334155]">
              The event met <strong>{r.met} of {r.kpis.length}</strong> target KPIs. Engagement
              peaked at {r.peak.name} ({r.peak.participation}%)
              {r.noShowRate > 10 ? `, and the biggest opportunity is the ${r.noShowRate}% no-show rate.` : "."}
            </p>
            <span className="text-[13px] text-white/75 print:text-[#64748B]">
              {event.date} · {r.attended} attendees · {event.venue}
            </span>
          </div>
          <div className="flex flex-col items-end gap-5">
            <div className="flex gap-2 print:hidden">
              <button
                type="button"
                onClick={onEdit}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-none bg-white px-3.5 text-[13px] font-bold text-[#0F172A] hover:bg-white/90"
              >
                <PenIcon size={15} />
                Edit inputs
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-none bg-white px-3.5 text-[13px] font-bold text-[#0F172A] hover:bg-white/90"
              >
                <DownloadIcon size={15} />
                Export PDF
              </button>
            </div>
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/25 bg-white/10 print:border-[#E6E8F0]">
              <span className="text-[38px] font-extrabold leading-none">
                {r.score}
                <span className="text-sm font-bold text-white/75 print:text-[#64748B]">/100</span>
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/75 print:text-[#64748B]">
                Success score
              </span>
            </div>
          </div>
        </div>
      </section>

      <Section title="Key metrics" subtitle="Actual results compared with targets" badge={`${r.met}/${r.kpis.length} targets met`}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {headline.map((k) => (
            <div key={k.key} className="flex flex-col gap-2 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]">
              <span className="text-[13px] font-medium text-[#64748B]">{k.label}</span>
              <span className="text-[30px] font-extrabold leading-none tracking-[-0.02em]">{k.display}</span>
              <TargetNote k={k} />
            </div>
          ))}
          {r.hasRevenue && (
            <div className="flex flex-col gap-2 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]">
              <span className="text-[13px] font-medium text-[#64748B]">Revenue</span>
              <span className="text-[30px] font-extrabold leading-none tracking-[-0.02em]">
                ${totalRevenue.toLocaleString("en-US")}
              </span>
              <span className="text-xs text-[#64748B]">
                Tickets ${r.revenue.tickets.toLocaleString("en-US")} · Booths ${r.revenue.booths.toLocaleString("en-US")}
              </span>
            </div>
          )}
        </div>
      </Section>

      <Section title="Event success" subtitle="Performance against targets and attendee sentiment">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="KPI scorecard" subtitle="Bar = actual, tick = target" bodyClassName="flex flex-col gap-5 p-5">
            {r.kpis.map((k) => (
              <div key={k.key} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-[#334155]">{k.label}</span>
                  <span className="font-bold tabular-nums">{k.display}</span>
                </div>
                <div className="relative h-2 rounded-full bg-[#EEF0F5]">
                  <div
                    className="h-full rounded-full bg-[#4F46E5]"
                    style={{ width: `${Math.min(100, (k.actual / k.max) * 100)}%` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-full bg-[#0F172A] ring-2 ring-white"
                    style={{ left: `${(k.target / k.max) * 100}%` }}
                  />
                </div>
                <TargetNote k={k} />
              </div>
            ))}
          </Card>

          <Card
            title="Satisfaction"
            subtitle={`${SURVEY.responses} survey responses · average ${r.satisfaction}/5`}
            bodyClassName="flex flex-1 items-center justify-center p-6"
            className="h-full"
          >
            <Donut
              title="Satisfaction ratings"
              segments={SURVEY.ratings.map((x) => ({ label: x.label, value: x.count, color: x.color }))}
              centerValue={`${r.satisfaction}`}
              centerLabel="average rating"
            />
          </Card>
        </div>
      </Section>

      <Section title="Engagement" subtitle="Participation and attendance across the program" badge={`${SURVEY.engagement}% participation`}>
        <Card title="Engagement across sessions" subtitle="Share of attendees active vs. present in each session" bodyClassName="p-5 pr-3">
          <LineChart
            title="Engagement across sessions"
            labels={SESSIONS.map((s) => s.name)}
            series={[
              { key: "p", label: "Active participation", color: "#4F46E5", values: SESSIONS.map((s) => s.participation) },
              { key: "a", label: "Attendance", color: "#0D9488", values: SESSIONS.map((s) => s.attendance) },
            ]}
          />
        </Card>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {ENGAGEMENT_COUNTS.map((c) => (
            <div key={c.label} className="flex flex-col gap-1 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-4">
              <span className="text-[28px] font-extrabold leading-tight tracking-[-0.02em]">{c.value}</span>
              <span className="text-[13px] text-[#64748B]">{c.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Participants" subtitle={`${r.attended} attendees · ${r.attendance}% attendance`}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Attendance" subtitle="Registered versus attended" bodyClassName="p-6">
            <Donut
              title="Attendance"
              segments={[
                { label: "Attended", value: r.attended, color: "#4F46E5" },
                { label: "No-show", value: r.noShow, color: "#CBD5E1" },
              ]}
              centerValue={`${r.attendance}%`}
              centerLabel="attendance"
            />
          </Card>
          <Card title="Field of study" subtitle="Attendee background" bodyClassName="p-6">
            <Donut
              title="Field of study"
              segments={FIELDS.map((f) => ({ label: f, value: r.fields[f], color: FIELD_COLORS[f] }))}
              centerValue={`${r.attended}`}
              centerLabel="attendees"
            />
          </Card>
        </div>
      </Section>

      <Section title="Summary" subtitle="Outcomes and next steps">
        <div
          className={`flex flex-wrap items-center gap-5 rounded-[20px] border p-5 sm:p-6 ${
            r.score >= 70 ? "border-[#BBF7D0] bg-[#F0FDF4]" : "border-[#FDE68A] bg-[#FFFBEB]"
          }`}
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${
              r.score >= 70 ? "bg-[#16A34A]" : "bg-[#D97706]"
            }`}
          >
            {r.score >= 70 ? <CheckIcon size={22} /> : <AlertTriangleIcon size={22} />}
          </span>
          <div className="flex min-w-[220px] flex-1 flex-col gap-1">
            <span className="text-[17px] font-bold">
              {r.verdict} — {event.title}
            </span>
            <span className="text-sm leading-relaxed text-[#475569]">
              {r.met} of {r.kpis.length} targets met with {r.satisfaction}/5 satisfaction and{" "}
              {SURVEY.engagement}% engagement.
              {r.noShowRate > 10 && ` Reducing the ${r.noShowRate}% no-show rate is the clearest win for next time.`}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[30px] font-extrabold leading-none ${r.score >= 70 ? "text-[#15803D]" : "text-[#B45309]"}`}>
              {r.score}/100
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Success score</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { title: "Key achievements", items: r.achievements, numbered: false },
            { title: "Areas of concern", items: r.concerns, numbered: false },
            { title: "Recommendations", items: r.recommendations, numbered: true },
          ].map((col) => (
            <Card key={col.title} title={col.title} bodyClassName="px-5 py-1">
              <ul className="m-0 list-none p-0">
                {col.items.map((it, idx) => (
                  <li key={it.title} className="flex flex-col gap-1 border-b border-[#EEF0F5] py-3.5 last:border-b-0">
                    <span className="text-sm font-bold">
                      {col.numbered && `${idx + 1}. `}
                      {it.title}
                    </span>
                    <span className="text-[13px] leading-relaxed text-[#64748B]">{it.body}</span>
                  </li>
                ))}
                {col.items.length === 0 && (
                  <li className="py-3.5 text-[13px] text-[#64748B]">Nothing flagged.</li>
                )}
              </ul>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2 print:hidden">
          <button
            type="button"
            className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-5 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            <SparklesIcon size={17} />
            Ask AI about this report
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border-none bg-[#4F46E5] px-5 text-sm font-bold text-white hover:bg-[#4338CA]"
          >
            <DownloadIcon size={17} />
            Export report as PDF
          </button>
        </div>
      </Section>
    </div>
  );
}
