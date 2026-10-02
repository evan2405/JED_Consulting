import ServicePage from "../../../components/ServicePage";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Career counselling & placement support",
  "CV support, job applications, interview preparation and recruitment coordination in Shillong.",
  "/career",
);
export default function Career() {
  return <ServicePage slug="career" />;
}
