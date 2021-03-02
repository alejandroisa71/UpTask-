const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

//helpers con algunas funciones
const helpers = require("./helpers");

//crear la conexion a la base de datos
const db = require("./config/db");

// importar el modelo
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("Conectado al Servidor"))
  .catch((error) => console.log(error));

// crear una app de express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static("public"));

//habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

//agregamos la validacion de express validator para toda la aplicacion
app.use(expressValidator());

//habilitar Pug
app.set("view engine", "pug");

//Añadir las vistas
app.set("views", path.join(__dirname, "./views"));

//agregar falsh messages
app.use(flash());

app.use(cookieParser());

//sesiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dum a la aplicacion
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  next();
});

// //aprendiendo Middleeare
// app.use((req,res,next)=>{
//   const fecha= new Date();
//   res.locals.year= fecha.getFullYear();
//   next();
// })

app.use("/", routes());

app.listen(3000);
