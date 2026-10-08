import { eras, tours } from "@/content/site";

export function Fallback() {
  return (
    <div className="h-dvh overflow-y-auto bg-background text-foreground">
      <article className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm tracking-wide text-primary uppercase">Northampton</p>
          <h1 className="font-heading text-4xl leading-tight">Northampton Castle</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            This browser cannot start the 3D view. The four stories are written out below, in the
            same words as the captions.
          </p>
        </header>
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl">Nine moments</h2>
          <ol className="flex flex-col gap-2">
            {eras.map((era) => (
              <li key={era.id} className="rounded-xl bg-card px-4 py-3">
                <p className="font-medium">
                  {era.year} · {era.label}
                </p>
                <p className="text-sm text-muted-foreground">{era.blurb}</p>
              </li>
            ))}
          </ol>
        </section>
        {tours.map((tour) => (
          <section key={tour.id} className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl">{tour.title}</h2>
            <p className="text-muted-foreground">{tour.summary}</p>
            <ol className="flex list-decimal flex-col gap-3 ps-5">
              {tour.beats.map((beat, index) => (
                <li key={index} className="leading-relaxed">
                  {beat.caption}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </article>
    </div>
  );
}
