import {useEffect, useState} from 'react'
import {useClient} from 'sanity'
export default function ContentDashboard() {
  const client = useClient({apiVersion: '2026-01-01'})
  const [stats, setStats] = useState(null),
    [error, setError] = useState(''),
    [refresh, setRefresh] = useState(0)
  useEffect(() => {
    let active = true
    client
      .fetch(
        '{"courses":count(*[_type=="course" && !(_id in path("drafts.**"))]),"services":count(*[_type=="counsellingService" && !(_id in path("drafts.**"))]),"drafts":count(*[_id in path("drafts.**")]),"updates":count(*[_type=="update" && approved==true && !(_id in path("drafts.**"))])}',
      )
      .then((data) => {
        if (active) {
          setStats(data)
          setError('')
        }
      })
      .catch(() => {
        if (active) setError('Unable to load dashboard. Try again.')
      })
    return () => {
      active = false
    }
  }, [client, refresh])
  return (
    <div style={{padding: 32, maxWidth: 1000}}>
      <h1>J.ed content dashboard</h1>
      <p>
        Use the Content tab to edit the website. Approve a record and publish it to make it public.
        Website content refreshes within approximately 60 seconds.
      </p>
      {error ? (
        <p role="alert">
          {error} <button onClick={() => setRefresh((v) => v + 1)}>Retry</button>
        </p>
      ) : stats ? (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 24}}>
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              style={{border: '1px solid #aaa', borderRadius: 8, padding: 24, minWidth: 150}}
            >
              <h2>{value}</h2>
              <p>{key}</p>
            </div>
          ))}
        </div>
      ) : (
        <p role="status">Loading dashboard…</p>
      )}
      <h2>Publishing checklist</h2>
      <ul>
        <li>
          Confirm institution, duration, eligibility, fees and curriculum with the supplied course
          material.
        </li>
        <li>Add descriptive image text and only publish approved reviews or placement stories.</li>
        <li>Sample records are clearly marked and hidden from production.</li>
        <li>
          Edit shared phone, address, social links and membership details under Contact & site
          settings.
        </li>
      </ul>
      <h2>Enquiries</h2>
      <p>
        Use Staff enquiries & exports to open the authenticated lead workspace. Keep enquiry data in
        the private dataset.
      </p>
    </div>
  )
}
