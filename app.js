
require("dotenv").config();

const path = require("path")
const cors = require("cors");
const http = require("http");
const express = require("express")

const app = express();

app.use(cors());

if(process.env.STATIC_HOST == 1) {
    app.use(express.static(path.join(__dirname, "app", "dist")))
}

app.get("/", (req, res) => {
    res.redirect("/api")
})
app.get("/api", (req, res) => {
    res.status(200).end("<h1>Hello world</h1>")
})

app.use((req, res) => {
    res.status(404).end("<h1>404 page not found</h1>")
})

const server = http.createServer(app);
server.listen(process.env.APP_PORT || 3000, () => {
    console.log(`server is running on port ${process.env.APP_PORT || 3000}`)
})