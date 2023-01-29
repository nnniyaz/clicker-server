const Branch = require('../models/branchModel');
const Click = require('../models/clickModel');

const errorMessage = 'Что-то пошло не так';
const branchNotFoundMessage = 'Филиал не найден';
const clicksNumberIsZeroMessage = 'Количество кликов равно 0';
const clickAddedMessage = 'Клик успешно добавлен';
const clickDeletedMessage = 'Клик успешно удален';
const branchNameIsNotSpecifiedMessage = 'Не указано название филиала';
const clickCreatedAtIsNotSpecifiedMessage = 'Не указано время клика';

class ClickController {
    async addClick(req, res, next) {
        try {
            const {branchName, createdAt} = req.body;

            if (!branchName || !createdAt) {
                if (!branchName) {
                    return res.json({
                        success: false,
                        message: branchNameIsNotSpecifiedMessage,
                    });
                }

                if (!createdAt) {
                    return res.json({
                        success: false,
                        message: clickCreatedAtIsNotSpecifiedMessage,
                    });
                }
            }

            const branchPoint = await Branch.findOne({name: branchName});

            if (!branchPoint) {
                return res.json({
                    success: false,
                    message: branchNotFoundMessage,
                });
            }

            const click = await Click.create({branch: branchName, createdAt: createdAt});
            branchPoint.clicksNumber += 1;
            await branchPoint.save();

            return res.json({
                success: true,
                message: clickAddedMessage,
            });
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
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
                    message: branchNotFoundMessage,
                });
            }

            if (branchPoint.clicksNumber === 0) {
                return res.json({
                    success: false,
                    message: clicksNumberIsZeroMessage,
                });
            }

            // delete last click
            const lastClick = await Click.findOne({}).sort({createdAt: -1});
            await lastClick.remove();
            branchPoint.clicksNumber -= 1;
            await branchPoint.save();

            return res.json({
                success: true,
                message: clickDeletedMessage,
            })
        } catch (e) {
            return res.json({
                success: false,
                message: e.message || errorMessage,
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
                    message: branchNotFoundMessage,
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
                message: e.message || errorMessage,
            });
        }
    }

    async getClicksStats(req, res, next) {
        try {
            const {currentTime} = req.body;

            const clicks = await Click.find();
            const branches = await Branch.find();

            if (!clicks || !branches) {
                return res.json({
                    success: false,
                    message: errorMessage,
                });
            }

            const data = {
                totalClicksNumber: clicks.length,
                branchesNumber: branches.length,
                branches: {}
            };

            const clicksPerBranch = branches.map(branch => {
                data.branches[branch.name] = {
                    totalClicks: branch.clicksNumber,
                    clicksToday: {},
                    clicksLastWeek: {},
                    clicksLastMonth: {},
                    clicksLast3Month: {},
                    clicksLastYear: {}
                }

                Array.from({length: 365}, (v, k) => {
                    if (k < 7) {
                        data.branches[branch.name].clicksLastWeek[k] = 0;
                    }
                    if (k < 24) {
                        data.branches[branch.name].clicksToday[k] = 0;
                    }
                    if (k < 30) {
                        data.branches[branch.name].clicksLastMonth[k] = 0;
                    }
                    if (k < 90) {
                        data.branches[branch.name].clicksLast3Month[k] = 0;
                    }
                    if (k < 365) {
                        data.branches[branch.name].clicksLastYear[k] = 0;
                    }
                });
            });

            for (let i = 0; i < clicks.length; i++) {
                const click = clicks[i];
                const branch = data.branches[click.branch];

                // current local time
                const localDate = new Date(currentTime)

                const clickDate = new Date(click.createdAt);

                const diff = localDate.getTime() - clickDate.getTime();
                const diffDays = Math.round(diff / (1000 * 3600 * 24));

                if (diffDays === 0) {
                    branch.clicksToday[clickDate.getHours()] += 1;
                }
                if (diffDays < 7) {
                    branch.clicksLastWeek[diffDays] += 1;
                }
                if (diffDays < 30) {
                    branch.clicksLastMonth[diffDays] += 1;
                }
                if (diffDays < 90) {
                    branch.clicksLast3Month[diffDays] += 1;
                }
                if (diffDays < 365) {
                    branch.clicksLastYear[diffDays] += 1;
                }
            }

            return res.json({
                success: true,
                data: data
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
