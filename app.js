
require("dotenv").config();

const path = require("path")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const http = require("http");
const express = require("express")

const sanitizeData = require("./middlewares/sanitizeData");


const emailRoutes = require("./routes/email")
const userRoutes = require("./routes/user")

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser())

if(process.env.STATIC_HOST == 1) {
    app.use(express.static(path.join(__dirname, "app", "dist")))
}

app.use(sanitizeData);

app.use("/api/email", emailRoutes)
app.use("/api/user", userRoutes)

app.get("/", (req, res) => {
    res.redirect("/api")
})

// 404 endpoint
app.use((req, res) => {
    res.status(404).end("<h1>404 page not found</h1>")
})

const server = http.createServer(app);
server.listen(process.env.APP_PORT || 3000, () => {
    console.log(`server is running on port ${process.env.APP_PORT || 3000}`)
})