const { Dream } = require('../models/models');
const ApiError = require('../error/ApiError');
const userController = require('../controllers/userController');

class DreamController {
    async create(req, res, next) {
        const {text, deviceID} = req.body;
        if (!deviceID || !text) {
            return next(ApiError.badRequest('Неправильно задан текст и/или серийный номер колонки!'))
        }
        const user = await userController.getByDeviceID(deviceID);
        if (!user) {
            return next(ApiError.badRequest('Колонка не еще привязана к пользователю!'));
        }
        const dream = await Dream.create({ text, deviceID });
        return res.json(dream);
    }

    async getAll(req, res, next) {
        if (!req.user || !req.user.deviceID) {
            return next(ApiError.forbidden('Вы не авторизованы или не привязана колонка!'));
        }
        const dreams = await Dream.findAll({ where: { deviceID: req.user.deviceID } });
        return res.json(dreams);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const dream = await Dream.findOne({ where: {id} })
        return res.json(dream);
    }

    async delete(req, res) {
        const {id} = req.params;
        const dream = await Dream.destroy({ where: { id }});
        return res.json({ id });
    }
}

module.exports = new DreamController();