const express = require("express");
const Joi = require("joi");

const ruta = express.Router();

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

ruta.get("/", (req, res) => {
  res.send(usuarios);
});

// /1994/10
/* ruta.get("/api/usuarios/:year/:month", (req, res) => {
      res.send(req.params);
  }); */

// ?nombre=ema
/* ruta.get("/api/usuarios/:year/:month", (req, res) => {
    res.send(req.query);
  }); */

//ENVIAR AL CLIENTE INFORMACION
//GET!
ruta.get("/:id", (req, res) => {
  let usuario = validarUsuario(req.params.id);

  if (!usuario) res.status(404).send(`El usuario no existe ${req.params.id}`);

  res.send(usuario);
});

//POST!
ruta.post("/", (req, res) => {
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
ruta.put("/:id", (req, res) => {
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
ruta.delete("/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send(`El usuario no existe ${req.params.id}`);
    return;
  }

  const index = usuarios.indexOf(usuario);

  usuarios.splice(index, 1);

  res.send(usuarios);
});

//FUNCIONES AUXILIARES.
const existeUsuario = (id) => {
  return usuarios.find((usu) => usu.id === parseInt(id));
};

const validarUsuario = (nom) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  return schema.validate({ nombre: nom });
};

module.exports = ruta;
