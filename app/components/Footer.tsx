const conceptNote = "/RCA%20Silicon%20Minds%20Concept%20Note1.pdf";
const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-intro">
            <a className="footer-brand" href="#top" aria-label="Silicon Minds — back to top">
              <span className="footer-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="25" height="25" fill="none">
                  <path d="M14 7H8a5 5 0 0 0 0 10h3a4 4 0 0 1 0 8H4M17 25V7l6 11 6-11v18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="4" cy="25" r="2.3" fill="var(--signal-deep)" />
                  <circle cx="23" cy="18" r="2.3" fill="var(--signal-deep)" />
                </svg>
              </span>
              <span>Silicon Minds</span>
            </a>
            <p>A student-led community learning AI and building the intelligence of tomorrow.</p>
          </div>
          <nav className="footer-column" aria-label="Footer explore">
            <h2>Explore</h2>
            <a href="#work">Our projects</a>
            <a href="#path">Learning pathway</a>
            <a href="#team">The team</a>
          </nav>
          <nav className="footer-column" aria-label="Footer about">
            <h2>About</h2>
            <a href="#about">Silicon Minds</a>
            <a href={conceptNote}>Concept note <span aria-hidden="true">↗</span></a>
          </nav>
          <div className="footer-column footer-home">
            <h2>Our first home</h2>
            <p>Rwanda Coding Academy</p>
            <p>Student-led.<br />Built to learn, together.</p>
          </div>
        </div>
        <div className="footer-meta">
          <p>© {CURRENT_YEAR} Silicon Minds. All rights reserved.</p>
          <p className="footer-location">Starting at RCA. Growing through community.</p>
          <a href="#top" className="footer-back">Back to top <span aria-hidden="true">↑</span></a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          <svg viewBox="0 0 1200 245" focusable="false">
            <defs>
              <filter id="footer-wordmark-blur" x="-10%" y="-20%" width="120%" height="150%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <linearGradient id="footer-crisp-mask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="30%" stopColor="white" />
                <stop offset="90%" stopColor="black" />
              </linearGradient>
              <linearGradient id="footer-blur-mask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="black" />
                <stop offset="78%" stopColor="white" />
              </linearGradient>
              <mask id="footer-crisp"><rect width="1200" height="245" fill="url(#footer-crisp-mask)" /></mask>
              <mask id="footer-blur"><rect width="1200" height="245" fill="url(#footer-blur-mask)" /></mask>
            </defs>
            <g className="footer-wordmark-type">
              <text x="600" y="205" textAnchor="middle" textLength="1180" lengthAdjust="spacingAndGlyphs" mask="url(#footer-crisp)">Silicon Minds</text>
              <g mask="url(#footer-blur)">
                <text x="600" y="205" textAnchor="middle" textLength="1180" lengthAdjust="spacingAndGlyphs" filter="url(#footer-wordmark-blur)">Silicon Minds</text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
}
