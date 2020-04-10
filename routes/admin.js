const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("Categoria");
require("../models/Postagem");
const Postagem = mongoose.model("Postagem");
const { eAdmin } = require("../helpers/eadmin");

router.get("/posts", eAdmin, (req, res) => {
  res.send("Pagina inicial router");
});

router.get("/", eAdmin,(req, res) => {
  Categoria.find()
    .sort({ date: "asc" })
    .then((categorias) => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao lista as categorias");
    });
});

router.get("/categorias/edit/:id",eAdmin, (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .then((categoria) => {
      res.render("admin/editcategorias", { categoria: categoria });
    })
    .catch(() => {
      req.flash("error_msg", "Essa categoria não existe");
      res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit",eAdmin, (req, res) => {
  console.log(teste);
  Categoria.findOne({ _id: req.body.id })
    .then((categoria) => {
      categoria.nome = req.body.nome;
      categoria.slug = req.body.slug;
      categoria
        .save()
        .then(() => {
          req.flash("success_msg", "categoria editada com sucesso");
          res.redirect("/admin/categorias");
        })
        .catch((err) => {
          req.flash("err_msg", "Houve um erro ao tentar editar a categoria");
          res.redirect("/admin/categorias");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao tentar editar a categoria");
      res.redirect("/admin/categorias");
    });
});

router.get("/categorias",eAdmin, (req, res) => {
  Categoria.find()
    .sort({ date: "asc" })
    .then((categorias) => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao lista as categorias");
    });
});

router.get("/addcategorias",eAdmin, (req, res) => {
  res.render("admin/addcategorias");
});

router.post("/novaCategoria",eAdmin, (req, res) => {
  var erros = [];
  if (!req.body.nome || req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome inválido" });
  }

  if (!req.body.slug || req.body.slug == undefined || req.body.slug == null) {
    erros.push({ texto: "Slug inválido" });
  }

  if (req.body.nome.length < 2) {
    erros.push({ texto: "nome da categoria é pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  } else {
    const NovaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };
    new Categoria(NovaCategoria)
      .save()
      .then(() => {
        //console.log("Categoria salva com sucesso")
        req.flash("success_msg", "Categoria criada com sucesso");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro ao salvar a categoria, tente novamente"
        );
      });
  }
});

router.post("/categorias/deletar",eAdmin, (req, res) => {
  Categoria.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Mensagem excluída com sucesso");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao tentar a categoria");
      res.redirect("/admin/categorias");
    });
});

router.get("/postagens",eAdmin, (req, res) => {
  Postagem.find()
    .populate("categorias")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("admin/postagem", { postagens: postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar as postagens" + err);
      res.redirect("/admin");
    });
});

router.get("/postagens/add",eAdmin, (req, res) => {
  Categoria.find()
    .then((categorias) => {
      res.render("admin/addpostagem", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulario");
      res.redirect("/admin");
    });
});

router.post("/postangens/nova",eAdmin, (req, res) => {
  var erros = [];

  if (req.body.categoria == "0") {
    erros.push({ texto: "Categoria invalida, registre uma categoria" });
  }
  if (erros.length > 0) {
    res.render("admin/addpostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug,
    };

    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem criada com sucesso");
        res.redirect("/admin/postagens");
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar cadastrar" + err);
        res.redirect("/admin/postagens");
      });
  }
});

router.get("/postagens/edit/:id",eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.params.id })
    .then((postagem) => {
      Categoria.find()
        .then((categorias) => {
          res.render("admin/editpostagens", {
            categorias: categorias,
            postagem: postagem,
          });
        })
        .catch((err) => {
          req.flash("error_msg", "Houve um erro ao recuperar a categoria");
          res.redirect("/admin/postagens");
        });
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "Houve um erro ao carregar o formulario de ediçao"
      );
      res.redirect("/admin/postagens");
    });
});

router.post("/postagem/edit",eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.body.id })
    .then((postagem) => {
      postagem.titulo = req.body.titulo;
      postagem.slug = req.body.slug;
      postagem.descricao = req.body.descricao;
      postagem.conteudo = req.body.conteudo;
      postagem.categoria = req.body.categoria;

      postagem
        .save()
        .then(() => {
          req.flash("success_msg", "Postagem alterada com sucesso!");
          res.redirect("/admin/postagens");
        })
        .catch((err) => {
          req.flash("error_msg", "Houve um erro ao alterar a postagem");
          res.redirect("/admin/postagens");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao salvar a edição ");

      res.redirect("/admin/postagens");
    });
});

router.post("/postagem/deletar",eAdmin, (req, res) => {
  Postagem.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem excluída com sucesso");
      res.redirect("/admin/postagens");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao tentar a categoria");
      res.redirect("/admin/postagens");
    });
});

module.exports = router;
