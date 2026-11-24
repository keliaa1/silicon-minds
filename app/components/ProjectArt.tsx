import type { ReactNode } from "react";
import { projects } from "../content";

const INK = "var(--ink)";
const PAPER = "var(--paper)";
const SIGNAL = "var(--signal)";
const ELECTRIC = "var(--signal-hover)";

/** Rounds so server and browser output match exactly during hydration. */
const r = (value: number) => Number(value.toFixed(2));

const fract = (value: number) => value - Math.floor(value);
const noise = (seed: number, salt: number) =>
  fract(Math.sin(seed * salt) * 43758.5453);

function Frame({
  n,
  bg,
  fg,
  children,
}: {
  n: number;
  bg: string;
  fg: string;
  children: ReactNode;
}) {
  const [lineA, lineB] = projects[n - 1].cardLines;
  return (
    <svg
      viewBox="0 0 240 332"
      className="block h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="240" height="332" fill={bg} />
      {children}
      <text x="18" y="30" className="svg-mono" fontSize="12" fill={fg}>
        {String(n).padStart(2, "0")}/07
      </text>
      <text x="222" y="30" textAnchor="end" className="svg-mono" fontSize="12" fill={fg}>
        SM
      </text>
      <text x="18" y="294" className="svg-display" fontSize="23" fill={fg}>
        {lineA}
      </text>
      <text x="18" y="318" className="svg-display" fontSize="23" fill={fg}>
        {lineB}
      </text>
    </svg>
  );
}

function Foundations() {
  const dots: ReactNode[] = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const t = (row + col) / 17;
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={28 + col * 23}
          cy={52 + row * 22}
          r={r(0.8 + 8 * t * t)}
          fill={PAPER}
        />,
      );
    }
  }
  return (
    <Frame n={1} bg={INK} fg={PAPER}>
      {dots}
    </Frame>
  );
}

function MachineLearning() {
  const boundary = (x: number) => 150 + 46 * Math.sin(x / 42);
  const points: ReactNode[] = [];
  for (let i = 1; i <= 64; i++) {
    const x = r(22 + noise(i, 12.9898) * 196);
    const y = r(52 + noise(i, 78.233) * 200);
    const gap = y - boundary(x);
    if (Math.abs(gap) < 12) continue;
    points.push(
      gap < 0 ? (
        <circle key={i} cx={x} cy={y} r="4.5" fill={INK} />
      ) : (
        <path
          key={i}
          d={`M${r(x - 4)} ${r(y - 4)}L${r(x + 4)} ${r(y + 4)}M${r(x + 4)} ${r(y - 4)}L${r(x - 4)} ${r(y + 4)}`}
          stroke={SIGNAL}
          strokeWidth="2.4"
        />
      ),
    );
  }
  let curve = "";
  for (let x = 0; x <= 240; x += 6) {
    curve += `${x === 0 ? "M" : "L"}${x} ${r(boundary(x))}`;
  }
  return (
    <Frame n={2} bg={PAPER} fg={INK}>
      {points}
      <path d={curve} fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="5 4" />
    </Frame>
  );
}

