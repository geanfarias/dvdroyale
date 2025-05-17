import cookieParser from 'cookie-parser'
import express from 'express'
import routers from './routes/index.routes'
const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

routers.forEach((router) => {
  app.use(router)
})
