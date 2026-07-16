import type { Metadata } from "next";
import { SurpriseExam } from "../components/SurpriseExam";

export const dynamic = "force-static";

export const metadata: Metadata = { title: "Surprise Exam Mode" };

export default function SurprisePage() {
  return <>
    <header className="page-title">
      <p className="eyebrow">Pattern-independent preparation</p>
      <h1>Surprise exam generator</h1>
      <p>Generate unfamiliar 25, 50, or 100-mark papers from the whole course. Change the balance to practise numericals, theory, or design questions under uncertainty.</p>
    </header>
    <SurpriseExam />
  </>;
}
