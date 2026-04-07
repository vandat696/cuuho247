import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Loading...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test backend connection
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus('✅ Backend connected!')
        console.log('Backend response:', data)
      })
      .catch((error) => {
        setBackendStatus('❌ Backend not responding')
        console.error('Error:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Road Rescue System</h1>
        <p>Base Environment Test</p>
      </header>

      <main className="main">
        <section className="section">
          <h2>Frontend Status</h2>
          <div className="status-card success">
            <p>✅ Frontend is running on port 5173</p>
          </div>
        </section>

        <section className="section">
          <h2>Backend Status</h2>
          <div className={`status-card ${loading ? 'loading' : backendStatus.includes('✅') ? 'success' : 'error'}`}>
            <p>{backendStatus}</p>
          </div>
        </section>

        <section className="section">
          <h2>Tech Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React 18</li>
                <li>Vite</li>
                <li>TypeScript</li>
                <li>React Router</li>
                <li>Zustand</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Node.js + Express</li>
                <li>MongoDB + Mongoose</li>
                <li>Socket.IO</li>
                <li>TypeScript</li>
                <li>Bull (Job Queue)</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Road Rescue System © 2026 | Team Development</p>
      </footer>
    </div>
  )
}

export default App
