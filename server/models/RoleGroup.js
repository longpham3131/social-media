const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleGroupSchema = new Schema({
    roleName: {
        type: String,
        default: ""
    },
    privilege: [{
        type: Schema.Types.ObjectId,
        ref: "Privilege",
    }],
});
module.exports = mongoose.model("RoleGroup", RoleGroupSchema);
