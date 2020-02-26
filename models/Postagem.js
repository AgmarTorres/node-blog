const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const Postagem = ({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
        descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model("Postagem", Postagem) //criar um colection postagens que vai ser feita com base no model de postagens