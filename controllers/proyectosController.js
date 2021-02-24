const Proyectos = require("../models/Proyectos");

exports.proyectosHome = async (req, res) => {
  const proyectos = await Proyectos.findAll();

  res.render("index", {
    nombrePagina: "Proyectos",
    proyectos,
  });
};

exports.formularioProyecto =async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos
  });
};

exports.nuevoProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  //Enviar a la consola lo que el usuario escriba
  //console.log(req.body)

  //validar que tengamos algo en el input
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre Al Proyecto" });
  }

  // si hay errores
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos
    });
  } else {
    //no hay errores
    //Insertar en la BD.
    const proyecto = await Proyectos.create({ nombre });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req,res,next)=>{
  const proyectos = await Proyectos.findAll();

  const proyecto = await Proyectos.findOne({
      where: {
          url: req.params.url
      }
  });
  if(!proyecto) return next();
  
  //render a la vista
  res.render('tareas',{
    nombrePagina:'Tareas del Proyecto',
    proyecto,
    proyectos
  })
}

exports.formularioEditar =async (req,res)=>{
  const proyectosPromise = await Proyectos.findAll();

  const proyectoPromise= Proyectos.findOne({
    wher:{
      id:req.params.id
    }
  });

  const[proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise])

  //render a la vista
  res.render('nuevoProyecto',{
    nombrePagina: ' Editar Proyecto',
    proyectos,
    proyecto
  })
}
