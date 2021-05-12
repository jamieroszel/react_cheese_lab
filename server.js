//////////////////////
// DEPENDENCIES
//////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from env
const {PORT = 4000, MONGODB_URL} = process.env;
// import express
const express = require('express');
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");

//////////////////////
// DATABASE CONNECTION
//////////////////////
// Establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
// Connection Events
mongoose.connection
    .on("open", ()=> console.log("You're connected to mongoose."))
    .on("close", ()=> console.log("You're disconnected to mongoose."))
    .on("error", ()=> console.log(error));
//////////////////////
// MODELS
//////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

//////////////////////
// Middleware
//////////////////////
app.use(cors()); 
app.use(morgan("dev"))
app.use(express.json())
//////////////////////
// ROUTES
//////////////////////
// create a test route
app.get("/", (req, res) =>{
    res.send("I'm your huckleberry.");
});

// Index Route
app.get("/cheese", async (req, res)=> {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error)
    }
})

// Create Route
app.post("/cheese", async (req, res)=> {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error)
    }
})

// Edit Route
app.put("/cheese/:id", async (req, res) =>{
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json(error)
    }
})

// Delete Route
app.delete("/cheese/:id", async (req, res) =>{
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

//////////////////////
// LISTENER
//////////////////////
app.listen(PORT, ()=>console.log(`listening on Port ${PORT}`));