const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchasync = require('../utils/catchasync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchasync(async (req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registereduser = await User.register(user, password);
        req.login(registereduser,err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to the coneaolic!!!');
            res.redirect('/icecreams');
        });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back!!');
    const redirecturl = req.session.returnTo || '/icecreams';
    delete req.session.returnTo;
    res.redirect(redirecturl);
})

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('success','successfully logged out!!');
      res.redirect("/");
    });
  });

/*
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/icecreams');
})
*/

module.exports = router;