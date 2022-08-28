const { default: mongoose } = require("mongoose");

const PartnerAppSchema = new mongoose.Schema({
    ApplicationID: String, 
    UserID: String,
    usertag: String,
    serverName: String, 
    serverLink: String, 
    partnerReason: String, 
    partnerNSFW: String
});

const StaffAppSchema = new mongoose.Schema({
    ApplicationID: String, 
    UserID: String, 
    usertag: String, 
    ModeratedBefore: String,
    Reason: String,
    Scenario_1: String,
    Scenario_2: String,
})

const StaffApplication = mongoose.model("staff-apps", StaffAppSchema); 
const PartnerApplication = mongoose.model("partner-apps", PartnerAppSchema); 

module.exports = {
    PartnerApplication, 
    StaffApplication
}