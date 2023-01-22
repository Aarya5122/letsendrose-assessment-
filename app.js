const cookieParser = require("cookie-parser");
const express = require("express")
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

const userRoutes = require("./routes/user.routes")
app.use("/api1", userRoutes)

app.get("/",(req, res)=>{
    res.send("<h1>Server up and running</h1>")
})

module.exports = app