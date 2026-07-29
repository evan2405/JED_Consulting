import React, { useState } from 'react'

const API_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/export-enquiries'
    : '/api/export-enquiries'

export default function ExportEnquiriesTool() {
  const [adminKey, setAdminKey] = useState('')
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleDownload = async () => {
    if (!adminKey.trim()) {
      setStatus('error')
      setErrorMsg('Please enter your Admin Export Key.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const url = `${API_URL}?key=${encodeURIComponent(adminKey.trim())}`
      const res = await fetch(url)

      if (res.status === 401) {
        setStatus('error')
        setErrorMsg('Invalid admin key.')
        return
      }

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(`Server error: ${res.status}`)
        return
      }

      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = blobUrl
      a.download = `jed-enquiries-${today}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Network error — make sure the Next.js dev server is running.')
    }
  }

  return (
    <div style={styles.page}>
      {/* Decorative glow blobs */}
      <div style={styles.glowRed} />
      <div style={styles.glowBlue} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div>
            <h1 style={styles.title}>Export Enquiries</h1>
            <p style={styles.subtitle}>Download all form submissions as a CSV spreadsheet</p>
          </div>
        </div>

        {/* Key input */}
        <div style={styles.field}>
          <label style={styles.label}>Admin Export Key</label>
          <input
            type="password"
            placeholder="Enter your admin key"
            value={adminKey}
            onChange={(e) => { setAdminKey(e.target.value); setStatus(null) }}
            style={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
          />
        </div>

        {/* Status messages */}
        {status === 'error' && (
          <div style={styles.errorBox}>
            <span style={{ marginRight: 8 }}>⚠️</span>{errorMsg}
          </div>
        )}
        {status === 'success' && (
          <div style={styles.successBox}>
            <span style={{ marginRight: 8 }}>✅</span>Download started! Open the <strong>.csv</strong> file in Excel or Google Sheets.
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={status === 'loading'}
          style={{
            ...styles.button,
            opacity: status === 'loading' ? 0.7 : 1,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? (
            <>⏳ Downloading...</>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download as CSV (Excel)
            </>
          )}
        </button>

        <p style={styles.footer}>
          The file includes a UTF-8 BOM — it opens correctly in Microsoft Excel and Google Sheets.
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#060f2b',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 16px',
    position: 'relative',
    overflow: 'hidden',
  },
  glowRed: {
    position: 'absolute',
    top: '-10%',
    left: '-5%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBlue: {
    position: 'absolute',
    bottom: '-10%',
    right: '-5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
  },
  iconWrap: {
    background: '#dc2626',
    borderRadius: '12px',
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 0 20px rgba(220,38,38,0.3)',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: '#f8fafc',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#94a3b8',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginBottom: '8px',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(255, 255, 255, 0.05)',
    fontSize: '14px',
    color: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  },
  errorBox: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#ef4444',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  successBox: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#4ade80',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 8px 25px rgba(220,38,38,0.35)',
  },
  footer: {
    marginTop: '16px',
    fontSize: '12px',
    color: '#64748b',
    textAlign: 'center',
  },
}
