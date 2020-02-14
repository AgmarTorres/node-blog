const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("Categoria")

    router.get('/posts', (req,res)=>{
        res.send("Pagina inicial router")
    })
    
    router.get('/', (req,res) =>{
        res.render("admin/index")
    })
    
    router.get('/teste', (req,res)=>{
        res.send("Pagina")
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
    
    
module.exports = router