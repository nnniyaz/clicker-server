const {Schema, model} = require('mongoose');

const branchModel = new Schema({
    name: {type: String, required: true, unique: true},
    clicksNumber: {type: Number, default: 0},
    createdAt: {type: String, required: true},
})

module.exports = model('Branch', branchModel);
