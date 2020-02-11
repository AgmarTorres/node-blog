
//Modulos
const express  = require('express');
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars');
const admin = require('./routes/admin.js')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//Configuracoes
    const app = express()

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
//Configurações
    //Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))

        app.use((req, res, next) =>{
            res.locals.sucess_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next();
        })
//Banco de Dados
    //mongoose.Promise = global.Promesi;
    mongoose.connect('mongodb://localhost/blogapp',).then(
        ()=>console.log("Conectado com sucesso ao Mongo")
    ).catch(
        (err) => console.log ("Não pode ser devido a " + err)
    )
//Middlewares

    app.use((req, res, next)=>{
        console.log("Oi eu sou um middleware")
    })

//Rotas
    app.use(express.static(path.join(__dirname, "public")))
    app.use('/admin', admin)

    app.get('/', (req, res)=>{
        res.render('admin/categorias')
    })

//Servidor

const porta = 8081
app.listen(porta, () => { console.log("Servidor inicializado com sucesso!!")})




