var mongoose =require("mongoose");
var DataShema = new mongoose.Schema({
    username : String,
    adress : String,
    amount : String,
    phoneNumber: Number,
    rfid: String
    
});
 module.exports = mongoose.model("Details",DataShema);