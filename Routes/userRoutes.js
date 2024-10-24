import express from 'express';
const router = express.Router();
// GET
// Endpoints - Son las rutas para acceder a las secciones o funciones de nuestra aplicación web. compuesto por dos elementos: 1.- ruta 2.- funcion callback de lo que va a hacer
// ":" en una ruta, definen de manera posicional los parámetros de entrada
router.get("/findByID/:id", function (request,response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`)
})
// 2 componentes de una petición: ruta (), función callback (que hará)
// POST
router.post("/newUser/:name/:email/:password", function(req,res){
    res.send(`Se ha solicitado la creación de un nuevo usuario de nombre: ${req.params.name}, asociado al correo electroníco: ${req.params.email} y contraseña: ${req.params.password}`)
})
// PUT
router.put("/replaceUserByEmail/:name/:email/:password", function(a,b){
    b.send(`Se ha solicitado el reemplazo de toda la información del usuario: ${a.params.name}, con correo: ${a.params.email} y contraseña: ${a.params.password}`)
})
// PATCH
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm",function(request,response){
    const {email, newPassword, newPasswordConfirm} = request.params; // Desestructuración de un objeto
    if(newPassword==newPasswordConfirm){
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, se aceptan 
los cambios ya que la contraseña y la confirmación son la misma.`)
    } else {
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email} con la nueva 
contraseña ${newPassword}, pero se rechazo el cambio dado que la nueva contraseña y su confirmación no coinciden`)
    }
})
// DELETE
router.delete("/deleteUser/:email",function(request,response){
    response.send(`Se ha solicitado la eliminación del usuario asociado al correo ${request.params.email}`)
})
export default router;