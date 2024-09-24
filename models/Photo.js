const mongoose = require('mongoose');

// Schema'yı mongoose'dan al
const Schema = mongoose.Schema;

const PhotoSchema=new Schema({
    title:String,
    description:String,
    image:String,
    dateCreated:{
     type:Date,
     default:Date.now
    }
})

const Photo=mongoose.model("Photo",PhotoSchema)

module.exports=Photo