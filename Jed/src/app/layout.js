import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "../../components/LenisProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Jed Consultancy — Your Gateway to Global Education",
  description:
    "Expert visa consultancy and world-class professional courses. We help students and professionals achieve their international education and career goals.",
  keywords:
    "visa consultancy, study abroad, professional courses, career counseling, Shillong, Meghalaya",
  authors: [{ name: "Jed Consultancy" }],
  openGraph: {
    title: "Jed Consultancy — Your Gateway to Global Education",
    description:
      "Expert visa consultancy and world-class professional courses to accelerate your career across borders.",
    type: "website",
    locale: "en_IN",
    siteName: "Jed Consultancy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jed Consultancy — Your Gateway to Global Education",
    description:
      "Expert visa consultancy and world-class professional courses to accelerate your career across borders.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-navy-900 text-white antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
