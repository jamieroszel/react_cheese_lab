///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const {PORT = 3000, MONGODB_URL} = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");



///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
// Connection Events
mongoose.connection
    .on("open", ()=> console.log("You're connected to mongoose."))
    .on("close", ()=> console.log("You're disconnected to mongoose."))
    .on("error", ()=> console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const DogsSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const Dogs = mongoose.model("Dogs", DogsSchema)


///////////////////////////////
// MIDDLEWARE
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res)=>{
    res.send("Follow the white rabbit.");
});

// DOGS INDEX ROUTE
app.get("/dogs", async (req, res) => {
    try {
        // send all dogs
        res.json(await Dogs.find({}));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// DOGS CREATE ROUTE
app.post("/dogs", async (req, res) => {
    try {
        // send all the dogs
        res.json(await Dogs.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Dogs Update Route 
app.put("/dogs/:id", async (req, res) => {
    try {
        res.json(await Dogs.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error){
        res.status(400).json(error)
    }
})

// Dogs Delete Route
app.delete("/dogs/:id", async (req, res) => {
    try {
      res.json(await Dogs.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });
///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, ()=>console.log(`listening on Port: ${PORT}`));