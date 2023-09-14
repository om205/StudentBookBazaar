const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const Review= require('./review');

const imgschema = new Schema({
    url:String,
    filename:String
});

imgschema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});

const opts = {toJSON:{virtuals:true}}

const icecreamschema= new Schema({
    title: String,
    images: [imgschema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    pricel: Number,
    priceh:Number,
    description: String,
    location: String,
    owner:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

icecreamschema.virtual('properties.popuptext').get(function(){
    return `<strong><a class="btn btn-outline-dark" href="/icecreams/${this.id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`
});

icecreamschema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Review.remove({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Icecream',icecreamschema);
