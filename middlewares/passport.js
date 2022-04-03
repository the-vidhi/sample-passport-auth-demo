const passport = require("passport");
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {secretKeys} = require('../config/index')

const USER = require("../models/user")

const jwtStrategyOpts = { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'secretKeys.jwt' };

passport.use('login',new localStrategy({usernameField: 'email',passwordField: 'password'},async (email, password, done) => {
    try{
        console.log("-------1---");
        let user = await USER.findOne({email: email}).populate({path: 'rolename', select: 'rolename'})
        if(!user){
            return done(null, false, {message: 'user not found'})
        }
        const validate = await user.isValidPassword(password);
        if(!validate){
            return done(null, false, {message: 'Invalid password'})
        }
        return done(null, user, {message: 'Logged in successfully'})
    }
    catch(err){
        console.log(err);
    }
}))

const authenticateJWTStrategy = async(jwtPayload, done) => {
    try{
        console.log("************ 01", jwtPayload.user);
        let user = await USER.findOne({_id: jwtPayload.user._id}).populate({path:'rolename', select:'rolename'});
        if (user) { return done(null, user); }
        else { return done('Invalid access token'); }    
    }
    catch(err){
        done(err)
    }
}

passport.use('authentication',new JWTStrategy(jwtStrategyOpts, authenticateJWTStrategy));
