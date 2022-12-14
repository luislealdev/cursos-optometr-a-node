const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const https = require('https');

// const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

// var path1;
// var path2;

app.use(bodyParser.json());

// const Storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./files");
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//   },
// });

// var upload = multer({
//   storage: Storage,
// }).array("files");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/registro", (req, res) => {
      // path1 = req.files[0].path;
      // path2 = req.files[1].path;
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
      // const address = req.body.address;
      const phone = req.body.phone;
      // const schoolar = req.body.schoolar;
      // const placeBorn = req.body.placeBorn;
      // const nacionality = req.body.nacionality;
      const email = req.body.email;
      const curso = req.body.queCurso;
      const date = new Date().toLocaleDateString();

      var mensaje = `????Hola Rod!!
          Felicidades, ${name} ${lastName} se acaba de inscribir a tu curso de ${curso}.
          Conoce m??s sobre ${name}:
          Nombre: ${name}
          Apellido: ${lastName}
          CURP: ${CURP}
          Tel??fono: ${phone}
          Correo: ${email}

          Te recordamos que este es un correo automatizado, para m??s informaci??n, dudas o aclaraciones contacta al equipo de Creativa2020.
          ${date}
        `;

      // Escolaridad: ${schoolar}
      // Lugar de nacimiento: ${placeBorn}
      // Nacionalidad: ${nacionality}
      // Domicilio: ${address}

      var mailOptions = {
        from: "noreplay@rodolfocastaneda.com",
        to: "hola@rodolfocastaneda.com",
        subject: "NUEVO USUARIO",
        text: mensaje,
        // attachments: [
        //   {
        //     path: path1,
        //   },
        //   {
        //     path: path2,
        //   },
        // ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.sendFile(__dirname + "/error.html");
        } else {
          res.sendFile(__dirname + "/cool.html");
        }
      });
    }
);

app.listen(3000, function () {
  console.log("Server is on");
});
