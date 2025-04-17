require("dotenv").config();
import express from "express"
import configViewEngine from "./configs/viewEngine"
import initWebRoutes from "./routes/web"
const path = require('path')

const app = express()
const port = process.env.PORT || 8080

const hostname = process.env.HOST_NAME

configViewEngine(app)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//   res.send('hello huynh')
// })

initWebRoutes(app);

// app.get('/', (req, res) => {
//   res.render('sample.ejs')
// })

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})