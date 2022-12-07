const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/registro", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

var path1;
var path2;

app.use(bodyParser.json());

const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./files");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).array("files");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/registro", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong!");
    } else {
      path1 = req.files[0].path;
      path2 = req.files[1].path;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "noreplaycreativa2020@gmail.com",
          pass: process.env.PASS,
        },
      });
      const name = req.body.name;
      const lastName = req.body.lastName;
      const CURP = req.body.CURP;
      const address =
        req.body.calle +
        " " +
        req.body.colinia +
        " " +
        req.body.cp +
        " " +
        req.body.ciudad +
        " " +
        req.body.estado;
      const phone = req.body.phone;
      const schoolar = req.body.schoolar;
      const placeBorn = req.body.placeBorn;
      const nacionality = req.body.nacionality;
      const email = req.body.email;
      const date = new Date().toLocaleDateString();

      //-------------MAILCHIMP-----------
      const data = {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: name,
              LNAME: lastName,
              PHONE: phone,
            },
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

      // request.post(
      //   {
      //     headers: { "content-type": "application/x-www-form-urlencoded" },
      //     url: url,
      //     body: options,
      //   },
      //   function (error, response, body) {
      //     console.log(body);
      //   }
      // );

      const mensaje = `¡¡Hola Rod!!
          Felicidades, ${name} ${lastName} se acaba de inscribir a tu curso.
          Conoce más sobre ${name}:
          Nombre: ${name}
          Apellido: ${lastName}
          CURP: ${CURP}
          Domicilio: ${address}
          Teléfono: ${phone}
          Escolaridad: ${schoolar}
          Lugar de nacimiento: ${placeBorn}
          Nacionalidad: ${nacionality}
          Correo: ${email}

          Te recordamos que este es un correo automatizado, para más información, dudas o aclaraciones contacta al equipo de Creativa2020.
          ${date}
        `;

      var mailOptions = {
        from: "noreplaycreativa2020@gmail.com",
        to: "visualcenter.mkt@gmail.com",
        subject: "NUEVO USUARIO",
        text: mensaje,
        attachments: [
          {
            path: path1,
          },
          {
            path: path2,
          },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        } else {
          res.sendFile(__dirname + "/registrocorrecto.html");
        }
      });
    }
  });
});

app.listen(process.env.PORT || 3000),
  function () {
    console.log("Server is running on port 3000");
  };
