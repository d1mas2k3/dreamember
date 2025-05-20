const { User, Dream } = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize  = require('../db');
// const dreamController = require('../controllers/dreamController');

const generateJwt = (id, login, deviceID) => {
    // return jwt.sign({ id, login, deviceID }, process.env.SECRET_KEY, { expiresIn: '180' });
    return jwt.sign({ id, login, deviceID }, process.env.SECRET_KEY, { expiresIn: '24h' });
}

class UserController {
    async registration(req, res, next) {
        console.log('[REGISTRATION]');

        const { login, password, deviceID } = req.body;

        // console.log('[REQUEST.BODY]:', login, password, deviceID);

        if (!login || !password || !deviceID) {
            return next(ApiError.badRequest('Некорректные данные регистрации'));
        }
        try {
            const result = await sequelize.transaction(async (t) => {
                const candidate = await User.findOne({ where: {login}, transaction: t });
                if (candidate) {
                    throw ApiError.badRequest('Пользователь с таким login уже существует!');
                }
                const hashPassword = await bcrypt.hash(password, 5);
                const user = await User.create({ login, password: hashPassword, deviceID }, { transaction: t });
                const token = generateJwt(user.id, user.login, user.deviceID);

                return res.json({ token, deviceID: user.deviceID });
            });
        } catch (error) {
            next(ApiError.internal('Ошибка регистрации: ' + error.message));
        }
    }

    async login(req, res, next) {
        const {login, password} = req.body;
        const user = await User.findOne({ where: {login} });
        if (!user) {
            return next(ApiError.internal('Пользователь с таким login не найден!'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Не верный пароль!'));
        }
        const token = generateJwt(user.id, user.login, user.deviceID);
        return res.json({ token,  deviceID: user.deviceID });
    }

    async update(req, res, next) {
        const { login, deviceID } = req.body;
        if (!login || !deviceID) {
            return next(ApiError.internal('Ошибка обновления данных!'));
        }

        const user = await User.findOne({ where: { login } });
        if (!user) {
            return next(ApiError.internal('Пользователь с таким login не найден!'));
        }

        user.deviceID = deviceID;
        try {
            await user.save();
            const token = generateJwt(user.id, user.login, user.deviceID);
            return res.json({ token, deviceID: user.deviceID });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.internal(`Ошибка обновления: серийный номер колонки "${deviceID}" уже введен другим пользователем!`));
            } else {
                return next(ApiError.internal('Ошибка обновления: ' + error.message));
            }
        }
    }

    async delete(req, res, next) {
        const { login, deviceID } = req.body;
        if (!login || !deviceID) {
            return next(ApiError.internal('Ошибка удаления данных!'));
        }

        const user = await User.findOne({ where: { login } });
        if (!user) {
            return next(ApiError.internal('Пользователь с таким login не найден!'));
        }

        try {
            await User.destroy({ where: { login } });
            await Dream.destroy({ where: { deviceID } });
            // await dreamController.deleteByDeviceID(deviceID);
        } catch (error) {
            return next(ApiError.internal('Ошибка удаления: ' + error.message));
        }

		return res.status(200).json({});
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.login, req.user.deviceID);
        return res.json({ token, deviceID: req.user.deviceID });
    }

    async getByDeviceID(deviceID) {
        return await User.findOne({ where: {deviceID} });
    }
}

module.exports = new UserController();