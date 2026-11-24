import { RollingWordmark } from "./RollingWordmark";

const WORDMARK_STACKED = ["SILICON", "MINDS"];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        Silicon Minds: Building the Intelligence of Tomorrow
      </h1>

      <div className="hero-grid" aria-hidden="true" />

      <p className="hero-welcome">
        Welcome
        <br />
        to
      </p>

      <nav className="hero-nav" aria-label="Sections">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#path">Path</a>
        <a href="#team">Team</a>
      </nav>

      <a href="#about" className="hero-target" aria-label="Skip to About">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 0V24M0 12H24" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 8L16 12L12 16L8 12Z" fill="currentColor" />
        </svg>
      </a>

      <div className="hero-block" aria-hidden="true" />
      <RollingWordmark
        text="SILICON MINDS"
        stacked={WORDMARK_STACKED}
        className="hero-wordmark svg-display"
      />

      <p className="hero-caption hero-caption-left">Rwanda Coding Academy</p>
      <p className="hero-caption hero-caption-right">AI Learning &amp; Engineering</p>
    </section>
  );
}
