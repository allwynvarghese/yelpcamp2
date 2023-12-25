const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campgrounds = require('./models/campground');
const methodOveride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex : true,
    useUnifiedTopology : true
})

mongoose.connection.on("error", console.error.bind(console, 'connection error: '));
mongoose.connection.once("open", ()=>{
    console.log('Database connected!');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//middleware
app.use(express.urlencoded({extended: true}));
app.use(methodOveride('_method'));

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campgrounds.find({});
    res.render('campgrounds/campgrounds', { campgrounds });
})

app.post('/campgrounds', async(req,res)=>{
    const campground = new Campgrounds(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', async (req,res)=>{
    const campground =  await Campgrounds.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.put('/campgrounds/:id', async (req,res)=>{
    const { id } = req.params;
    const campground = await Campgrounds.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req,res)=>{
    const { id } = req.params;
    await Campgrounds.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const campground = await Campgrounds.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.listen('3000', ()=>{
    console.log('Love you 3000!');
})