function DeepLearning() {
  const layers = [
    { x: 34, count: 4 },
    { x: 92, count: 6 },
    { x: 150, count: 6 },
    { x: 206, count: 3 },
  ];
  const nodes = layers.map(({ x, count }) =>
    Array.from({ length: count }, (_, i) => ({
      x,
      y: 152 + (i - (count - 1) / 2) * 34,
    })),
  );
  const edges: ReactNode[] = [];
  nodes.slice(0, -1).forEach((layer, l) =>
    layer.forEach((from, a) =>
      nodes[l + 1].forEach((to, b) =>
        edges.push(
          <line
            key={`${l}-${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={INK}
            strokeWidth="0.8"
            opacity="0.7"
          />,
        ),
      ),
    ),
  );
  return (
    <Frame n={3} bg={SIGNAL} fg={INK}>
      {edges}
      {nodes.flat().map((node, i) => (
        <circle key={i} cx={node.x} cy={r(node.y)} r="8.5" fill={INK} />
      ))}
    </Frame>
  );
}

function GenerativeAI() {
  const cx = 120;
  const cy = 150;
  const spokes = Array.from({ length: 168 }, (_, i) => {
    const a = (i / 168) * Math.PI * 2;
    const inner = 36 + 5 * noise(i + 1, 3.17);
    const outer =
      inner +
      18 +
      46 * Math.abs(Math.sin(a * 5) * Math.cos(a * 3)) +
      14 * noise(i + 1, 9.41);
    return (
      <line
        key={i}
        x1={r(cx + Math.cos(a) * inner)}
        y1={r(cy + Math.sin(a) * inner)}
        x2={r(cx + Math.cos(a) * outer)}
        y2={r(cy + Math.sin(a) * outer)}
        stroke={ELECTRIC}
        strokeWidth="1.3"
        opacity={r(0.45 + 0.55 * noise(i + 1, 5.2))}
      />
    );
  });
  return (
    <Frame n={4} bg={INK} fg={PAPER}>
      <defs>
        <radialGradient id="sm-orb">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="var(--fog)" />
          <stop offset="0.72" stopColor="var(--signal)" stopOpacity="0.75" />
          <stop offset="1" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="104" fill="url(#sm-orb)" opacity="0.5" />
      {spokes}
      <circle cx={cx} cy={cy} r="34" fill="url(#sm-orb)" />
    </Frame>
  );
}

function Engineering() {
  const blocks = ["DATA", "MODEL", "API", "DEPLOY", "MONITOR"];
  return (
    <Frame n={5} bg={PAPER} fg={INK}>
      {blocks.map((label, i) => {
        const y = 54 + i * 42;
        return (
          <g key={label}>
            <rect
              x="26"
              y={y}
              width="150"
              height="30"
              rx="3"
              fill={i === 2 ? INK : "none"}
              stroke={INK}
              strokeWidth="1.4"
            />
            <text
              x="38"
              y={y + 20}
              className="svg-mono"
              fontSize="13"
              fill={i === 2 ? PAPER : INK}
            >
              {label}
            </text>
            {i < blocks.length - 1 && (
              <line x1="101" y1={y + 30} x2="101" y2={y + 42} stroke={INK} strokeWidth="1.4" />
            )}
          </g>
        );
      })}
      <path
        d="M176 237H208V69H184M190 63L184 69L190 75"
        fill="none"
        stroke={SIGNAL}
        strokeWidth="2.4"
      />
    </Frame>
  );
}

function Applied() {
  const cx = 120;
  const cy = 150;
  const dots: ReactNode[] = [];
  for (let row = 0; row < 17; row++) {
    for (let col = 0; col < 18; col++) {
      const x = 10 + col * 13;
      const y = 48 + row * 13;
      const size = 6.2 * Math.abs(Math.sin(Math.hypot(x - cx, y - cy) / 17));
      if (size < 0.6) continue;
      dots.push(<circle key={`${row}-${col}`} cx={x} cy={y} r={r(size)} fill={PAPER} />);
    }
  }
  return (
    <Frame n={6} bg={INK} fg={PAPER}>
      {dots}
      <circle cx={cx} cy={cy} r="15" fill={SIGNAL} />
    </Frame>
  );
}

function Innovation() {
  return (
    <Frame n={7} bg="var(--surface-mid)" fg={INK}>
      {Array.from({ length: 7 }, (_, i) => {
        const height = 26 + i * 30;
        return (
          <rect
            key={i}
            x={20 + i * 29.5}
            y={258 - height}
            width="23"
            height={height}
            fill={i === 6 ? SIGNAL : INK}
          />
        );
      })}
    </Frame>
  );
}

const ART = [
  Foundations,
  MachineLearning,
  DeepLearning,
  GenerativeAI,
  Engineering,
  Applied,
  Innovation,
];

export function ProjectArt({ n }: { n: number }) {
  const Art = ART[n - 1];
  return <Art />;
}
