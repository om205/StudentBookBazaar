const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const Icecream =require('../models/icecream');
const{isloggedin,isowner,validatestore}=require('../middleware');
const icecream = require('../models/icecream');
const multer = require('multer');
const {storage}= require('../cloudinary');
const upload = multer({storage});
const {cloudinary} = require("../cloudinary");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxgeocoding({accessToken: mapBoxToken});


router.get('/',catchasync(async (req,res)=>{
    const i = await Icecream.find({});
    res.render('icecreams/index',{i});
}))

router.get('/new',isloggedin,catchasync(async (req,res)=>{
    const i = await Icecream.find({});
    res.render('icecreams/new',{ i });
}))

router.post('/',upload.array('image'),isloggedin,validatestore,catchasync(async(req,res,next)=>{
    //,validatestore
    const geodata = await geocoder.forwardGeocode({
        query:req.body.icecream.location,
        limit:1
    }).send()
    
    const newice =new Icecream(req.body.icecream);
    newice.geometry = geodata.body.features[0].geometry;
    newice.images = req.files.map(f =>({url:f.path, filename:f.filename}));
    newice.owner = req.user.id;
    await newice.save();
    console.log(newice);
   req.flash('success','successfully uploaded a new store')
   req.flash('success','Thank you for using our web-site')
    res.redirect(`/icecreams/${newice.id}`);
}))

router.get('/:id',catchasync(async(req,res)=>{
    const {id} = req.params;
    const i = await Icecream.findById(id).populate({path:'reviews',populate:{path:'owner'}}).populate('owner');
    console.log(i);
    if(!i){
        req.flash('error','cannot find that store');
        return res.redirect('/');
    }
    res.render('icecreams/show',{ i });
}))

router.get('/:id/edit',isloggedin,isowner,catchasync(async(req,res)=>{
    const {id}=req.params;
    const i = await Icecream.findById(id);
    if(!i){
        req.flash('error','cannot find that store');
        return res.redirect('/');
    }
    res.render('icecreams/edit',{i});
}))

router.put('/:id',isloggedin,isowner,upload.array('image'),validatestore,catchasync(async(req,res)=>{
    //,validatestore
    const {id}= req.params;
    const i =await Icecream.findByIdAndUpdate(id, req.body.icecream, {runValidators: true, new:true});
    const imgs = req.files.map(f =>({url:f.path, filename:f.filename}));
    i.images.push(...imgs);
    await i.save();
    if(req.body.deleteimgs){
        for(let filename of req.body.deleteimgs){
            await cloudinary.uploader.destroy(filename);
        }
        await i.updateOne({$pull:{images:{filename:{$in:req.body.deleteimgs}}}})
    }
    req.flash('success','Successfully updated a store')
    res.redirect(`/icecreams/${i.id}`);
}))

router.delete('/:id',isloggedin,isowner,catchasync(async(req,res)=>{
    const {id} = req.params;
    await Icecream.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a store')
    res.redirect('/icecreams');
}))

module.exports = router;