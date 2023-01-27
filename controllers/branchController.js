const Branch = require('../models/branchModel');
const Click = require('../models/clickModel');

class BranchController {
    async addBranch(req, res, next) {
        try {
            const {name} = req.body;

            const candidate = await Branch.findOne({name: name});

            if (candidate) {
                return res.json({
                    success: false,
                    message: 'Такой филиал уже существует'
                });
            }

            const time = new Date().getTime();
            const localDate = new Date(time);

            const branch = await Branch.create({name: name, createdAt: localDate.toString()});

            return res.json({
                success: true,
                message: 'Филиал успешно добавлен',
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }

    async deleteBranch(req, res, next) {
        try {
            const {id} = req.body;

            const branch = await Branch.findById(id);

            if (!branch) {
                res.json({
                    success: false,
                    message: 'Филиал не найден',
                });
            }

            await branch.remove();

            return res.json({
                success: true,
                message: 'Филиал успешно удален',
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }

    async getBranchById(req, res, next) {
        try {
            const {id} = req.body;

            const branch = await Branch.findById(id);

            if (!branch) {
                res.json({
                    success: false,
                    message: 'Филиал не найден',
                });
            }

            return res.json({
                success: true,
                data: branch,
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }

    async getAllBranches(req, res, next) {
        try {
            const branches = await Branch.find();

            // branches.forEach(async (branch) => {
            //     const allClicks = await Click.find({branch: branch.name});
            //     const currentDay = new Date().getDate();
            //
            //     branch.todaysClicksNumber = allClicks.filter((click) => {
            //
            //     })
            //     branch.lastWeekClicksNumber
            //     branch.lastMonthClicksNumber
            //     branch.last3MonthsClicksNumber
            // });

            return res.json({
                success: true,
                data: branches,
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || 'Что-то пошло не так',
            });
        }
    }
}

module.exports = new BranchController();
