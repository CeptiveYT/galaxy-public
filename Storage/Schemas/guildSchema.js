const mongoose = require("mongoose");
const cfg = require('../Botcfg.json');

const guildSchema = new mongoose.Schema({
    serverID: {type: String, require: true, unique: true},
    ownerID: {type: String, require: true},
    prefix: {type: String, require: true, default: cfg.PREFIX},
    logchannelID: {type: String, require: false},
    welcomechannelID: {type: String, require: false},
    ChannelArchivesID: String
}); 

const model = mongoose.model("guilds", guildSchema);

module.exports = model; 