const mongoose = require('mongoose');

const rotaSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    tipoEntrega: {
        type: String,
        required: true,
        enum: ['rota', 'pacotes', 'rota_pacotes']
    },
    placaVeiculo: {
        type: String,
        required: true
    },
    tipoVeiculo: {
        type: String,
        required: true,
        enum: ['passeio', 'utilitario']
    },
    quantidadePacotes: {
        type: Number,
        default: 0
    },
    valorExtra: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Rota', rotaSchema);