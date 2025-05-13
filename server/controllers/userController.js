const { User } = require("../models/models");
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize  = require("../db");

const generateJwt = (id, email, deviceID) => {
    return jwt.sign({ id, email, deviceID }, 
        process.env.SECRET_KEY, 
        {expiresIn: '24h'});
}

class UserController {
    async registration(req, res, next) {
        const { email, password, deviceID } = req.body;
            if (!email || !password || !deviceID) {
                return next(ApiError.badRequest('Некорректные данные регистрации'));
            }
        try {
            const result = await sequelize.transaction(async (t) => {
                const candidate = await User.findOne({ where: {email}, transaction: t });
                if (candidate) {
                    throw ApiError.badRequest('Пользователь с таким email уже существует!');
                }
                const hashPassword = await bcrypt.hash(password, 5);
                const user = await User.create({ email, password:hashPassword }, { transaction: t });
                const token = generateJwt(user.id, user.email, user.deviceID);
                
                return res.json({ token });
            });
        } catch (error) {
            next(ApiError.internal('Ошибка регистрации: ' + error.message));
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({ where: {email} });
        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не найден!'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Не верный пароль!'));
        }
        const token = generateJwt(user.id, user.email, user.deviceID);
        return res.json({ token });
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.deviceID); 
        return res.json({ token });
    }
   
    async getByDeviceID(deviceID) {
        return await User.findOne({ where: {deviceID} }); 
    }
}

module.exports = new UserController();