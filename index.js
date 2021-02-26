const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

//helpers con algunas funciones
const helpers = require("./helpers");

//crear la conexion a la base de datos
const db = require("./config/db");

// importar el modelo
require("./models/Proyectos");
require("./models/Tareas");

db.sync()
  .then(() => console.log("Conectado al Servidor"))
  .catch((error) => console.log(error));

// crear una app de express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static("public"));

//habilitar Pug
app.set("view engine", "pug");

//Añadir las vistas
app.set("views", path.join(__dirname, "./views"));

//Pasar var dum a la aplicacion
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  next();
});

// //aprendiendo Middleeare
// app.use((req,res,next)=>{
//   const fecha= new Date();
//   res.locals.year= fecha.getFullYear();
//   next();
// })

//habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({ extend: true }));

app.use("/", routes());

app.listen(3000);
