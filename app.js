const express = require("express");
const Joi = require("joi");
const app = express();
const logger = require("./logger");
const morgan = require("morgan");
const config = require("config");
const inicioDebug = require("debug")("app:inicio");
const dbDebug = require("debug")("app:db");

//sector MIDLEWARE
//Midleware cuando los datos vienen en formato JSON
app.use(express.json());

//Midleware cuando los datos vienen en formato clave valor
app.use(express.urlencoded({ extended: true }));

//Midleware que publica datos estaticos como un txt o una imagen: http://localhost:3000/example.txt
app.use(express.static("public"));

//Midleware logguer propio
app.use(logger);

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

//Metodos
/* 
app.get(); //peticion
app.post(); //envio datos
app.put(); //actualizacion
app.delete(); //eliminacion
 */

const usuarios = [
  {
    id: 1,
    nombre: "Emma",
  },
  {
    id: 2,
    nombre: "Ana",
  },
  {
    id: 3,
    nombre: "Pablo",
  },
];

app.get("/", (req, res) => {
  res.send("hola mundo desde Expres");
});

app.get("/api/usuarios", (req, res) => {
  res.send(usuarios);
});

// /1994/10
/* app.get("/api/usuarios/:year/:month", (req, res) => {
    res.send(req.params);
}); */

// ?nombre=ema
/* app.get("/api/usuarios/:year/:month", (req, res) => {
  res.send(req.query);
}); */

//ENVIAR AL CLIENTE INFORMACION
//GET!
app.get("/api/usuarios/:id", (req, res) => {
  let usuario = validarUsuario(req.params.id);

  if (!usuario) res.status(404).send(`El usuario no existe ${req.params.id}`);

  res.send(usuario);
});

//POST!
app.post("/api/usuarios", (req, res) => {
  /* if (!req.body.nombre || req.body.nombre.length <= 2) {
    //400 Bad Request
    res.status(400).send("debe ingresar un nombre, que tenga minimo 3 letras");
    return;
  } */
  const { error, value } = validarUsuario(req.body.nombre);
  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre,
    };

    usuarios.push(usuario);
    res.send(usuario);
  } else {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }
});

//PUT!
app.put("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send(`El usuario no existe ${req.params.id}`);
    return;
  }

  const { error, value } = validarUsuario(req.body.nombre);
  if (error) {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return;
  }

  usuario.nombre = value.nombre;
  res.send(usuario);
});

//DELETE!
app.delete("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send(`El usuario no existe ${req.params.id}`);
    return;
  }

  const index = usuarios.indexOf(usuario);

  usuarios.splice(index, 1);

  res.send(usuarios);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`);
});

//FUNCIONES AUXILIARES.
//encontrar si exste el objeto existe
const existeUsuario = (id) => {
  return usuarios.find((usu) => usu.id === parseInt(id));
};

const validarUsuario = (nom) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  return schema.validate({ nombre: nom });
};
