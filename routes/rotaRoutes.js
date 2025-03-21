const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');

router.post('/', rotaController.criarRota);
router.get('/', rotaController.listarRotas);
router.get('/:id', rotaController.obterRota);
router.put('/:id', rotaController.atualizarRota);
router.delete('/:id', rotaController.deletarRota);

module.exports = router;