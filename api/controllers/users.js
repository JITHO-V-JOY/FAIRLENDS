const helper = require('../utils/helper');
const invoke = require('../utils/invoke');
const Loan = require('../models/loans');
const Complaint = require('../models/complaints');
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

exports.issueLoan = async(req, res, next)=>{
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
                console.log("can't issue loan..error")
                res.render('loanError');
                }else if(loan){
                    console.log("loans",loan);
                    for(let i = 0; i < loan.length; i++){
                        args = String(loan[i]._id);
                        let response = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, userName, userOrg, trasient);
                        let result = JSON.parse(response.result.txid)
                        if(result.status !== 'Redeem'){
                            arr.push(result);
                        }
                    }

                    if(arr.length !== 0){
                         console.log("can't issue loan..")
                         res.render('loanError');
                    }else{
                        console.log("can issue loan..")
                        const loan = new Loan({borrower: req.session.user.adhar_id});
                        let arr = new Array();
                        loan.save((err, user)=>{
                            if(err){
                                return response(400).json({
                                    error: "NOT able to save user in DB"
                                })
                            }else if(user){
                                console.log(user);
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

                                console.log(req.session.user.role); 
                                req.userName = req.session.user.adhar_id;
                                req.userOrg = (req.session.user.role === "lender") ? "Org2": "Org1";
                                req.args = arr;
                                req.chaincodeName = "loan";
                                req.channelName = "mychannel";
                                req.fcn = "IssueLoan";
                        
                                next();
            
                        }
                      })
            
                  
                }

                }        
               
        });
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





exports.getActiveLoan = async (req, res, next)=>{
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
                        let result = JSON.parse(response.result.txid)
                        if(result.issuer === userName && result.status === "Active"){
                            res.loan = result;
                                 
                        }
                        
                    }
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

exports.getActiveLoansForLender = async (req, res, next)=>{
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
        const query = Loan.find({"lender": req.session.user.adhar_id}); // `query` is an instance of `Query`
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
                        if(result.lender === userName && result.status === "Active"){
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


exports.getLendsForLender = async (req, res, next)=>{
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
                        if(temp.lender === userName && temp.status !== "Active"){
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
        console.log("/////////////////////",req.profile);
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
            Loan.updateOne({"_id": args[1]}, {$set: {"lender": args[0]}}, (err, loan)=>{
                if(err){
                    return res.status(400).json({
                        error:"Failed to accept the loan"
                    })
                }
            })
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

exports.getLoan = async (req, res, next)=>{
    if(req.session.user){
        console.log(req.session.user);
        let userName = req.session.user.adhar_id;
        let userOrg = (req.session.user.role === "borrower") ? "Org1": (req.session.user.role === "admin")? "Org3": "Org2";
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

        let response = await invoke.invokeTransaction("mychannel", "fairlends", "QueryUser", res.loan.issuer,  userName, userOrg, trasient);
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

exports.getLender = async(req, res, next) =>{
    if(req.session.user){
        if(res.loan){
            if(res.loan.lender){ 
                console.log("loan", res.loan.lender )
                let userName = req.session.user.adhar_id;
                let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
                let trasient = "";

                let response = await invoke.invokeTransaction("mychannel", "fairlends", "QueryUser", res.loan.lender,  userName, userOrg, trasient);
                let temp  = JSON.parse(response.result.txid)   
                res.lender = temp;;
                console.log("response ##############", res.lender);
                next(); 
            }else{
                next();
            }

        }else{
            next();
        }      
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}

exports.complaint = (req, res, next)=>{
    const {loan_id, due_date} = req.body;
    console.log("hello", req.body);
    console.log("hello", req.body.loan_id);
    const issue_date = String(new Date());
    console.log("date", issue_date)
    const lender = req.session.user.adhar_id
    const status = 'pending'
    const complaint = new Complaint({loan_id, issue_date, lender, due_date, status});
    complaint.save((err, comp)=>{
        if(err){
            res.status(400).json({
                error: err
            })
        }
        if(comp){
            console.log(comp);
            res.redirect('/');
        }
    })

}

exports.getComplaints = (req, res, next)=>{
    if(req.session.user){
        const lender = req.session.user.adhar_id
        Complaint.find({lender}, (err, comp)=>{
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

exports.payEmi = async (req, res, next)=>{
    if(req.session.user){
                let args = new Array()

                args.push(String(req.body.loan_id));
                args.push(String(req.body.date));
                console.log(args)
                let userName = req.session.user.adhar_id;
                let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
                let trasient = "";

                let response = await invoke.invokeTransaction("mychannel", "loan", "PayEMI", args,  userName, userOrg, trasient);
                let temp  = JSON.parse(response.result.txid)   
                console.log("response ##############", temp);
                next(); 
        
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}

exports.payTax = async (req, res, next)=>{
    if(req.session.user){
                let args = new Array()
                args.push(String(req.body.loan_id));
                args.push(String(req.body.date));
                console.log("my body", args)
                let userName = req.session.user.adhar_id;
                let userOrg = (req.session.user.role == "borrower")? "Org1": (req.session.user.role == "admin")? "Org3": "Org2";
                let trasient = "";

                let response = await invoke.invokeTransaction("mychannel", "loan", "PayTax", args,  userName, userOrg, trasient);
                let temp  = JSON.parse(response.result.txid)   
                console.log("response ##############", temp);
                next(); 
        
    }else{
        return res.status(400).json({
            error:"not logged in"
        })
    }
}

