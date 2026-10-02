import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getSettings } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Privacy policy",
  "How J.ed handles enquiry information, staff access, cookies and your privacy choices.",
  "/privacy-policy",
);
export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="section container prose"
        style={{ maxWidth: 850 }}
      >
        <p className="eyebrow">YOUR INFORMATION</p>
        <h1 style={{ fontSize: "3rem" }}>Privacy policy</h1>
        <p>Updated 26 September 2026</p>
        <h2>Information you provide</h2>
        <p>
          J.Ed Placement Consultancy collects your name, email, phone number,
          selected service, relevant course or assistance preference, and any
          message you submit. We use these details to respond to your enquiry
          and coordinate the service you request. Please do not send bank
          details, identity numbers or sensitive documents through this form.
        </p>
        <h2>Storage and access</h2>
        <p>
          Enquiry records are stored in Sanity and made available to authorised
          staff. Hosting and security providers process the information
          necessary to operate and protect the website. Staff alerts link to the
          private lead record. Access and exports are recorded for
          accountability. We do not publish your enquiry or sell your contact
          details.
        </p>
        <h2>Retention and your choices</h2>
        <p>
          We keep information for enquiry follow-up and necessary service
          administration, then remove it under our retention process. You can
          ask us to access, correct or delete your details, or to stop
          contacting you, through our{" "}
          <a href={settings.whatsapp || "/contact"}>
            official WhatsApp contact
          </a>
          {settings.email && (
            <>
              {" "}
              or <a href={"mailto:" + settings.email}>{settings.email}</a>
            </>
          )}
        </p>
        <h2>Cookies and analytics</h2>
        <p>
          The public enquiry form does not require an account. Staff sign-in
          uses secure session cookies. If optional analytics are enabled, you
          can accept or reject them and change your choice using Cookie
          preferences. Analytics are not loaded before acceptance. Names, email
          addresses, phone numbers and enquiry messages are not sent as
          analytics event properties. Your preference may be saved in local
          storage.
        </p>
        <h2>External services</h2>
        <p>
          The interactive office map connects to Google Maps only when you
          select “Load Google Map”. Google then receives connection information
          such as your IP address and handles it under its own privacy policy.
          You can also open directions directly in Google Maps.
        </p>
        <p>
          WhatsApp and Instagram links open services governed by their own
          privacy policies. Information needed for an employer, institution or
          lender application should be discussed with the team before it is
          shared.
        </p>
        <h2>Contact</h2>
        <p>
          {settings.organization}, {settings.location}.{" "}
          <a href={settings.whatsapp || "/contact"}>Contact us on WhatsApp</a>{" "}
          about privacy or your information.
        </p>
      </main>
      <Footer />
    </>
  );
}
