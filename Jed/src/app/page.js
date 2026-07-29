import { client } from "../../Sainity/client";
import {
  coursesQuery,
  testimonialsQuery,
  visaServicesQuery,
  faqsQuery,
  activeBannersQuery,
} from "../../Sainity/queries";
import Navbar from "../../components/Navbar";
import Home from "../../components/Home";
import Footer from "../../components/Footer";

export const revalidate = 60;

export default async function Page() {
  // Parallel fetch for speed
  const [courses, testimonials, visaServices, faqs, banners] = await Promise.all([
    client.fetch(coursesQuery),
    client.fetch(testimonialsQuery),
    client.fetch(visaServicesQuery),
    client.fetch(faqsQuery),
    client.fetch(activeBannersQuery),
  ]);

  return (
    <>
      <Navbar />
      <Home
        courses={courses}
        testimonials={testimonials}
        visaServices={visaServices}
        faqs={faqs}
        banners={banners}
      />
      <Footer />
    </>
  );
}
