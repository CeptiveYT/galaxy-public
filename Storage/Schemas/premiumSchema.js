const mongoose = require("mongoose"); 

const premiumGuild = new mongoose.Schema({
    ServerID: String,
    ServerName: String,
    OwnerID: String, 
    Permanent: Boolean, 
})

const premiumCodes = new mongoose.Schema({
    Code: String, 
    MaxUses: Number,
})

const PremiumGuild = mongoose.model("premium-guilds", premiumGuild);
const PremiumCode = mongoose.model("premium-codes", premiumCodes); 

module.exports = {
    PremiumGuild,
    PremiumCode
};