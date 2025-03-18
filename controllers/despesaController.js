const Despesa = require('../models/Despesa');

exports.criarDespesa = async (req, res) => {
    try {
        const despesa = new Despesa(req.body);
        await despesa.save();
        res.status(201).json({
            success: true,
            message: "Despesa cadastrada com sucesso!",
            data: despesa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.listarDespesas = async (req, res) => {
    try {
        const despesas = await Despesa.find().sort({ data: -1 });
        res.json({
            success: true,
            data: despesas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.obterDespesa = async (req, res) => {
    try {
        const despesa = await Despesa.findById(req.params.id);
        if (!despesa) {
            return res.status(404).json({
                success: false,
                message: "Despesa não encontrada"
            });
        }
        res.json({
            success: true,
            data: despesa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.atualizarDespesa = async (req, res) => {
    try {
        const despesa = await Despesa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!despesa) {
            return res.status(404).json({
                success: false,
                message: "Despesa não encontrada"
            });
        }
        res.json({
            success: true,
            message: "Despesa atualizada com sucesso!",
            data: despesa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletarDespesa = async (req, res) => {
    try {
        const despesa = await Despesa.findByIdAndDelete(req.params.id);
        if (!despesa) {
            return res.status(404).json({
                success: false,
                message: "Despesa não encontrada"
            });
        }
        res.json({
            success: true,
            message: "Despesa excluída com sucesso"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};