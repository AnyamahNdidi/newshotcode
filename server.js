const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 7000;

const DB_ONLINE = "mongodb+srv://shotkode:shotkode@cluster0.2kfdg.mongodb.net/shotkodeDB?retryWrites=true&w=majority";

const app = express();


mongoose
  .connect(DB_ONLINE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database has been connected successfully...!");
  });

app.get("/", async (req, res) => {
  res.status(200).send("API is ready for consumption");
});

app.listen(port, () => {
  console.log(`server is ready to listen to port: ${port}`);
});
