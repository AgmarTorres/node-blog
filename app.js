
//Modulos
const express  = require('express');
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars');
const admin = require('./routes/admin.js')
const path = require('path')
const mongoose = require('mongoose')
//Configuracoes
const app = express()

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

//Banco de Dados
    //mongoose.Promise = global.Promesi;
    mongoose.connect('mongodb://localhost/blogapp',).then(
        ()=>console.log("Conectado com sucesso ao Mongo")
    ).catch(
        (err) => console.log ("Não pode ser devido a " + err)
    )

//Rotas
    app.use(express.static(path.join(__dirname, "public")))
    app.use('/admin', admin)

    app.get('/', (req, res)=>{
        res.render('admin/categorias')
    })

//Servidor

const porta = 8081
app.listen(porta, () => { console.log("Servidor inicializado com sucesso!!")})




