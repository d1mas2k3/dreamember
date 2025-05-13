const Router = require('express');
const router = new Router();
const dreamController = require('../controllers/dreamController');

router.post('/', dreamController.create);

router.get('/', dreamController.getAll);

router.get('/:id', dreamController.getOne);

 module.exports = router;