import Navbar from "../../components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="section container page-loading"
        aria-busy="true"
      >
        <p className="eyebrow" role="status">
          Loading your next step…
        </p>
        <div className="loading-placeholder loading-title" aria-hidden="true" />
        <div className="loading-placeholder loading-copy" aria-hidden="true" />
        <div className="loading-placeholder loading-panel" aria-hidden="true" />
      </main>
    </>
  );
}
