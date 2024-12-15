const mongoose = require("mongoose");

const vacationInSeasonListenerSchema = mongoose.Schema({
    email:String,
    skus:[String]
});

const vacationInSeasonListenerModel = mongoose.model("VacationInSeasonListener",vacationInSeasonListenerSchema);

module.exports = vacationInSeasonListenerModel;