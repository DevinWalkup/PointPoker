import {PointType} from "../Types/GameTypes";
import {storySchema} from "./story";

const mongoose = require('mongoose')
const {Schema} = mongoose


const gameSchema = new Schema({
    gameId: String,
    name: String,
    description: {type: String, default: null},
    stories: [storySchema],
    currentStoryId: String,
    users: [],
    pointType: {type: PointType, default: PointType.FIBONACCI},
    createdDate: { type: Date, default: Date.now },
    autoShowVotes: Boolean,
    autoSwitchStory: Boolean
})

mongoose.model('games', gameSchema);