//Modulos
const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const admin = require("./routes/admin.js");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");

const Postagem = mongoose.model("Postagem");

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
    saveUninitialized: true
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//Banco de Dados
//mongoose.Promise = global.Promesi;
mongoose
  .connect("mongodb://localhost/blogapp", { useNewUrlParser: true })
  .then(() => console.log("Conectado com sucesso ao Mongo"))
  .catch(err => console.log("Não pode ser devido a " + err));

//Middlewares

//Rotas
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", admin);

app.get("/", (req, res) => {
  Postagem.find()
    .populate("categorias")
    .sort({ data: "desc" })
    .then(postagens => {
      res.render("admin/index", { postagens: postagens });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/404");
    });
});

app.get("/404", (req, res) => {
  res.send("Erro 404");
});

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug })
    .then(postagem => {
      if (postagem) {  
        res.render("postagem/index", { postagem: postagem });
      } else {
        req.flash("msg_error", "Houve um erro para carregar essa postagem");
        //res.redirect("/");
      }
    })
    .catch(error => {
      req.flash(
        "msg_error",
        "Houve um erro para carregar essa postagem"
      );
      res.redirect("/");
    });
});
//Servidor

const porta = 8081;
app.listen(porta, () => {
  console.log("Servidor inicializado com sucesso!!");
});
