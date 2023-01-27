const Branch = require('../models/branchModel');

const errorMessage = 'Что-то пошло не так';
const branchNotFoundMessage = 'Филиал не найден';
const branchAddedMessage = 'Филиал успешно добавлен';
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

            await branch.remove();

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
