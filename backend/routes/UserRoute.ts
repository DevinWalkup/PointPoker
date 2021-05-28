import * as express from "express";
import {Logger} from "../logger/logger";
import {ChangeUserRoleProps, JoinGameUserProps, RoleType, User} from "../Types/UserTypes";
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

            if (erroredFields.length > 0) {
                resp.status(400)
                    .send({
                        "message": "There were errors.",
                        "fields": erroredFields
                    })
                return;
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

        this.express.get('/getUser', (req, resp) => {
            let userId : String = req.query.userId.toString();

            if (!userId) {
                return resp.status(400).send({"message" : "UserId was not provided!"});
            }

            this.userService.GetUser(userId).then((user) => {
                if (!user) {
                    return resp.status(400).send({"message" : "User was not found!"});
                }

                return resp.status(200).send({"user" : user});
            })
        })

        this.express.patch('/updateUserRole', (req, resp) => {
            let data : ChangeUserRoleProps = req.body;

            if (!data.currentUserId) {
                return resp.status(400).send({"message": "The user was not supplied!"});
            }

            this.userService.GetUser(data.currentUserId).then((user) => {
                if (user.roleType !== RoleType.ADMIN){
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