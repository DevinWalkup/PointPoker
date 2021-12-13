import {voteSchema} from "./votes";
import {StoryType} from "../Types/StoryTypes";

const mongoose = require('mongoose')
const {Schema} = mongoose

const storySchema = new Schema({
    storyId: String,
    storyType: String,
    story: String,
    notes: String,
    as: String,
    like: String,
    so: String,
    votes: [voteSchema],
    storyPoint: String,
    votesVisible: {type: Boolean, default: false},
    url: String
})

export {storySchema}