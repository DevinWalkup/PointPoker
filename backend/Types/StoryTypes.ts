import {Votes} from "./VoteTypes";

export enum StoryType {
    FreeForm,
    Structured
}

export interface Story {
    storyId: String,
    storyType: StoryType,
    story: String | undefined | null,
    notes: String | undefined | null,
    as: String | undefined | null,
    like: String | undefined | null,
    so: String | undefined | null,
    votes: Array<Votes>,
    storyPoint: String | undefined | null,
    votesVisible: Boolean
}

export interface UpdateStoryProps {
    gameId: String
    storyId: String,
    storyType: StoryType,
    story: String | undefined | null,
    notes: String | undefined | null,
    as: String | undefined | null,
    like: String | undefined | null,
    so: String | undefined | null,
    votes: Array<Votes>,
    storyPoint: String | undefined | null,
    votesVisible: Boolean
}

export interface CreateStoryProps {
    StoryType: number,
    Story: String,
    Notes: String,
    As: String,
    Like: String,
    So: String,
    GameId: String
}

export interface SetStoryPointProps {
    gameId: String,
    storyPoint: String
}

export interface ToggleStoryVotesVisibleProps {
    gameId: String
}

export interface DeleteStoryProps {
    gameId: String,
    storyId: String
}