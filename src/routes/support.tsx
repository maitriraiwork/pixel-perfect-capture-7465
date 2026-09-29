import { createFileRoute } from "@tanstack/react-router";

import { Stickers } from "@/components/Stickers";
import { TabBar } from "@/components/TabBar";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — MamaCare" },
      {
        name: "description",
        content:
          "Postpartum helplines in India, the US and the UK, plus a check-in summary you can bring to your doctor.",
      },
      { property: "og:title", content: "Support — MamaCare" },
      {
        property: "og:description",
        content: "Postpartum helplines and a check-in summary for your doctor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Support,
});

const HELPLINES = [
  { region: "India", name: "Tele-MANAS", number: "14416", tel: "14416" },
  {
    region: "India",
    name: "NIMHANS Perinatal",
    number: "+91 8105711277",
    tel: "+918105711277",
  },
  {
    region: "US",
    name: "Postpartum Support International",
    number: "1-800-944-4773",
    tel: "18009444773",
  },
  { region: "UK", name: "PANDAS Foundation", number: "0808 1961 776", tel: "08081961776" },
];

function Support() {
  return (
    <div className="min-h-screen bg-background">
      <TabBar />
      <main className="relative mx-auto max-w-2xl px-4 pb-16 pt-8">
        <Stickers page="support" />
        <h1 className="text-2xl text-foreground sm:text-3xl">
          You deserve support.{" "}
          <span className="sticker-float inline-block" style={{ ["--sticker-rotate" as string]: "8deg" }}>
            🌷
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          These lines are free and confidential. Reaching out is a strong, loving thing to do. 🤍
        </p>

        <div className="mt-6 space-y-3">
          {HELPLINES.map((line) => (
            <div key={line.name} className="card-soft flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {line.region}
                </p>
                <p className="mt-1 text-card-foreground">{line.name}</p>
                <p className="text-sm text-muted-foreground">{line.number}</p>
              </div>
              <a
                href={`tel:${line.tel}`}
                className="flex h-12 shrink-0 items-center rounded-full bg-primary px-5 text-sm text-primary-foreground"
              >
                Call
              </a>
            </div>
          ))}

          <div className="card-soft flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">International</p>
              <p className="mt-1 text-card-foreground">Find a helpline near you</p>
              <p className="text-sm text-muted-foreground">findahelpline.com</p>
            </div>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-12 shrink-0 items-center rounded-full border border-primary px-5 text-sm text-accent-foreground"
            >
              Open
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Whoever you call, they will be glad you did. 🌼
        </p>
      </main>
    </div>
  );
}
