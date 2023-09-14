// this to seed the data, this file has 
//nothing to do with express or web app

const mongoose = require('mongoose');
const { deleteMany } = require('./models/icecream');
const Icecream = require('./models/icecream');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/ic';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedproducts = [
    {
        owner: '62d294d224084c7e08d71e8f',
        title: "Havemore",
        pricel: "20",
        priceh: "55",
        description: "all types available",
        geometry:{
            type:"Point",
            coordinates:[72.3693,23.5880]
        },
        images: [
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658141751/coneaholic/coneaholicwebpage_um53lf.jpg',
                filename: 'coneaholic/tkl7wn1fdlaajyfukmpi',
            },
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658145682/coneaholic/cone3_f4proi.jpg',
                filename: 'coneaholic/wthyavhzszcnxld7776z',
            },
        ],
        location: "on modhera road"
    },
    {
        owner: '62d294d224084c7e08d71e8f',
        title: "Amul",
        pricel: "10",
        priceh: "110",
        description: "taste of india",
        geometry:{
            type:"Point",
            coordinates:[72.1210,23.8500]
        },
        images: [
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658162063/coneaholic/Screenshot_437_biiw4e.png',
                filename: 'coneaholic/tkl7wn1fdlaajyfukmpi',
            },
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658151078/coneaholic/hfailr4vvfaqswzadqf6.png',
                filename: 'coneaholic/wthyavhzszcnxld7776z',
            },
        ],
        location: "on dediyasan road"
    },
    {
        owner: '62d294d224084c7e08d71e8f',
        title: "Vadilal",
        pricel: "25",
        priceh: "65",
        description: "best icecream company",
        geometry:{
            type:"Point",
            coordinates:[86.4304,23.7957]
        },
        images: [
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658151076/coneaholic/tqis38c8fyngmpmkzl6l.png',
                filename: 'coneaholic/tkl7wn1fdlaajyfukmpi',
            },
            {
                url: 'hhttps://res.cloudinary.com/coneaholic/image/upload/v1658164016/coneaholic/coneaholicwebpage_um53lf.jpg',
                filename: 'coneaholic/wthyavhzszcnxld7776z',
            },
        ],
        location: "near amrut partyplot"
    },
    {
        owner: '62d294d224084c7e08d71e8f',
        title: "Madhur",
        pricel: "50",
        priceh: "355",
        description: "Serves ice cream in lassi!!",
        geometry:{
            type:"Point",
            coordinates:[88.3639,22.5726]
        },
        images: [
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658164857/coneaholic/cone2_guguy4.jpg',
                filename: 'coneaholic/tkl7wn1fdlaajyfukmpi',
            },
            {
                url: 'https://res.cloudinary.com/coneaholic/image/upload/v1658164857/coneaholic/cone1_ddwltp.jpg',
                filename: 'coneaholic/wthyavhzszcnxld7776z',
            },
        ],
        location: "Radhanpur cross circle"
    }
]

Icecream.insertMany(seedproducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })