const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("Categoria")

    router.get('/posts', (req,res)=>{
        res.send("Pagina inicial router")
    })
    
    router.get('/', (req,res) =>{
        Categoria.find().sort({date:'asc'}).then((categorias) =>{
            res.render("admin/categorias", {categorias: categorias})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao lista as categorias")
        })    
    })
    
    router.get('/categorias/edit/:id', (req,res) => {
            Categoria.findOne({ _id: req.params.id}).then((categoria) =>{
            res.render("admin/editcategorias", {categoria: categoria})
        }).catch(() =>{
            req.flash("error_msg", "Essa categoria não existe")
            res.redirect('/admin/categorias')
        })
    })

    router.post("/categorias/edit", (req,res) =>{
        console.log(teste);
        Categoria.findOne({_id: req.body.id}).then((categoria) =>{
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(() => {
                req.flash("success_msg", "categoria editada com sucesso")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("err_msg", "Houve um erro ao tentar editar a categoria")
                res.redirect("/admin/categorias")
            })
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao tentar editar a categoria")
            res.redirect("/admin/categorias")
        })
    })

    router.get('/categorias', (req,res)=>{
        Categoria.find().sort({date:'asc'}).then((categorias) =>{
            res.render("admin/categorias", {categorias: categorias})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao lista as categorias")
        })
    })
    
    router.get('/addcategorias', (req,res)=>{
        res.render("admin/addcategorias")
    })

    router.post("/novaCategoria", (req,res) =>{
        
        var erros = []
        if(!req.body.nome || req.body.nome == undefined || req.body.nome==null){
            erros.push({texto: "Nome inválido"})
        }   

        if(!req.body.slug || req.body.slug == undefined || req.body.slug==null){
            erros.push({texto: "Slug inválido"})
        }   

        if(req.body.nome.length < 2){
            erros.push({texto: "nome da categoria é pequeno"})
        }

        if( erros.length > 0){
            res.render("admin/addcategorias", {erros: erros})
        }
        else{
            const NovaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
            new Categoria( NovaCategoria).save().then(() => {
                //console.log("Categoria salva com sucesso")
                req.flash("success_msg", "Categoria criada com sucesso")
                res.redirect("/admin/categorias")
            }).catch((err) =>{
                req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente")
            })
        }

    })
    
    router.post('/categorias/deletar',(req,res)=>{
        Categoria.deleteOne({_id: req.body.id})
        .then(()=>{
            req.flash("success_msg", "Mensagem excluída com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao tentar a categoria")
            res.redirect("/admin/categorias")
        })
    })
    

    router.get('/postagens', (req, res)=> {
        res.render("admin/postagem")
    })

    router.get("/postagens/add", (req, res)=>{
        Categoria.find().then((categorias)=>{
            res.render("admin/addpostagem", {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar o formulario")
            res.redirect("/admin")
        })
    })
    
    module.exports = router