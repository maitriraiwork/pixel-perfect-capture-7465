import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { TabBar } from "@/components/TabBar";
import { loadResult, RISK_LABEL, type EpdsResult } from "@/lib/epds";

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
  const [result, setResult] = useState<EpdsResult | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    setResult(loadResult());
  }, []);

  async function downloadSummary() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const date = result ? new Date(result.date) : new Date();
    doc.setFontSize(20);
    doc.text("MamaCare check-in summary", 20, 28);
    doc.setFontSize(12);
    doc.text(`Date: ${date.toLocaleDateString()}`, 20, 46);
    doc.text(
      result
        ? `EPDS score: ${result.total} of 30`
        : "EPDS score: no check-in completed on this device yet",
      20,
      58,
    );
    if (result) {
      doc.text(`Risk level: ${RISK_LABEL[result.level]}`, 20, 70);
      doc.text(`Note: ${result.message}`, 20, 82);
      if (result.urgent) {
        doc.text("Flag: answered yes to thoughts of self-harm (question 10).", 20, 94);
      }
    }
    doc.text("Please bring this to your doctor.", 20, result?.urgent ? 112 : 100);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mamacare-check-in.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setPdfUrl(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <TabBar />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-8">
        <h1 className="text-2xl text-foreground sm:text-3xl">You deserve support.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          These lines are free and confidential. Reaching out is a strong, loving thing to do.
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

        <section className="mt-8 card-soft">
          <h2 className="text-lg text-card-foreground">Bring it to your doctor</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {result
              ? `Latest check-in: ${result.total} of 30 · ${RISK_LABEL[result.level]} · ${new Date(
                  result.date,
                ).toLocaleDateString()}`
              : "Complete a check-in first and your score will appear here."}
          </p>
          <button
            onClick={downloadSummary}
            className="mt-4 h-12 w-full rounded-full bg-secondary px-6 text-sm text-secondary-foreground"
          >
            Download my check-in summary
          </button>
          {pdfUrl && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Didn't download?{" "}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener"
                download="mamacare-check-in.pdf"
                className="text-primary underline"
              >
                Open your summary PDF
              </a>
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
