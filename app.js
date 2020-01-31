
//Modulos
const express  = require('express');
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars');
const admin = require('./routes/admin.js')
//Configuracoes
const app = express()

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

//Rotas

    app.use('/admin', admin)

    app.get('/', (req, res)=>{
       res.send("Pagina inicial")
    })

//Servidor

const porta = 8081
app.listen(porta, () => { console.log("Servidor inicializado com sucesso!!")})




