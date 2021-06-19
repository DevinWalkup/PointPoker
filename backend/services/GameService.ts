import {CreateGameParams, Game, JoinGameProps,} from "../Types/GameTypes";
import {UserService} from "./UserService";
import {CreateUserProps, JoinGameUserProps, RoleType, User} from "../Types/UserTypes";
import {Logger} from "../logger/logger";
import {CastVoteProps, Votes} from "../Types/VoteTypes";
import {
    CreateStoryProps,
    DeleteStoryProps,
    SetStoryPointProps,
    Story,
    StoryType,
    ToggleStoryVotesVisibleProps,
    UpdateStoryProps
} from "../Types/StoryTypes";

const mongoose = require("mongoose");
const {v4: uuidv4} = require('uuid');

const Game = mongoose.model("games");

export class GameService {
    private logger: Logger

    constructor() {
        this.logger = new Logger()
    }

    public async CreateGame(data: CreateGameParams): Promise<Game> {
        let userData: CreateUserProps = {
            name: data.userName,
            roleType: RoleType.ADMIN
        };

        let userService: UserService = new UserService();

        let user = await userService.CreateAdminUser(userData).catch((err) => {
            throw new Error(err);
        })

        let users: Array<any> = new Array<any>();

        users.push({userId: user.userId.toString(), name: user.name});

        let game = await Game.create({
            gameId: uuidv4(),
            name: data.gameName,
            users,
            description: data.gameDescription,
            pointType: data.pointType,
            autoShowVotes: data.autoShowVotes ? data.autoShowVotes : false,
            autoSwitchStory: data.autoSwitchStory ? data.autoSwitchStory : false
        })

        await game.save();

        if (data.gameStories) {

            let stories = data.gameStories.split(';');
            console.log("Game has stories", stories);
            for (const idx in stories) {
                let newStory: CreateStoryProps = {
                    StoryType: 0,
                    Story: stories[idx].trim(),
                    Notes: '',
                    As: '',
                    Like: '',
                    So: '',
                    GameId: game.gameId
                };

                game = await this.AddStory(newStory);
            }
        }

        return game;
    }

    public async AddStory(data: CreateStoryProps): Promise<Game | String> {
        let story: any

        if (data.StoryType === StoryType.Structured) {
            story = {
                storyId: uuidv4(),
                storyType: data.StoryType,
                notes: data.Notes,
                as: data.As,
                like: data.Like,
                so: data.So
            }
        } else {
            story = {
                storyId: uuidv4(),
                storyType: data.StoryType,
                story: data.Story,
                notes: data.Notes
            }
        }

        let game = await Game.findOne({"gameId": data.GameId});

        if (!game) {
            return "Game not found!";
        }

        game.stories.push(story);

        if (!game.currentStoryId) {
            game.currentStoryId = story.storyId;
        }


        await game.save();

        return game;
    }

    public async GetGame(gameId: String): Promise<Game> {
        let game: Game = await Game.findOne({gameId: gameId});

        if (!game) {
            throw new Error("Game not found!");
        }

        return game;
    }

    public async DeleteGame(gameId: String): Promise<boolean> {
        let game = await Game.findOne({gameId: gameId});

        if (game) {
            let idk = Game.deleteOne(game, function (err: any, result: any) {
                return !err;
            })
        }

        return true;
    }

    public async AddVote(data: CastVoteProps, user: User): Promise<Game | String> {
        let game = await Game.findOne({"gameId": data.gameId});

        if (!game) {
            return "Game was not found";
        }

        if (game.stories.length <= 0) {
            return "There were no stories found for the game!";
        }

        let story = game.stories.filter((s: Story) => {
            return s.storyId === data.storyId
        })[0];

        if (!story) {
            return "There was an error getting the story";
        }

        let vote: Votes = {
            voteId: uuidv4(),
            userId: user.userId,
            name: user.name,
            castedVote: data.vote
        };

        if (story.votes.length > 0 && story.votes.some((vote: Votes) => {
            return vote.userId === user.userId
        })) {
            let existingVote = story.votes.filter((v: Votes) => {
                return v.userId === user.userId
            })[0]

            if (existingVote) {
                existingVote.castedVote = vote.castedVote;
            }
        } else {
            story.votes.push(vote);
        }

        await game.save();

        return game;
    }

