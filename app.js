
require("dotenv").config();

const express = require("express")
const cookieParser = require("cookie-parser")
const http = require("http")

const app = express();

app.use(cookieParser());
app.use(express.json());



const httpServer = http.createServer(app);

httpServer.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.APP_PORT || 3000}...`)
})