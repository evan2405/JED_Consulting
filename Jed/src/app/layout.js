import WebVitals from "../../components/WebVitals";
import { Suspense } from "react";
import PageScroll from "../../components/PageScroll";
import { headers } from "next/headers";
import "./globals.css";
import Consent from "../../components/Consent";
import MobileActions from "../../components/MobileActions";
import InteractionAnalytics from "../../components/InteractionAnalytics";
import { getSettings } from "../../Sainity/queries";
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata = {
  metadataBase: new URL(site),
  title: {
    default: "J.Ed Placement Consultancy | Your next chapter",
    template: "%s | J.Ed Placement Consultancy",
  },
  description:
    "Academic, career and financial counselling in Shillong. Explore professional courses, placement membership, recruitment and business support.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "J.Ed Placement Consultancy",
    images: [
      {
        url: "/logo.png",
        width: 2242,
        height: 2396,
        alt: "J.Ed Placement Consultancy",
      },
    ],
  },
  twitter: { card: "summary", images: ["/logo.png"] },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  robots: { index: !!process.env.NEXT_PUBLIC_SITE_URL, follow: true },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10264d",
};
async function ContactActions() {
  const settings = await getSettings();
  return <MobileActions phone={settings.phone} />;
}
export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce");
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <Suspense fallback={null}>
          <PageScroll />
        </Suspense>
        <Consent nonce={nonce} />
        <WebVitals />
        <InteractionAnalytics />
        <Suspense fallback={null}>
          <ContactActions />
        </Suspense>
      </body>
    </html>
  );
}
