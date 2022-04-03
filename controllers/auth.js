const passport = require('passport');
const USER = require('../models/user');
const ROLE = require('../models/role');
const jwt = require('jsonwebtoken');
require("../middlewares/passport")

exports.login = async (req, res, next) => {
    passport.authenticate('login', async(err, user, info)=> {
        console.log("--------2---------");
        try{
            if(err || !user){
                return res.status(422).json({status: false, message: "Invalid emial or password!!!"})
            }
            req.login(user, async(err) => {
                if(err){
                    return next(err)
                }
                const getRole = await ROLE.findById(user.rolename);
                const body = { _id: user._id, email: user.email, rolename: user.rolename };
                const token = jwt.sign({user: body}, 'secretKeys.jwt');
                user = body;
                return res.json({token: token, user: body, route: "user/index"})
            })
        }
        catch(error){
            console.log(error);
            return next(error);
        }
    })
}

exports.signup = async(req,res)=>{
    console.log('signup Post controller');
    try{
        const payload = req.body;        
        const getEmail = await USER.findOne({ email: payload.email});
        if(getEmail){
            return res.status(409).json({status: false, message: "User already Exists!!!"});
        }         
        let user = await USER.create(req.body);
        res.status(200).json({status: true, message: "Signup done successfully."});
        }
    catch(err) { console.log(err);}
}