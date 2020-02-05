const mongoose= require( 'mongoose')
const Schema = mongoose.Schema;

Categoria = new Schema({
    nome:{
        type: String,
        requered: true
    },
    slug:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()

    }
})


mongoose.model("Categoria", Categoria)