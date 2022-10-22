const express = require("express");
const app = express();
const logger = require("./logger");
const morgan = require("morgan");
const config = require("config");
const inicioDebug = require("debug")("app:inicio");
const dbDebug = require("debug")("app:db");
const usuarios = require("./routers/usuarios");

//sector MIDLEWARE
//Midleware cuando los datos vienen en formato JSON
app.use(express.json());

//Midleware cuando los datos vienen en formato clave valor
app.use(express.urlencoded({ extended: true }));

//Midleware que publica datos estaticos como un txt o una imagen: http://localhost:3000/example.txt
app.use(express.static("public"));

//Midleware logguer propio
app.use(logger);

app.use("/api/usuarios", usuarios);

//Configuracion de entorno
//permite almacenar variables que dependiendo el ambiente
console.log("La aplicacion " + config.get("nombre"));
console.log("DB server" + config.get("configDB.host"));

//Uso de midleware de tercero
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  //console.log("morgan habilitado");
  inicioDebug("Morgan esta habilitado");
}

//Trabajos con base de datos
dbDebug("conectado con la base de datos");

app.get("/", (req, res) => {
  res.send("hola mundo desde Expres");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`);
});
