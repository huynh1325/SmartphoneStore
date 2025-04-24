require("dotenv").config();
import express from "express"
import configViewEngine from "./configs/viewEngine"
import initWebRoutes from "./routes/web"
import connection from "./configs/connectDB";
import configCors from "./configs/cors"
import bodyParser from "body-parser";
const path = require('path')

const app = express()
const port = process.env.PORT || 8080

const hostname = process.env.HOST_NAME

configCors(app)

configViewEngine(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

connection();

initWebRoutes(app);

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})