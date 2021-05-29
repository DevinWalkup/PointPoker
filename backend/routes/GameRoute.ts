import * as express from "express";
import {Logger} from "../logger/logger";
import {CreateGameParams, Game, PointType} from "../Types/GameTypes";
import {GameService} from "../services/GameService";
import {RoleType, User} from "../Types/UserTypes";
import {
    CreateStoryProps, DeleteStoryProps,
    SetStoryPointProps,
    Story,
    ToggleStoryVotesVisibleProps,
    UpdateStoryProps
} from "../Types/StoryTypes";
import {CastVoteProps} from "../Types/VoteTypes";
import {UserService} from "../services/UserService";

class GameRoute {
    public express: express.Application;
    private logger: Logger;
    private gameService: GameService

    constructor() {
        this.express = express();
        this.routes();
        this.logger = new Logger();
        this.gameService = new GameService();
    }

    private routes(): void {
        this.express.post("/create", (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data = req.body;
            let params: CreateGameParams =
                {
                    userName: data.userName,
                    gameName: data.gameName,
                    gameDescription: data.gameDescription,
                    gameStories: data.gameStories,
                    // @ts-ignore
                    pointType: PointType[parseInt(data.pointType)],
                    autoShowVotes: data.autoShowVotes,
                    autoSwitchStory: data.autoSwitchStory
                }

            let erroredFields = []

            if (!params.userName) {
                erroredFields.push("Name");
            }

            if (!params.gameName) {
                erroredFields.push("Game Name");
            }

            if (params.pointType <= 0) {
                erroredFields.push("Estimate Type")
            }

            if (erroredFields.length > 0) {
                res.status(400)
                    .send({
                        "message": "There were errors.",
                        "fields": erroredFields
                    })
                return;
            }

            this.gameService.CreateGame(params).then((game: any) => {
                if (!req.session.user) {
                    let userService: UserService = new UserService();
                    userService.GetUserById(game.users[0].userId).then((user: User) => {
                        req.session.user = user;
                        req.session.save();
                    });
                }

                res.status(200)
                    .send({
                        "gameId": game.gameId,
                        "user": req.session.user
                    });
                return;
            }).catch((err) => {
                this.logger.error(err);

                res.status(400)
                    .send({
                        "message": err
                    })
                return;
            })

        });

        this.express.post('/addStory', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let user = req.session.user;

            if (!user) {
                res.status(401).send({"message": "You need to be signed in to add a story!"});
                return;
            }

            // @ts-ignore
            let role: RoleType = RoleType[user.roleType];

            if (role === RoleType.USER) {
                res.status(401).send({"message": "You are not authorized to add stories!"});
                return;
            }

            let data = req.body;

            let params: CreateStoryProps = {
                StoryType: data.StoryType,
                Story: data.Story,
                Notes: data.Notes,
                As: data.As,
                Like: data.Like,
                So: data.So,
                GameId: data.GameId
            };

            let erroredFields = []

            if (params.StoryType < 0) {
                erroredFields.push("Story Type");
            }

            if (!params.GameId) {
                erroredFields.push("Game Id");
            }

            if (erroredFields.length > 0) {
                res.status(400).send(
                    {
                        "message": "There were errors",
                        "fields": erroredFields
                    });

                return;
            }

            this.gameService.AddStory(params).then((game) => {
                res.status(200).send({"game": game});
                return;
            }).catch((err) => {
                res.status(500).send({"message": err});
                return;
            })
        })

        this.express.get('/getGame', (req, res) => {
            this.logger.endpoint(`/games${req.url}`)

            let gameId: String = req.query.gameId.toString();

            if (!gameId) {
                res.status(400).send({"message": "Game was not found!"});
                return;
            }

            this.gameService.GetGame(gameId).then((game) => {
                res.status(200).send({"game": game})
                return;
            }).catch((err) => {
                res.status(500).send({"message": err});
                return;
            })
        })

        this.express.delete('/', (req, res) => {
            this.logger.endpoint(`/games/delete`);

            let gameId = req.body.gameId;

            if (!gameId) {
                res.status(400).send({"message": "Game not found!"});
                return;
            }

            this.gameService.DeleteGame(gameId).then((success) => {
                res.status(success ? 200 : 400).send({"deleted": success})
                return;
            }).catch((err) => {
                res.status(500).send({"message": err});
                return;
            })
        })

        this.express.patch('/setCurrentStory', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data = req.body;

            if (!data.storyId) {
                return res.status(400).send({"message": "Story was not provided!"});
            }

            if (!data.gameId) {
                return res.status(400).send({"message": "GameId was not provided!"});
            }

            this.gameService.SetCurrentStory(data.storyId, data.gameId).then((resp: Game | String) => {
                if (typeof resp === 'string') {
                    return res.status(400).send({"message": resp});
                }

                return res.status(200).send({"game": resp});
            }).catch((err) => {
                return res.status(500).send({"message": err});
            })

        })

        /* Game Story Routes */

        this.express.patch('/story/vote', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data: CastVoteProps = req.body;

            if (!req.session.user) {
                return res.status(400).send({"message": "There was an error casting the vote!"})
            }

            this.gameService.AddVote(data, req.session.user).then((game: Game | String) => {

                if (typeof game === 'string') {
                    return res.status(400).send({"message": game});
                }

                return res.status(200).send({"game": game});
            }).catch((err) => {
                this.logger.error(err);
                return res.status(500).send({"message": err})
            })
        })

        this.express.patch('/story/setStoryPoint', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data: SetStoryPointProps = req.body;

            this.gameService.SetStoryValue(data).then((resp: Game | String) => {
                if (typeof resp === 'string') {
                    return res.status(400).send({"message": resp});
                }

                return res.status(200).send({"game": resp});
            }).catch((err) => {
                this.logger.error(err);
                return res.status(500).send({"message": err});
            })
        })

        this.express.patch('/story/toggleVotesVisible', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data: ToggleStoryVotesVisibleProps = req.body;

            this.gameService.ToggleStoryVotesVisible(data).then((resp: Game | String) => {
                if (typeof resp === 'string') {
                    return res.status(400).send({"message": resp});
                }

                return res.status(200).send({"game": resp});
            }).catch((err) => {
                this.logger.error(err);
                return res.status(500).send({"message": err});
            })
        })

        this.express.patch('/story', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data: UpdateStoryProps = req.body;

            this.gameService.UpdateStory(data).then((game: Game | String) => {

                if (typeof game === 'string') {
                    return res.status(400).send({"message": game});
                }

                return res.status(200).send({"game": game});
            }).catch((err) => {
                this.logger.error(err);
                return res.status(500).send({"message": err})
            })
        })

        this.express.delete('/story', (req, res) => {
            this.logger.endpoint(`/games${req.url}`);

            let data: DeleteStoryProps = req.body;

            this.gameService.DeleteStory(data).then((game: Game | String) => {
                if (typeof game === 'string') {
                    return res.status(400).send({"message": game});
                }

                return res.status(200).send({"game": game});
            }).catch((err) => {
                this.logger.error(err);
                return res.status(500).send({"message": err})
            })
        })
    }
}

export default new GameRoute().express;