const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');


router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/profile', authMiddleware, userController.update);
router.get('/auth', authMiddleware, userController.check);
router.delete('/delete', authMiddleware, userController.delete);


 module.exports = router;