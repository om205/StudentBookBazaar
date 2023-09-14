if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express= require('express');
const app= express();
const path =require('path');
const mongoose = require('mongoose');
const catchasync = require('./utils/catchasync');
const exerror = require('./utils/exerror');
const methodOverride = require('method-override')
const Icecream =require('./models/icecream');
const ejsMate = require('ejs-mate');
const joi =require('joi');
const Review = require('./models/review');
const {reviewschema} = require('./schemas.js');
const icecreams = require('./routes/icecreams');
const reviews = require('./routes/reviews');
const flash = require('connect-flash');
const passport = require('passport');
const localstrategy = require('passport-local');
const User = require('./models/users');
const usersroutes = require('./routes/users');

const session = require('express-session');
const MongoDBStore = require('connect-mongo');

//const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/ic'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
     useUnifiedTopology: true,
    //useFindAndModify: false,
});
const db= mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({extended:true}));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'second secret';

const store = new MongoDBStore({
    mongoUrl:dbUrl,
    secret,
    touchAfter:24*60*60,
})

store.on("error",function(e){
    console.log("session error",e);
})

const sessionconfig={
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
// make sure session is defined before passport
app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.query);
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeuser',async(req,res)=>{
    const user = new User({email:'arsh@gmail.com',username:'arsh'})
    const newuser = await User.register(user,'monkey')
    res.send(newuser);
})

app.use('/',usersroutes);
app.use('/icecreams',icecreams);
app.use('/icecreams/:id/reviews',reviews);

app.get('/',(req,res)=>{
    res.render('icecreams/home');
})

app.all('*',(req,res,next)=>{
    next(new exerror('page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500}=err;
    if(!err.message) err.message = 'oh no, something went wrong'
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`it is ${port}`);
})
