const helper = require('../utils/helper');

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