"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appPathname, sitePath } from "../lib/site-path";
import {
  BookOpenText,
  BrainCircuit,
  Calculator,
  Clock3,
  FileCheck2,
  FlaskConical,
  Home,
  Sigma,
} from "lucide-react";

const navigation = [
  { href: "/", label: "Start here", icon: Home },
  { href: "/guide", label: "Complete guide", icon: BookOpenText },
  { href: "/labs", label: "Interactive labs", icon: FlaskConical },
  { href: "/practice", label: "Numerical practice", icon: Calculator },
  { href: "/mocks", label: "100-mark mocks", icon: FileCheck2 },
  { href: "/formulas", label: "Formula sheet", icon: Sigma },
];

export function StudyShell({ children }: { children: React.ReactNode }) {
  const pathname = appPathname(usePathname());

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link href={sitePath("/")} className="brand" aria-label="IMD Exam Studio home">
            <span className="brand-mark" aria-hidden="true">
              <BrainCircuit size={21} />
            </span>
            <span>
              <strong>IMD Exam Studio</strong>
              <small>6-7 hour end-term sprint</small>
            </span>
          </Link>
          <div className="header-status" aria-label="Study goal">
            <Clock3 size={16} aria-hidden="true" />
            <span>100-mark preparation</span>
          </div>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Primary navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={sitePath(href)} className={active ? "active" : ""}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="main-frame">
        <aside className="side-rail">
          <nav aria-label="Primary navigation">
            <p className="nav-kicker">Study workspace</p>
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link key={href} href={sitePath(href)} className={`side-link ${active ? "active" : ""}`}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="rail-note">
            <strong>Numerical rule</strong>
            <span>Given {" -> "} Formula {" -> "} Substitute {" -> "} Answer</span>
          </div>
        </aside>
        <main className="site-main">{children}</main>
      </div>
    </div>
  );
}
