import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="section container">
        <div className="success-card">
          <p className="eyebrow">404 · A SMALL DETOUR</p>
          <h1>Page Not Found</h1>
          <p>
            The page you’re looking for doesn’t exist or has been moved. Let’s
            get you back on track.
          </p>
          <div className="actions">
            <Link href="/" className="button">
              Back to home <ArrowUpRight size={18} />
            </Link>
            <Link href="/courses" className="button secondary">
              Browse courses
            </Link>
            <Link href="/contact" className="button secondary">
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
