import { Plus_Jakarta_Sans } from "next/font/google";
import HomeShell from "@/components/events/HomeShell";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

// Shell for the events home (AI prompt) and the "Your events" list.
export default function EventsHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${jakarta.className} flex flex-1 flex-col`}>
      <HomeShell>{children}</HomeShell>
    </div>
  );
}
