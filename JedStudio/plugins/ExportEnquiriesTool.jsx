export default function ExportEnquiriesTool() {
  const origin = process.env.SANITY_STUDIO_WEBSITE_ORIGIN
  let safe = false
  try {
    const u = new URL(origin)
    safe = u.protocol === 'https:' || (u.hostname === 'localhost' && u.protocol === 'http:')
  } catch {}
  return (
    <div style={{padding: 40, maxWidth: 720}}>
      <h1>Staff enquiries & exports</h1>
      <p>
        Open the website’s staff workspace and sign in with your approved account. Exports require
        the exporter or administrator role and are recorded in the access audit.
      </p>
      {safe ? (
        <a href={new URL('/staff', origin).href} target="_blank" rel="noopener noreferrer">
          Open secure staff workspace ↗
        </a>
      ) : (
        <p>Set SANITY_STUDIO_WEBSITE_ORIGIN to the deployed website origin.</p>
      )}
      <p>
        CSV files contain personal information. Store them securely and remove them when no longer
        needed.
      </p>
    </div>
  )
}
