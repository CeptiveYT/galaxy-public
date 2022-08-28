const mongoose = require("mongoose");

const ErrorSchema = new mongoose.Schema({
    ErrorID: String,
    Command: String,
    Date: String,
    Embed: {
        Color: String,
        Title: String,
        Description: String
    }
});

const Error = mongoose.model("Galaxy Errors", ErrorSchema);
module.exports = { Error };