const mongoose = require('mongoose')
const {Schema} = mongoose

const voteSchema = new Schema({
    voteId: String,
    userId: String,
    name: String,
    castedVote: String
})

export {voteSchema};
