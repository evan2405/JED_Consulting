// Guidance outlines from JEd_Placement_Consultancy_Requirements.pdf.
// Official institution teaching curricula were not included in that document.
import { defaultCourses } from "../lib/content-defaults.js";
const finance = defaultCourses.filter(
  (c) => c.category === "Accounting & finance",
);
const training = defaultCourses.filter(
  (c) => c.category === "Career & language",
);
const preparation = [
  "CV/resume preparation and ATS optimization",
  "Interview preparation and soft skills training",
  "English communication training",
  "Excel training for employability",
  "Job application assistance",
];
const recruitment = [
  "Job opportunity identification and candidate screening",
  "CV submission and candidate communication",
  "Interview scheduling and coordination",
  "Recruitment drives and job fairs",
  "Interview preparation and follow-up with candidates",
  "Continued placement assistance for eligible registered candidates",
];

export const pdfServiceContent = {
  academic: {
    description:
      "Explore professional accounting and finance qualifications, language coaching and career development training. J.ed helps students compare the programmes listed in our service catalogue and prepare a course enquiry. Duration and eligibility depend on the individual programme and institution.",
    items: [
      "Accounting and finance qualifications: US CMA, CFA, ACCA, CIBOP, PGBAF, PGA, PGFAP, PGDM and PGFAM",
      "German language coaching and nursing courses for Germany",
      "Soft skills and English communication training",
      "Excel and interview skills training",
      "Professional career-oriented training programmes",
    ],
    offerings: [
      {
        title: "Accounting & finance programmes",
        items: finance.map((c) => c.title + " — " + c.description),
        eligibility:
          "Duration and eligibility will be confirmed for the individual programme and institution.",
      },
      {
        title: "Language & career development",
        items: training.map((c) => c.title),
        eligibility:
          "Entry requirements and course arrangements depend on the chosen programme.",
      },
    ],
    curriculum: [
      {
        title: "Explore accounting and finance pathways",
        topics: finance.map((c) => c.title),
      },
      {
        title: "Explore language and employability training",
        topics: training.map((c) => c.title),
      },
      {
        title: "Prepare your course enquiry",
        topics: [
          "Share the programme you are interested in",
          "Confirm the offering institution, duration and eligibility",
          "Request the official teaching curriculum and current course details",
        ],
      },
    ],
    relatedCourseIds: defaultCourses.map((c) => c._id),
    demoText:
      "Start by choosing a programme area: accounting and finance, language learning, or career development. The catalogue includes nine accounting and finance qualifications plus German language, nursing pathways for Germany, soft skills, English communication, Excel and interview skills, and professional career-oriented training. Use a course enquiry to discuss your education and preferred programme. Duration and eligibility must be confirmed with the relevant institution; the supplied requirements do not include an official teaching curriculum or recorded class demonstration.",
  },
  career: {
    description:
      "Career guidance for students, freshers and job seekers, based on education, skills, experience and career goals. Get support preparing applications, identifying on-site or remote opportunities, attending interviews and coordinating recruitment.",
    items: [
      "Job placement assistance for on-site and remote opportunities",
      "Career counselling and candidate profile assessment",
      ...preparation,
      "Interview scheduling and recruitment support",
      "Recruitment drives and job fairs",
      "Candidate registration and annual placement membership",
    ],
    offerings: [
      { title: "Career preparation", items: preparation },
      { title: "Recruitment & placement support", items: recruitment },
      {
        title: "Placement membership",
        items: [
          "CV revamp",
          "Job application support",
          "Interview referrals and scheduling",
          "Continued placement assistance",
        ],
      },
    ],
    curriculum: [
      {
        title: "Registration and career direction",
        topics: [
          "Candidate registration and profile assessment",
          "Understand education, experience, skills and interests",
          "Identify suitable job roles or career pathways",
        ],
      },
      { title: "Application and interview preparation", topics: preparation },
      { title: "Recruitment coordination and follow-up", topics: recruitment },
    ],
    relatedCourseIds: [
      "catalog-soft-skills",
      "catalog-english-communication",
      "catalog-excel-interview",
    ],
    demoText:
      "The career journey begins with registration and a discussion of your education, experience, skills and interests. J.ed helps identify suitable roles, prepare or improve your CV for ATS screening, and prepare for interviews. Eligible candidates can be matched with vacancies and referred for interviews or recruitment drives, with scheduling and follow-up support. Annual placement membership includes CV revamp, application support, interview referrals and continued placement assistance. Membership does not guarantee employment; employers make hiring decisions.",
  },
  financial: {
    description:
      "Financial counselling and application support for individuals, entrepreneurs and businesses. Explore personal, mortgage/home, business and startup financing, alongside education-related guidance, MSME funding, government schemes, grants, Udyam registration and DPR preparation.",
    items: [
      "Personal loan guidance and application assistance",
      "Mortgage/home purchase, construction, renovation and extension guidance",
      "Business working capital, expansion and equipment financing support",
      "Startup funding, grant applications, business plans and DPR preparation",
      "Education-related, MSME and government scheme assistance",
      "Udyam registration and financial documentation guidance",
    ],
    curriculum: [
      {
        title: "Understand your financing requirement",
        topics: [
          "Identify the purpose and type of financial assistance",
          "Discuss the relevant applicant, business or project profile",
          "Explore appropriate lender or funding-agency options",
        ],
      },
      {
        title: "Prepare the documentation",
        topics: [
          "Income, employment or business information as applicable",
          "Property documents for home or mortgage applications",
          "Business plans and detailed project reports for relevant startup/funding applications",
          "Lender- or scheme-specific documentation guidance",
        ],
      },
      {
        title: "Applications and funding support",
        topics: [
          "Application preparation and processing assistance",
          "Startup grants and government scheme applications",
          "Udyam registration assistance",
          "Final approval, rates, amount, tenure and eligibility are decided by the lender or funding agency",
        ],
      },
    ],
    demoText:
      "Begin with the purpose of the funding: a personal requirement, a home, business working capital or expansion, or a startup project. J.ed provides preliminary eligibility and documentation guidance and helps prepare the relevant application. Startup support can include grant applications, business plans and DPR preparation; other assistance includes Udyam registration and government funding schemes. The bank, NBFC, lender or funding agency determines final approval, interest rates, amount, tenure and eligibility.",
  },
};
