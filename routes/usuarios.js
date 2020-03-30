const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const passport = require("passport");

require("../models/Usuario");

const Usuario = mongoose.model("Usuario");

router.use("/registro", (req, res) => {
  res.render("usuario/registro");
});

router.post("/registros", (req, res) => {
  console.log("teste");
  let erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }

  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "E-mail inválido" });
  }

  if (
    !req.body.senha ||
    typeof req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha inválido" });
  }

  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "As senhas não são iguais" });
  }

  if (erros.length > 0) {
    res.render("usuario/registro", { erros: erros });
  } else {
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(res, req, next);
});

module.exports = router;
