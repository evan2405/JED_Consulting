"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { validateEnquiry, careerGoals, loanTypes } from "../lib/validation";
import { track } from "../lib/analytics";
export default function EnquiryForm({ courses, initial = {} }) {
  const router = useRouter(),
    form = useRef(null),
    sending = useRef(false),
    key = useRef(null);
  const enquiryStarted = useRef(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceInterested: initial.service || "",
    selectedCourse: initial.course || "",
    careerGoal: initial.careerGoal || "",
    loanType: initial.loanType || "",
    termsAccepted: false,
    website: "",
    counsellingSlug: initial.counselling || "",
    source: "/enquire",
  });
  const [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState("");
  function change(e) {
    const { name, value, checked, type } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "serviceInterested"
        ? {
            selectedCourse: "",
            careerGoal: "",
            loanType: "",
            counsellingSlug: "",
          }
        : {}),
    }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    if (name === "serviceInterested")
      track("service_selected", { service: value });
  }
  function showErrors(err) {
    setErrors(err);
    requestAnimationFrame(() =>
      form.current?.querySelector('[aria-invalid="true"]')?.focus(),
    );
  }
  async function submit(e) {
    e.preventDefault();
    if (sending.current) return;
    setFailure("");
    const result = validateEnquiry(
      values,
      courses.map((c) => c._id),
    );
    if (Object.keys(result.errors).length) {
      showErrors(result.errors);
      return;
    }
    sending.current = true;
    setBusy(true);
    const payload = JSON.stringify(values);
    if (key.current?.payload !== payload)
      key.current = { value: crypto.randomUUID(), payload };
    track("enquiry_submitted", { service: values.serviceInterested });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current.value,
        },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(20000),
      });
      const body = await res.json();
      if (!res.ok) {
        if (body.errors) showErrors(body.errors);
        throw new Error(
          body.error || "Please check the highlighted fields and try again.",
        );
      }
      track("enquiry_success", { service: values.serviceInterested });
      router.push("/thank-you");
    } catch (error) {
      setFailure(
        error.name === "TimeoutError"
          ? "The connection took too long. Your details are still here. Retry to check and complete the same enquiry."
          : error.message || "Could not send. Please try again.",
      );
      track("enquiry_error", { service: values.serviceInterested });
      sending.current = false;
      setBusy(false);
    }
  }
  function field(name, label, type = "text", extra = {}) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          value={values[name]}
          onChange={change}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? name + "-error" : undefined}
          {...extra}
        />
        {errors[name] && (
          <p id={name + "-error"} className="field-error">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  function select(name, label, options) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <select
          id={name}
          name={name}
          value={values[name]}
          onChange={change}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? name + "-error" : undefined}
          required
        >
          <option value="">Please select</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors[name] && (
          <p id={name + "-error"} className="field-error">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  return (
    <form
      ref={form}
      onFocus={() => {
        if (!enquiryStarted.current) {
          enquiryStarted.current = true;
          track("enquiry_started", { service: values.serviceInterested });
        }
      }}
      onSubmit={submit}
      noValidate
      aria-busy={busy}
    >
      <div className="form-grid">
        {field("name", "Full name *", "text", {
          autoComplete: "name",
          maxLength: 100,
          required: true,
        })}
        {field("email", "Email address *", "email", {
          autoComplete: "email",
          maxLength: 254,
          required: true,
        })}
        {field("phone", "Phone with country code *", "tel", {
          autoComplete: "tel",
          inputMode: "tel",
          maxLength: 30,
          placeholder: "+91",
          required: true,
        })}
        {select("serviceInterested", "Selected service *", [
          { value: "academic", label: "Academic counselling" },
          { value: "career", label: "Career counselling" },
          { value: "financial", label: "Financial counselling" },
        ])}
        {values.serviceInterested === "academic" &&
          select(
            "selectedCourse",
            "Course *",
            courses.map((c) => ({ value: c._id, label: c.title })),
          )}
        {values.serviceInterested === "career" &&
          select(
            "careerGoal",
            "Career support *",
            careerGoals.map((x) => ({ value: x, label: x })),
          )}
        {values.serviceInterested === "financial" &&
          select(
            "loanType",
            "Type of financial assistance *",
            loanTypes.map((x) => ({ value: x, label: x })),
          )}
        <div className="form-field full-width">
          <label htmlFor="message">
            How can we help? <span className="field-help">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={change}
            maxLength={2000}
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message ? "message-help message-error" : "message-help"
            }
          />
          <p id="message-help" className="field-help">
            Please don’t include identity numbers, bank details or financial
            documents.
          </p>
          {errors.message && (
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          )}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={values.website}
          onChange={change}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="check-label">
        <input
          name="termsAccepted"
          type="checkbox"
          checked={values.termsAccepted}
          onChange={change}
          aria-invalid={!!errors.termsAccepted}
          aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
        />
        <span>
          I have read and accept the{" "}
          <Link href="/terms">terms & conditions</Link> and{" "}
          <Link href="/privacy-policy">privacy policy</Link>, and agree to be
          contacted about this enquiry. *
        </span>
      </label>
      {errors.termsAccepted && (
        <p className="field-error" id="terms-error">
          {errors.termsAccepted}
        </p>
      )}
      {failure && (
        <div role="alert" className="form-error">
          {failure}
        </div>
      )}
      <button className="button" disabled={busy} type="submit">
        {busy ? "Sending your enquiry…" : "Send enquiry"}{" "}
        <ArrowUpRight size={18} />
      </button>
      <p className="field-help" style={{ marginTop: 15 }}>
        This is an enquiry, not a payment or confirmed enrolment.
      </p>
      <noscript>
        <p>
          The enquiry form needs JavaScript. Please contact us through the
          WhatsApp link instead.
        </p>
      </noscript>
    </form>
  );
}
