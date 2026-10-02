import Navbar from "../../../components/Navbar";
import { getStaff } from "../../../lib/auth";
import StaffDashboard from "../../../components/StaffDashboard";
export const metadata = {
  title: "Staff enquiries",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Staff() {
  const user = await getStaff();
  return (
    <>
      <Navbar />
      <main id="main-content" className="section container">
        <p className="eyebrow">AUTHORISED STAFF</p>
        <h1 style={{ fontSize: "3rem" }}>Enquiry workspace</h1>
        {user ? (
          <StaffDashboard role={user.role} />
        ) : (
          <div className="info-card">
            <p>
              Sign in with your approved staff account to view enquiries. Access
              is granted individually by the site administrator.
            </p>
            <form action="/api/auth/login" method="GET">
              <button className="button">Sign in securely →</button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
