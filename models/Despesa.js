const mongoose = require('mongoose');

const despesaSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    tipoDespesa: {
        type: String,
        required: true,
        enum: ['combustivel', 'pagamento_ajudante', 'manutencao_veiculo']
    },
    formaPagamento: {
        type: String,
        required: true,
        enum: ['pix', 'cartao', 'debito', 'dinheiro']
    },
    observacao: String
});

module.exports = mongoose.model('Despesa', despesaSchema);