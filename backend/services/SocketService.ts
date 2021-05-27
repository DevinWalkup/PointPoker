import {Logger} from "../logger/logger";
import {SocketSessionProps} from "../Types/SocketTypes";
import {User} from "../Types/UserTypes";
import {Votes} from "../Types/VoteTypes";
import {Story} from "../Types/StoryTypes";
const mongoose = require("mongoose");
const Socket = mongoose.model("sockets");
const Game = mongoose.model("games");

export class SocketService {
    private logger: Logger

    constructor() {
        this.logger = new Logger();
    }

    public async SetSocketSession(data : SocketSessionProps) : Promise<boolean> {
        if (!data.gameId || !data.userId) {
            this.logger.error(`Couldn't create socket session. Provided data: ${data}`);
            return;
        }

        let socket = await Socket.findOne({gameId: data.gameId, userId: data.userId});

        if (socket) {
            return true;
        }

        await new Socket({
            userId: data.userId,
            gameId: data.gameId,
        }).save();

        return true;
    }

    public async DeleteSocketSession(data: SocketSessionProps) : Promise<boolean>{
        let socket = await Socket.findOne({gameId: data.gameId, userId: data.userId});

        if (!socket) {
            return;
        }

        let game = await Game.findOne({gameId: socket.gameId});

        if (!game) {
            await socket.delete();
            return;
        }

        console.log(socket.userId, game.users.filter((user : String) => {return user !== socket.userId}));

        game.users = game.users.filter((user : String) => {return user !== socket.userId});

        console.log(game.users);

        this.UpdateGameStories(socket, game);

        await game.save();

        await socket.delete();

        return true;
    }

    private UpdateGameStories(socket : any, game: any) : void {
        let stories : Array<Story> = [];

        game.stories.forEach((story: Story) => {
            let localStory = story;
            let votes : Array<Votes> = [];

            story.votes.forEach((vote: Votes) => {
                if (vote.userId === socket.userId) {
                    return;
                }

                votes.push(vote);
            })

            localStory.votes = votes;

            stories.push(localStory);
        })

        game.stories = stories;
    }
}