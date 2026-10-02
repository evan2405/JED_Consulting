import {
  getCourses,
  getActiveBanners,
  getServices,
  getSettings,
  getHomepage,
  getFaqs,
  getCollection,
} from "../../Sainity/queries";
import Navbar from "../../components/Navbar";
import Home from "../../components/Home";
import Footer from "../../components/Footer";
import Updates from "../../components/Updates";
import { pageMetadata } from "../../lib/metadata";
export const metadata = pageMetadata(
  "Education, careers & counselling in Shillong",
  "Explore professional courses, academic, career and financial counselling with J.ed Placement Consultancy.",
  "/",
);
export const revalidate = 60;
export default async function Page() {
  const [
    { courses, unavailable },
    banners,
    services,
    settings,
    home,
    faqs,
    updates,
    testimonials,
    placements,
  ] = await Promise.all([
    getCourses(),
    getActiveBanners(),
    getServices(),
    getSettings(),
    getHomepage(),
    getFaqs(),
    getCollection("updates"),
    getCollection("testimonials"),
    getCollection("placements"),
  ]);
  return (
    <>
      <Updates
        banners={banners.filter((b) =>
          ["updates", "homepage_top"].includes(b.placement),
        )}
      />
      <Navbar />
      <Home
        {...{ courses, unavailable, banners, services, settings, home, faqs }}
        updates={updates.items}
        testimonials={testimonials.items}
        placements={placements.items}
      />
      <Footer />
    </>
  );
}
