const mongoose = require("mongoose");

const GuildBlacklistSchema = new mongoose.Schema({
    Blacklist_ID: String,
    Guild_ID: String,
    Owner_ID: String,
    Reason: String,
    Date: String
});

const Blacklist = mongoose.model("guild_blacklists", GuildBlacklistSchema);
module.exports = { Blacklist }