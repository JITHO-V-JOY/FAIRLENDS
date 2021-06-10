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
                        
                        if(temp.lender !== '' && temp.approved === false){
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

exports.getApprovedLoansForAdmin = async (req, res, next)=>{
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
                        console.log("temp", temp.emi[0])
                        if(temp.approved === true){
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

exports.getLoan = async (req, res, next)=>{
    if(req.session.user){
       
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";

        let response = await invoke.invokeTransaction("mychannel", "loan", "GetLoanById", String(req.profile._id), userName, userOrg, trasient);
        let temp  = JSON.parse(response.result.txid)   
        res.loan = temp;;
        console.log("response ##############", res.loan);
        next();       
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
              
}

exports.getIssuer = async (req, res, next)=>{
    if(req.session.user){
       
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";

        let response = await invoke.invokeTransaction("mychannel", "fairlends", "QueryUser", String(req.profile.borrower), userName, userOrg, trasient);
        let temp  = JSON.parse(response.result.txid)   
        res.issuer = temp;;
        console.log("response ##############", res.issuer);
        next();       
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
              
}

exports.getLender = async (req, res, next)=>{
    if(req.session.user){
       
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";

        let response = await invoke.invokeTransaction("mychannel", "fairlends", "QueryUser", String(req.profile.lender), userName, userOrg, trasient);
        let temp  = JSON.parse(response.result.txid)   
        res.lender = temp;;
        console.log("response ##############", res.lender);
        next();       
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
              
}

exports.approveLoan = async(req, res, next)=>{
    if(req.session.user.role === "admin"){
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";

        let response = await invoke.invokeTransaction("mychannel", "loan", "ApproveLoan", String(req.profile._id), userName, userOrg, trasient);
        console.log("response ##############", response.result.txid);
        res.redirect('/admin/accepted_loans');
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}