var dotenv = require('dotenv');
dotenv.config();
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const userRouter = require("../Assignment-8/routes/userRoute")

const uri = "mongodb+srv://" + process.env.DB_USERNAME  + ":" + process.env.DB_PASSWORD + "@cluster0.iujgold.mongodb.net/?retryWrites=true&w=majority";

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }
    catch(error){
        console.log(error);
    }
}

connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user',userRouter);

app.listen(3000,()=>{
    console.log("Server running");
})
