import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { TabBar } from "@/components/TabBar";
import { EPDS_QUESTIONS, evaluate, saveResult, type EpdsResult } from "@/lib/epds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Check-In — MamaCare" },
      {
        name: "description",
        content:
          "A private, gentle postpartum check-in for new mothers, based on the 10-question EPDS.",
      },
      { property: "og:title", content: "Check-In — MamaCare" },
      {
        property: "og:description",
        content: "A private, gentle postpartum check-in for new mothers.",
      },
    ],
  }),
  component: CheckIn,
});

const riskStyles = {
  low: "bg-risk-low-soft border-risk-low",
  moderate: "bg-risk-moderate-soft border-risk-moderate",
  high: "bg-risk-high-soft border-risk-high",
} as const;

const riskText = {
  low: "text-risk-low",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
} as const;

function CheckIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<EpdsResult | null>(null);

  const question = EPDS_QUESTIONS[step]!;
  const done = answers.length === EPDS_QUESTIONS.length;

  function choose(score: number) {
    const next = [...answers];
    next[step] = score;
    setAnswers(next);
    if (step < EPDS_QUESTIONS.length - 1) setStep(step + 1);
  }

  function seeResult() {
    const r = evaluate(answers);
    saveResult(r);
    setResult(r);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <TabBar />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-8">
        <h1 className="text-2xl leading-snug text-foreground sm:text-3xl">
          Hi mama. This is a private space for you.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ten short questions about the past week. Nothing you write leaves this device.
        </p>

        {!result && (
          <section className="mt-8 card-soft">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Question {step + 1} of {EPDS_QUESTIONS.length}
              </span>
              {answers[step] !== undefined && <span>Answered</span>}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${((step + 1) / EPDS_QUESTIONS.length) * 100}%` }}
              />
            </div>

            <h2 className="mt-6 text-xl leading-snug text-card-foreground">{question.text}</h2>

            <div className="mt-5 flex flex-col gap-3">
              {question.options.map((option) => {
                const selected = answers[step] === option.score;
                return (
                  <button
                    key={option.label}
                    onClick={() => choose(option.score)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary-soft text-accent-foreground"
                        : "border-border bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="h-12 rounded-full px-4 text-sm text-muted-foreground disabled:opacity-40"
              >
                Back
              </button>
              {step < EPDS_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={answers[step] === undefined}
                  className="h-12 rounded-full bg-primary px-6 text-sm text-primary-foreground disabled:opacity-40"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={seeResult}
                  disabled={!done}
                  className="h-12 rounded-full bg-primary px-6 text-sm text-primary-foreground disabled:opacity-40"
                >
                  See my result
                </button>
              )}
            </div>
          </section>
        )}

        {result && (
          <section className={`mt-8 rounded-2xl border p-5 shadow-sm ${riskStyles[result.level]}`}>
            <p className={`text-xs uppercase tracking-wide ${riskText[result.level]}`}>
              Your score: {result.total} of 30
            </p>
            <h2 className="mt-2 text-xl text-foreground">{result.message}</h2>
            {result.urgent && (
              <p className="mt-3 text-sm text-foreground">
                You mentioned thoughts of harming yourself. You are not alone in this, mama — please
                talk to someone right now. In India call Tele-MANAS at 14416, in the US call
                1-800-944-4773, in the UK call 0808 1961 776.
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {result.level === "high" && (
                <button
                  onClick={() => navigate({ to: "/support" })}
                  className="h-12 rounded-full bg-risk-high px-6 text-sm text-primary-foreground"
                >
                  Talk to someone now
                </button>
              )}
              <button
                onClick={() => navigate({ to: "/talk" })}
                className="h-12 rounded-full border border-primary px-6 text-sm text-accent-foreground"
              >
                Talk it through
              </button>
              <button
                onClick={restart}
                className="h-12 rounded-full px-4 text-sm text-muted-foreground"
              >
                Start over
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              This check-in is not a diagnosis. Please share it with your doctor or midwife.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
