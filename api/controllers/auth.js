const User = require('../models/users');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');

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

exports.signin = (req, res)=>{
    const {adhar_id, password} = req.body;
    User.findOne({adhar_id}, (err, usr)=>{
        if(err){
            return res.status(400).json({
                error: "error occured"
            })
        }
        if(!usr){
            return res.status(400).json({
                error: "User does not exists"
            });
        }
        else if(usr){
            usr.authenticate(password, (err, isMatch)=>{
                if(err){
                    console.log(err)
                    return res.status(400).json({
                        error:"invalid password!"
                    })
                }else if(isMatch){
                    //sigin, create token,  put token into the cookies.
                    const token = jwt.sign({_id: usr._id}, process.env.SECRET)
                    res.cookie("token", token, {expire: new Date() + 120});

                    return res.json({
                        token,
                        usr
                    });
                }

            })
        }

    })
}