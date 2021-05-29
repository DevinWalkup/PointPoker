import * as express from "express";
import {Logger} from "../logger/logger";
import {ChangeUserRoleProps, JoinGameUserProps, RoleType, User} from "../Types/UserTypes";
import {UserService} from "../services/UserService";
import {GameService} from "../services/GameService";
import {JoinGameProps} from "../Types/GameTypes";

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

            if (!req.session.user) {
                return resp.status(200).send({"user": null});
            }

            this.userService.GetUserById(req.session.user.userId).then((user) => {
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

            if (erroredFields.length > 0) {
                resp.status(400)
                    .send({
                        "message": "There were errors.",
                        "fields": erroredFields
                    })
                return;
            }

            let gameService: GameService = new GameService();

            gameService.HandleJoinGame(data).then((g) => {
                if (typeof g === 'string') {
                    return resp.status(400).send({"message": g})
                }

                let data = g as JoinGameProps;

                if (!req.session.user){
                    req.session.user = data.user;
                    req.session.save();
                }

                return resp.status(200).send({"user": data.user, "game": data.game});
            })
        })

        this.express.get('/getUser', (req, resp) => {
            let userId: String = req.query.userId.toString();

            if (!userId) {
                return resp.status(400).send({"message": "UserId was not provided!"});
            }

            this.userService.GetUserById(userId).then((user) => {
                if (!user) {
                    return resp.status(400).send({"message": "User was not found!"});
                }

                return resp.status(200).send({"user": user});
            })
        })

        this.express.patch('/updateUserRole', (req, resp) => {
            let data: ChangeUserRoleProps = req.body;

            if (!data.currentUserId) {
                return resp.status(400).send({"message": "The user was not supplied!"});
            }

            this.userService.GetUserById(data.currentUserId).then((user) => {
                if (user.roleType !== RoleType.ADMIN) {
                    return resp.status(401).send({"message": "Invalid permissions to perform action!"});
                }

                if (!data.userId) {
                    return resp.status(400).send({"message": "The user was not supplied!"});
                }

                if (!data.roleType) {
                    return resp.status(400).send({"message": "The new user role was not supplied!"});
                }

                this.userService.UpdateUserRole(data).then((res) => {
                    if (typeof res === 'string') {
                        return resp.status(500).send({"message": res});
                    }

                    return resp.status(200).send({"user": res});
                })
            })
        })
    }
}

export default new UserRoute().express;