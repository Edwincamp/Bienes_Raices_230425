// Ejemplo de activacion de HOT RELOAD
//const nombre = "Edwin"
// console.log('Hola $(Edwin), desde NodeJS, Esto esta en hot reload ')

//const express = requiere ('express');
// Importar la libreria para crear un servidor web -     / ECHA-Script 6
// Instacia, nujestra aplicacion web
//import express from 'express';

//const app = express();

//const port = 3000;
//app.listen (port, ()=>{
 //   console.log(`La aplicacion ha iniciado en el puerto; ${port}`);
//})
  
// Routing Enrutamientop para peliciones
//app.get("/", function(req,res){
   //res.send ("Hola desde la web, en NodeJS")
//})

///app.get("/quieneres",function(req,res){
  //  res.json(
  //      {
   //         "nombre": "Edwin Hernandez Campos",
   //         "Carrera": " TI. Desarrollo de software Multiplataforma",
    //        "grado": "4",
     //       "grupo": "A"
  //      }
  //  )
//})
import generalRoutes from './Routes/generalRoutes.js';
import userRoutes from './Routes/userRoutes.js'
import express  from 'express'

const app =  express()

const port = 3000

app.listen(port,()=>
    console.log('La aplicación ha iniciado en el puerto ${port}'))
app.use("/",generalRoutes)
app.use("/usuario",userRoutes)


