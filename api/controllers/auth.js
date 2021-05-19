const User = require('../models/users');

exports.signup = (req, res)=>{
    const {adhar_id, name, role, password} = req.body;
    const user = new User({adhar_id, name, role, password}); // creating user object and populate with the request object..
    user.save((err, user)=>{
        if(err){
            return res.status(400).json({
                error: "NOT able to save user in DB"
            })
        }
        res.send(user);
    })


}