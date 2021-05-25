const mongoose = require('mongoose');
const {Schema} = mongoose;

const loanSchema = new Schema({
    count : {type:Number, default:0},
})

const Loan = mongoose.model('Loan', loanSchema);

module.exports  = Loan;