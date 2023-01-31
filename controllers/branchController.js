const Branch = require('../models/branchModel');
const Click = require('../models/clickModel');

const errorMessage = 'Что-то пошло не так';
const branchNotFoundMessage = 'Филиал не найден';
const branchAddedMessage = 'Филиал успешно добавлен';
const branchUpdatedMessage = 'Филиал успешно обновлен';
const branchDeletedMessage = 'Филиал успешно удален';
const branchAlreadyExistsMessage = 'Такой филиал уже существует';
const branchNameIsNotSpecifiedMessage = 'Не указано название филиала';
const branchCreatedAtIsNotSpecifiedMessage = 'Не указано время создания филиала';

class BranchController {
    async addBranch(req, res, next) {
        try {
            const {name, createdAt} = req.body;

            if (!name || !createdAt) {
                if (!name) {
                    return res.json({
                        success: false,
                        message: branchNameIsNotSpecifiedMessage,
                    });
                }

                if (!createdAt) {
                    return res.json({
                        success: false,
                        message: branchCreatedAtIsNotSpecifiedMessage,
                    });
                }
            }

            const candidate = await Branch.findOne({name: name});

            if (candidate) {
                return res.json({
                    success: false,
                    message: branchAlreadyExistsMessage,
                });
            }

            const branch = await Branch.create({name: name, createdAt: createdAt});

            return res.json({
                success: true,
                message: branchAddedMessage,
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
            });
        }
    }

    async updateBranch(req, res, next) {
        try {
            const {id, newBranchName} = req.body;

            const branch = await Branch.findById(id);

            if (!branch) {
                res.json({
                    success: false,
                    message: branchNotFoundMessage,
                });
            }

            const previousBranchName = branch.name;

            await branch.update({name: newBranchName});

            const clicks = await Click.find({branch: previousBranchName});

            for (let i = 0; i < clicks.length; i++) {
                await clicks[i].update({branch: newBranchName});
            }


            return res.json({
                success: true,
                message: branchUpdatedMessage,
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
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
                    message: branchNotFoundMessage,
                });
            }

            const branchName = branch.name;

            await branch.remove();

            const clicks = await Click.find({branch: branchName}) || [];

            for (let i = 0; i < clicks.length; i++) {
                await clicks[i].remove();
            }

            return res.json({
                success: true,
                message: branchDeletedMessage,
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
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
                    message: branchNotFoundMessage,
                });
            }

            const clicks = await Click.find({branch: branch.name}) || [];

            let todayClicksNumber = 0;

            for (let i = 0; i < clicks.length; i++) {
                const click = clicks[i];

                const d = new Date();
                const localTime = d.getTime();
                const localOffset = d.getTimezoneOffset() * 60000;

                const utc = localTime + localOffset;
                const offset = 6;
                const kazakhstan = utc + (3600000 * offset);

                const kazakhstanTimeNow = new Date(kazakhstan)

                const clickDate = new Date(new Date(click.createdAt).getTime() + (3600000 * offset));

                if (kazakhstanTimeNow.getDate() === clickDate.getDate()) {
                    todayClicksNumber++;
                }
            }

            return res.json({
                success: true,
                data: {
                    ...branch,
                    clicksNumber: todayClicksNumber,
                },
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
            });
        }
    }

    async getAllBranches(req, res, next) {
        try {
            const branches = await Branch.find() || [];

            const branchesWithTodayClicksNumber = [];

            for (let i = 0; i < branches.length; i++) {
                const clicks = await Click.find({branch: branches[i].name}) || [];

                let todayClicksNumber = 0;

                for (let i = 0; i < clicks.length; i++) {
                    const click = clicks[i];

                    // current local time
                    const time = new Date().getTime();
                    const localDate = new Date(time).getDate();

                    const clickDate = new Date(click.createdAt).getDate();

                    if (localDate === clickDate) {
                        todayClicksNumber++;
                    }
                }

                branchesWithTodayClicksNumber.push({
                    _id: branches[i]._id,
                    name: branches[i].name,
                    createdAt: branches[i].createdAt,
                    clicksNumber: branches[i].clicksNumber,
                    todayClicksNumber: todayClicksNumber,
                })
            }

            return res.json({
                success: true,
                data: branchesWithTodayClicksNumber,
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
            });
        }
    }
}

module.exports = new BranchController();
