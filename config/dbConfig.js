const mongoose = require("mongoose");

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://localhost:27017/letsendroseusers", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection successfull");
    })
    .catch((error) => {
      console.log("DB connection failure");
      console.log(error);
      process.exit(0);
    });
};

module.exports = connect;
