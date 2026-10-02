import {
  catalog,
  services,
  careerSteps,
  financialOptions,
  partners,
  whatsapp,
  instagram,
} from "./catalog.js";
export const defaultSettings = {
  organization: "J.Ed Placement Consultancy & Professional Course Provider",
  location: "Shillong, Meghalaya, India",
  address: "Pynthorumkhrah, Block 2, near The Diner’s Reception Hall, 3 Mile, Upper Shillong, Golf Links, Shillong, Meghalaya 793001",
  phone: "",
  email: "",
  hours: "",
  mapUrl: "",
  whatsapp,
  instagram,
  membershipFee: 500,
  membershipBenefits: [
    "CV revamp & ATS optimization",
    "Job application support",
    "Interview referrals & scheduling",
    "Continued placement assistance",
  ],
  partners,
  footerDescription: "Placement consultancy & Professional Course Provider.",
  contactTitle: "Ready for your next chapter?",
  contactDescription:
    "Bring your questions. Let’s find a way forward, together.",
  placementTitle: "The next chapter is taking shape.",
  placementDescription:
    "Approved student placement stories will appear here when available. In the meantime, explore our career guidance and placement membership.",
};
export const defaultHomepage = {
  heroEyebrow: "Your ambition. Our guidance.",
  heroTitle: "Your next chapter.",
  heroSubtitle: "A world of",
  heroAccent: "possibilities.",
  heroDescription:
    "The right course. The right guidance. A clearer way forward. Explore professional education and career support, built around you.",
  image: "/images/students-learning.jpg",
  imageAlt: "Students sharing ideas around a laptop in a library",
  photoCaption: "For the future you have in mind.",
  benefits: [
    {
      title: "Learn with purpose",
      text: "Professional courses & practical skills",
    },
    {
      title: "Find your direction",
      text: "Personal academic & career guidance",
    },
    { title: "Take the next step", text: "Placement & application support" },
  ],
  courseTitle: "Small steps. Big possibilities.",
  courseDescription:
    "Find a programme that fits your ambition. We’ll help you work out the next step.",
  whyTitle: "Big decisions. A simpler way forward.",
  whyDescription:
    "Education, work or a fresh start. You don’t have to figure it all out alone.",
  steps: [
    {
      title: "Let’s get to know you",
      text: "Share your interests, experience and where you’d like to go. Your goals shape the conversation.",
    },
    {
      title: "Explore your possibilities",
      text: "Compare courses, career pathways or support options with guidance that makes the details clearer.",
    },
    {
      title: "Make your next move",
      text: "Take a practical next step, from a course enquiry to a stronger CV or a prepared application.",
    },
  ],
  membershipTitle: "You bring the ambition. We help with the next step.",
  membershipDescription:
    "From your first CV to your next interview, get practical support for on-site and remote opportunities.",
  statistics: [],
};
export const defaultFaqs = [
  [
    "Which course is right for me?",
    "Start with your interests, education and career goals. Our academic counselling team can help you compare programmes and confirm eligibility, institution, duration and fees before you enrol.",
  ],
  [
    "What does placement membership include?",
    "Membership includes CV revamp, job application support, interview referrals, interview scheduling and continued placement assistance. Confirm the current annual fee and membership terms before paying.",
  ],
  [
    "Can I get help if I am still studying?",
    "Yes. Students can enquire about professional qualifications, language coaching, communication training and career preparation.",
  ],
  [
    "Are jobs or loans guaranteed?",
    "Employment decisions are made by employers. Loan approval, rates, amounts, tenure and eligibility are determined by the respective lender or funding agency.",
  ],
  [
    "Can employers get recruitment support?",
    "Yes. Choose Career counselling and Recruitment to discuss candidate screening, CV submission, interview coordination and recruitment drives.",
  ],
].map(([question, answer], i) => ({
  _id: "faq-" + i,
  question,
  answer,
  order: i,
}));
export const defaultServices = services.map((s) => ({
  ...s,
  _id: "service-" + s.id,
  slug: { current: s.id },
  service: s.id,
  process:
    s.id === "career"
      ? careerSteps
      : [
          "Discuss your goals and requirements",
          "Compare suitable options and confirm eligibility",
          "Prepare your next application or course enquiry",
        ],
  curriculum: [],
  offerings:
    s.id === "financial"
      ? financialOptions.map((o) => ({ ...o, loanType: o.name }))
      : [],
  demoText:
    s.description +
    " Start by discussing your background and goals with J.ed. Programme and service details are confirmed individually.",
  relatedCourses: [],
  counsellorName: "",
  counsellorBio: "",
}));
export const defaultCourses = catalog.map((c) => ({
  ...c,
  shortDescription: c.description,
  curriculum: [],
  curriculumStatus: "awaiting-material",
  counsellingAvailable: true,
  demoText: `Explore ${c.title}: ${c.description}. This orientation introduces the enquiry process; an official teaching demo and curriculum have not yet been supplied. Ask the academic team to confirm the institution, eligibility, timetable and fees.`,
}));
