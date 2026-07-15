import type { Metadata } from "next";
import { InteractiveLabs } from "../components/InteractiveLabs";

export const metadata: Metadata = {
  title: "Interactive Numerical Labs",
};

export default function LabsPage() {
  return (
    <>
      <header className="page-title">
        <p className="eyebrow">Mathematics you can see</p>
        <h1>Interactive numerical tutorials</h1>
        <p>
          Each lab begins with a physical idea, labels every symbol, substitutes the current values into
          the formula, and ends with the exact answer format expected in an exam.
        </p>
      </header>
      <InteractiveLabs />
    </>
  );
}
