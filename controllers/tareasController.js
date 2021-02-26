const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.agregarTarea = async (req, res, next) => {
  //obtenemos el proyecto actual
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

  //leer el valor del input
  const { tarea } = req.body;

  // estado 0 + incompleto y ID del proyecto
  const estado = 0;
  const proyectoId = proyecto.id;

  // Insertar en la BD
  const resultado = Tareas.create({ tarea, estado, proyectoId });

  if (!resultado) {
    return next();
  }

  // redireccionar
  res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea=async(req,res,next)=>{
  //con catch se aceden a los parametros con params
  const {id} = req.params;
  // const tarea = await Tareas.findOne({where:{id:id}}) se utiliza mejor
  const tarea = await Tareas.findOne({where:{id}})
  console.log(tarea);

  //cambiar estado
  let estado = 0;
  if (tarea.estado===estado) {
    estado=1;
  }
  tarea.estado=estado;

  const resultado = await tarea.save();

  if(!resultado) return next()

  res.status(200).send('Actualizado');
} 
