const express = require('express')
const router = express.Router()

    router.get('/posts', (req,res)=>{
        res.send("Pagina inicial router")
    })


    router.get('/', (req,res)=>{
        res.send("Pagina    ")
    })

module.exports = router