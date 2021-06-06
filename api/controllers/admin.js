const helper = require('../utils/helper');
const invoke = require('../utils/invoke');
const Loan = require('../models/loans');
const { response } = require('express');

exports.getLoansForAdmin = async (req, res, next)=>{
    if(req.session.user){
        let chaincodeName = "loan";
        let channelName = "mychannel";
        let fcn = "GetLoanById";
        let args = new Array();
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";

        let arr = new Array();
        let role  = (req.session.user.role == "borrower")? "borrower": "lender";
        const query = Loan.find(); // `query` is an instance of `Query`
        query.setOptions({ lean : true });
        query.collection(Loan.collection);
        query.exec(async (err, loan)=>{
            if(err){
                return res.render(`/users/${role}/myloans`);

                }else if(loan){
                    console.log("loans",loan);
                    for(let i = 0; i < loan.length; i++){
                        args = String(loan[i]._id);
                        let response = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, userName, userOrg, trasient);
                        let temp  = JSON.parse(response.result.txid)
                        
                        if(temp.lender === ''){
                            arr.push(temp);

                        }
                        
                    }
                    res.loan = arr;
                    console.log("response ##############", res.loan);
                
                }
                next();
               
        });
      
        
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}



exports.getAcceptedLoansForAdmin = async (req, res, next)=>{
    if(req.session.user){
        let chaincodeName = "loan";
        let channelName = "mychannel";
        let fcn = "GetLoanById";
        let args = new Array();
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";

        let arr = new Array();
        let role  = (req.session.user.role == "borrower")? "borrower": "lender";
        const query = Loan.find(); // `query` is an instance of `Query`
        query.setOptions({ lean : true });
        query.collection(Loan.collection);
        query.exec(async (err, loan)=>{
            if(err){
                return res.render(`/users/${role}/myloans`);

                }else if(loan){
                    console.log("loans",loan);
                    for(let i = 0; i < loan.length; i++){
                        args = String(loan[i]._id);
                        let response = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, userName, userOrg, trasient);
                        let temp  = JSON.parse(response.result.txid)
                        
                        if(temp.lender !== ''){
                            arr.push(temp);

                        }
                        
                    }
                    res.loan = arr;
                    console.log("response ##############", res.loan);
                
                }
                next();
               
        });
      
        
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}