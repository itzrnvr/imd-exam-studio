"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, PencilLine } from "lucide-react";
import { MarkdownBody } from "./MarkdownReader";

type Tab = "worked" | "drills" | "answers";

export function PracticeReader({ content }: { content: string }) {
  const [tab, setTab] = useState<Tab>("worked");
  const [answersVisible, setAnswersVisible] = useState(false);

  const sections = useMemo(() => {
    const drillsMarker = "# Independent drills - do not look at the key";
    const answersMarker = "# Answer key";
    const drillsIndex = content.indexOf(drillsMarker);
    const answersIndex = content.indexOf(answersMarker);
    return {
      worked: content.slice(0, drillsIndex),
      drills: content.slice(drillsIndex, answersIndex),
      answers: content.slice(answersIndex),
    };
  }, [content]);

  return (
    <div className="practice-shell">
      <div className="tabs" role="tablist" aria-label="Numerical workbook sections">
        <button type="button" role="tab" aria-selected={tab === "worked"} onClick={() => setTab("worked")}>
          <PencilLine size={16} aria-hidden="true" /> 35 worked examples
        </button>
        <button type="button" role="tab" aria-selected={tab === "drills"} onClick={() => setTab("drills")}>
          <CheckCircle2 size={16} aria-hidden="true" /> 36 independent drills
        </button>
        <button type="button" role="tab" aria-selected={tab === "answers"} onClick={() => setTab("answers")}>
          <Eye size={16} aria-hidden="true" /> Answer key
        </button>
      </div>

      {tab === "answers" ? (
        <div className="answer-gate">
          <div>
            <strong>Attempt before revealing.</strong>
            <span>The answer key is useful only after you have written a formula and substitution.</span>
          </div>
          <button type="button" className="button secondary" onClick={() => setAnswersVisible((shown) => !shown)}>
            {answersVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            {answersVisible ? "Hide answers" : "Reveal answers"}
          </button>
        </div>
      ) : null}

      <div className="document-panel">
        {tab === "worked" ? <MarkdownBody content={sections.worked} /> : null}
        {tab === "drills" ? <MarkdownBody content={sections.drills} /> : null}
        {tab === "answers" && answersVisible ? <MarkdownBody content={sections.answers} /> : null}
        {tab === "answers" && !answersVisible ? (
          <div className="locked-message">
            <EyeOff size={28} aria-hidden="true" />
            <strong>Answers are hidden</strong>
            <span>Choose Reveal answers when your written attempt is complete.</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
