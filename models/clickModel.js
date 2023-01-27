const {Schema, model} = require('mongoose');

const clickModel = new Schema({
    branch: {type: String, required: true},
    createdAt: {type: String, required: true},
})

module.exports = model('Click', clickModel);
