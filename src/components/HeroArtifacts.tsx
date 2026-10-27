"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

function Checkbox({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] bg-brand">
      <Check size={10} strokeWidth={3} className="text-white" />
    </span>
  ) : (
    <span className="h-3.5 w-3.5 shrink-0 rounded-[3px] border border-neutral-400" />
  );
}

function RunOfShowCard() {
  return (
    <div className="relative w-[220px] -rotate-6 rounded-2xl bg-amber-100 p-2.5 pt-4 shadow-soft">
      <span className="absolute left-1/2 top-0 h-3 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-neutral-300 to-neutral-400 shadow-sm" />
      <div className="rounded-lg bg-white p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">Run of show</p>
          <p className="text-[10px] text-muted-foreground">Fri 25 Mar</p>
        </div>
        <ul className="mt-2.5 space-y-1.5 text-[11px] text-foreground">
          <li className="flex items-center gap-1.5">
            <Checkbox checked />
            <span>8:00 Venue setup</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Checkbox checked />
            <span>9:00 Registration</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Checkbox checked={false} />
            <span className="text-neutral-400 line-through">9:30 Keynote</span>
            <span className="font-hand text-[13px] text-red-500">9:45??</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Checkbox checked={false} />
            <span>11:00 Panel talk</span>
          </li>
          <li className="font-hand pl-5 text-[13px] leading-none text-red-500">
            ↳ need a 3rd speaker!
          </li>
          <li className="flex items-center gap-1.5">
            <Checkbox checked={false} />
            <span>12:30 Lunch</span>
          </li>
        </ul>
      </div>
      <p className="font-hand mt-2 px-1 text-[13px] text-sky-700">
        Projector in Hall B broken
      </p>
    </div>
  );
}

function CateringReceiptCard() {
  return (
    <div className="w-[180px] rotate-3 rounded-lg bg-white p-3 shadow-soft">
      <p className="text-[11px] font-bold tracking-wide text-foreground">
        SOKHA CATERING
      </p>
      <p className="text-[9px] text-muted-foreground">Order #2291, 25/03/27</p>
      <div className="mt-2 space-y-1 border-t border-dashed border-border pt-2 text-[10px] text-foreground">
        <div className="flex justify-between">
          <span>Lunch box x150</span>
          <span>$1,350</span>
        </div>
        <div className="flex justify-between">
          <span>Coffee bar</span>
          <span>$420</span>
        </div>
        <div className="flex justify-between">
          <span>Desserts</span>
          <span>$310</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-2">
        <span className="text-[11px] font-bold">TOTAL</span>
        <span className="rounded-full border-2 border-red-500 px-2 py-0.5 text-[11px] font-bold text-red-500">
          $2,080
        </span>
      </div>
      <p className="font-hand mt-2 text-[13px] text-red-500">
        over budget?? ask Dara
      </p>
    </div>
  );
}

function BadgeCard() {
  return (
    <div className="flex w-[180px] flex-col items-center">
      <span className="h-10 w-5 rounded-t-sm bg-brand-gradient" />
      <span className="-mt-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-neutral-300 shadow-sm" />
      <div className="-mt-1 w-full overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="bg-brand-gradient px-3 py-2 text-center text-[11px] font-semibold text-white">
          JatJeng Summit 2027
        </div>
        <div className="flex flex-col items-center gap-1 px-3 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-warm text-sm font-bold text-white">
            SK
          </span>
          <p className="font-display text-sm font-bold text-foreground">
            Sophea Kim
          </p>
          <p className="text-[10px] text-muted-foreground">Head of Product</p>
        </div>
        <div className="bg-foreground py-1.5 text-center text-[10px] font-medium text-white">
          Speaker · Hall A
        </div>
      </div>
    </div>
  );
}

function TicketCard() {
  return (
    <div className="relative w-[210px] -rotate-6">
      <div className="flex overflow-hidden rounded-lg bg-amber-100 shadow-soft">
        <div className="flex-1 p-3">
          <p className="text-[9px] font-semibold tracking-wide text-amber-700">
            ADMIT ONE
          </p>
          <p className="font-display text-sm font-bold text-foreground">
            Product Launch 2027
          </p>
          <p className="mt-1 text-[10px] text-neutral-600">
            Fri 25 Mar, 9:00 AM
          </p>
          <p className="text-[10px] text-neutral-600">Hall B, row C</p>
        </div>
        <div className="relative flex w-7 items-center justify-center border-l-2 border-dashed border-amber-300 bg-amber-200/70">
          <span className="font-hand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[9px] text-amber-700">
            No. 0124
          </span>
        </div>
      </div>
      <span className="absolute -right-1.5 top-2 rotate-12 rounded border-2 border-red-500 bg-white/90 px-1 py-0.5 text-[8px] font-bold text-red-500">
        Checked In
      </span>
      <p className="font-hand absolute -top-5 right-0 rotate-3 text-[12px] text-sky-700">
        print 2 more!
      </p>
      <p className="font-hand absolute -bottom-5 left-2 -rotate-2 text-[12px] text-sky-700">
        +1 for Sam?
      </p>
    </div>
  );
}

export default function HeroArtifacts() {
  const reduceMotion = useReducedMotion();

  const pop = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, scale: 0.85, y: 14 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <motion.div
        {...pop(0.5)}
        className="absolute left-[1%] top-[6%] flex flex-col items-start gap-5"
      >
        <RunOfShowCard />
        <div className="self-end pr-2">
          <CateringReceiptCard />
        </div>
      </motion.div>

      <motion.div
        {...pop(0.6)}
        className="absolute right-[2%] top-[4%] flex flex-col items-end gap-8"
      >
        <BadgeCard />
        <TicketCard />
      </motion.div>
    </div>
  );
}
