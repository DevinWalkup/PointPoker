import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "./logger/logger";
import Routes from "./routes/routes";
const cors = require('cors');

class App {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public users: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.users = [];
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        const allowedOrigins = ['http://localhost:3000',
            'http://example.com'];

        this.express.use(cors({
            origin: function(origin : string, callback: any) {
                // allow requests with no origin
                // (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    let msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            }
        }));
    }

    private routes(): void {

        this.express.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

        // user route
        this.express.use("/api", Routes);

        // handle undefined routes
        this.express.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().express;