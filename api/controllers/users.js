const helper = require('../utils/helper');
const invoke = require('../utils/invoke');

exports.register = async (req, res)=>{
    const {userName, userOrg} = req.body;
    console.log(userName, userOrg);
    if(!userName){
        res.status(400).json({
            error:"user name is missing"
        })
    }
    if(!userOrg){
        res.status(400).json({
            error:"orgization is missing"
        })
    }

    helper.getRegisteredUser(userName, userOrg, true).then((response)=>{
        res.json(response);
    }).catch(e =>{
        res.json({
            success: false,
            message: e
        });
    })
    
}

exports.invokeTransaction = (req, res) => {
    console.log("*********************inoke function************************")
    const chaincodeName = req.params.chaincodeName;
    const channelName = req.params.channelName;
    const {fcn, args, trasient, userName, userOrg} = req.body;
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
        res.send(response);
        console.log(response);
    }).catch((e)=>{
        console.log(e)
        res.status(400).json({
            success: false,
            message: e
        })
    })
}