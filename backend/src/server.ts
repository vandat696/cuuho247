import app from './app'

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  console.log(`
    Server running on: http://localhost:${PORT}
    Environment: ${NODE_ENV}
    API: http://localhost:${PORT}/api
    Health check: http://localhost:${PORT}/api/health

Ready for requests!
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})
