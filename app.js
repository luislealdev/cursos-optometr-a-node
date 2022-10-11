const express = require("express");
// const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/index.html");
});

app.get("/registro", (req, res) => {
  res.sendFile(__dirname+"/register.html")
});
app.listen(3000, function () {
  console.log("Server is on");
});
