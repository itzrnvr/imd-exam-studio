import type { Metadata } from "next";
import workbook from "../../content/imd_numerical_workbook.md?raw";
import { PracticeReader } from "../components/PracticeReader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Numerical Practice",
};

export default function PracticePage() {
  return (
    <>
      <header className="page-title">
        <p className="eyebrow">Practice until the method feels automatic</p>
        <h1>Numerical workbook</h1>
        <p>
          Start with the worked examples, cover each solution, and then attempt the independent drills.
          Every problem follows Given {" -> "} Formula {" -> "} Substitution {" -> "} Answer.
        </p>
      </header>
      <PracticeReader content={workbook} />
    </>
  );
}
