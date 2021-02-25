import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");

btnEliminar.addEventListener("click", () => {
  Swal.fire({
    title: "Deseas borrar este Proyecto?",
    text: "Un proyecto eliminado no se puede recuperar!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Borrar",
    cancelButtonText: "No, Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "Proyecto Eliminado ",
        "El Proyecto se ha eliminado.",
        "success"
      );

      //redireccionar al inicio
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  });
});
