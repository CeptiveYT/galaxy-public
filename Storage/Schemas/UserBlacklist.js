const mongoose = require("mongoose"); 

const SoftBanSchema = new mongoose.Schema({
    Blacklist_ID: String, 
    Server_ID: String, 
    User_ID: String, 
    Username: String, 
    User_Tag: String,
    Reason: String,
    Date: String
}); 

const Blacklist = mongoose.model("Blacklisted_Users", SoftBanSchema);
module.exports = {
    Blacklist
}