export interface Votes {
    voteId : String
    userId: String,
    name: String,
    castedVote: String
}


export interface CastVoteProps {
    gameId: String,
    storyId: String,
    vote: String
}