"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { projectQuestions, projects, type Project } from "../content";
import { ProjectArt } from "./ProjectArt";

const PROJECT_COUNT = projects.length;
const INITIAL_ACTIVE = 3;
const JITTER = [8, -6, 4, 0, -8, 6, -4];
const TWIST = [2, -3, 1, 0, 3, -2, 1];

const projectNumber = (project: Project) => String(project.n).padStart(2, "0");

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 10 14" width="10" height="14" aria-hidden="true">
      <path d={direction === "left" ? "M10 0V14L0 7Z" : "M0 0V14L10 7Z"} fill="currentColor" />
    </svg>
  );
}

function RingText() {
  return (
    <svg viewBox="0 0 1000 1000" className="deck-dial-ring" aria-hidden="true" focusable="false">
      <defs>
        <path id="sm-ring" d="M500 500m-468 0a468 468 0 1 1 936 0a468 468 0 1 1 -936 0" />
      </defs>
      <text className="svg-mono" fontSize="19" fill="var(--ink)" textLength="2925" letterSpacing="4">
        <textPath href="#sm-ring">
          BUILDING THE INTELLIGENCE OF TOMORROW — RWANDA CODING ACADEMY — LEARN AI — BUILD AI SKILLS — ENGINEER AI SYSTEMS — SOLVE REAL PROBLEMS —
        </textPath>
      </text>
    </svg>
  );
}

function ProjectBrief({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="project-sheet">
      <div className="project-art" aria-hidden="true">
        <ProjectArt n={project.n} />
      </div>
      <div className="project-body">
        <p className="label flex flex-wrap items-center gap-3">
          <span>Project {projectNumber(project)}/{String(PROJECT_COUNT).padStart(2, "0")}</span>
          <span className="project-sample">Sample brief</span>
        </p>
        <h3 id="project-title" className="display project-title">{project.title}</h3>
        <p className="project-summary">{project.summary}</p>

        <dl className="project-answers">
          {projectQuestions.map((question, index) => (
            <div key={question}>
              <dt className="label">{question}</dt>
              <dd>{project.answers[index]}</dd>
            </div>
          ))}
        </dl>

        <ul className="project-stack" aria-label="Technology">
          {project.stack.map((item) => (
            <li key={item} className="label">{item}</li>
          ))}
        </ul>
      </div>
      <button type="button" className="project-close" aria-label="Close project" onClick={onClose}>
        <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true" focusable="false">
          <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
}

export function ProjectDeck() {
  const [active, setActive] = useState(INITIAL_ACTIVE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (openIndex !== null && dialog && !dialog.open) dialog.showModal();
  }, [openIndex]);

  const closeDialog = () => dialogRef.current?.close();
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  const current = ((active % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
  const currentProject = projects[current];

  return (
    <div className="project-deck" data-reveal="fade">
      <button
        type="button"
        className="deck-arrow deck-arrow-left"
        aria-label="Previous project"
        onClick={() => setActive((value) => value - 1)}
      >
        <Arrow direction="left" />
      </button>
      <button
        type="button"
        className="deck-arrow deck-arrow-right"
        aria-label="Next project"
        onClick={() => setActive((value) => value + 1)}
      >
        <Arrow direction="right" />
      </button>

      <div className="deck-fan" style={{ "--spin": active - INITIAL_ACTIVE } as CSSProperties}>
        <div className="deck-dial" aria-hidden="true">
          <RingText />
        </div>

        {projects.map((project, index) => {
          const wraps = Math.round((active - index) / PROJECT_COUNT);
          const offset = index - active + PROJECT_COUNT * wraps;
          const style = {
            "--o": offset,
            "--dy": `${JITTER[index]}px`,
            "--tw": `${TWIST[index]}deg`,
            "--delay": `${Math.abs(offset) * 70}ms`,
            "--stagger": `${Math.min(Math.abs(offset), 3) * 40}ms`,
            zIndex: 10 - Math.abs(offset),
          } as CSSProperties;
          return (
            <button
              key={`${index}:${wraps}`}
              type="button"
              className="deck-card"
              style={style}
              aria-haspopup="dialog"
              aria-label={`Open project ${project.n} of ${PROJECT_COUNT}: ${project.title}`}
              onClick={() => {
                setActive((value) => value + offset);
                setOpenIndex(index);
              }}
            >
              <span className="deck-card-face">
                <ProjectArt n={project.n} />
              </span>
            </button>
          );
        })}

        <div className="deck-dial-label">
          <svg viewBox="0 0 10 7" width="10" height="7" aria-hidden="true">
            <path d="M5 0L10 7H0Z" fill="currentColor" />
          </svg>
          <span aria-live="polite">
            {projectNumber(currentProject)} {currentProject.cardLines.join(" ")}
          </span>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="project-title"
        onClose={() => setOpenIndex(null)}
        onClick={closeOnBackdrop}
      >
        {openIndex !== null && <ProjectBrief project={projects[openIndex]} onClose={closeDialog} />}
      </dialog>
    </div>
  );
}
