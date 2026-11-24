// Site copy is drawn from the RCA Silicon Minds Concept Note (14 October 2026), except
// `projects`, which are sample briefs, and the placeholder `team` photos.

export type Project = {
  n: number;
  title: string;
  cardLines: [string, string];
  summary: string;
  /** One answer per entry in `projectQuestions`, in the same order. */
  answers: [string, string, string, string, string];
  stack: string[];
};

export const projects: Project[] = [
  {
    n: 1,
    title: "Kinyarwanda Coding Tutor",
    cardLines: ["KINYA", "TUTOR"],
    summary: "An assistant that explains programming concepts in Kinyarwanda and English, alongside the code a student is working on.",
    answers: [
      "Most programming material is in English, so beginners can spend their effort decoding the language before they reach the concept itself.",
      "First-year programming students, and anyone who learns a hard idea faster in their first language.",
      "Yes, if it explains rather than solves. Language models can handle free-form questions and translation that a fixed FAQ cannot.",
      "Explain an error or concept in either language, then ask a follow-up question to check understanding, without writing the assignment for the student.",
      "A language model grounded in course notes and a reviewed Kinyarwanda glossary of technical terms, served through a simple web chat.",
    ],
    stack: ["Python", "LLM API", "Retrieval", "Web chat"],
  },
  {
    n: 2,
    title: "Leaf Scan",
    cardLines: ["LEAF", "SCAN"],
    summary: "A phone-based tool that flags likely crop disease from a photo of a leaf and suggests when to ask an agronomist.",
    answers: [
      "Crop disease is often spotted late, when it has already spread and treatment costs more.",
      "Smallholder farmers and the local extension workers who support them.",
      "Yes. Disease shows up as visual patterns that image classifiers can learn, but the output should be a prompt to check, never a final diagnosis.",
      "Return a likely condition with a confidence level from a single photo, and say plainly when the image is too unclear to judge.",
      "A compact image classifier trained on labelled leaf photos, small enough to run on a low-cost Android phone without a connection.",
    ],
    stack: ["PyTorch", "Transfer learning", "On-device", "Android"],
  },
  {
    n: 3,
    title: "Sign Bridge",
    cardLines: ["SIGN", "BRIDGE"],
    summary: "A camera-based prototype that recognises a starter vocabulary of Rwandan Sign Language and shows it as text.",
    answers: [
      "Deaf students and hearing classmates often have no shared way to communicate quickly without an interpreter present.",
      "Deaf and hard-of-hearing students, their classmates and their teachers.",
      "Partly. Sequence models can recognise signs, but the project needs Deaf collaborators to lead data collection and judge whether it is useful.",
      "Recognise a small, agreed vocabulary in real time on a laptop webcam, and show uncertainty instead of guessing.",
      "Hand and body keypoint extraction feeding a sequence model, trained on a dataset recorded with consenting signers.",
    ],
    stack: ["MediaPipe", "Sequence models", "Python", "Webcam"],
  },
  {
    n: 4,
    title: "Campus Assistant",
    cardLines: ["CAMPUS", "ASSISTANT"],
    summary: "A question-answering assistant for school life, grounded in official RCA documents and always showing its sources.",
    answers: [
      "Timetables, rules and club information are spread across documents and notice boards, so students keep asking the same questions.",
      "Students, especially new arrivals, and the staff who answer those repeat questions.",
      "Yes, with limits. Generative AI suits natural questions over documents, but answers must cite a source and decline anything outside them.",
      "Answer common questions with a link to the source document, and hand off to a person when it does not know.",
      "Retrieval over approved school documents with a language model that may only answer from what it retrieves, behind a small web app.",
    ],
    stack: ["Embeddings", "Retrieval", "LLM API", "Next.js"],
  },
  {
    n: 5,
    title: "Lab Monitor",
    cardLines: ["LAB", "MONITOR"],
    summary: "A monitoring service that warns technicians when a computer in the lab is likely to fail before a practical session.",
    answers: [
      "Machines tend to fail during practical sessions, which costs students limited lab time.",
      "Lab technicians, and the students and instructors who rely on working machines.",
      "Maybe. Simple threshold alerts may be enough, so the project must first show that a model beats them.",
      "Give technicians a daily list of machines to check, with the reason each one was flagged.",
      "A small agent collects hardware health data, a pipeline trains and evaluates the model, and an API feeds a dashboard with monitoring of its own.",
    ],
    stack: ["Data pipeline", "Scikit-learn", "FastAPI", "Monitoring"],
  },
  {
    n: 6,
    title: "Water Point Alert",
    cardLines: ["WATER", "ALERT"],
    summary: "A reporting and prediction tool that helps maintenance teams reach broken community water points sooner.",
    answers: [
      "When a community water point breaks, it can stay out of service for a long time before anyone responsible finds out.",
      "Households that depend on shared water points and the teams who maintain them.",
      "Only in part. The core need is reliable reporting; AI is added only to prioritise repairs once there is enough history.",
      "Let anyone report a fault by basic phone, then rank open reports so the most urgent repairs happen first.",
      "An SMS reporting line, a shared repair log, and a ranking model trained on that log as it grows.",
    ],
    stack: ["SMS gateway", "Postgres", "Ranking model", "Dashboard"],
  },
  {
    n: 7,
    title: "Market Price Forecast",
    cardLines: ["MARKET", "PRICE"],
    summary: "A short-range price outlook for staple produce, to help small traders decide when and where to sell.",
    answers: [
      "Small traders and farmers often decide when and where to sell with little information about where prices are heading.",
      "Smallholder farmers, market traders and cooperatives.",
      "Yes, if it beats a simple baseline. Forecasts must be compared with last week's price and shown with their uncertainty.",
      "Show a one-to-two-week price range per market for a few staple crops, in a format that works on a basic phone.",
      "Time-series models on collected market prices and seasonal data, with weekly results delivered through a lightweight web page and SMS.",
    ],
    stack: ["Time series", "Python", "Baselines", "SMS"],
  },
];

