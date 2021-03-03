const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const enviarEmail = require("../handlers/email");

//autenticar usuario - aqui se pone la estrategia por ejemplo: local, email, facebook
exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos Campos son Obligatorios",
});

//Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
  // si el usuario esta autenticado, adelante
  if (req.isAuthenticated()) {
    return next();
  }

  // si no esta untenticado, redirigir al formulario
  return res.redirect("/iniciar-sesion");
};

//funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion"); //al cerrar sesion no lleva al login
  });
};

//genera un token si el Usuario es valido
exports.enviarToken = async (req, res) => {
  //verificar que el usuario existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  //si no existe el usuario
  if (!usuario) {
    req.flash("error", "No existe esa Cuenta");
    res.redirect("/reestablecer");
  }

  //usuario existe
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  //guardarlos en la BD
  await usuario.save();

  //  url de reset
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  //Enviar el Correo con el Token
  await enviarEmail.enviar({
    usuario,
    subject: "Password Reset",
    resetUrl,
    archivo: "reestablecer-password",
  });
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
    },
  });

  //si no encuentra el usuario
  if (!usuario) {
    req.flash("error", "No Válido");
    res.redirect("reestablecer");
  }

  //Formulario par generar el password
  res.render("resetPassword", {
    nombrePagina: "Reestablecer Contraseña",
  });
};

//cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
  //Verifica el tokem valido pero tambien la fecha de expiracion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });
  //verificamos si el usuario existe
  if (!usuario) {
    req.flash("error", "No Válido");
    res.redirect("reetablecer");
  }
  //hashear el nuevo password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // guardamos el nuevo password
  await usuario.save();

  req.flash("correcto", "Tu password se ha modificado correctamente");
  res.redirect("/iniciar-sesion");
};
