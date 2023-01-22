require("dotenv").config()

const DBconnect = require("./config/dbConfig")
DBconnect() 

const app = require("./app")

app.listen(process.env.PORT, ()=>console.log(`Server is up and running in port ${process.env.PORT}...!`))