require('dotenv').config({path: './.env'})
import {SocketSessionProps, UserSocketProps} from "./Types/SocketTypes";
import {Mongoose} from "./services/Mongoose";
import {Logger} from "./logger/logger";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as socketIo from 'socket.io';
import Routes from "./routes/routes";
import {createServer, Server} from 'http';
import {GameEvents, UserEvents} from "./Types/SocketEvents";
import {GameSocketType} from "./Types/GameTypes";
import {GameService} from "./services/GameService";
import {SocketService} from "./services/SocketService";
import Jobs from './jobs'

const cors = require('cors');

export class App {
    public static readonly PORT: number = 8080;
    private readonly _app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private logger: Logger
    private gameService: GameService
    private socketService: SocketService

    constructor() {
        this._app = express();
        this.logger = new Logger();
        this.middleware();
        this.configureCors();
        this.server = createServer(this._app);
        this.initializeDatabase();
        this.configureSession();
        this.initSocket();
        this.listen();
        this.routes();
        this.gameService = new GameService();
        this.socketService = new SocketService();
        this.startJobs();
    }

    get app(): express.Application {
        return this._app;
    }

    private configureCors(): void {
        this._app.use(cors({
            origin: function (origin: string, callback: any) {
                const allowedOriginParts = ["localhost", "point-poker-staging", "pointpoker"]
                // allow requests with no origin
                // (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                if (!allowedOriginParts.some(element => origin.includes(element))) {
                    let msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            credentials: true
        }));
    }

    private configureSession(): void {
        const session = require('express-session');
        const MongoStore = require('connect-mongo');

        let sessionOptions = {
            resave: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_URL,
                touchAfter: 24 * 3600
            }),
            secret: process.env.COOKIE_SECRET,
            cookie: {
                secure: true,
                httpOnly: false,
                sameSite: "none",
                maxAge: 5 * 24 * 60 * 60 * 1000 //5 days
            },
        };

        if (this._app.get('env') === 'development') {
            sessionOptions.cookie.secure = false;
            sessionOptions.cookie.httpOnly = true;
            sessionOptions.cookie.sameSite = "lax"
        }

        this._app.set('trust proxy', 1);

        this._app.use(session(sessionOptions));
    }

    // Configure Express middleware.
    private middleware(): void {
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: false}));
    }

    private routes(): void {

        this._app.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

        // user route
        this._app.use("/api", Routes);

        // handle undefined routes
        this._app.use("*", (req, res, next) => {
            res.status(404).send("Make sure url is correct!!!");
        });
    }

    private initSocket(): void {
        this.io = new socketIo.Server(this.server, {
            cors: {
                origin: function (origin: string, callback: any) {
                    const allowedOriginParts = ["localhost", "point-poker-staging", "pointpoker"]
                    // allow requests with no origin
                    // (like mobile apps or curl requests)
                    if (!origin) return callback(null, true);
                    if (!allowedOriginParts.some(element => origin.includes(element))) {
                        let msg = 'The CORS policy for this site does not ' +
                            'allow access from the specified Origin.';
                        return callback(new Error(msg), false);
                    }
                    return callback(null, true);
                },
                credentials: true
            }
        });
    }

    private listen(): void {
        this.server.listen(process.env.PORT, () => {
            this.logger.info(`Running server on port ${process.env.PORT}`);
        });

        this.io.on(GameEvents.CONNECT, (socket: any) => {
            this.logger.info(`Socket connected on port ${process.env.PORT}`);

            let socketData: SocketSessionProps = {
                userId: socket.request._query["userid"],
                gameId: socket.request._query["gameid"]
            };

            this.socketService.SetSocketSession(socketData);

            socket.on(GameEvents.GAME_UPDATE, (m: GameSocketType) => {
                this.logger.socket(`${GameEvents.GAME_UPDATE}`);
                this.io.emit(`client_update_game-${socketData.gameId}`);
            });

            socket.on(GameEvents.GAME_DELETE, (m: GameSocketType) => {
                this.logger.socket(`${GameEvents.GAME_DELETE}`);
                this.socketService.DeleteSocketSession(socketData).then(() => {
                    this.io.emit(`client_game_was_delete-${socketData.gameId}`)
                });
            })

            socket.on(GameEvents.DISCONNECT, () => {
                this.logger.socket(`${GameEvents.DISCONNECT}`);
                this.io.emit(`client_user_left_game-${socketData.gameId}`);
            });

            socket.on(GameEvents.LEAVE_GAME, () => {
                this.logger.socket(`${GameEvents.LEAVE_GAME}`);

                this.socketService.DeleteSocketSession(socketData).then(() => {
                    this.logger.info('Socket session has ended');
                });

                this.io.emit(`client_update_game-${socketData.gameId}`);
            });

            socket.on(GameEvents.USER_STATUS_UPDATE, (m: UserSocketProps) => {
                this.logger.socket(`${GameEvents.USER_STATUS_UPDATE}`);

                this.io.emit(`client_user_status_update-${socketData.gameId}`, m)
            });

            socket.on(GameEvents.USER_JOINED, (m: SocketSessionProps) => {
                this.logger.socket(`${GameEvents.USER_JOINED}`);

                this.io.emit(`client_user_joined-${socketData.gameId}`, {userId: m.userId});
            })

            socket.on(UserEvents.ROLE_CHANGE, (m: UserSocketProps) => {
                this.logger.socket(`${UserEvents.ROLE_CHANGE}`);
                this.io.emit(`client_user_role_change-${socketData.gameId}`, m)
            })

            socket.on(GameEvents.CREATE_STORY, () => {
                this.logger.socket(`${GameEvents.CREATE_STORY}`);

                this.io.emit(`client_story_was_added-${socketData.gameId}`);
            })
        });
    }

    private initializeDatabase(): void {
        Mongoose.InitializeConnection().then(() => {
            this.logger.info("Database connected!");
        });
    }

    private startJobs() : void {
        Jobs.startJobs();
    }
}