    public async SetCurrentStory(storyId: String, gameId: String): Promise<Game | String> {
        let game = await Game.findOne({"gameId": gameId});

        if (!game) {
            return 'Game not found!';
        }

        console.log(storyId);

        game.currentStoryId = storyId;

        await game.save();

        return game;
    }

    public async SetStoryValue(data: SetStoryPointProps): Promise<Game | String> {
        let game = await Game.findOne({"gameId": data.gameId});

        if (!game) {
            return "Game was not found";
        }

        if (game.stories.length <= 0) {
            return "There are no stories for the game!";
        }

        let story = game.stories.filter((story: Story) => {
            return story.storyId === game.currentStoryId
        })[0];

        if (!story) {
            return "The story was not found!";
        }

        story.storyPoint = data.storyPoint;

        await game.save();

        return game;
    }

    public async ToggleStoryVotesVisible(data: ToggleStoryVotesVisibleProps): Promise<Game | String> {
        let game = await Game.findOne({"gameId": data.gameId});

        if (!game) {
            return "Game was not found";
        }

        if (game.stories.length <= 0) {
            return "There are no stories for the game!";
        }

        let story = game.stories.filter((story: Story) => {
            return story.storyId === game.currentStoryId
        })[0];

        if (!story) {
            return "The story was not found!";
        }

        story.votesVisible = !story.votesVisible;

        await game.save();

        return game;
    }

    public async UpdateStory(data: UpdateStoryProps): Promise<Game | String> {
        let game = await Game.findOne({"gameId": data.gameId});

        if (!game) {
            return "Game was not found";
        }

        if (game.stories.length <= 0) {
            return "There are no stories for the game!";
        }

        let story = game.stories.filter((story: Story) => {
            return story.storyId === data.storyId
        })[0];

        story.notes = data.notes;
        story.story = data.story;
        story.as = data.as;
        story.like = data.like;
        story.so = data.so;


        await game.save();

        return game;
    }

    public async DeleteStory(data: DeleteStoryProps): Promise<Game | String> {
        let game = await Game.findOne({"gameId": data.gameId});

        if (!game) {
            return "Game was not found";
        }

        if (game.stories.length <= 0) {
            return "There are no stories for the game!";
        }

        let stories: Array<Story> = []

        game.stories.forEach((story: Story) => {
            if (story.storyId !== data.storyId) {
                stories.push(story);
            }
        });

        let previousStory = stories[stories.length - 1];

        game.currentStoryId = previousStory ? previousStory.storyId : null;

        game.stories = stories;

        await game.save();

        return game;
    }

    public async UserInGame(gameId: String, user: User): Promise<boolean | String> {
        let game = await Game.findOne({"gameId": gameId});

        if (!game) {
            return "Game not found";
        }

        return !!game.users.some((gameUser: any) => {
            return gameUser.userId === user.userId
        });
    }

    public async AddUser(gameId: String, user: User): Promise<Game | String> {
        let game = await Game.findOne({"gameId": gameId});

        if (!game) {
            return "Game not found";
        }

        game.users.push({userId: user.userId, name: user.name});

        game.save();

        return game;
    }

    public async HandleJoinGame(data: JoinGameUserProps): Promise<JoinGameProps | String> {
        let userService = new UserService();

        let user = await userService.GetUserByName(data.name);

        if (!user) {
            return await this.CreateJoinUserAndAddToGame(data, userService);
        }

        let userInGame = await this.UserInGame(data.gameId, user);

        if (typeof userInGame === 'string') {
            return userInGame;
        }

        let game = await this.GetGame(data.gameId);

        if (userInGame) {
            return {user: user, game: game};
        }

        return await this.CreateJoinUserAndAddToGame(data, userService);
    }

    private async CreateJoinUserAndAddToGame(data: JoinGameUserProps, userService: UserService): Promise<JoinGameProps | String> {
        let user = await userService.CreateJoinUser(data);

        if (typeof user === 'string') {
            return user;
        }

        let userObj = user

        let gameObj = this.AddUser(data.gameId, userObj);

        if (typeof gameObj === 'string') {
            return gameObj;
        }

        return {user: userObj, game: gameObj};
    }

    public async GetAll() : Promise<Array<Game>> {
        return Game.find();
    }
}