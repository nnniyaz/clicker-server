const Branch = require('../models/branchModel');
const Click = require('../models/clickModel');

const errorMessage = 'Что-то пошло не так';
const branchNotFoundMessage = 'Филиал не найден';
const branchAddedMessage = 'Филиал успешно добавлен';
const branchUpdatedMessage = 'Филиал успешно обновлен';
const branchDeletedMessage = 'Филиал успешно удален';
const branchAlreadyExistsMessage = 'Такой филиал уже существует';

class BranchController {
    async addBranch(req, res, next) {
        try {
            const {name} = req.body;

            const candidate = await Branch.findOne({name: name});

            if (candidate) {
                return res.json({
                    success: false,
                    message: branchAlreadyExistsMessage,
                });
            }

            const time = new Date().getTime();
            const localDate = new Date(time);

            const branch = await Branch.create({name: name, createdAt: localDate.toString()});

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

            const clicks = await Click.find({branch: branchName});

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

            return res.json({
                success: true,
                data: branch,
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
            const branches = await Branch.find();
            return res.json({
                success: true,
                data: branches,
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
