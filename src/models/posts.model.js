//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Post model schema for ECL E-Commerce Forum

//  Library imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Sechema defination
const PostSchema = new Schema({
 user: { type: Schema.Types.ObjectId, ref: "Customer" },
 postCategory: { type: Schema.Types.ObjectId, ref: "PostCategory" },
 name: { type: String },
 text: { type: String, required: true },
 avatar: { type: String },
 imagePath: { type: Array, default: [] },
 image1: { type: String },
 image2: { type: String },
 image3: { type: String },
 likes: [
   {
     user: {
       type: Schema.Types.ObjectId,
       ref: "User"
     }
   }
 ],
 comments: [
   {
     user: {
       type: Schema.Types.ObjectId,
       ref: "User"
     },
     text: {
       type: String,
       required: true
     },
     name: {
       type: String
     },
     avatar: {
       type: String
     },
     createDate: {
       type: Date,
       default: Date.now
     }
   }
 ],
 status: { type: String },
 createDate: { type: Date, default: Date.now }
});

//Exporting model
module.exports = mongoose.model("Post", PostSchema, "posts")