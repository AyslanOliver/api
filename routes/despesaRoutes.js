const express = require('express');
const router = express.Router();
const despesaController = require('../controllers/despesaController');

router.post('/', despesaController.criarDespesa);
router.get('/', despesaController.listarDespesas);
router.get('/:id', despesaController.obterDespesa);
router.put('/:id', despesaController.atualizarDespesa);
router.delete('/:id', despesaController.deletarDespesa);

module.exports = router;