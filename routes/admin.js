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
        res.send("Pagina    ")
    })

    router.get('/categorias', (req,res)=>{
        res.render("admin/categorias")
    })
    
    router.get('/addcategorias', (req,res)=>{
        res.render("admin/addcategorias")
    })

    router.post("/novaCategoria", (req,res) =>{
        const NovaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        console.log(NovaCategoria)
        new Categoria(NovaCategoria).save().then(()=> console.log("Categoria cadastrada com sucesso")
        ).catch((err) => console.log("Erro ao cadastrar a categoria"+err))

    })
    
    
module.exports = router