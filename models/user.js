const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
  firstname:  String, 
  emailaddress: String,
  password:   String,
  document: Array

});
const Users = mongoose.model('Users', userSchema )
module.exports = Users