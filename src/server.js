import express from 'express'
import API from './api'

const app = express()
const port = 3000

app.get('/download', API.download)
app.use(API.defaults)
app.use(API.errors)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

export default app