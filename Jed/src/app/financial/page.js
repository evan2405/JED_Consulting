import ServicePage from "../../../components/ServicePage";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Financial counselling & business support",
  "Guidance for personal, home, business and startup financing and applications.",
  "/financial",
);
export default function Financial() {
  return <ServicePage slug="financial" />;
}
