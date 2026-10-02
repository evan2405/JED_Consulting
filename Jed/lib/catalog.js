export const whatsapp = "https://wa.me/message/T36TQZJEJIXMF1";
export const instagram = "https://www.instagram.com/j.edplacement_consultancy";
export const services = [
  {
    id: "academic",
    title: "Academic counselling",
    short: "Learn with a direction.",
    description:
      "Explore professional qualifications, language coaching and practical training that connect your education to your goals.",
    items: [
      "Accounting & finance qualifications",
      "German language & nursing pathways",
      "Communication, Excel & career skills",
    ],
  },
  {
    id: "career",
    title: "Career counselling",
    short: "Find your next opportunity.",
    description:
      "From your first CV to your next interview, get practical guidance for on-site and remote opportunities.",
    items: [
      "Placement & recruitment support",
      "CV preparation & ATS optimization",
      "Interview preparation & job fairs",
    ],
  },
  {
    id: "financial",
    title: "Financial counselling",
    short: "Plan your next chapter.",
    description:
      "Understand financing options and get help preparing applications for personal, home, business and startup needs.",
    items: [
      "Loan & documentation assistance",
      "Startup grants & DPR preparation",
      "Udyam registration & business support",
    ],
  },
];
const titles = [
  ["us-cma", "US CMA", "Certified Management Accountant"],
  ["cfa", "CFA", "Chartered Financial Analyst"],
  ["acca", "ACCA", "Association of Chartered Certified Accountants"],
  ["cibop", "CIBOP", "Certificate in Securities and Investment Banking"],
  ["pgbaf", "PGBAF", "Post Graduate in Business of Accounting and Finance"],
  ["pga", "PGA", "Post Graduate Analytics"],
  ["pgfap", "PGFAP", "Postgraduate Program in Financial Analysis"],
  ["pgdm", "PGDM", "Post Graduate Diploma in Management"],
  ["pgfam", "PGFAM", "Post Graduate in Financial Accounting and Management"],
  [
    "german-language",
    "German Language Coaching",
    "Language learning for your next step",
  ],
  [
    "nursing-germany",
    "Nursing Course for Germany",
    "Explore nursing education pathways",
  ],
  ["soft-skills", "Soft Skills Training", "Build workplace confidence"],
  [
    "english-communication",
    "English Communication Training",
    "Develop your communication skills",
  ],
  [
    "excel-interview",
    "Excel & Interview Skills Training",
    "Practical skills for employability",
  ],
  [
    "professional-training",
    "Professional career-oriented training programmes",
    "Discuss training suited to your career goals",
  ],
];
export const catalog = titles.map(([slug, title, description], i) => ({
  _id: "catalog-" + slug,
  slug: { current: slug },
  title,
  description,
  category: i < 9 ? "Accounting & finance" : "Career & language",
  source: "requirements",
}));
export const careerSteps = [
  "Candidate registration and profile assessment",
  "Understand your education, experience, skills and interests",
  "Identify suitable roles or career pathways",
  "Prepare your CV and improve ATS compatibility",
  "Prepare for interviews and build soft skills",
  "Match your profile with suitable opportunities",
  "Refer eligible candidates for interviews and recruitment drives",
  "Coordinate interviews and recruitment",
  "Follow up on interview and selection outcomes",
  "Continue helping eligible registered candidates find suitable employment",
];
export const partners = [
  "[24]7.ai",
  "Chillibreeze",
  "iMerit Technology Services",
  "HPCL-related recruitment/project opportunities",
  "HDFC Life",
  "SBI Card",
  "MBMA — Meghalaya Basin Management Authority",
];
export const financialOptions = [
  {
    name: "Personal",
    title: "Personal loans",
    items: [
      "Understand your financing requirement",
      "Preliminary eligibility and documentation guidance",
      "Application support and connections to lending partners",
    ],
    eligibility:
      "Income, employment or business status, credit profile, age, existing liabilities and documentation.",
  },
  {
    name: "Mortgage",
    title: "Mortgage & home loans",
    items: [
      "Home purchase or construction guidance",
      "Renovation and extension financing",
      "Documentation and application assistance",
    ],
    eligibility:
      "Income, repayment capacity, property documents, credit history and lender requirements.",
  },
  {
    name: "Business",
    title: "Business loans",
    items: [
      "Working capital and business expansion",
      "Equipment and infrastructure financing",
      "Business documentation and application guidance",
    ],
    eligibility:
      "Business vintage, turnover, income, banking records, credit profile and repayment capacity.",
  },
  {
    name: "Startup",
    title: "Startup loans & funding",
    items: [
      "Government and entrepreneurship funding opportunities",
      "Grant applications, DPR preparation and business plans",
      "Connections to relevant funding opportunities",
    ],
    eligibility:
      "Business idea, project viability, promoter profile, investment, project report and scheme criteria.",
  },
  {
    name: "Others",
    title: "Other financial assistance",
    items: [
      "Education-related financial guidance",
      "MSME funding and government scheme applications",
      "Udyam registration and financial documentation",
    ],
    eligibility:
      "Requirements vary by scheme, institution and the assistance requested.",
  },
];
export function enquiryHref(service, course, loanType) {
  return (
    "/enquire?service=" +
    service +
    (course ? "&course=" + encodeURIComponent(course) : "") +
    (loanType ? "&loanType=" + encodeURIComponent(loanType) : "")
  );
}
