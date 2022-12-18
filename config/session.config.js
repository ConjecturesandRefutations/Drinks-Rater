// config/session.config.js

// require session
const session = require("express-session");

// ADDED: require mongostore
const MongoStore = require("connect-mongo");

// ADDED: require mongoose
const mongoose = require("mongoose");

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

const password = encodeURIComponent(process.env.MONGODB_PASSWORD) 
const MONGO_URI = `mongodb+srv://Conjectures:${password}@cluster0.n9h6bsz.mongodb.net/alcohol-rater-2?retryWrites=true&w=majority`;


  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 3600000 // 
      }, // ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
        ttl: 2 * 24 * 60 * 60,
      })
    })
  );
};
