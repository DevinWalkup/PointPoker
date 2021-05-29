import {Schema} from "mongoose";
const mongoose = require('mongoose')

let socketSchema = new Schema({
    userId: String,
    socketId: String,
    gameId: String,
    createdDate: { type: Date, default: Date.now }
})

mongoose.model('sockets', socketSchema);