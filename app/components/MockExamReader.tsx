"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pause, Play, Printer, RotateCcw, Timer } from "lucide-react";
import { MarkdownBody } from "./MarkdownReader";

type Paper = {
  label: string;
  subtitle: string;
  questions: string;
  solutions: string;
};

function between(content: string, start: string, end?: string) {
  const startIndex = content.indexOf(start);
  const endIndex = end ? content.indexOf(end, startIndex + start.length) : content.length;
  return content.slice(startIndex, endIndex < 0 ? content.length : endIndex);
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining].map((value) => String(value).padStart(2, "0")).join(":");
}

export function MockExamReader({ content }: { content: string }) {
  const papers = useMemo<Paper[]>(
    () => [
      {
        label: "Mock 1",
        subtitle: "Most likely mix",
        questions: between(content, "# Mock Paper 1 - Most likely mix", "# Mock Paper 1 - Solutions"),
        solutions: between(content, "# Mock Paper 1 - Solutions", "# Mock Paper 2 - Architecture"),
      },
      {
        label: "Mock 2",
        subtitle: "Architecture and labs",
        questions: between(content, "# Mock Paper 2 - Architecture", "# Mock Paper 2 - Solutions"),
        solutions: between(content, "# Mock Paper 2 - Solutions", "# Mock Paper 3 - Harder"),
      },
      {
        label: "Mock 3",
        subtitle: "Harder integrated paper",
        questions: between(content, "# Mock Paper 3 - Harder", "# Mock Paper 3 - Solutions"),
        solutions: between(content, "# Mock Paper 3 - Solutions", "# How to score yourself"),
      },
    ],
    [content],
  );

  const [paperIndex, setPaperIndex] = useState(0);
  const [solutions, setSolutions] = useState(false);
  const [seconds, setSeconds] = useState(3 * 60 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  const choosePaper = (index: number) => {
    setPaperIndex(index);
    setSolutions(false);
    setRunning(false);
    setSeconds(3 * 60 * 60);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mock-shell">
      <div className="mock-toolbar">
        <div className="tabs" role="tablist" aria-label="Choose mock paper">
          {papers.map((paper, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={paperIndex === index}
              onClick={() => choosePaper(index)}
              key={paper.label}
            >
              {paper.label}<small>{paper.subtitle}</small>
            </button>
          ))}
        </div>
        <div className="timer-controls" aria-label="Three hour practice timer">
          <span className={seconds === 0 ? "expired" : ""}><Timer size={16} /> {formatTime(seconds)}</span>
          <button type="button" className="icon-button" onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause timer" : "Start timer"}>
            {running ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button type="button" className="icon-button" onClick={() => { setRunning(false); setSeconds(3 * 60 * 60); }} aria-label="Reset timer">
            <RotateCcw size={16} />
          </button>
          <button type="button" className="icon-button" onClick={() => window.print()} aria-label="Print current paper">
            <Printer size={16} />
          </button>
        </div>
      </div>

      <div className="solution-toggle">
        <div>
          <strong>{papers[paperIndex].label}: {papers[paperIndex].subtitle}</strong>
          <span>100 marks. Attempt the paper before opening its marking guide.</span>
        </div>
        <button type="button" className="button secondary" onClick={() => setSolutions((value) => !value)}>
          {solutions ? <EyeOff size={16} /> : <Eye size={16} />}
          {solutions ? "Hide solutions" : "Show solutions"}
        </button>
      </div>

      <div className="document-panel mock-paper">
        <MarkdownBody content={papers[paperIndex].questions} />
        {solutions ? (
          <div className="solutions-panel">
            <MarkdownBody content={papers[paperIndex].solutions} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
