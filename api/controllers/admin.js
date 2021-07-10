const helper = require('../utils/helper');
const invoke = require('../utils/invoke');
const Loan = require('../models/loans');
const Tax = require('../models/taxs');
const Complaint = require('../models/complaints');
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

exports.getActiveLoansForAdmin = async (req, res, next)=>{
    if(req.session.user){
        let chaincodeName = "loan";
        let channelName = "mychannel";
        let fcn = "GetLoanById";
        let args = new Array();
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1":(req.session.user.role == "admin")? "Org3":"Org2";
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
                        let result = JSON.parse(response.result.txid)
                        if(result.status === "Active"){
                            arr.push(result);
                                 
                        }
                        
                    }
                    res.loan = arr
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
        let tax = res.percentage
        console.log("percentage", tax)
        let args = new Array()
        args.push(String(req.profile._id))
        args.push(String(tax))

        let response = await invoke.invokeTransaction("mychannel", "loan", "ApproveLoan", args, userName, userOrg, trasient);
        console.log("response ##############", response.result.txid);
        res.redirect('/admin/accepted_loans');
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}

exports.getComplaints = (req, res, next)=>{
    if(req.session.user.role === "admin"){
        const loan_id = String(req.profile._id)
        console.log(loan_id)
        Complaint.find({loan_id}, (err, comp)=>{
            if(err){
                res.status(400).json({
                    error: err
                })
            }
            if(comp){
                res.complaints = comp;
                console.log("complaints", res.complaints);
                next();
            }
        })
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}


exports.updateTax = (req, res)=>{
    if(req.session.user.role === "admin"){
    const {tax, _id} = req.body;
    Tax.updateOne({"_id": _id}, {$set: {"tax": tax}},(err, tax)=>{
        if(err){
            res.status(400).json({
                error: err
            })
        }
        if(tax){
            console.log(tax);
            res.redirect('/admin/tax');
        }
    })
    
    }else{
        return res.status(400).json({
            error:"not logged in"
        }) 
    }
}

exports.getTax = (req, res, next)=>{
    const query = Tax.find(); // `query` is an instance of `Query`
    query.setOptions({ lean : true });
    query.collection(Tax.collection);
    query.exec((err, tax)=>{
        if(err){
            res.status(400).json({
                error: err
            })
        }
        if(tax){
            console.log("tax", tax[0])
            res.tax = tax[0]
            res.percentage = tax[0].tax
            next();
        }
    })
}


exports.redeemLoan = async(req, res, next)=>{
    if(req.session.user.role === "admin"){
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
        let trasient = "";
        let args = new Array()
        args.push(String(req.profile._id))
        let response = await invoke.invokeTransaction("mychannel", "loan", "Redeem", args, userName, userOrg, trasient);
        console.log("response ##############", response.result.txid);
        res.redirect('/admin/active_loans');
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}


