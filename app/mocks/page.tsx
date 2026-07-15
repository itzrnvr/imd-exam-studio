import type { Metadata } from "next";
import mockPapers from "../../content/imd_mock_papers.md?raw";
import { MockExamReader } from "../components/MockExamReader";

export const metadata: Metadata = {
  title: "100-Mark Mock Papers",
};

export default function MocksPage() {
  return (
    <>
      <header className="page-title">
        <p className="eyebrow">Timed exam rehearsal</p>
        <h1>Three complete 100-mark mock papers</h1>
        <p>
          Use the built-in three-hour timer, write your answers away from the screen, then reveal the
          marking guide. The pattern is inferred from the supplied previous paper, not an official prediction.
        </p>
      </header>
      <MockExamReader content={mockPapers} />
    </>
  );
}
