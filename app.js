//Modulos
const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const admin = require("./routes/admin.js");
const usuarios = require("./routes/usuarios.js");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

require("./models/Postagem");
const Postagem = mongoose.model("Postagem");

require("./models/Categoria");
const Categoria = mongoose.model("Categoria");

const passport = require("passport");
require("./config/auth")(passport);

//Configuracoes
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Configurações
//Sessão
app.use(
  session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user  || null
  next();
});

//Banco de Dados
//mongoose.Promise = global.Promesi;
mongoose
  .connect("mongodb://localhost/blogapp", { useNewUrlParser: true })
  .then(() => console.log("Conectado com sucesso ao Mongo"))
  .catch((err) => console.log("Não pode ser devido a " + err));

//Middlewares

//Rotas
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", admin);
app.use("/usuarios", usuarios);

app.get("/", (req, res) => {
  Postagem.find()
    .populate("categorias")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("admin/index", { postagens: postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/404");
    });
});

app.get("/404", (req, res) => {
  res.send("Erro 404");
});

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug })
    .then((postagem) => {
      if (postagem) {
        res.render("postagem/index", { postagem: postagem });
      } else {
        req.flash("msg_error", "Houve um erro para carregar essa postagem");
        res.redirect("/");
      }
    })
    .catch((error) => {
      req.flash("msg_error", "Houve um erro para carregar essa postagem");
      res.redirect("/");
    });
});

app.get("/categorias", (req, res) => {
  Categoria.find()
    .then((categorias) => {
      res.render("categorias/index", { categorias: categorias });
    })
    .catch((error) => {
      req.flash("error_msg", " Houve um erro interno ao lsitas as categorias");
      res.redirect("/");
    });
});

app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({ slug: req.params.slug })
    .then((categoria) => {
      if (categoria) {
        Postagem.find({ categoria: categoria._id })
          .then((postagem) => {
            res.render("categorias/postagens", {
              postagens: postagem,
              categoria: categoria,
            });
          })
          .catch((error) => {
            req.flash("error_msg", "Houve um erro ao encontrar as postagens");
            res.redirect("/");
          }); // pesquisar os posts quem tem essa categoria
      } else {
        req.flash("error_msg", "Essa categoria nao existe");
        res.redirect("/");
      }
    })
    .catch((error) => {
      req.flash(
        "error_msg",
        "Houve um erro interno ao recarregar a pagina dessa categoria"
      );
      res.redirect("/");
    });
});

app.get("/login", (req, res) => {
  res.render("usuarios/login");
});
//Servidor

const porta = 8081;
app.listen(porta, () => {
  console.log("Servidor inicializado com sucesso!!");
});
