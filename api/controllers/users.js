const helper = require('../utils/helper');
const invoke = require('../utils/invoke');
const Loan = require('../models/loans');
const { response } = require('express');

exports.register = async (req, res, next)=>{
    const userName = req.userName;
    const userOrg = req.userOrg;
    console.log(userName, userOrg);
    if(!userName){
        res.status(400).json({
            error:"user name is missing"
        })
    }
    if(!userOrg){
        res.status(400).json({
            error:"organization is missing"
        })
    }

    helper.getRegisteredUser(userName, userOrg, true).then((response)=>{
        console.log("error2",response);
        next();
    }).catch(e =>{
        res.json({
            success: false,
            message: e
        });
    })
    
}

exports.issueLoan = (req, res, next)=>{
    if(req.session.user){
        const loan = new Loan({borrower: req.session.user.adhar_id});
        let arr = new Array();
        let arg;
        loan.save((err, user)=>{
            if(err){
                return response(400).json({
                    error: "NOT able to save user in DB"
                })
            }else if(user){
                console.log(user);
                let emi = new Array();
                let tax = new Array();
                arr.push(JSON.stringify({
                      "loan_id": String(user._id),
                      "issuer":String(user.borrower),
                      "lender":"",
                      "amount":Number(req.body.amount),
                      "interest":Number(req.body.interest),
                      "tenure":Number(req.body.tenure),
                      "approved":Boolean(false),
                      "issued_date":String(new Date()),
                      "approved_date":"",
                      "end_date":"",
                      "emi":Array(),
                      "tax":Array(),
                      "status":"issued"
                    }))

                console.log(arr);

                console.log(req.body);

        
            }
        })

        console.log(req.session.user.role); 
        req.userName = req.session.user.adhar_id;
        req.userOrg = (req.session.user.role === "lender") ? "Org2": "Org1";
        req.args = arr;
        req.chaincodeName = "loan";
        req.channelName = "mychannel";
        req.fcn = "IssueLoan";

        next();
    }else{
        res.status(400).json({
            error: "error in session"
        });
    }
   
}


exports.invokeLoan = (req, res) => {
    console.log("*********************invoke function************************")
    const chaincodeName = req.chaincodeName;
    const channelName = req.channelName;
    const fcn = req.fcn;
    const args = req.args;
    const userName = req.userName;
    const userOrg = req.userOrg;
    const trasient = req.trasient;

    console.log("invoke loan");

   // const {fcn, args, trasient, userName, userOrg, chaincodeName, channelName} = req.body;
    if(!chaincodeName){
        res.status(400).json({
            error: "chain code name is missing"
        })
    }

    if(!channelName){
        res.status(400).json({
            error:"channel name is missing"
        })
    }
    if(!fcn){
        res.status(400).json({
            error:"function name is missing"
        })
    }
    if(!args){
        res.status(400).json({
            error:"arguments missing"
        })
    }

    invoke.invokeTransaction(channelName, chaincodeName, fcn, args, userName, userOrg, trasient).then((response)=>{
        
        console.log(response);
        res.redirect('/');
    }).catch((e)=>{
        console.log(e)
        res.status(400).json({
            success: false,
            message: e
        })
    })
}

exports.getLoans = async (req, res, next)=>{
    if(req.session.user){
        let chaincodeName = "loan";
        let channelName = "mychannel";
        let fcn = "GetLoanById";
        let args = new Array();
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1":"Org2";
        let trasient = "";

        let arr = new Array();
        let role  = (req.session.user.role == "borrower")? "borrower": "lender";
        const query = Loan.find({"borrower": req.session.user.adhar_id}); // `query` is an instance of `Query`
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
                        arr.push(JSON.parse(response.result.txid));
                        
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

exports.getLoansForLender = async (req, res, next)=>{
    if(req.session.user){
        let chaincodeName = "loan";
        let channelName = "mychannel";
        let fcn = "GetLoanById";
        let args = new Array();
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1":"Org2";
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




exports.acceptLoan = async (req, res)=>{
    if(req.session.user){
        console.log(req.profile);
        let channelName = "mychannel";
        let chaincodeName = "loan";
        let fcn = "AddLender";
        let args = new Array();
        args.push(req.session.user.adhar_id);
        args.push(String(req.profile._id));
       

        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role == "borrower")? "Org1":"Org2";
        let trasient = "";
        invoke.invokeTransaction(channelName, chaincodeName, fcn, args, userName, userOrg, trasient).then((response)=>{
        
            console.log(response);
            res.redirect('/');
        }).catch((e)=>{
            console.log(e)
            res.status(400).json({
                success: false,
                message: e
            })
        });

    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}



exports.invokeTransaction = (req, res) => {
    console.log("*********************invoke function************************")
    const chaincodeName = req.chaincodeName;
    const channelName = req.channelName;
    const fcn = req.fcn;
    const args = req.args;
    const userName = req.userName;
    const userOrg = req.userOrg;
    const trasient = req.trasient;

    console.log("invoke transaction...");

   // const {fcn, args, trasient, userName, userOrg, chaincodeName, channelName} = req.body;
    if(!chaincodeName){
        res.status(400).json({
            error: "chain code name is missing"
        })
    }

    if(!channelName){
        res.status(400).json({
            error:"channel name is missing"
        })
    }
    if(!fcn){
        res.status(400).json({
            error:"function name is missing"
        })
    }
    if(!args){
        res.status(400).json({
            error:"arguments missing"
        })
    }

    invoke.invokeTransaction(channelName, chaincodeName, fcn, args, userName, userOrg, trasient).then((response)=>{
        console.log("invoke transaction...2");
        console.log(response);
        res.render('users/login');
    }).catch((e)=>{
        console.log(e)
        res.status(400).json({
            success: false,
            message: e
        })
    })
}