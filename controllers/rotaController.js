const Rota = require('../models/Rota');

exports.criarRota = async (req, res) => {
    try {
        // Validação básica dos campos obrigatórios
        const { nome, data, tipoEntrega, placaVeiculo, tipoVeiculo, total } = req.body;
        if (!nome || !data || !tipoEntrega || !placaVeiculo || !tipoVeiculo || !total) {
            return res.status(400).json({
                success: false,
                message: "Todos os campos obrigatórios devem ser preenchidos"
            });
        }

        // Converter valores numéricos
        req.body.quantidadePacotes = parseInt(req.body.quantidadePacotes) || 0;
        req.body.valorExtra = parseFloat(req.body.valorExtra) || 0;
        req.body.total = parseFloat(req.body.total);

        const rota = new Rota(req.body);
        await rota.save();
        res.status(201).json({
            success: true,
            message: "Rota cadastrada com sucesso!",
            data: rota
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.listarRotas = async (req, res) => {
    try {
        const { inicio, fim } = req.query;
        let query = {};
        
        if (inicio && fim) {
            query.data = {
                $gte: inicio,
                $lte: fim
            };
        }
        
        const rotas = await Rota.find(query).sort({ data: -1 });
        res.json({
            success: true,
            data: rotas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.obterRota = async (req, res) => {
    try {
        const rota = await Rota.findById(req.params.id);
        if (!rota) {
            return res.status(404).json({
                success: false,
                message: "Rota não encontrada"
            });
        }
        res.json({
            success: true,
            data: rota
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.atualizarRota = async (req, res) => {
    try {
        const rota = await Rota.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!rota) {
            return res.status(404).json({
                success: false,
                message: "Rota não encontrada"
            });
        }
        res.json({
            success: true,
            message: "Rota atualizada com sucesso!",
            data: rota
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletarRota = async (req, res) => {
    try {
        const rota = await Rota.findByIdAndDelete(req.params.id);
        if (!rota) {
            return res.status(404).json({
                success: false,
                message: "Rota não encontrada"
            });
        }
        res.json({
            success: true,
            message: "Rota excluída com sucesso"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};