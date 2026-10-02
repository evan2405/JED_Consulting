import test from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, csvCell, safeUrl } from "../lib/validation.js";
const base = {
  name: "Test Person",
  email: "TEST@example.com",
  phone: "+91 98765 43210",
  serviceInterested: "career",
  careerGoal: "Placement",
  termsAccepted: true,
};
test("normalizes contact details and enforces each service", () => {
  const result = validateEnquiry(base);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.email, "test@example.com");
  assert.equal(result.data.phone, "+919876543210");
  assert.deepEqual(
    validateEnquiry(
      { ...base, serviceInterested: "academic", selectedCourse: "course-1" },
      ["course-1"],
    ).errors,
    {},
  );
  assert.ok(
    validateEnquiry(
      { ...base, serviceInterested: "academic", selectedCourse: "fake" },
      ["course-1"],
    ).errors.selectedCourse,
  );
  assert.ok(
    validateEnquiry({
      ...base,
      serviceInterested: "financial",
      loanType: "not-real",
    }).errors.loanType,
  );
  assert.deepEqual(
    validateEnquiry({
      ...base,
      serviceInterested: "financial",
      loanType: "Startup",
    }).errors,
    {},
  );
});
test("rejects malformed input, missing consent, long fields, invalid phones and hidden values", () => {
  for (const body of [null, [], false])
    assert.ok(validateEnquiry(body).errors.form);
  assert.ok(
    validateEnquiry({
      ...base,
      name: "a",
      email: "bad",
      phone: "abc",
      termsAccepted: false,
    }).errors.termsAccepted,
  );
  assert.ok(
    validateEnquiry({ ...base, message: "x".repeat(2001) }).errors.message,
  );
  assert.ok(validateEnquiry({ ...base, phone: 12345 }).errors.phone);
  const result = validateEnquiry({
    ...base,
    selectedCourse: "hidden",
    loanType: "Startup",
  });
  assert.equal(result.data.selectedCourse, "");
  assert.equal(result.data.loanType, "");
});
test("CSV neutralizes formulas after whitespace and controls and quotes delimiters", () => {
  for (const value of [
    "=1+1",
    "+SUM(A1:A9)",
    "-1+2",
    "@SUM(1)",
    ' \t=HYPERLINK("x")',
    "\r\n+1",
    "\u0000=1",
  ])
    assert.ok(csvCell(value).startsWith("\"'"));
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"');
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell("normal"), '\"normal\"');
});
test("CMS URLs reject unsafe schemes and protocol-relative or disguised URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "//evil.example",
    "/\\evil.example",
    "https://good.example\nx",
    "http://example.com",
  ])
    assert.equal(safeUrl(url), null);
  for (const url of ["/courses/cfa", "https://example.com/file.pdf"])
    assert.equal(safeUrl(url), url);
});
