const Rota = require('../models/Rota');
const Despesa = require('../models/Despesa');

exports.getDashboardData = async (req, res) => {
    try {
        const { mes } = req.query;
        const [ano, mesNum] = mes.split('-');
        
        // Criar datas de início e fim do mês
        const dataInicio = `${ano}-${mesNum}-01`;
        const dataFim = `${ano}-${mesNum}-31`;

        // Buscar rotas do mês
        const rotas = await Rota.find({
            data: {
                $gte: dataInicio,
                $lte: dataFim
            }
        });

        // Buscar despesas do mês
        const despesas = await Despesa.find({
            data: {
                $gte: dataInicio,
                $lte: dataFim
            }
        });

        // Calcular totais
        const totalRotas = rotas.length;
        const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
        const totalReceitas = rotas.reduce((acc, rota) => acc + rota.total, 0);
        const lucroTotal = totalReceitas - totalDespesas;

        // Agrupar despesas por categoria
        const despesasPorCategoria = despesas.reduce((acc, despesa) => {
            acc[despesa.tipoDespesa] = (acc[despesa.tipoDespesa] || 0) + despesa.valor;
            return acc;
        }, {});

        // Agrupar rotas por tipo
        const rotasPorTipo = rotas.reduce((acc, rota) => {
            acc[rota.tipoEntrega] = (acc[rota.tipoEntrega] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                totalRotas,
                totalDespesas,
                lucroTotal,
                despesasPorCategoria,
                rotasPorTipo
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};