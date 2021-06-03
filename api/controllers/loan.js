const Loan = require('../models/loans');
exports.getLoanById = (req, res, next , id) => {
    Loan.findById(id).exec((err, loan)=>{
        if(err){
            return res.status(400).json({
                error: "No loan found in DB"
            })
        }
        if(!loan){
            return res.status(400).json({
                error: "No loan found in DB"
            })
        }
        req.profile = loan;
        console.log(loan);
        next();
    })
}