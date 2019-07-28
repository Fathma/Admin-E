const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: Date, default: Date.now },
  branch: { type: String }
});
UserSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password); 
}

module.exports = mongoose.model("users", UserSchema,'admin');