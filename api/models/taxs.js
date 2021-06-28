const mongoose = require('mongoose')
const {Schema} = mongoose;

const taxSchema = new Schema({
    tax : {type: String}
})

const Tax = mongoose.model('Tax', taxSchema);

module.exports  = Tax;