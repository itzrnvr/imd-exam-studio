import type { Metadata } from "next";
import guide from "../../content/imd_study_guide.md?raw";
import { MarkdownReader } from "../components/MarkdownReader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Complete Study Guide",
};

export default function GuidePage() {
  return (
    <>
      <header className="page-title">
        <p className="eyebrow">All lectures, one reading path</p>
        <h1>Complete Intelligent Model Design guide</h1>
        <p>
          Search by heading or use the contents rail. Every recurring formula is followed by a symbol
          explanation and an exam-focused interpretation.
        </p>
      </header>
      <MarkdownReader content={guide} label="Guide contents" />
    </>
  );
}
