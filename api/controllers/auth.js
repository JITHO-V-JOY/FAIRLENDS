const User = require('../models/users');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');

exports.signup = (req, res, next)=>{
    const {adhar_id, name, role, password} = req.body;
    const user = new User({adhar_id, name, role, password}); // creating user object and populate with the request object..
    delete req.body.password;
    let arg = new Array(req.body);
    console.log(arg, req.body)
    user.save((err, user)=>{
        if(err){
            return res.status(400).json({
                error: "NOT able to save user in DB"
            })
        }
        
       
    });

    req.userName = req.body.adhar_id;
    req.userOrg = (role === "admin") ? "Org3": (role === "lender") ? "Org2": "Org1";
    req.args = arg;
    req.chaincodeName = "fairlends";
    req.channelName = "mychannel";
    req.fcn = "CreateUser";
    
    next();
}

exports.signin = (req, res)=>{
    const {adhar_id, password} = req.body;
    console.log(req.body);
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
                    req.session.loggedIn=true;
                    req.session.user=usr;
                    console.log(req.session.user);
                    res.redirect('/')
            
                    /*
                    const token = jwt.sign({_id: usr._id}, process.env.SECRET)
                    res.cookie("token", token, {expire: new Date() + 120});

                    return res.json({
                        token,
                        usr
                    });
                    */
                }else{
                    return res.status(400).json({
                        error:"invalid password!"
                    })
                }

            })
        }

    })
}

exports.signout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
            res.redirect('/');
        }
      });
}



exports.isSignedIn = (req, res, next)=>{

    let user = req.session.user;
    if(user){
        console.log(user);
        next();
    }else{
        return res.render('index'); // forbidden
    }

    /*
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next()
        console.log("hello");
    }else{
    res.render('index', { title: 'Fairlends' });
    //res.sendStatus(403); // forbidden
    }
    */
}

