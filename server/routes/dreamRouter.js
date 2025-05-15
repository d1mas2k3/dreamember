const Router = require('express');
const router = new Router();
const dreamController = require('../controllers/dreamController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', dreamController.create);
router.get('/', authMiddleware, dreamController.getAll);
router.get('/:id', authMiddleware, dreamController.getOne);
router.delete('/:id', authMiddleware, dreamController.delete);

 module.exports = router;