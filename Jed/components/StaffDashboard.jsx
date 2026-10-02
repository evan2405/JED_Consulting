"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
const statuses = ["new", "contacted", "interested", "converted", "closed"];
export default function StaffDashboard({ role }) {
  const router = useRouter(),
    requestId = useRef(0);
  const [leads, setLeads] = useState([]),
    [next, setNext] = useState(null),
    [filters, setFilters] = useState({
      q: "",
      status: "",
      service: "",
      from: "",
      to: "",
    }),
    [applied, setApplied] = useState({}),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [expired, setExpired] = useState(false),
    [confirmDelete, setConfirmDelete] = useState(null);
  const canEdit = ["manager", "admin"].includes(role),
    canExport = ["exporter", "admin"].includes(role);
  async function load(after = "", selected = filters) {
    const id = ++requestId.current;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        "/api/staff/leads?" + new URLSearchParams({ ...selected, after }),
        { cache: "no-store" },
      );
      const body = await response.json();
      if (!response.ok) {
        if (response.status === 401) setExpired(true);
        throw new Error(body.error);
      }
      if (id === requestId.current) {
        setLeads(body.leads);
        setNext(body.next);
        setApplied({ ...selected });
      }
    } catch (e) {
      if (id === requestId.current) setError(e.message);
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }
  useEffect(() => {
    let active = true;
    fetch("/api/staff/leads", { cache: "no-store" })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) {
          if (r.status === 401 && active) setExpired(true);
          throw new Error(b.error);
        }
        if (active) {
          setLeads(b.leads);
          setNext(b.next);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function mutate(method, body) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/staff/leads", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) setExpired(true);
        throw new Error(result.error);
      }
      setConfirmDelete(null);
      await load("", applied);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function change(e) {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  return (
    <>
      <div className="actions">
        <button
          className="button secondary"
          onClick={async () => {
            const r = await fetch("/api/auth/logout", { method: "POST" });
            if (r.ok) router.refresh();
            else setError("Sign out failed. Try again.");
          }}
        >
          Sign out
        </button>
        <button
          className="button secondary"
          disabled={busy}
          onClick={() => load("", applied)}
        >
          Refresh
        </button>
      </div>
      <form
        className="info-card staff-filters"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <h2>Find enquiries</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="lead-search">Name word, exact email or phone</label>
            <input
              id="lead-search"
              name="q"
              maxLength={100}
              value={filters.q}
              onChange={change}
            />
          </div>
          <div className="form-field">
            <label htmlFor="lead-status">Status</label>
            <select
              id="lead-status"
              name="status"
              value={filters.status}
              onChange={change}
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="lead-service">Service</label>
            <select
              id="lead-service"
              name="service"
              value={filters.service}
              onChange={change}
            >
              <option value="">All services</option>
              {["academic", "career", "financial"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="lead-from">From (UTC)</label>
            <input
              id="lead-from"
              type="date"
              name="from"
              value={filters.from}
              onChange={change}
            />
          </div>
          <div className="form-field">
            <label htmlFor="lead-to">To (UTC)</label>
            <input
              id="lead-to"
              type="date"
              name="to"
              value={filters.to}
              onChange={change}
            />
          </div>
        </div>
        <div className="actions" style={{ marginTop: 20 }}>
          <button className="button" disabled={busy}>
            Apply filters
          </button>
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={() => {
              const empty = {
                q: "",
                status: "",
                service: "",
                from: "",
                to: "",
              };
              setFilters(empty);
              load("", empty);
            }}
          >
            Reset
          </button>
        </div>
      </form>
      {canExport && (
        <form action="/api/enquiries/export" method="GET" className="info-card">
          <h2>Export selected enquiries</h2>
          <p>
            Export uses the applied filters. Choose and apply a date range of up
            to 93 days first.
          </p>
          {Object.entries(applied).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v || ""} />
          ))}
          <button
            className="button"
            disabled={!applied.from || !applied.to || busy}
          >
            Export CSV
          </button>
        </form>
      )}
      {error && (
        <div role="alert" className="form-error">
          {error}
          {expired && (
            <form action="/api/auth/login" method="GET">
              <button className="button">Sign in again</button>
            </form>
          )}
        </div>
      )}
      {busy && <p role="status">Loading enquiries…</p>}
      {!busy && !leads.length && !error && (
        <p className="notice">No enquiries match these filters.</p>
      )}
      <div className="staff-table" aria-busy={busy}>
        <table>
          <caption className="sr-only">Customer enquiries</caption>
          <thead>
            <tr>
              <th>Name & contact</th>
              <th>Interest</th>
              <th>Message</th>
              <th>Date / status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <strong>{lead.name}</strong>
                  <br />
                  {lead.email}
                  <br />
                  {lead.phone}
                </td>
                <td>
                  {lead.serviceInterested || lead.service}
                  <br />
                  {lead.courseTitle || lead.interestedCourse}
                  <br />
                  {lead.counsellingSlug || lead.careerGoal || lead.loanType}
                </td>
                <td className="lead-message">{lead.message || "—"}</td>
                <td>
                  {(lead.submittedAt || lead._createdAt || "").slice(0, 10)}
                  <br />
                  {lead.status || "new"}
                </td>
                <td>
                  {canEdit && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = new FormData(e.currentTarget);
                        mutate("PATCH", {
                          id: lead._id,
                          status: form.get("status"),
                          owner: form.get("owner"),
                        });
                      }}
                    >
                      <label className="sr-only" htmlFor={"status-" + lead._id}>
                        Status for {lead.name}
                      </label>
                      <select
                        id={"status-" + lead._id}
                        name="status"
                        defaultValue={lead.status || "new"}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <label className="sr-only" htmlFor={"owner-" + lead._id}>
                        Owner for {lead.name}
                      </label>
                      <input
                        className="staff-control"
                        id={"owner-" + lead._id}
                        name="owner"
                        maxLength={100}
                        defaultValue={lead.owner || ""}
                        placeholder="Assigned owner"
                      />
                      <button className="button small" disabled={busy}>
                        Save
                      </button>
                    </form>
                  )}
                  {role === "admin" &&
                    (confirmDelete === lead._id ? (
                      <div>
                        <p>Delete this enquiry permanently?</p>
                        <button
                          className="button small"
                          disabled={busy}
                          onClick={() =>
                            mutate("DELETE", { id: lead._id, confirm: true })
                          }
                        >
                          Confirm deletion
                        </button>
                        <button
                          className="button secondary small"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="button secondary small"
                        disabled={busy}
                        onClick={() => setConfirmDelete(lead._id)}
                      >
                        Delete
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {next && (
        <button
          className="button"
          disabled={busy}
          onClick={() => load(next, applied)}
        >
          Next page
        </button>
      )}
    </>
  );
}
