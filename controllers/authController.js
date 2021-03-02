const passport = require("passport");

const Usuarios = require("../models/Usuarios");

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
exports.enviarToken = async (req, res, next) => {
  //verificar que el usuario existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  //si no existe el usuario
  if (!usuario) {
    req.flash("error", "No existe esa Cuenta");
    res.render("reestablecer", {
      nombrePagina: "Reestablecer tu Contraseña",
      mensajes: req.flash(),
    });
  }
};
