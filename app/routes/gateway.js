const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gateway');

router.get('/', gatewayController.get);
router.get('/:id', gatewayController.getById);
router.post('/', gatewayController.create);
router.post('/:id', gatewayController.update);
router.delete('/:id', gatewayController.remove);

module.exports = router;