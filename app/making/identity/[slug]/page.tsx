import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Gallery } from "@/components/Gallery";
import { identityProjects, getIdentityProject, getIdentityImages } from "@/content/identity-work";

export function generateStaticParams() {
  return identityProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = getIdentityProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name} — Identity`,
    description: project.description ?? `Brand identity work for ${project.name}.`,
  };
}

export default async function IdentityProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getIdentityProject((await params).slug);
  if (!project) notFound();

  const images = getIdentityImages(project.slug);

  return (
    <PageShell
      side="recto"
      eyebrow={`Making · Identity · ${images.length} images`}
      title={project.name}
      standfirst={project.description}
    >
      <Gallery
        items={images.map((src, i) => ({ src, alt: `${project.name}, image ${i + 1}` }))}
        initial={9}
        sizes="(max-width: 760px) 100vw, 50vw"
      />
    </PageShell>
  );
}
