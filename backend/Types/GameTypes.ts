import {Story} from "./StoryTypes";
import {User} from "./UserTypes";

export enum PointType {
    SCRUM,
    FIBONACCI,
    SEQUENTIAL,
    HOURLY,
    TSHIRT
}

export interface GameSocketType {
    gameId: String
}

export interface CreateGameParams {
    userName: String,
    gameName: String,
    gameDescription: String,
    gameStories: String,
    pointType: PointType,
    autoShowVotes: Boolean,
    autoSwitchStory: Boolean
}

export interface Game {
    gameId: String,
    name: String,
    description: String,
    stories: Array<Story>,
    currentStoryId: String,
    users: Array<User>,
    pointType: PointType,
    createdDate: Date
}

export interface JoinGameProps {
    game: any
    user: User
}
