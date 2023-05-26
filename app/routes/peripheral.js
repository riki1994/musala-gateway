const express = require('express');
const router = express.Router();
const peripheralController = require('../controllers/peripheral');

router.get('/', peripheralController.get);
router.get('/:id', peripheralController.getById);
router.post('/', peripheralController.create);
router.post('/:id', peripheralController.update);
router.delete('/:id', peripheralController.remove);

module.exports = router;