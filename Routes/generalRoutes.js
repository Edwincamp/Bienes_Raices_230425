import express from 'express';
const router = express.Router();
router.get("/", function(req,res){
    res.send("Hola desde la Web, en NodeJS")
})
router.get("/quienEres", function(req,res){
    res.json(
        {
            "nombre":"Edwin Hernandez Campos",
            "carrera":"TI DSM",
            "grado":"4°",
            "grupo":"A"
        }
    )
});
export default router; // Esta palabra reservada de JS me permite exportar los elementos