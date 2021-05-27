import * as express from "express";
import {Logger} from "../logger/logger";
import {JoinGameUserProps, User} from "../Types/UserTypes";
import {UserService} from "../services/UserService";
import {GameService} from "../services/GameService";

class UserRoute {
    public express: express.Application
    private logger: Logger
    private userService: UserService

    constructor() {
        this.express = express();
        this.routes();
        this.logger = new Logger();
        this.userService = new UserService();
    }

    private routes(): void {
        this.express.get('/', (req, resp) => {
            this.logger.endpoint('/users/');

            if (!req.session.user){
                return resp.status(200).send({"user": null});
            }

            this.userService.GetUser(req.session.user.userId).then((user) => {
                if (!user) {
                    return resp.status(200).send({"user": null});
                }
                return resp.status(200).send({"user": user});
            });
        })

        this.express.post('/joinGame', (req, resp) => {
            this.logger.endpoint(`/users${req.url}`);

            let data: JoinGameUserProps = req.body;

            let erroredFields = [];

            if (!data.name) {
                erroredFields.push('Name');
            }

            if (!data.gameId) {
                return resp.status(400).send({"message": "The game was not found!"});
            }

            let user = this.userService.CreateJoinUser(data).then((ud) => {
                if (typeof ud === 'string') {
                    return resp.status(400).send({"message": ud});
                }

                let userObj = ud as User

                if (!req.session.user) {
                    req.session.user = userObj;
                    req.session.save();
                } else {
                    req.session.user = userObj;
                    req.session.save();
                }

                let gameService: GameService = new GameService();

                gameService.AddUser(data.gameId, userObj).then((g) => {
                    if (typeof g === 'string') {
                        return resp.status(400).send({"message": g});
                    }

                    return resp.status(200).send({"user": userObj, "game": g})
                })
            }).catch((err) => {
                this.logger.error(err);

                return resp.status(500).send({"message": err});
            })
        })
    }
}

export default new UserRoute().express;