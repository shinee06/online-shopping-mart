import app from './app.js'

const requiredEnvironment = ['DB_HOST', 'DB_USER', 'DB_NAME', 'SESSION_SECRET']
const missingEnvironment = requiredEnvironment.filter(
  (key) => !process.env[key]
)

if (missingEnvironment.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironment.join(', ')}`
  )
}

if (process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must contain at least 32 characters')
}

const port = Number(process.env.PORT || 5000)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
