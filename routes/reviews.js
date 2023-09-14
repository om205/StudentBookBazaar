const express = require('express');
const router = express.Router({mergeParams:true});
const catchasync = require('../utils/catchasync');
const Review = require('../models/review');
const Icecream =require('../models/icecream');
const {validatereview,isloggedin,isreviewowner} = require('../middleware');

router.post('/',validatereview,isloggedin,catchasync(async(req,res)=>{
    const icecream = await Icecream.findById(req.params.id);
    const review = new Review(req.body.review);
    icecream.reviews.push(review);
    review.owner = req.user.id;
    await review.save();
    await icecream.save();
    req.flash('success','Thank you for feed-back')
    res.redirect(`/icecreams/${icecream.id}`);
}))

router.delete('/:reviewId',isloggedin,isreviewowner,catchasync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Icecream.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','deleted your review')
    res.redirect(`/icecreams/${id}`);
}))

module.exports= router;