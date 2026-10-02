export const careerGoals = ["Placement", "Recruitment"];
export const loanTypes = [
  "Personal",
  "Mortgage",
  "Business",
  "Startup",
  "Others",
];
export function validateEnquiry(body, allowedCourses = []) {
  const errors = {};
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { errors: { form: "Provide a valid enquiry." } };
  const data = {};
  for (const [key, max] of Object.entries({
    name: 100,
    email: 254,
    phone: 30,
    message: 2000,
    serviceInterested: 20,
    selectedCourse: 150,
    careerGoal: 30,
    loanType: 30,
    counsellingSlug: 100,
    source: 100,
  })) {
    if (body[key] != null && typeof body[key] !== "string")
      errors[key] = "Enter a valid value.";
    data[key] = typeof body[key] === "string" ? body[key].trim() : "";
    if (
      data[key].length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data[key])
    )
      errors[key] =
        "Use no more than " + max + " characters and no control characters.";
  }
  if (data.name.length < 2) errors.name = "Enter your full name.";
  data.email = data.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  data.phone = data.phone.replace(/[\s().-]/g, "");
  if (!/^\+?[0-9]{7,15}$/.test(data.phone))
    errors.phone = "Enter 7–15 digits, including your country code.";
  if (!["academic", "career", "financial"].includes(data.serviceInterested))
    errors.serviceInterested = "Choose a service.";
  if (
    data.serviceInterested === "academic" &&
    !allowedCourses.includes(data.selectedCourse)
  )
    errors.selectedCourse = "Choose a listed course.";
  if (
    data.serviceInterested === "career" &&
    !careerGoals.includes(data.careerGoal)
  )
    errors.careerGoal = "Choose placement or recruitment.";
  if (
    data.serviceInterested === "financial" &&
    !loanTypes.includes(data.loanType)
  )
    errors.loanType = "Choose a type of assistance.";
  if (body.termsAccepted !== true)
    errors.termsAccepted =
      "Please read and accept the terms and privacy policy.";
  if (
    data.counsellingSlug &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.counsellingSlug)
  )
    errors.counsellingSlug = "Choose a valid counselling service.";
  if (data.source && !/^\/[a-zA-Z0-9/_-]*$/.test(data.source))
    errors.source = "Use a valid enquiry source.";
  if (data.serviceInterested !== "academic") data.selectedCourse = "";
  if (data.serviceInterested !== "career") data.careerGoal = "";
  if (data.serviceInterested !== "financial") data.loanType = "";
  return {
    errors,
    data: { ...data, termsAccepted: body.termsAccepted === true },
  };
}
export function safeUrl(value) {
  if (typeof value !== "string" || /[\s\\\u0000-\u001f]/.test(value))
    return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[\s\u0000-\u001f\u007f]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
