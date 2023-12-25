const mongoose = require('mongoose');
const Campgrounds = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex : true,
    useUnifiedTopology : true
})

const db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error: "));
db.once('open', ()=>{
    console.log('Database connection successful!');
})

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDb = async ()=>{
    await Campgrounds.deleteMany({});
    // const c = new Campgrounds({title: 'Purple field'});
    // await c.save();
    
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const camps = new Campgrounds({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camps.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
});