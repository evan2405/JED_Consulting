export default function Curriculum({
  modules = [],
  status = "approved",
  service = false,
}) {
  modules = Array.isArray(modules) ? modules : [];
  return (
    <section className="curriculum">
      <h2>{service ? "What your guidance covers" : "Curriculum"}</h2>
      {status === "overview" && (
        <p className="notice">
          Programme overview. The institution’s official teaching curriculum is
          still to be confirmed.
        </p>
      )}
      {modules.length ? (
        modules.map((module, i) => (
          <details key={module._key || i} open={i === 0}>
            <summary>
              {String(i + 1).padStart(2, "0")} · {module.title}
            </summary>
            <ul>
              {(module.topics || []).map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </details>
        ))
      ) : (
        <p>
          The official {service ? "service outline" : "curriculum"} has not yet
          been supplied. Ask our team for the current details before proceeding.
        </p>
      )}
    </section>
  );
}
