const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 7000;
const bodyParser = require("body-parser");
const fileRoutes = require("./routes/file-upload-routes");
const path = require("path");

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

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", fileRoutes.routes);

app.get("/", async (req, res) => {
  res.status(200).send("API is ready for consumption");
});

app.listen(port, () => {
  console.log(`server is ready to listen to port: ${port}`);
});
