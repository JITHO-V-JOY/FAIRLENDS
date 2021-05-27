const mongoose = require('mongoose');
const {Schema} = mongoose;

const loanSchema = new Schema({
    borrower : {type: String},
    lender : {type: String}
})

const Loan = mongoose.model('Loan', loanSchema);

module.exports  = Loan;