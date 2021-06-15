const mongoose = require('mongoose');
const {Schema} = mongoose;

const complaintSchema = new Schema({
    loan_id: {type: String},
    issue_date: {type: String},
    lender: {type: String},
    due_date: {type: String},
    status: {type: String}
})

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;