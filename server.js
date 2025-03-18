const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexão MongoDB Atlas (usando sua string de conexão atual)
mongoose.connect('mongodb+srv://ayslano37:1318228964@demolicao.fk6aapp.mongodb.net/rotasDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB Atlas!');
});

// Rotas serão adicionadas aqui
app.use('/api', require('./routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para total de rotas por mês
app.get('/api/rotas/total', async (req, res) => {
    try {
        const mes = req.query.mes;
        const [ano, mesNum] = mes.split('-');
        
        const query = `
            SELECT SUM(total) as totalRotas
            FROM rotas
            WHERE YEAR(data) = ? AND MONTH(data) = ?
        `;
        
        const [results] = await pool.query(query, [ano, mesNum]);
        
        res.json({
            success: true,
            total: results[0].totalRotas || 0
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar total de rotas'
        });
    }
});

// Rota para total de despesas e despesas por tipo
app.get('/api/despesas/total', async (req, res) => {
    try {
        const mes = req.query.mes;
        const [ano, mesNum] = mes.split('-');
        
        // Busca total geral
        const queryTotal = `
            SELECT SUM(valor) as totalDespesas
            FROM despesas
            WHERE YEAR(data) = ? AND MONTH(data) = ?
        `;
        
        // Busca total por tipo
        const queryPorTipo = `
            SELECT tipoDespesa, SUM(valor) as total
            FROM despesas
            WHERE YEAR(data) = ? AND MONTH(data) = ?
            GROUP BY tipoDespesa
        `;
        
        const [resultTotal] = await pool.query(queryTotal, [ano, mesNum]);
        const [resultPorTipo] = await pool.query(queryPorTipo, [ano, mesNum]);
        
        // Converte array de resultados em objeto
        const porTipo = {};
        resultPorTipo.forEach(item => {
            porTipo[item.tipoDespesa] = item.total;
        });
        
        res.json({
            success: true,
            total: resultTotal[0].totalDespesas || 0,
            porTipo: porTipo
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar total de despesas'
        });
    }
});

// Rota para dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const mes = req.query.mes;
        const [ano, mesNum] = mes.split('-');
        

        const startDate = new Date(`${ano}-${mesNum}-01`);
        const endDate = new Date(ano, parseInt(mesNum), 0, 23, 59, 59);

        // Usando os modelos Mongoose
        const Rota = require('./models/Rota');
        const Despesa = require('./models/Despesa');

        // Buscar total de rotas
        const rotasResult = await Rota.aggregate([
            {
                $match: {
                    data: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRotas: { $sum: "$total" }
                }
            }
        ]);

        // Buscar despesas agrupadas por tipo
        const despesasResult = await Despesa.aggregate([
            {
                $match: {
                    data: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$tipoDespesa",
                    total: { $sum: "$valor" }
                }
            }
        ]);

        // Processar os resultados
        const totalRotas = rotasResult[0]?.totalRotas || 0;
        const despesasPorTipo = {};
        let totalDespesas = 0;

        despesasResult.forEach(item => {
            despesasPorTipo[item._id] = item.total;
            totalDespesas += item.total;
        });

        // Calcular lucro líquido
        const lucroLiquido = totalRotas - totalDespesas;

        res.json({
            success: true,
            data: {
                totalRotas,
                totalDespesas,
                lucroLiquido,
                despesasPorTipo
            }
        });

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar dados do dashboard'
        });
    }
});