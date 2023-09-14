const Icecream =require('./models/icecream');
const { icecreamschema } = require('./schemas');
const exerror = require('./utils/exerror');
const {reviewschema} = require('./schemas.js');
const Review = require('./models/review');

module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','First Sign In!!')
        return res.redirect('/login');
    }
    next();
}

module.exports.validatestore =(req,res,next)=>{
    const {error} = icecreamschema.validate(req.body);
    if(error){
        const msg =error.details.map(el=>el.message).join(',')
        throw new exerror(msg,400)
    }
    else{
        next();
    }
}

module.exports.isowner = async (req,res,next) =>{
    const {id}= req.params;
    const ice =await Icecream.findById(id);
    if(!ice.owner.equals(req.user.id)){
        req.flash('error','You are not Owner of this store!!')
        return res.redirect(`/icecreams/${ice.id}`)
    }
    next();
}

module.exports.validatereview = (req,res,next) =>{
    const {error} = reviewschema.validate(req.body);
    console.log(error)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new exerror(msg,400)
    }
    else{
        next();
    }
}

module.exports.isreviewowner = async (req,res,next) =>{
    const {reviewId}= req.params;
    const {id} = req.params;
    const ice =await Icecream.findById(id);
    const review =await Review.findById(reviewId);
    if(!review.owner.equals(req.user.id)){
        req.flash('error','It is not your comment!!')
        return res.redirect(`/icecreams/${ice.id}`)
    }
    next();
}