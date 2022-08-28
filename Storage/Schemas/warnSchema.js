const mongoose = require("mongoose");

const warnSchema = new mongoose.Schema({
    warnID: { type: String, require: true },
    userID: { type: String, require: true },
    serverID: { type: String, require: true },
    moderatorID: { type: String, require: true },
    reason: { type: String, require: true },
    timestamp: { type: Number, require: true }
})

const warn = mongoose.model("user_warns", warnSchema);

module.exports = { warn }; 