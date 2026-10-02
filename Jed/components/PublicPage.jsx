import Navbar from "./Navbar";
import Footer from "./Footer";
export default function PublicPage({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