export const progression = [
  "Learn AI",
  "Build AI Skills",
  "Engineer AI Systems",
  "Solve Real Problems",
  "Develop AI Products",
  "Validate",
  "Commercialize",
];

export const projectQuestions = [
  "What is the real problem?",
  "Who experiences it?",
  "Is AI appropriate here?",
  "What should the system accomplish?",
  "What technical solution meets those requirements?",
];

export const reviewCriteria = [
  "Problem addressed",
  "Technical implementation",
  "Usefulness",
  "Feasibility",
  "Potential for real-world adoption",
];

export const phases = [
  {
    title: "Establishment",
    body: "Leadership structure, membership process, identity and communication. The AI roadmap and initial curriculum are prepared.",
  },
  {
    title: "AI Learning",
    body: "Instructor-led courses along the AI pathway begin, building a strong learning culture and consistent AI knowledge.",
  },
  {
    title: "AI Project Development",
    body: "Students with sufficient foundations form teams, identify problems, design solutions and develop working systems.",
  },
  {
    title: "Demonstration and Evaluation",
    body: "Projects are presented through demo days and evaluated on problem, implementation, usefulness, feasibility and potential.",
  },
  {
    title: "Further Development and Commercialization",
    body: "Promising projects are selected for further development and, where appropriate, connected with sponsors, businesses and partners.",
  },
];

export const growthSteps = [
  { title: "Prove the model at RCA", body: "Show the roadmap, sessions, community and project process work with real students." },
  { title: "Package the model", body: "Turn the documentation into a starter kit another school can use without the founding team present." },
  { title: "Pilot with one or two schools", body: "RCA student leaders help train new leaders and support first sessions." },
  { title: "Keep each club student-led", body: "Each club belongs to its school. A shared roadmap and quality standards keep them consistent." },
  { title: "Connect the clubs", body: "A shared learning community, national competitions, hackathons, joint projects and a national demo day." },
  { title: "Build support around the network", body: "Sponsors, partners and AI professionals who can provide mentors, computing resources, events and opportunities." },
];

export const collaborators = [
  { club: "IoT and Robotics Club", focus: "Intelligent physical systems and AI-enabled devices" },
  { club: "Business Club", focus: "Entrepreneurship, business development and market understanding" },
  { club: "Cybernights", focus: "AI and cybersecurity" },
];

export type TeamMember = {
  name: string;
  role?: string;
  /** Path under /public, e.g. "/team/alain.jpg", or a host allowed in next.config. */
  photo?: string;
  socials?: { facebook?: string; linkedin?: string; x?: string };
};

export const team: TeamMember[] = [
  { name: "Angelo", photo: "/Nshuti Angelo Joseph.jpeg" },
  { name: "Alain Barsime", photo: "/Alain Barsime.jpeg" },
  { name: "Bless TETA", photo: "/Teta Angel Bless.jpeg" },
  { name: "DAN christian", photo: "/Dan Christian.png" },
  { name: "Simbi Kelia KAYIRANGA", photo: "/Simbi Kelia.jpeg" },
];

export const partnerNeeds = [
  "Computing capacity, cloud infrastructure and AI APIs",
  "Mentors, AI practitioners and experts to review student work",
  "Domain knowledge and access to real users",
  "Support for industry visits, hackathons, competitions and demo days",
];
