const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const https = require("https");

// const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/e3fa8cc903";
  const options = {
    method: "POST",
    auth: process.env.AUTH,
  };
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {});
  });

  request.write(jsonData);
  request.end();

  res.sendFile(__dirname + "/registrocorrecto.html");
});

app.get("/registro", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/registro", (req, res) => {
  var transporter = nodemailer.createTransport({
    host: "mail.rodolfocastaneda.com",
    port: "465",
    secure: true,
    auth: {
      user: "noreplay@rodolfocastaneda.com",
      pass: "P*$&GTI*;TW{",
    },
  });

  const name = req.body.name;
  const lastName = req.body.lastName;
  const CURP = req.body.CURP;
  const phone = req.body.phone;
  const email = req.body.email;
  const curso = req.body.queCurso;
  const date = new Date().toLocaleDateString();

  var mensaje = `¡¡Hola Rod!!
      Felicidades, ${name} ${lastName} se acaba de inscribir a tu curso de ${curso}.
      Conoce más sobre ${name}:
      Nombre: ${name}
      Apellido: ${lastName}
      CURP: ${CURP}
      Teléfono: ${phone}
      Correo: ${email}

      Te recordamos que este es un correo automatizado, para más información, dudas o aclaraciones contacta al equipo de Creativa2020.
      ${date}
    `;

  var mailOptions = {
    from: "noreplay@rodolfocastaneda.com",
    to: "visualcenter.mkt@gmail.com",
    subject: "NUEVO USUARIO",
    text: mensaje,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.sendFile(__dirname + "/error.html");
    } else {
      console.log(req.body);
    }
  });
});

app.listen(3000, function () {
  console.log("Server is on");
});
