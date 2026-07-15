"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Calculator,
  Check,
  Circle,
  FileCheck2,
  FlaskConical,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react";

const plan = [
  { time: "0:00-0:20", task: "Read notation, exam pattern, and the GFSA method" },
  { time: "0:20-1:35", task: "Master CNN output sizes, parameters, dilation, and receptive field" },
  { time: "1:35-2:25", task: "Practice RNN, LSTM, and GRU equations and parameter counts" },
  { time: "2:25-3:05", task: "Work through attention and ViT patch arithmetic" },
  { time: "3:05-3:50", task: "Revise GAN, autoencoder, attacks, and regularization" },
  { time: "3:50-4:20", task: "Review XAI, transfer learning, data bias, and lab concepts" },
  { time: "4:20-5:50", task: "Attempt Mock Paper 1 and mark it immediately" },
  { time: "Last 30 min", task: "Read only the formula sheet and redo wrong numericals" },
];

const highYield = [
  ["CNN arithmetic", "Output shape, parameters, dilation, receptive field", "Very high"],
  ["Sequence models", "RNN gradients, LSTM/GRU gates and updates", "Very high"],
  ["Attention + ViT", "Q/K/V, softmax weights, patches and tokens", "High"],
  ["Generative models", "GAN loop, Pix2Pix vs CycleGAN, losses", "High"],
  ["Short theory", "Bias, XAI, transfer, segmentation, regularization", "Medium"],
];

const resources = [
  {
    href: "/guide",
    title: "Complete guide",
    text: "Every lecture topic in one readable, searchable document.",
    icon: BookOpenText,
  },
  {
    href: "/labs",
    title: "Interactive labs",
    text: "Change values and watch the formulas, grids, gates, and losses respond.",
    icon: FlaskConical,
  },
  {
    href: "/practice",
    title: "Numerical workbook",
    text: "35 worked examples and 36 independent questions with answer reveals.",
    icon: Calculator,
  },
  {
    href: "/mocks",
    title: "Three mock papers",
    text: "Timed 100-mark papers with marking guides and complete solutions.",
    icon: FileCheck2,
  },
  {
    href: "/formulas",
    title: "Formula sheet",
    text: "A compact final-hour reference with every recurring symbol defined.",
    icon: Sigma,
  },
];

export function HomeDashboard() {
  const [done, setDone] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("imd-study-plan");
    if (saved) {
      try {
        setDone(JSON.parse(saved));
      } catch {
        setDone([]);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("imd-study-plan", JSON.stringify(done));
  }, [done, loaded]);

  const percent = useMemo(() => Math.round((done.length / plan.length) * 100), [done]);

  const toggle = (index: number) => {
    setDone((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={16} aria-hidden="true" /> Your exam command centre</p>
          <h1>Understand it visually. Practise it numerically. Recall it under pressure.</h1>
          <p className="hero-lede">
            Everything from your 16 lecture PDFs and the previous paper is organized here. Start with
            the high-risk calculations, then use the complete guide only when a concept needs repair.
          </p>
          <div className="hero-actions">
            <Link href="/labs" className="button primary">
              Start interactive numericals <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/guide" className="button secondary">Open complete guide</Link>
          </div>
        </div>
        <div className="hero-score" aria-label={`${percent} percent of study plan complete`}>
          <span className="score-label">Sprint progress</span>
          <strong>{percent}%</strong>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${percent}%` }} />
          </div>
          <small>{done.length} of {plan.length} study blocks completed on this device</small>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><Target size={15} aria-hidden="true" /> Follow this order</p>
            <h2>Your 6-7 hour rescue plan</h2>
          </div>
          <p>Check a block only after active recall or practice, not after passive reading.</p>
        </div>
        <div className="study-plan">
          {plan.map((item, index) => {
            const checked = done.includes(index);
            return (
              <button
                key={item.time}
                type="button"
                className={`plan-row ${checked ? "complete" : ""}`}
                onClick={() => toggle(index)}
                aria-pressed={checked}
              >
                <span className="plan-check" aria-hidden="true">
                  {checked ? <Check size={16} /> : <Circle size={16} />}
                </span>
                <span className="plan-time">{item.time}</span>
                <span className="plan-task">{item.task}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-block two-column">
        <div>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Exam radar</p>
              <h2>Where marks are most likely</h2>
            </div>
          </div>
          <div className="radar-list">
            {highYield.map(([topic, details, priority]) => (
              <div className="radar-row" key={topic}>
                <div>
                  <strong>{topic}</strong>
                  <span>{details}</span>
                </div>
                <span className={`priority ${priority.toLowerCase().replace(" ", "-")}`}>{priority}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="concept-map-wrap">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Mental map</p>
              <h2>How the subject connects</h2>
            </div>
          </div>
          <div className="concept-map" aria-label="Flow from data through models to trustworthy decisions">
            <div className="concept-node"><small>1</small><strong>Data</strong><span>shape, quality, bias</span></div>
            <span className="flow-arrow" aria-hidden="true">{" -> "}</span>
            <div className="concept-node"><small>2</small><strong>Representation</strong><span>CNN, RNN, ViT</span></div>
            <span className="flow-arrow" aria-hidden="true">{" -> "}</span>
            <div className="concept-node"><small>3</small><strong>Objective</strong><span>loss and training</span></div>
            <span className="flow-arrow" aria-hidden="true">{" -> "}</span>
            <div className="concept-node"><small>4</small><strong>Trust</strong><span>robustness and XAI</span></div>
          </div>
          <p className="map-note">
            Most exam answers improve when you connect architecture choice to data shape, training objective,
            and one limitation.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Everything in one place</p>
            <h2>Choose what you need now</h2>
          </div>
        </div>
        <div className="resource-grid">
          {resources.map(({ href, title, text, icon: Icon }) => (
            <Link href={href} className="resource-card" key={href}>
              <span className="resource-icon"><Icon size={20} aria-hidden="true" /></span>
              <strong>{title}</strong>
              <span>{text}</span>
              <small>Open <ArrowRight size={14} aria-hidden="true" /></small>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
