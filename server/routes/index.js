 const Router = require('express');
 const userRouter = require('./userRouter');
 const dreamRouter = require('./dreamRouter');
 const router = new Router();

 router.use('/user', userRouter);
 router.use('/dream', dreamRouter);

 module.exports = router; 