"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { team, type TeamMember } from "../content";

const COUNT = team.length;
/** Horizontal distance from the centre, in active-card widths. */
const FIRST_STEP = 0.975;
const NEXT_STEP = 0.89;

const SOCIALS = [
  {
    key: "facebook",
    label: "Facebook",
    path: "M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6v-4H14c-4 0-4.9 3-4.9 4.9v2.1H6.6v4h2.5v10h4.9v-10h3.3l.5-4H14Z",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65V21h-4V9.75Z",
  },
  {
    key: "x",
    label: "X",
    path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L.9 2h6.4l4.4 5.9L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z",
  },
] as const;

function offsetToX(offset: number) {
  if (offset === 0) return 0;
  return Math.sign(offset) * (FIRST_STEP + (Math.abs(offset) - 1) * NEXT_STEP);
}

function Portrait({ member }: { member: TeamMember }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt=""
        fill
        sizes="(max-width: 768px) 56vw, 26vw"
        className="team-photo"
      />
    );
  }
  return (
    <svg viewBox="0 0 100 128" className="team-silhouette" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="21" />
      <path d="M10 128c0-32 18-50 40-50s40 18 40 50Z" />
    </svg>
  );
}

function Socials({ member }: { member: TeamMember }) {
  return (
    <div className="team-socials">
      {SOCIALS.map(({ key, label, path }) => {
        const icon = (
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
            <path d={path} fill="currentColor" />
          </svg>
        );
        const href = member.socials?.[key];
        return href ? (
          <a key={key} href={href} className="team-social" aria-label={`${member.name} on ${label}`}>
            {icon}
          </a>
        ) : (
          <span key={key} className="team-social" aria-hidden="true">
            {icon}
          </span>
        );
      })}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 10 14" width="9" height="12" aria-hidden="true" focusable="false">
      <path
        d={direction === "left" ? "M8 1 2 7l6 6" : "M2 1l6 6-6 6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function TeamCarousel() {
  const [active, setActive] = useState(Math.floor(COUNT / 2));
  const current = ((active % COUNT) + COUNT) % COUNT;

  return (
    <div className="team">
      <ul className="team-track">
        {team.map((member, index) => {
          const wraps = Math.round((active - index) / COUNT);
          const offset = index - active + COUNT * wraps;
          const isActive = offset === 0;
          return (
            <li
              key={`${index}:${wraps}`}
              className="team-slide"
              data-active={isActive || undefined}
              style={{ "--x": offsetToX(offset) } as CSSProperties}
            >
              <div className="team-frame">
                <button
                  type="button"
                  className="team-card"
                  aria-label={`Show ${member.name}`}
                  aria-current={isActive || undefined}
                  onClick={() => setActive((value) => value + offset)}
                >
                  <Portrait member={member} />
                </button>
                {isActive && <Socials member={member} />}
              </div>
              <div className="team-caption">
                <p className="team-name">{member.name}</p>
                {isActive && member.role && <p className="team-role">{member.role}</p>}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="team-controls">
        <div className="team-progress" aria-hidden="true">
          <span style={{ width: `${((current + 1) / COUNT) * 100}%` }} />
        </div>
        <button
          type="button"
          className="team-arrow"
          aria-label="Previous team member"
          onClick={() => setActive((value) => value - 1)}
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          className="team-arrow"
          aria-label="Next team member"
          onClick={() => setActive((value) => value + 1)}
        >
          <Chevron direction="right" />
        </button>
      </div>
    </div>
  );
}
