const passport = require("passport");
const Usuarios = require("../models/Usuarios");

const crypto = require("crypto");

//aqui se pone la estrategia por ejemplo: local, email, facebook
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
  console.log(resetUrl);
};

exports.resetPassword = async (req, res) => {
  res.json(req.params.token);
};
