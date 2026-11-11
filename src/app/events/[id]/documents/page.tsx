import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/components/events/data";
import WorkspacePage, { PrimaryAction } from "@/components/events/WorkspacePage";
import DocumentsGrid from "@/components/events/DocumentsGrid";
import { UploadIcon } from "@/components/events/icons";

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]/documents">): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event ? `${event.title} · Documents` : "Event not found" };
}

export default async function EventDocumentsPage({ params }: PageProps<"/events/[id]/documents">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  return (
    <WorkspacePage
      event={event}
      title="Documents"
      subtitle="Files and resources shared with the event team."
      actions={
        <PrimaryAction>
          <UploadIcon size={17} />
          Upload document
        </PrimaryAction>
      }
    >
      <DocumentsGrid />
    </WorkspacePage>
  );
}
