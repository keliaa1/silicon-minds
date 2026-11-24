import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { ProjectDeck } from "./components/ProjectDeck";
import { RevealObserver } from "./components/RevealObserver";
import { ScrambleTitle } from "./components/ScrambleTitle";
import { TeamCarousel } from "./components/TeamCarousel";
import {
  collaborators,
  growthSteps,
  phases,
} from "./content";

const shell = "mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12";
const titleMedium = "text-[clamp(1.75rem,min(3.2vw,6.6svh),3.25rem)]";
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const titleCompact = "text-[clamp(1.5rem,min(2.2vw,5.4svh),2.5rem)]";

function SectionTag({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p data-reveal="up" className="label flex items-center gap-3">
      <span>{n}</span>
      <span aria-hidden="true" className="h-px w-8 bg-current" />
      <span>{children}</span>
    </p>
  );
}

function About() {
  const benefits = [
    "A clear AI learning pathway",
    "Projects with real-world purpose",
    "Peer learning and mentorship",
    "Practical engineering skills",
    "A student-led community",
    "Room to build and innovate",
  ];

  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className={`${shell} about-layout`}>
        <div data-reveal="up" className="about-visual">
          <Image
            src="/logo.svg"
            alt="Silicon Minds logo: connected navy initials with teal accents"
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 44vw, 600px"
            className="about-image"
          />
        </div>
        <div className="about-copy">
          <p data-reveal="up" className="label about-tag">About us</p>
          <h2 id="about-title" data-reveal="up" style={delay(80)} className="section-title about-title">
            Learn together. Build with AI. Solve real problems.
          </h2>
          <p data-reveal="up" style={delay(150)} className="about-description">
            Silicon Minds is a student-led AI community starting at Rwanda Coding
            Academy. We bring a clear roadmap, practical skills and human guidance
            together, helping students turn their curiosity into working AI systems.
          </p>
          <ul data-reveal="stagger" style={delay(220)} className="about-benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
                  <circle cx="10" cy="10" r="10" fill="currentColor" />
                  <path d="m5.8 10 2.7 2.7 5.7-5.4" fill="none" stroke="var(--paper)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <p data-reveal="up" style={delay(300)} className="about-status">
            <span aria-hidden="true" />
            Taking shape at RCA ? Phase 1: Establishment
          </p>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const inClass = ["Timetables", "Classes and practical sessions", "Instructors", "Assignments", "Clear progression"];
  const alone = ["Where do I begin?", "What do I learn next?", "Which concepts are essential?", "Which tools matter?", "How do these areas connect?"];
  return (
    <section className="fit-section bg-paper">
      <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:items-center`}>
        <div className="lg:col-span-6">
          <SectionTag n="02">The problem</SectionTag>
          <ScrambleTitle className={`section-title mt-5 ${titleMedium}`}>
            The challenge is not a lack of interest.
          </ScrambleTitle>
          <p data-reveal="up" style={delay(150)} className="mt-5 max-w-[56ch] leading-relaxed text-muted-light lg:text-lg">
            AI is a long and technically demanding field, and learning it alone is
            fragmented. The gap is a coordinated environment: a clear roadmap, structured
            learning, human guidance and a community to continue the journey with.
          </p>
        </div>
        <div data-reveal="stagger" style={delay(200)} className="grid gap-8 sm:grid-cols-2 lg:col-span-6">
          <div>
            <h3 className="label border-b border-ink pb-3">Learning at RCA</h3>
            <ul>
              {inClass.map((item) => (
                <li key={item} className="border-b border-ink/20 py-3 leading-snug">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label border-b border-ink pb-3">Learning AI alone</h3>
            <ul>
              {alone.map((item) => (
                <li key={item} className="border-b border-ink/20 py-3 font-semibold leading-snug">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="work on-signal bg-signal">
      <div className={`${shell} work-copy`}>
        <SectionTag n="03">The work</SectionTag>
        <ScrambleTitle className={`section-title mt-4 ${titleMedium}`}>
          Problem first. Then the model.
        </ScrambleTitle>
        <p data-reveal="up" style={delay(150)} className="work-description">
          Student ideas for real-world problems. Explore a sample project to see how it could work.
        </p>
      </div>
      <ProjectDeck />
    </section>
  );
}

function Path() {
  return (
    <section id="path" className="fit-section bg-fog">
      <div className={`${shell} grid gap-10 lg:grid-cols-2 lg:gap-14`}>
        <div>
          <SectionTag n="04">At RCA</SectionTag>
          <ScrambleTitle className={`section-title mt-4 ${titleCompact}`}>Five phases at RCA.</ScrambleTitle>
          <ol data-reveal="stagger" style={delay(150)} className="mt-4 border-t border-ink">
            {phases.map((phase, index) => (
              <li key={phase.title} className="grid grid-cols-[28px_1fr] gap-x-2 border-b border-ink py-1.5 xl:grid-cols-[28px_190px_1fr]">
                <span className="label pt-0.5">{index + 1}</span>
                <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold leading-tight">
                  {phase.title}
                  {index === 0 && (
                    <span className="label bg-ink px-1.5 py-0.5 font-normal text-paper">Now</span>
                  )}
                </h3>
                <p className="col-start-2 mt-1 text-sm leading-snug text-muted-light xl:col-start-3 xl:mt-0">{phase.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionTag n="05">Beyond RCA</SectionTag>
          <ScrambleTitle className={`section-title mt-4 ${titleCompact}`}>Then, a national network.</ScrambleTitle>
          <ol data-reveal="stagger" style={delay(150)} className="mt-4 border-t border-ink">
            {growthSteps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[28px_1fr] gap-x-2 border-b border-ink py-1.5 xl:grid-cols-[28px_190px_1fr]">
                <span className="label pt-0.5">{index + 1}</span>
                <h3 className="text-sm font-bold leading-tight">{step.title}</h3>
                <p className="col-start-2 mt-1 text-sm leading-snug text-muted-light xl:col-start-3 xl:mt-0">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div data-reveal="up" className={`${shell} mt-6 lg:mt-[3svh]`}>
        <h3 className="label border-b border-ink pb-2">Working with other RCA clubs</h3>
        <ul className="grid sm:grid-cols-3">
          {collaborators.map((item) => (
            <li key={item.club} className="border-b border-ink/25 py-2.5 sm:border-b-0 sm:pr-8">
              <p className="font-bold">{item.club}</p>
              <p className="text-sm leading-snug text-muted-light">{item.focus}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="fit-section overflow-hidden bg-paper">
      <div className={shell}>
        <p data-reveal="up" className="label flex justify-center"><span>06 — The team</span></p>
        <ScrambleTitle className={`section-title mt-3 text-center ${titleMedium}`}>
          Meet the Silicon Minds
        </ScrambleTitle>
      </div>
      <div data-reveal="up" style={delay(150)}>
        <TeamCarousel />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="top" className="flex-1">
      <Hero />
      <About />
      <Problem />
      <Work />
      <Path />
      <Team />
      <Footer />
      <RevealObserver />
    </main>
  );
}
