const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  image: String,
  info: {
    lens:String,
    lensaf:String,
    creatdate:String,
    iso:String,
    shutterspeed:String,
    maxaperture:String,
    artist:String,
    imagesize:String,
    whitebalance:String,
    rating:String,
    color:String,
    camera:String,
  },
});

module.exports = mongoose.model("images", UserSchema);;
