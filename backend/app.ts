

require('dotenv').config({path: '../client/.env.local'})
import {SocketSessionProps} from "./Types/SocketTypes";
import {Mongoose} from "./services/Mongoose";
import {Logger} from "./logger/logger";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as socketIo from 'socket.io';
import Routes from "./routes/routes";
import {createServer, Server} from 'http';
import {GameEvents} from "./Types/SocketEvents";
import {GameSocketType} from "./Types/GameTypes";
import {GameService} from "./services/GameService";
import {SocketService} from "./services/SocketService";

const cors = require('cors');

export class App {
    private readonly _app: express.Application;
    public static readonly PORT: number = 8080;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;
    private logger: Logger
    private gameService: GameService
    private socketService : SocketService

    constructor() {
        this._app = express();
        this.port = process.env.PORT || 3080;
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
    }

    get app(): express.Application {
        return this._app;
    }

    private configureCors(): void {
        const allowedOrigins = ['http://localhost:3000', 'http://example.com'];

        this._app.use(cors({
            origin: function (origin: string, callback: any) {
                // allow requests with no origin
                // (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
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
                secure: true
            },
        };

        if (this._app.get('env') === 'development') {
            sessionOptions.cookie.secure = false;
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
                origin: process.env.VITE_APP_URL,
                credentials: true
            }
        });
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            this.logger.info(`Running server on port ${this.port}`);
        });

        this.io.on(GameEvents.CONNECT, (socket: any) => {
            this.logger.info(`Socket connected on port ${this.port}`);

            let socketData: SocketSessionProps = {
                userId : socket.request._query["userid"],
                gameId: socket.request._query["gameid"]
            };

            this.socketService.SetSocketSession(socketData);

            socket.on(GameEvents.GAME_UPDATE, (m: GameSocketType) => {
                this.logger.info(`[server](message): ${JSON.stringify(m)}`);
                this.io.emit('client_update_game', m);
            });

            socket.on(GameEvents.GAME_DELETE, (m: GameSocketType) => {
                this.logger.info(`[server](message): ${JSON.stringify(m)}`);
                this.socketService.DeleteSocketSession(socketData);
                this.io.emit('client_game_was_delete', m)
            })

            socket.on(GameEvents.DISCONNECT, () => {
                this.logger.info('Socket disconnected');
            });

            socket.on(GameEvents.LEAVE_GAME, () => {
                this.socketService.DeleteSocketSession(socketData);
                this.logger.info('Socket disconnected');
            });
        });
    }

    private initializeDatabase(): void {
        Mongoose.InitializeConnection().then(() => {
            this.logger.info("Database connected!");
        });
    }
}