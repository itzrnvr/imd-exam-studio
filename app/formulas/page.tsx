import type { Metadata } from "next";
import formulaSheet from "../../content/imd_formula_sheet.md?raw";
import { MarkdownReader } from "../components/MarkdownReader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Formula and Symbol Sheet",
};

export default function FormulaPage() {
  return (
    <>
      <header className="page-title">
        <p className="eyebrow">Final 20-30 minutes</p>
        <h1>Formula and symbol sheet</h1>
        <p>
          Compact enough for the last revision pass, but explicit enough that no letter in an equation
          is left unexplained.
        </p>
      </header>
      <MarkdownReader content={formulaSheet} compact label="Formula index" />
    </>
  );
}
