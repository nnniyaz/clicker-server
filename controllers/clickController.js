const Branch = require('../models/branchModel');
const Click = require('../models/clickModel');

class ClickController {
    async addClick(req, res, next) {
        try {
            const {branchName} = req.body;

            const branchPoint = await Branch.findOne({name: branchName});

            if (!branchPoint) {
                return res.json({
                    success: false,
                    message: 'Филиал не найден',
                });
            }

            // current local time
            const time = new Date().getTime();
            const localDate = new Date(time);

            const click = await Click.create({branch: branchName, createdAt: localDate.toString()});
            branchPoint.clicksNumber += 1;
            await branchPoint.save();

            return res.json({
                success: true,
                message: 'Клик успешно добавлен',
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }

    async deleteClick(req, res, next) {
        try {
            const {branchName} = req.body;

            const branchPoint = await Branch.findOne({name: branchName});

            if (!branchPoint) {
                return res.json({
                    success: false,
                    message: 'Филиал не найден',
                });
            }

            if (branchPoint.clicksNumber === 0) {
                return res.json({
                    success: false,
                    message: 'Количество кликов равно 0',
                });
            }

            // delete last click
            const lastClick = await Click.findOne({}).sort({createdAt: -1});
            await lastClick.remove();
            branchPoint.clicksNumber -= 1;
            await branchPoint.save();

            return res.json({
                success: true,
                message: 'Клик успешно удален',
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }

    async getAllClicks(req, res, next) {
        try {
            const {branchName} = req.body;

            const branchPoint = await Branch.findOne({name: branchName});

            if (!branchPoint) {
                return res.json({
                    success: false,
                    message: 'Филиал не найден',
                });
            }

            return res.json({
                success: true,
                data: {
                    clicksNumber: branchPoint.clicksNumber,
                }
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }
}

module.exports = new ClickController();
