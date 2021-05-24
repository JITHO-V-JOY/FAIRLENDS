const helper = require('../utils/helper');
const invoke = require('../utils/invoke');

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
        next();
    }).catch(e =>{
        res.json({
            success: false,
            message: e
        });
    })
    
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

    console.log(req.userName);

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
        res.render('users/login');
    }).catch((e)=>{
        console.log(e)
        res.status(400).json({
            success: false,
            message: e
        })
    })
}