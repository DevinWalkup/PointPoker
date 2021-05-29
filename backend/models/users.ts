import {Schema} from "mongoose";
import {RoleType} from "../Types/UserTypes";
const mongoose = require('mongoose')

let userSchema = new Schema({
    userId: String,
    name: String,
    roleType: {type: RoleType, default: RoleType.USER},
    createdDate: { type: Date, default: Date.now }
})

mongoose.model('users', userSchema);