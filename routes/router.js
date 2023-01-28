const Router = require('express').Router;
const router = Router();
const ClickController = require('../controllers/clickController');
const BranchController = require('../controllers/branchController');

// ------------------------- BRANCHES -------------------------
router.post('/cmd/branch-add', BranchController.addBranch);
router.post('/cmd/branch-update', BranchController.updateBranch);
router.post('/cmd/branch-delete', BranchController.deleteBranch);

router.post('/q/branch-get-one', BranchController.getBranchById);
router.get('/q/branch-get-all', BranchController.getAllBranches);

// -------------------------- CLICKS --------------------------
router.post('/cmd/click-add', ClickController.addClick);
router.post('/cmd/click-delete', ClickController.deleteClick);

router.get('/q/click-get-all', ClickController.getAllClicks);
router.get('/q/click-stats', ClickController.getClicksStats);

module.exports = router;
